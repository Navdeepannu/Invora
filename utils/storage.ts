"use client";

/**
 * Browser storage helpers for invoice drafts, reusable profiles, and saved invoices.
 * Keeps localStorage reads/writes isolated from UI components.
 */
import type {
  InvoiceClientInfo,
  InvoiceCompanyInfo,
  InvoiceData,
} from "@/types/invoice";

const STORAGE_KEYS = {
  clientProfiles: "invoicely:clientProfiles",
  companyProfiles: "invoicely:companyProfiles",
  savedInvoices: "invoicely:savedInvoices",
};

const draftKey = (invoiceId: string) => `invoicely:draft:${invoiceId}`;

export type SavedClientProfile = {
  id: string;
  name: string;
  clientInfo: InvoiceClientInfo;
  createdAt: string;
};

export type SavedCompanyProfile = {
  id: string;
  name: string;
  companyInfo: InvoiceCompanyInfo;
  createdAt: string;
  /**
   * Optional company logo image (data URL) tied to this profile.
   * Older saved profiles may not have this field.
   */
  companyLogoDataUrl?: string;
  /**
   * Optional signature image (data URL) tied to this profile.
   * Older saved profiles may not have this field.
   */
  signatureDataUrl?: string;
};

export type SavedInvoiceStatus = "Draft" | "Complete" | "Partial";

export type SavedInvoiceRecord = {
  id: string;
  name: string;
  invoiceData: InvoiceData;
  createdAt: string;
  status: SavedInvoiceStatus;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Handle quota errors by pruning oldest entries for list-like keys, then retry once.
    if (
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" || error.code === 22)
    ) {
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return;
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Remove the last (oldest) entry; we always prepend new items.
          parsed.pop();
          window.localStorage.setItem(key, JSON.stringify(parsed));
          // Retry writing the new value once after pruning.
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch {
        // If anything goes wrong during pruning, fail silently to avoid breaking the UI.
      }
    }
  }
}

function hasValue(value?: string) {
  return Boolean(value?.trim());
}

function deriveInvoiceStatus(invoice: InvoiceData): SavedInvoiceStatus {
  const requiredFieldsFilled =
    hasValue(invoice.company.name) &&
    hasValue(invoice.company.address) &&
    hasValue(invoice.company.email) &&
    hasValue(invoice.company.phone) &&
    hasValue(invoice.client.name) &&
    hasValue(invoice.client.address) &&
    hasValue(invoice.client.email) &&
    hasValue(invoice.client.phone) &&
    hasValue(invoice.meta.invoiceNumber) &&
    hasValue(invoice.meta.issueDate) &&
    hasValue(invoice.meta.dueDate) &&
    invoice.lineItems.length > 0 &&
    invoice.lineItems.every((item) => hasValue(item.description));

  if (requiredFieldsFilled) return "Complete";

  const hasAnyData =
    hasValue(invoice.company.name) ||
    hasValue(invoice.client.name) ||
    hasValue(invoice.meta.invoiceNumber) ||
    invoice.lineItems.length > 0 ||
    hasValue(invoice.notes);

  return hasAnyData ? "Partial" : "Draft";
}

export function saveInvoiceDraft(invoiceId: string, invoice: InvoiceData) {
  writeJson(draftKey(invoiceId), invoice);
}

export function getInvoiceDraft(invoiceId: string): InvoiceData | null {
  return readJson<InvoiceData | null>(draftKey(invoiceId), null);
}

export function clearInvoiceDraft(invoiceId: string) {
  if (!isBrowser()) return;
  window.localStorage.removeItem(draftKey(invoiceId));
}

export function getClientProfiles(): SavedClientProfile[] {
  return readJson<SavedClientProfile[]>(STORAGE_KEYS.clientProfiles, []);
}

export function saveClientProfile(
  name: string,
  clientInfo: InvoiceClientInfo,
): SavedClientProfile {
  const next: SavedClientProfile = {
    id: createId(),
    name: name.trim(),
    clientInfo,
    createdAt: new Date().toISOString(),
  };
  const all = [next, ...getClientProfiles()];
  writeJson(STORAGE_KEYS.clientProfiles, all);
  return next;
}

export function deleteClientProfile(profileId: string) {
  const all = getClientProfiles().filter((profile) => profile.id !== profileId);
  writeJson(STORAGE_KEYS.clientProfiles, all);
}

export function getCompanyProfiles(): SavedCompanyProfile[] {
  return readJson<SavedCompanyProfile[]>(STORAGE_KEYS.companyProfiles, []);
}

export function saveCompanyProfile(
  name: string,
  companyInfo: InvoiceCompanyInfo,
  options?: { companyLogoDataUrl?: string; signatureDataUrl?: string },
): SavedCompanyProfile {
  const next: SavedCompanyProfile = {
    id: createId(),
    name: name.trim(),
    companyInfo,
    createdAt: new Date().toISOString(),
    // Intentionally skip storing large image data in profiles to avoid localStorage quota issues.
    // Older profiles may still contain logo/signature fields; new ones won't.
  };
  const all = [next, ...getCompanyProfiles()];
  writeJson(STORAGE_KEYS.companyProfiles, all);
  return next;
}

export function deleteCompanyProfile(profileId: string) {
  const all = getCompanyProfiles().filter((profile) => profile.id !== profileId);
  writeJson(STORAGE_KEYS.companyProfiles, all);
}

export function getInvoices(): SavedInvoiceRecord[] {
  return readJson<SavedInvoiceRecord[]>(STORAGE_KEYS.savedInvoices, []);
}

export function saveInvoice(name: string, invoiceData: InvoiceData): SavedInvoiceRecord {
  const next: SavedInvoiceRecord = {
    id: createId(),
    name: name.trim(),
    invoiceData,
    createdAt: new Date().toISOString(),
    status: deriveInvoiceStatus(invoiceData),
  };
  const all = [next, ...getInvoices()];
  writeJson(STORAGE_KEYS.savedInvoices, all);
  return next;
}

export function deleteInvoice(savedInvoiceId: string) {
  const all = getInvoices().filter((item) => item.id !== savedInvoiceId);
  writeJson(STORAGE_KEYS.savedInvoices, all);
}
