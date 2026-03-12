"use client";

import type { InvoiceData } from "@/types/invoice";

function isIOSDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS can report itself as Mac; touch points distinguishes it.
    (platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);

  // iOS Safari often ignores `download` for blob URLs. Opening a new tab
  // allows the built-in viewer so users can preview/share/save the file.
  if (isIOSDevice()) {
    const popup = window.open(url, "_blank", "noopener,noreferrer");
    if (!popup) {
      window.location.assign(url);
    }
    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60_000);
    return;
  }

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Avoid revoking immediately; some mobile/slow browsers can fail to consume
  // the blob URL if it's released too early.
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 60_000);
}

/**
 * Export invoice as PDF via Puppeteer API route.
 * Sends the invoice JSON to the server; Puppeteer renders the same
 * HTML+Tailwind template used in the preview and returns a PDF.
 */
export async function downloadInvoiceAsPdf(
  invoice: InvoiceData,
  baseName: string,
): Promise<void> {
  const res = await fetch("/api/invoice/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invoice),
  });

  if (!res.ok) {
    throw new Error(`PDF generation failed: ${res.status}`);
  }

  const blob = await res.blob();
  downloadBlob(blob, `${baseName || "invoice"}.pdf`);
}

/**
 * Export invoice as PNG via Puppeteer API route.
 * Same pipeline as PDF but returns a high-res screenshot instead.
 */
export async function downloadInvoiceAsPng(
  invoice: InvoiceData,
  baseName: string,
): Promise<void> {
  const res = await fetch("/api/invoice/png", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invoice),
  });

  if (!res.ok) {
    throw new Error(`PNG generation failed: ${res.status}`);
  }

  const blob = await res.blob();
  downloadBlob(blob, `${baseName || "invoice"}.png`);
}
