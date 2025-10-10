"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || '';
  const nickname = formData.get("nickname")?.toString() || '';
  const education = formData.get("education")?.toString() || '';
  const gender = formData.get("gender")?.toString() || '';
  const age = formData.get("age")?.toString() || '';
  const role = formData.get("role")?.toString() || 'user';
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  if (!gender || !age || !nickname || !education) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Semua field wajib diisi untuk analisis kesehatan mental yang akurat",
    );
  }

  // Create auth user without metadata to avoid trigger issues
  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/welcome`
    },
  });

  console.log("After signUp", error);

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      // Use service role client for database operations
      const serviceSupabase = createServiceClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
      );
      
      const { error: insertError } = await serviceSupabase
        .from('users')
        .insert({
          id: user.id,
          name: fullName || nickname || 'User',
          nickname: nickname || 'User',
          email: email,
          gender: gender || '',
          age: parseInt(age) || 0,
          education: education || '',
          role: role || 'user',
          token_identifier: email || ''
        });

      if (insertError) {
        console.error('Error creating user profile:', insertError);
      } else {
        console.log('User profile created successfully with role:', role);
      }

      // If role is professional, add to professionals table
      if (role !== 'user') {
        const { error: profError } = await serviceSupabase
          .from('professionals')
          .insert({
            id: user.id,
            name: nickname || 'Professional',
            full_name: fullName || nickname || 'Professional',
            email: email,
            specialization: null,
            is_available: true
          });

        if (profError) {
          console.error('Error creating professional profile:', profError);
        } else {
          console.log('Professional profile created successfully');
        }
      }
    } catch (err) {
      console.error('Error in profile creation:', err);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};