import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KŌDO Solutions | Le système d'exploitation de votre commerce",
    template: "%s | KŌDO Solutions",
  },
  description: "POS moderne, réservations intelligentes et présence digitale propulsés par l'IA pour les commerçants, boutiques et professionnels ambitieux.",
  keywords: [
    "POS",
    "système de caisse",
    "logiciel de caisse",
    "réservation en ligne",
    "Kōdo POS",
    "Kōdo Bookings",
    "Kōdo Web",
    "gestion de stock",
    "commerce"
  ],
  authors: [{ name: "Kōdo Solutions" }],
  creator: "Kōdo Solutions",
  metadataBase: new URL("https://kōdo-solutions.com"),
  openGraph: {
    title: "KŌDO Solutions | Le système d'exploitation de votre commerce",
    description: "POS moderne, réservations intelligentes et présence digitale propulsés par l'IA pour les commerçants.",
    url: "https://kōdo-solutions.com",
    siteName: "KŌDO Solutions",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KŌDO Solutions | Le système d'exploitation de votre commerce",
    description: "POS moderne, réservations intelligentes et présence digitale propulsés par l'IA.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://kōdo-solutions.com",
  },
  verification: {
    google: "VOTRE_CODE_DE_VERIFICATION_GOOGLE", // The user can replace this later
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
