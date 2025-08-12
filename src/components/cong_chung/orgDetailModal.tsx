"use client";

import { OrgDetailNotaryList, OrgDetailResponse } from "@/types/congChung";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronUp, Loader2 } from "lucide-react";
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
  data: OrgDetailResponse | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

const OrgDetailModal = ({ open, data, setOpen, isLoading }: Props) => {
  const orgInfo = data?.orgNotaryInfoView;

  const columns: ColumnDef<OrgDetailNotaryList>[] = [
    {
      accessorKey: "name",
      header: "Họ và tên",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.nameNotaryInfo}
        </div>
      ),
    },
    {
      accessorKey: "dob",
      header: "Ngày sinh",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.birthDayStr_}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Số điện thoại",
      cell: ({ row }) => (
        <div className="text-left">{row.original.telOrgNotaryInfo}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Địa chỉ thường trú",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
          {row.original.addressResident}
        </div>
      ),
    },
    {
      accessorKey: "dispatchNum",
      header: "Số QĐ bổ nhiệm",
      cell: ({ row }) => (
        <div className="text-left">{row.original.dispatchCode}</div>
      ),
    },
    {
      accessorKey: "dateSign",
      header: "Ngày bổ nhiệm",
      cell: ({ row }) => (
        <div className="text-left">{row.original.dateSignStr}</div>
      ),
    },
    {
      accessorKey: "numberCad",
      header: "Số thẻ CCV",
      cell: ({ row }) => (
        <div className="text-left">{row.original.numberCad}</div>
      ),
    },
  ];

  const notaryList = data?.pageNotary;

  const table = useReactTable({
    manualPagination: true,
    data: data?.pageNotary?.items || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogContent className="min-w-[1200px] max-h-[90vh] max-sm:p-2 z-50 flex flex-col max-sm:min-w-0 max-sm:max-w-full">
        <DialogHeader className="border-b border-b-[#EBEBF0] pb-4 -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
          <DialogTitle className="font-bold">
            THÔNG TIN CHI TIẾT TỔ CHỨC HÀNH NGHỀ CÔNG CHỨNG
          </DialogTitle>
          <DialogDescription>
            <VisuallyHidden>
              Chi tiết tổ chức hành nghề công chứng
            </VisuallyHidden>
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
                <div className="grid grid-cols-7 items-center justify-start gap-x-2 gap-y-4 max-sm:grid-cols-3">
                  <Label htmlFor="name" className="font-bold">
                    Tên tổ chức HNCC
                  </Label>
                  <div className="col-span-2 text-sm" id="name">
                    {orgInfo?.name || "-"}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="status" className="font-bold">
                    Trạng thái
                  </Label>
                  <div className="col-span-2 text-sm" id="status">
                    {orgInfo?.statusOrgStr || "-"}
                  </div>

                  <Label htmlFor="adminName" className="font-bold">
                    Sở Tư pháp
                  </Label>
                  <div className="col-span-2 text-sm" id="adminName">
                    {orgInfo?.adminName || "-"}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="address" className="font-bold">
                    Địa chỉ trụ sở
                  </Label>
                  <div
                    className="col-span-2 text-sm line-clamp-3"
                    id="address"
                    title={orgInfo?.address || "-"}
                  >
                    {orgInfo?.address || "-"}
                  </div>

                  <Label htmlFor="tel" className="font-bold">
                    Số điện thoại
                  </Label>
                  <div className="col-span-2 text-sm line-clamp-3" id="tel">
                    {orgInfo?.tel || "-"}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="email" className="font-bold">
                    Địa chỉ email
                  </Label>
                  <div className="col-span-2 text-sm line-clamp-3" id="email">
                    {orgInfo?.email || "-"}
                  </div>
                </div>
              </section>

              <section className="my-6">
                <p className="mb-3 font-bold">
                  THÔNG TIN TRƯỞNG VĂN PHÒNG CÔNG CHỨNG
                </p>
                <div className="grid grid-cols-7 items-center gap-x-2 gap-y-4 max-sm:grid-cols-3">
                  <Label htmlFor="chiefName" className="font-bold">
                    Họ và tên
                  </Label>
                  <div className="col-span-2 text-sm" id="chiefName">
                    {orgInfo?.officeChiefName || "-"}
                  </div>
                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="chiefTel" className="font-bold">
                    Số điện thoại
                  </Label>
                  <div className="col-span-2 text-sm" id="chiefTel">
                    {orgInfo?.phoneNumber || "-"}
                  </div>

                  <Label htmlFor="gender" className="font-bold">
                    Giới tính
                  </Label>
                  <div className="col-span-2 text-sm" id="gender">
                    {orgInfo?.sex === 1
                      ? "Nam"
                      : orgInfo?.sex === 2
                      ? "Nữ"
                      : "-"}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="dob" className="font-bold">
                    Ngày sinh
                  </Label>
                  <div className="col-span-2 text-sm" id="dob">
                    {orgInfo?.birthDay
                      ? format(orgInfo?.birthDay, "dd/MM/yyyy")
                      : "-"}
                  </div>

                  <Label htmlFor="addressNow" className="font-bold">
                    Địa chỉ thường trú
                  </Label>
                  <div
                    className="col-span-2 text-sm line-clamp-3"
                    title={orgInfo?.addressResident}
                    id="addressResident"
                  >
                    {orgInfo?.addressResident || "-"}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="dispatchCode" className="font-bold">
                    Quyết định bổ nhiệm CCV
                  </Label>
                  <div className="col-span-2 text-sm" id="dispatchCode">
                    {orgInfo?.dispatchCode || "-"}
                  </div>

                  <Label htmlFor="dateSign" className="font-bold">
                    Ngày bổ nhiệm
                  </Label>
                  <div className="col-span-2 text-sm" id="dateSign">
                    {orgInfo?.dateSign
                      ? format(orgInfo?.dateSign, "dd/MM/yyyy")
                      : "-"}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="numberCad" className="font-bold">
                    Số thẻ CCV
                  </Label>
                  <div className="col-span-2 text-sm" id="numberCad">
                    {orgInfo?.numberCad || "-"}
                  </div>
                </div>
              </section>

              <Collapsible className="my-6" defaultOpen={true}>
                <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold">
                  DANH SÁCH CÔNG CHỨNG VIÊN THUỘC TỔ CHỨC
                  <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <CommonTable
                    data={notaryList}
                    table={table}
                    isLoading={isLoading}
                    showTitleHeader={false}
                  />
                </CollapsibleContent>
              </Collapsible>
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

export default OrgDetailModal;
