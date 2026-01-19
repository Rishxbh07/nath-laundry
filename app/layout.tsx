import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import { Toaster } from "sonner";
import { createClient } from "@/app/utils/supabase/server"; // Import server client

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Nath Laundry SaaS",
  description: "Manage your laundry business with ease",
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Check User Status Server-Side
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let hasShop = false;

  if (user) {
    // 2. Check if they have a branch connected
    const { data: profile } = await supabase
      .from('profiles')
      .select('branch_id')
      .eq('user_id', user.id)
      .single();
    
    // If branch_id exists, they have a shop!
    hasShop = !!profile?.branch_id;
  }

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 pb-20`}> 
        {children}
        <Toaster position="top-center" />
        
        {/* 3. Pass the flag to BottomNav */}
        {user && <BottomNav hasShop={hasShop} />}
      </body>
    </html>
  );
}