"use client";

/**
 * Root PDF document for @react-pdf/renderer. Renders the template selected
 * by invoice.theme.template (registry components used directly to satisfy React rules).
 */
import { Document } from "@react-pdf/renderer";
import type { InvoiceData } from "@/types/invoice";
import { getInvoiceTemplate } from "../templates/templateRegistry";

export type InvoiceDocumentProps = {
  invoice: InvoiceData;
};

export function InvoiceDocument({ invoice }: InvoiceDocumentProps) {
  const templateName = invoice.theme?.template ?? "classic";
  const TemplateComponent = getInvoiceTemplate(templateName);

  return (
    <Document>
      <TemplateComponent invoice={invoice} />
    </Document>
  );
}
