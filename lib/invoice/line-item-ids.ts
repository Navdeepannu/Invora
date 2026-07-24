import type { InvoiceData, InvoiceLineItem } from "@/types/invoice";

function getNextNumericId(items: InvoiceLineItem[]): number {
  return (
    items.reduce((highest, item) => {
      const numericId = Number(item.id);
      return Number.isSafeInteger(numericId) && numericId > highest
        ? numericId
        : highest;
    }, 0) + 1
  );
}

export function createLineItemId(items: InvoiceLineItem[]): string {
  const existingIds = new Set(items.map((item) => item.id));
  let nextId = getNextNumericId(items);

  while (existingIds.has(String(nextId))) {
    nextId += 1;
  }

  return String(nextId);
}

export function ensureUniqueLineItemIds(invoice: InvoiceData): InvoiceData {
  const seenIds = new Set<string>();
  let nextId = getNextNumericId(invoice.lineItems);
  let changed = false;

  const lineItems = invoice.lineItems.map((item) => {
    if (item.id && !seenIds.has(item.id)) {
      seenIds.add(item.id);
      return item;
    }

    while (seenIds.has(String(nextId))) {
      nextId += 1;
    }

    const uniqueId = String(nextId);
    nextId += 1;
    seenIds.add(uniqueId);
    changed = true;

    return { ...item, id: uniqueId };
  });

  return changed ? { ...invoice, lineItems } : invoice;
}
