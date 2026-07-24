"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function toISODateString(date: Date | undefined): string {
  if (!date || !isValidDate(date)) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseISODate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return undefined;

  return createLocalDate(Number(match[1]), Number(match[2]), Number(match[3]));
}

const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

function createLocalDate(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : undefined;
}

function parseDisplayDate(value: string): Date | undefined {
  const trimmed = value.trim();
  const isoDate = parseISODate(trimmed);
  if (isoDate) return isoDate;

  const numeric = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (numeric) {
    return createLocalDate(
      Number(numeric[3]),
      Number(numeric[1]),
      Number(numeric[2]),
    );
  }

  const named = /^([A-Za-z]+) (\d{1,2}), (\d{4})$/.exec(trimmed);
  if (!named) return undefined;

  const month = MONTH_NAMES.indexOf(named[1].toLowerCase()) + 1;
  return month
    ? createLocalDate(Number(named[3]), month, Number(named[2]))
    : undefined;
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

type DatePickerProps = {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function DatePicker({
  id,
  label,
  value = "",
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  return (
    <DatePickerControl
      key={value}
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  );
}

function DatePickerControl({
  id,
  label,
  value,
  onChange,
  placeholder,
  className,
}: Required<Pick<DatePickerProps, "value" | "placeholder">> &
  Omit<DatePickerProps, "value" | "placeholder">) {
  const [open, setOpen] = React.useState(false);
  const parsed = parseISODate(value);
  const [date, setDate] = React.useState<Date | undefined>(parsed);
  const [displayValue, setDisplayValue] = React.useState(formatDate(parsed));
  const [month, setMonth] = React.useState<Date | undefined>(parsed ?? new Date());

  const handleSelect = (d: Date | undefined) => {
    setDate(d);
    setDisplayValue(formatDate(d));
    setOpen(false);
    onChange?.(toISODateString(d));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setDisplayValue(v);
    if (!v.trim()) {
      setDate(undefined);
      onChange?.("");
      return;
    }

    const d = parseDisplayDate(v);
    if (d) {
      setDate(d);
      setMonth(d);
      onChange?.(toISODateString(d));
    }
  };

  return (
    <Field className={className}>
      {label && (
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
      )}
      <InputGroup>
        <InputGroupInput
          id={id}
          value={displayValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
              >
                <CalendarIcon />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={date}
                month={month}
                onMonthChange={setMonth}
                onSelect={handleSelect}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

export function DatePickerInput() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    new Date("2025-06-01"),
  );
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));

  return (
    <Field className="mx-auto w-48">
      <FieldLabel htmlFor="date-required">Subscription Date</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="date-required"
          value={value}
          placeholder="June 01, 2025"
          onChange={(e) => {
            const date = new Date(e.target.value);
            setValue(e.target.value);
            if (isValidDate(date)) {
              setDate(date);
              setMonth(date);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                id="date-picker"
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
              >
                <CalendarIcon />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={date}
                month={month}
                onMonthChange={setMonth}
                onSelect={(date) => {
                  setDate(date);
                  setValue(formatDate(date));
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
