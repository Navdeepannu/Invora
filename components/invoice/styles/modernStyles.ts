/**
 * PDF styles for the Modern invoice template (@react-pdf/renderer).
 * No colored header; invoice details at top left; two boxes then table/totals/notes/signature.
 */
import { StyleSheet } from "@react-pdf/renderer";
import { sharedPdfStyles } from "./sharedStyles";

export const modernStyles = StyleSheet.create({
  ...sharedPdfStyles,
  /** Top left: logo + invoice label/number/dates (no background) */
  invoiceDetailsTop: {
    marginBottom: 28,
  },
  invoiceDetailsRowWithLogo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  invoiceDetailsLogo: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  invoiceDetailsBlock: {
    flex: 1,
  },
  invoiceDetailsLabel: {
    fontSize: 8.5,
    fontWeight: "bold",
    letterSpacing: 1.4,
    color: "#64748b",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  invoiceDetailsNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
  },
  invoiceDetailsRow: {
    flexDirection: "row",
    gap: 28,
    marginBottom: 4,
    fontSize: 9,
  },
  /** Two side-by-side boxes: Billed by (left) and Billed to (right) */
  billedSection: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 28,
  },
  billedBox: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  billedBoxLabel: {
    fontSize: 8.5,
    fontWeight: "bold",
    letterSpacing: 1.2,
    color: "#64748b",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  billedBoxContent: {
    fontSize: 9.5,
    color: "#334155",
    lineHeight: 1.5,
  },
  /** Totals block right-aligned below table */
  totalsBlock: {
    alignSelf: "flex-end",
    width: 220,
    marginBottom: 24,
    marginTop: 4,
  },
  /** Signature centered */
  signatureCenter: {
    marginTop: 24,
    alignItems: "center",
  },
});
