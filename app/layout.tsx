// File: rishxbh07/nath-laundry/nath-laundry-2-saas-core/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Comfortaa } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import { createClient } from "@/app/utils/supabase/server";
import { Toaster } from "sonner";

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

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const baseMetadata: Metadata = {
    title: "Nath Laundry SaaS",
    description: "Manage your laundry business with ease",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Nath Laundry",
    },
  };

  if (user) {
    return { ...baseMetadata, manifest: "/manifest.json" };
  }
  return baseMetadata;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let hasShop = false;
  if (user) {
    // SaaS Core Logic: Verify shop ownership
    const { data: branch } = await supabase
      .from('branches')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1)
      .maybeSingle();
    hasShop = !!branch;
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${comfortaa.variable} antialiased bg-slate-50 text-slate-800 pb-20`}>
        {children}
        <Toaster position="top-center" />
        {/* Only show the dock if the user is logged in and setup is complete */}
        {user && hasShop && <BottomNav />}
      </body>
    </html>
  );
}