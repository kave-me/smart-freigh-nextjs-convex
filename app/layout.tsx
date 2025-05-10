import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartFreight - Intelligent freight escalation platform",
  description:
    "Efficiently manage your invoices, track payments, and handle escalations with our intelligent invoice management system.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://smartfreight.example.com",
  ),
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "SmartFreight - Intelligent freight escalation platform",
    description:
      "Efficiently manage your invoices, track payments, and handle escalations with our intelligent invoice management system.",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "SmartFreight",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartFreight - Intelligent freight escalation platform",
    description:
      "Efficiently manage your invoices, track payments, and handle escalations with our intelligent invoice management system.",
    images: ["/opengraph.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>{children}</ConvexClientProvider>
            <Toaster /> {/* Add Toaster component */}
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
