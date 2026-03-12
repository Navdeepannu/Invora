import type { InvoiceData } from "@/types/invoice";
import { formatMoney } from "@/lib/invoice/format";
import { computeInvoiceTotals } from "../utils/totals";

export type ModernInvoiceProps = {
  invoice: InvoiceData;
  width?: number;
  minHeight?: number;
};

export function ModernInvoice({
  invoice,
  width,
  minHeight,
}: ModernInvoiceProps) {
  const totals = computeInvoiceTotals(invoice);
  const primaryColor = invoice.theme?.primaryColor ?? "#0f172a";

  return (
    <div
      className="mx-auto border border-neutral-200 bg-white text-[12px]"
      style={{
        width: width ?? 794,
        minHeight: minHeight ?? 560,
        maxWidth: "100%",
      }}
    >
      {/* HEADER */}
      <div
        className="px-8 py-6 flex justify-between items-start border-b"
        style={{ borderColor: "#e5e7eb" }}
      >
        <div className="flex items-center gap-4">
          {invoice.companyLogoDataUrl && (
            <img
              src={invoice.companyLogoDataUrl}
              alt="Company logo"
              className="w-12 h-12 object-contain"
            />
          )}

          <div>
            <p className="font-semibold text-[14px] text-slate-900">
              {invoice.company.name || "Your Company"}
            </p>

            <p className="text-[11px] text-slate-500 whitespace-pre-line">
              {invoice.company.address || "Company address"}
            </p>

            <p className="text-[11px] text-slate-500">
              {invoice.company.email || "—"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <h1
            className="text-[26px] font-bold tracking-wide"
            style={{ color: primaryColor }}
          >
            INVOICE
          </h1>

          <p className="mt-1 text-[13px] font-semibold text-slate-800">
            {invoice.meta.invoiceNumber || "INV-2026"}
          </p>
        </div>
      </div>

      {/* META */}
      <div className="px-8 py-5 grid grid-cols-3 gap-6 border-b border-neutral-200">
        <div>
          <p className="text-[10px] uppercase text-slate-400 font-semibold">
            Issue Date
          </p>
          <p className="mt-1 font-medium text-slate-800">
            {invoice.meta.issueDate}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase text-slate-400 font-semibold">
            Due Date
          </p>
          <p className="mt-1 font-medium text-slate-800">
            {invoice.meta.dueDate}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase text-slate-400 font-semibold">
            Currency
          </p>
          <p className="mt-1 font-medium text-slate-800">
            {invoice.currency || "USD"}
          </p>
        </div>
      </div>

      {/* BILLING SECTION */}
      {/* BILLING SECTION */}
      <div className="px-8 py-6 grid grid-cols-2 gap-8">
        {/* Billed By */}
        <div className="border border-neutral-200 bg-neutral-50 rounded-md p-4">
          <p className="text-[11px] uppercase font-semibold text-slate-500 mb-2">
            Billed By
          </p>

          <p className="font-semibold text-slate-900">
            {invoice.company.name || "Company"}
          </p>

          <p className="text-slate-500 whitespace-pre-line mt-1">
            {invoice.company.address || "Address"}
          </p>

          <p className="text-slate-500">{invoice.company.email || "—"}</p>

          <p className="text-slate-500">{invoice.company.phone || "—"}</p>

          {invoice.company.taxId && (
            <p className="text-slate-500 mt-1">
              Tax ID: {invoice.company.taxId}
            </p>
          )}
        </div>

        {/* Billed To */}
        <div className="border border-neutral-200 bg-neutral-50 rounded-md p-4">
          <p className="text-[11px] uppercase font-semibold text-slate-500 mb-2">
            Billed To
          </p>

          <p className="font-semibold text-slate-900">
            {invoice.client.name || "Client name"}
          </p>

          <p className="text-slate-500 whitespace-pre-line mt-1">
            {invoice.client.address || "Client address"}
          </p>

          <p className="text-slate-500">{invoice.client.email || "—"}</p>

          <p className="text-slate-500">{invoice.client.phone || "—"}</p>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div className="px-8 pb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-[11px] uppercase text-slate-500 border-b border-neutral-200">
              <th className="py-3">Item</th>
              <th className="py-3 text-right">Qty</th>
              <th className="py-3 text-right">Price</th>
              <th className="py-3 text-right">Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.lineItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-400">
                  No items added
                </td>
              </tr>
            ) : (
              invoice.lineItems.map((item) => {
                const amount = item.quantity * item.unitPrice;

                return (
                  <tr
                    key={item.id}
                    className="border-b last:border-none"
                    style={{ borderColor: "#f1f5f9" }}
                  >
                    <td className="py-3 font-medium text-slate-900">
                      {item.description || "Item"}
                    </td>

                    <td className="py-3 text-right text-slate-600">
                      {item.quantity}
                    </td>

                    <td className="py-3 text-right text-slate-600">
                      {formatMoney(item.unitPrice, invoice.currency)}
                    </td>

                    <td className="py-3 text-right font-semibold text-slate-900">
                      {formatMoney(amount, invoice.currency)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* TOTALS */}
      <div className="flex justify-end px-8 py-6">
        <div className="w-[260px] text-[12px]">
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-medium">
              {formatMoney(totals.subtotal, invoice.currency)}
            </span>
          </div>

          {totals.discountPercent > 0 && (
            <div className="flex justify-between py-1 text-emerald-600">
              <span>Discount ({totals.discountPercent.toFixed(1)}%)</span>

              <span>
                -{formatMoney(totals.discountAmount, invoice.currency)}
              </span>
            </div>
          )}

          <div className="flex justify-between py-1">
            <span className="text-slate-500">
              Tax ({(invoice.tax.rate * 100).toFixed(1)}%)
            </span>

            <span>{formatMoney(totals.taxAmount, invoice.currency)}</span>
          </div>

          <div className="mt-3 border-t pt-3 flex justify-between text-[14px] font-bold">
            <span>Total</span>

            <span style={{ color: primaryColor }}>
              {formatMoney(totals.total, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* NOTES */}
      {invoice.notes && (
        <div className="border-t border-neutral-200 px-8 py-5">
          <p className="text-[11px] uppercase text-slate-400 font-semibold mb-1">
            Notes
          </p>

          <p className="text-slate-600 whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}

      {/* SIGNATURE */}
      {invoice.signatureDataUrl && (
        <div className="px-8 py-6 border-t border-neutral-200 flex flex-col items-center">
          <img
            src={invoice.signatureDataUrl}
            alt="Signature"
            className="max-h-20 object-contain"
          />

          <p className="text-[11px] text-slate-400 mt-2 uppercase tracking-wide">
            Authorized Signature
          </p>
        </div>
      )}
    </div>
  );
}
