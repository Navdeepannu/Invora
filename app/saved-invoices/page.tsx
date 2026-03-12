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
import { computeInvoiceTotals } from "@/components/invoice/utils/totals";
import { formatMoney } from "@/lib/invoice/format";
import { Input } from "@/components/ui/input";

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
  const [selectedInvoice, setSelectedInvoice] =
    useState<SavedInvoiceRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadSavedInvoices = () => {
    setSavedInvoices(getInvoices());
  };

  const hasInvoices = savedInvoices.length > 0;

  const filteredAndSortedInvoices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const base = query
      ? savedInvoices.filter((item) => {
          const invoiceName = item.name.toLowerCase();
          const clientName = (item.invoiceData.client.name || "").toLowerCase();
          const companyName = (item.invoiceData.company.name || "").toLowerCase();
          return (
            invoiceName.includes(query) ||
            clientName.includes(query) ||
            companyName.includes(query)
          );
        })
      : savedInvoices;

    return [...base].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [savedInvoices, searchQuery]);

  const handleEdit = (item: SavedInvoiceRecord) => {
    saveInvoiceDraft(item.id, item.invoiceData);
    router.push(`/invoice/${item.id}`);
  };

  const handleDelete = (item: SavedInvoiceRecord) => {
    deleteInvoice(item.id);
    loadSavedInvoices();
  };

  return (
    <main className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-7xl rounded-xl border bg-white/95 p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Saved Invoices
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage full invoice saves and continue editing anytime.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Input
              placeholder="Search by invoice, client, or company"
              className="h-9 w-full max-w-xs text-sm"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <Button asChild variant="outline">
              <Link href="/invoice/new">Create New Invoice</Link>
            </Button>
          </div>
        </div>

        {!hasInvoices ? (
          <div className="rounded-md border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No saved invoices yet. Use &quot;Save Invoice&quot; from the
              builder to add one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto ring-1 ring-border rounded-lg">
            <table className="w-full min-w-215 text-sm">
              <thead>
                <tr className="bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground border-b">
                  <th className="px-3 py-2">Invoice Name</th>
                  <th className="px-3 py-2">Client Name</th>
                  <th className="px-3 py-2">Company Name</th>
                  <th className="px-3 py-2 text-right">Total Amount</th>
                  <th className="px-3 py-2">Date & Time</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedInvoices.map((item) => {
                  const totals = computeInvoiceTotals(item.invoiceData);
                  const totalFormatted = formatMoney(
                    totals.total,
                    item.invoiceData.currency,
                  );
                  return (
                  <tr key={item.id} className="border-b last:border-0 p-2">
                    <td className="px-3 py-2 font-medium">{item.name}</td>
                    <td className="px-3 py-2">
                      {item.invoiceData.client.name || "—"}
                    </td>
                    <td className="px-3 py-2">
                      {item.invoiceData.company.name || "—"}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {totalFormatted}
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
                          className="rounded-lg"
                          variant="outline"
                          onClick={() => setSelectedInvoice(item)}
                        >
                          View
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="rounded-lg"
                          variant="destructive"
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(selectedInvoice)}
        onOpenChange={() => setSelectedInvoice(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedInvoice?.name || "Saved Invoice"}
            </DialogTitle>
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
                <span className="font-medium">Status:</span>{" "}
                {selectedInvoice.status}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
