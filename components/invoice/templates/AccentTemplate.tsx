"use client";
import { Page, View, Text, Image } from "@react-pdf/renderer";
import type { InvoiceData } from "@/types/invoice";
import { formatMoney } from "@/lib/invoice/format";
import { computeInvoiceTotals } from "../utils/totals";
import { accentStyles as s } from "../styles/accentStyles";

export type AccentTemplateProps = { invoice: InvoiceData };

export function AccentTemplate({ invoice }: AccentTemplateProps) {
  const primaryColor = invoice.theme?.primaryColor ?? "#f97316";
  const totals = computeInvoiceTotals(invoice);

  return (
    <Page size="A4" style={s.page}>
      <View style={s.card}>
        {/* Header band */}
        <View style={s.headerBand}>
          <View style={s.headerLeft}>
            {invoice.companyLogoDataUrl && (
              <View style={s.headerLogo}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image
                  src={invoice.companyLogoDataUrl}
                  style={{ width: 32, height: 32 }}
                />
              </View>
            )}
            <View>
              <Text style={s.businessName}>
                {invoice.company.name || "Your business"}
              </Text>
              <Text style={s.businessMeta}>
                {(invoice.company.email || "email@example.com") + "\n"}
                {invoice.company.phone || "+00 0000 00000"}
              </Text>
            </View>
          </View>
          <View style={s.headerRight}>
            <Text>{invoice.company.address || "Business address"}</Text>
            {invoice.company.taxId ? (
              <Text>{`TAX ID ${invoice.company.taxId}`}</Text>
            ) : null}
          </View>
        </View>

        <View style={s.bodyInner}>
          {/* Billed to / invoice meta / amount */}
          <View style={s.detailsGrid}>
            <View style={s.detailsCol}>
              <Text style={s.label}>Billed to,</Text>
              <Text style={s.value}>
                {invoice.client.name || "Client name"}
              </Text>
              <Text style={s.businessMeta}>
                {invoice.client.address || "Client address"}
              </Text>
              <Text style={s.businessMeta}>{invoice.client.phone || ""}</Text>
            </View>

            <View style={s.detailsCol}>
              <Text style={s.label}>Invoice number</Text>
              <Text style={s.value}>
                {invoice.meta.invoiceNumber || "INV-001"}
              </Text>
              <Text style={s.label}>Invoice date</Text>
              <Text style={s.value}>{invoice.meta.issueDate}</Text>
              <Text style={s.label}>Due date</Text>
              <Text style={s.value}>{invoice.meta.dueDate}</Text>
            </View>

            <View style={s.detailsColRight}>
              <Text style={s.label}>Invoice total</Text>
              <Text style={[s.amountBig, { color: primaryColor }]}>
                {formatMoney(totals.total, invoice.currency)}
              </Text>
            </View>
          </View>

          {/* Items table */}
          <View style={s.table}>
            <View style={s.tableHeaderRow}>
              <View style={s.colItem}>
                <Text style={s.tableHeaderText}>Item detail</Text>
              </View>
              <View style={s.colQty}>
                <Text style={s.tableHeaderText}>Qty</Text>
              </View>
              <View style={s.colRate}>
                <Text style={s.tableHeaderText}>Rate</Text>
              </View>
              <View style={s.colAmount}>
                <Text style={s.tableHeaderText}>Amount</Text>
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
                const lineTotal = item.quantity * item.unitPrice;
                return (
                  <View key={item.id} style={s.tableRow}>
                    <View style={s.colItem}>
                      <Text style={s.itemName}>
                        {item.description || "Item name"}
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
                    <View style={s.colAmount}>
                      <Text style={s.cellText}>
                        {formatMoney(lineTotal, invoice.currency)}
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
            </View>
          </View>

          {/* Signature */}
          {invoice.signatureDataUrl && (
            <View style={s.signatureWrapper}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={invoice.signatureDataUrl} style={s.signatureImage} />
              <Text style={s.signatureLabel}>Authorized signature</Text>
            </View>
          )}

          <Text style={s.thanksText}>Thanks for the business.</Text>
        </View>

        {invoice.notes && (
          <View
            style={{
              marginTop: 10,
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: "#e5e7eb",
            }}
          >
            <Text style={s.termsLabel}>Terms &amp; Conditions</Text>
            <Text style={s.termsText}>{invoice.notes}</Text>
          </View>
        )}
      </View>
    </Page>
  );
}
