# Invoice export architecture

Export is **independent of the preview DOM and viewport**. It uses a fixed A4 document layout.

## Flow

1. **Preview** (`components/invoice/preview/InvoicePreview.tsx`)  
   Renders in the web UI. Uses the preview registry to pick classic or modern layout from `invoice.theme.template`.

2. **Export** (PDF and PNG)  
   - **PDF**: `lib/invoice/export.ts` → `generate-pdf.tsx` → `@react-pdf/renderer` → `InvoiceDocument` → template registry → ClassicTemplate or ModernTemplate.  
   - **PNG**: Same PDF pipeline → PDF blob → `pdf-to-png.ts` (pdfjs-dist) → first page to canvas at 2x scale → PNG blob.

3. **Templates**  
   - PDF: `components/invoice/pdf/InvoiceDocument.tsx` uses `getInvoiceTemplate(templateName)` from `components/invoice/templates/templateRegistry.ts`.  
   - Each template lives in `components/invoice/templates/` (e.g. `ClassicTemplate.tsx`, `ModernTemplate.tsx`) and uses styles from `components/invoice/styles/`.  
   - Layout and dimensions: `lib/invoice/document-constants.ts` (A4, margins).

## Key files

| Path | Role |
|------|-----|
| `lib/invoice/document-constants.ts` | A4 dimensions (px/mm), preview scale. |
| `lib/invoice/format.ts` | `formatMoney()` shared by preview and PDF. |
| `lib/invoice/generate-pdf.tsx` | `generateInvoicePdfBlob(invoice)` using react-pdf and InvoiceDocument. |
| `lib/invoice/pdf-to-png.ts` | `pdfBlobToPngBlob(pdfBlob)` using pdfjs-dist. |
| `lib/invoice/export.ts` | `downloadInvoiceAsPdf(invoice, baseName)` / `downloadInvoiceAsPng(...)`. |
| `components/invoice/` | See `components/invoice/README.md` for template and preview structure. |

## Dependencies

- **@react-pdf/renderer**: PDF generation from React (fixed layout).
- **pdfjs-dist**: PDF → canvas for PNG export.

No html2canvas, dom-to-image, or jspdf in the export path.
