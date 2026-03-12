import type { ComponentType } from "react";
import type { InvoiceData, InvoiceTemplateId } from "@/types/invoice";
import { ClassicInvoice } from "./ClassicInvoice";
import { ModernInvoice } from "./ModernInvoice";
import { MinimalInvoice } from "./MinimalInvoice";
import { AccentInvoice } from "./AccentInvoice";

export type UnifiedInvoiceProps = {
  invoice: InvoiceData;
  width?: number;
  minHeight?: number;
};

export const htmlTemplateRegistry: Record<
  InvoiceTemplateId,
  ComponentType<UnifiedInvoiceProps>
> = {
  classic: ClassicInvoice,
  modern: ModernInvoice,
  minimal: MinimalInvoice,
  accent: AccentInvoice,
};

export function getHtmlTemplate(
  name: string | undefined,
): ComponentType<UnifiedInvoiceProps> {
  if (name && name in htmlTemplateRegistry) {
    return htmlTemplateRegistry[name as InvoiceTemplateId];
  }
  return htmlTemplateRegistry.classic;
}
