"use client";

import { use, useState } from "react";
import type { InvoiceData } from "@/types/invoice";
import { InvoiceEditor } from "@/components/invoice/invoice-editor";
import { InvoicePreview } from "@/components/invoice/invoice-preview";

type BuilderPageProps = {
  params: Promise<{ invoice_id: string }>;
};

function createInitialInvoice(invoiceId: string): InvoiceData {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: invoiceId,
    company: {
      name: "",
      address: "",
      email: "",
      phone: "",
    },
    client: {
      name: "",
      address: "",
      email: "",
      phone: "",
    },
    meta: {
      invoiceNumber: invoiceId,
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

  return (
    <main className="min-h-screen flex flex-col bg-slate-100">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
        <section className="border-r bg-white overflow-y-auto">
          <InvoiceEditor invoice={invoice} onChange={setInvoice} />
        </section>

        <section className="bg-slate-50 overflow-y-auto p-6">
          <InvoicePreview invoice={invoice} />
        </section>
      </div>
    </main>
  );
}
