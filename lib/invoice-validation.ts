import type { InvoiceData } from "@/types/invoice";

export type InvoiceValidationError = {
  code: "required" | "too_small";
  message: string;
  path: string;
  resolveHint: string;
};

export function validateInvoice(invoice: InvoiceData): InvoiceValidationError[] {
  const errors: InvoiceValidationError[] = [];

  if (!invoice.company.name?.trim()) {
    errors.push({
      code: "required",
      message: "Company name cannot be empty",
      path: "company/name",
      resolveHint: "Enter your company name in the Company information section.",
    });
  }

  if (!invoice.company.address?.trim()) {
    errors.push({
      code: "required",
      message: "Company address cannot be empty",
      path: "company/address",
      resolveHint: "Enter your company address in the Company information section.",
    });
  }

  if (!invoice.company.email?.trim()) {
    errors.push({
      code: "required",
      message: "Company email cannot be empty",
      path: "company/email",
      resolveHint: "Enter your company email in the Company information section.",
    });
  }

  if (!invoice.company.phone?.trim()) {
    errors.push({
      code: "required",
      message: "Company phone cannot be empty",
      path: "company/phone",
      resolveHint: "Enter your company phone in the Company information section.",
    });
  }

  if (!invoice.client.name?.trim()) {
    errors.push({
      code: "required",
      message: "Client name cannot be empty",
      path: "client/name",
      resolveHint: "Enter the client name in the Client information section.",
    });
  }

  if (!invoice.client.address?.trim()) {
    errors.push({
      code: "required",
      message: "Client address cannot be empty",
      path: "client/address",
      resolveHint: "Enter the client address in the Client information section.",
    });
  }

  if (!invoice.client.email?.trim()) {
    errors.push({
      code: "required",
      message: "Client email cannot be empty",
      path: "client/email",
      resolveHint: "Enter the client email in the Client information section.",
    });
  }

  if (!invoice.client.phone?.trim()) {
    errors.push({
      code: "required",
      message: "Client phone cannot be empty",
      path: "client/phone",
      resolveHint: "Enter the client phone in the Client information section.",
    });
  }

  if (!invoice.meta.invoiceNumber?.trim()) {
    errors.push({
      code: "required",
      message: "Invoice number cannot be empty",
      path: "meta/invoiceNumber",
      resolveHint: "Enter the invoice number in the Invoice details section.",
    });
  }

  if (!invoice.meta.issueDate?.trim()) {
    errors.push({
      code: "required",
      message: "Issue date cannot be empty",
      path: "meta/issueDate",
      resolveHint: "Select the issue date in the Invoice details section.",
    });
  }

  if (!invoice.meta.dueDate?.trim()) {
    errors.push({
      code: "required",
      message: "Due date cannot be empty",
      path: "meta/dueDate",
      resolveHint: "Select the due date in the Invoice details section.",
    });
  }

  if (invoice.lineItems.length === 0) {
    errors.push({
      code: "required",
      message: "At least one line item is required",
      path: "lineItems",
      resolveHint: "Add at least one product or service in the Product details section.",
    });
  }

  invoice.lineItems.forEach((item, index) => {
    if (!item.description?.trim()) {
      errors.push({
        code: "too_small",
        message: "Item description cannot be empty",
        path: `lineItems/${index}/description`,
        resolveHint: `Enter a description for line item ${index + 1} in the Product details section.`,
      });
    }
  });

  return errors;
}
