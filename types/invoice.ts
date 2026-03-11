export type InvoiceTemplateId = "classic" | "modern" | "minimal" | "accent";

export interface InvoiceTheme {
  template: InvoiceTemplateId;
  primaryColor: string;
}

export interface InvoiceCompanyInfo {
  name: string;
  address: string;
  email?: string;
  phone?: string;
  taxId?: string;
}

export interface InvoiceClientInfo {
  name: string;
  address: string;
  email?: string;
  phone?: string;
}

export interface InvoiceMeta {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceTax {
  rate: number;
}

/** Computed totals for display in templates and preview. */
export interface InvoiceTotals {
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

export interface InvoiceData {
  id: string;
  company: InvoiceCompanyInfo;
  client: InvoiceClientInfo;
  meta: InvoiceMeta;
  lineItems: InvoiceLineItem[];
  tax: InvoiceTax;
  /**
   * Optional discount applied to the subtotal (percentage 0–100).
   */
  discountPercent?: number;
  /**
   * Optional company logo image (data URL).
   */
  companyLogoDataUrl?: string;
  /**
   * Optional signature image (data URL collected from canvas or upload).
   */
  signatureDataUrl?: string;
  /**
   * Free-form notes / terms & conditions.
   */
  notes: string;
  /**
   * ISO 4217 currency code (e.g. USD, EUR, GBP).
   */
  currency: string;
  /**
   * Visual theme options for the invoice preview.
   */
  theme: InvoiceTheme;
}
