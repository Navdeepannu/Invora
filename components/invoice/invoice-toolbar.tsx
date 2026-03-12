"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  IconDeviceFloppy,
  IconAperture,
  IconDownload,
  IconLoader2,
} from "@tabler/icons-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleAlert } from "lucide-react";
import { IconFileAlert } from "@tabler/icons-react";
import type { InvoiceData } from "@/types/invoice";
import type { InvoiceValidationError } from "@/lib/invoice-validation";
import { useInvoiceExport } from "@/hooks/use-invoice-export";
import { Input } from "@/components/ui/input";
import {
  getInvoices,
  saveInvoice,
  saveInvoiceDraft,
  type SavedInvoiceRecord,
  updateInvoice,
} from "@/utils/storage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InvoiceToolbarProps = {
  invoice: InvoiceData;
  validationErrors: InvoiceValidationError[];
};

export function InvoiceToolbar({
  invoice,
  validationErrors,
}: InvoiceToolbarProps) {
  const [errorsOpen, setErrorsOpen] = useState(false);
  const [saveInvoiceOpen, setSaveInvoiceOpen] = useState(false);
  const [invoiceName, setInvoiceName] = useState("");
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [duplicateMatches, setDuplicateMatches] = useState<SavedInvoiceRecord[]>([]);
  const [allInvoicesForSelection, setAllInvoicesForSelection] = useState<
    SavedInvoiceRecord[]
  >([]);
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const { isExporting, exportingFormat, handleDownloadPdf, handleDownloadPng } =
    useInvoiceExport({ invoice });

  const showValidationToastIfNeeded = () => {
    if (validationErrors.length === 0) return false;

    const first = validationErrors[0];

    toast.error("Please complete required invoice fields before continuing.", {
      description: first.resolveHint || first.message,
    });

    setErrorsOpen(true);
    return true;
  };

  const handleOpenSaveInvoice = () => {
    if (showValidationToastIfNeeded()) return;

    setInvoiceName(invoice.meta.invoiceNumber?.trim() || "Untitled Invoice");
    setSaveInvoiceOpen(true);
  };

  const handleDownloadPdfClick = () => {
    if (showValidationToastIfNeeded()) return;
    handleDownloadPdf();
  };

  const handleDownloadPngClick = () => {
    if (showValidationToastIfNeeded()) return;
    handleDownloadPng();
  };

  const closeDuplicateFlow = () => {
    setDuplicateDialogOpen(false);
    setDuplicateMatches([]);
    setAllInvoicesForSelection([]);
    setSelectedTargetId("");
  };

  const handleSaveInvoice = () => {
    const name = invoiceName.trim();
    if (!name) return;
    const all = getInvoices();
    const matches = all.filter(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    );

    if (matches.length === 0) {
      const saved = saveInvoice(name, invoice);
      saveInvoiceDraft(saved.id, invoice);
      toast.success("Invoice saved", {
        description: saved.name,
      });
      setSaveInvoiceOpen(false);
      return;
    }

    setDuplicateMatches(matches);
    setAllInvoicesForSelection(all);
    setSaveInvoiceOpen(false);
    setDuplicateDialogOpen(true);
  };

  const handleDuplicateSaveAsNew = () => {
    const name = invoiceName.trim();
    if (!name) return;
    const saved = saveInvoice(name, invoice);
    saveInvoiceDraft(saved.id, invoice);
    toast.success("Invoice saved as new", {
      description: saved.name,
    });
    closeDuplicateFlow();
  };

  const handleDuplicateUpdateExisting = () => {
    const name = invoiceName.trim();
    if (!name || duplicateMatches.length === 0) return;
    const target = duplicateMatches[0];
    const updated = updateInvoice(target.id, invoice, { name });
    if (updated) {
      saveInvoiceDraft(updated.id, invoice);
      toast.success("Invoice updated", {
        description: updated.name,
      });
    }
    closeDuplicateFlow();
  };

  const handleDuplicateUpdateChosen = () => {
    const name = invoiceName.trim();
    if (!name || !selectedTargetId) return;
    const updated = updateInvoice(selectedTargetId, invoice, { name });
    if (updated) {
      saveInvoiceDraft(updated.id, invoice);
      toast.success("Invoice updated", {
        description: updated.name,
      });
    }
    closeDuplicateFlow();
  };

  return (
    <>
      <div className="flex items-center gap-2 border-t border-x rounded-t-xl bg-white border-b  overflow-x-auto px-3 py-2.5 text-xs sm:text-sm">
        {/* Errors */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setErrorsOpen(true)}
          aria-label={
            validationErrors.length > 0
              ? `View ${validationErrors.length} errors`
              : "View errors"
          }
          className={
            validationErrors.length > 0
              ? "gap-1.5 border border-destructive/40 bg-destructive/5 text-destructive hover:bg-destructive/10 hover:text-destructive"
              : "gap-1.5 text-muted-foreground hover:text-foreground"
          }
        >
          <CircleAlert className="size-4 shrink-0" />
          <span className="hidden sm:inline">Errors</span>
          {validationErrors.length > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-destructive/20 text-[10px] font-semibold text-destructive">
              {validationErrors.length}
            </span>
          )}
        </Button>

        {/* Save invoice */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleOpenSaveInvoice}
        >
          <IconDeviceFloppy className="size-4 shrink-0 hidden sm:block" />
          Save current invoice
        </Button>

        {/* Spacer pushes export actions to the right but keeps one row */}
        <div className="flex-1" />
        {/* Download as PDF */}
        <Button
          type="button"
          size="sm"
          variant="default"
          onClick={handleDownloadPdfClick}
          disabled={isExporting}
          aria-label="Download invoice as PDF"
        >
          {exportingFormat === "pdf" ? (
            <IconLoader2 className="size-4 shrink-0 animate-spin" />
          ) : (
            <IconDownload className="size-4 text-muted shrink-0 hidden sm:block" />
          )}
          {exportingFormat === "pdf" ? "Downloading…" : "Download PDF"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleDownloadPngClick}
          disabled={isExporting}
          aria-label="Download invoice as image"
        >
          {exportingFormat === "png" ? (
            <IconLoader2 className="size-4 shrink-0 animate-spin" />
          ) : (
            <IconAperture className="size-4 shrink-0 hidden sm:block" />
          )}
          {exportingFormat === "png" ? "Downloading…" : "Download image"}
        </Button>
      </div>

      <Dialog open={errorsOpen} onOpenChange={setErrorsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconFileAlert className="size-6 text-zinc-600 bg-neutral-200/70 p-0.5 rounded-sm" />
              <span className="text-neutral-900 text-lg">
                Your Invoice Has Errors
              </span>
            </DialogTitle>
            <DialogDescription className="pl-8">
              Please fix the errors to continue to view the invoice.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[32vh] space-y-3 overflow-y-auto py-2">
            {validationErrors.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No errors found. Your invoice is ready.
              </p>
            ) : (
              validationErrors.map((err, i) => (
                <div
                  key={`${err.path}-${i}`}
                  className="rounded-sm border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-destructive">
                        {err.code === "too_small"
                          ? "CODE: too_small"
                          : "CODE: required"}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        {err.message}
                      </p>
                    </div>

                    <p className="font-mono text-xs text-muted-foreground">
                      {err.path}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setErrorsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={saveInvoiceOpen} onOpenChange={setSaveInvoiceOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Invoice</DialogTitle>
            <DialogDescription>
              Give this invoice a name so you can open it later from Saved
              Invoices.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={invoiceName}
            onChange={(event) => setInvoiceName(event.target.value)}
            placeholder="e.g. March Website Project"
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSaveInvoiceOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveInvoice}
              disabled={!invoiceName.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Invoice name already exists</DialogTitle>
            <DialogDescription>
              You already have invoice(s) saved with this name. Choose how you
              want to save your changes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            {duplicateMatches.length > 0 && (
              <div className="rounded-md border bg-muted/40 p-3">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Matching invoices
                </p>
                <ul className="space-y-1 text-xs">
                  {duplicateMatches.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-2">
              <Button
                type="button"
                className="w-full justify-start"
                onClick={handleDuplicateSaveAsNew}
              >
                Save as a new invoice
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
                onClick={handleDuplicateUpdateExisting}
                disabled={duplicateMatches.length === 0}
              >
                Update the existing invoice
              </Button>

              <div className="mt-2 border-t pt-3">
                <p className="mb-2 text-xs text-muted-foreground">
                  Or choose another existing invoice to update:
                </p>
                <div className="flex flex-col gap-2">
                  <Select
                    value={selectedTargetId}
                    onValueChange={setSelectedTargetId}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select invoice to update" />
                    </SelectTrigger>
                    <SelectContent>
                      {allInvoicesForSelection.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleDuplicateUpdateChosen}
                    disabled={!selectedTargetId}
                  >
                    Update selected invoice
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDuplicateFlow}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
