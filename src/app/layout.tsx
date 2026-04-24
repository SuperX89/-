import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Prompt } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/Toaster";
import BottomNav from "@/components/BottomNav";
import SideNav from "@/components/SideNav";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const display = Prompt({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Toy Resale · มือสองเด็ก",
  description: "ระบบสต็อกและขายของมือสองของเล่น/ของใช้เด็ก",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FBF8F2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans min-h-screen">
        <Toaster>
          <div className="flex">
            <SideNav />
            <main
              className="flex-1 min-h-screen min-w-0 w-full overflow-x-hidden"
              style={{ paddingBottom: "calc(84px + env(safe-area-inset-bottom))" }}
            >
              <div className="max-w-3xl mx-auto px-4 pt-5 pb-6 md:px-8 md:pt-10">
                {children}
              </div>
            </main>
          </div>
          <BottomNav />
        </Toaster>
      </body>
    </html>
  );
}
