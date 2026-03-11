"use client";

/**
 * Minimal invoice template — web preview component.
 * Clean, typographic layout inspired by the Figma "Invoice" design.
 * Columns: Issued/Due | Billed to | From. Table: Service · Qty · Rate · Line total.
 * Amount due highlighted in accent colour with underline. Thank-you footer bar.
 */
import type { InvoiceData } from "@/types/invoice";
import Image from "next/image";
import { formatMoney } from "@/lib/invoice/format";
import { computeInvoiceTotals } from "@/components/invoice/utils/totals";

export type MinimalTemplateProps = {
  invoice: InvoiceData;
  previewWidth: number;
  previewMinHeight: number;
};

export function MinimalTemplate({
  invoice,
  previewWidth,
  previewMinHeight,
}: MinimalTemplateProps) {
  const totals = computeInvoiceTotals(invoice);
  const accentColor = invoice.theme?.primaryColor ?? "#4f46e5";

  return (
    <div
      className="invoice-wrapper"
      style={{ width: previewWidth, minHeight: previewMinHeight, maxWidth: "100%" }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="invoice-header">
        <div className="invoice-title-block">
          <h1 className="invoice-title">INVOICE</h1>
          <p className="invoice-number">
            {invoice.meta.invoiceNumber ? `#${invoice.meta.invoiceNumber}` : "#INV-2026"}
          </p>
        </div>

        {invoice.companyLogoDataUrl ? (
          <Image
            src={invoice.companyLogoDataUrl}
            alt="Company logo"
            width={44}
            height={44}
            className="invoice-logo-img"
          />
        ) : (
          <div className="invoice-logo-placeholder" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </header>

      {/* ── Meta row: Issued/Due · Billed to · From ─────────────────────── */}
      <section className="invoice-meta-section">
        {/* Dates */}
        <div className="invoice-meta-col">
          <div className="invoice-meta-item">
            <p className="meta-label">Issued</p>
            <p className="meta-value">{invoice.meta.issueDate || "01 Jan, 2025"}</p>
          </div>
          <div className="invoice-meta-item">
            <p className="meta-label">Due</p>
            <p className="meta-value">{invoice.meta.dueDate || "15 Jan, 2025"}</p>
          </div>
        </div>

        {/* Billed to */}
        <div className="invoice-meta-col invoice-meta-col--bordered">
          <p className="meta-label">Billed to</p>
          <p className="meta-value meta-value--name">
            {invoice.client.name || "Company Name"}
          </p>
          <p className="meta-address">
            {invoice.client.address || "Company address\nCity, Country – 00000"}
          </p>
          {invoice.client.phone && (
            <p className="meta-address">{invoice.client.phone}</p>
          )}
        </div>

        {/* From */}
        <div className="invoice-meta-col">
          <p className="meta-label">From</p>
          <p className="meta-value meta-value--name">
            {invoice.company.name || "Your Name"}
          </p>
          <p className="meta-address">
            {invoice.company.address || "Business address\nCity, State – 000 000"}
          </p>
          {invoice.company.taxId && (
            <p className="meta-address">TAX ID {invoice.company.taxId}</p>
          )}
        </div>
      </section>

      {/* ── Line-items table ────────────────────────────────────────────── */}
      <section className="invoice-table-section">
        <table className="invoice-table">
          <thead>
            <tr className="invoice-table-head-row">
              <th className="table-cell table-cell--service table-cell--header">Service</th>
              <th className="table-cell table-cell--qty table-cell--header">Qty</th>
              <th className="table-cell table-cell--rate table-cell--header">Rate</th>
              <th className="table-cell table-cell--total table-cell--header">Line total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="table-empty-state">
                  No items added yet.
                </td>
              </tr>
            ) : (
              invoice.lineItems.map((item) => {
                const lineTotal = item.quantity * item.unitPrice;
                return (
                  <tr key={item.id} className="invoice-table-row">
                    <td className="table-cell table-cell--service">
                      <p className="line-item-name">
                        {item.description || "Service name"}
                      </p>
                    </td>
                    <td className="table-cell table-cell--qty">{item.quantity}</td>
                    <td className="table-cell table-cell--rate">
                      {formatMoney(item.unitPrice, invoice.currency)}
                    </td>
                    <td className="table-cell table-cell--total">
                      {formatMoney(lineTotal, invoice.currency)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      {/* ── Totals ──────────────────────────────────────────────────────── */}
      <section className="invoice-totals-section">
        <div className="invoice-totals">
          <div className="totals-row">
            <span className="totals-label">Subtotal</span>
            <span className="totals-value">
              {formatMoney(totals.subtotal, invoice.currency)}
            </span>
          </div>

          {totals.discountPercent > 0 && (
            <div className="totals-row">
              <span className="totals-label">
                Discount ({totals.discountPercent.toFixed(1)}%)
              </span>
              <span className="totals-value totals-value--discount">
                -{formatMoney(totals.discountAmount, invoice.currency)}
              </span>
            </div>
          )}

          <div className="totals-row">
            <span className="totals-label">
              Tax ({(invoice.tax.rate * 100).toFixed(1)}%)
            </span>
            <span className="totals-value">
              {formatMoney(totals.taxAmount, invoice.currency)}
            </span>
          </div>

          <div className="totals-row totals-row--total">
            <span className="totals-label totals-label--total">Total</span>
            <span className="totals-value totals-value--total">
              {formatMoney(totals.total, invoice.currency)}
            </span>
          </div>

          <div className="totals-row totals-row--amount-due">
            <span
              className="totals-label totals-label--amount-due"
              style={{ color: accentColor }}
            >
              Amount due
            </span>
            <span
              className="totals-value totals-value--amount-due"
              style={{ color: accentColor, borderBottomColor: accentColor }}
            >
              {invoice.currency || "US$"} {formatMoney(totals.total, invoice.currency)}
            </span>
          </div>
        </div>
      </section>

      {/* ── Thank-you note ───────────────────────────────────────────────── */}
      {invoice.notes && (
        <section className="invoice-thankyou-section">
          <div className="thankyou-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="0.5" y="0.5" width="13" height="13" rx="2.5" stroke="#64748b" />
              <path
                d="M3 7l3 3 5-5"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="thankyou-heading">Thank you for the business!</p>
            <p className="thankyou-body">{invoice.notes}</p>
          </div>
        </section>
      )}

      {/* ── Footer bar ───────────────────────────────────────────────────── */}
      <footer className="invoice-footer">
        <span className="footer-item">{invoice.company.name || "Your Company"}</span>
        {invoice.company.phone && (
          <span className="footer-item">{invoice.company.phone}</span>
        )}
        {invoice.company.email && (
          <span className="footer-item">{invoice.company.email}</span>
        )}
      </footer>

      {/* ── Signature ───────────────────────────────────────────────────── */}
      {invoice.signatureDataUrl && (
        <div className="invoice-signature">
          <Image
            src={invoice.signatureDataUrl}
            alt="Authorized signature"
            width={140}
            height={60}
            className="signature-image"
          />
          <p className="signature-label">Authorized signature</p>
        </div>
      )}

      <style>{`
        .invoice-wrapper {
          background: #fff;
          border-radius: 10px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #0f172a;
        }

        /* Header */
        .invoice-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 32px 36px 20px;
        }
        .invoice-title {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1;
          margin: 0;
          color: #0f172a;
        }
        .invoice-number {
          font-size: 11px;
          color: #94a3b8;
          margin: 4px 0 0;
        }
        .invoice-logo-img {
          border-radius: 6px;
          object-fit: contain;
        }
        .invoice-logo-placeholder {
          width: 44px;
          height: 44px;
          background: #1e293b;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        /* Meta section */
        .invoice-meta-section {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          padding: 18px 36px;
        }
        .invoice-meta-col {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .invoice-meta-col--bordered {
          border-left: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
          padding: 0 20px;
        }
        .invoice-meta-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .meta-label {
          font-size: 10px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin: 0;
        }
        .meta-value {
          font-size: 11px;
          color: #334155;
          margin: 2px 0 0;
        }
        .meta-value--name {
          font-weight: 600;
          color: #0f172a;
        }
        .meta-address {
          font-size: 10.5px;
          color: #64748b;
          margin: 1px 0 0;
          white-space: pre-line;
        }

        /* Table */
        .invoice-table-section {
          padding: 20px 36px 0;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }
        .invoice-table-head-row {
          border-bottom: 1px solid #e2e8f0;
        }
        .table-cell {
          padding: 8px 6px;
          color: #334155;
        }
        .table-cell--header {
          font-size: 10px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-align: left;
        }
        .table-cell--service {
          width: 50%;
          text-align: left;
        }
        .table-cell--qty {
          text-align: center;
        }
        .table-cell--rate {
          text-align: right;
        }
        .table-cell--total {
          text-align: right;
        }
        .invoice-table-row {
          border-bottom: 1px solid #f1f5f9;
        }
        .invoice-table-row:last-child {
          border-bottom: none;
        }
        .line-item-name {
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 2px;
        }
        .line-item-desc {
          color: #64748b;
          font-size: 10.5px;
          margin: 0;
        }
        .table-empty-state {
          text-align: center;
          padding: 24px 12px;
          color: #94a3b8;
          font-size: 11px;
        }

        /* Totals */
        .invoice-totals-section {
          display: flex;
          justify-content: flex-end;
          padding: 16px 36px 20px;
        }
        .invoice-totals {
          width: 240px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .totals-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
        }
        .totals-label {
          color: #64748b;
        }
        .totals-value {
          color: #334155;
        }
        .totals-value--discount {
          color: #059669;
        }
        .totals-row--total {
          padding-top: 8px;
          border-top: 1px solid #e2e8f0;
          margin-top: 4px;
        }
        .totals-label--total {
          font-weight: 600;
          color: #0f172a;
        }
        .totals-value--total {
          font-weight: 700;
          font-size: 13px;
          color: #0f172a;
        }
        .totals-row--amount-due {
          padding-top: 6px;
          margin-top: 2px;
        }
        .totals-label--amount-due {
          font-weight: 600;
          font-size: 11px;
        }
        .totals-value--amount-due {
          font-weight: 700;
          font-size: 13px;
          border-bottom: 2px solid;
          padding-bottom: 2px;
        }

        /* Thank-you */
        .invoice-thankyou-section {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          border-top: 1px solid #e2e8f0;
          padding: 16px 36px 20px;
        }
        .thankyou-icon {
          margin-top: 1px;
          flex-shrink: 0;
        }
        .thankyou-heading {
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 3px;
        }
        .thankyou-body {
          font-size: 10.5px;
          color: #64748b;
          margin: 0;
        }

        /* Footer bar */
        .invoice-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #e2e8f0;
          padding: 12px 36px;
          background: #fafafa;
        }
        .footer-item {
          font-size: 10px;
          color: #94a3b8;
        }

        /* Signature */
        .invoice-signature {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding: 16px 36px;
          border-top: 1px solid #e2e8f0;
        }
        .signature-image {
          max-height: 64px;
          max-width: 160px;
          object-fit: contain;
        }
        .signature-label {
          font-size: 10px;
          color: #94a3b8;
          margin: 6px 0 0;
          letter-spacing: 0.04em;
        }
      `}</style>
    </div>
  );
}
