import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import SWRegister from "./sw-register";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#16364d",
};

export const metadata: Metadata = {
  title: "Tiktiki-Web",
  description: "A Light Weight Device Management System",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 🔥 Register Service Worker ONCE */}
        <SWRegister />

        {children}

        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#333", color: "#fff" },
            success: {
              iconTheme: { primary: "#4ade80", secondary: "#1e293b" },
            },
          }}
        />
      </body>
    </html>
  );
}
