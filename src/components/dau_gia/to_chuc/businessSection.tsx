"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { AuctionOrgRootOrganization } from "@/types/dauGia";
import { ChevronDown } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface Props {
  data?: AuctionOrgRootOrganization;
}

const BusinessSection = ({ data }: Props) => {
  const form = useFormContext();

  // Read-only: display fields from AuctionOrgRootOrganization (data prop)
  return (
    <Collapsible defaultOpen className="mb-4 group/collapsible">
      <CollapsibleTrigger className="font-semibold flex items-center justify-between text-default-blue bg-[#F3F3F3] rounded p-2 w-full">
        Thông tin doanh nghiệp đấu giá tài sản
        <ChevronDown
          size={16}
          className="group-data-[state=open]/collapsible:rotate-180 transition-transform"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white overflow-hidden">
        <div className="space-y-2 min-w-0">
          <Label>Sở Tư pháp</Label>
          <div className="text-sm text-gray-700">{"-"}</div>
        </div>
        <div className="space-y-2 min-w-0">
          <Label>Doanh nghiệp</Label>
          <div className="text-sm text-gray-700">{data?.fullname || "-"}</div>
        </div>
        <div className="space-y-2 min-w-0">
          <Label>Địa chỉ trụ sở</Label>
          <div className="text-sm text-gray-700">{data?.address || "-"}</div>
        </div>
        <div className="space-y-2 min-w-0">
          <Label>Điện thoại</Label>
          <div className="text-sm text-gray-700">{"-"}</div>
        </div>
        <div className="space-y-2 min-w-0">
          <Label>Email</Label>
          <div className="text-sm text-gray-700">{"-"}</div>
        </div>
        <div className="space-y-2 min-w-0">
          <Label>Số giấy GĐKHĐ</Label>
          <div className="text-sm text-gray-700">{data?.licenseNo || "-"}</div>
        </div>
        <div className="space-y-2 min-w-0">
          <Label>Ngày cấp</Label>
          <div className="text-sm text-gray-700">
            {data?.licenseDate
              ? new Date(data.licenseDate).toLocaleDateString("vi-VN")
              : "-"}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default BusinessSection;
