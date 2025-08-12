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
import { CCVSuspendWorkPrivate } from "@/types/congChung";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import FileUploadSection from "../../dau_gia/fileUploadSection";

const SuspendSection = ({
  setDeletedSuspendFiles,
}: {
  setDeletedSuspendFiles: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const form = useFormContext();

  const { fields } = useFieldArray({
    control: form.control,
    name: "suspend",
  });

  const columns: ColumnDef<Partial<CCVSuspendWorkPrivate>>[] = [
    {
      accessorKey: "dispatchCode",
      header: "Số quyết định tạm đình chỉ/ hủy bỏ QĐ tạm đình chỉ",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`suspend.0.dispatchCode`}
          render={({ field }) => (
            <FormItem>
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
          name={`suspend.0.decisionDate`}
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
          name={`suspend.0.effectiveDate`}
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
      accessorKey: "dateNumber",
      header: "Thời gian tạm đình chỉ",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`suspend.0.dateNumber`}
          render={({ field }) => (
            <FormItem className="min-w-50">
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="Nhập số tháng"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
          name={`suspend.0.signer`}
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
      accessorKey: "reason",
      header: "Lý do",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`suspend.0.reason`}
          render={({ field }) => (
            <FormItem className="min-w-75">
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
          name={`suspend.0.files`}
          render={({ field }) => (
            <FileUploadSection
              files={field.value || []}
              onFilesChange={field.onChange}
              onFileDelete={(file) => {
                if (row.original.linkFile) {
                  setDeletedSuspendFiles([row.original.linkFile]);
                }
              }}
              uploadId={`file-upload-suspend-${row.index}`}
            />
          )}
        />
      ),
    },
  ];

  const table = useReactTable({
    manualPagination: true,
    data: fields as Partial<CCVSuspendWorkPrivate>[],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Collapsible defaultOpen className="my-4 group/collapsible">
      <CollapsibleTrigger className="font-semibold flex items-center justify-between text-default-blue bg-[#F3F3F3] rounded p-2 w-full">
        Thông tin tạm đình chỉ hành nghề
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
          showIndex={false}
          showTitleHeader={false}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SuspendSection;
