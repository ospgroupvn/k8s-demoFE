import AutoCompleteSearch from "@/components/common/autoCompleteSearch";
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
import { QUERY_KEY } from "@/constants/common";
import { STATUS_OPTIONS } from "@/constants/congChung";
import {
  getListPlaceOfIssue,
  getListProvinceNew,
  getListWardNew,
} from "@/service/common";
import { getListNotaryAdministration } from "@/service/notaryOrg";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

const InfoSection = () => {
  const form = useFormContext();

  const residentProvince = useWatch({
    control: form.control,
    name: "residentProvince",
  });

  const nowProvince = useWatch({
    control: form.control,
    name: "nowProvince",
  });

  const residentProvinceQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE],
    queryFn: () => getListProvinceNew(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const residentWardQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.WARD, residentProvince],
    queryFn: () => getListWardNew(residentProvince || ""),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!residentProvince,
  });

  const nowWardQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.WARD, nowProvince],
    queryFn: () => getListWardNew(nowProvince || ""),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!nowProvince,
  });

  const poiQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.PLACE_OF_ISSUE],
    queryFn: () => getListPlaceOfIssue(),
    refetchOnWindowFocus: false,
  });

  const administrationQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.DEPARTMENT, "notary"],
    queryFn: () => getListNotaryAdministration(2),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
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
            <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
              <FormLabel required>Họ và tên</FormLabel>
              <FormControl>
                <Input placeholder="Nhập họ và tên" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthDay"
          render={({ field }) => (
            <FormItem className="flex flex-col items-left mb-4">
              <FormLabel required>Ngày sinh</FormLabel>
              <FormControl>
                <DatePickerInput
                  placeholder="Ngày sinh"
                  value={field.value}
                  onSelect={field.onChange}
                  disabledDate={(date) => date > new Date()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem className="flex flex-col items-left mb-4">
              <FormLabel required>Giới tính</FormLabel>
              <Select
                defaultValue={field.value}
                onValueChange={field.onChange}
                key={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                </FormControl>
                <FormMessage />
                <SelectContent>
                  <SelectItem value="1">Nam</SelectItem>
                  <SelectItem value="2">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="flex flex-col items-left mb-4">
              <FormLabel required>Số điện thoại</FormLabel>
              <FormControl>
                <Input placeholder="Nhập số điện thoại" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col items-left mb-4">
              <FormLabel required>Email</FormLabel>
              <FormControl>
                <Input placeholder="Nhập địa chỉ email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="idNo"
          render={({ field }) => (
            <FormItem className="flex flex-col items-left mb-4">
              <FormLabel required>Số CMND/CCCD/Hộ chiếu</FormLabel>
              <FormControl>
                <Input placeholder="Nhập Số CMND/CCCD/Hộ chiếu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="idNoDate"
          render={({ field }) => (
            <FormItem className="flex flex-col items-left mb-4">
              <FormLabel required>Ngày cấp</FormLabel>
              <FormControl>
                <DatePickerInput
                  placeholder="Ngày cấp"
                  value={field.value}
                  onSelect={field.onChange}
                  disabledDate={(date) => date > new Date()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressIdNo"
          render={({ field }) => (
            <FormItem className="flex flex-col items-left mb-4">
              <FormLabel required>Nơi cấp</FormLabel>
              <AutoCompleteSearch
                displayKey="name"
                selectPlaceholder="Chọn nơi cấp"
                emptyMsg="Không tìm thấy dữ liệu"
                onSelect={(value) => field.onChange(value?.code || "")}
                optionKey="code"
                options={poiQuery.data || []}
                placeholder="Tìm kiếm nơi cấp"
                value={field.value?.toString() || ""}
                valueKey="code"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressResident"
          render={({ field }) => (
            <FormItem className="flex flex-col items-left mb-4 col-span-2 lg:col-span-2">
              <FormLabel required>Địa chỉ thường trú</FormLabel>
              <FormControl>
                <Input placeholder="Nhập địa chỉ thường trú" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="residentProvince"
          render={({ field }) => (
            <FormItem className="flex flex-col items-left mb-4">
              <FormLabel required>Tỉnh/Thành phố thường trú</FormLabel>
              <AutoCompleteSearch
                displayKey="name"
                selectPlaceholder="Chọn tỉnh/thành phố"
                emptyMsg="Không tìm thấy dữ liệu"
                onSelect={(value) => {
                  form.setValue("addressResidentId", "");
                  field.onChange(value?.provinceCode || "");
                }}
                optionKey="provinceCode"
                options={residentProvinceQuery.data || []}
                placeholder="Tìm kiếm tỉnh/thành phố"
                value={field.value || ""}
                valueKey="provinceCode"
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressResidentId"
          render={({ field }) => (
            <FormItem className="flex flex-col items-left mb-4">
              <FormLabel required>Phường/Xã thường trú</FormLabel>
              <AutoCompleteSearch
                displayKey="name"
                selectPlaceholder="Chọn phường/xã"
                emptyMsg="Không tìm thấy dữ liệu"
                onSelect={(value) => {
                  field.onChange(value?.id?.toString() || "");
                }}
                optionKey="id"
                options={residentWardQuery.data || []}
                placeholder="Tìm kiếm phường/xã"
                value={field.value || ""}
                valueKey="id"
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressNow"
          render={({ field }) => (
            <FormItem className="flex flex-col items-left mb-4 col-span-2 lg:col-span-2">
              <FormLabel>Địa chỉ hiện tại</FormLabel>
              <FormControl>
                <Input placeholder="Nhập địa chỉ hiện tại" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nowProvince"
          render={({ field }) => (
            <FormItem className="flex flex-col items-left mb-4">
              <FormLabel>Tỉnh/Thành phố hiện tại</FormLabel>
              <AutoCompleteSearch
                displayKey="name"
                selectPlaceholder="Chọn tỉnh/thành phố"
                emptyMsg="Không tìm thấy dữ liệu"
                onSelect={(value) => {
                  form.setValue("addressNowId", "");
                  field.onChange(value?.provinceCode || "");
                }}
                optionKey="provinceCode"
                options={residentProvinceQuery.data || []}
                placeholder="Tìm kiếm tỉnh/thành phố"
                value={field.value || ""}
                valueKey="provinceCode"
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressNowId"
          render={({ field }) => (
            <FormItem className="flex flex-col items-left mb-4">
              <FormLabel>Phường/Xã hiện tại</FormLabel>
              <AutoCompleteSearch
                displayKey="name"
                selectPlaceholder="Chọn phường/xã"
                emptyMsg="Không tìm thấy dữ liệu"
                onSelect={(value) => {
                  field.onChange(value?.id?.toString() || "");
                }}
                optionKey="id"
                options={nowWardQuery.data || []}
                placeholder="Tìm kiếm phường/xã"
                value={field.value || ""}
                valueKey="id"
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-col items-left mb-4 col-span-2">
              <FormLabel required>Trạng thái</FormLabel>
              <AutoCompleteSearch
                displayKey="label"
                selectPlaceholder="Chọn trạng thái"
                emptyMsg="Không tìm thấy dữ liệu"
                onSelect={(value) => field.onChange(value.value || "")}
                optionKey="value"
                options={STATUS_OPTIONS}
                placeholder="Tìm kiếm trạng thái"
                value={field.value || ""}
                valueKey="value"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name={`administrationId`}
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col items-left mb-4 col-span-2">
              <FormLabel required>Sở Tư pháp</FormLabel>
              <AutoCompleteSearch
                displayKey="fullName"
                selectPlaceholder="Chọn Sở Tư pháp"
                emptyMsg="Không tìm thấy dữ liệu"
                onSelect={(value) =>
                  field.onChange(value?.id?.toString() || "")
                }
                optionKey="id"
                options={administrationQuery.data?.data || []}
                placeholder="Tìm kiếm Sở Tư pháp"
                value={field.value?.toString() || ""}
                valueKey="id"
              />
            </FormItem>
          )}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default InfoSection;
