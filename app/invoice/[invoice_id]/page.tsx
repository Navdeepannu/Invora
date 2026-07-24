"use client";

import {
  use,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { InvoiceData } from "@/types/invoice";
import { validateInvoice } from "@/lib/invoice-validation";
import { InvoiceEditor } from "@/components/invoice/invoice-editor";
import { InvoicePreview } from "@/components/invoice/preview/InvoicePreview";
import { InvoiceToolbar } from "@/components/invoice/invoice-toolbar";
import { ensureUniqueLineItemIds } from "@/lib/invoice/line-item-ids";
import { getInvoiceById, getInvoiceDraft, saveInvoiceDraft } from "@/utils/storage";

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

function loadInitialInvoice(invoiceId: string): InvoiceData {
  const invoice =
    getInvoiceDraft(invoiceId) ??
    getInvoiceById(invoiceId)?.invoiceData ??
    createInitialInvoice(invoiceId);

  return ensureUniqueLineItemIds(invoice);
}

const subscribeToClientReady = () => () => {};
const getClientReadySnapshot = () => true;
const getServerReadySnapshot = () => false;

function InvoiceBuilder({ invoiceId }: { invoiceId: string }) {
  const [invoice, setInvoice] = useState<InvoiceData>(() =>
    loadInitialInvoice(invoiceId),
  );

  useEffect(() => {
    saveInvoiceDraft(invoiceId, invoice);
  }, [invoice, invoiceId]);

  const validationErrors = useMemo(() => validateInvoice(invoice), [invoice]);

  return (
    <main className="min-h-screen flex flex-col bg-olive-200 py-4 px-2">
      <InvoiceToolbar invoice={invoice} validationErrors={validationErrors} />
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">
        <section className="min-w-0 border-l border-b bg-white overflow-y-auto rounded-bl-xl">
          <InvoiceEditor invoice={invoice} onChange={setInvoice} />
        </section>

        <section className="min-w-0 overflow-hidden border-r border-b bg-muted px-1 py-3 sm:px-2 sm:py-6 rounded-br-xl">
          <InvoicePreview invoice={invoice} />
        </section>
      </div>
    </main>
  );
}

export default function BuilderPage({ params }: BuilderPageProps) {
  const { invoice_id } = use(params);
  const clientReady = useSyncExternalStore(
    subscribeToClientReady,
    getClientReadySnapshot,
    getServerReadySnapshot,
  );

  if (!clientReady) {
    return <main className="min-h-screen bg-olive-200" aria-busy="true" />;
  }

  return <InvoiceBuilder key={invoice_id} invoiceId={invoice_id} />;
}
