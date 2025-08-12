"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useTableDrag from "@/hooks/useTableDrag";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/Hooks";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Table as TableType, flexRender } from "@tanstack/react-table";
import { FileText, Loader2 } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { FaList } from "react-icons/fa";
import { Button } from "../ui/button";
import styles from "./commonTable.module.css";

interface CommonTableProps<T> {
  data?: {
    items: T[];
    rowCount?: number;
    numberPerPage: number;
    pageNumber?: number;
    checkLast?: number;
    pageList?: number[];
    pageCount?: number;
  };
  table: TableType<T>;
  isLoading?: boolean;
  showIndex?: boolean;
  isCheckAll?: CheckedState; // Có check all hay không
  selectedRows?: number[] | string[]; // Các ô check, chỉ có giá trị khi isCheckAll = false
  unselectedRows?: number[] | string[]; // Các ô không check, chỉ có giá trị khi unselectedRows = false
  minWidth?: number;
  gapCol?: number;
  onExport?: () => void;
  showExport?: boolean;
  actions?: React.ReactNode[];
  showTitleHeader?: boolean;
  headerBackground?: string;
  borderColor?: string;
  enableTableDrag?: boolean; // Optional: enable/disable table drag
}

type TableProps<T> =
  | ({
      showExport: true;
      onExport: () => void;
      loadingExport: boolean;
    } & CommonTableProps<T>)
  | ({
      showExport?: false;
      loadingExport?: false;
    } & CommonTableProps<T>);

const CommonTable: React.FC<TableProps<any>> = React.memo(
  ({
    data,
    table,
    isLoading = false,
    showIndex = true,
    minWidth,
    gapCol = 4,
    showExport = false,
    onExport,
    loadingExport = false,
    actions = [],
    showTitleHeader = true,
    headerBackground,
    borderColor,
    enableTableDrag = false,
  }) => {
    const tableRef = useRef<HTMLDivElement>(null);
    // Always call the hook, but only use handlers if enabled
    const [handleMouseDown, handleMouseUp, handleMouseMove] = useTableDrag(tableRef);
    const isMobile = useAppSelector(
      (state) => state.systemStateReducer.isMobile
    );

    useEffect(() => {
      if (tableRef?.current?.firstElementChild) {
        const childElement = tableRef.current
          .firstElementChild as HTMLDivElement;

        if (!data?.items?.length || isLoading) {
          childElement.style.overflow = "hidden";
        } else {
          childElement.style.overflow = "auto";
        }
      }
    }, [data?.items?.length, isLoading]);

    return (
      <div className="rounded-none">
        {!isMobile && showTitleHeader && (
          <div
            className={cn("p-2 flex items-center justify-between", "font-bold")}
          >
            <div className="flex gap-x-2">
              <FaList size={24} /> Danh sách
            </div>

            <div className="flex items-center gap-x-2">
              {actions?.map((button, index) => (
                <React.Fragment key={index}>{button}</React.Fragment>
              ))}

              {showExport && onExport ? (
                <Button
                  type="button"
                  onClick={onExport}
                  className="flex gap-x-2 bg-[#00AB56] text-white hover:bg-white hover:text-[#00AB56] border-[#00AB56] border p-2 text-sm"
                >
                  {loadingExport ? (
                    <Loader2 height={16} className="animate-spin" />
                  ) : (
                    <FileText height={16} />
                  )}{" "}
                  Xuất file báo cáo
                </Button>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
        <div
          className={cn(
            "rounded-none overflow-hidden",
            showTitleHeader ? "border border-[#ddd] p-1" : ""
          )}
          ref={tableRef}
        >
          <Table
            className={cn("rounded-none overflow-hidden", styles.commonTable)}
            style={minWidth ? { minWidth: minWidth } : {}}
            {...(enableTableDrag
              ? {
                  onMouseDown: handleMouseDown,
                  onMouseUp: handleMouseUp,
                  onMouseMove: handleMouseMove,
                }
              : {})}
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {showIndex ? (
                    <TableHead
                      className={cn(
                        "text-center font-bold w-[3%] text-[#1F2937] shadow-[0px 4px 0px 0px rgba(0, 0, 0, 0.08)]"
                      )}
                      style={{
                        backgroundColor: headerBackground || "#f4f4f5",
                        ...(borderColor
                          ? { border: `1px solid ${borderColor}` }
                          : {}),
                      }}
                    >
                      STT
                    </TableHead>
                  ) : (
                    <></>
                  )}
                  {headerGroup.headers.map((header) => {
                    return !header?.column?.columnDef?.enableHiding ? (
                      <TableHead
                        key={header.id}
                        className={cn(
                          "text-center font-bold text-[#1F2937] px-2!",
                          ` w-[${header?.getSize()}%] ${
                            gapCol ? `!px-${gapCol}` : ""
                          }`
                        )}
                        style={{
                          backgroundColor: headerBackground || "#f4f4f5",
                          ...(borderColor
                            ? { border: `1px solid ${borderColor}` }
                            : {}),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ) : (
                      <React.Fragment key={header.id}></React.Fragment>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            {data?.items && data?.items?.length > 0 && !isLoading ? (
              <TableBody>
                {table.getRowModel().rows?.length > 0 &&
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={cn(
                        row.index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#F4F4F5]"
                      )}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {showIndex ? (
                        <TableCell
                          className="font-medium text-center border-b border-[#E5E5E5]"
                          style={{
                            ...(borderColor
                              ? { border: `1px solid ${borderColor}` }
                              : {}),
                          }}
                        >
                          {((data?.pageNumber || 1) - 1) *
                            (data?.numberPerPage || 10) +
                            index +
                            1}
                        </TableCell>
                      ) : (
                        <></>
                      )}
                      {row.getVisibleCells().map((cell) =>
                        !cell?.column?.columnDef?.enableHiding ? (
                          <TableCell
                            key={cell.id}
                            className={`border-b border-[#E5E5E5] text-center !px-1 ${
                              gapCol ? `!px-${gapCol}` : ""
                            } `}
                            style={{
                              ...(borderColor
                                ? { border: `1px solid ${borderColor}` }
                                : {}),
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ) : (
                          <React.Fragment key={cell.id}></React.Fragment>
                        )
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            ) : (
              <></>
            )}
          </Table>

          {isLoading ? (
            <div className="mt-0 px-4 py-1.5 bg-white text-center">
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-default-blue" />
              </div>
            </div>
          ) : !data?.items?.length ? (
            <div className="mt-0 px-4 py-1.5 bg-white text-center text-[#737373]">
              Không có dữ liệu
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
);

CommonTable.displayName = "CommonTable";

export default CommonTable;
