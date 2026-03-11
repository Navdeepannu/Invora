# Invoice module: structure and templates

This folder contains everything for invoice preview and PDF generation. Concerns are split so that preview (web UI) and PDF (download) stay separate, and adding a new template only requires a new template component, a style file, and a registry entry.

## Folder structure

```
components/invoice/
  types/           # Invoice data model (re-exports + invoiceTypes.ts)
  utils/           # Shared logic (e.g. computeInvoiceTotals)
  styles/          # PDF StyleSheets: classicStyles.ts, modernStyles.ts, sharedStyles.ts
  templates/       # PDF templates for @react-pdf/renderer
    ClassicTemplate.tsx
    ModernTemplate.tsx
    templateRegistry.ts   # Maps template id → component; getInvoiceTemplate(name)
  preview/         # Web UI preview
    InvoicePreview.tsx    # Entry: picks preview by template
    ClassicPreview.tsx
    ModernPreview.tsx
    previewRegistry.ts    # getPreviewComponent(name)
  pdf/             # PDF document root for react-pdf
    InvoiceDocument.tsx   # Uses getInvoiceTemplate() to render one template
  hooks/           # Re-exports (e.g. useInvoiceExport)
```

## How templates work

1. **Template id**  
   The user selects a template in the UI (`invoice.theme.template`: `"classic"` or `"modern"`).

2. **PDF (download)**  
   - `InvoiceDocument` receives `invoice` and calls `getInvoiceTemplate(invoice.theme.template)`.  
   - The registry returns the right component (`ClassicTemplate` or `ModernTemplate`).  
   - That component is a single `<Page>` from `@react-pdf/renderer` and receives `invoice` as props.  
   - Styles come from `styles/classicStyles.ts` or `styles/modernStyles.ts`.

3. **Preview (web)**  
   - `InvoicePreview` calls `getPreviewComponent(invoice.theme.template)`.  
   - The preview registry returns the matching web component (HTML/CSS), which receives `invoice` and preview dimensions.

4. **Adding a new template**  
   - Add `components/invoice/templates/MyTemplate.tsx` (react-pdf `Page` + layout).  
   - Add `components/invoice/styles/myStyles.ts` (StyleSheet for that template).  
   - Register in `templates/templateRegistry.ts`: `my: MyTemplate` and in `getInvoiceTemplate`.  
   - Add `preview/MyPreview.tsx` and register in `preview/previewRegistry.ts`.  
   - Extend `InvoiceTemplateId` in `types/invoice.ts` to include `"my"`.

No conditional branching in `InvoiceDocument` or `InvoicePreview`—only registry lookup.

## Data and utils

- **Types**: `@/types/invoice` holds the source of truth; `components/invoice/types/` re-exports and adds `invoiceTypes.ts` (Invoice, Customer, Items, Totals).  
- **Totals**: `utils/totals.ts` exports `computeInvoiceTotals(invoice)`; used by both PDF templates and web preview so totals stay consistent.  
- **Formatting**: `lib/invoice/format.ts` provides `formatMoney(value, currency)` for preview and PDF.
