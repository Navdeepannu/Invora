import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DesktopNavbar } from "@/components/home/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

const seoKeywords = [
  "Invora",
  "free invoice generator",
  "online invoice maker",
  "create invoice online",
  "invoice template",
  "professional invoice",
  "PDF invoice",
  "invoice PDF",
  "small business invoicing",
  "freelancer invoice",
  "billing software",
  "estimate and invoice",
  "GST invoice",
  "tax invoice",
  "invoice with logo",
  "modern invoice design",
  "digital invoice",
  "client invoice",
  "invoice for services",
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Invora - Free Invoice Generator | Professional Invoice Templates",
    template: "%s | Invora",
  },
  description:
    "Create professional, modern invoices online for free. Beautiful templates, PDF export, and saved invoices for freelancers and small businesses—fast and easy with Invora.",
  keywords: seoKeywords,
  authors: [{ name: "Invora" }],
  creator: "Invora",
  publisher: "Invora",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Invora",
    title: "Invora - Free Invoice Generator",
    description:
      "Generate free invoices with polished, professional templates. PDF export and saved invoices for your business.",
    images: [
      {
        url: "/images/preview.png",
        width: 1200,
        height: 630,
        alt: "Invora invoice templates preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invora - Free Invoice Generator",
    description:
      "Create and download professional invoices online. Free templates built for freelancers and small businesses.",
    images: ["/images/preview.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Business & Productivity",
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
        <main>
          <DesktopNavbar />
          {children}
        </main>
      </body>
    </html>
  );
}
