"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

const RepresentativeSection = () => {
  const form = useFormContext();

  const type = useWatch({
    control: form.control,
    name: "type",
  });

  // const managerUuid = useWatch({
  //   control: form.control,
  //   name: "managerUuid",
  // });

  // const certQuery = useQuery({
  //   queryKey: [QUERY_KEY.DAU_GIA.DANH_SACH_CHUNG_CHI],
  //   queryFn: () => getListAuctioneerCert(),
  //   refetchOnWindowFocus: false,
  //   staleTime: 1000 * 60 * 5,
  // });

  // const detailQuery = useQuery({
  //   queryKey: [QUERY_KEY.DAU_GIA.CHI_TIET_CHUNG_CHI, managerUuid],
  //   queryFn: () => getAuctioneerById(managerUuid),
  //   refetchOnWindowFocus: false,
  //   enabled: !!managerUuid,
  // });

  const manager = form.getValues("manager");

  return (
    <Collapsible defaultOpen className="mb-4 group/collapsible">
      <CollapsibleTrigger className="font-semibold flex items-center justify-between text-default-blue bg-[#F3F3F3] rounded p-2 w-full">
        {type === "AUCTION_SERVICE_CENTER"
          ? "Người đại diện pháp luật"
          : "Thông tin chủ doanh nghiệp"}
        <ChevronDown
          size={16}
          className="group-data-[state=open]/collapsible:rotate-180 transition-transform"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white">
        {/* Số Chứng chỉ hành nghề */}
        <div className="space-y-2">
          <Label>Số Chứng chỉ hành nghề</Label>
          <div className="text-sm text-gray-700">
            {manager?.certCode || "-"}
          </div>
        </div>
        {/* Ngày cấp CCHN */}
        <div className="space-y-2">
          <Label>Ngày cấp CCHN</Label>
          <div className="text-sm text-gray-700">
            {manager?.dateOfDecisionCert
              ? format(new Date(manager.dateOfDecisionCert), "dd/MM/yyyy")
              : "-"}
          </div>
        </div>
        {/* Họ tên */}
        <div className="space-y-2">
          <Label>Họ tên</Label>
          <div className="text-sm text-gray-700">
            {manager?.fullName || "-"}
          </div>
        </div>
        {/* Giới tính */}
        <div className="space-y-2">
          <Label>Giới tính</Label>
          <div className="text-sm text-gray-700">
            {manager?.gender === 0 ? "Nam" : manager?.gender === 1 ? "Nữ" : "-"}
          </div>
        </div>
        {/* Ngày sinh */}
        <div className="space-y-2">
          <Label>Ngày sinh</Label>
          <div className="text-sm text-gray-700">{manager?.dob || "-"}</div>
        </div>
        {/* Số CMND/CCCD/Hộ chiếu */}
        <div className="space-y-2">
          <Label>Số CMND/CCCD/Hộ chiếu</Label>
          <div className="text-sm text-gray-700">{manager?.idCode || "-"}</div>
        </div>
        {/* Ngày cấp */}
        <div className="space-y-2">
          <Label>Ngày cấp</Label>
          <div className="text-sm text-gray-700">
            {manager?.idDOI ? format(manager.idDOI, "dd/MM/yyyy") : "-"}
          </div>
        </div>
        {/* Nơi cấp */}
        <div className="space-y-2">
          <Label>Nơi cấp</Label>
          <div className="text-sm text-gray-700">{manager?.idPOI || "-"}</div>
        </div>
        {/* Địa chỉ thường trú */}
        <div className="space-y-2">
          <Label>Địa chỉ thường trú</Label>
          <div className="text-sm text-gray-700">
            {[manager?.addPermanent, manager?.textWard, manager?.textProvince]
              .filter((item) => item)
              .join(", ") || "-"}
          </div>
        </div>
        {/* Số thẻ ĐGV */}
        <div className="space-y-2">
          <Label>Số thẻ ĐGV</Label>
          <div className="text-sm text-gray-700">
            {manager?.cardCode || "-"}
          </div>
        </div>
        {/* Ngày cấp thẻ ĐGV */}
        <div className="space-y-2">
          <Label>Ngày cấp thẻ ĐGV</Label>
          <div className="text-sm text-gray-700">
            {manager?.dateOfDecisionCard
              ? format(new Date(manager.dateOfDecisionCard), "dd/MM/yyyy")
              : "-"}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default RepresentativeSection;
