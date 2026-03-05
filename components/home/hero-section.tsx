"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import Container from "./container";
import { IconCaretRightFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();

  const handleCreateInvoice = () => {
    const id = crypto.randomUUID();
    router.push(`/invoice/${id}`);
  };

  return (
    <Container>
      <div className="flex flex-col gap-4 py-16 md:px-8 px-6">
        <h1 className="tracking-tight md:text-4xl text-2xl font-medium ">
          The fastest way to create
          <br />{" "}
          <span className="text-neutral-500"> and send invoices online</span>
        </h1>
        <p className="max-w-lg font-medium text-neutral-500">
          Invoicely helps freelancers and small teams generate clean, branded
          invoices, manage clients, and export professional PDFs — all from one
          simple tool.
        </p>

        <div className="flex items-center gap-4 mt-4">
          <Button
            variant="default"
            size="sm"
            className="rounded-lg"
            onClick={handleCreateInvoice}
          >
            Create first invoice
            <IconCaretRightFilled />
          </Button>

          <Button
            className="rounded-lg"
            size="sm"
            variant="outline"
            onClick={() => router.push("/features")}
          >
            Explore Features
          </Button>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <Image
          src="/images/hero-background.webp"
          alt="hero background"
          fill
          priority
          className="object-cover object-bottom mask-t-from-85%"
        />

        <div className="relative z-20 flex items-center justify-center p-6 md:p-10 ">
          <Image
            src="/images/hero-image.png"
            alt="hero preview"
            width={1200}
            height={800}
            className="w-full max-w-5xl rounded-xl shadow-2xl shadow-zinc-900"
          />
        </div>
      </div>
    </Container>
  );
}
