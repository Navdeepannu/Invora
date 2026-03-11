"use client";

/**
 * Modern layout for the web preview (mirrors ModernTemplate PDF).
 * Top left: invoice details only. Two boxes (Billed by | Billed to). Table; totals; notes; signature centered.
 */
import type { InvoiceData } from "@/types/invoice";
import Image from "next/image";
import { formatMoney } from "@/lib/invoice/format";
import { computeInvoiceTotals } from "../utils/totals";

export type ModernPreviewProps = {
  invoice: InvoiceData;
  previewWidth: number;
  previewMinHeight: number;
};

export function ModernPreview({
  invoice,
  previewWidth,
  previewMinHeight,
}: ModernPreviewProps) {
  const totals = computeInvoiceTotals(invoice);
  const primaryColor = invoice.theme?.primaryColor ?? "#0f172a";

  return (
    <div
      className="mx-auto rounded-lg border bg-white shadow-sm"
      style={{
        width: previewWidth,
        minHeight: previewMinHeight,
        maxWidth: "100%",
      }}
    >
      {/* Top left: logo + invoice details (no background color) */}
      <div className="flex items-start gap-4 px-6 pt-5 pb-2">
        {invoice.companyLogoDataUrl && (
          <Image
            src={invoice.companyLogoDataUrl}
            alt="Company logo"
            width={44}
            height={44}
            className="shrink-0 rounded-md object-contain"
          />
        )}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            INVOICE
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {invoice.meta.invoiceNumber || "INV-2026"}
          </p>
          <div className="mt-3 flex gap-6 text-[11px]">
            <div>
              <p className="text-slate-500">Issue date</p>
              <p className="mt-0.5 font-medium text-slate-800">
                {invoice.meta.issueDate}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Due date</p>
              <p className="mt-0.5 font-medium text-slate-800">
                {invoice.meta.dueDate}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Currency</p>
              <p className="mt-0.5 font-medium text-slate-800">
                {invoice.currency || "USD"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two boxes: Billed by (left), Billed to (right) */}
      <div className="grid grid-cols-2 gap-5 px-6 py-4">
        <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Billed by
          </p>
          <p className="text-xs font-semibold text-slate-900">
            {invoice.company.name || "Your company"}
          </p>
          <p className="mt-1 whitespace-pre-line text-[11px] text-slate-600">
            {invoice.company.address || "Company address"}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-600">
            {invoice.company.email || "—"}
          </p>
          <p className="text-[11px] text-slate-600">
            {invoice.company.phone || "—"}
          </p>
          {invoice.company.taxId && (
            <p className="mt-1 text-[11px] text-slate-500">
              Tax ID / VAT / GST: {invoice.company.taxId}
            </p>
          )}
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Billed to
          </p>
          <p className="text-xs font-semibold text-slate-900">
            {invoice.client.name || "Client name"}
          </p>
          <p className="mt-1 whitespace-pre-line text-[11px] text-slate-600">
            {invoice.client.address || "Client address"}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-600">
            {invoice.client.email || "—"}
          </p>
          <p className="text-[11px] text-slate-600">
            {invoice.client.phone || "—"}
          </p>
        </div>
      </div>

      {/* Items table */}
      <div className="border-t border-slate-200 px-6 py-4">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600">
              <th className="py-2.5 px-3 text-left">Item</th>
              <th className="py-2.5 px-3 text-right">Quantity</th>
              <th className="py-2.5 px-3 text-right">Price</th>
              <th className="py-2.5 px-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 px-3 text-center text-[11px] text-slate-400"
                >
                  No items added yet.
                </td>
              </tr>
            ) : (
              invoice.lineItems.map((item) => {
                const amount = item.quantity * item.unitPrice;
                return (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-2 px-3 font-medium text-slate-900">
                      {item.description || "Item description"}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-700">
                      {item.quantity}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-700">
                      {formatMoney(item.unitPrice, invoice.currency)}
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-slate-900">
                      {formatMoney(amount, invoice.currency)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Totals: right-aligned */}
      <div className="flex justify-end px-6 pb-4">
        <div className="w-52 text-xs">
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Subtotal</span>
            <span className="text-slate-800">
              {formatMoney(totals.subtotal, invoice.currency)}
            </span>
          </div>
          {totals.discountPercent > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-slate-500">
                Discount ({totals.discountPercent.toFixed(1)}%)
              </span>
              <span className="text-emerald-600">
                -{formatMoney(totals.discountAmount, invoice.currency)}
              </span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-slate-500">
              Tax ({(invoice.tax.rate * 100).toFixed(1)}%)
            </span>
            <span className="text-slate-800">
              {formatMoney(totals.taxAmount, invoice.currency)}
            </span>
          </div>
          <div className="mt-2 border-t border-slate-200 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total
              </span>
              <span
                className="text-base font-bold"
                style={{ color: primaryColor }}
              >
                {formatMoney(totals.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes / terms */}
      {invoice.notes && (
        <div className="border-t border-slate-200 px-6 py-4">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Notes / terms
          </p>
          <p className="whitespace-pre-line text-[11px] text-slate-700">
            {invoice.notes}
          </p>
        </div>
      )}

      {/* Signature centered */}
      {invoice.signatureDataUrl && (
        <div className="flex flex-col items-center border-t border-slate-200 px-6 py-5">
          <Image
            src={invoice.signatureDataUrl}
            alt="Signature"
            width={140}
            height={60}
            className="max-h-24 object-contain"
          />
          <p className="mt-2 text-[11px] font-medium tracking-wide text-slate-500">
            Authorized signature
          </p>
        </div>
      )}
    </div>
  );
}
