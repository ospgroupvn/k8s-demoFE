"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Matcher } from "react-day-picker";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormControl } from "./form";

interface DatePickerProps {
  selected: Date | undefined;
  onSelect: (...event: any[]) => void;
  placeholder?: string;
  disabledDate?: Matcher | Matcher[];
  disabled?: boolean;
  displayFormat?: string;
  defaultDate?: Date;
  fromYear?: number;
  toYear?: number;
  onResetRangeDate?: () => void;
  name?: string;
}

export function DatePicker({
  selected,
  placeholder,
  disabled = false,
  disabledDate,
  onSelect,
  displayFormat = "dd/MM/yyyy",
  defaultDate = undefined,
  fromYear = 1900,
  toYear = 2100,
  onResetRangeDate,
  name,
}: DatePickerProps) {
  return (
    <Popover modal={true}>
      <PopoverTrigger asChild disabled={disabled}>
        <FormControl>
          <Button
            name={name}
            className={cn(
              "group w-full pl-3 text-left font-normal flex justify-start rounded-md",
              !selected && "text-muted-foreground",
              disabled && "opacity-80 bg-[#f9fafb]"
            )}
            variant={"outline"}
            disabled={disabled}
          >
            {selected ? (
              format(selected, displayFormat)
            ) : (
              <span className="text-muted-foreground">
                {placeholder || "Ngày"}
              </span>
            )}
            {/* <CalendarIcon
            className={cn(
              "ml-auto h-4 w-4 opacity-50 transition-all",
              // selected && !disabled ? "group-hover:hidden" : ""
              ((defaultDate &&
                format(defaultDate, displayFormat) !==
                  (selected ? format(selected, displayFormat) : null)) ||
                (!defaultDate && selected)) &&
                !disabled
                ? "group-hover:hidden"
                : ""
            )}
          />
          <IoMdCloseCircle
            className={cn(
              "ml-auto h-4 w-4 opacity-50 transition-all hover:scale-[1.05] hidden",
              // selected && !disabled ? "group-hover:block" : ""
              ((defaultDate &&
                format(defaultDate, displayFormat) !==
                  (selected ? format(selected, displayFormat) : null)) ||
                (!defaultDate && selected)) &&
                !disabled
                ? "group-hover:block"
                : ""
            )}
            onClick={(e) => {
              e.preventDefault();
              onSelect(defaultDate);
              if (onResetRangeDate) {
                onResetRangeDate();
              }
            }}
          /> */}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          locale={vi}
          mode="single"
          selected={selected}
          onSelect={(value) => {
            if (value) {
              onSelect(value);
            } else {
              onSelect(defaultDate);
              if (onResetRangeDate) {
                onResetRangeDate();
              }
            }
          }}
          disabled={disabledDate}
          // initialFocus
          startMonth={new Date(fromYear, 0)}
          endMonth={new Date(toYear, 11)}
        />
      </PopoverContent>
    </Popover>
  );
}
