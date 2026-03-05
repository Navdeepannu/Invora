import Image from "next/image";
import { Button } from "../ui/button";
import Container from "./container";
import { IconTemplate, IconPalette, IconFileExport } from "@tabler/icons-react";

export function Features() {
  return (
    <Container>
      <div
        className="flex items-start md:flex-row flex-col justify-between gap-4 py-16 md:px-8 px-6"
        id="#features"
      >
        <h2 className="tracking-tight text-2xl font-medium">
          Everything you need to create invoices
          <br />
          <span className="text-neutral-500">
            Built for freelancers and small businesses
          </span>
        </h2>

        <p className="max-w-lg text-neutral-500 md:mt-6 ">
          Create professional invoices in minutes with ready-made templates,
          simple branding tools, and instant PDF export — no account required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 ring-1 ring-neutral-200 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="flex flex-col items-start gap-3 p-6 bg-neutral-50">
          <IconTemplate className="size-6 text-neutral-700" />
          <h3 className="font-medium">Ready-to-use templates</h3>
          <p className="text-neutral-500 text-sm">
            Start from clean, professional invoice templates designed for
            freelancers and small businesses.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 p-6 shadow-xl shadow-black/5">
          <IconPalette className="size-6 text-neutral-700" />
          <h3 className="font-medium">Brand customization</h3>
          <p className="text-neutral-500 text-sm">
            Add your logo, brand colors and business details to generate
            invoices that match your identity.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 p-6 bg-neutral-50">
          <IconFileExport className="size-6 text-neutral-700" />
          <h3 className="font-medium">PDF export & sharing</h3>
          <p className="text-neutral-500 text-sm">
            Instantly download high-quality PDFs and share invoices with clients
            in one click.
          </p>
        </div>
      </div>
    </Container>
  );
}
