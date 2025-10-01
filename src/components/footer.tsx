import Link from "next/link";
import { Twitter, Linkedin, Github, Heart, Phone, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#161413] dark:bg-[#0a0908] text-[#eeedec]">
      <div className="container mx-auto px-4 py-12">
        {/* Crisis Support Banner */}
        <div className="bg-[#756657] rounded-lg p-6 mb-12 text-center">
          <h3 className="text-xl font-bold mb-2 text-white">
            Crisis Support Available 24/7
          </h3>
          <p className="mb-4 text-white/90">
            If you're experiencing a mental health crisis, help is available
            immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:988"
              className="inline-flex items-center px-6 py-3 bg-white text-[#756657] rounded-lg hover:bg-[#f7f7f7] transition-colors font-semibold"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call 988 (Suicide & Crisis Lifeline)
            </a>
            <a
              href="sms:741741"
              className="inline-flex items-center px-6 py-3 bg-[#756657]/80 text-white rounded-lg hover:bg-[#756657]/90 transition-colors font-semibold"
            >
              <Mail className="w-4 h-4 mr-2" />
              Text HOME to 741741
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Platform Column */}
          <div>
            <h3 className="font-semibold text-[#eeedec] mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/screening"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Mental Health Screening
                </Link>
              </li>
              <li>
                <Link
                  href="/journal"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Journaling
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Professional Chat
                </Link>
              </li>
              <li>
                <Link
                  href="/progress"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Progress Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-[#eeedec] mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Crisis Resources
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Professional Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-[#eeedec] mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Our Mission
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Research & Evidence
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-[#eeedec] mb-4">Legal & Privacy</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  HIPAA Compliance
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Data Security
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a19991] hover:text-[#756657] transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#756657]/20">
          <div className="flex items-center mb-4 md:mb-0">
            <Heart className="w-5 h-5 text-[#756657] mr-2" />
            <span className="text-[#a19991]">
              © {currentYear} Jiwo.AI. Made with care for mental health.
            </span>
          </div>

          <div className="flex space-x-6">
            <a
              href="#"
              className="text-[#a19991] hover:text-[#756657] transition-colors"
            >
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-[#a19991] hover:text-[#756657] transition-colors"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-[#a19991] hover:text-[#756657] transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-[#756657]/20 text-center">
          <p className="text-[#a19991] text-sm max-w-4xl mx-auto">
            <strong>Important:</strong> This platform is not a substitute for
            professional medical advice, diagnosis, or treatment. If you are
            experiencing a mental health emergency, please contact emergency
            services immediately or call the 988 Suicide & Crisis Lifeline.
          </p>
        </div>
      </div>
    </footer>
  );
}