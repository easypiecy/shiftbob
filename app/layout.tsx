import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppRootProviders } from "@/src/components/app-root-providers";
import { SHIFTBOB_SITE_ICON } from "@/src/lib/brand-assets";
import {
  getUiTranslations,
  resolveRequestUiLanguage,
} from "@/src/lib/ui-language-server";
import { resolveUiThemeForRequest } from "@/src/lib/ui-theme-server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShiftBob",
  description: "ShiftBob app",
  icons: {
    icon: [
      {
        url: SHIFTBOB_SITE_ICON,
        sizes: "256x256",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: SHIFTBOB_SITE_ICON,
        sizes: "256x256",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "ShiftBob",
    statusBarStyle: "default",
  },
};

export async function generateViewport(): Promise<Viewport> {
  const theme = await resolveUiThemeForRequest();
  const themeColor =
    theme === "light" ? "#fafafa" : theme === "unicorn" ? "#c1b3f2" : "#0d0d0d";
  return { themeColor };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await resolveUiThemeForRequest();
  const [translations, htmlLang] = await Promise.all([
    getUiTranslations(),
    resolveRequestUiLanguage(),
  ]);
  const htmlClass = [
    geistSans.variable,
    geistMono.variable,
    "h-full antialiased",
    theme !== "light" ? "dark" : "",
    theme === "unicorn" ? "theme-unicorn" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html lang={htmlLang} className={htmlClass} data-theme={theme}>
      <body className="flex min-h-full flex-col font-sans">
        <AppRootProviders translations={translations}>{children}</AppRootProviders>
      </body>
    </html>
  );
}
