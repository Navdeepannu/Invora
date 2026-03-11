"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteInvoice,
  getInvoices,
  saveInvoiceDraft,
  type SavedInvoiceRecord,
} from "@/utils/storage";

function formatDate(isoDate: string) {
  try {
    return new Date(isoDate).toLocaleString();
  } catch {
    return isoDate;
  }
}

export default function SavedInvoicesPage() {
  const router = useRouter();
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoiceRecord[]>(() =>
    getInvoices(),
  );
  const [selectedInvoice, setSelectedInvoice] = useState<SavedInvoiceRecord | null>(
    null,
  );

  const loadSavedInvoices = () => {
    setSavedInvoices(getInvoices());
  };

  const hasInvoices = savedInvoices.length > 0;

  const sortedInvoices = useMemo(
    () =>
      [...savedInvoices].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [savedInvoices],
  );

  const handleEdit = (item: SavedInvoiceRecord) => {
    saveInvoiceDraft(item.id, item.invoiceData);
    router.push(`/invoice/${item.id}`);
  };

  const handleDelete = (item: SavedInvoiceRecord) => {
    deleteInvoice(item.id);
    loadSavedInvoices();
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl rounded-lg border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Saved Invoices</h1>
            <p className="text-sm text-muted-foreground">
              Manage full invoice saves and continue editing anytime.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/invoice/new">Create New Invoice</Link>
          </Button>
        </div>

        {!hasInvoices ? (
          <div className="rounded-md border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No saved invoices yet. Use &quot;Save Invoice&quot; from the builder to add
              one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2">Invoice Name</th>
                  <th className="px-3 py-2">Client Name</th>
                  <th className="px-3 py-2">Company Name</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedInvoices.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-3 py-2 font-medium">{item.name}</td>
                    <td className="px-3 py-2">
                      {item.invoiceData.client.name || "—"}
                    </td>
                    <td className="px-3 py-2">
                      {item.invoiceData.company.name || "—"}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          item.status === "Complete"
                            ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                            : item.status === "Partial"
                              ? "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
                              : "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedInvoice(item)}
                        >
                          View
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={Boolean(selectedInvoice)} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedInvoice?.name || "Saved Invoice"}</DialogTitle>
            <DialogDescription>
              Quick snapshot of the saved invoice details.
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Client:</span>{" "}
                {selectedInvoice.invoiceData.client.name || "—"}
              </p>
              <p>
                <span className="font-medium">Company:</span>{" "}
                {selectedInvoice.invoiceData.company.name || "—"}
              </p>
              <p>
                <span className="font-medium">Invoice Number:</span>{" "}
                {selectedInvoice.invoiceData.meta.invoiceNumber || "—"}
              </p>
              <p>
                <span className="font-medium">Created:</span>{" "}
                {formatDate(selectedInvoice.createdAt)}
              </p>
              <p>
                <span className="font-medium">Status:</span> {selectedInvoice.status}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
