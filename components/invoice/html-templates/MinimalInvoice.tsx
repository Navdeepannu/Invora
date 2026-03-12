import type { InvoiceData } from "@/types/invoice";
import { formatMoney } from "@/lib/invoice/format";
import { computeInvoiceTotals } from "../utils/totals";

export type MinimalInvoiceProps = {
  invoice: InvoiceData;
  width?: number;
  minHeight?: number;
};

export function MinimalInvoice({
  invoice,
  width,
  minHeight,
}: MinimalInvoiceProps) {
  const totals = computeInvoiceTotals(invoice);
  const primaryColor = invoice.theme?.primaryColor ?? "#4f46e5";

  return (
    <div
      className="mx-auto"
      style={{
        width: width ?? 794,
        minHeight: minHeight ?? 560,
        maxWidth: "100%",
      }}
    >
      <div
        className="flex w-full flex-col overflow-hidden bg-white"
        style={{ minHeight: minHeight ?? 560 }}
      >
        <div className="flex-1 px-12 pt-12 pb-6">
          {/* ── Header ── */}
          <div className="mb-12 flex items-start justify-between">
            <div>
              <h1 className="text-[38px] font-extrabold leading-none tracking-tight text-[#111]">
                INVOICE
              </h1>
              <p className="mt-1.5 text-[13px] text-[#999]">
                {invoice.meta.invoiceNumber || "#INV-001"}
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center">
              {invoice.companyLogoDataUrl && (
                <img
                  src={invoice.companyLogoDataUrl}
                  alt="Logo"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              )}
            </div>
          </div>

          {/* ── Info block: Dates / Billed to / From ── */}
          <div className="mb-12 grid grid-cols-3 border-y border-[#e0e0e0] text-[13px]">
            <div className="border-r border-[#e0e0e0] px-5 py-4">
              <p className="mb-0.5 text-[11px] font-bold text-[#222]">Issued</p>
              <p className="mb-5 text-[13px] leading-snug text-[#555]">
                {invoice.meta.issueDate}
              </p>
              <p className="mb-0.5 text-[11px] font-bold text-[#222]">Due</p>
              <p className="text-[13px] leading-snug text-[#555]">
                {invoice.meta.dueDate}
              </p>
            </div>

            <div className="border-r border-[#e0e0e0] px-5 py-4">
              <p className="mb-0.5 text-[11px] font-bold text-[#222]">
                Billed to
              </p>
              <div className="text-[13px] leading-relaxed text-[#555]">
                <p className="font-semibold text-[#222]">
                  {invoice.client.name || "Client name"}
                </p>
                <p>{invoice.client.address || "Client address"}</p>
                <p>{invoice.client.phone || "+0 (000) 123-4567"}</p>
              </div>
            </div>

            <div className="px-5 py-4">
              <p className="mb-0.5 text-[11px] font-bold text-[#222]">From</p>
              <div className="text-[13px] leading-relaxed text-[#555]">
                <p className="font-semibold text-[#222]">
                  {invoice.company.name || "Your company"}
                </p>
                <p>{invoice.company.address || "Business address"}</p>
                {invoice.company.taxId && <p>TAX ID {invoice.company.taxId}</p>}
              </div>
            </div>
          </div>

          {/* ── Line items table ── */}
          <div className="mb-8 text-[13px]">
            <div className="grid grid-cols-[1fr_64px_96px_104px] gap-x-4 border-b border-[#d4d4d4] pb-3 text-[11px] font-bold text-[#222]">
              <p>Service</p>
              <p className="text-center">Qty</p>
              <p className="text-right">Rate</p>
              <p className="text-right">Line total</p>
            </div>

            {invoice.lineItems.length === 0 ? (
              <div className="py-10 text-center text-[12px] text-[#bbb]">
                No items added yet.
              </div>
            ) : (
              invoice.lineItems.map((item) => {
                const amount = item.quantity * item.unitPrice;
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_64px_96px_104px] items-baseline gap-x-4 border-b border-[#f0f0f0] py-5"
                  >
                    <div>
                      <p className="font-semibold text-[#111]">
                        {item.description || "Service"}
                      </p>
                    </div>
                    <p className="text-center text-[#666]">{item.quantity}</p>
                    <p className="text-right text-[#666]">
                      {formatMoney(item.unitPrice, invoice.currency)}
                    </p>
                    <p className="text-right text-[#666]">
                      {formatMoney(amount, invoice.currency)}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Totals ── */}
          <div className="flex justify-end">
            <div className="w-70 text-[13px]">
              <div className="flex justify-between py-2.5">
                <p className="font-bold text-[#222]">Subtotal</p>
                <p className="text-[#555]">
                  {formatMoney(totals.subtotal, invoice.currency)}
                </p>
              </div>
              <div className="flex justify-between py-2.5">
                <p className="text-[#555]">
                  Tax ({(invoice.tax.rate * 100).toFixed(1)}%)
                </p>
                <p className="text-[#555]">
                  {formatMoney(totals.taxAmount, invoice.currency)}
                </p>
              </div>
              <div className="flex justify-between py-2.5">
                <p className="font-bold text-[#111]">Total</p>
                <p className="font-bold text-[#111]">
                  {formatMoney(totals.total, invoice.currency)}
                </p>
              </div>
              <div
                className="flex justify-between border-y py-3"
                style={{ borderColor: primaryColor }}
              >
                <p className="font-bold" style={{ color: primaryColor }}>
                  Amount due
                </p>
                <p className="font-bold" style={{ color: primaryColor }}>
                  {formatMoney(totals.total, invoice.currency)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Notes ── */}
        <div className="mt-auto border-t border-[#e8e8e8] px-12 py-7">
          <p className="text-[14px] font-bold text-[#111]">
            Thank you for the business!
          </p>
          {invoice.notes && (
            <p className="mt-2 whitespace-pre-line text-[12px] leading-relaxed text-[#777]">
              {invoice.notes}
            </p>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e8e8e8] px-12 py-5 text-[11px] text-[#999]">
          <p>{invoice.company.name || ""}</p>
          <div className="flex items-center gap-5">
            {invoice.company.phone && <p>{invoice.company.phone}</p>}
            {invoice.company.phone && invoice.company.email && (
              <span className="text-[#d4d4d4]">|</span>
            )}
            {invoice.company.email && <p>{invoice.company.email}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
