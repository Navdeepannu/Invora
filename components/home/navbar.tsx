"use client";
import { Button } from "@/components/ui/button";
import { IconReceiptDollarFilled } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function HeaderOne() {
  return (
    <header className="relative w-full">
      <DesktopNavbar />
    </header>
  );
}

export const DesktopNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={`${isHome ? "border-b" : "border-b border-dashed"}`}
    >
      <div
        className={`flex items-center justify-between px-4 py-4  ${
          isHome ? "max-w-5xl mx-auto" : "md:px-4"
        }`}
      >
        <div
          className="flex items-center gap-0.5 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <IconReceiptDollarFilled className="size-7 text-zinc-600 " />
          <span className="tracking-tight font-sans font-semibold text-2xl text-shadow-2xs text-shadow-accent">
            Invoicely
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild size="sm" variant="outline" className="rounded-lg">
            <Link href="/saved-invoices">Saved Invoices</Link>
          </Button>

          <Button asChild size="sm" className="rounded-lg" variant="default">
            <Link href="/invoice/new">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
