"use client";

import { use, useEffect, useMemo, useState } from "react";
import type { InvoiceData } from "@/types/invoice";
import { validateInvoice } from "@/lib/invoice-validation";
import { InvoiceEditor } from "@/components/invoice/invoice-editor";
import { InvoicePreview } from "@/components/invoice/preview/InvoicePreview";
import { InvoiceToolbar } from "@/components/invoice/invoice-toolbar";
import { getInvoiceDraft, saveInvoiceDraft } from "@/utils/storage";

type BuilderPageProps = {
  params: Promise<{ invoice_id: string }>;
};

function createInitialInvoice(invoiceId: string): InvoiceData {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: invoiceId,
    company: {
      name: "Acme Inc.",
      address: "123 Business Street\nSuite 100\nNew York, NY 10001",
      email: "billing@acme.com",
      phone: "+1 (555) 123-4567",
    },
    client: {
      name: "John Doe",
      address: "456 Client Avenue\nApt 2B\nBrooklyn, NY 11201",
      email: "john.doe@example.com",
      phone: "+1 (555) 987-6543",
    },
    meta: {
      invoiceNumber: "INV-001",
      issueDate: today,
      dueDate: today,
    },
    lineItems: [
      {
        id: "1",
        description: "Design services",
        quantity: 1,
        unitPrice: 1000,
      },
    ],
    tax: {
      rate: 0.19,
    },
    discountPercent: 0,
    companyLogoDataUrl: undefined,
    signatureDataUrl: undefined,
    notes: "",
    currency: "USD",
    theme: {
      template: "classic",
      primaryColor: "#4f46e5",
    },
  };
}

export default function BuilderPage({ params }: BuilderPageProps) {
  const { invoice_id } = use(params);

  const [invoice, setInvoice] = useState<InvoiceData>(() =>
    createInitialInvoice(invoice_id),
  );

  // Restore draft for this invoice id on load, if present.
  useEffect(() => {
    const draft = getInvoiceDraft(invoice_id);
    if (!draft) return;

    // Only replace state if it differs from the current initial invoice snapshot.
    // This avoids unnecessary cascading renders while still hydrating from storage.
    if (JSON.stringify(draft) !== JSON.stringify(invoice)) {
      setInvoice(draft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoice_id]);

  // Persist draft as user edits so refresh does not lose progress.
  useEffect(() => {
    saveInvoiceDraft(invoice_id, invoice);
  }, [invoice, invoice_id]);

  const validationErrors = useMemo(() => validateInvoice(invoice), [invoice]);

  return (
    <main className="min-h-screen flex flex-col bg-olive-200 py-4 px-2">
      <InvoiceToolbar invoice={invoice} validationErrors={validationErrors} />
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
        <section className="border-l bg-white overflow-y-auto border-b rounded-bl-xl">
          <InvoiceEditor invoice={invoice} onChange={setInvoice} />
        </section>

        <section className="bg-muted border-r border-b overflow-hidden py-6 px-2 rounded-br-xl">
          <InvoicePreview invoice={invoice} />
        </section>
      </div>
    </main>
  );
}
