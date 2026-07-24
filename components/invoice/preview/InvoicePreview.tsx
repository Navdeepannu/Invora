"use client";

import {
  useCallback,
  useRef,
  useSyncExternalStore,
  type RefObject,
} from "react";
import type { InvoiceData } from "@/types/invoice";
import {
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  PREVIEW_SCALE_FACTOR,
} from "@/lib/invoice/document-constants";
import { ClassicInvoice } from "../html-templates/ClassicInvoice";
import { ModernInvoice } from "../html-templates/ModernInvoice";
import { MinimalInvoice } from "../html-templates/MinimalInvoice";
import { AccentInvoice } from "../html-templates/AccentInvoice";

const PREVIEW_MIN_HEIGHT_PX = Math.round(A4_HEIGHT_PX * 0.5);
const EMPTY_MEASUREMENTS = "0:0";

function usePreviewMeasurements(
  containerRef: RefObject<HTMLDivElement | null>,
  documentRef: RefObject<HTMLDivElement | null>,
) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const container = containerRef.current;
      const document = documentRef.current;

      if (!container || !document) return () => {};

      if (typeof ResizeObserver === "undefined") {
        window.addEventListener("resize", onStoreChange);
        return () => window.removeEventListener("resize", onStoreChange);
      }

      const observer = new ResizeObserver(onStoreChange);
      observer.observe(container);
      observer.observe(document);

      return () => observer.disconnect();
    },
    [containerRef, documentRef],
  );

  const getSnapshot = useCallback(() => {
    const width = containerRef.current?.clientWidth ?? 0;
    const height = documentRef.current?.offsetHeight ?? 0;
    return `${width}:${height}`;
  }, [containerRef, documentRef]);

  const measurements = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => EMPTY_MEASUREMENTS,
  );
  const [width, height] = measurements.split(":").map(Number);

  return { width, height };
}

export type InvoicePreviewProps = {
  invoice: InvoiceData;
};

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const { width: availableWidth, height: documentHeight } =
    usePreviewMeasurements(containerRef, documentRef);

  const scale =
    availableWidth > 0
      ? Math.min(PREVIEW_SCALE_FACTOR, availableWidth / A4_WIDTH_PX)
      : PREVIEW_SCALE_FACTOR;
  const scaledWidth = Math.round(A4_WIDTH_PX * scale);
  const scaledHeight = Math.ceil(
    (documentHeight || PREVIEW_MIN_HEIGHT_PX) * scale,
  );

  const templateName = invoice.theme?.template ?? "classic";
  const Template =
    templateName === "modern"
      ? ModernInvoice
      : templateName === "minimal"
        ? MinimalInvoice
        : templateName === "accent"
          ? AccentInvoice
          : ClassicInvoice;

  return (
    <div className="w-full min-w-0 overflow-hidden px-2 py-3 sm:px-3 sm:py-4">
      <div
        ref={containerRef}
        data-slot="invoice-preview-container"
        className="flex w-full min-w-0 justify-center"
      >
        <div
          data-slot="invoice-preview-stage"
          className="relative shrink-0"
          style={{ width: scaledWidth, height: scaledHeight }}
        >
          <div
            ref={documentRef}
            data-slot="invoice-preview-document"
            className="absolute left-0 top-0"
            style={{
              width: A4_WIDTH_PX,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <Template
              invoice={invoice}
              width={A4_WIDTH_PX}
              minHeight={PREVIEW_MIN_HEIGHT_PX}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
