"use client";

import { CER_STATUS, ORG_STATUS } from "@/constants/dauGia";
import { AuctionOrgDetailResponse, DGVMemberItem } from "@/types/dauGia";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { format } from "date-fns";
import { ChevronUp, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import CommonTable from "../common/commonTable";

interface Props {
  open: boolean;
  data: AuctionOrgDetailResponse | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

const AuctionOrgDetailModal = ({ open, data, setOpen, isLoading }: Props) => {
  const orgInfo = data?.organization;
  const managerInfo = data?.manager;

  const columns: ColumnDef<DGVMemberItem>[] = [
    {
      accessorKey: "fullname",
      header: () => <div className="text-left">Họ và tên</div>,
      cell: ({ row }) => (
        <div className=" text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.fullname}
        </div>
      ),
    },
    {
      accessorKey: "dob",
      header: "Ngày sinh",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max">
          {row.original.dob}
        </div>
      ),
    },
    {
      accessorKey: "cerCode",
      header: "Chứng chỉ hành nghề",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max">
          {row.original.cerCode}
        </div>
      ),
    },
    {
      accessorKey: "cerDOI",
      header: "Ngày cấp",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max">
          {row.original.cerDOI ? format(row.original.cerDOI, "dd/MM/yyyy") : ""}
        </div>
      ),
    },
    {
      accessorKey: "numberCad",
      header: "Số thẻ đấu giá viên",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max">
          {row.original.cardCode}
        </div>
      ),
    },
    {
      accessorKey: "dateSign",
      header: "Ngày cấp thẻ",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max">
          {row.original.cerDOI
            ? format(row.original.cardDOI, "dd/MM/yyyy")
            : ""}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái hoạt động",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max">
          {CER_STATUS.find((item) => item.value === row.original.cerStatus)
            ?.label || ""}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.auctioneers || [],
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
            THÔNG TIN CHI TIẾT TỔ CHỨC HÀNH NGHỀ ĐẤU GIÁ
          </DialogTitle>
          <DialogDescription>
            <VisuallyHidden>Chi tiết tổ chức hành nghề đấu giá</VisuallyHidden>
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
                <p className="mb-3 font-bold">
                  THÔNG TIN DOANH NGHIỆP ĐẤU GIÁ TÀI SẢN
                </p>
                <div className="grid grid-cols-7 items-center gap-x-2 gap-y-4 max-sm:grid-cols-3">
                  <Label htmlFor="licenseNo" className="font-bold">
                    Số quyết định
                  </Label>
                  <div className="col-span-2 text-sm" id="licenseNo">
                    {orgInfo?.licenseNo || "-"}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="licenseDate" className="font-bold">
                    Ngày cấp
                  </Label>
                  <div className="col-span-2 text-sm" id="licenseDate">
                    {orgInfo?.licenseDate
                      ? format(orgInfo?.licenseDate, "dd/MM/yyyy")
                      : "-"}
                  </div>

                  <Label htmlFor="fullname" className="font-bold">
                    Tên doanh nghiệp
                  </Label>
                  <div className="col-span-2 text-sm" id="fullname">
                    {orgInfo?.fullname || "-"}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="address" className="font-bold">
                    Địa chỉ
                  </Label>
                  <div
                    className="col-span-2 line-clamp-3 text-sm"
                    id="address"
                    title={orgInfo?.address || "-"}
                  >
                    {orgInfo?.address || "-"}
                  </div>

                  <Label htmlFor="tel" className="font-bold">
                    Số điện thoại
                  </Label>
                  <div className="col-span-2 text-sm line-clamp-3" id="tel">
                    {orgInfo?.foneNumber || "-"}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="email" className="font-bold">
                    Email
                  </Label>
                  <div className="col-span-2 text-sm line-clamp-3" id="email">
                    {orgInfo?.email || "-"}
                  </div>

                  <Label htmlFor="status" className="font-bold">
                    Trạng thái
                  </Label>
                  <div className="col-span-2 text-sm line-clamp-3" id="status">
                    {ORG_STATUS.find((item) => item.value === orgInfo?.status)
                      ?.label || "-"}
                  </div>
                </div>
              </section>

              <section className="my-6">
                <p className="mb-3 font-bold">NGƯỜI ĐẠI DIỆN PHÁP LUẬT</p>
                <div className="grid grid-cols-7 items-center gap-x-2 gap-y-4 max-sm:grid-cols-3">
                  <Label htmlFor="fullname" className="font-bold">
                    Họ và tên
                  </Label>
                  <div className="col-span-2 text-sm" id="fullname">
                    {managerInfo?.fullname || "-"}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="addPermanent" className="font-bold">
                    Nơi ĐK HKTT
                  </Label>
                  <div
                    className="col-span-2 line-clamp-3 text-sm"
                    id="addPermanent"
                    title={managerInfo?.addPermanent || "-"}
                  >
                    {managerInfo?.addPermanent || "-"}
                  </div>

                  <Label htmlFor="cerCode" className="font-bold">
                    Chứng chỉ hành nghề
                  </Label>
                  <div className="col-span-2 text-sm" id="cerCode">
                    {managerInfo?.cerCode || "-"}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="cerDOI" className="font-bold">
                    Ngày cấp
                  </Label>
                  <div className="col-span-2 text-sm" id="cerDOI">
                    {managerInfo?.cerDOI
                      ? format(managerInfo?.cerDOI, "dd/MM/yyyy")
                      : "-"}
                  </div>

                  <Label htmlFor="cardCode" className="font-bold">
                    Số thẻ ĐGV
                  </Label>
                  <div className="col-span-2 text-sm" id="cardCode">
                    {managerInfo?.cardCode || "-"}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="cardDOI" className="font-bold">
                    Ngày cấp
                  </Label>
                  <div className="col-span-2 text-sm" id="cardDOI">
                    {managerInfo?.cardDOI
                      ? format(managerInfo?.cardDOI, "dd/MM/yyyy")
                      : "-"}
                  </div>
                </div>
              </section>

              <Collapsible className="my-6" defaultOpen={true}>
                <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold">
                  DANH SÁCH ĐẤU GIÁ VIÊN THUỘC TỔ CHỨC
                  <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <CommonTable
                    data={{
                      items: data?.auctioneers || [],
                      numberPerPage: 100,
                      pageCount: 1,
                      pageList: [],
                    }}
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

export default AuctionOrgDetailModal;
