"use client";

import type { InvoiceData } from "@/types/invoice";

function isMobile(): boolean {
  return /iP(hone|od|ad)|Android|Mobile|webOS/i.test(navigator.userAgent);
}

async function shareFile(blob: Blob, filename: string): Promise<boolean> {
  if (!navigator.canShare) return false;
  const file = new File([blob], filename, { type: blob.type });
  if (!navigator.canShare({ files: [file] })) return false;
  try {
    await navigator.share({ files: [file], title: filename });
    return true;
  } catch {
    return false;
  }
}

async function downloadBlob(blob: Blob, filename: string) {
  if (isMobile()) {
    const shared = await shareFile(blob, filename);
    if (shared) return;

    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 120_000);
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
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
  await downloadBlob(blob, `${baseName || "invoice"}.pdf`);
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
  await downloadBlob(blob, `${baseName || "invoice"}.png`);
}
