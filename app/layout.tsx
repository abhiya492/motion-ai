import type { Metadata } from "next";
import { IBM_Plex_Sans as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/home/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { ORIGIN_URL } from "@/lib/constants";
import { ThemeProvider } from "@/components/common/theme-provider";
import AppLayout from "@/components/common/app-layout";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Motion-AI SaaS By Abhishek",
  description:
    "Convert your video or voice into a Blog Post in seconds with the power of AI!",
  icons: {
    icon: "/icon.ico",
  },
  metadataBase: new URL(ORIGIN_URL),
  alternates: {
    canonical: ORIGIN_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider>
            <Header />
            <AppLayout>
              <main>{children}</main>
            </AppLayout>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
