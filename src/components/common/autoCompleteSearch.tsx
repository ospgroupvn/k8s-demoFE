"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, normalizeText } from "@/lib/utils";
import { CheckIcon, ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";
import { useInView } from "react-intersection-observer";
import { FormControl } from "../ui/form";

interface AutoCompleteSearch {
  displayKey: string; // Trường hiển thị mặc định ở label
  secondDisplayKey?: string; // Nếu có second display key thì sẽ hiển thị displayKey - secondDisplayKey ở label
  emptyMsg: string;
  optionKey: string; // key khi map danh sách option
  valueKey: string;
  placeholder: string;
  value: string;
  options: any[];
  onSelect: (value: any) => void;
  defaultValue?: string;
  isLoading?: boolean;
  onScrollLoad?: () => void; // Dùng cho lazy loading
  maxLength?: number;
  inputValue?: string;
  onInputValueChange?: (value: string) => void;
  onLazyLoadingSearch?: (value: string) => void; // Gọi khi text tìm kiếm thay đổi
  inputDebounce?: number; // Thời gian debounce trước khi chạy onInputValueChange
  showSearch?: boolean;
  selectPlaceholder?: string;
  disabled?: boolean;
  defaultSelect?: boolean;
  triggerClassName?: string;
  modal?: boolean;
}

const AutoCompleteSearch: React.FC<AutoCompleteSearch> = ({
  displayKey,
  secondDisplayKey,
  emptyMsg,
  optionKey,
  valueKey,
  options,
  onSelect,
  placeholder,
  value,
  defaultValue,
  isLoading = false,
  onScrollLoad,
  maxLength = 100,
  inputValue,
  onInputValueChange,
  onLazyLoadingSearch,
  inputDebounce = 500,
  showSearch = true,
  selectPlaceholder,
  disabled = false,
  defaultSelect = true,
  triggerClassName,
  modal = false,
}) => {
  const isControlled = typeof value !== "undefined"; // Component có controlled hay không
  const hasDefaultValue = typeof defaultValue !== "undefined"; // Component có giá trị mặc định hay không
  const isLazyLoading = typeof onScrollLoad !== "undefined"; // Có lazy load hay không

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [currentScrollX, setCurrentScrollX] = useState<number>(0);
  const [internalValue, setInternalValue] = useState<string>(
    hasDefaultValue ? defaultValue : ""
  );
  const [lazyLoadValue, setLazyLoadValue] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const timeout = useRef<any>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Memoized selectOptions must be defined before virtualizer
  const selectOptions = useMemo(() => {
    if (!options?.length) {
      return [];
    }

    // Nếu lazy loading thì phải đảm bảo giá trị select luôn có trong danh sách
    if (options?.length && isLazyLoading) {
      const arr = options.filter(
        (item) => item[valueKey] !== lazyLoadValue?.[valueKey]
      );
      const newOptions = lazyLoadValue
        ? [lazyLoadValue, ...arr].filter(
            (value, index, array) => array.indexOf(value) === index
          )
        : options;

      return newOptions;
    }

    if (isLazyLoading || !input) {
      return options;
    }

    // Tìm kiếm trong trường hợp không lazy load
    const newOptions: any[] = [];
    const normalizeInput = normalizeText(input)?.toLowerCase().trim();
    options.forEach((item) => {
      const normalizeDisplay = normalizeText(item?.[displayKey]);
      const normalizeSecondDisplay = secondDisplayKey
        ? normalizeText(item?.[secondDisplayKey])
        : "";
      if (
        normalizeDisplay?.toLowerCase()?.includes(normalizeInput) ||
        normalizeSecondDisplay?.toLowerCase()?.includes(normalizeInput)
      ) {
        newOptions.push(item);
      }
    });
    return newOptions;
  }, [
    displayKey,
    input,
    isLazyLoading,
    options,
    secondDisplayKey,
    lazyLoadValue,
    valueKey,
  ]);
  // Only enable virtualization if there are more than 100 options
  const enableVirtual = selectOptions.length > 50;
  const rowVirtualizer = useVirtualizer({
    count: enableVirtual ? selectOptions.length : 0,
    getScrollElement: () => (enableVirtual ? listRef.current : null),
    estimateSize: () => 45, // fallback estimate, can be any reasonable value
    overscan: 6,
  });

  const { ref, inView } = useInView({
    root: rootRef.current,
    skip: typeof onScrollLoad === "undefined",
  });

  const currentValue = isControlled ? value : internalValue;
  const currentInputValue =
    typeof inputValue === "undefined" ? input : inputValue;

  useEffect(() => {
    if (!open || !currentValue) {
      onInputChange("");
    }
    if (!currentValue) {
      setLazyLoadValue(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue, open]);

  /* Gọi API lấy thêm dữ liệu khi lazy load, đồng thời lưu lại scrollTop hiện tại */
  useEffect(() => {
    if (inView && typeof onScrollLoad !== "undefined") {
      if (rootRef.current) {
        setCurrentScrollX(rootRef.current?.scrollTop || 0);
      }
      if (!isTyping) {
        onScrollLoad();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // Thêm ResizeObserver để set scrollTop sau khi dữ liệu thay đổi
  // Nếu không sẽ bị scroll lên đầu sau khi re-render
  useLayoutEffect(() => {
    const element = rootRef?.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      if (entries?.[0]) {
        element.scrollTop = currentScrollX;
      }
    });

    observer.observe(element.children[0]);
    return () => {
      observer.disconnect();
    };
  }, [currentScrollX]);

  // useEffect(() => {
  //   if (isLazyLoading) {
  //     setLazyLoadValue(
  //       selectOptions?.find(
  //         item => item?.[valueKey].toString() === currentValue
  //       ) || {}
  //     )
  //   }
  // }, [isLazyLoading, selectOptions, currentValue])

  const handleSelect = (val: any) => {
    const newValue = val === currentValue ? "" : val;
    const selectedOption = selectOptions?.find(
      (item) => item?.[valueKey].toString() === val
    );

    if (isControlled && typeof onSelect !== "undefined") {
      if (newValue === "") {
        onSelect({ [valueKey]: "", [displayKey]: "" });
      } else {
        onSelect(
          selectedOption || { [valueKey]: newValue, [displayKey]: newValue }
        );
      }
    } else {
      setInternalValue(newValue);
    }

    if (isLazyLoading) {
      setLazyLoadValue(
        selectOptions?.find((item) => item?.[valueKey].toString() === val) || {}
      );
    }

    if (!newValue) {
      setLazyLoadValue(null);
    }

    onInputChange("");
    setOpen(false);
  };

  const onInputChange = (value: string) => {
    if (typeof onInputValueChange !== "undefined") {
      onInputChange(value);
    } else {
      setInput(value);
    }
    if (typeof onLazyLoadingSearch !== "undefined") {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(() => {
        setIsTyping(false);
        onLazyLoadingSearch(value);
      }, inputDebounce);
    }
  };

  // Trường hợp lazy load thì không tìm kiếm khi người dùng đang nhập
  const onKeyDown = () => {
    if (typeof onLazyLoadingSearch !== "undefined") {
      setIsTyping(true);
    }
  };

  const generateDisplayText = useMemo((): string => {
    let returnStr = "-";

    if (!currentValue) {
      return selectPlaceholder || "Tất cả";
    }

    // Nếu có trong danh sách thì lấy giá trị từ danh sách ra
    if (
      selectOptions?.length &&
      selectOptions?.findIndex(
        (item) => item?.[valueKey]?.toString() === currentValue
      ) !== -1
    ) {
      returnStr =
        selectOptions?.find(
          (op) => op?.[valueKey]?.toString() == currentValue
        )?.[displayKey] || "";

      if (
        secondDisplayKey &&
        selectOptions?.find(
          (op) => op?.[valueKey]?.toString() == currentValue
        )?.[secondDisplayKey]
      ) {
        returnStr +=
          " - " +
          (selectOptions?.find(
            (op) => op?.[valueKey]?.toString() == currentValue
          )?.[secondDisplayKey] || "");
      }
    } else {
      // Nếu không có trong danh sách (lazy load) thì lấy giá trị lazy load đã lưu
      // Nếu k phải là lazy load thì lấy lại currentValue làm option
      if (isLazyLoading) {
        returnStr = lazyLoadValue?.[displayKey] || "";

        if (secondDisplayKey && lazyLoadValue?.[secondDisplayKey]) {
          returnStr += " - " + (lazyLoadValue?.[secondDisplayKey] || "");
        }
      } else {
        const selectedOption =
          options.find(
            (item) => item?.[valueKey]?.toString() === currentValue
          ) || {};

        returnStr = selectedOption?.[displayKey];

        if (secondDisplayKey && selectedOption?.[secondDisplayKey]) {
          returnStr += " - " + (selectedOption?.[secondDisplayKey] || "");
        }
      }
    }

    return returnStr;
  }, [
    currentValue,
    displayKey,
    isLazyLoading,
    lazyLoadValue,
    options,
    secondDisplayKey,
    selectOptions,
    selectPlaceholder,
    valueKey,
  ]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger aria-label="PopoverTrigger" asChild disabled={disabled}>
        <FormControl>
          <Button
            name="selectTrigger"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "px-3 w-full flex items-center justify-between rounded-lg bg-white hover:bg-white min-w-0",
              !currentValue && "text-muted-foreground",
              triggerClassName
            )}
          >
            <span className="truncate flex-1 text-left">
              {generateDisplayText}
            </span>
            <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" fullWidth={true}>
        <Command shouldFilter={false} loop>
          {showSearch && (
            <CommandInput
              className="h-8"
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              maxLength={maxLength}
              value={currentInputValue}
              onValueChange={onInputChange}
            />
          )}
          <CommandList>
            {!isLoading && (
              <CommandEmpty>
                {emptyMsg || "Không tìm thấy dữ liệu"}
              </CommandEmpty>
            )}
            <CommandGroup
              className={`max-h-52 relative ${
                enableVirtual ? "" : "overflow-y-auto"
              }`}
              ref={rootRef}
            >
              {enableVirtual ? (
                <div
                  ref={listRef}
                  style={{
                    height: "208px",
                    overflowY: "auto",
                    position: "relative",
                  }}
                >
                  {/* Default select (All) option, not virtualized */}
                  {!isLoading && selectOptions?.length > 0 && defaultSelect && (
                    <CommandItem
                      key="all-select"
                      value="all"
                      onSelect={() => handleSelect("")}
                      className="hover:bg-[#f5f5f5] cursor-pointer"
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4 font-semibold",
                          currentValue === "" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {selectPlaceholder || "Tất cả"}
                    </CommandItem>
                  )}
                  <div
                    style={{
                      height: rowVirtualizer.getTotalSize(),
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    {rowVirtualizer
                      .getVirtualItems()
                      .map((virtualRow: VirtualItem) => {
                        const op = selectOptions[virtualRow.index];
                        return (
                          <CommandItem
                            className="cursor-pointer text-ellipsis"
                            value={
                              displayKey && secondDisplayKey
                                ? op[displayKey] +
                                  (op[secondDisplayKey]
                                    ? " - " + op[secondDisplayKey]
                                    : "")
                                : valueKey && !secondDisplayKey
                                ? op[valueKey]
                                : ""
                            }
                            onSelect={() =>
                              handleSelect(op[valueKey].toString())
                            }
                            forceMount={
                              currentValue === op[valueKey].toString()
                            }
                            key={op[optionKey]}
                            ref={rowVirtualizer.measureElement}
                            data-index={virtualRow.index}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              transform: `translateY(${virtualRow.start}px)`,
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4 font-semibold",
                                currentValue === op[valueKey].toString()
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {displayKey && secondDisplayKey
                              ? op[displayKey] +
                                (op[secondDisplayKey]
                                  ? " - " + op[secondDisplayKey]
                                  : "")
                              : displayKey && !secondDisplayKey
                              ? op[displayKey]
                              : ""}
                          </CommandItem>
                        );
                      })}
                  </div>
                  {selectOptions?.length > 0 && <div ref={ref} />}
                </div>
              ) : (
                <>
                  {/* Default select (All) option, not virtualized */}
                  {!isLoading && selectOptions?.length > 0 && defaultSelect && (
                    <CommandItem
                      key="all-select"
                      value="all"
                      onSelect={() => handleSelect("")}
                      className="hover:bg-[#f5f5f5] cursor-pointer"
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4 font-semibold",
                          currentValue === "" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {selectPlaceholder || "Tất cả"}
                    </CommandItem>
                  )}
                  {selectOptions.map((op) => (
                    <CommandItem
                      className="cursor-pointer"
                      key={op[optionKey]}
                      value={
                        displayKey && secondDisplayKey
                          ? op[displayKey] +
                            (op[secondDisplayKey]
                              ? " - " + op[secondDisplayKey]
                              : "")
                          : valueKey && !secondDisplayKey
                          ? op[valueKey]
                          : ""
                      }
                      onSelect={() => handleSelect(op[valueKey].toString())}
                      forceMount={currentValue === op[valueKey].toString()}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4 font-semibold",
                          currentValue === op[valueKey].toString()
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {displayKey && secondDisplayKey
                        ? op[displayKey] +
                          (op[secondDisplayKey]
                            ? " - " + op[secondDisplayKey]
                            : "")
                        : displayKey && !secondDisplayKey
                        ? op[displayKey]
                        : ""}
                    </CommandItem>
                  ))}
                  {selectOptions?.length > 0 && <div ref={ref} />}
                </>
              )}
            </CommandGroup>
            {isLoading && (
              <CommandGroup className="w-full py-2">
                <div className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
export default AutoCompleteSearch;
