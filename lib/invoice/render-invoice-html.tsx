import type { InvoiceData } from "@/types/invoice";
import { getHtmlTemplate } from "@/components/invoice/html-templates/registry";
import { A4_WIDTH_PX } from "./document-constants";

/**
 * Renders an invoice to a complete, self-contained HTML document string.
 * The HTML includes Tailwind CSS via the browser CDN so all utility classes
 * are processed at render time inside Puppeteer.
 *
 * Uses dynamic import for react-dom/server to avoid Next.js bundler errors
 * in Route Handlers.
 */
export async function renderInvoiceHtml(invoice: InvoiceData): Promise<string> {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const Template = getHtmlTemplate(invoice.theme?.template);

  const markup = renderToStaticMarkup(
    <Template invoice={invoice} width={A4_WIDTH_PX} />,
  );

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=${A4_WIDTH_PX}" />
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style>
    @page { size: A4; margin: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    html, body { margin: 0; padding: 0; width: ${A4_WIDTH_PX}px; background: white; }
  </style>
</head>
<body>
  ${markup}
</body>
</html>`;
}
