"use client";

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent,
} from "react";

import type { InvoiceData, InvoiceLineItem } from "@/types/invoice";
import { validateInvoice } from "@/lib/invoice-validation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColorPicker } from "@/components/ui/color-picker";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleAlert } from "lucide-react";
import { IconFile, IconFileAlert } from "@tabler/icons-react";

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD - US Dollar", flag: "🇺🇸" },
  { value: "EUR", label: "EUR - Euro", flag: "🇪🇺" },
  { value: "GBP", label: "GBP - British Pound", flag: "🇬🇧" },
  { value: "CAD", label: "CAD - Canadian Dollar", flag: "🇨🇦" },
  { value: "AUD", label: "AUD - Australian Dollar", flag: "🇦🇺" },
  { value: "INR", label: "INR - Indian Rupee", flag: "🇮🇳" },
  { value: "SGD", label: "SGD - Singapore Dollar", flag: "🇸🇬" },
] as const;

type InvoiceEditorProps = {
  invoice: InvoiceData;
  onChange: (next: InvoiceData) => void;
};

export function InvoiceEditor({ invoice, onChange }: InvoiceEditorProps) {
  const [errorsOpen, setErrorsOpen] = useState(false);
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const validationErrors = useMemo(() => validateInvoice(invoice), [invoice]);

  const update = (partial: Partial<InvoiceData>) => {
    onChange({ ...invoice, ...partial });
  };

  const updateCompany = (
    field: keyof InvoiceData["company"],
    value: string,
  ) => {
    update({ company: { ...invoice.company, [field]: value } });
  };

  const updateClient = (field: keyof InvoiceData["client"], value: string) => {
    update({ client: { ...invoice.client, [field]: value } });
  };

  const updateMeta = (field: keyof InvoiceData["meta"], value: string) => {
    update({ meta: { ...invoice.meta, [field]: value } });
  };

  const updateTaxRate = (value: string) => {
    const rate = Number(value) / 100;
    update({ tax: { ...invoice.tax, rate: isNaN(rate) ? 0 : rate } });
  };

  const updateDiscount = (value: string) => {
    const percent = Number(value);
    update({ discountPercent: isNaN(percent) ? 0 : percent });
  };

  const updateLineItem = (id: string, partial: Partial<InvoiceLineItem>) => {
    const nextItems = invoice.lineItems.map((item) =>
      item.id === id ? { ...item, ...partial } : item,
    );
    update({ lineItems: nextItems });
  };

  const addLineItem = () => {
    const nextId = (invoice.lineItems.length + 1).toString();
    const nextItems: InvoiceLineItem[] = [
      ...invoice.lineItems,
      {
        id: nextId,
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ];
    update({ lineItems: nextItems });
  };

  const removeLineItem = (id: string) => {
    const nextItems = invoice.lineItems.filter((item) => item.id !== id);
    update({ lineItems: nextItems });
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        update({ companyLogoDataUrl: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSignatureUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        update({ signatureDataUrl: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSignaturePointerDown = (
    event: PointerEvent<HTMLCanvasElement>,
  ) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    isDrawingRef.current = true;
    lastPointRef.current = { x, y };
  };

  const handleSignaturePointerMove = (
    event: PointerEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawingRef.current) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    const lastPoint = lastPointRef.current ?? { x, y };
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPointRef.current = { x, y };
  };

  const finishSignatureStroke = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;

    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    update({ signatureDataUrl: dataUrl });
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update({ signatureDataUrl: undefined });
  };

  const updateTemplate = (template: InvoiceData["theme"]["template"]) => {
    update({
      theme: {
        ...invoice.theme,
        template,
      },
    });
  };

  const updatePrimaryColor = (color: string) => {
    update({
      theme: {
        ...invoice.theme,
        primaryColor: color,
      },
    });
  };

  return (
    <div className="h-full border-r bg-card">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">
            Invoice Template
          </h2>
          <p className="text-xs text-muted-foreground">
            Configure details on the left, preview on the right.
          </p>
        </div>
        <Button
          type="button"
          variant={validationErrors.length > 0 ? "outline" : "ghost"}
          size="sm"
          onClick={() => setErrorsOpen(true)}
          className={
            validationErrors.length > 0
              ? "border-destructive/50 text-destructive hover:bg-destructive/10"
              : ""
          }
        >
          <CircleAlert className="size-4" />
          Errors
          {validationErrors.length > 0 && (
            <span className="ml-1.5 flex size-5 items-center justify-center rounded-full bg-destructive/15 text-xs font-medium text-destructive">
              {validationErrors.length}
            </span>
          )}
        </Button>
      </div>

      <Dialog open={errorsOpen} onOpenChange={setErrorsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconFileAlert className="size-6 text-zinc-600 bg-neutral-200/70 p-0.5 rounded-sm" />
              <span className="text-nuetra-900 text-lg ">
                Your Invoice Has Errors
              </span>
            </DialogTitle>
            <DialogDescription className="pl-8">
              Please fix the errors to continue to view the invoice.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[32vh] space-y-3 overflow-y-auto py-2">
            {validationErrors.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No errors found. Your invoice is ready.
              </p>
            ) : (
              validationErrors.map((err, i) => (
                <div
                  key={`${err.path}-${i}`}
                  className="rounded-sm border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-destructive">
                        {err.code === "too_small"
                          ? "CODE: too_small"
                          : "CODE: required"}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        {err.message}
                      </p>
                    </div>

                    <p className="font-mono text-xs text-muted-foreground">
                      {err.path}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setErrorsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main content */}
      <div className="max-h-[calc(100vh-4rem)] overflow-y-auto pb-6">
        <Accordion
          type="single"
          collapsible
          defaultValue="template"
          className="space-y-3"
        >
          <AccordionItem value="template">
            <AccordionTrigger>Templates & branding</AccordionTrigger>
            <AccordionContent className="space-y-4 px-4">
              <div className="space-y-2">
                <Label className="text-xs">PDF template style</Label>
                <div className="inline-flex gap-2 rounded-md bg-muted p-1 text-xs">
                  <Button
                    type="button"
                    size="xs"
                    variant={
                      invoice.theme.template === "classic"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => updateTemplate("classic")}
                  >
                    Classic
                  </Button>
                  <Button
                    type="button"
                    size="xs"
                    variant={
                      invoice.theme.template === "modern"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => updateTemplate("modern")}
                  >
                    Modern
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="brand-color" className="text-xs">
                  Theme color
                </Label>
                <ColorPicker
                  id="brand-color"
                  value={invoice.theme.primaryColor}
                  onChange={(hex) => updatePrimaryColor(hex || "#4f46e5")}
                />
                <p className="text-[11px] text-muted-foreground">
                  Used for headings and primary sections in the invoice preview.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="client">
            <AccordionTrigger>Client information</AccordionTrigger>
            <AccordionContent className="space-y-3 px-2">
              <div className="space-y-1">
                <Label htmlFor="client-name">
                  Client name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="client-name"
                  placeholder="Enter client name"
                  value={invoice.client.name}
                  onChange={(event) => updateClient("name", event.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="client-address">
                  Client address <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="client-address"
                  rows={3}
                  placeholder="Street address, city, postal code, country"
                  value={invoice.client.address}
                  onChange={(event) =>
                    updateClient("address", event.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="client-email">
                    Client email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="client-email"
                    type="email"
                    placeholder="client@example.com"
                    value={invoice.client.email ?? ""}
                    onChange={(event) =>
                      updateClient("email", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="client-phone">
                    Client phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="client-phone"
                    placeholder="+1 555 000 0000"
                    value={invoice.client.phone ?? ""}
                    onChange={(event) =>
                      updateClient("phone", event.target.value)
                    }
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="company">
            <AccordionTrigger>Your company information</AccordionTrigger>
            <AccordionContent className="space-y-3 px-2">
              <div className="space-y-1">
                <Label htmlFor="company-name">
                  Company name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="company-name"
                  placeholder="Enter your company name"
                  value={invoice.company.name}
                  onChange={(event) =>
                    updateCompany("name", event.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="company-address">
                  Company address <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="company-address"
                  rows={3}
                  placeholder="Street address, city, postal code, country"
                  value={invoice.company.address}
                  onChange={(event) =>
                    updateCompany("address", event.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="company-email">
                    Company email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="company-email"
                    type="email"
                    placeholder="you@business.com"
                    value={invoice.company.email ?? ""}
                    onChange={(event) =>
                      updateCompany("email", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="company-phone">
                    Company phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="company-phone"
                    placeholder="+1 555 000 0000"
                    value={invoice.company.phone ?? ""}
                    onChange={(event) =>
                      updateCompany("phone", event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="company-tax-id">
                  Tax ID / VAT / GST number
                </Label>
                <Input
                  id="company-tax-id"
                  placeholder="e.g. VAT DE123456789, GST 22AAAAA0000A1Z5"
                  value={invoice.company.taxId ?? ""}
                  onChange={(event) =>
                    updateCompany("taxId", event.target.value)
                  }
                />
              </div>

              <div className="space-y-2 rounded-md border bg-muted/40 p-3">
                <p className="text-xs font-medium">Company logo</p>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept="image/*"
                    className="text-xs file:text-xs"
                    onChange={handleLogoUpload}
                  />
                  {invoice.companyLogoDataUrl && (
                    <Button
                      type="button"
                      size="xs"
                      variant="ghost"
                      onClick={() => update({ companyLogoDataUrl: undefined })}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Upload a small PNG or SVG logo. It will appear on the invoice
                  preview.
                </p>
              </div>

              <div className="space-y-2 rounded-md border bg-muted/40 p-3">
                <p className="text-xs font-medium">Signature</p>
                <div className="space-y-2">
                  <canvas
                    ref={signatureCanvasRef}
                    className="h-32 w-full select-none rounded-md border bg-background touch-none"
                    width={600}
                    height={160}
                    onPointerDown={handleSignaturePointerDown}
                    onPointerMove={handleSignaturePointerMove}
                    onPointerUp={finishSignatureStroke}
                    onPointerLeave={finishSignatureStroke}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="xs"
                      variant="outline"
                      onClick={clearSignature}
                    >
                      Clear
                    </Button>
                    <Input
                      type="file"
                      accept="image/*"
                      className="max-w-55 text-xs file:text-xs"
                      onChange={handleSignatureUpload}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Draw your signature or import an image. It will render near
                    the bottom of the invoice.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="invoice-details">
            <AccordionTrigger>Invoice details</AccordionTrigger>
            <AccordionContent className="space-y-3 px-2">
              <div className="space-y-1">
                <Label htmlFor="invoice-number">Invoice number</Label>
                <Input
                  id="invoice-number"
                  placeholder="Enter invoice number"
                  value={invoice.meta.invoiceNumber}
                  onChange={(event) =>
                    updateMeta("invoiceNumber", event.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <DatePicker
                  id="issue-date"
                  label="Date issued"
                  value={invoice.meta.issueDate}
                  onChange={(value) => updateMeta("issueDate", value)}
                  placeholder="Pick issue date"
                />
                <DatePicker
                  id="due-date"
                  label="Due date"
                  value={invoice.meta.dueDate}
                  onChange={(value) => updateMeta("dueDate", value)}
                  placeholder="Pick due date"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={invoice.currency}
                    onValueChange={(value) => update({ currency: value })}
                  >
                    <SelectTrigger id="currency" className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <span>{opt.flag}</span>
                          <span>{opt.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="tax-rate">Tax rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    min={0}
                    step={0.1}
                    value={(invoice.tax.rate * 100).toString()}
                    onChange={(event) => updateTaxRate(event.target.value)}
                    placeholder="e.g. 10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min={0}
                    step={0.1}
                    value={(invoice.discountPercent ?? 0).toString()}
                    onChange={(event) => updateDiscount(event.target.value)}
                    placeholder="Optional invoice-level discount"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="items">
            <AccordionTrigger>Product / service items</AccordionTrigger>
            <AccordionContent className="space-y-3 px-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Add each product or service as a separate line item.
                </p>
                <Button type="button" size="xs" onClick={addLineItem}>
                  Add item
                </Button>
              </div>

              <div className="space-y-3">
                {invoice.lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="space-y-3 rounded-md border bg-muted/40 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1">
                        <Label>Description</Label>
                        <Input
                          placeholder="Describe the product or service"
                          value={item.description}
                          onChange={(event) =>
                            updateLineItem(item.id, {
                              description: event.target.value,
                            })
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => removeLineItem(item.id)}
                        aria-label="Remove line item"
                      >
                        ✕
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`qty-${item.id}`}>Quantity</Label>
                        <Input
                          id={`qty-${item.id}`}
                          type="number"
                          min={0}
                          value={item.quantity}
                          onChange={(event) =>
                            updateLineItem(item.id, {
                              quantity: Number(event.target.value) || 0,
                            })
                          }
                          placeholder="1"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`price-${item.id}`}>Unit price</Label>
                        <Input
                          id={`price-${item.id}`}
                          type="number"
                          min={0}
                          step={0.01}
                          value={item.unitPrice}
                          onChange={(event) =>
                            updateLineItem(item.id, {
                              unitPrice: Number(event.target.value) || 0,
                            })
                          }
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {invoice.lineItems.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No items yet. Use &ldquo;Add item&rdquo; to start building
                    your invoice.
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="notes">
            <AccordionTrigger>Additional notes & terms</AccordionTrigger>
            <AccordionContent className="space-y-2 px-2">
              <Label htmlFor="notes">Notes / terms &amp; conditions</Label>
              <Textarea
                id="notes"
                rows={4}
                placeholder="Add payment terms, late fee policies, bank details, or other important notes for your client."
                value={invoice.notes}
                onChange={(event) => update({ notes: event.target.value })}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
