"use client";

/**
 * Minimal layout for the web preview (mirrors MinimalTemplate PDF).
 */
import type { InvoiceData } from "@/types/invoice";
import Image from "next/image";
import { formatMoney } from "@/lib/invoice/format";
import { computeInvoiceTotals } from "../utils/totals";

export type MinimalPreviewProps = {
  invoice: InvoiceData;
  previewWidth: number;
  previewMinHeight: number;
};

export function MinimalPreview({
  invoice,
  previewWidth,
  previewMinHeight,
}: MinimalPreviewProps) {
  const totals = computeInvoiceTotals(invoice);
  const primaryColor = invoice.theme?.primaryColor ?? "#4f46e5";

  return (
    <div
      className="mx-auto"
      style={{ width: previewWidth, minHeight: previewMinHeight, maxWidth: "100%" }}
    >
      <div className="w-full max-w-[620px] overflow-hidden border bg-white">
        {/* Main content */}
        <div className="px-10 pt-10 pb-8">
          {/* Header */}
          <div className="mb-10 flex items-start justify-between">
            <div>
              <h1 className="text-[32px] font-bold leading-none tracking-tight text-black">
                INVOICE
              </h1>
              <p className="mt-1 text-[13px] text-[#888]">
                {invoice.meta.invoiceNumber || "#INV-001"}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center">
              {invoice.companyLogoDataUrl && (
                <Image
                  src={invoice.companyLogoDataUrl}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              )}
            </div>
          </div>

          {/* Info grid */}
          <div className="mb-8 grid grid-cols-3 gap-6 border-b border-[#e8e8e8] pb-8 text-[13px]">
            <div>
              <p className="mb-1 text-[11px] font-semibold text-black">Issued</p>
              <p className="mb-4 text-[#555]">{invoice.meta.issueDate}</p>
              <p className="mb-1 text-[11px] font-semibold text-black">Due</p>
              <p className="text-[#555]">{invoice.meta.dueDate}</p>
            </div>
            <div>
              <p className="mb-1 text-[11px] font-semibold text-black">Billed to</p>
              <p className="leading-relaxed text-[#555] whitespace-pre-line">
                {invoice.client.name || "Client name"}
                {"\n"}
                {invoice.client.address || "Client address"}
                {"\n"}
                {invoice.client.phone || "+0 (000) 123-4567"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[11px] font-semibold text-black">From</p>
              <p className="leading-relaxed text-[#555] whitespace-pre-line">
                {invoice.company.name || "Your company"}
                {"\n"}
                {invoice.company.address || "Business address"}
                {invoice.company.taxId && `\nTAX ID ${invoice.company.taxId}`}
              </p>
            </div>
          </div>

          {/* Services table */}
          <div className="mb-6 text-[13px]">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-[#e8e8e8] pb-3 text-[11px] font-semibold text-black">
              <p>Service</p>
              <p className="w-10 text-center">Qty</p>
              <p className="w-20 text-right">Rate</p>
              <p className="w-20 text-right">Line total</p>
            </div>

            {invoice.lineItems.length === 0 ? (
              <div className="py-6 text-center text-[12px] text-[#999]">
                No items added yet.
              </div>
            ) : (
              invoice.lineItems.map((item) => {
                const amount = item.quantity * item.unitPrice;
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-[#f0f0f0] py-4"
                  >
                    <div>
                      <p className="font-semibold text-black">
                        {item.description || "Service"}
                      </p>
                    </div>
                    <p className="w-10 text-center text-[#555]">{item.quantity}</p>
                    <p className="w-20 text-right text-[#555]">
                      {formatMoney(item.unitPrice, invoice.currency)}
                    </p>
                    <p className="w-20 text-right text-[#555]">
                      {formatMoney(amount, invoice.currency)}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-[260px] text-[13px]">
              <div className="flex justify-between py-2">
                <p className="text-[#555]">Subtotal</p>
                <p className="text-[#555]">
                  {formatMoney(totals.subtotal, invoice.currency)}
                </p>
              </div>
              <div className="flex justify-between border-b border-[#e8e8e8] py-2">
                <p className="text-[#555]">
                  Tax ({(invoice.tax.rate * 100).toFixed(1)}%)
                </p>
                <p className="text-[#555]">
                  {formatMoney(totals.taxAmount, invoice.currency)}
                </p>
              </div>
              <div className="flex justify-between border-b border-[#e8e8e8] py-2">
                <p className="font-semibold text-black">Total</p>
                <p className="font-semibold text-black">
                  {formatMoney(totals.total, invoice.currency)}
                </p>
              </div>
              <div className="flex justify-between border-b-2 pb-2 pt-3" style={{ borderColor: primaryColor }}>
                <p
                  className="font-semibold"
                  style={{ color: primaryColor }}
                >
                  Amount due
                </p>
                <p
                  className="font-semibold"
                  style={{ color: primaryColor }}
                >
                  {formatMoney(totals.total, invoice.currency)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Thank you section */}
        <div className="border-t border-[#e8e8e8] px-10 py-6">
          <p className="mb-1 text-[13px] font-bold text-black">
            Thank you for the business!
          </p>
          {invoice.notes && (
            <p className="mt-2 whitespace-pre-line text-[12px] text-[#666]">
              {invoice.notes}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#e8e8e8] px-10 py-4 text-[11px] text-[#999]">
          <p>{invoice.company.name || ""}</p>
          <p>{invoice.company.phone || ""}</p>
          <p>{invoice.company.email || ""}</p>
        </div>
      </div>
    </div>
  );
}

