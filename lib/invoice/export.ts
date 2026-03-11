"use client";

import type { InvoiceData } from "@/types/invoice";
import { generateInvoicePdfBlob } from "./generate-pdf";
import { pdfBlobToPngBlob } from "./pdf-to-png";

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
 * Export invoice as PDF. Uses fixed A4 layout; does not depend on viewport or preview DOM.
 */
export async function downloadInvoiceAsPdf(
  invoice: InvoiceData,
  baseName: string,
): Promise<void> {
  const blob = await generateInvoicePdfBlob(invoice);
  const filename = `${baseName || "invoice"}.pdf`;
  downloadBlob(blob, filename);
}

/**
 * Export invoice as PNG (first page, high resolution). Renders from the same PDF pipeline;
 * does not depend on viewport or preview DOM.
 */
export async function downloadInvoiceAsPng(
  invoice: InvoiceData,
  baseName: string,
): Promise<void> {
  const pdfBlob = await generateInvoicePdfBlob(invoice);
  const pngBlob = await pdfBlobToPngBlob(pdfBlob, 2);
  const filename = `${baseName || "invoice"}.png`;
  downloadBlob(pngBlob, filename);
}
