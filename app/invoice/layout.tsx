import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "../../app/globals.css";

const playfair = Playfair_Display({
  variable: "--font-invoice-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Invoice Builder - Generate Free Invoices and Export PDFs.",
  description:
    "Generate Free invoices with modern, professional template looks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={playfair.variable}>
      <main className="min-h-screen bg-background text-foreground">
        {children}
      </main>
    </div>
  );
}
