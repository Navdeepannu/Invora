import { cn } from "@/lib/utils";
import React from "react";

const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <section
      className={cn`selection:text-white selection:bg-zinc-700 max-w-5xl flex flex-col border-x border-border mx-auto bg-background text-foreground ${className}`}
    >
      {children}
    </section>
  );
};

export default Container;
