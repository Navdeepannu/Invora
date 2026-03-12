import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import type { InvoiceData } from "@/types/invoice";
import { renderInvoiceHtml } from "@/lib/invoice/render-invoice-html";

export async function POST(request: NextRequest) {
  let browser;
  try {
    const invoice: InvoiceData = await request.json();
    const html = await renderInvoiceHtml(invoice);

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: false,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice.pdf",
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
