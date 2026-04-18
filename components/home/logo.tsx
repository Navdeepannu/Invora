import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/invora-icon.svg"
      alt="Invora Logo"
      width={1000}
      height={1000}
      className={cn("block h-8 w-auto shrink-0 object-contain", className)}
      unoptimized
      priority
    />
  );
}
