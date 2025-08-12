"use client";

import CommonTable from "@/components/common/commonTable";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DatePickerInput } from "@/components/ui/datepickerinput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CERT_STATUS } from "@/constants/dauGia";
import { CertificateSectionItem } from "@/types/dauGia";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format, format as formatDate, isValid } from "date-fns";
import { ChevronDown } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaRegTrashAlt } from "react-icons/fa";
import FileUploadSection from "../fileUploadSection";

interface Props {
  setDeletedCerts: React.Dispatch<React.SetStateAction<string[]>>;
  setDeletedCertFiles: React.Dispatch<
    React.SetStateAction<Record<string, string[]>[]>
  >;
}

const CertificateSection = ({
  setDeletedCerts,
  setDeletedCertFiles,
}: Props) => {
  const form = useFormContext();
  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: "certificates",
  });

  const columns: ColumnDef<CertificateSectionItem>[] = [
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
        const statusObj = CERT_STATUS.find(
          (s) => s.value === row.original.status
        );
        return (
          <span className="text-gray-700 text-sm">
            {statusObj ? statusObj.label : row.original.status || "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "certCode",
      header: () => <span>Số CCHN</span>,
      cell: ({ row }) => (
        <span className="text-gray-700 text-sm">
          {row.original.certCode || "-"}
        </span>
      ),
    },
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
    data: fields as (CertificateSectionItem & { id: string })[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Collapsible defaultOpen className="mt-4 group/collapsible">
      <CollapsibleTrigger className="font-semibold flex items-center justify-between text-default-blue bg-[#F3F3F3] rounded p-2 w-full">
        Thông tin chứng chỉ hành nghề
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

export default CertificateSection;
