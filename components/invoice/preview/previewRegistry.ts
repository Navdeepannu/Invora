/**
 * Registry of web preview components. Each key matches a PDF template id;
 * add a new preview component here when adding a new template.
 */
import type { InvoiceTemplateId } from "@/types/invoice";
import type { ComponentType } from "react";
import type { InvoiceData } from "@/types/invoice";
import { ClassicPreview } from "./ClassicPreview";
import { ModernPreview } from "./ModernPreview";
import { MinimalPreview } from "./MinimalPreview";
import { AccentPreview } from "./AccentPreview";

export type PreviewComponentProps = {
  invoice: InvoiceData;
  previewWidth: number;
  previewMinHeight: number;
};

export const previewRegistry: Record<
  InvoiceTemplateId,
  ComponentType<PreviewComponentProps>
> = {
  classic: ClassicPreview,
  modern: ModernPreview,
  minimal: MinimalPreview,
  accent: AccentPreview,
};

const DEFAULT_TEMPLATE: InvoiceTemplateId = "classic";

/**
 * Returns the preview component for the given template name.
 */
export function getPreviewComponent(
  templateName: InvoiceTemplateId | string | undefined,
): ComponentType<PreviewComponentProps> {
  if (
    templateName === "classic" ||
    templateName === "modern" ||
    templateName === "minimal" ||
    templateName === "accent"
  ) {
    return previewRegistry[templateName];
  }
  return previewRegistry[DEFAULT_TEMPLATE];
}
