import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Comfortaa } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import NextTopLoader from 'nextjs-toploader'; // Import the loader
import { createClient } from "@/app/utils/supabase/server";

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
    title: "Laundry Man",
    description: "Smart multi-tenant billing system",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Laundry Man",
    },
    formatDetection: {
      telephone: false,
    },
  };

  if (user) {
    return {
      ...baseMetadata,
      manifest: "/manifest.json",
    };
  }

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
        {/* The Top Loader handles perceived speeds instantly upon clicking any route link */}
        <NextTopLoader 
          color="#3b82f6" 
          initialPosition={0.08} 
          crawlSpeed={200} 
          height={3} 
          crawl={true} 
          showSpinner={false} 
          easing="ease" 
          speed={200} 
          shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
        />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}