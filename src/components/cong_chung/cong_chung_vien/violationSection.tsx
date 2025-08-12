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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  NOTARY_VIOLATION_LEVEL,
  NOTARY_VIOLATION_TYPE,
  NOTARY_VIOLATION_TYPE_LEVEL_MAP,
} from "@/constants/congChung";
import { CCVPenalizePrivate } from "@/types/congChung";
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

interface ViolationSectionProps {
  setDeletedViolations: React.Dispatch<React.SetStateAction<string[]>>;
  setDeletedViolationFiles: React.Dispatch<
    React.SetStateAction<Record<string, string[]>[]>
  >;
}

const ViolationHandlingSection = ({
  setDeletedViolations,
  setDeletedViolationFiles,
}: ViolationSectionProps) => {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "violation",
  });

  const columns: ColumnDef<Partial<CCVPenalizePrivate>>[] = [
    {
      accessorKey: "dispatchCode",
      header: "Số quyết định xử lý vi phạm",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`violation.${row.index}.dispatchCode`}
          render={({ field }) => (
            <FormItem className="min-w-50">
              <FormControl>
                <Input placeholder="Nhập số quyết định" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      ),
    },
    {
      accessorKey: "decisionDate",
      header: "Ngày quyết định",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`violation.${row.index}.decisionDate`}
          render={({ field }) => (
            <FormItem className="min-w-50">
              <FormControl>
                <DatePickerInput
                  placeholder="Ngày quyết định"
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
      header: "Ngày có hiệu lực",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`violation.${row.index}.effectiveDate`}
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
          name={`violation.${row.index}.signer`}
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
      accessorKey: "typePenalize",
      header: "Loại xử lý vi phạm",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`violation.${row.index}.typePenalize`}
          render={({ field }) => (
            <FormItem className="min-w-50">
              <Select
                value={field.value || ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset leverPenalize when type changes
                  form.setValue(`violation.${row.index}.leverPenalize`, "");
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại xử lý" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {NOTARY_VIOLATION_TYPE.map((option) => (
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
      accessorKey: "orgNotaryId",
      header: "Đơn vị xử lý",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`violation.${row.index}.orgNotaryId`}
          render={({ field }) => (
            <FormItem className="min-w-50">
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị xử lý" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Sở Tư pháp</SelectItem>
                  <SelectItem value="2">Thanh tra Bộ</SelectItem>
                  <SelectItem value="3">
                    Thanh tra Cục bổ trợ Tư pháp
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      ),
    },
    {
      accessorKey: "leverPenalize",
      header: "Hình thức xử phạt chính",
      cell: ({ row }) => {
        const typePenalize = form.watch(`violation.${row.index}.typePenalize`);
        const availableLevels = typePenalize
          ? NOTARY_VIOLATION_TYPE_LEVEL_MAP[typePenalize] || []
          : [];

        return (
          <FormField
            control={form.control}
            name={`violation.${row.index}.leverPenalize`}
            render={({ field }) => (
              <FormItem className="min-w-50">
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue(
                      `violation.${row.index}.additionalPenalty`,
                      ""
                    );
                  }}
                  disabled={!typePenalize || !availableLevels.length}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hình thức xử phạt" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableLevels.map((levelValue) => {
                      const levelOption = NOTARY_VIOLATION_LEVEL.find(
                        (level) => level.value === levelValue
                      );
                      return (
                        <SelectItem key={levelValue} value={levelValue}>
                          {levelOption?.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        );
      },
    },
    {
      accessorKey: "additionalPenalty",
      header: "Hình thức xử phạt bổ sung",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`violation.${row.index}.additionalPenalty`}
          render={({ field }) => {
            const lever = form.watch(`violation.${row.index}.leverPenalize`);

            return (
              <FormItem className="min-w-50">
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  disabled={lever !== "2"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hình thức xử phạt" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">
                      Tước quyền sử dụng chứng chỉ hành nghề, Thẻ CCV
                    </SelectItem>
                    <SelectItem value="2">
                      Tịch thu tang vật, phương tiện được sử dụng để vi phạm
                      hành chính
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            );
          }}
        />
      ),
    },
    {
      accessorKey: "moneyPenalty",
      header: "Số tiền",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`violation.${row.index}.moneyPenalty`}
          render={({ field }) => {
            const typeViolation = form.watch(
              `violation.${row.index}.typePenalize`
            );

            return (
              <FormItem className="min-w-50">
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Nhập số tiền"
                    {...field}
                    disabled={typeViolation !== "2"}
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />
      ),
    },
    {
      accessorKey: "reason",
      header: "Lý do xử phạt",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`violation.${row.index}.reason`}
          render={({ field }) => (
            <FormItem className="min-w-50">
              <FormControl>
                <Input placeholder="Nhập lý do" {...field} />
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
          name={`violation.${row.index}.files`}
          render={({ field }) => (
            <FileUploadSection
              files={field.value || []}
              onFilesChange={field.onChange}
              onFileDelete={(file) => {
                if (row.original.linkFile) {
                  setDeletedViolationFiles((prev) => {
                    const existingFiles = (prev || [])?.find(
                      (item) => item[row.original.linkFile!]
                    );
                    const currentFiles =
                      existingFiles?.[row.original.linkFile!] || [];
                    return [
                      ...(prev || [])?.filter(
                        (item) => !item[row.original.linkFile!]
                      ),
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
              uploadId={`file-upload-violation-${row.index}`}
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
                const violation = fields[row.index] as any;
                // If the violation has an id, mark it for deletion
                if (violation.id) {
                  setDeletedViolations((prev) => [...prev, violation.id]);
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
    data: fields as Partial<CCVPenalizePrivate>[],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleAddViolation = () => {
    append({
      id: "", // New violations don't have id
      dispatchCode: "",
      decisionDate: "",
      effectiveDate: "",
      signer: "",
      typePenalize: "",
      orgNotaryId: "",
      leverPenalize: "",
      additionalPenalty: "",
      moneyPenalty: "0",
      reason: "",
      files: [],
    });
  };

  return (
    <Collapsible defaultOpen className="my-4 group/collapsible">
      <CollapsibleTrigger className="font-semibold flex items-center justify-between text-default-blue bg-[#F3F3F3] rounded p-2 w-full">
        Thông tin quyết định xử lý vi phạm đối với CCV
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
              onClick={handleAddViolation}
            >
              Thêm mới
            </Button>,
          ]}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ViolationHandlingSection;
