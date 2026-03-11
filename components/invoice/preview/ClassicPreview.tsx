"use client";

/**
 * Classic layout for the web preview (mirrors ClassicTemplate PDF layout).
 */
import type { InvoiceData } from "@/types/invoice";
import Image from "next/image";
import { formatMoney } from "@/lib/invoice/format";
import { computeInvoiceTotals } from "../utils/totals";

export type ClassicPreviewProps = {
  invoice: InvoiceData;
  previewWidth: number;
  previewMinHeight: number;
};

export function ClassicPreview({
  invoice,
  previewWidth,
  previewMinHeight,
}: ClassicPreviewProps) {
  const totals = computeInvoiceTotals(invoice);
  const primaryColor = invoice.theme?.primaryColor ?? "#0f172a";

  return (
    <div
      className="mx-auto rounded-lg border bg-white p-8 shadow-sm"
      style={{
        width: previewWidth,
        minHeight: previewMinHeight,
        maxWidth: "100%",
      }}
    >
      <header className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {invoice.companyLogoDataUrl && (
            <Image
              src={invoice.companyLogoDataUrl}
              alt="Company logo"
              width={40}
              height={40}
              className="rounded-md object-contain"
            />
          )}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: primaryColor }}
            >
              Invoice
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              {invoice.meta.invoiceNumber || "INV-2026"}
            </h2>
          </div>
        </div>
        <div className="text-right text-xs">
          <p className="text-sm font-semibold text-slate-900">
            {invoice.company.name || "Your company name"}
          </p>
          <p className="whitespace-pre-line text-[11px] text-slate-600">
            {invoice.company.address || "Company address"}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {invoice.company.email || "—"}
          </p>
          <p className="text-[11px] text-slate-500">
            {invoice.company.phone || "—"}
          </p>
          {invoice.company.taxId && (
            <p className="mt-1 text-[11px] text-slate-500">
              Tax ID / VAT / GST: {invoice.company.taxId}
            </p>
          )}
        </div>
      </header>

      <section className="mb-6 grid gap-6 text-xs md:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Bill to
          </p>
          <p className="mt-1 text-sm font-medium text-slate-900">
            {invoice.client.name || "Client name"}
          </p>
          <p className="whitespace-pre-line text-[11px] text-slate-600">
            {invoice.client.address || "Client address"}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {invoice.client.email}
          </p>
          <p className="text-[11px] text-slate-500">{invoice.client.phone}</p>
        </div>
        <div className="grid gap-1 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-500">Issue date</span>
            <span className="text-slate-800">{invoice.meta.issueDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Due date</span>
            <span className="text-slate-800">{invoice.meta.dueDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Currency</span>
            <span className="text-slate-800">{invoice.currency || "USD"}</span>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b bg-slate-50 text-[11px] text-slate-600">
              <th className="py-2 px-3 text-left font-medium">Item</th>
              <th className="py-2 px-3 text-right font-medium">Quantity</th>
              <th className="py-2 px-3 text-right font-medium">Price</th>
              <th className="py-2 px-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-4 px-3 text-center text-[11px] text-slate-400"
                >
                  No items added yet.
                </td>
              </tr>
            ) : (
              invoice.lineItems.map((item) => {
                const amount = item.quantity * item.unitPrice;
                return (
                  <tr key={item.id} className="border-b last:border-b-0">
                    <td className="py-2 px-3 align-top">
                      <div className="text-xs font-medium text-slate-900">
                        {item.description || "Item description"}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right align-top text-[11px] text-slate-700">
                      {item.quantity}
                    </td>
                    <td className="py-2 px-3 text-right align-top text-[11px] text-slate-700">
                      {formatMoney(item.unitPrice, invoice.currency)}
                    </td>
                    <td className="py-2 px-3 text-right align-top text-[11px] text-slate-900">
                      {formatMoney(amount, invoice.currency)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      <section className="mb-6 flex justify-end">
        <div className="w-64 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Subtotal</span>
            <span className="text-slate-800">
              {formatMoney(totals.subtotal, invoice.currency)}
            </span>
          </div>
          {totals.discountPercent > 0 && (
            <div className="mt-1 flex justify-between">
              <span className="text-slate-500">
                Discount ({totals.discountPercent.toFixed(1)}%)
              </span>
              <span className="text-emerald-600">
                -{formatMoney(totals.discountAmount, invoice.currency)}
              </span>
            </div>
          )}
          <div className="mt-1 flex justify-between">
            <span className="text-slate-500">
              Tax ({(invoice.tax.rate * 100).toFixed(1)}%)
            </span>
            <span className="text-slate-800">
              {formatMoney(totals.taxAmount, invoice.currency)}
            </span>
          </div>
          <div className="mt-2 border-t pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Total
              </span>
              <span
                className="text-lg font-semibold"
                style={{ color: primaryColor }}
              >
                {formatMoney(totals.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {invoice.notes && (
        <section className="border-t pt-4 text-[11px] text-slate-600">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Notes / terms
          </p>
          <p className="whitespace-pre-line">{invoice.notes}</p>
        </section>
      )}

      {invoice.signatureDataUrl && (
        <section className="mt-6 flex items-end justify-end">
          <div className="text-center">
            <Image
              src={invoice.signatureDataUrl}
              alt="Signature"
              width={140}
              height={60}
              className="mx-auto max-h-24 max-w-56 object-contain"
            />
            <p className="mt-2 text-[11px] font-medium tracking-wide text-slate-500">
              Authorized signature
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
