import { Toaster } from "@/components/ui/sonner";
import { NextAuthProvider, Providers, QueryProviders } from "@/redux/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BTTP",
  description: "BTTP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="overflow-hidden">
        <QueryProviders>
          <Providers>
            <NextAuthProvider>
              {children}
              <Toaster richColors position="top-right" />
            </NextAuthProvider>
          </Providers>
        </QueryProviders>
      </body>
    </html>
  );
}
