/**
 * Shared formatting for invoice values. Used by preview and document renderer.
 */

export function formatMoney(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(value);
}
