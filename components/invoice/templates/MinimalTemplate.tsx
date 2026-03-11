"use client";

/**
 * Minimal layout for invoice PDF. Used by @react-pdf/renderer.
 * Standalone style sheet (does not use sharedPdfStyles).
 */
import { Page, View, Text, Image } from "@react-pdf/renderer";
import type { InvoiceData } from "@/types/invoice";
import { formatMoney } from "@/lib/invoice/format";
import { computeInvoiceTotals } from "../utils/totals";
import { minimalStyles as s } from "../styles/minimalStyles";

export type MinimalTemplateProps = { invoice: InvoiceData };

export function MinimalTemplate({ invoice }: MinimalTemplateProps) {
  const primaryColor = invoice.theme?.primaryColor ?? "#4f46e5";
  const totals = computeInvoiceTotals(invoice);

  const amountDueLabel = "Amount due";

  return (
    <Page size="A4" style={s.page}>
      <View style={s.card}>
        {/* Header */}
        <View style={s.headerRow}>
          <View>
            <Text style={s.invoiceTitle}>INVOICE</Text>
            <Text style={s.invoiceNumber}>
              {invoice.meta.invoiceNumber || "#INV-001"}
            </Text>
          </View>
          {invoice.companyLogoDataUrl && (
            <View style={s.headerLogoWrapper}>
              {/* @react-pdf Image does not support alt, ignore web a11y rule */}
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image
                src={invoice.companyLogoDataUrl}
                style={{ width: 36, height: 36 }}
              />
            </View>
          )}
        </View>

        {/* Info grid */}
        <View style={s.infoGrid}>
          {/* Issued / Due */}
          <View style={s.infoCol}>
            <Text style={s.infoLabel}>Issued</Text>
            <Text style={[s.infoText, { marginBottom: 8 }]}>
              {invoice.meta.issueDate}
            </Text>
            <Text style={s.infoLabel}>Due</Text>
            <Text style={s.infoText}>{invoice.meta.dueDate}</Text>
          </View>

          {/* Billed to (client) */}
          <View style={[s.infoCol, s.infoColMiddle]}>
            <Text style={s.infoLabel}>Billed to</Text>
            <Text style={s.infoText}>
              {(invoice.client.name || "Client name") + "\n"}
              {(invoice.client.address || "Client address") + "\n"}
              {(invoice.client.email || "—") + "\n"}
              {invoice.client.phone || "—"}
            </Text>
          </View>

          {/* From (company) */}
          <View style={s.infoCol}>
            <Text style={s.infoLabel}>From</Text>
            <Text style={s.infoText}>
              {(invoice.company.name || "Your company") + "\n"}
              {(invoice.company.address || "Company address") + "\n"}
              {(invoice.company.taxId
                ? `Tax ID ${invoice.company.taxId}`
                : ""
              ).trim()}
            </Text>
          </View>
        </View>

        {/* Services table */}
        <View style={s.table}>
          {/* Header */}
          <View style={s.tableHeaderRow}>
            <View style={s.colService}>
              <Text style={s.tableHeaderText}>Service</Text>
            </View>
            <View style={s.colQty}>
              <Text style={s.tableHeaderText}>Qty</Text>
            </View>
            <View style={s.colRate}>
              <Text style={s.tableHeaderText}>Rate</Text>
            </View>
            <View style={s.colTotal}>
              <Text style={s.tableHeaderText}>Line total</Text>
            </View>
          </View>

          {invoice.lineItems.length === 0 ? (
            <View
              style={[
                s.tableRow,
                { justifyContent: "center", borderBottomWidth: 0 },
              ]}
            >
              <Text style={[s.cellText, { color: "#9ca3af" }]}>
                No items added yet.
              </Text>
            </View>
          ) : (
            invoice.lineItems.map((item) => {
              const amount = item.quantity * item.unitPrice;
              return (
                <View key={item.id} style={s.tableRow}>
                  <View style={s.colService}>
                    <Text style={s.serviceName}>
                      {item.description || "Service name"}
                    </Text>
                  </View>
                  <View style={s.colQty}>
                    <Text style={s.cellText}>{item.quantity}</Text>
                  </View>
                  <View style={s.colRate}>
                    <Text style={s.cellText}>
                      {formatMoney(item.unitPrice, invoice.currency)}
                    </Text>
                  </View>
                  <View style={s.colTotal}>
                    <Text style={s.cellText}>
                      {formatMoney(amount, invoice.currency)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Totals */}
        <View style={s.totalsWrapper}>
          <View style={s.totalsBox}>
            <View style={s.totalsRow}>
              <Text style={s.totalsLabel}>Subtotal</Text>
              <Text style={s.totalsValue}>
                {formatMoney(totals.subtotal, invoice.currency)}
              </Text>
            </View>
            <View style={s.totalsRow}>
              <Text style={s.totalsLabel}>
                Tax ({(invoice.tax.rate * 100).toFixed(1)}%)
              </Text>
              <Text style={s.totalsValue}>
                {formatMoney(totals.taxAmount, invoice.currency)}
              </Text>
            </View>
            <View style={s.totalsRowStrong}>
              <Text style={s.totalsStrongText}>Total</Text>
              <Text style={s.totalsStrongText}>
                {formatMoney(totals.total, invoice.currency)}
              </Text>
            </View>
            <View style={[s.amountDueRow, { borderBottomColor: primaryColor }]}>
              <Text style={[s.amountDueLabel, { color: primaryColor }]}>
                {amountDueLabel}
              </Text>
              <Text style={[s.amountDueValue, { color: primaryColor }]}>
                {formatMoney(totals.total, invoice.currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Thank you section + notes */}
        <View style={s.thankYouSection}>
          <Text style={s.thankYouTitle}>Thank you for the business!</Text>
          {invoice.notes ? (
            <Text style={[s.thankYouText, { marginTop: 4 }]}>
              {invoice.notes}
            </Text>
          ) : null}
        </View>

        {/* Footer */}
        <View style={s.footerRow}>
          <Text>{invoice.company.name || ""}</Text>
          <Text>{invoice.company.phone || ""}</Text>
          <Text>{invoice.company.email || ""}</Text>
        </View>
      </View>
    </Page>
  );
}
