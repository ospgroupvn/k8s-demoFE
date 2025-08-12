"use client";

import CommonTable from "@/components/common/commonTable";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DGVMemberItem } from "@/types/dauGia";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";

interface Props {
  auctioneers: DGVMemberItem[];
}

const AuctioneerSection = ({ auctioneers }: Props) => {
  const columns: ColumnDef<DGVMemberItem>[] = [
    {
      accessorKey: "fullname",
      header: "Họ và tên",
      cell: ({ row }) => (
        <div className="min-w-50">{row.original.fullname || "-"}</div>
      ),
    },
    {
      accessorKey: "dob",
      header: "Năm sinh",
      cell: ({ row }) => (
        <div className="min-w-50">{row.original.dob || "-"}</div>
      ),
    },
    {
      accessorKey: "cerCode",
      header: "Số chứng chỉ hành nghề",
      cell: ({ row }) => (
        <div className="min-w-50">{row.original.cerCode || "-"}</div>
      ),
    },
    {
      accessorKey: "cerDOI",
      header: "Ngày cấp CCHN",
      cell: ({ row }) => (
        <div className="min-w-50">
          {row.original.cerDOI
            ? format(new Date(row.original.cerDOI), "dd/MM/yyyy")
            : "-"}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    manualPagination: true,
    data: (auctioneers as DGVMemberItem[]) || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 1000,
      },
    },
  });

  return (
    <Collapsible defaultOpen className="mb-4 group/collapsible">
      <CollapsibleTrigger className="font-semibold flex items-center justify-between text-default-blue bg-[#F3F3F3] rounded p-2 w-full">
        Danh sách đấu giá viên thuộc tổ chức
        <ChevronDown
          size={16}
          className="group-data-[state=open]/collapsible:rotate-180 transition-transform"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 bg-white">
        <div style={{ maxHeight: 1000, overflowY: "auto" }}>
          <CommonTable
            data={{
              items: (auctioneers as DGVMemberItem[]) || [],
              numberPerPage: 1000,
              pageNumber: 1,
            }}
            table={table}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AuctioneerSection;
