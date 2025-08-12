"use client";

import { PAGE_NUMBER, QUERY_KEY } from "@/constants/common";
import {
  ACTIVITY_STATUS,
  LAWYER_STATUS,
  LICENSE_TYPE,
  OWNER_TYPE,
  PRACTICE_FORM,
  THE_LS_STATUS,
} from "@/constants/luat_su";
import { getLawyerCards } from "@/service/lawyer";
import {
  FullLawyerItem,
  LawyerCCHNLicense,
  LicenseSearchParams,
} from "@/types/luatSu";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronUp, Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import CommonPagination from "../common/commonPagination";
import CommonTable from "../common/commonTable";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";

interface Props {
  open: boolean;
  data?: FullLawyerItem | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

const LawyerDetailModal = ({ open, data, setOpen, isLoading }: Props) => {
  // const windowSize = useWindowSize();
  // const isMobile = windowSize.width > 0 && windowSize.width <= SCREENS_SIZE.md;
  const [searchParam, setSearchParam] = useState<LicenseSearchParams>({
    numberPerPage: 10,
    pageNumber: 1,
  });

  useEffect(() => {
    if (data?.lawyerId) {
      setSearchParam({
        ownerId: data.lawyerId,
        numberPerPage: 10,
        pageNumber: PAGE_NUMBER,
        ownerType: OWNER_TYPE.LAWYER,
        licenseType: LICENSE_TYPE.THE_LS,
      });
    }
  }, [data?.lawyerId]);

  const query = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.THE_LUAT_SU, searchParam],
    queryFn: getLawyerCards,
    enabled: !!searchParam.ownerId,
    refetchOnWindowFocus: false,
  });

  const columns: ColumnDef<LawyerCCHNLicense>[] = [
    {
      header: "Số thẻ",
      cell: ({ row }) => (
        <div className="text-center max-sm:max-w-[150px] max-sm:w-max">
          {row.original.licenseNumber || "-"}
        </div>
      ),
    },
    {
      header: "Ngày cấp",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] min-w-[100px]">
          {row.original.issueDate
            ? format(row.original.issueDate, "dd/MM/yyyy")
            : ""}
        </div>
      ),
    },
    {
      header: "Nơi hành nghề/làm việc",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
          {row.original.practicePlace || "-"}
        </div>
      ),
    },
    {
      header: "Hình thức hành nghề",
      cell: ({ row }) => (
        <div className="text-left">
          {PRACTICE_FORM.find(
            (item) => item.value.toString() === row.original.practiceForm
          )?.label || "-"}
        </div>
      ),
    },
    {
      header: "Tình trạng hành nghề",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
          {THE_LS_STATUS.find((item) => item.value === row.original.status)
            ?.label || "-"}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: query.data?.data?.items || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: (searchParam.numberPerPage || 10) + 1,
      },
    },
  });

  const detailItems = useMemo(() => {
    if (!data) {
      return [];
    }

    if (data?.isDomestic) {
      return [
        {
          label: "Đoàn luật sư",
          value: data?.lawyerAssociation?.assocName || "-",
          key: "assocName",
        },
        {
          label: "Nơi hành nghề/làm việc",
          value: data?.organization?.orgName || "-",
          key: "orgName",
        },
        {
          label: "Họ và tên Luật sư",
          value: data?.fullName || "-",
          key: "fullName",
        },
        {
          label: "Tình trạng hành nghề",
          value: data?.activityStatus
            ? ACTIVITY_STATUS.find((item) => item.value === data.activityStatus)
                ?.label
            : "-",
          key: "status",
        },
        {
          label: "Giới tính",
          value: data?.gender === 1 ? "Nam" : "Nữ",
          key: "gender",
        },
        {
          label: "Ngày sinh",
          value: data?.dateOfBirth
            ? format(data.dateOfBirth, "dd/MM/yyyy")
            : "-",
          key: "dateOfBirth",
        },
        {
          label: "Số điện thoại",
          value: data?.phone || "-",
          key: "phone",
        },
        {
          label: "Email",
          value: data?.email || "-",
          key: "email",
        },
      ];
    }

    return [
      {
        label: "Nơi hành nghề/làm việc",
        value: data?.organization?.orgName || "-",
        key: "orgName",
      },
      {
        label: "Họ và tên Luật sư",
        value: data?.fullName || "-",
        key: "fullName",
      },
      {
        label: "Giới tính",
        value: data?.gender === 1 ? "Nam" : "Nữ",
        key: "gender",
      },
      {
        label: "Ngày sinh",
        value: data?.dateOfBirth ? format(data.dateOfBirth, "dd/MM/yyyy") : "-",
        key: "dateOfBirth",
      },
      {
        label: "Quốc tịch",
        value: data?.nationalityName || "-",
        key: "nationalName",
      },
      {
        label: "Email",
        value: data?.email || "-",
        key: "email",
      },
      {
        label: "Hình thức hành nghề",
        value: data?.lsCardLicenses?.length
          ? PRACTICE_FORM.find(
              (item) =>
                item.value.toString() ===
                data?.lsCardLicenses?.[0]?.practiceForm
            )?.label
          : "-",
        key: "practiceForm",
      },
      {
        label: "Tình trạng hành nghề",
        value: data?.status
          ? LAWYER_STATUS.find((item) => item.value === data.status)?.label
          : "-",
        key: "status",
      },
    ];
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogContent className="min-w-[1200px] max-h-[90vh] max-sm:p-2 z-50 flex flex-col pb-4 max-sm:min-w-0 max-sm:max-w-full">
        <DialogHeader className="border-b border-b-[#EBEBF0] pb-4 -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
          <DialogTitle className="font-bold">
            THÔNG TIN CHI TIẾT LUẬT SƯ
          </DialogTitle>
          <DialogDescription>
            <VisuallyHidden>Chi tiết luật sư</VisuallyHidden>
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-y-auto -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
          {isLoading ? (
            <div className="w-full flex items-center justify-center h-[250px]">
              <Loader2 className="animate-spin h-6 w-6" />
            </div>
          ) : (
            <>
              <section className="mb-6 mt-4">
                <div className="grid grid-cols-7 items-center gap-x-2 gap-y-4 max-sm:grid-cols-3">
                  {detailItems.map((item, index) => {
                    return (
                      <React.Fragment key={item.key}>
                        <Label htmlFor={item.key} className="font-bold">
                          {item.label}
                        </Label>
                        <div className="col-span-2 text-sm" id={item.key}>
                          {item.value}
                        </div>

                        {index % 2 === 0 ? (
                          <div className="max-sm:hidden"></div>
                        ) : (
                          <></>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </section>
              <Collapsible className="my-6" defaultOpen={true}>
                <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold">
                  {data?.isDomestic
                    ? "THÔNG TIN CHỨNG CHỈ HÀNH NGHỀ"
                    : "THÔNG TIN GIẤY PHÉP HÀNH NGHỀ"}
                  <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="grid grid-cols-7 items-center gap-x-2 gap-y-4 max-sm:grid-cols-3">
                    <Label htmlFor="col1" className="font-bold">
                      {data?.isDomestic ? "Số CCHN Luật sư" : "Số giấy phép"}
                    </Label>
                    <div className="col-span-2 text-sm" id="col1">
                      {data?.certificateNumber || "-"}
                    </div>

                    <div className="max-sm:hidden"></div>

                    <Label htmlFor="col2" className="font-bold">
                      {data?.isDomestic ? "Số quyết định" : "Ngày cấp lần đầu"}
                    </Label>
                    <div className="col-span-2 text-sm" id="col2">
                      {(data?.isDomestic
                        ? data?.decisionNumber
                        : data?.issueDate
                        ? format(data.issueDate, "dd/MM/yyyy")
                        : "") || "-"}
                    </div>

                    <Label htmlFor="col3" className="font-bold">
                      {data?.isDomestic ? "Ngày quyết định" : "Ngày gia hạn"}
                    </Label>
                    <div className="col-span-2 text-sm" id="col3">
                      {data?.isDomestic && data?.issueDate
                        ? format(data.issueDate, "dd/MM/yyyy")
                        : !data?.isDomestic && data?.revokeDate
                        ? format(data.revokeDate, "dd/MM/yyyy")
                        : "-"}
                    </div>

                    <div className="max-sm:hidden"></div>

                    <Label htmlFor="col4" className="font-bold">
                      Trạng thái
                    </Label>
                    <div className="col-span-2 text-sm" id="col4">
                      {(data?.isDomestic
                        ? ACTIVITY_STATUS.find(
                            (item) => item.value === data?.activityStatus
                          )?.label
                        : ACTIVITY_STATUS.find(
                            (item) => item.value === data?.activityStatus
                          )?.label) || "-"}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {data?.isDomestic ? (
                <Collapsible className="my-6" defaultOpen={true}>
                  <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold">
                    THÔNG TIN THẺ LUẬT SƯ
                    <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <CommonTable
                      data={query.data?.data}
                      table={table}
                      isLoading={query.isFetching}
                      showTitleHeader={false}
                    />

                    <CommonPagination
                      data={query.data?.data}
                      setSearchParam={setSearchParam}
                      searchParam={searchParam}
                    />
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
        <DialogFooter className="flex items-center">
          <Button
            onClick={() => setOpen(false)}
            type="button"
            className="bg-default-blue text-white border border-default-blue hover:bg-white hover:text-default-blue min-w-[150px]"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LawyerDetailModal;
