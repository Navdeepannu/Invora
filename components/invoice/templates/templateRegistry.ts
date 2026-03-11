/**
 * Registry of PDF invoice templates. Add a new template here after creating
 * its component and style file; no other changes are required to switch from the UI.
 */
import type { InvoiceTemplateId } from "@/types/invoice";
import type { ComponentType } from "react";
import type { InvoiceData } from "@/types/invoice";
import { ClassicTemplate } from "./ClassicTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { AccentTemplate } from "./AccentTemplate";

export type InvoiceTemplateComponent = ComponentType<{ invoice: InvoiceData }>;

export const templateRegistry: Record<
  InvoiceTemplateId,
  InvoiceTemplateComponent
> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  accent: AccentTemplate,
};

const DEFAULT_TEMPLATE: InvoiceTemplateId = "classic";

/**
 * Returns the PDF template component for the given template name.
 * Falls back to classic if the name is unknown.
 */
export function getInvoiceTemplate(
  templateName: InvoiceTemplateId | string | undefined,
): InvoiceTemplateComponent {
  if (
    templateName === "classic" ||
    templateName === "modern" ||
    templateName === "minimal" ||
    templateName === "accent"
  ) {
    return templateRegistry[templateName];
  }
  return templateRegistry[DEFAULT_TEMPLATE];
}
