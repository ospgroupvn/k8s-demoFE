"use client";

import CommonPagination from "@/components/common/commonPagination";
import CommonTable from "@/components/common/commonTable";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { QUERY_KEY } from "@/constants/common";
import { getNotaryInOrg } from "@/service/notaryOrg";
import { NotaryEmplItem } from "@/types/congChung";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const NotarySection = ({ id }: { id?: number }) => {
  const [searchParams, setSearchParams] = useState<{
    pageNo: number;
    pageSize: number;
  }>({ pageNo: 0, pageSize: 10 });
  const listQuery = useQuery({
    queryKey: [QUERY_KEY.CONG_CHUNG.DANH_SACH_CCV, id, searchParams],
    queryFn: () => getNotaryInOrg({ id: id!, ...searchParams }),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const columns: ColumnDef<NotaryEmplItem>[] = [
    {
      header: "Số thẻ CCV",
      cell: ({ row }) => row.original.numberCad || "-",
    },
    {
      header: "Họ và tên",
      cell: ({ row }) => row.original.nameNotaryInfo || "-",
    },
    {
      header: "Số CMND/CCCD/Hộ chiếu",
      cell: ({ row }) => row.original.idNo || "-",
    },
    {
      header: "Ngày sinh",
      cell: ({ row }) =>
        row.original.birthDay
          ? new Date(row.original.birthDay).toLocaleDateString("vi-VN")
          : "-",
    },
    {
      header: "Số điện thoại",
      cell: ({ row }) => row.original.phoneNumberNotaryInfo || "-",
    },
    {
      header: "Địa chỉ thường trú",
      cell: ({ row }) => row.original.addressResident || "-",
    },
    {
      header: "Quyết định bổ nhiệm CCV",
      cell: ({ row }) => row.original.idAppoint || "-",
    },
    {
      header: "Ngày bổ nhiệm",
      cell: ({ row }) => row.original.genDateAppoint || "-",
    },
  ];

  const table = useReactTable({
    manualPagination: true,
    data: listQuery.data?.items || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!id) {
    return <></>;
  }

  return (
    <Collapsible defaultOpen className="mb-4 group/collapsible">
      <CollapsibleTrigger className="font-semibold flex items-center justify-between text-default-blue bg-[#F3F3F3] rounded p-2 w-full">
        Danh sách Công chứng viên thuộc tổ chức
        <ChevronDown
          size={16}
          className="group-data-[state=open]/collapsible:rotate-180 transition-transform"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 bg-white">
        <CommonTable
          data={listQuery.data}
          table={table}
          showTitleHeader={false}
        />

        <CommonPagination
          data={listQuery.data}
          setSearchParam={(value) =>
            setSearchParams((prev) => ({
              ...prev,
              pageNo: value.pageNumber,
              pageSize: value.numberPerPage,
            }))
          }
          searchParam={{
            ...searchParams,
            pageNumber: searchParams.pageNo,
            numberPerPage: searchParams.pageSize,
          }}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default NotarySection;
