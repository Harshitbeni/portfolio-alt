import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { AgentationDevToolbar } from "@/components/agentation-dev-toolbar";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harshit Beni",
  description: "Portfolio",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full scroll-smooth scroll-pt-20 antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <Providers>{children}</Providers>
        <AgentationDevToolbar />
      </body>
    </html>
  );
}
