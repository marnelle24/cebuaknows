import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import SideBarNavigation from "@/components/SideBarNavigation";
import ClientOnly from "@/components/ClientOnly";
import SessionProvider from "@/components/SessionProvider";
import BackgroundWrapper from "@/components/BackgroundWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cebua Knows - Everything you need to know about Cebu",
  description: "Discover the best places, attractions, and experiences in Cebu Province, Philippines. Your complete guide to exploring Cebu.",
  keywords: "Cebu, Philippines, travel, tourism, attractions, hotels, restaurants, guide",
  authors: [{ name: "CebuaKnows Team" }],
  openGraph: {
    title: "Cebua Knows - Everything you need to know about Cebu",
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
      <head>
        <link rel="icon" href="/favicon.png" />
        <meta name="title" content="{metadata.title}" />
        <meta name="description" content="{metadata.description}" />
        <meta name="keywords" content="{metadata.keywords}" />
        <meta name="authors" content="{metadata.authors}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="charset" content="utf-8" />
        <meta name="language" content="English" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <SessionProvider>
          <BackgroundWrapper>
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
          </BackgroundWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}