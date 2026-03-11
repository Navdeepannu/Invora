/**
 * Core data model for the invoice feature. Re-exports from app types with
 * clear names: Invoice (full document), Customer (client), Items (line items), Totals (computed).
 */
import type {
  InvoiceData,
  InvoiceClientInfo,
  InvoiceLineItem,
  InvoiceTotals,
} from "@/types/invoice";

/** Full invoice document (company, client, meta, line items, theme, etc.). */
export type Invoice = InvoiceData;

/** Customer / bill-to party. */
export type Customer = InvoiceClientInfo;

/** Single line item (description, quantity, unit price). */
export type InvoiceItem = InvoiceLineItem;

/** Computed totals (subtotal, discount, tax, total). */
export type Totals = InvoiceTotals;
