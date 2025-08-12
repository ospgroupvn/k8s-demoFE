"use client";

import CommonTable from "@/components/common/commonTable";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AuctionOrgMemberPartners } from "@/types/dauGia";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

interface Props {
  setDeletedMembers: React.Dispatch<React.SetStateAction<string[]>>;
}

const OrgMemberSection = ({ setDeletedMembers }: Props) => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "memberPartners",
  });

  const columns: ColumnDef<AuctionOrgMemberPartners>[] = [
    {
      accessorKey: "fullName",
      header: () => <span>Họ tên</span>,
      cell: ({ row }) => (
        <div className="min-w-50">{row.original.fullName || "-"}</div>
      ),
    },
    {
      accessorKey: "dob",
      header: () => <span>Ngày sinh</span>,
      cell: ({ row }) => (
        <div className="min-w-50">{row.original.dob || "-"}</div>
      ),
    },
    {
      accessorKey: "certCode",
      header: () => <span>Số chứng chỉ hành nghề</span>,
      cell: ({ row }) => (
        <div className="min-w-50">{row.original.certCode || "-"}</div>
      ),
    },
    {
      accessorKey: "dateOfDecision",
      header: "Ngày cấp CCHN",
      cell: ({ row }) => (
        <div className="min-w-50">
          {row.original.dateOfDecision
            ? format(row.original.dateOfDecision, "dd/MM/yyyy")
            : "-"}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    manualPagination: true,
    data: fields as (AuctionOrgMemberPartners & { id: string })[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Collapsible defaultOpen className="mb-4 group/collapsible">
      <CollapsibleTrigger className="font-semibold flex items-center justify-between text-default-blue bg-[#F3F3F3] rounded p-2 w-full">
        Danh sách Thành viên hợp danh thuộc doanh nghiệp
        <ChevronDown
          size={16}
          className="group-data-[state=open]/collapsible:rotate-180 transition-transform"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 bg-white">
        <CommonTable
          data={{
            items: fields,
            numberPerPage: 100,
            pageList: [1],
            pageCount: 1,
          }}
          table={table}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default OrgMemberSection;
