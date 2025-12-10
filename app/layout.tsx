import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Comfortaa } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import { createClient } from "@/app/utils/supabase/server"; // Import Supabase client

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  display: "swap",
});

// 1. Static Viewport Settings (Theme colors, scaling)
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// 2. Dynamic Metadata (This runs on the server)
export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();

  const baseMetadata: Metadata = {
    title: "Nath Drycleaners",
    description: "Laundry and Dry Cleaning Services",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Nath Laundry",
    },
    formatDetection: {
      telephone: false,
    },
  };

  // 3. CONDITION: Only include the manifest if user exists
  if (user) {
    return {
      ...baseMetadata,
      manifest: "/manifest.json", // Browser sees this ONLY when logged in
    };
  }

  // Otherwise, return metadata without the manifest
  return baseMetadata;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${comfortaa.variable} antialiased bg-slate-50 text-slate-800`}
      >
        {children}
        <BottomNav />
      </body>
    </html>
  );
}