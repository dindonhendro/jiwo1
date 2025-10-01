import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { User, UserCircle, Heart } from "lucide-react";
import UserProfile from "./user-profile";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-[#756657]/20 bg-[#f7f7f7] dark:bg-[#1b1918] py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          prefetch
          className="text-xl font-bold text-[#756657] flex items-center"
        >
          <Heart className="w-6 h-6 mr-2" />
          Jiwo.AI
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-[#161413] dark:text-[#eeedec] hover:text-[#756657] transition-colors"
              >
                <Button className="bg-[#756657] hover:bg-[#756657]/90 text-white">Dashboard</Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-[#161413] dark:text-[#eeedec] hover:text-[#756657] transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-[#756657] rounded-md hover:bg-[#756657]/90 transition-colors"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}