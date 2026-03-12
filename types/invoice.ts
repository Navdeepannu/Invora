export type InvoiceTemplateId = "classic" | "modern" | "minimal" | "accent";

export interface InvoiceTheme {
  template: InvoiceTemplateId;
  primaryColor: string;
}

export interface InvoiceCompanyInfo {
  name: string;
  address: string;
  website?: string;
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
  discountPercent?: number;
  companyLogoDataUrl?: string;
  signatureDataUrl?: string;
  notes: string;
  currency: string;
  theme: InvoiceTheme;
}
