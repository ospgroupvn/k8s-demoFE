import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FormLabel } from "@/components/ui/form";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useFormContext } from "react-hook-form";

const InfoSection = () => {
  const form = useFormContext();

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

  // const poiQuery = useQuery({
  //   queryKey: [QUERY_KEY.COMMON.PLACE_OF_ISSUE],
  //   queryFn: () => getListPlaceOfIssue(),
  //   refetchOnWindowFocus: false,
  // });

  // const wardQuery = useQuery({
  //   queryKey: [QUERY_KEY.COMMON.WARD, province],
  //   queryFn: () => getListWardNew(province || ""),
  //   refetchOnWindowFocus: false,
  //   staleTime: 1000 * 60 * 5,
  //   enabled: !!province,
  // });

  // Get all values from form
  const values = form.getValues();

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
        {/* Họ và tên */}
        <div className="flex flex-col items-left mb-4 max-sm:col-span-3">
          <FormLabel>Họ và tên</FormLabel>
          <div className="text-gray-700 text-sm min-h-[38px] flex items-center">
            {values.fullName || "-"}
          </div>
        </div>
        {/* Giới tính */}
        <div className="flex flex-col items-left mb-4">
          <FormLabel>Giới tính</FormLabel>
          <div className="text-gray-700 text-sm min-h-[38px] flex items-center">
            {values.gender === 0 ? "Nam" : values.gender === 1 ? "Nữ" : "-"}
          </div>
        </div>
        {/* Ngày sinh */}
        <div className="flex flex-col items-left mb-4">
          <FormLabel>Ngày sinh</FormLabel>
          <div className="text-gray-700 text-sm min-h-[38px] flex items-center">
            {values.dob || "-"}
          </div>
        </div>
        {/* Số điện thoại */}
        <div className="flex flex-col items-left mb-4">
          <FormLabel>Số điện thoại</FormLabel>
          <div className="text-gray-700 text-sm min-h-[38px] flex items-center">
            {values.telNumber || "-"}
          </div>
        </div>
        {/* Email */}
        <div className="flex flex-col items-left mb-4">
          <FormLabel>Email</FormLabel>
          <div className="text-gray-700 text-sm min-h-[38px] flex items-center">
            {values.email || "-"}
          </div>
        </div>
        {/* Số CMND/CCCD/Hộ chiếu */}
        <div className="flex flex-col items-left mb-4">
          <FormLabel>Số CMND/CCCD/Hộ chiếu</FormLabel>
          <div className="text-gray-700 text-sm min-h-[38px] flex items-center">
            {values.idCode || "-"}
          </div>
        </div>
        {/* Ngày cấp */}
        <div className="flex flex-col items-left mb-4">
          <FormLabel>Ngày cấp</FormLabel>
          <div className="text-gray-700 text-sm min-h-[38px] flex items-center">
            {values.idDoi ? format(values.idDoi, "dd/MM/yyyy") : "-"}
          </div>
        </div>
        {/* Nơi cấp */}
        <div className="flex flex-col items-left mb-4">
          <FormLabel>Nơi cấp</FormLabel>
          <div className="text-gray-700 text-sm min-h-[38px] flex items-center">
            {values.idPoi || "-"}
          </div>
        </div>
        {/* Địa chỉ thường trú */}
        <div className="flex flex-col items-left mb-4 col-span-2 lg:col-span-2">
          <FormLabel>Địa chỉ thường trú</FormLabel>
          <div className="text-gray-700 text-sm min-h-[38px] flex items-center">
            {values.addPermanent || "-"}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default InfoSection;
