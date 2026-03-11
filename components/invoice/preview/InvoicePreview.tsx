"use client";

/**
 * Renders the invoice in the web UI. Selects classic or modern preview
 * via the preview registry (no conditional logic; easy to add new templates).
 */
import type { InvoiceData } from "@/types/invoice";
import {
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  PREVIEW_SCALE_FACTOR,
} from "@/lib/invoice/document-constants";
import { getPreviewComponent } from "./previewRegistry";

const ClassicPreview = getPreviewComponent("classic");
const ModernPreview = getPreviewComponent("modern");
const MinimalPreview = getPreviewComponent("minimal");
const AccentPreview = getPreviewComponent("accent");

export type InvoicePreviewProps = {
  invoice: InvoiceData;
};

/** Scaled dimensions for the preview; export uses full A4. */
const previewWidth = Math.round(A4_WIDTH_PX * PREVIEW_SCALE_FACTOR);
const previewMinHeight = Math.round(A4_HEIGHT_PX * PREVIEW_SCALE_FACTOR * 0.5);

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const templateName = invoice.theme?.template ?? "classic";

  return (
    <div className="flex justify-center px-3 py-4 overflow-x-auto">
      <div className="drop-shadow-sm md:drop-shadow-lg">
        {templateName === "modern" ? (
          <ModernPreview
            invoice={invoice}
            previewWidth={previewWidth}
            previewMinHeight={previewMinHeight}
          />
        ) : templateName === "minimal" ? (
          <MinimalPreview
            invoice={invoice}
            previewWidth={previewWidth}
            previewMinHeight={previewMinHeight}
          />
        ) : templateName === "accent" ? (
          <AccentPreview
            invoice={invoice}
            previewWidth={previewWidth}
            previewMinHeight={previewMinHeight}
          />
        ) : (
          <ClassicPreview
            invoice={invoice}
            previewWidth={previewWidth}
            previewMinHeight={previewMinHeight}
          />
        )}
      </div>
    </div>
  );
}
