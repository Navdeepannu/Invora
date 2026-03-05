"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.replace(/^#/, "").match(/.{2}/g);
  if (!match || match.length !== 3) return null;
  const [r, g, b] = match.map((x) => parseInt(x, 16));
  if ([r, g, b].some((n) => isNaN(n))) return null;
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) =>
        Math.round(Math.max(0, Math.min(255, x)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(
  h: number,
  s: number,
  l: number,
): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const rgb = hexToRgb(hex);
  if (!rgb) return { h: 0, s: 100, l: 50 };
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

const DEFAULT_HEX = "#4f46e5";

type ColorPickerProps = {
  value?: string;
  onChange?: (hex: string) => void;
  id?: string;
  className?: string;
  triggerClassName?: string;
  inputClassName?: string;
};

function ColorPicker({
  value = DEFAULT_HEX,
  onChange,
  id,
  className,
  triggerClassName,
  inputClassName,
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  const normalizedHex = React.useMemo(() => {
    if (!value || !/^#[0-9A-Fa-f]{6}$/.test(value)) return DEFAULT_HEX;
    return value;
  }, [value]);

  const hsl = React.useMemo(() => hexToHsl(normalizedHex), [normalizedHex]);

  const [internalHsl, setInternalHsl] = React.useState(hsl);
  React.useEffect(() => {
    setInternalHsl(hsl);
  }, [hsl, open]);

  const saturationLightnessRef = React.useRef<HTMLDivElement>(null);
  const hueRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef<"sl" | "h" | null>(null);

  const updateFromSl = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = saturationLightnessRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      const s = x * 100;
      const l = (1 - y) * 100;
      setInternalHsl((prev) => {
        const next = { ...prev, s, l };
        onChange?.(hslToHex(next.h, next.s, next.l));
        return next;
      });
    },
    [onChange],
  );

  const updateFromHue = React.useCallback(
    (clientX: number) => {
      const el = hueRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const h = x * 360;
      setInternalHsl((prev) => {
        const next = { ...prev, h };
        onChange?.(hslToHex(next.h, next.s, next.l));
        return next;
      });
    },
    [onChange],
  );

  const handlePointerDownSl = (e: React.PointerEvent) => {
    e.preventDefault();
    isDragging.current = "sl";
    updateFromSl(e.clientX, e.clientY);
  };

  const handlePointerDownHue = (e: React.PointerEvent) => {
    e.preventDefault();
    isDragging.current = "h";
    updateFromHue(e.clientX);
  };

  React.useEffect(() => {
    if (isDragging.current === null) return;
    const onMove = (e: PointerEvent) => {
      if (isDragging.current === "sl") updateFromSl(e.clientX, e.clientY);
      if (isDragging.current === "h") updateFromHue(e.clientX);
    };
    const onUp = () => {
      isDragging.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [updateFromSl, updateFromHue]);

  const hueColor = hslToHex(internalHsl.h, 100, 50);
  const currentHex = hslToHex(internalHsl.h, internalHsl.s, internalHsl.l);

  const [hexInput, setHexInput] = React.useState(normalizedHex);
  React.useEffect(() => {
    setHexInput(normalizedHex);
  }, [normalizedHex]);

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9A-Fa-f#]/g, "");
    const v = raw.startsWith("#") ? raw.slice(0, 7) : raw.slice(0, 6);
    setHexInput(v ? (v.startsWith("#") ? v : `#${v}`) : "");
    const withHash = v.startsWith("#") ? v : v ? `#${v}` : "";
    if (withHash.length === 7 && /^#[0-9A-Fa-f]{6}$/.test(withHash)) {
      onChange?.(withHash);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("flex items-center gap-2", className)}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={id}
            className={cn(
              "flex h-9 w-fit min-w-0 ring-1 ring-border px-2 cursor-pointer items-center gap-2 border-none rounded-lg  bg-transparent  outline-none",
              triggerClassName,
            )}
          >
            <span
              className="size-6 shrink-0 rounded-md shadow-inner"
              style={{ backgroundColor: currentHex }}
            />
          </button>
        </PopoverTrigger>
        <Input
          type="text"
          value={hexInput}
          onChange={handleHexInputChange}
          placeholder="#4F46E5"
          className={cn("h-9 w-24 font-mono text-sm", inputClassName)}
          onClick={() => setOpen(true)}
        />
      </div>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-auto rounded-xl border border-border p-2 shadow-lg"
      >
        <div className="space-y-3">
          <div
            ref={saturationLightnessRef}
            role="group"
            aria-label="Saturation and lightness"
            className="relative h-36 w-64 cursor-crosshair select-none overflow-hidden rounded-lg"
            style={{
              background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`,
            }}
            onPointerDown={handlePointerDownSl}
          >
            <span
              className="absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white shadow-md ring-1 ring-black/10"
              style={{
                left: `${internalHsl.s}%`,
                top: `${100 - internalHsl.l}%`,
                backgroundColor: currentHex,
              }}
            />
          </div>
          {/* Hue */}
          <div
            ref={hueRef}
            role="slider"
            tabIndex={0}
            aria-label="Hue"
            aria-valuenow={internalHsl.h}
            aria-valuemin={0}
            aria-valuemax={360}
            className="relative h-3 w-full cursor-pointer select-none rounded-lg border border-border/60"
            style={{
              background:
                "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
            }}
            onPointerDown={handlePointerDownHue}
          >
            <span
              className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white shadow-md ring-1 ring-black/10"
              style={{
                left: `${(internalHsl.h / 360) * 100}%`,
                backgroundColor: hueColor,
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { ColorPicker };
