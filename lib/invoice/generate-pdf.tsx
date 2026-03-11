"use client";

import { pdf } from "@react-pdf/renderer";
import type { InvoiceData } from "@/types/invoice";
import { InvoiceDocument } from "@/components/invoice/pdf/InvoiceDocument";

/**
 * Generates a PDF blob from invoice data. Does not use the DOM or viewport.
 * Uses a fixed A4 layout via @react-pdf/renderer and the template registry.
 */
export async function generateInvoicePdfBlob(
  invoice: InvoiceData,
): Promise<Blob> {
  const doc = <InvoiceDocument invoice={invoice} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}
