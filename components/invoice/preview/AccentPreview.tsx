"use client";

/**
 * Accent layout for web preview. Warm header and soft body card.
 */
import type { InvoiceData } from "@/types/invoice";
import Image from "next/image";
import { formatMoney } from "@/lib/invoice/format";
import { computeInvoiceTotals } from "../utils/totals";

export type AccentPreviewProps = {
  invoice: InvoiceData;
  previewWidth: number;
  previewMinHeight: number;
};

export function AccentPreview({
  invoice,
  previewWidth,
  previewMinHeight,
}: AccentPreviewProps) {
  const totals = computeInvoiceTotals(invoice);
  const accent = invoice.theme?.primaryColor ?? "#f97316";

  return (
    <div
      className="mx-auto"
      style={{
        width: previewWidth,
        minHeight: previewMinHeight,
        maxWidth: "100%",
      }}
    >
      <div className="h-full bg-slate-100 overflow-hidden border border-slate-200">
        {/* Header band */}
        <div className="flex items-start justify-between bg-slate-100 px-8 py-5">
          <div className="flex items-start gap-3">
            {invoice.companyLogoDataUrl && (
              <Image
                src={invoice.companyLogoDataUrl}
                alt="Logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-md object-contain"
              />
            )}
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                {invoice.company.name || "Your business"}
              </h2>
              <p className="text-[11px] text-slate-600">
                {invoice.company.email || "hello@email.com"}
              </p>
              <p className="text-[11px] text-slate-600">
                {invoice.company.phone || "+00 0000 00000"}
              </p>
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-600">
            <p>{invoice.company.address || "Business address"}</p>
            {invoice.company.taxId && <p>TAX ID {invoice.company.taxId}</p>}
          </div>
        </div>

        {/* Body (inner card from billed to -> thanks) */}
        <div className="mx-4 mb-4 bg-white px-8 pb-8 pt-6 text-[13px] text-slate-900">
          {/* Top details */}
          <div className="mb-6 grid grid-cols-3 gap-6">
            <div>
              <p className="mb-1 text-[11px] text-slate-500">Billed to,</p>
              <p className="text-sm font-medium">
                {invoice.client.name || "Client name"}
              </p>
              <p className="text-[11px] text-slate-600 whitespace-pre-line">
                {invoice.client.address || "Client address"}
              </p>
              <p className="text-[11px] text-slate-600">
                {invoice.client.phone || ""}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[11px] text-slate-500">Invoice number</p>
              <p className="mb-3 text-sm font-medium">
                {invoice.meta.invoiceNumber || "INV-001"}
              </p>
              <p className="mb-1 text-[11px] text-slate-500">Invoice date</p>
              <p className="mb-3 text-sm font-medium">
                {invoice.meta.issueDate}
              </p>
              <p className="mb-1 text-[11px] text-slate-500">Due date</p>
              <p className="text-sm font-medium">{invoice.meta.dueDate}</p>
            </div>
            <div className="text-right">
              <p className="mb-1 text-[11px] text-slate-500">Invoice total</p>
              <p className="text-2xl font-semibold" style={{ color: accent }}>
                {formatMoney(totals.total, invoice.currency)}
              </p>
            </div>
          </div>

          {/* Items table */}
          <div className="mb-6">
            <div className="grid grid-cols-12 gap-4 border-b border-slate-200 pb-2 text-[11px] font-semibold uppercase text-slate-500">
              <div className="col-span-6">Item Detail</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            {invoice.lineItems.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No items added yet.
              </div>
            ) : (
              invoice.lineItems.map((item) => {
                const lineTotal = item.quantity * item.unitPrice;
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 py-3 border-b border-slate-200 last:border-b-0"
                  >
                    <div className="col-span-6">
                      <p className="text-sm font-medium">
                        {item.description || "Item name"}
                      </p>
                    </div>
                    <div className="col-span-2 text-center text-sm">
                      {item.quantity}
                    </div>
                    <div className="col-span-2 text-right text-sm">
                      {formatMoney(item.unitPrice, invoice.currency)}
                    </div>
                    <div className="col-span-2 text-right text-sm">
                      {formatMoney(lineTotal, invoice.currency)}
                    </div>
                  </div>
                );
              })
            )}

            {/* Totals */}
            <div className="mt-6 space-y-1 text-sm">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-10 text-right text-slate-600">
                  Subtotal
                </div>
                <div className="col-span-2 text-right text-slate-800">
                  {formatMoney(totals.subtotal, invoice.currency)}
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-10 text-right text-slate-600">
                  Tax ({(invoice.tax.rate * 100).toFixed(1)}%)
                </div>
                <div className="col-span-2 text-right text-slate-800">
                  {formatMoney(totals.taxAmount, invoice.currency)}
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 border-t border-slate-200 pt-2 font-medium">
                <div className="col-span-10 text-right text-slate-800">
                  Total
                </div>
                <div className="col-span-2 text-right text-slate-800">
                  {formatMoney(totals.total, invoice.currency)}
                </div>
              </div>
            </div>
          </div>

          {/* Signature + footer inside card */}
          {invoice.signatureDataUrl && (
            <div className="mt-8 flex flex-col items-end">
              <Image
                src={invoice.signatureDataUrl}
                alt="Authorized signature"
                width={120}
                height={48}
                className="max-h-14 max-w-[140px] object-contain"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Authorized signature
              </p>
            </div>
          )}

          <div className="mt-8 text-[12px] text-slate-700">
            <p className="mb-1">Thanks for the business.</p>
          </div>
        </div>

        {/* Terms & conditions on outer muted background */}
        {invoice.notes && (
          <div className="border-t border-slate-200 bg-slate-100 px-8 py-5 text-[11px] text-slate-600">
            <p className="mb-1 font-medium text-slate-500">
              Terms &amp; Conditions
            </p>
            <p className="whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
