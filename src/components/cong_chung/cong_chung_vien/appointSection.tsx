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
import { NOTARY_APPOINT_LIST } from "@/constants/congChung";
import { CCVAppointPrivate } from "@/types/congChung";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaRegTrashAlt } from "react-icons/fa";
import FileUploadSection from "../../dau_gia/fileUploadSection";

interface AppointSectionProps {
  setDeletedAppoints: React.Dispatch<React.SetStateAction<string[]>>;
  setDeletedAppointFiles: React.Dispatch<
    React.SetStateAction<Record<string, string[]>[]>
  >;
}

const AppointSection = ({
  setDeletedAppoints,
  setDeletedAppointFiles,
}: AppointSectionProps) => {
  const form = useFormContext();
  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: "appoints",
  });

  const columns: ColumnDef<Partial<CCVAppointPrivate>>[] = [
    {
      accessorKey: "type",
      header: "Loại",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`appoints.${row.index}.type`}
          render={({ field }) => (
            <FormItem className="min-w-50">
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {NOTARY_APPOINT_LIST.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      ),
    },
    {
      accessorKey: "dispatchCode",
      header: "Số văn bản đề nghị/ Số quyết định",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`appoints.${row.index}.dispatchCode`}
          render={({ field }) => (
            <FormItem className="min-w-50">
              <FormControl>
                <Input placeholder="Nhập số văn bản" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      ),
    },
    {
      accessorKey: "dateSign",
      header: "Ngày đề nghị/quyết định",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`appoints.${row.index}.dateSign`}
          render={({ field }) => (
            <FormItem className="min-w-50">
              <FormControl>
                <DatePickerInput
                  placeholder="Ngày đề nghị/quyết định"
                  value={field.value}
                  onSelect={field.onChange}
                  disabledDate={(date) => date > new Date()}
                />
              </FormControl>
            </FormItem>
          )}
        />
      ),
    },
    {
      accessorKey: "effectiveDate",
      header: () => "Ngày hiệu lực",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`appoints.${row.index}.effectiveDate`}
          render={({ field }) => (
            <FormItem className="min-w-50">
              <FormControl>
                <DatePickerInput
                  placeholder="Ngày hiệu lực"
                  value={field.value}
                  onSelect={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      ),
    },
    {
      accessorKey: "signer",
      header: "Người ký",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`appoints.${row.index}.signer`}
          render={({ field }) => (
            <FormItem className="min-w-50">
              <FormControl>
                <Input placeholder="Nhập người ký" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      ),
    },
    {
      accessorKey: "files",
      header: "File đính kèm",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`appoints.${row.index}.files`}
          render={({ field }) => (
            <FileUploadSection
              files={field.value || []}
              onFilesChange={field.onChange}
              onFileDelete={(file) => {
                if (row.original.linkFile) {
                  setDeletedAppointFiles((prev) => {
                    const existingFiles = (prev || [])?.find(
                      (item) => item[row.original.linkFile!]
                    );
                    const currentFiles =
                      existingFiles?.[row.original.linkFile!] || [];
                    return [
                      ...(prev || [])?.filter((item) => !item[row.original.linkFile!]),
                      {
                        [row.original.linkFile!]: [
                          ...currentFiles,
                          file.filePath,
                        ],
                      },
                    ];
                  });
                }
              }}
              uploadId={`file-upload-appoint-${row.index}`}
            />
          )}
        />
      ),
    },
    {
      header: "Chức năng",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <FaRegTrashAlt
              className="cursor-pointer"
              size={16}
              color="red"
              onClick={() => {
                const appointment = fields[row.index] as any;
                // If the appointment has an id, mark it for deletion
                if (appointment.id) {
                  setDeletedAppoints((prev) => [...prev, appointment.id]);
                }
                // Remove from form
                remove(row.index);
              }}
            />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    manualPagination: true,
    data: fields as CCVAppointPrivate[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleAddAppoint = () => {
    append({
      id: "", // New appointments don't have id
      type: "",
      dispatchCode: "",
      requestDate: undefined,
      decisionDate: undefined,
      effectiveDate: undefined,
      signer: "",
      files: [],
    });
  };

  return (
    <>
      <Collapsible defaultOpen className="mt-4 group/collapsible">
        <CollapsibleTrigger className="font-semibold flex items-center justify-between text-default-blue bg-[#F3F3F3] rounded p-2 w-full">
          Thông tin Bổ nhiệm/ Miễn nhiệm CCV
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
            actions={[
              <Button
                key="add"
                className="w-full"
                type="button"
                onClick={handleAddAppoint}
              >
                Thêm mới
              </Button>,
            ]}
          />
        </CollapsibleContent>
      </Collapsible>
      <FormMessage className="mb-4 mt-2" />
    </>
  );
};

export default AppointSection;
