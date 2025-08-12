"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AUCTION_ORG_TYPE, ORG_STATUS } from "@/constants/dauGia";
import { ChevronDown } from "lucide-react";
import { useFormContext } from "react-hook-form";

const InfoSection = ({ id }: { id?: string }) => {
  const form = useFormContext();

  // const type = useWatch({
  //   control: form.control,
  //   name: "type",
  // });

  // const hiddenField = type === "VAMC";

  // const province = useWatch({
  //   control: form.control,
  //   name: "provinceCode",
  // });

  // const provinceQuery = useQuery({
  //   queryKey: [QUERY_KEY.COMMON.PROVINCE],
  //   queryFn: () => getListProvinceNew(),
  //   refetchOnWindowFocus: false,
  //   staleTime: 1000 * 60 * 5,
  // });

  // const wardQuery = useQuery({
  //   queryKey: [QUERY_KEY.COMMON.WARD, province],
  //   queryFn: () => getListWardNew(province || ""),
  //   refetchOnWindowFocus: false,
  //   staleTime: 1000 * 60 * 5,
  //   enabled: !!province,
  // });

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
        {/* Số quyết định thành lập */}
        <div className="min-w-0">
          <div className="font-semibold text-sm text-gray-600">
            Số quyết định thành lập
          </div>
          <div
            className="text-sm text-gray-800 break-words line-clamp-3"
            title={form.getValues("licenseNo")}
          >
            {form.getValues("licenseNo") || "-"}
          </div>
        </div>
        {/* Ngày quyết định */}
        <div className="min-w-0">
          <div className="font-semibold text-sm text-gray-600">
            Ngày quyết định
          </div>
          <div
            className="text-sm text-gray-800 break-words line-clamp-3"
            title={
              form.getValues("licenseDate")
                ? new Date(form.getValues("licenseDate")).toLocaleDateString()
                : "-"
            }
          >
            {form.getValues("licenseDate")
              ? new Date(form.getValues("licenseDate")).toLocaleDateString()
              : "-"}
          </div>
        </div>
        {/* Loại tổ chức */}
        <div className="min-w-0">
          <div className="font-semibold text-sm text-gray-600">
            Loại tổ chức
          </div>
          <div className="text-sm text-gray-800 break-words line-clamp-3">
            {AUCTION_ORG_TYPE.find(
              (item) => item.value.toString() === form.getValues("type")
            )?.label || "-"}
          </div>
        </div>
        {/* Tên doanh nghiệp */}
        <div className="min-w-0">
          <div className="font-semibold text-sm text-gray-600">
            Tên doanh nghiệp
          </div>
          <div
            className="text-sm text-gray-800 break-words line-clamp-3"
            title={form.getValues("fullName")}
          >
            {form.getValues("fullName") || "-"}
          </div>
        </div>
        {/* Địa chỉ */}
        <div className="min-w-0 col-span-2">
          <div className="font-semibold text-sm text-gray-600">Địa chỉ</div>
          <div
            className="text-sm text-gray-800 break-words line-clamp-3"
            title={form.getValues("address")}
          >
            {form.getValues("address") || "-"}
          </div>
        </div>
        {/* Số điện thoại */}
        <div className="min-w-0">
          <div className="font-semibold text-sm text-gray-600">
            Số điện thoại
          </div>
          <div
            className="text-sm text-gray-800 break-words line-clamp-3"
            title={form.getValues("telNumber")}
          >
            {form.getValues("telNumber") || "-"}
          </div>
        </div>
        {/* Email */}
        <div className="min-w-0">
          <div className="font-semibold text-sm text-gray-600">Email</div>
          <div
            className="text-sm text-gray-800 break-words line-clamp-3"
            title={form.getValues("email")}
          >
            {form.getValues("email") || "-"}
          </div>
        </div>
        {/* Trạng thái */}
        <div className="min-w-0">
          <div className="font-semibold text-sm text-gray-600">Trạng thái</div>
          <div
            className="text-sm text-gray-800 break-words line-clamp-3"
            title={form.getValues("status")}
          >
            {ORG_STATUS[form.getValues("status")]?.label || "-"}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default InfoSection;
