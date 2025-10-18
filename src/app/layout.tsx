import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import HeaderDisplay from "@/components/HeaderDisplay";
import SideBarNavigation from "@/components/SideBarNavigation";
import ClientOnly from "@/components/ClientOnly";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CebuaKnows React - Everything you need to know about Cebu",
  description: "Discover the best places, attractions, and experiences in Cebu Province, Philippines. Your complete guide to exploring Cebu.",
  keywords: "Cebu, Philippines, travel, tourism, attractions, hotels, restaurants, guide",
  authors: [{ name: "CebuaKnows Team" }],
  openGraph: {
    title: "CebuaKnows React - Everything you need to know about Cebu",
    description: "Discover the best places, attractions, and experiences in Cebu Province, Philippines.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <SessionProvider>
          <div className="min-h-screen bg-gradient-to-br from-[#E0FCF6] via-[#E0FCF6] to-[#B8F5E8]" suppressHydrationWarning>
            <ClientOnly>
              <ErrorBoundary>
                {/* <header className="max-w-7xl mx-auto flex justify-center items-center">
                  <ErrorBoundary>
                    <HeaderDisplay msg="Everything you need to know about Cebu" />
                  </ErrorBoundary>
                </header> */}
                
                <ErrorBoundary>
                  <SideBarNavigation />
                </ErrorBoundary>

                <main className="flex-1 flex items-center justify-center lg:p-0 p-4 transition-all duration-300">
                  <div className="w-full max-w-7xl">
                    <ErrorBoundary>
                      {children}
                    </ErrorBoundary>
                  </div>
                </main>
              </ErrorBoundary>
            </ClientOnly>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}