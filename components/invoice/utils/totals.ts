/**
 * Computes invoice totals (subtotal, discount, tax, total) from invoice data.
 * Used by both PDF templates and web preview to keep logic in one place.
 */
import type { InvoiceData, InvoiceTotals } from "@/types/invoice";

export function computeInvoiceTotals(invoice: InvoiceData): InvoiceTotals {
  const subtotal = invoice.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const discountPercent = invoice.discountPercent ?? 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableBase = Math.max(subtotal - discountAmount, 0);
  const taxAmount = taxableBase * invoice.tax.rate;
  const total = taxableBase + taxAmount;
  return {
    subtotal,
    discountPercent,
    discountAmount,
    taxAmount,
    total,
  };
}
