import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface LoginProps {
  searchParams: Promise<Message>;
}

export default async function SignInPage({ searchParams }: LoginProps) {
  const message = await searchParams;

  if ("message" in message) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f7f7] dark:bg-[#1b1918] px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-[#756657]/20 bg-white dark:bg-[#302d2a] p-6 shadow-sm">
          <form className="flex flex-col space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-[#161413] dark:text-[#eeedec]">Masuk</h1>
              <p className="text-sm text-[#7a736c] dark:text-[#a19991]">
                Belum punya akun?{" "}
                <Link
                  className="text-[#756657] font-medium hover:underline transition-all"
                  href="/sign-up"
                >
                  Daftar
                </Link>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#161413] dark:text-[#eeedec]">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="anda@contoh.com"
                  required
                  className="w-full bg-[#f7f7f7] dark:bg-[#1b1918] border-[#756657]/20 text-[#161413] dark:text-[#eeedec] placeholder-[#7a736c] dark:placeholder-[#a19991] focus:ring-[#756657] focus:border-[#756657]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium text-[#161413] dark:text-[#eeedec]">
                    Kata Sandi
                  </Label>
                  <Link
                    className="text-xs text-[#7a736c] dark:text-[#a19991] hover:text-[#756657] hover:underline transition-all"
                    href="/forgot-password"
                  >
                    Lupa Kata Sandi?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Kata sandi Anda"
                  required
                  className="w-full bg-[#f7f7f7] dark:bg-[#1b1918] border-[#756657]/20 text-[#161413] dark:text-[#eeedec] placeholder-[#7a736c] dark:placeholder-[#a19991] focus:ring-[#756657] focus:border-[#756657]"
                />
              </div>
            </div>

            <SubmitButton
              className="w-full bg-[#756657] hover:bg-[#756657]/90 text-white"
              pendingText="Sedang masuk..."
              formAction={signInAction}
            >
              Masuk
            </SubmitButton>

            <FormMessage message={message} />
          </form>
        </div>
      </div>
    </>
  );
}