"use client";

import { ChevronDown, X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import clsx from "clsx";
import { Command as CommandPrimitive } from "cmdk";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import { Command, CommandItem, CommandList } from "./command";
import { Label } from "./label";

type DataItem = Record<"value" | "label", string>;

export function MultiSelect({
  label,
  placeholder,
  parentClassName,
  data,
  defaultValue = [],
  onChange,
  value,
  disabled = false,
  allowSelectAll = true,
}: {
  label?: string;
  placeholder?: string;
  parentClassName?: string;
  data: DataItem[];
  defaultValue?: DataItem[];
  onChange?: (values: { value: string; label: string }[]) => void;
  value?: string[];
  disabled?: boolean;
  allowSelectAll?: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<DataItem[]>([...defaultValue]);
  const [selectAll, setSelectAll] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof value !== "undefined") {
      let newSelected = [];
      newSelected = data?.filter((item) => value.includes(item?.value));
      setSelected(newSelected);
      if (
        newSelected?.length === 0 ||
        (newSelected?.length !== data?.length && data?.length > 0)
      ) {
        setSelectAll(false);
      } else {
        setSelectAll(true);
      }
    }
  }, [data, value]);

  React.useEffect(() => {
    const handleClick = (event: any) => {
      if (
        dropdownRef?.current &&
        !dropdownRef?.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [dropdownRef]);

  React.useEffect(() => {
    if (typeof value !== "undefined") {
      let newSelected = [];
      newSelected = data?.filter((item) => value?.includes(item?.value));
      setSelected(newSelected);
      if (
        newSelected?.length === 0 ||
        (newSelected?.length !== data?.length && data?.length > 0)
      ) {
        setSelectAll(false);
      } else {
        setSelectAll(true);
      }
    }
  }, [data, value]);

  const handleUnselect = React.useCallback(
    (item: DataItem) => {
      const newSelected = [...selected]?.filter((s) => s.value !== item.value);
      setSelected(newSelected);
      setSelectAll(newSelected.length === data?.length);
      onChange?.(newSelected);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const newSelected = [...selected];
            newSelected?.pop();
            setSelected(newSelected);
            setSelectAll(newSelected.length === data.length);
            onChange?.(newSelected);
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected]
  );

  // const selectables = data.filter((item) => {
  //   return !selected.some((selectedItem) => {
  //     return JSON.stringify(item) === JSON.stringify(selectedItem);
  //   });
  // });

  const onSelect = (selectedItem: DataItem, checked: CheckedState) => {
    setInputValue("");
    let currentSelected = [...selected];
    if (!checked) {
      const itemIndex = currentSelected?.findIndex(
        (item) => item.value === selectedItem.value
      );
      currentSelected.splice(itemIndex, 1);
      setSelected([...currentSelected]);
    } else {
      currentSelected = [...currentSelected, selectedItem];
      setSelected([...currentSelected]);
    }

    setSelectAll(currentSelected.length === data.length);
    onChange?.(currentSelected);
  };

  const onSelectAll = (checked: CheckedState) => {
    setInputValue("");
    let currentSelected: DataItem[] = [];
    if (checked) {
      setSelectAll(true);
      currentSelected = [...data];
      setSelected(currentSelected);
    } else {
      setSelectAll(false);
      setSelected(currentSelected);
    }

    onChange?.(currentSelected);
  };

  return (
    <div
      className={clsx(
        label && "gap-1.5",
        parentClassName,
        "grid w-full items-center",
        disabled ? "cursor-not-allowed" : ""
      )}
      ref={dropdownRef}
    >
      {label && (
        <Label className="text-[#344054] text-sm font-medium">{label}</Label>
      )}
      <Command className="overflow-visible bg-white">
        <div
          className={cn(
            "group border border-input px-3 py-[5px] text-sm ring-offset-background focus-within:ring-0",
            "focus-within:ring-ring h-9 flex items-center w-full rounded-lg",
            disabled ? "cursor-not-allowed opacity-80 bg-[#F9FAFB]" : ""
          )}
        >
          <div className="flex gap-1 flex-wrap w-full relative">
            {selected?.map((item, index) => {
              if (index > 0) return;
              return (
                <Badge
                  key={item.value}
                  variant="secondary"
                  className={`font-normal rounded-none ${
                    disabled ? "bg-[#d7d8d7]" : ""
                  }`}
                >
                  <div className="max-w-[100px] overflow-hidden text-ellipsis inline-block whitespace-nowrap">
                    {item.label}
                  </div>

                  {!disabled ? (
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      disabled={disabled}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUnselect(item);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      type="button"
                      onClick={() => handleUnselect(item)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  ) : (
                    <></>
                  )}
                </Badge>
              );
            })}
            {selected.length > 1 && <p>{`+${selected.length - 1}`}</p>}
            {/* Avoid having the "Search" Icon */}
            <CommandPrimitive.Input
              ref={inputRef}
              disabled={disabled}
              value={inputValue}
              onValueChange={setInputValue}
              // onBlur={() => setOpen(false)}
              onClick={() => {
                setOpen(!open);
              }}
              placeholder={selected?.length ? "" : placeholder || "Lựa chọn"}
              className={clsx(
                "ml-2 bg-transparent outline-hidden placeholder:text-muted-foreground flex-1 min-w-0",
                disabled ? "cursor-not-allowed" : ""
              )}
            />
            <ChevronDown
              className="ml-auto self-center opacity-50"
              height={16}
              width={16}
            />
          </div>
        </div>
        <div className="relative top-2">
          {open && data?.length > 0 ? (
            <div className="absolute w-full top-0 z-50 border bg-popover text-popover-foreground shadow-md outline-hidden animate-in">
              <CommandList className="overflow-y-auto max-h-52">
                {/* <CommandGroup className="h-full overflow-y-auto"> */}
                {allowSelectAll && (
                  <CommandItem
                    key={"all"}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Checkbox
                      className="mr-1"
                      checked={selectAll}
                      onCheckedChange={(checked) => {
                        onSelectAll(checked);
                      }}
                    />{" "}
                    Tất cả
                  </CommandItem>
                )}
                {data?.map((item) => {
                  return (
                    <CommandItem
                      key={item.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <Checkbox
                        className="mr-1"
                        checked={selected.some(
                          (selectedItem) => selectedItem.value === item.value
                        )}
                        onCheckedChange={(checked) => {
                          onSelect(item, checked);
                        }}
                      />{" "}
                      {item.label}
                    </CommandItem>
                  );
                })}
                {/* </CommandGroup> */}
              </CommandList>
            </div>
          ) : null}
        </div>
      </Command>
    </div>
  );
}
