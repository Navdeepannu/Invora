"use client";

import * as React from "react";
import { GripVertical, X } from "lucide-react";
import type { InvoiceLineItem } from "@/types/invoice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DRAG_DATA_KEY = "application/x-item-index";

function getCurrencyPlaceholder(currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(0);
  } catch {
    return "$ 0";
  }
}

function formatTotal(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

type ItemTableProps = {
  items: InvoiceLineItem[];
  currency: string;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onUpdate: (id: string, partial: Partial<InvoiceLineItem>) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
};

export function ItemTable({
  items,
  currency,
  onReorder,
  onUpdate,
  onRemove,
  onAdd,
}: ItemTableProps) {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
  const dragPreviewRef = React.useRef<HTMLDivElement | null>(null);

  const costPlaceholder = React.useMemo(
    () => getCurrencyPlaceholder(currency),
    [currency],
  );

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData(DRAG_DATA_KEY, String(index));
    e.dataTransfer.effectAllowed = "move";
    setDraggedIndex(index);

    const row = (e.currentTarget as HTMLElement).closest("tr");
    if (row && typeof document !== "undefined") {
      const rect = row.getBoundingClientRect();
      const clone = row.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      clone.style.background = "var(--color-card, #fff)";
      clone.querySelectorAll("input").forEach((el) => {
        (el as HTMLInputElement).readOnly = true;
        (el as HTMLInputElement).tabIndex = -1;
      });
      clone.querySelectorAll("button").forEach((el) => {
        (el as HTMLElement).style.pointerEvents = "none";
      });
      const wrapper = document.createElement("div");
      wrapper.setAttribute("aria-hidden", "true");
      wrapper.style.cssText = [
        "position:fixed",
        "left:0",
        "top:0",
        "width:" + rect.width + "px",
        "background:var(--color-card, #fff)",
        "box-shadow:0 10px 40px rgba(0,0,0,0.15)",
        "border-radius:8px",
        "pointer-events:none",
        "opacity:0.95",
        "z-index:9999",
        "border:1px solid var(--color-border, #e5e7eb)",
        "overflow:hidden",
      ].join(";");
      const table = document.createElement("table");
      table.style.cssText =
        "width:100%; table-layout:fixed; border-collapse:collapse; font-size:0.875rem;";
      table.appendChild(clone);
      wrapper.appendChild(table);
      document.body.appendChild(wrapper);
      dragPreviewRef.current = wrapper;
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      e.dataTransfer.setDragImage(wrapper, offsetX, offsetY);
    }
  };

  const handleDragEnd = () => {
    if (dragPreviewRef.current?.parentNode) {
      dragPreviewRef.current.parentNode.removeChild(dragPreviewRef.current);
      dragPreviewRef.current = null;
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    setDraggedIndex(null);
    const fromIndex = parseInt(e.dataTransfer.getData(DRAG_DATA_KEY), 10);
    if (Number.isNaN(fromIndex) || fromIndex === toIndex) return;
    onReorder(fromIndex, toIndex);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Product Details
          </h3>
          <p className="text-xs text-muted-foreground">
            Enter product details.
          </p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={onAdd}>
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed bg-muted/30 py-6 text-center text-xs text-muted-foreground">
          No items yet. Click &ldquo;Add Item&rdquo; to add a line.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th
                  className="w-10 shrink py-2.5 pl-2 pr-0"
                  aria-label="Reorder"
                />
                <th className="py-2.5 pl-3 text-left font-medium text-muted-foreground">
                  Item
                </th>
                <th className="w-16 sm:w-20 md:w-24 py-2.5 px-2 text-center font-medium text-muted-foreground">
                  Quantity
                </th>
                <th className="w-20 sm:w-24 md:w-28 py-2.5 px-2 text-center font-medium text-muted-foreground">
                  Cost
                </th>
                <th className="w-24 py-2.5 pr-3 text-right font-medium text-muted-foreground">
                  Total
                </th>
                <th className="w-10 shrink py-2.5 pr-2" aria-label="Remove" />
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const total = item.quantity * item.unitPrice;
                return (
                  <tr
                    key={item.id}
                    className={cn(
                      "group border-b last:border-b-0 hover:bg-muted/20 transition-colors",
                      draggedIndex === index && "opacity-30 ",
                      dragOverIndex === index &&
                        "bg-primary/5 ring-inset ring-1 ring-primary/20",
                    )}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <td className="py-2 pl-2 pr-0 align-middle">
                      <div
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnd={handleDragEnd}
                        className="flex min-w-[28px] cursor-grab touch-none select-none items-center justify-center rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
                        role="button"
                        aria-label="Drag to reorder"
                      >
                        <GripVertical className="size-4 shrink-0" />
                      </div>
                    </td>
                    <td className="py-2 pl-3 pr-2 align-middle">
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) =>
                          onUpdate(item.id, { description: e.target.value })
                        }
                        className="h-8 w-full min-w-32 border-muted-foreground/20 bg-white text-sm placeholder:text-muted-foreground sm:min-w-0"
                      />
                    </td>
                    <td className="w-16 sm:w-20 md:w-24 py-2 px-2 align-middle">
                      <Input
                        type="number"
                        min={0}
                        placeholder="1"
                        value={item.quantity === 0 ? "" : item.quantity}
                        onChange={(e) => {
                          const v = e.target.value;
                          const n = v === "" ? 0 : Number(v);
                          onUpdate(item.id, {
                            quantity: Number.isNaN(n) ? 0 : Math.max(0, n),
                          });
                        }}
                        className="h-8 w-full border-muted-foreground/20 bg-white text-center text-xs placeholder:text-muted-foreground sm:text-sm"
                      />
                    </td>
                    <td className="w-20 sm:w-24 md:w-28 py-2 px-2 align-middle">
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder={costPlaceholder}
                        value={item.unitPrice === 0 ? "" : item.unitPrice}
                        onChange={(e) => {
                          const v = e.target.value;
                          const n = v === "" ? 0 : Number(v);
                          onUpdate(item.id, {
                            unitPrice: Number.isNaN(n) ? 0 : Math.max(0, n),
                          });
                        }}
                        className="h-8 w-full border-muted-foreground/20 bg-white text-center text-xs placeholder:text-muted-foreground sm:text-sm"
                      />
                    </td>
                    <td className="py-2 pr-2 align-middle text-right text-xs tabular-nums text-muted-foreground">
                      {formatTotal(total, currency)}
                    </td>
                    <td className="py-2 pr-2 align-middle">
                      <Button
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onRemove(item.id)}
                        aria-label="Remove line item"
                      >
                        <X className="size-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
