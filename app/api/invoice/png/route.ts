import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import type { InvoiceData } from "@/types/invoice";
import { renderInvoiceHtml } from "@/lib/invoice/render-invoice-html";
import { A4_WIDTH_PX, A4_HEIGHT_PX } from "@/lib/invoice/document-constants";

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
    await page.setViewport({
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
      deviceScaleFactor: 2,
    });

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pngBuffer = await page.screenshot({
      type: "png",
      fullPage: true,
    });

    return new NextResponse(new Uint8Array(pngBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": "attachment; filename=invoice.png",
      },
    });
  } catch (error) {
    console.error("PNG generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate PNG" },
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
