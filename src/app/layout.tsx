import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { LanguageProvider } from "@/lib/i18n";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/toast-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: "#059669",
};

export const metadata: Metadata = {
  title: "RuralCare 360 — From first contact to completed care",
  description: "A closed-loop rural healthcare coordination platform connecting patients, frontline workers, doctors, and health facilities into one continuous healthcare journey.",
  keywords: ["healthcare", "rural", "telemedicine", "coordination", "referral", "follow-up"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RuralCare 360",
  },
  openGraph: {
    title: "RuralCare 360",
    description: "From first contact to completed care.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <LanguageProvider>
            <TooltipProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </TooltipProvider>
          </LanguageProvider>
        </AppProvider>
      </body>
    </html>
  );
}

