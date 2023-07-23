import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientProviders from "./client-providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "funnel.eth",
  description: "gated communities - created at eth global paris 2023",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
