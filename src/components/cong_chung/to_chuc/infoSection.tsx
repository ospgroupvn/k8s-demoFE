"use client";

import AutoCompleteSearch from "@/components/common/autoCompleteSearch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QUERY_KEY } from "@/constants/common";
import { NOTARY_ORG_STATUS } from "@/constants/congChung";
import {
  getListDepartment,
  getListProvinceNew,
  getListWardNew,
} from "@/service/common";
import { getListNotaryAdministration } from "@/service/notaryOrg";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

const InfoSection = () => {
  const form = useFormContext();

  const province = useWatch({
    control: form.control,
    name: "provinceId",
  });

  const provinceQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE],
    queryFn: () => getListProvinceNew(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const wardQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.WARD, province],
    queryFn: () => getListWardNew(province || ""),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!province,
  });

  const departmentQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.DEPARTMENT, "notary"],
    queryFn: () => getListNotaryAdministration(2),
    refetchOnWindowFocus: false,
  });

  return (
    <Collapsible defaultOpen className="mb-4 group/collapsible">
      <CollapsibleTrigger className="font-semibold flex items-center justify-between text-default-blue bg-[#F3F3F3] rounded p-2 w-full">
        Thông tin chung
        <ChevronDown
          size={16}
          className="group-data-[state=open]/collapsible:rotate-180 transition-transform"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel required>Tên Tổ chức HNCC</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên tổ chức" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="administrationId"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel required>Sở Tư pháp</FormLabel>
              <FormControl>
                <AutoCompleteSearch
                  displayKey="fullName"
                  selectPlaceholder="Chọn Sở Tư pháp"
                  emptyMsg="Không tìm thấy dữ liệu"
                  onSelect={(value) => {
                    field.onChange(value?.id?.toString() || "");
                  }}
                  optionKey="id"
                  options={departmentQuery?.data ?.data|| []}
                  placeholder="Tìm kiếm theo tên Sở Tư pháp"
                  value={field.value || ""}
                  valueKey="id"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel required>Địa chỉ trụ sở</FormLabel>
              <FormControl>
                <Input placeholder="Nhập địa chỉ trụ sở" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="provinceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Tỉnh/ Thành phố</FormLabel>
              <FormControl>
                <AutoCompleteSearch
                  displayKey="name"
                  selectPlaceholder="Chọn Tỉnh/Thành phố"
                  emptyMsg="Không tìm thấy dữ liệu"
                  onSelect={(value) => {
                    form.setValue("addressId", "");
                    field.onChange(value?.provinceCode || "");
                  }}
                  optionKey="provinceCode"
                  options={provinceQuery?.data || []}
                  placeholder="Tìm kiếm theo tên Tỉnh/Thành phố"
                  value={field.value || ""}
                  valueKey="provinceCode"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressId"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Phường/Xã</FormLabel>
              <FormControl>
                <AutoCompleteSearch
                  displayKey="name"
                  selectPlaceholder="Chọn Phường/Xã"
                  emptyMsg="Không tìm thấy dữ liệu"
                  onSelect={(value) => {
                    field.onChange(value?.id?.toString() || "");
                  }}
                  optionKey="id"
                  options={wardQuery?.data || []}
                  placeholder="Tìm kiếm theo tên Phường/Xã"
                  value={field.value || ""}
                  valueKey="id"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tel"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Số điện thoại</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Nhập số điện thoại" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Nhập email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel required>Trạng thái hoạt động</FormLabel>
              <FormControl>
                <AutoCompleteSearch
                  displayKey="label"
                  selectPlaceholder="Chọn trạng thái hoạt động"
                  emptyMsg="Không tìm thấy dữ liệu"
                  onSelect={(value) => {
                    field.onChange(value?.value?.toString() || "");
                  }}
                  optionKey="value"
                  options={NOTARY_ORG_STATUS}
                  placeholder="Tìm kiếm trạng thái"
                  value={field.value?.toString() || ""}
                  valueKey="value"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default InfoSection;
