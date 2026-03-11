"use client";

/**
 * Converts the first page of a PDF blob to a high-resolution PNG blob.
 * Uses pdfjs-dist in the browser. Scale 2 = 2x resolution for crisp output.
 */
export async function pdfBlobToPngBlob(
  pdfBlob: Blob,
  scale: number = 2,
): Promise<Blob> {
  const pdfjs = await import("pdfjs-dist");

  // Required in browser: set worker so pdf.js can parse the PDF
  if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }

  const data = new Uint8Array(await pdfBlob.arrayBuffer());
  const loadingTask = pdfjs.getDocument({ data });
  const pdfDoc = await loadingTask.promise;
  const page = await pdfDoc.getPage(1);

  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context for PDF→PNG");
  }

  await page.render({
    canvasContext: ctx,
    viewport,
    canvas,
  }).promise;

  pdfDoc.destroy();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to convert canvas to PNG"));
          return;
        }
        resolve(blob);
      },
      "image/png",
      1.0,
    );
  });
}
