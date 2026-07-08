import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/promptforge/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptForge — The open-source library of AI prompts",
  description:
    "A free, open, community-driven home for high-quality AI prompts. Browse, run in the playground, and submit your own. No accounts, no paywalls, no tracking. MIT licensed.",
  keywords: [
    "AI prompts",
    "prompt engineering",
    "prompt library",
    "open source",
    "GLM",
    "PromptForge",
    "prompt playground",
  ],
  authors: [{ name: "PromptForge Community" }],
  openGraph: {
    title: "PromptForge — The open-source library of AI prompts",
    description:
      "A free, open, community-driven home for high-quality AI prompts. Browse, run, and submit. MIT licensed.",
    siteName: "PromptForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge",
    description:
      "The open-source library of AI prompts. Browse, run, and submit.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Sonner position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
