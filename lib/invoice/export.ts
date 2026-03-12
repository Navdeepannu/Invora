"use client";

import type { InvoiceData } from "@/types/invoice";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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
