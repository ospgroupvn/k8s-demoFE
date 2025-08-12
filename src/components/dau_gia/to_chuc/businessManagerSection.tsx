"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useFormContext } from "react-hook-form";

const BusinessManagerSection = () => {
  const form = useFormContext();
  // const [searchTerm, setSearchTerm] = useState("");

  // const managerUuid = useWatch({
  //   control: form.control,
  //   name: "managerUuid",
  // });

  // const orgRoot = useWatch({
  //   control: form.control,
  //   name: "orgRoot",
  // });

  // const managerDetailQuery = useQuery({
  //   queryKey: [QUERY_KEY.DAU_GIA.DAU_GIA_VIEN, "detail", managerUuid],
  //   queryFn: () => getAuctioneerById(managerUuid),
  //   refetchOnWindowFocus: false,
  //   enabled: !!managerUuid,
  //   staleTime: 1000 * 60 * 5,
  // });

  // const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
  //   useInfiniteQuery({
  //     queryKey: [
  //       QUERY_KEY.DAU_GIA.DAU_GIA_VIEN,
  //       {
  //         fullname: searchTerm || undefined,
  //         "org-id": orgRoot ? parseInt(orgRoot) : undefined,
  //         page: 1,
  //         size: 10,
  //       },
  //     ],
  //     queryFn: ({ pageParam = 1 }) =>
  //       searchAuctioneerPrivate({
  //         fullname: searchTerm || undefined,
  //         "org-id": orgRoot || "",
  //         page: pageParam,
  //         size: 10,
  //       }),
  //     initialPageParam: 1,
  //     getNextPageParam: (lastPage, allPages) => {
  //       const totalPages = lastPage?.totalPage || 0;
  //       const currentPage = allPages.length;
  //       return currentPage < totalPages ? currentPage + 1 : undefined;
  //     },
  //     enabled: !!orgRoot,
  //   });

  // const allAuctioneers = useMemo(
  //   () => data?.pages?.flatMap((page) => page?.data || []) || [],
  //   [data?.pages]
  // );

  // const handleLazySearch = useCallback((value: string) => {
  //   setSearchTerm(value);
  // }, []);

  const manager = form.getValues("manager");

  return (
    <Collapsible defaultOpen className="mb-4 group/collapsible">
      <CollapsibleTrigger className="font-semibold flex items-center justify-between text-default-blue bg-[#F3F3F3] rounded p-2 w-full">
        Thông tin trưởng chi nhánh
        <ChevronDown
          size={16}
          className="group-data-[state=open]/collapsible:rotate-180 transition-transform"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white overflow-hidden">
        {/* Họ và tên */}
        <div className="space-y-2 min-w-0">
          <Label>Họ và tên</Label>
          <div className="text-sm text-gray-700">
            {manager?.fullName || "-"}
          </div>
        </div>
        {/* Giới tính */}
        <div className="space-y-2 min-w-0">
          <Label>Giới tính</Label>
          <div className="text-sm text-gray-700">
            {manager?.gender === 0 ? "Nam" : manager?.gender === 1 ? "Nữ" : "-"}
          </div>
        </div>
        {/* Ngày sinh */}
        <div className="space-y-2 min-w-0">
          <Label>Ngày sinh</Label>
          <div className="text-sm text-gray-700">{manager?.dob || "-"}</div>
        </div>
        {/* Số CMND/CCCD/Hộ chiếu */}
        <div className="space-y-2 min-w-0">
          <Label>Số CMND/CCCD/Hộ chiếu</Label>
          <div className="text-sm text-gray-700">{manager?.idCode || "-"}</div>
        </div>
        {/* Ngày cấp */}
        <div className="space-y-2 min-w-0">
          <Label>Ngày cấp</Label>
          <div className="text-sm text-gray-700">
            {manager?.idDOI ? format(manager.idDOI, "dd/MM/yyyy") : "-"}
          </div>
        </div>
        {/* Nơi cấp */}
        <div className="space-y-2 min-w-0">
          <Label>Nơi cấp</Label>
          <div className="text-sm text-gray-700">{manager?.idPOI || "-"}</div>
        </div>
        {/* Địa chỉ thường trú */}
        <div className="space-y-2 min-w-0">
          <Label>Địa chỉ thường trú</Label>
          <div className="text-sm text-gray-700">
            {[manager?.addPermanent, manager?.textWard, manager?.textProvince]
              .filter((item) => item)
              .join(", ") || "-"}
          </div>
        </div>
        {/* Số CCHN */}
        <div className="space-y-2 min-w-0">
          <Label>Số CCHN</Label>
          <div className="text-sm text-gray-700">
            {manager?.certCode || "-"}
          </div>
        </div>
        {/* Ngày cấp CCHN */}
        <div className="space-y-2 min-w-0">
          <Label>Ngày cấp CCHN</Label>
          <div className="text-sm text-gray-700">
            {manager?.dateOfDecisionCert
              ? format(new Date(manager.dateOfDecisionCert), "dd/MM/yyyy")
              : "-"}
          </div>
        </div>
        {/* Số thẻ đấu giá viên */}
        <div className="space-y-2 min-w-0">
          <Label>Số thẻ đấu giá viên</Label>
          <div className="text-sm text-gray-700">
            {manager?.cardCode || "-"}
          </div>
        </div>
        {/* Ngày cấp thẻ DGV */}
        <div className="space-y-2 min-w-0">
          <Label>Ngày cấp thẻ DGV</Label>
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

export default BusinessManagerSection;
