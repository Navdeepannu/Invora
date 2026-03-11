/**
 * Shared style definitions for PDF templates. Exported as a plain object so
 * classic and modern StyleSheets can extend it via StyleSheet.create().
 */
const marginPt = 56; // ~20mm in pt (72pt = 1in, 25.4mm = 1in)

/** Consistent spacing scale applied across all templates */
const sp = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const marginPtForModern = marginPt;

export const sharedPdfStyles = {
  page: {
    padding: marginPt,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1e293b",
    lineHeight: 1.4,
  },
  headerRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
    marginBottom: sp.xxl,
  },
  logoAndTitle: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    gap: sp.md,
  },
  labelSmall: {
    fontSize: 8.5,
    fontWeight: "bold" as const,
    letterSpacing: 1.4,
    color: "#64748b",
    marginBottom: 3,
    textTransform: "uppercase" as const,
  },
  titleLarge: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: "#0f172a",
    marginTop: 1,
  },
  companyBlock: {
    fontSize: 9,
    color: "#475569",
    textAlign: "right" as const,
    maxWidth: 200,
    lineHeight: 1.5,
  },
  companyName: {
    fontSize: 12,
    fontWeight: "bold" as const,
    color: "#0f172a",
    marginBottom: 6,
  },
  section: {
    marginBottom: sp.xl,
  },
  billToLabel: {
    fontSize: 8.5,
    fontWeight: "bold" as const,
    letterSpacing: 1.2,
    color: "#64748b",
    marginBottom: 6,
    textTransform: "uppercase" as const,
  },
  clientName: {
    fontSize: 12,
    fontWeight: "bold" as const,
    color: "#0f172a",
    marginBottom: sp.xs,
  },
  metaRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 6,
    fontSize: 9,
  },
  metaLabel: {
    color: "#64748b",
    fontSize: 8.5,
  },
  metaValue: {
    color: "#1e293b",
    fontSize: 9.5,
  },
  table: {
    width: "100%" as const,
    marginBottom: sp.xl,
  },
  tableHeader: {
    flexDirection: "row" as const,
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1.5,
    borderBottomColor: "#cbd5e1",
    paddingVertical: 10,
    paddingHorizontal: sp.md,
  },
  tableHeaderCell: {
    fontSize: 8.5,
    fontWeight: "bold" as const,
    color: "#334155",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row" as const,
    borderBottomWidth: 0.75,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 10,
    paddingHorizontal: sp.md,
  },
  tableCell: {
    fontSize: 9.5,
    color: "#334155",
  },
  totalsBox: {
    alignSelf: "flex-end" as const,
    width: 210,
    marginBottom: sp.xl,
    marginTop: sp.xs,
  },
  totalRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 6,
    fontSize: 9.5,
  },
  totalDivider: {
    borderTopWidth: 1.5,
    borderTopColor: "#cbd5e1",
    marginTop: sp.sm,
    paddingTop: sp.sm,
    marginBottom: sp.sm,
  },
  totalFinal: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    fontSize: 16,
    fontWeight: "bold" as const,
  },
  notesSection: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: sp.lg,
    marginBottom: sp.lg,
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.5,
  },
  notesLabel: {
    fontSize: 8.5,
    fontWeight: "bold" as const,
    letterSpacing: 1.2,
    color: "#64748b",
    marginBottom: 6,
    textTransform: "uppercase" as const,
  },
  signatureSection: {
    marginTop: sp.xl,
    alignItems: "flex-end" as const,
  },
  signatureImage: {
    width: 120,
    height: 60,
    objectFit: "contain" as const,
  },
  signatureLabel: {
    fontSize: 8.5,
    color: "#64748b",
    marginTop: 6,
  },
  colItem: { width: "40%" as const },
  colQty: { width: "15%" as const, textAlign: "right" as const },
  colPrice: { width: "22%" as const, textAlign: "right" as const },
  colTotal: { width: "23%" as const, textAlign: "right" as const },
};
