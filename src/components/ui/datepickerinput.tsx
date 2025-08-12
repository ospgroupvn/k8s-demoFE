"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "./form";
import { cn } from "@/lib/utils";
import { vi } from "date-fns/locale";

const formatDate = (date: Date | undefined): string => {
  if (!date) return "";
  
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const parseDate = (input: string): Date | null => {
  if (!input.trim()) return null;

  const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = input.match(ddmmyyyyRegex);

  if (!match) return null;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const year = parseInt(match[3], 10);

  const date = new Date(year, month, day);

  const isValid = 
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day;

  return isValid ? date : null;
};

interface DatePickerInputProps {
  placeholder?: string;
  value?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
  disabled?: boolean;
  disabledDate?: (date: Date) => boolean;
  className?: string;
  id?: string;
}

export function DatePickerInput({
  placeholder = "DD/MM/YYYY",
  value: controlledValue,
  onSelect,
  disabled = false,
  disabledDate,
  className = "",
  id = "date",
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(controlledValue);
  const [month, setMonth] = React.useState<Date>(controlledValue || new Date());
  const [inputValue, setInputValue] = React.useState(formatDate(controlledValue));

  const currentDate = controlledValue !== undefined ? controlledValue : internalDate;

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalDate(controlledValue);
      setInputValue(formatDate(controlledValue));
      if (controlledValue) {
        setMonth(controlledValue);
      }
    } else {
      setInternalDate(undefined);
      setInputValue("");
    }
  }, [controlledValue]);

  const handleDateChange = React.useCallback((date: Date | undefined) => {
    if (controlledValue === undefined) {
      setInternalDate(date);
    }
    
    onSelect?.(date);
    
    setInputValue(formatDate(date));
    if (date) {
      setMonth(date);
    }
  }, [controlledValue, onSelect]);

  const handleInputChange = React.useCallback((inputText: string) => {
    setInputValue(inputText);

    if (inputText === "") {
      handleDateChange(undefined);
      return;
    }

    if (inputText.includes("/") && inputText.length >= 8) {
      const parsedDate = parseDate(inputText);
      if (parsedDate && (!disabledDate || !disabledDate(parsedDate))) {
        handleDateChange(parsedDate);
      }
    }
  }, [handleDateChange, disabledDate]);

  const handleInputBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const parsedDate = parseDate(e.target.value);
    
    if (parsedDate && (!disabledDate || !disabledDate(parsedDate))) {
      setInputValue(formatDate(parsedDate));
    } else if (currentDate) {
      setInputValue(formatDate(currentDate));
    } else {
      setInputValue("");
    }
  }, [currentDate, disabledDate]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && !disabled) {
      e.preventDefault();
      setOpen(true);
    }
  }, [disabled]);

  const handleCalendarSelect = React.useCallback((date: Date | undefined) => {
    handleDateChange(date);
    setOpen(false);
  }, [handleDateChange]);

  return (
    <div className={cn("relative", className)}>
      <FormControl>
        <Input
          id={id}
          value={inputValue}
          placeholder={placeholder}
          className="bg-background pr-10"
          disabled={disabled}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
        />
      </FormControl>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            disabled={disabled}
            type="button"
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Chọn ngày</span>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            locale={vi}
            mode="single"
            selected={currentDate}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            disabled={disabledDate}
            onSelect={handleCalendarSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
