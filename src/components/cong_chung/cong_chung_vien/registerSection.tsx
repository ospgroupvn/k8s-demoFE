"use client";

import AutoCompleteSearch from "@/components/common/autoCompleteSearch";
import CommonTable from "@/components/common/commonTable";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DatePickerInput } from "@/components/ui/datepickerinput";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUERY_KEY } from "@/constants/common";
import { STATUS_OPTIONS } from "@/constants/congChung";
import {
  getNotaryOrgCategory,
  getNotaryOrgListPrivate,
} from "@/service/notaryOrg";
import { CCVRegAndAuctionCardPrivate, CongChungOrg } from "@/types/congChung";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

const RegisterSection = () => {
  const form = useFormContext();

  const status = useWatch({
    control: form.control,
    name: "register.0.status",
  });

  const admin = useWatch({
    control: form.control,
    name: "administrationId",
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "register",
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

  const statusOptions = useMemo(
    () =>
      STATUS_OPTIONS.filter((option) =>
        ["8", "12", "22", "23", "24"].includes(option.value)
      ),
    []
  );

  const columns: ColumnDef<Partial<CCVRegAndAuctionCardPrivate>>[] = [
    {
      accessorKey: "orgNotaryInfoId",
      header: "Tổ chức HNCC",
      cell: () => (
        <FormField
          control={form.control}
          name={`register.0.orgNotaryInfoId`}
          render={({ field }) => (
            <FormItem className="min-w-50">
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
                inputDebounce={300}
              />
            </FormItem>
          )}
        />
      ),
    },
    {
      accessorKey: "dispatchCode",
      header: "Số quyết định",
      cell: () => (
        <FormField
          control={form.control}
          name={`register.0.dispatchCode`}
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
      cell: () => (
        <FormField
          control={form.control}
          name={`register.0.decisionDate`}
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
      header: "Ngày hiệu lực",
      cell: () => (
        <FormField
          control={form.control}
          name={`register.0.effectiveDate`}
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
      accessorKey: "numberCad",
      header: "Số thẻ CCV",
      cell: () => (
        <FormField
          control={form.control}
          name={`register.0.numberCad`}
          render={({ field }) => (
            <FormItem className="min-w-50">
              <FormControl>
                <Input placeholder="Nhập số thẻ CCV" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: () => (
        <FormField
          control={form.control}
          name={`register.0.status`}
          render={({ field }) => (
            <FormItem className="min-w-50">
              <Select
                value={field.value || ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  form.resetField("register.0.reason");
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((option) => (
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
      accessorKey: "reason",
      header: "Lý do từ chối cấp thẻ",
      cell: () => {
        return (
          <FormField
            control={form.control}
            name={`register.0.reason`}
            render={({ field }) => (
              <FormItem className="min-w-50">
                <FormControl>
                  <Input
                    placeholder="Nhập lý do"
                    {...field}
                    disabled={status !== "24"}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    manualPagination: true,
    data: fields as Partial<CCVRegAndAuctionCardPrivate>[],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Collapsible defaultOpen className="my-4 group/collapsible">
      <CollapsibleTrigger className="font-semibold flex items-center justify-between text-default-blue bg-[#F3F3F3] rounded p-2 w-full">
        Thông tin Đăng ký HNCC và Thẻ công chứng viên
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

export default RegisterSection;
