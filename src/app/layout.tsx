import MainWrapper from "@/components/common/MainWrapper";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PMS - UAT",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`!font-proxima select-none !p-0 overflow-hidden`}>
        <MainWrapper>{children}</MainWrapper>
      </body>
    </html>
  );
}
