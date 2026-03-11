/**
 * Styles for the Accent invoice template (@react-pdf/renderer).
 * Warm header band with business identity; light grey body card.
 */
import { StyleSheet } from "@react-pdf/renderer";

export const accentStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
    lineHeight: 1.4,
  },
  card: {
    flexGrow: 0,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
  },
  headerBand: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 20,
    backgroundColor: "#e5e7eb",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  headerLogo: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  businessName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  businessMeta: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.4,
  },
  headerRight: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "right",
    lineHeight: 1.4,
  },
  bodyInner: {
    marginTop: 0,
    backgroundColor: "#ffffff",
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 28,
  },
  detailsGrid: {
    flexDirection: "row",
    marginBottom: 16,
  },
  detailsCol: {
    flex: 1,
  },
  detailsColRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  label: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 3,
  },
  value: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subjectValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#111827",
  },
  amountBig: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f97316",
  },
  table: {
    marginTop: 14,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
  },
  colItem: {
    flex: 6,
  },
  colQty: {
    flex: 2,
    textAlign: "center",
  },
  colRate: {
    flex: 2,
    textAlign: "right",
  },
  colAmount: {
    flex: 2,
    textAlign: "right",
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#9ca3af",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  itemName: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#111827",
  },
  itemDescription: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 2,
  },
  cellText: {
    fontSize: 10,
    color: "#374151",
  },
  totalsWrapper: {
    marginTop: 18,
    alignItems: "flex-end",
  },
  totalsBox: {
    width: 220,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalsLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  totalsValue: {
    fontSize: 10,
    color: "#374151",
  },
  totalsRowStrong: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  totalsStrongText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#111827",
  },
  thanksText: {
    marginTop: 24,
    fontSize: 8,
    color: "#374151",
  },
  termsLabel: {
    marginTop: 10,
    fontSize: 9,
    color: "#6b7280",
  },
  termsText: {
    marginTop: 4,
    fontSize: 9,
    color: "#6b7280",
  },
  signatureWrapper: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  signatureImage: {
    width: 100,
    height: 45,
  },
  signatureLabel: {
    marginTop: 4,
    fontSize: 9,
    color: "#9ca3af",
  },
});
