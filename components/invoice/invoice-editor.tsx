"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import { toast } from "sonner";
import type { InvoiceData, InvoiceLineItem } from "@/types/invoice";
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
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ItemTable } from "@/components/ui/item-table";
import { ImageIcon } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import type SignatureCanvasType from "react-signature-canvas";
import {
  getClientProfiles,
  getCompanyProfiles,
  deleteClientProfile,
  deleteCompanyProfile,
  saveClientProfile,
  saveCompanyProfile,
  type SavedClientProfile,
  type SavedCompanyProfile,
} from "@/utils/storage";
import {
  IconTrash,
  IconDeviceFloppy,
  IconInfoCircle,
} from "@tabler/icons-react";

/** Tighter inputs in accordions so sections read clearly */
const ACCORDION_INPUT_CLASS = "h-8 text-sm";

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD - US Dollar", flag: "🇺🇸" },
  { value: "EUR", label: "EUR - Euro", flag: "🇪🇺" },
  { value: "GBP", label: "GBP - British Pound", flag: "🇬🇧" },
  { value: "CAD", label: "CAD - Canadian Dollar", flag: "🇨🇦" },
  { value: "AUD", label: "AUD - Australian Dollar", flag: "🇦🇺" },
  { value: "INR", label: "INR - Indian Rupee", flag: "🇮🇳" },
  { value: "SGD", label: "SGD - Singapore Dollar", flag: "🇸🇬" },
] as const;

const TEMPLATE_OPTIONS = [
  { value: "classic" as const, label: "Classic" },
  { value: "modern" as const, label: "Modern" },
  { value: "minimal" as const, label: "Minimal" },
  { value: "accent" as const, label: "Accent" },
];

type TemplateSegmentControlProps = {
  value: InvoiceData["theme"]["template"];
  onChange: (template: InvoiceData["theme"]["template"]) => void;
};

function TemplateSegmentControl({
  value,
  onChange,
}: TemplateSegmentControlProps) {
  const index = TEMPLATE_OPTIONS.findIndex((o) => o.value === value);
  const selectedIndex = index >= 0 ? index : 0;

  return (
    <div className="relative flex w-fit rounded-full bg-muted p-1">
      {/* Sliding pill background */}
      <div
        className="absolute top-1 bottom-1 rounded-full bg-white shadow-sm transition-[left] duration-200 ease-out"
        style={{
          left: `calc(4px + ${selectedIndex} * (100% - 8px) / 4)`,
          width: `calc((100% - 8px) / 4)`,
        }}
        aria-hidden
      />
      {TEMPLATE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="relative z-10 min-w-0 flex-1 cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none"
          style={{ width: "25%" }}
        >
          <span
            className={
              value === opt.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  );
}

type InvoiceEditorProps = {
  invoice: InvoiceData;
  onChange: (next: InvoiceData) => void;
};

export function InvoiceEditor({ invoice, onChange }: InvoiceEditorProps) {
  const signatureCanvasRef = useRef<SignatureCanvasType | null>(null);
  const [clientProfiles, setClientProfiles] = useState<SavedClientProfile[]>(
    () => getClientProfiles(),
  );
  const [companyProfiles, setCompanyProfiles] = useState<SavedCompanyProfile[]>(
    () => getCompanyProfiles(),
  );
  const [selectedClientProfileId, setSelectedClientProfileId] = useState("");
  const [selectedCompanyProfileId, setSelectedCompanyProfileId] = useState("");
  const [saveClientDialogOpen, setSaveClientDialogOpen] = useState(false);
  const [saveCompanyDialogOpen, setSaveCompanyDialogOpen] = useState(false);
  const [clientProfileName, setClientProfileName] = useState("");
  const [companyProfileName, setCompanyProfileName] = useState("");

  const normalizePrimaryHex = (raw: string | undefined) => {
    const s = raw ?? "#4f46e5";
    return /^#[0-9A-Fa-f]{6}$/.test(s) ? s.toUpperCase() : "#4F46E5";
  };
  const [primaryColorInput, setPrimaryColorInput] = useState("");
  const [isEditingHex, setIsEditingHex] = useState(false);
  const primaryColorDisplay = isEditingHex
    ? primaryColorInput
    : normalizePrimaryHex(invoice.theme.primaryColor);

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

  const reorderLineItems = (fromIndex: number, toIndex: number) => {
    const items = [...invoice.lineItems];
    if (toIndex < 0 || toIndex >= items.length) return;
    const [removed] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, removed);
    update({ lineItems: items });
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
  const handleSignatureConfirm = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas || canvas.isEmpty()) return;
    const dataUrl = canvas.getTrimmedCanvas().toDataURL("image/png");
    update({ signatureDataUrl: dataUrl });
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    canvas.clear();
    update({ signatureDataUrl: undefined });
  };

  useEffect(() => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    canvas.clear();
    if (invoice.signatureDataUrl) {
      canvas.fromDataURL(invoice.signatureDataUrl);
    }
  }, [invoice.signatureDataUrl]);

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

  const refreshProfiles = useCallback(() => {
    setClientProfiles(getClientProfiles());
    setCompanyProfiles(getCompanyProfiles());
  }, []);

  const handleSaveClientProfile = () => {
    const name = clientProfileName.trim();
    if (!name) return;
    const saved = saveClientProfile(name, invoice.client);
    setClientProfileName("");
    setSaveClientDialogOpen(false);
    refreshProfiles();
    setSelectedClientProfileId(saved.id);
    toast.success("Client profile saved", {
      description: saved.name,
    });
  };

  const handleSaveCompanyProfile = () => {
    const name = companyProfileName.trim();
    if (!name) return;
    const saved = saveCompanyProfile(name, invoice.company, {
      companyLogoDataUrl: invoice.companyLogoDataUrl,
      signatureDataUrl: invoice.signatureDataUrl,
    });
    setCompanyProfileName("");
    setSaveCompanyDialogOpen(false);
    refreshProfiles();
    setSelectedCompanyProfileId(saved.id);
    toast.success("Company profile saved", {
      description: saved.name,
    });
  };

  const applyClientProfile = (profileId: string) => {
    const profile = clientProfiles.find((item) => item.id === profileId);
    if (!profile) return;
    update({ client: profile.clientInfo });
    setSelectedClientProfileId(profileId);
  };

  const applyCompanyProfile = (profileId: string) => {
    const profile = companyProfiles.find((item) => item.id === profileId);
    if (!profile) return;
    update({
      company: profile.companyInfo,
      companyLogoDataUrl: profile.companyLogoDataUrl,
      signatureDataUrl: profile.signatureDataUrl,
    });
    setSelectedCompanyProfileId(profileId);
  };

  const removeClientProfile = (profileId: string) => {
    deleteClientProfile(profileId);
    if (selectedClientProfileId === profileId) {
      setSelectedClientProfileId("");
    }
    refreshProfiles();
  };

  const removeCompanyProfile = (profileId: string) => {
    deleteCompanyProfile(profileId);
    if (selectedCompanyProfileId === profileId) {
      setSelectedCompanyProfileId("");
    }
    refreshProfiles();
  };

  return (
    <div className="h-full border-r bg-card">
      {/* Main content */}
      <div className="max-h-[calc(100vh-4rem)] overflow-y-auto pb-6">
        <Accordion type="single" collapsible defaultValue="template">
          <AccordionItem value="template">
            <AccordionTrigger>Invoice Templates & branding</AccordionTrigger>
            <AccordionContent className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Invoice template styles</Label>
                <TemplateSegmentControl
                  value={invoice.theme.template}
                  onChange={updateTemplate}
                />
                <span className="text-[10px] text-muted-foreground flex pl-1 items-center gap-1">
                  <IconInfoCircle className="size-2.5 text-muted-foreground" />
                  Choose your template styles
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand-color" className="text-xs">
                  Theme color
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="brand-color"
                    type="color"
                    value={
                      /^#[0-9A-Fa-f]{6}$/.test(invoice.theme.primaryColor ?? "")
                        ? invoice.theme.primaryColor!
                        : "#4f46e5"
                    }
                    onChange={(e) =>
                      updatePrimaryColor(e.target.value || "#4f46e5")
                    }
                    className="h-9 w-14 cursor-pointer rounded-md border border-input bg-transparent p-1 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-border"
                  />
                  <Input
                    type="text"
                    value={primaryColorDisplay}
                    onFocus={() => {
                      setPrimaryColorInput(
                        normalizePrimaryHex(invoice.theme.primaryColor),
                      );
                      setIsEditingHex(true);
                    }}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPrimaryColorInput(v);
                      const hex = v.startsWith("#") ? v.slice(1) : v;
                      if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
                        updatePrimaryColor("#" + hex.toLowerCase());
                      }
                    }}
                    onBlur={() => {
                      const hex = primaryColorInput.startsWith("#")
                        ? primaryColorInput.slice(1)
                        : primaryColorInput;
                      if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
                        updatePrimaryColor("#" + hex.toLowerCase());
                      }
                      setIsEditingHex(false);
                    }}
                    placeholder="#4F46E5"
                    className="text-xs font-mono text-muted-foreground"
                  />
                </div>

                <span className="text-[10px] text-muted-foreground flex pl-1 items-center gap-1">
                  <IconInfoCircle className="size-2.5 text-muted-foreground" />
                  Customize colors to match your brand.
                </span>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="client">
            <AccordionTrigger>Client information</AccordionTrigger>
            {/* Profile row: always visible under trigger, above collapsible content */}
            <div className="flex flex-col gap-2 border-t border-border bg-muted/20 px-4 py-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={selectedClientProfileId}
                  onValueChange={applyClientProfile}
                >
                  <SelectTrigger
                    className={ACCORDION_INPUT_CLASS + " min-w-52 flex-1"}
                  >
                    <SelectValue placeholder="Select a saved client profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientProfiles.length === 0 ? (
                      <SelectItem value="__none" disabled>
                        No saved client profiles, save one to get started
                      </SelectItem>
                    ) : (
                      clientProfiles.map((profile) => (
                        <div
                          key={profile.id}
                          className="flex items-center justify-between gap-2"
                        >
                          <SelectItem
                            key={profile.id}
                            value={profile.id}
                            className="cursor-pointer"
                          >
                            {profile.name}
                          </SelectItem>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive mr-1 hover:bg-destructive/10"
                            onClick={() => removeClientProfile(profile.id)}
                          >
                            <IconTrash className="size-3.5 text-destructive" />
                          </Button>
                        </div>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setClientProfileName(
                      invoice.client.name || "Client Profile",
                    );
                    setSaveClientDialogOpen(true);
                  }}
                >
                  <IconDeviceFloppy />
                  Save Current
                </Button>
              </div>
            </div>

            <AccordionContent className="space-y-6">
              <div className="space-y-1.5">
                <Label
                  htmlFor="client-name"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Client name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="client-name"
                  className={ACCORDION_INPUT_CLASS}
                  placeholder="Enter client name"
                  value={invoice.client.name}
                  onChange={(event) => updateClient("name", event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="client-address"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Client address <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="client-address"
                  rows={3}
                  className="min-h-20 text-sm"
                  placeholder="Street address, city, postal code, country"
                  value={invoice.client.address}
                  onChange={(event) =>
                    updateClient("address", event.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="client-email"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Client email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="client-email"
                    className={ACCORDION_INPUT_CLASS}
                    type="email"
                    placeholder="client@example.com"
                    value={invoice.client.email ?? ""}
                    onChange={(event) =>
                      updateClient("email", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="client-phone"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Client phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="client-phone"
                    className={ACCORDION_INPUT_CLASS}
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
            <div className="flex flex-col gap-2 border-t border-border bg-muted/20 px-4 py-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={selectedCompanyProfileId}
                  onValueChange={applyCompanyProfile}
                >
                  <SelectTrigger
                    className={ACCORDION_INPUT_CLASS + " min-w-52 flex-1"}
                  >
                    <SelectValue placeholder="Select a saved company profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyProfiles.length === 0 ? (
                      <SelectItem value="__none" disabled>
                        No saved company profiles
                      </SelectItem>
                    ) : (
                      companyProfiles.map((profile) => (
                        <div
                          key={profile.id}
                          className="flex items-center justify-between gap-2"
                        >
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.name}
                          </SelectItem>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive mr-1 hover:bg-destructive/10"
                            onClick={() => removeCompanyProfile(profile.id)}
                          >
                            <IconTrash className="size-3.5 text-destructive" />
                          </Button>
                        </div>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setCompanyProfileName(
                      invoice.company.name || "Company Profile",
                    );
                    setSaveCompanyDialogOpen(true);
                  }}
                >
                  <IconDeviceFloppy />
                  Save Current
                </Button>
              </div>
            </div>
            <AccordionContent className="space-y-6">
              <div className="space-y-1.5">
                <Label
                  htmlFor="company-name"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Company name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="company-name"
                  className={ACCORDION_INPUT_CLASS}
                  placeholder="Enter your company name"
                  value={invoice.company.name}
                  onChange={(event) =>
                    updateCompany("name", event.target.value)
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="company-address"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Company address <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="company-address"
                  rows={3}
                  className="min-h-20 text-sm"
                  placeholder="Street address, city, postal code, country"
                  value={invoice.company.address}
                  onChange={(event) =>
                    updateCompany("address", event.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="company-email"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Company email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="company-email"
                    className={ACCORDION_INPUT_CLASS}
                    type="email"
                    placeholder="you@business.com"
                    value={invoice.company.email ?? ""}
                    onChange={(event) =>
                      updateCompany("email", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="company-phone"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Company phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="company-phone"
                    className={ACCORDION_INPUT_CLASS}
                    placeholder="+1 555 000 0000"
                    value={invoice.company.phone ?? ""}
                    onChange={(event) =>
                      updateCompany("phone", event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="company-tax-id"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Tax ID / VAT / GST number
                </Label>
                <Input
                  id="company-tax-id"
                  className={ACCORDION_INPUT_CLASS}
                  placeholder="e.g. VAT DE123456789, GST 22AAAAA0000A1Z5"
                  value={invoice.company.taxId ?? ""}
                  onChange={(event) =>
                    updateCompany("taxId", event.target.value)
                  }
                />
              </div>

              <div className="space-y-2.5 rounded-md border border-border/60 bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Company logo
                </p>
                <div>
                  <Input
                    id="company-logo-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleLogoUpload}
                  />
                  <label
                    htmlFor="company-logo-upload"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/40 bg-background/60 px-6 py-6 text-center hover:bg-muted/70"
                  >
                    <ImageIcon className="mb-2 h-7 w-7 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Drag &amp; drop a logo here, or{" "}
                      <span className="font-medium text-sky-700 underline-offset-4 hover:underline">
                        browse
                      </span>
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      PNG, JPG, GIF, WebP, SVG up to 5MB
                    </p>
                  </label>
                  {invoice.companyLogoDataUrl && (
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="flex-1 truncate text-[11px] text-muted-foreground">
                        Logo added. It will appear on your invoice preview.
                      </p>
                      <Button
                        type="button"
                        size="xs"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() =>
                          update({ companyLogoDataUrl: undefined })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2.5 rounded-md border border-border/60 bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Signature
                </p>
                <div className="space-y-2">
                  <SignatureCanvas
                    ref={signatureCanvasRef}
                    penColor="#020617"
                    backgroundColor="transparent"
                    canvasProps={{
                      className:
                        "h-32 w-full select-none rounded-md border bg-background touch-none",
                    }}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="xs"
                      variant="default"
                      onClick={handleSignatureConfirm}
                    >
                      Confirm signature
                    </Button>
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
                      className="max-w-55 h-7 text-xs file:text-xs cursor-pointer"
                      onChange={handleSignatureUpload}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <IconInfoCircle className="size-3 text-amber-500" />
                    Draw your signature or import an image. It will render near
                    the bottom of the invoice.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="invoice-details">
            <AccordionTrigger>Invoice details</AccordionTrigger>
            <AccordionContent className="space-y-6">
              <div className="space-y-1.5">
                <Label
                  htmlFor="invoice-number"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Invoice number
                </Label>
                <Input
                  id="invoice-number"
                  className={ACCORDION_INPUT_CLASS}
                  placeholder="e.g. INV-2026"
                  value={invoice.meta.invoiceNumber}
                  onChange={(event) =>
                    updateMeta("invoiceNumber", event.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="currency"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Currency
                  </Label>
                  <Select
                    value={invoice.currency}
                    onValueChange={(value) => update({ currency: value })}
                  >
                    <SelectTrigger
                      id="currency"
                      className={ACCORDION_INPUT_CLASS + " w-full"}
                    >
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

                <div className="space-y-1.5">
                  <Label
                    htmlFor="tax-rate"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Tax rate (%)
                  </Label>
                  <Input
                    id="tax-rate"
                    className={ACCORDION_INPUT_CLASS}
                    type="number"
                    min={0}
                    step={0.1}
                    value={(invoice.tax.rate * 100).toString()}
                    onChange={(event) => updateTaxRate(event.target.value)}
                    placeholder="e.g. 10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="discount"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Discount (%)
                  </Label>
                  <Input
                    id="discount"
                    className={ACCORDION_INPUT_CLASS}
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
            <AccordionContent className="">
              <ItemTable
                items={invoice.lineItems}
                currency={invoice.currency}
                onReorder={reorderLineItems}
                onUpdate={updateLineItem}
                onRemove={removeLineItem}
                onAdd={addLineItem}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="notes">
            <AccordionTrigger>Additional notes & terms</AccordionTrigger>
            <AccordionContent className="space-y-5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="notes"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Notes / terms &amp; conditions
                </Label>
                <Textarea
                  id="notes"
                  rows={4}
                  className="min-h-24 text-sm"
                  placeholder="Add payment terms, late fee policies, bank details, or other important notes for your client."
                  value={invoice.notes}
                  onChange={(event) => update({ notes: event.target.value })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <Dialog
        open={saveClientDialogOpen}
        onOpenChange={setSaveClientDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Client Info</DialogTitle>
            <DialogDescription>
              Enter a profile name to reuse this client information.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="e.g. John Construction Client"
            value={clientProfileName}
            onChange={(event) => setClientProfileName(event.target.value)}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSaveClientDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveClientProfile}
              disabled={!clientProfileName.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={saveCompanyDialogOpen}
        onOpenChange={setSaveCompanyDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Company Info</DialogTitle>
            <DialogDescription>
              Enter a profile name to reuse this company information.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="e.g. Main Company Profile"
            value={companyProfileName}
            onChange={(event) => setCompanyProfileName(event.target.value)}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSaveCompanyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveCompanyProfile}
              disabled={!companyProfileName.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
