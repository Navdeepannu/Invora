"use client";

/**
 * Classic layout for invoice PDF. Used by @react-pdf/renderer.
 * Layout and structure only; receives invoice data as props.
 */
import { Page, View, Text, Image } from "@react-pdf/renderer";
import type { InvoiceData } from "@/types/invoice";
import { formatMoney } from "@/lib/invoice/format";
import { computeInvoiceTotals } from "../utils/totals";
import { classicStyles } from "../styles/classicStyles";

export type ClassicTemplateProps = { invoice: InvoiceData };

export function ClassicTemplate({ invoice }: ClassicTemplateProps) {
  const primaryColor = invoice.theme?.primaryColor ?? "#0f172a";
  const totals = computeInvoiceTotals(invoice);
  const s = classicStyles;

  return (
    <Page size="A4" style={s.page}>
      <View style={s.headerRow}>
        <View style={s.logoAndTitle}>
          {invoice.companyLogoDataUrl && (
            <Image
              src={invoice.companyLogoDataUrl}
              style={{ width: 40, height: 40, borderRadius: 4 }}
            />
          )}
          <View>
            <Text style={[s.labelSmall, { color: primaryColor }]}>Invoice</Text>
            <Text style={s.titleLarge}>
              {invoice.meta.invoiceNumber || "INV-2026"}
            </Text>
          </View>
        </View>
        <View style={s.companyBlock}>
          <Text style={s.companyName}>
            {invoice.company.name || "Your company name"}
          </Text>
          <Text style={{ marginBottom: 2 }}>
            {invoice.company.address || "Company address"}
          </Text>
          <Text style={{ marginBottom: 2 }}>
            {invoice.company.email || "—"}
          </Text>
          <Text>{invoice.company.phone || "—"}</Text>
          {invoice.company.taxId && (
            <Text style={{ marginTop: 4 }}>
              Tax ID / VAT / GST: {invoice.company.taxId}
            </Text>
          )}
        </View>
      </View>

      <View style={[s.section, { flexDirection: "row", gap: 40 }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.billToLabel}>Bill to</Text>
          <Text style={s.clientName}>
            {invoice.client.name || "Client name"}
          </Text>
          <Text style={{ marginBottom: 2 }}>
            {invoice.client.address || "Client address"}
          </Text>
          <Text style={{ marginBottom: 2 }}>{invoice.client.email}</Text>
          <Text>{invoice.client.phone}</Text>
        </View>
        <View style={{ width: 200 }}>
          <View style={s.metaRow}>
            <Text style={s.metaLabel}>Issue date</Text>
            <Text style={s.metaValue}>{invoice.meta.issueDate}</Text>
          </View>
          <View style={s.metaRow}>
            <Text style={s.metaLabel}>Due date</Text>
            <Text style={s.metaValue}>{invoice.meta.dueDate}</Text>
          </View>
          <View style={s.metaRow}>
            <Text style={s.metaLabel}>Currency</Text>
            <Text style={s.metaValue}>{invoice.currency || "USD"}</Text>
          </View>
        </View>
      </View>

      <View style={s.table}>
        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderCell, s.colItem]}>Item</Text>
          <Text style={[s.tableHeaderCell, s.colQty]}>Quantity</Text>
          <Text style={[s.tableHeaderCell, s.colPrice]}>Price</Text>
          <Text style={[s.tableHeaderCell, s.colTotal]}>Total</Text>
        </View>
        {invoice.lineItems.length === 0 ? (
          <View style={[s.tableRow, { justifyContent: "center" }]}>
            <Text style={[s.tableCell, { color: "#94a3b8" }]}>
              No items added yet.
            </Text>
          </View>
        ) : (
          invoice.lineItems.map((item) => {
            const amount = item.quantity * item.unitPrice;
            return (
              <View key={item.id} style={s.tableRow}>
                <Text style={[s.tableCell, s.colItem]}>
                  {item.description || "Item description"}
                </Text>
                <Text style={[s.tableCell, s.colQty]}>{item.quantity}</Text>
                <Text style={[s.tableCell, s.colPrice]}>
                  {formatMoney(item.unitPrice, invoice.currency)}
                </Text>
                <Text style={[s.tableCell, s.colTotal]}>
                  {formatMoney(amount, invoice.currency)}
                </Text>
              </View>
            );
          })
        )}
      </View>

      <View style={s.totalsBox}>
        <View style={s.totalRow}>
          <Text style={s.metaLabel}>Subtotal</Text>
          <Text style={s.metaValue}>
            {formatMoney(totals.subtotal, invoice.currency)}
          </Text>
        </View>
        {totals.discountPercent > 0 && (
          <View style={s.totalRow}>
            <Text style={s.metaLabel}>
              Discount ({totals.discountPercent.toFixed(1)}%)
            </Text>
            <Text style={{ color: "#059669" }}>
              -{formatMoney(totals.discountAmount, invoice.currency)}
            </Text>
          </View>
        )}
        <View style={s.totalRow}>
          <Text style={s.metaLabel}>
            Tax ({(invoice.tax.rate * 100).toFixed(1)}%)
          </Text>
          <Text style={s.metaValue}>
            {formatMoney(totals.taxAmount, invoice.currency)}
          </Text>
        </View>
        <View style={s.totalDivider} />
        <View style={s.totalFinal}>
          <Text style={s.labelSmall}>Total</Text>
          <Text style={{ color: primaryColor }}>
            {formatMoney(totals.total, invoice.currency)}
          </Text>
        </View>
      </View>

      {invoice.notes && (
        <View style={s.notesSection}>
          <Text style={s.notesLabel}>Notes / terms</Text>
          <Text>{invoice.notes}</Text>
        </View>
      )}

      {invoice.signatureDataUrl && (
        <View style={s.signatureSection}>
          <Image src={invoice.signatureDataUrl} style={s.signatureImage} />
          <Text style={s.signatureLabel}>Authorized signature</Text>
        </View>
      )}
    </Page>
  );
}
