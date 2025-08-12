"use client";

import CommonTable from "@/components/common/commonTable";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DatePickerInput } from "@/components/ui/datepickerinput";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QUERY_KEY } from "@/constants/common";
import { getNotaryOrgCategory } from "@/service/notaryOrg";
import { CCVProbationaryPrivate } from "@/types/congChung";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { useMemo } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import AutoCompleteSearch from "../../common/autoCompleteSearch";
import FileUploadSection from "../../dau_gia/fileUploadSection";

const InternSection = ({
  setDeletedInternFiles,
}: {
  setDeletedInternFiles: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const form = useFormContext();
  const { fields } = useFieldArray({
    control: form.control,
    name: "intern",
  });

  const admin = useWatch({
    control: form.control,
    name: "administrationId",
  });

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY.CONG_CHUNG.TO_CHUC, `category-${admin}`],
    queryFn: () =>
      getNotaryOrgCategory({
        pageNo: 0,
        pageSize: 1000, // Large page size to get all results
        adminId: admin || "",
      }),
    enabled: !!admin,
  });

  const notaryOrgs = useMemo(() => {
    return data?.data || [];
  }, [data?.data]);

  const columns: ColumnDef<
    Partial<CCVProbationaryPrivate & { files?: File[] }>
  >[] = [
    {
      accessorKey: "dispatchCode",
      header: () => (
        <span>Giấy chứng nhận tốt nghiệp khóa đào tạo nghề công chứng</span>
      ),
      cell: () => (
        <FormField
          control={form.control}
          name={`intern.0.dispatchCode`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Nhập giấy chứng nhận" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      ),
    },
    {
      accessorKey: "dateSign",
      header: () => <span>Ngày cấp</span>,
      cell: () => (
        <FormField
          control={form.control}
          name={`intern.0.dateSign`}
          render={({ field }) => (
            <FormItem className="min-w-50">
              <DatePickerInput
                placeholder="Ngày cấp"
                value={field.value}
                onSelect={field.onChange}
                disabledDate={(date) => date > new Date()}
              />
            </FormItem>
          )}
        />
      ),
    },
    {
      accessorKey: "org",
      header: () => <span>Tổ chức HNCC nhận tập sự</span>,
      cell: () => (
        <FormField
          control={form.control}
          name={`intern.0.idOrg`}
          render={({ field }) => (
            <FormItem className="min-w-75">
              <AutoCompleteSearch
                key="orgNotaryInfoId-autocomplete"
                displayKey="name"
                emptyMsg="Không tìm thấy tổ chức"
                optionKey="id"
                valueKey="id"
                placeholder="Tìm kiếm tổ chức HNCC"
                value={field.value || ""}
                options={notaryOrgs}
                onSelect={(selectedOrg) => {
                  field.onChange(selectedOrg.id?.toString() || "");
                }}
                isLoading={isLoading}
                selectPlaceholder="Chọn tổ chức HNCC"
                defaultSelect={true}
                triggerClassName="min-w-50"
                showSearch={true}
              />
            </FormItem>
          )}
        />
      ),
    },
    {
      accessorKey: "address",
      header: "Địa chỉ trụ sở",
      cell: () => (
        <FormField
          control={form.control}
          name={`intern.0.address`}
          render={({ field }) => (
            <FormItem className="min-w-75">
              <FormControl>
                <Input placeholder="Nhập địa chỉ" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      ),
    },
    {
      accessorKey: "dateStart",
      header: () => <span>Ngày bắt đầu tập sự</span>,
      cell: () => (
        <FormField
          control={form.control}
          name={`intern.0.dateStart`}
          render={({ field }) => (
            <FormItem className="min-w-50">
              <DatePickerInput
                placeholder="Ngày bắt đầu"
                value={field.value}
                onSelect={field.onChange}
                disabledDate={(date) => date > new Date()}
              />
            </FormItem>
          )}
        />
      ),
    },
    {
      accessorKey: "dateNumber",
      header: "Thời gian đã tập sự (tháng)",
      cell: () => (
        <FormField
          control={form.control}
          name={`intern.0.dateNumber`}
          render={({ field }) => (
            <FormItem>
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
      accessorKey: "files",
      header: "File đính kèm",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`intern.0.files`}
          render={({ field }) => (
            <FileUploadSection
              files={field.value || []}
              onFilesChange={field.onChange}
              onFileDelete={(file) => {
                if (row.original.linkFile) {
                  setDeletedInternFiles([row.original.linkFile]);
                }
              }}
              uploadId={`file-upload-intern-${row.index}`}
            />
          )}
        />
      ),
    },
  ];

  const table = useReactTable({
    manualPagination: true,
    data: fields as Partial<CCVProbationaryPrivate>[],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Collapsible defaultOpen className="my-4 group/collapsible">
      <CollapsibleTrigger className="font-semibold flex items-center justify-between text-default-blue bg-[#F3F3F3] rounded p-2 w-full">
        Thông tin đăng ký tập sự hành nghề công chứng
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

export default InternSection;
