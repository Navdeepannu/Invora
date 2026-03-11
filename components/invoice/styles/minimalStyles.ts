/**
 * Standalone PDF styles for the Minimal invoice template (@react-pdf/renderer).
 * This template does NOT reuse sharedPdfStyles on purpose.
 */
import { StyleSheet } from "@react-pdf/renderer";

export const minimalStyles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
  },
  card: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 32,
    paddingTop: 28,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 26,
  },
  invoiceTitle: {
    fontSize: 26,
    fontWeight: "extrabold",
    letterSpacing: 0,
  },
  invoiceNumber: {
    marginTop: 4,
    fontSize: 10,
    color: "#9ca3af",
  },
  headerLogoWrapper: {
    width: 36,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  infoGrid: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 16,
    marginTop: 4,
    marginBottom: 18,
  },
  infoCol: {
    flex: 1,
  },
  infoColMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 14,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#94a3b8",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  infoText: {
    fontSize: 10.5,
    color: "#475569",
    lineHeight: 1.4,
  },
  table: {
    marginTop: 4,
    marginBottom: 12,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 6,
  },
  colService: {
    flex: 1,
  },
  colQty: {
    width: 40,
    textAlign: "center",
  },
  colRate: {
    width: 70,
    textAlign: "right",
  },
  colTotal: {
    width: 80,
    textAlign: "right",
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 8,
  },
  serviceName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#111827",
  },
  serviceDescription: {
    marginTop: 3,
    fontSize: 9,
    color: "#6b7280",
  },
  cellText: {
    fontSize: 10,
    color: "#4b5563",
  },
  totalsWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
    marginBottom: 16,
  },
  totalsBox: {
    width: 220,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalsLabel: {
    fontSize: 10,
    color: "#64748b",
  },
  totalsValue: {
    fontSize: 10,
    color: "#334155",
  },
  totalsRowStrong: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  totalsStrongText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
  },
  amountDueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 6,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#4f46e5",
  },
  amountDueLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#4f46e5",
  },
  amountDueValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#4f46e5",
  },
  thankYouSection: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    paddingBottom: 8,
  },
  thankYouTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  thankYouRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  thankYouText: {
    fontSize: 9,
    color: "#4b5563",
    lineHeight: 1.4,
  },
  footerRow: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    color: "#9ca3af",
  },
});
