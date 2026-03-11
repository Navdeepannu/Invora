"use client";

/**
 * Modern layout for invoice PDF. Used by @react-pdf/renderer.
 * Top left: invoice details (number, issue date, due date, currency). Two boxes (Billed by | Billed to). Table, totals, notes, signature.
 */
import { Page, View, Text, Image } from "@react-pdf/renderer";
import type { InvoiceData } from "@/types/invoice";
import { formatMoney } from "@/lib/invoice/format";
import { computeInvoiceTotals } from "../utils/totals";
import { classicStyles } from "../styles/classicStyles";
import { modernStyles } from "../styles/modernStyles";

export type ModernTemplateProps = { invoice: InvoiceData };

export function ModernTemplate({ invoice }: ModernTemplateProps) {
  const primaryColor = invoice.theme?.primaryColor ?? "#0f172a";
  const totals = computeInvoiceTotals(invoice);
  const s = modernStyles;
  const base = classicStyles;

  return (
    <Page size="A4" style={s.page}>
      {/* Top left: logo + invoice details (no background) */}
      <View style={s.invoiceDetailsTop}>
        <View style={s.invoiceDetailsRowWithLogo}>
          {invoice.companyLogoDataUrl && (
            <Image
              src={invoice.companyLogoDataUrl}
              style={s.invoiceDetailsLogo}
            />
          )}
          <View style={s.invoiceDetailsBlock}>
            <Text style={s.invoiceDetailsLabel}>INVOICE</Text>
            <Text style={s.invoiceDetailsNumber}>
              {invoice.meta.invoiceNumber || "INV-2026"}
            </Text>
            <View style={s.invoiceDetailsRow}>
              <View>
                <Text style={base.metaLabel}>Issue date</Text>
                <Text style={base.metaValue}>{invoice.meta.issueDate}</Text>
              </View>
              <View>
                <Text style={base.metaLabel}>Due date</Text>
                <Text style={base.metaValue}>{invoice.meta.dueDate}</Text>
              </View>
              <View>
                <Text style={base.metaLabel}>Currency</Text>
                <Text style={base.metaValue}>{invoice.currency || "USD"}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Two boxes: Billed by (left), Billed to (right) */}
      <View style={s.billedSection}>
        <View style={s.billedBox}>
          <Text style={s.billedBoxLabel}>Billed by</Text>
          <Text style={[s.billedBoxContent, { fontWeight: "bold", marginBottom: 4 }]}>
            {invoice.company.name || "Your company"}
          </Text>
          <Text style={[s.billedBoxContent, { marginBottom: 2 }]}>
            {invoice.company.address || "Company address"}
          </Text>
          <Text style={[s.billedBoxContent, { marginBottom: 2 }]}>
            {invoice.company.email || "—"}
          </Text>
          <Text style={s.billedBoxContent}>
            {invoice.company.phone || "—"}
          </Text>
          {invoice.company.taxId ? (
            <Text style={[s.billedBoxContent, { marginTop: 4 }]}>
              Tax ID / VAT / GST: {invoice.company.taxId}
            </Text>
          ) : null}
        </View>
        <View style={s.billedBox}>
          <Text style={s.billedBoxLabel}>Billed to</Text>
          <Text style={[s.billedBoxContent, { fontWeight: "bold", marginBottom: 4 }]}>
            {invoice.client.name || "Client name"}
          </Text>
          <Text style={[s.billedBoxContent, { marginBottom: 2 }]}>
            {invoice.client.address || "Client address"}
          </Text>
          <Text style={[s.billedBoxContent, { marginBottom: 2 }]}>
            {invoice.client.email || "—"}
          </Text>
          <Text style={s.billedBoxContent}>
            {invoice.client.phone || "—"}
          </Text>
        </View>
      </View>

      {/* Items table */}
      <View style={base.table}>
        <View style={base.tableHeader}>
          <Text style={[base.tableHeaderCell, base.colItem]}>Item</Text>
          <Text style={[base.tableHeaderCell, base.colQty]}>Quantity</Text>
          <Text style={[base.tableHeaderCell, base.colPrice]}>Price</Text>
          <Text style={[base.tableHeaderCell, base.colTotal]}>Total</Text>
        </View>
        {invoice.lineItems.length === 0 ? (
          <View style={[base.tableRow, { justifyContent: "center" }]}>
            <Text style={[base.tableCell, { color: "#94a3b8" }]}>
              No items added yet.
            </Text>
          </View>
        ) : (
          invoice.lineItems.map((item) => {
            const amount = item.quantity * item.unitPrice;
            return (
              <View key={item.id} style={base.tableRow}>
                <Text style={[base.tableCell, base.colItem]}>
                  {item.description || "Item description"}
                </Text>
                <Text style={[base.tableCell, base.colQty]}>
                  {item.quantity}
                </Text>
                <Text style={[base.tableCell, base.colPrice]}>
                  {formatMoney(item.unitPrice, invoice.currency)}
                </Text>
                <Text style={[base.tableCell, base.colTotal]}>
                  {formatMoney(amount, invoice.currency)}
                </Text>
              </View>
            );
          })
        )}
      </View>

      {/* Totals: right-aligned */}
      <View style={s.totalsBlock}>
        <View style={base.totalRow}>
          <Text style={base.metaLabel}>Subtotal</Text>
          <Text style={base.metaValue}>
            {formatMoney(totals.subtotal, invoice.currency)}
          </Text>
        </View>
        {totals.discountPercent > 0 && (
          <View style={base.totalRow}>
            <Text style={base.metaLabel}>
              Discount ({totals.discountPercent.toFixed(1)}%)
            </Text>
            <Text style={{ color: "#059669" }}>
              -{formatMoney(totals.discountAmount, invoice.currency)}
            </Text>
          </View>
        )}
        <View style={base.totalRow}>
          <Text style={base.metaLabel}>
            Tax ({(invoice.tax.rate * 100).toFixed(1)}%)
          </Text>
          <Text style={base.metaValue}>
            {formatMoney(totals.taxAmount, invoice.currency)}
          </Text>
        </View>
        <View style={base.totalDivider} />
        <View style={base.totalFinal}>
          <Text style={base.labelSmall}>TOTAL</Text>
          <Text style={{ color: primaryColor }}>
            {formatMoney(totals.total, invoice.currency)}
          </Text>
        </View>
      </View>

      {/* Notes / terms */}
      {invoice.notes ? (
        <View style={base.notesSection}>
          <Text style={base.notesLabel}>Notes / terms</Text>
          <Text>{invoice.notes}</Text>
        </View>
      ) : null}

      {/* Signature centered */}
      {invoice.signatureDataUrl ? (
        <View style={[base.signatureSection, s.signatureCenter]}>
          <Image
            src={invoice.signatureDataUrl}
            style={base.signatureImage}
          />
          <Text style={base.signatureLabel}>Authorized signature</Text>
        </View>
      ) : null}
    </Page>
  );
}
