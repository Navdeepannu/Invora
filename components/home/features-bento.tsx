"use client";

import Image from "next/image";
import Container from "./container";

const features = [
  {
    id: "branding",
    title: "Custom Brand Colors",
    description:
      "Match your invoices to your brand with customizable accent colors.",
    size: "default" as const,
    illustration: "color-picker",
  },
  {
    id: "pdf",
    title: "Instant PDF and Image Exports",
    description:
      "Download high-quality PDF invoices ready to send to clients or attach to emails.",
    size: "default" as const,
    illustration: "download",
  },
  {
    id: "clients",
    title: "Save Client & Company Information",
    description:
      "Store client details once and reuse them when creating new invoices.",
    size: "default" as const,
    illustration: "client-list",
  },
  {
    id: "templates",
    title: "4 Professional Invoice Templates",
    description:
      "Choose from four clean, modern templates designed for freelancers and small businesses.",
    size: "default" as const,
    illustration: "invoice-preview",
  },
  {
    id: "dashboard",
    title: "Saved Invoices Dashboard",
    description:
      "View and manage all previously created invoices in one simple place.",
    size: "large" as const,
    illustration: "invoice-list",
  },
  {
    id: "no-signup",
    description:
      "Create and export invoices instantly without creating an account.",
    size: "compact" as const,
    illustration: "no-signup",
  },
];

function InvoicePreviewIllustration() {
  return (
    <div
      className="relative w-full flex h-48 md:h-56 items-end justify-center pb-0 -mb-5 mt-8 md:mt-0"
      aria-hidden
    >
      {/* Left */}
      <div className="absolute -bottom-5 left-12 z-0 w-[28%] md:w-[30%] max-w-35 md:max-w-45 opacity-90 shadow-2xl ring-3 ring-muted rounded-md">
        <Image
          src="/images/invoice-four.png"
          alt="invoice-1"
          width={1920}
          height={1080}
          className="h-auto w-full object-contain object-center rounded-md"
        />
      </div>

      {/* Center (main) */}
      <div className="relative z-10 w-[44%] max-w-50 md:max-w-60 shadow-xl ring-3 ring-muted rounded-md -bottom-5">
        <Image
          src="/images/invoice-two.png"
          alt="invoice-3"
          width={1920}
          height={1080}
          className="h-auto w-full object-contain object-bottom rounded-md"
        />
      </div>

      {/* Right */}
      <div className="absolute -bottom-5 right-12 z-0 w-[28%] md:w-[30%] max-w-35 shadow-2xl ring-3 ring-muted rounded-md md:max-w-45 opacity-90">
        <Image
          src="/images/invoice-one.png"
          alt="invoice-4"
          width={1920}
          height={1080}
          className="h-auto w-full object-contain object-center rounded-md"
        />
      </div>
    </div>
  );
}
function ColorPickerIllustration() {
  const cards = [
    {
      color: "#39265E",
      base: "-translate-x-[70px] rotate-[-12deg]",
      hover: "-translate-x-[90px] rotate-[-18deg] -translate-y-1",
      z: 1,
    },
    {
      color: "#e84241",
      base: "-translate-x-1/2 rotate-0",
      hover: "-translate-x-1/2 -translate-y-2",
      z: 2,
    },
    {
      color: "#5AA96B",
      base: "translate-x-[10px] rotate-[12deg]",
      hover: "translate-x-[30px] rotate-[18deg] -translate-y-1",
      z: 1,
    },
  ];

  return (
    <div
      className="relative flex justify-center w-full py-6 min-h-28"
      aria-hidden
    >
      {cards.map((card, i) => (
        <div
          key={i}
          className={`
            absolute left-1/2 top-0
            w-15 h-25 rounded-xl shadow-md
            transition-all duration-300 ease-out
            ${card.base}
            group-hover:${card.hover}
          `}
          style={{
            backgroundColor: card.color,
            zIndex: card.z,
          }}
        >
          <span className="absolute inset-x-0 mx-auto bottom-3 ring-4 ring-neutral-100/30 rounded-full bg-white size-3 shadow-md shadow-black/10" />
        </div>
      ))}
    </div>
  );
}

function DownloadIllustration() {
  return (
    <div className="flex items-center justify-start gap-12  pr-12">
      <div className="bg-white ring-border z-1 shadow-black/6.5 relative w-16 space-y-3 rounded-md rounded-tr-[15%] p-3 shadow-md ring-1">
        <div className="z-2 after:border-foreground/15 text-shadow-sm absolute -right-3 bottom-2 rounded bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-lg shadow-rose-900/25 after:absolute after:inset-0 after:rounded after:border">
          PDF
        </div>
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <div className="bg-foreground/10 h-0.5 w-full rounded-full"></div>
          </div>
          <div className="flex gap-1">
            <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full"></div>
            <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full"></div>
            <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full"></div>
          </div>
          <div className="flex gap-1">
            <div className="bg-foreground/10 h-0.5 w-1/2 rounded-full"></div>
            <div className="bg-foreground/10 h-0.5 w-1/2 rounded-full"></div>
          </div>
          <div className="flex gap-1">
            <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full"></div>
            <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full"></div>
            <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full"></div>
          </div>
          <div className="flex gap-1">
            <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full"></div>
            <div className="bg-foreground/10 h-0.5 w-2/3 rounded-full"></div>
            <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full"></div>
          </div>
          <div className="flex gap-1">
            <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full"></div>
            <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full"></div>
          </div>
        </div>
        <div className="flex gap-1 pt-1">
          <div className="bg-foreground h-0.5 w-4 rounded-full"></div>
        </div>
      </div>
      <div aria-hidden="true" className="relative size-fit">
        <div className="z-2 after:border-foreground/15 text-shadow-sm absolute -right-3 bottom-2 rounded bg-pink-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-lg shadow-pink-900/25 after:absolute after:inset-0 after:rounded after:border">
          IMG
        </div>
        <div className="bg-white ring-border z-1 shadow-black/6.5 relative w-16 rounded-md rounded-tr-[15%] p-2.5 shadow-md ring-1">
          <div className="relative h-16">
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-lineaer-to-t from-emerald-500/30 to-transparent"></div>
            <div className="absolute bottom-1 left-1 h-3 w-5 rounded-t-full bg-emerald-500/40"></div>
            <div className="absolute bottom-1 right-2 h-5 w-4 rounded-t-full bg-emerald-600/40"></div>
            <div className="absolute right-1.5 top-1.5 size-2 rounded-full bg-amber-400/60"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const clientCards = [
  { name: "Méschac Irung", title: "CEO, Acme" },
  { name: "Alex Chen", title: "Founder, Studio Co" },
  { name: "Jordan Lee", title: "Director, Atlas" },
];

function ClientListIllustration() {
  return (
    <div
      className="flex items-center justify-center mask-l-from-70% gap-2 mask-r-from-70% py-1 transition-opacity duration-300"
      aria-hidden
    >
      {clientCards.map((client, i) => (
        <div
          key={client.name}
          className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm ring-1 ring-border/40"
          style={{ zIndex: clientCards.length - i }}
        >
          <div className="flex items-start justify-between gap-2 p-2.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                {client.name}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {client.title}
              </p>
            </div>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/80 bg-muted/30">
              <svg
                className="size-3.5 text-foreground/70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284" />
                <path d="M3 21h18" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-linear-to-r from-blue-500 to-emerald-500 px-2 py-1.5">
            <svg
              className="size-3.5 shrink-0 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span className="text-[10px] font-semibold text-white">Saved</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function InvoiceListIllustration() {
  return (
    <div className="z-1 relative flex items-end justify-center *:scale-90">
      <div aria-hidden="true" className="relative">
        <div className="mask-b-from-50% before:bg-card before:border-border md:-bottom-6 after:ring-ring/50 after:bg-card/75 before:z-1 before:ring-ring/50 group relative -mx-4 px-4 pt-6 before:absolute before:inset-x-6 before:bottom-0 before:top-4 before:rounded-2xl before:ring-1 before:backdrop-blur after:absolute after:inset-x-9 after:bottom-0 after:top-2 after:rounded-2xl after:ring-1">
          <div className="bg-card ring-ring/50 shadow-black/6.5 relative z-10 overflow-hidden rounded-2xl border border-transparent p-8 text-sm shadow-xl ring-1">
            <div className="mb-6 flex items-start justify-between gap-8">
              <div className="space-y-0.5">
                <svg
                  className="size-5"
                  viewBox="0 0 180 228"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 63L107 0L128 11.5V186.5L172 161.5V37.5L214 63V186.5L106.5 248L85 235.5V63L42 88.5V213L0 186.5V63Z"
                    fill="black"
                  />
                </svg>

                <div className="mt-4 font-mono text-xs">INV-456789</div>
                <div className="mt-1 -translate-x-1 font-mono text-2xl font-semibold">
                  $2,843.57
                </div>
                <div className="text-xs font-medium">Due in 15 days</div>
              </div>
              <div
                aria-hidden="true"
                className="bg-illustration ring-ring/70 shadow-black/6.5 w-16 space-y-2 rounded-md p-2 shadow-md ring-1 [--color-border:color-mix(in_oklab,var(--color-foreground)15%,transparent)]"
              >
                <div className="flex items-center gap-1">
                  <div className="bg-border size-2.5 rounded-full"></div>
                  <div className="bg-border h-0.75 w-4 rounded-full"></div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1">
                    <div className="bg-border h-0.75 w-2.5 rounded-full"></div>
                    <div className="bg-border h-0.75 w-6 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="bg-border h-0.75 w-2.5 rounded-full"></div>
                    <div className="bg-border h-0.75 w-6 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="bg-border h-0.75 w-full rounded-full"></div>
                  <div className="flex items-center gap-1">
                    <div className="bg-border h-0.75 w-2/3 rounded-full"></div>
                    <div className="bg-border h-0.75 w-1/3 rounded-full"></div>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-signature ml-auto size-3"
                >
                  <path d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284"></path>
                  <path d="M3 21h18"></path>
                </svg>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="grid grid-cols-[auto_1fr] items-center">
                <span className="text-muted-foreground w-18 block">To</span>
                <span className="bg-border h-2 w-1/4 rounded-full px-2"></span>
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center">
                <span className="text-muted-foreground w-18 block">From</span>
                <span className="bg-border h-2 w-1/2 rounded-full px-2"></span>
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center">
                <span className="text-muted-foreground w-18 block">
                  Address
                </span>
                <span className="bg-border h-2 w-2/3 rounded-full px-2"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoSignupIllustration() {
  return (
    <div
      className="to-neutral-800 from-sky-800 block bg-linear-to-r bg-clip-text text-3xl font-bold text-transparent"
      aria-hidden
    >
      <span> No Account Required</span>
    </div>
  );
}

function FeatureIllustration({ type }: { type: string }) {
  switch (type) {
    case "invoice-preview":
      return <InvoicePreviewIllustration />;
    case "color-picker":
      return <ColorPickerIllustration />;
    case "download":
      return <DownloadIllustration />;
    case "client-list":
      return <ClientListIllustration />;
    case "invoice-list":
      return <InvoiceListIllustration />;
    case "no-signup":
      return <NoSignupIllustration />;
    default:
      return null;
  }
}

function BentoCard({
  feature,
  className = "",
}: {
  feature: (typeof features)[number];
  className?: string;
}) {
  const isCompact = feature.size === "compact";

  return (
    <div
      className={`group relative flex flex-col overflow-hidden transition-all duration-300 ${className}`}
    >
      {isCompact ? (
        <>
          {/* Compact: icon + title + short line only, minimal padding */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-3 px-5 py-5 text-start">
            <FeatureIllustration type={feature.illustration} />
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              {feature.title}
            </h3>

            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </div>
        </>
      ) : (
        <>
          {/* TEXT */}
          <div className="relative z-10 flex flex-col px-5 pt-5 pb-1">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              {feature.title}
            </h3>

            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </div>

          {/* ILLUSTRATION – generous gap above for tasteful spacing */}
          <div
            className={`relative mt-10 flex flex-1 flex-col items-end justify-end px-5 pb-5 ${
              feature.size === "large" ? "min-h-36" : "min-h-28"
            }`}
          >
            <FeatureIllustration type={feature.illustration} />
          </div>
        </>
      )}
    </div>
  );
}

export function FeaturesBento() {
  return (
    <Container className="border-r-0">
      <div
        className="flex flex-col gap-4 py-16 md:px-8 px-6 border-r border-border"
        id="features"
      >
        <h2 className="tracking-tight text-2xl font-medium">
          Everything you need to create invoices
          <br />
          <span className="text-muted-foreground">
            Built for freelancers and small businesses
          </span>
        </h2>
        <p className="max-w-lg text-muted-foreground md:mt-0">
          Create professional invoices in minutes with ready-made templates,
          simple branding tools, and instant PDF export — no account required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_auto_auto] lg:grid-cols-3 border-y border-border divide-y divide-x divide-border">
        {features.map((feature) => {
          const isTemplate = feature.id === "templates";
          const isDashboard = feature.id === "dashboard";
          const isNoSignup = feature.id === "no-signup";
          return (
            <BentoCard
              key={feature.id}
              feature={feature}
              className={
                isTemplate
                  ? "md:col-span-2 md:row-span-2 min-h-50 lg:min-h-70 "
                  : isDashboard
                    ? "lg:col-start-3 lg:row-start-2 min-h-50 lg:min-h-70"
                    : isNoSignup
                      ? "lg:col-start-3 lg:row-start-3 border-r"
                      : ""
              }
            />
          );
        })}
      </div>
    </Container>
  );
}
