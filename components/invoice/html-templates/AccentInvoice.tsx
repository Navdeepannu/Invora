import type { InvoiceData } from "@/types/invoice";
import { formatMoney } from "@/lib/invoice/format";
import { computeInvoiceTotals } from "../utils/totals";

export type AccentInvoiceProps = {
  invoice: InvoiceData;
  width?: number;
  minHeight?: number;
};

export function AccentInvoice({
  invoice,
  width,
  minHeight,
}: AccentInvoiceProps) {
  const totals = computeInvoiceTotals(invoice);
  const accent = invoice.theme?.primaryColor ?? "#f97316";

  return (
    <div
      className="mx-auto"
      style={{
        width: width ?? 794,
        minHeight: minHeight ?? 560,
        maxWidth: "100%",
      }}
    >
      <div className="h-full overflow-hidden border border-neutral-200  bg-[#f7f7f7] rounded-xl">
        <div className="flex items-start justify-between  bg-[#f7f7f7] px-8 py-5">
          <div className="flex items-start gap-3">
            {invoice.companyLogoDataUrl && (
              <img
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
              <p className="text-xs font-normal text-gray-800">
                {invoice.company.website || "example.com"}
              </p>
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

        <div className="mx-4 mb-4 bg-white rounded-lg px-8 pb-8 pt-6 text-[13px] text-slate-900 border border-neutral-200">
          <div className="mb-12 flex items-start justify-between">
            <div>
              <p className="mb-1 text-[11px] text-slate-500">Billed to,</p>
              <p className="text-sm font-medium">
                {invoice.client.name || "Client name"}
              </p>
              <p className="whitespace-pre-line text-[11px] text-slate-600">
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

          <div className="mb-6">
            <div className="grid grid-cols-12 gap-4 border-b border-neutral-200 pb-2 text-[11px] font-semibold uppercase text-slate-500">
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
                    className="grid grid-cols-12 gap-4 border-b border-neutral-200 py-3 last:border-b-0"
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
              <div className="grid grid-cols-12 gap-4 border-t border-neutral-200 pt-2 font-medium">
                <div className="col-span-10 text-right text-neutral-800">
                  Total
                </div>
                <div className="col-span-2 text-right text-neutra-800">
                  {formatMoney(totals.total, invoice.currency)}
                </div>
              </div>
            </div>
          </div>

          {invoice.signatureDataUrl && (
            <div className="mt-8 flex flex-col items-end">
              <img
                src={invoice.signatureDataUrl}
                alt="Authorized signature"
                width={120}
                height={48}
                className="max-h-14 max-w-35 object-contain"
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

        {invoice.notes && (
          <div className=" bg-[#f7f7f7] px-8 py-5 text-[11px] text-slate-600">
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
