"use client";

import { PAGE_NUMBER, QUERY_KEY } from "@/constants/common";
import {
  ACTIVITY_STATUS,
  LAWYER_STATUS,
  PRACTICE_FORM,
} from "@/constants/luat_su";
import { searchLawyer, searchLawyerOrg } from "@/service/lawyer";
import { ProvinceItem } from "@/types/common";
import {
  FullLawyerOrgItem,
  LawyerItem,
  LawyerOrgItem,
  LawyerParams,
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
  data: FullLawyerOrgItem | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  provinces: ProvinceItem[];
}

const LawyerOrgDetailModal = ({
  open,
  data,
  setOpen,
  isLoading,
  provinces,
}: Props) => {
  const [lsSearchParam, setLsSearchParam] = useState<LawyerParams>({
    numberPerPage: 10,
    pageNumber: PAGE_NUMBER,
  });
  const [orgSearchParam, setOrgSearchParam] = useState<LawyerParams>({
    numberPerPage: 10,
    pageNumber: PAGE_NUMBER,
  });

  const province = data?.provinceId
    ? provinces?.find((item) => item.id === data.provinceId)?.name
    : "-";

  useEffect(() => {
    if (data?.orgId) {
      setLsSearchParam({
        organizationId: data.orgId,
        pageNumber: PAGE_NUMBER,
        numberPerPage: 10,
      });

      setOrgSearchParam({
        parentId: data.orgId,
        pageNumber: PAGE_NUMBER,
        numberPerPage: 10,
      });
    }
  }, [data?.orgId]);

  const lsQuery = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.LS_THUOC_TO_CHUC, lsSearchParam],
    queryFn: searchLawyer,
    enabled: !!lsSearchParam.organizationId,
    refetchOnWindowFocus: false,
  });

  const orgQuery = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.DS_CHI_NHANH, orgSearchParam],
    queryFn: searchLawyerOrg,
    enabled: !!orgSearchParam.parentId,
    refetchOnWindowFocus: false,
  });

  const columnsLS: ColumnDef<LawyerItem>[] = [
    {
      accessorKey: "fullname",
      header: () => <div className="text-left">Họ và tên</div>,
      cell: ({ row }) => (
        <div className=" text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.fullName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "dob",
      header: "Ngày sinh",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max">
          {row.original.dateOfBirth
            ? format(row.original.dateOfBirth, "dd/MM/yyyy")
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "cerCode",
      header: "Số CCHNLS/Số giấy phép",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max">
          {row.original.licenseCCHNNumber || "-"}
        </div>
      ),
    },
    {
      accessorKey: "numberCad",
      header: "Số thẻ luật sư",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max">
          {row.original.licenseLSNumber || "-"}
        </div>
      ),
    },
    {
      accessorKey: "practiceForm",
      header: "Hình thức hành nghề",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max">
          {row.original.practiceForm
            ? PRACTICE_FORM.find(
                (item) => item.value === row.original.practiceForm
              )?.label
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Tình trạng hành nghề",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max">
          {ACTIVITY_STATUS.find(
            (item) => item.value === row.original.activityStatus
          )?.label || ""}
        </div>
      ),
    },
  ];

  const columnsOrg: ColumnDef<LawyerOrgItem>[] = [
    {
      accessorKey: "name",
      header: () => <div className="text-left">Tên chi nhánh</div>,
      cell: ({ row }) => (
        <div className=" text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.orgName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: () => <div className="text-left">Địa chỉ chi nhánh</div>,
      cell: ({ row }) => (
        <div className=" text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.address || "-"}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: () => <div className="text-left">Số điện thoại</div>,
      cell: ({ row }) => (
        <div className=" text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.phone || "-"}
        </div>
      ),
    },
    {
      accessorKey: "representative",
      header: () => <div className="text-left">Trưởng chi nhánh</div>,
      cell: ({ row }) => (
        <div className=" text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.lawyerLegalRepresentativeName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "license",
      header: () => <div className="text-left">Số giấy ĐKHĐ</div>,
      cell: ({ row }) => (
        <div className=" text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.businessLicenseNumber || "-"}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: () => <div className="text-left">Ngày cấp</div>,
      cell: ({ row }) => (
        <div className=" text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.businessLicenseIssueDate
            ? format(row.original.businessLicenseIssueDate, "dd/MM/yyyy")
            : "-"}
        </div>
      ),
    },
  ];

  const tableLs = useReactTable({
    data: lsQuery?.data?.data?.items || [],
    columns: columnsLS,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: (lsSearchParam.numberPerPage || 10) + 1,
      },
    },
  });

  const tableOrg = useReactTable({
    data: orgQuery?.data?.data?.items || [],
    columns: columnsOrg,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: (orgSearchParam.numberPerPage || 10) + 1,
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
          label: "Tỉnh/Thành phố",
          value: province || "-",
          key: "province",
        },
        {
          label: "Đoàn Luật sư",
          value: data?.lawyerAssociation?.assocName || "-",
          key: "assocName",
        },
        {
          label: "Tên tổ chức HNLS",
          value: data?.orgName || "-",
          key: "orgName",
        },
        {
          label: "Tình trạng hoạt động",
          value:
            LAWYER_STATUS.find((item) => item.value === data?.status)?.label ||
            "-",
          key: "status",
        },
        {
          label: "Địa chỉ trụ sở",
          value: data?.address || "-",
          key: "address",
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
        {
          label: "Số giấy ĐKHĐ",
          value: data?.businessLicenseNumber || "-",
          key: "businessLicenseNumber",
        },
        {
          label: "Ngày cấp",
          value: data?.businessLicenseIssueDate
            ? format(data.businessLicenseIssueDate, "dd/MM/yyyy")
            : "-",
          key: "businessLicenseIssueDate",
        },
      ];
    }

    return [
      {
        label: "Tỉnh/Thành phố",
        value: province || "-",
        key: "province",
      },
      {
        label: "Tên tổ chức HNLS",
        value: data?.orgName || "-",
        key: "orgName",
      },
      {
        label: "Tình trạng hoạt động",
        value:
          LAWYER_STATUS.find((item) => item.value === data?.status)?.label ||
          "-",
        key: "status",
      },
      {
        label: "Địa chỉ trụ sở",
        value: data?.address || "-",
        key: "address",
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
      {
        label: "Quốc tịch",
        value: data?.nationalName || "-",
        key: "nationalName",
      },
      {
        label: "Số giấy phép thành lập",
        value: data?.registrationLicenseNumber || "-",
        key: "registrationLicenseNumber",
      },
      {
        label: "Ngày cấp",
        value: data?.registrationLicenseIssueDate
          ? format(data.registrationLicenseIssueDate, "dd/MM/yyyy")
          : "-",
        key: "registrationLicenseIssueDate",
      },
    ];
  }, [data, province]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogContent className="min-w-[1200px] max-h-[90vh] max-sm:p-2 z-50 flex flex-col max-sm:min-w-0 max-sm:max-w-full">
        <DialogHeader className="border-b border-b-[#EBEBF0] pb-4 -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
          <DialogTitle className="font-bold">
            THÔNG TIN CHI TIẾT TỔ CHỨC HÀNH NGHỀ LUẬT SƯ
          </DialogTitle>
          <DialogDescription>
            <VisuallyHidden>Chi tiết tổ chức hành nghề luật sư</VisuallyHidden>
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-y-auto -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
          {isLoading ? (
            <div className="w-full flex items-center justify-center h-[250px]">
              <Loader2 className="animate-spin h-6 w-6" />
            </div>
          ) : (
            <>
              <section className="mb-6">
                <p className="mb-3 font-bold">THÔNG TIN CHUNG</p>
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

              <section className="my-6">
                <p className="mb-3 font-bold">
                  THÔNG TIN NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT
                </p>
                <div className="grid grid-cols-7 items-center gap-x-2 gap-y-4 max-sm:grid-cols-3">
                  <Label htmlFor="fullname" className="font-bold">
                    Họ và tên
                  </Label>
                  <div className="col-span-2 text-sm" id="fullname">
                    {data?.lawyerLegalRepresentative?.fullName || "-"}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="dob" className="font-bold">
                    Ngày sinh
                  </Label>
                  <div className="col-span-2 line-clamp-3 text-sm" id="dob">
                    {data?.lawyerLegalRepresentative?.dateOfBirth
                      ? format(
                          data.lawyerLegalRepresentative.dateOfBirth,
                          "dd/MM/yyyy"
                        )
                      : "-"}
                  </div>

                  <Label htmlFor="cerCode" className="font-bold">
                    {data?.isDomestic ? "Số CCHNLS" : "Số CCHNLS/Giấy phép"}
                  </Label>
                  <div className="col-span-2 text-sm" id="cerCode">
                    {data?.lawyerLegalRepresentative?.certificateNumber || "-"}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="cardNum" className="font-bold">
                    Số thẻ luật sư
                  </Label>
                  <div className="col-span-2 text-sm" id="cardNum">
                    {data?.lawyerLegalRepresentative?.lsCardLicenses?.[0]
                      ?.licenseNumber || "-"}
                  </div>
                </div>
              </section>

              <Collapsible className="my-6" defaultOpen={true}>
                <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold">
                  DANH SÁCH LUẬT SƯ HÀNH NGHỀ TẠI TỔ CHỨC
                  <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <CommonTable
                    data={lsQuery?.data?.data}
                    table={tableLs}
                    isLoading={isLoading}
                    showTitleHeader={false}
                  />
                  <CommonPagination
                    data={lsQuery?.data?.data}
                    setSearchParam={setLsSearchParam}
                    searchParam={lsSearchParam}
                  />
                </CollapsibleContent>
              </Collapsible>

              {data?.isDomestic ? (
                <Collapsible className="my-6" defaultOpen={true}>
                  <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold">
                    DANH SÁCH CHI NHÁNH CỦA TỔ CHỨC HÀNH NGHỀ LUẬT SƯ
                    <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <CommonTable
                      data={orgQuery.data?.data}
                      table={tableOrg}
                      isLoading={isLoading}
                      showTitleHeader={false}
                    />
                    <CommonPagination
                      data={orgQuery.data?.data}
                      setSearchParam={setOrgSearchParam}
                      searchParam={orgSearchParam}
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

export default LawyerOrgDetailModal;
