"use client";

import { useCallback, useState } from "react";
import type { InvoiceData } from "@/types/invoice";
import {
  downloadInvoiceAsPdf,
  downloadInvoiceAsPng,
} from "@/lib/invoice/export";

interface UseInvoiceExportProps {
  invoice: InvoiceData;
}

export function useInvoiceExport({ invoice }: UseInvoiceExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const baseName =
    invoice.meta.invoiceNumber?.trim() || `invoice-${invoice.id || "preview"}`;

  const runExport = useCallback(
    async (kind: "pdf" | "png") => {
      if (isExporting) return;
      setIsExporting(true);
      try {
        if (kind === "pdf") {
          await downloadInvoiceAsPdf(invoice, baseName);
        } else {
          await downloadInvoiceAsPng(invoice, baseName);
        }
      } finally {
        setIsExporting(false);
      }
    },
    [baseName, invoice, isExporting],
  );

  const handleDownloadPdf = useCallback(() => {
    void runExport("pdf");
  }, [runExport]);

  const handleDownloadPng = useCallback(() => {
    void runExport("png");
  }, [runExport]);

  return {
    isExporting,
    handleDownloadPdf,
    handleDownloadPng,
  };
}
