import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { signUpAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { UrlProvider } from "@/components/url-provider";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f7f7] dark:bg-[#1b1918] px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-[#756657]/20 bg-white dark:bg-[#302d2a] p-6 shadow-sm">
          <UrlProvider>
            <form className="flex flex-col space-y-6" action={signUpAction}>
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-semibold tracking-tight text-[#161413] dark:text-[#eeedec]">Daftar</h1>
                <p className="text-sm text-[#7a736c] dark:text-[#a19991]">
                  Sudah punya akun?{" "}
                  <Link
                    className="text-[#756657] font-medium hover:underline transition-all"
                    href="/sign-in"
                  >
                    Masuk
                  </Link>
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-sm font-medium text-[#161413] dark:text-[#eeedec]">
                    Nama Panggilan
                  </Label>
                  <Input
                    id="nickname"
                    name="nickname"
                    type="text"
                    placeholder="John"
                    required
                    className="w-full bg-[#f7f7f7] dark:bg-[#1b1918] border-[#756657]/20 text-[#161413] dark:text-[#eeedec] placeholder-[#7a736c] dark:placeholder-[#a19991] focus:ring-[#756657] focus:border-[#756657]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education" className="text-sm font-medium text-[#161413] dark:text-[#eeedec]">
                    Pendidikan Terakhir
                  </Label>
                  <select
                    id="education"
                    name="education"
                    required
                    className="w-full bg-[#f7f7f7] dark:bg-[#1b1918] border border-[#756657]/20 text-[#161413] dark:text-[#eeedec] rounded-md px-3 py-2 focus:ring-[#756657] focus:border-[#756657]"
                  >
                    <option value="">Pilih Pendidikan</option>
                    <option value="SD">SD/Sederajat</option>
                    <option value="SMP">SMP/Sederajat</option>
                    <option value="SMA">SMA/SMK/Sederajat</option>
                    <option value="D3">Diploma 3</option>
                    <option value="S1">Sarjana (S1)</option>
                    <option value="S2">Magister (S2)</option>
                    <option value="S3">Doktor (S3)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium text-[#161413] dark:text-[#eeedec]">
                      Jenis Kelamin
                    </Label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      className="w-full bg-[#f7f7f7] dark:bg-[#1b1918] border border-[#756657]/20 text-[#161413] dark:text-[#eeedec] rounded-md px-3 py-2 focus:ring-[#756657] focus:border-[#756657]"
                    >
                      <option value="">Pilih</option>
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium text-[#161413] dark:text-[#eeedec]">
                      Usia
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      min="13"
                      max="120"
                      placeholder="25"
                      required
                      className="w-full bg-[#f7f7f7] dark:bg-[#1b1918] border-[#756657]/20 text-[#161413] dark:text-[#eeedec] placeholder-[#7a736c] dark:placeholder-[#a19991] focus:ring-[#756657] focus:border-[#756657]"
                    />
                  </div>
                </div>

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
                  <Label htmlFor="password" className="text-sm font-medium text-[#161413] dark:text-[#eeedec]">
                    Kata Sandi
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Kata sandi Anda"
                    minLength={6}
                    required
                    className="w-full bg-[#f7f7f7] dark:bg-[#1b1918] border-[#756657]/20 text-[#161413] dark:text-[#eeedec] placeholder-[#7a736c] dark:placeholder-[#a19991] focus:ring-[#756657] focus:border-[#756657]"
                  />
                </div>
              </div>

              <SubmitButton
                pendingText="Sedang mendaftar..."
                className="w-full bg-[#756657] hover:bg-[#756657]/90 text-white"
              >
                Daftar
              </SubmitButton>

              <FormMessage message={searchParams} />
            </form>
          </UrlProvider>
        </div>
        <SmtpMessage />
      </div>
    </>
  );
}