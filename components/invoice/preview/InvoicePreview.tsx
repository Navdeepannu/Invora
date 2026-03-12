"use client";

import type { InvoiceData } from "@/types/invoice";
import {
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  PREVIEW_SCALE_FACTOR,
} from "@/lib/invoice/document-constants";
import { ClassicInvoice } from "../html-templates/ClassicInvoice";
import { ModernInvoice } from "../html-templates/ModernInvoice";
import { MinimalInvoice } from "../html-templates/MinimalInvoice";
import { AccentInvoice } from "../html-templates/AccentInvoice";

const previewWidth = Math.round(A4_WIDTH_PX * PREVIEW_SCALE_FACTOR);
const previewMinHeight = Math.round(A4_HEIGHT_PX * PREVIEW_SCALE_FACTOR * 0.5);

export type InvoicePreviewProps = {
  invoice: InvoiceData;
};

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const templateName = invoice.theme?.template ?? "classic";
  const Template =
    templateName === "modern"
      ? ModernInvoice
      : templateName === "minimal"
        ? MinimalInvoice
        : templateName === "accent"
          ? AccentInvoice
          : ClassicInvoice;

  return (
    <div className="flex justify-center px-3 py-4 overflow-x-auto">
      <div className="">
        <Template
          invoice={invoice}
          width={previewWidth}
          minHeight={previewMinHeight}
        />
      </div>
    </div>
  );
}
