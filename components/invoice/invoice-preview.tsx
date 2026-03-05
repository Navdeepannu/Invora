"use client";

import type { InvoiceData } from "@/types/invoice";
import Image from "next/image";

type InvoicePreviewProps = {
  invoice: InvoiceData;
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(value);
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const subtotal = invoice.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const discountPercent = invoice.discountPercent ?? 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableBase = Math.max(subtotal - discountAmount, 0);
  const taxAmount = taxableBase * invoice.tax.rate;
  const total = taxableBase + taxAmount;

  const primaryColor = invoice.theme?.primaryColor ?? "#0f172a";
  const template = invoice.theme?.template ?? "classic";

  if (template === "modern") {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border bg-white shadow-sm">
        <div
          className="flex items-center justify-between rounded-t-lg px-6 py-4 text-xs text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center gap-3">
            {invoice.companyLogoDataUrl && (
              <Image
                src={invoice.companyLogoDataUrl}
                alt="Company logo"
                width={36}
                height={36}
                className="rounded-md object-contain"
              />
            )}
            <div>
              <p className="text-sm font-semibold">
                {invoice.company.name || "Your company"}
              </p>
              <p className="max-w-xs text-[11px] opacity-80">
                {invoice.company.address || "Company address"}
              </p>
              <p className="mt-0.5 text-[11px] opacity-80">
                {invoice.company.email}
              </p>
              <p className="text-[11px] opacity-80">{invoice.company.phone}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em]">
              Invoice
            </p>
            <p className="text-xs font-semibold">
              {invoice.meta.invoiceNumber || "INV-001"}
            </p>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 md:grid-cols-[1.4fr,1fr]">
          <div className="space-y-4 text-xs">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {invoice.company.name || "Your company"}
              </p>
              <p className="whitespace-pre-line text-[11px] text-slate-600">
                {invoice.company.address || "Company address"}
              </p>
              <p className="mt-1 text-[11px] text-slate-600">
                {invoice.company.email}
              </p>
              <p className="text-[11px] text-slate-600">
                {invoice.company.phone}
              </p>
              {invoice.company.taxId && (
                <p className="mt-1 text-[11px] text-slate-500">
                  Tax ID / VAT / GST: {invoice.company.taxId}
                </p>
              )}
            </div>

            <div className="mt-4 grid gap-4 rounded-md border bg-slate-50 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-500">
                    Billed by
                  </p>
                  <p className="mt-1 text-xs text-slate-800">
                    {invoice.company.name || "Your company"}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {invoice.company.email}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {invoice.company.phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-500">
                    Billed to
                  </p>
                  <p className="mt-1 text-xs text-slate-800">
                    {invoice.client.name || "Client name"}
                  </p>
                  <p className="whitespace-pre-line text-[11px] text-slate-600">
                    {invoice.client.address || "Client address"}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {invoice.client.email}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {invoice.client.phone}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-[11px]">
                <div>
                  <p className="text-slate-500">Issue date</p>
                  <p className="mt-0.5 text-slate-800">
                    {invoice.meta.issueDate}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Due date</p>
                  <p className="mt-0.5 text-slate-800">
                    {invoice.meta.dueDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500">Currency</p>
                  <p className="mt-0.5 text-slate-800">
                    {invoice.currency || "USD"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-md border bg-slate-50 px-4 py-3 text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-slate-500">Subtotal</p>
                <p className="font-medium">
                  {formatMoney(subtotal, invoice.currency)}
                </p>
              </div>
              {discountPercent > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-slate-500">
                    Discount ({discountPercent.toFixed(1)}%)
                  </p>
                  <p className="font-medium text-emerald-600">
                    -{formatMoney(discountAmount, invoice.currency)}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <p className="text-slate-500">
                  Tax ({(invoice.tax.rate * 100).toFixed(1)}%)
                </p>
                <p className="font-medium">
                  {formatMoney(taxAmount, invoice.currency)}
                </p>
              </div>
            </div>

            <div className="mt-3 border-t pt-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Total
                </p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: primaryColor }}
                >
                  {formatMoney(total, invoice.currency)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 text-xs">
          {invoice.notes && (
            <div className="mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Notes / terms
              </p>
              <p className="mt-1 whitespace-pre-line text-[11px] text-slate-700">
                {invoice.notes}
              </p>
            </div>
          )}

          {invoice.signatureDataUrl && (
            <div className="mt-4 flex items-end justify-between gap-6">
              <div className="h-px flex-1 bg-slate-200" />
              <div className="flex flex-col items-center gap-1">
                <Image
                  src={invoice.signatureDataUrl}
                  alt="Signature"
                  width={48}
                  height={48}
                  className="max-w-50 object-contain"
                />
                <p className="text-[10px] font-medium text-slate-500">
                  Authorized signature
                </p>
              </div>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-lg border bg-white p-8 shadow-sm">
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
              {invoice.meta.invoiceNumber || "INV-001"}
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
            {invoice.client.email || "—"}
          </p>
          <p className="text-[11px] text-slate-500">
            {invoice.client.phone || "—"}
          </p>
        </div>
        <div className="grid gap-1 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-500">Issue date</span>
            <span className="text-slate-800">
              {invoice.meta.issueDate || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Due date</span>
            <span className="text-slate-800">
              {invoice.meta.dueDate || "—"}
            </span>
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
              {formatMoney(subtotal, invoice.currency)}
            </span>
          </div>

          {discountPercent > 0 && (
            <div className="mt-1 flex justify-between">
              <span className="text-slate-500">
                Discount ({discountPercent.toFixed(1)}%)
              </span>
              <span className="text-emerald-600">
                -{formatMoney(discountAmount, invoice.currency)}
              </span>
            </div>
          )}

          <div className="mt-1 flex justify-between">
            <span className="text-slate-500">
              Tax ({(invoice.tax.rate * 100).toFixed(1)}%)
            </span>
            <span className="text-slate-800">
              {formatMoney(taxAmount, invoice.currency)}
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
                {formatMoney(total, invoice.currency)}
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
              width={48}
              height={48}
              className="mx-auto max-w-50 object-contain"
            />
            <p className="mt-1 text-[10px] font-medium text-slate-500">
              Authorized signature
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
