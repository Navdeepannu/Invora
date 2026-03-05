"use client";
import { Button } from "@/components/ui/button";
import { IconReceiptDollarFilled } from "@tabler/icons-react";

export default function HeaderOne() {
  return (
    <header className="relative w-full">
      <DesktopNavbar />
    </header>
  );
}

export const DesktopNavbar = () => {
  return (
    <header className="border-b ">
      <div className="flex items-center justify-between max-w-5xl mx-auto py-4">
        <div className="flex items-center gap-0.5">
          <IconReceiptDollarFilled className="size-7 text-zinc-600 " />
          <span className="tracking-tight font-sans font-semibold text-2xl text-shadow-2xs text-shadow-accent">
            Invoicely
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button size="sm" variant="outline" className="rounded-lg">
            Saved Invoices
          </Button>

          <Button size="sm" className="rounded-lg" variant="default">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};
