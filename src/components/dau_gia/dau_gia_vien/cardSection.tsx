"use client";

import CommonTable from "@/components/common/commonTable";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CARD_STATUS } from "@/constants/dauGia";
import { CardSectionItem } from "@/types/dauGia";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

interface Props {
  setDeletedCards: React.Dispatch<React.SetStateAction<string[]>>;
  setDeletedCardFiles: React.Dispatch<
    React.SetStateAction<Record<string, string[]>[]>
  >;
}

const CardSection = ({ setDeletedCards, setDeletedCardFiles }: Props) => {
  const form = useFormContext();

  // Only watch departmentCode fields for dynamic queries, not the whole cards array
  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: "cards",
  });

  // Watch only departmentCode for each row
  // const departmentCodes =
  //   useWatch({
  //     control: form.control,
  //     name: fields.map((_, i) => `cards.${i}.departmentCode`),
  //   }) || [];

  // const cardDepartmentCodes: { index: number; departmentCode: string }[] =
  //   fields.map((field, index) => ({
  //     index,
  //     departmentCode: departmentCodes[index] || "",
  //   }));

  // const departmentQuery = useQuery({
  //   queryKey: [QUERY_KEY.COMMON.DEPARTMENT],
  //   queryFn: () => getListDepartment(),
  //   refetchOnWindowFocus: false,
  // });

  // // Create queries for each unique department code
  // const uniqueDepartmentCodes: string[] = useMemo(
  //   () => [
  //     ...new Set(
  //       cardDepartmentCodes.map((item) => item.departmentCode).filter(Boolean)
  //     ),
  //   ],
  //   [cardDepartmentCodes]
  // );

  // const orgQueries = useQueries({
  //   queries: uniqueDepartmentCodes.map((departmentCode) => ({
  //     queryKey: [QUERY_KEY.DAU_GIA.DOANH_NGHIEP, departmentCode],
  //     queryFn: () =>
  //       getListAuctionOrg(
  //         departmentCode,
  //         AUCTION_ORG_TYPE_PRIVATE.map((item) => item.value)
  //       ),
  //     enabled: !!departmentCode,
  //     refetchOnWindowFocus: false,
  //     staleTime: 1000 * 60 * 5,
  //   })),
  // });

  // Helper function to get org options for a specific row
  // const getOrgOptionsForRow = useCallback(
  //   (departmentCode: string) => {
  //     if (!departmentCode) return [];
  //     const orgQuery = orgQueries.find(
  //       (q, idx) => uniqueDepartmentCodes[idx] === departmentCode
  //     );
  //     return orgQuery?.data || [];
  //   },
  //   [orgQueries, uniqueDepartmentCodes]
  // );

  const columns: ColumnDef<CardSectionItem>[] = [
    {
      accessorKey: "numberOfDecision",
      header: () => <span>Số quyết định</span>,
      cell: ({ row }) => (
        <span className="text-gray-700 text-sm">
          {row.original.numberOfDecision || "-"}
        </span>
      ),
    },
    {
      accessorKey: "dateOfDecision",
      header: () => <span>Ngày quyết định</span>,
      cell: ({ row }) => (
        <span className="text-gray-700 text-sm">
          {row.original.dateOfDecision
            ? format(row.original.dateOfDecision, "dd/MM/yyyy")
            : "-"}
        </span>
      ),
    },
    {
      accessorKey: "effectiveDate",
      header: () => <span>Ngày hiệu lực</span>,
      cell: ({ row }) => (
        <span className="text-gray-700 text-sm">
          {row.original.effectiveDate
            ? format(row.original.effectiveDate, "dd/MM/yyyy")
            : "-"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: () => <span>Loại quyết định</span>,
      cell: ({ row }) => {
        const statusObj = CARD_STATUS.find(
          (s) => s.value === row.original.status
        );
        return (
          <span className="text-gray-700 text-sm">
            {statusObj ? statusObj.label : row.original.status || "-"}
          </span>
        );
      },
    },
    // {
    //   accessorKey: "departmentCode",
    //   header: () => <span>Sở tư pháp</span>,
    //   cell: ({ row }) => {
    //     return <span className="text-gray-700 text-sm">-</span>;
    //   },
    // },
    {
      accessorKey: "orgName",
      header: () => <span>Tổ chức đấu giá</span>,
      cell: ({ row }) => (
        <span className="text-gray-700 text-sm">
          {row.original.orgName || "-"}
        </span>
      ),
    },
    {
      accessorKey: "cardCode",
      header: () => <span>Số thẻ</span>,
      cell: ({ row }) => (
        <span className="text-gray-700 text-sm">
          {row.original.cardCode || "-"}
        </span>
      ),
    },
    // {
    //   accessorKey: "issueDate",
    //   header: () => <span>Ngày cấp</span>,
    //   cell: ({ row }) => (
    //     <span className="text-gray-700 text-sm">
    //       {row.original.dateOfDecision
    //         ? format(row.original.dateOfDecision, "dd/MM/yyyy")
    //         : "-"}
    //     </span>
    //   ),
    // },
    // {
    //   accessorKey: "files",
    //   header: "File đính kèm",
    //   cell: ({ row }) => (
    //     <span className="text-gray-700 text-sm">
    //       {(row.original.files && row.original.files.length > 0)
    //         ? row.original.files.map((file, idx) => (
    //             <span key={file.filePath || idx} className="block truncate max-w-[180px]">{file.fileName || file.filePath}</span>
    //           ))
    //         : "-"}
    //     </span>
    //   ),
    // },
  ];

  const table = useReactTable({
    manualPagination: true,
    data: fields as (CardSectionItem & { id: string })[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Collapsible defaultOpen className="mt-4 group/collapsible">
      <CollapsibleTrigger className="font-semibold flex items-center justify-between text-default-blue bg-[#F3F3F3] rounded p-2 w-full">
        Thông tin thẻ đấu giá viên
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
          actions={[]}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CardSection;
