/**
 * PDF styles for the Classic invoice template (@react-pdf/renderer).
 * Extends shared styles with stronger table borders and totals dividers
 * for a traditional corporate feel.
 */
import { StyleSheet } from "@react-pdf/renderer";
import { sharedPdfStyles } from "./sharedStyles";

export const classicStyles = StyleSheet.create({
  ...sharedPdfStyles,
  tableHeader: {
    ...sharedPdfStyles.tableHeader,
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 2,
    borderBottomColor: "#94a3b8",
  },
  totalDivider: {
    ...sharedPdfStyles.totalDivider,
    borderTopWidth: 2,
    borderTopColor: "#94a3b8",
  },
});
