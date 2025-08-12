"use client";

import { QUERY_KEY, SCREENS_SIZE } from "@/constants/common";
import { getDGVProcess } from "@/service/auctionOrg";
import {
  AuctionDGVResponse,
  FullCardDGVItem,
  FullCCHNItem,
} from "@/types/dauGia";
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
// import { Chrono } from "react-chrono";
import useWindowSize from "@/hooks/useWindowResize";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Props {
  open: boolean;
  data?: AuctionDGVResponse | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

const DGVDetailModal = ({ open, data, setOpen, isLoading }: Props) => {
  const windowSize = useWindowSize();
  // const isMobile = windowSize.width > 0 && windowSize.width <= SCREENS_SIZE.md;

  // const query = useQuery({
  //   queryKey: [QUERY_KEY.DAU_GIA.DGV_TIMELINE, data?.detail?.id || 0],
  //   queryFn: getDGVProcess,
  //   enabled: !!data?.detail?.id,
  //   refetchOnWindowFocus: false,
  // });

  const cchnColumns: ColumnDef<FullCCHNItem>[] = [
    {
      accessorKey: "numberOfDecision",
      header: "Số quyết định",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.numberOfDecision}
        </div>
      ),
    },
    {
      accessorKey: "dateOfDecision",
      header: "Ngày quyết định",
      cell: ({ row }) => (
        <div className="text-left">
          {row.original.dateOfDecision
            ? format(row.original.dateOfDecision, "dd/MM/yyyy")
            : ""}
        </div>
      ),
    },
    {
      accessorKey: "effectiveDate",
      header: "Ngày hiệu lực",
      cell: ({ row }) => (
        <div className="text-left">
          {row.original.effectiveDate
            ? format(row.original.effectiveDate, "dd/MM/yyyy")
            : ""}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Loại quyết định",
      cell: ({ row }) => (
        <div className="text-left">{row.original.actTypeStr}</div>
      ),
    },
    {
      accessorKey: "cerCode",
      header: "Số CCHN",
      cell: ({ row }) => (
        <div className="text-left">{row.original.cerCode}</div>
      ),
    },
  ];

  const cardColumns: ColumnDef<FullCardDGVItem>[] = [
    {
      accessorKey: "numberOfDecision",
      header: "Số quyết định",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.numberOfDecision}
        </div>
      ),
    },
    {
      accessorKey: "dateOfDecision",
      header: "Ngày quyết định",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] min-w-[100px]">
          {row.original.dateOfDecision
            ? format(row.original.dateOfDecision, "dd/MM/yyyy")
            : ""}
        </div>
      ),
    },
    {
      accessorKey: "effectiveDate",
      header: "Ngày hiệu lực",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] min-w-[100px]">
          {row.original.effectiveDate
            ? format(row.original.effectiveDate, "dd/MM/yyyy")
            : ""}
        </div>
      ),
    },
    {
      accessorKey: "actType",
      header: "Loại quyết định",
      cell: ({ row }) => (
        <div className="text-left">{row.original.actTypeStr}</div>
      ),
    },
    {
      accessorKey: "orrgName",
      header: "Tổ chức đấu giá",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
          {row.original.orgName}
        </div>
      ),
    },
    {
      accessorKey: "cardCode",
      header: "Số thẻ",
      cell: ({ row }) => (
        <div className="text-left">{row.original.cardCode}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Ngày cấp",
      cell: () => <div className="text-center min-w-[100px]">-</div>,
    },
  ];

  //   const notaryList = data?.pageNotary;

  const cchnTable = useReactTable({
    data: data?.listFullCCHN || [],
    columns: cchnColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });

  const cardTable = useReactTable({
    data: data?.listFullCardDGV || [],
    columns: cardColumns,
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
      <DialogContent className="min-w-[1200px] max-h-[90vh] max-sm:p-2 z-50 flex flex-col pb-4 max-sm:min-w-0 max-sm:max-w-full">
        <DialogHeader className="border-b border-b-[#EBEBF0] pb-4 -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
          <DialogTitle className="font-bold">
            THÔNG TIN CHI TIẾT ĐẤU GIÁ VIÊN
          </DialogTitle>
          <DialogDescription>
            <VisuallyHidden>Chi tiết đấu giá viên</VisuallyHidden>
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-y-auto -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
          {isLoading ? (
            <div className="w-full flex items-center justify-center h-[250px]">
              <Loader2 className="animate-spin h-6 w-6" />
            </div>
          ) : (
            <Tabs defaultValue="hoSo">
              <TabsList className="flex items-center justify-start flex-wrap h-auto space-y-1">
                <TabsTrigger value="hoSo">Xem theo hồ sơ chi tiết</TabsTrigger>
                {/* <TabsTrigger value="quaTrinh">
                  Xem theo quá trình hành nghề
                </TabsTrigger> */}
              </TabsList>
              <section className="mb-6 mt-4">
                <p className="mb-3 font-bold">
                  THÔNG TIN CHUNG CỦA ĐẤU GIÁ VIÊN
                </p>
                <div className="grid grid-cols-7 items-center gap-x-2 gap-y-4 max-sm:grid-cols-3">
                  <Label htmlFor="name" className="font-bold">
                    Họ và tên
                  </Label>
                  <div className="col-span-2 text-sm" id="name">
                    {data?.detail?.fullname || "-"}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="telNumber" className="font-bold">
                    Số điện thoại
                  </Label>
                  <div className="col-span-2 text-sm" id="telNumber">
                    {data?.detail?.telNumber || "-"}
                  </div>

                  <Label htmlFor="sexStr" className="font-bold">
                    Giới tính
                  </Label>
                  <div className="col-span-2 text-sm" id="sexStr">
                    {data?.detail?.sex === 0
                      ? "Nam"
                      : data?.detail?.sex === 1
                      ? "Nữ"
                      : ""}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="dob" className="font-bold">
                    Ngày sinh
                  </Label>
                  <div className="col-span-2 text-sm" id="dob">
                    {data?.detail?.dob || "-"}
                  </div>

                  <Label htmlFor="address" className="font-bold">
                    Địa chỉ thường trú
                  </Label>
                  <div
                    className="col-span-2 text-sm line-clamp-3"
                    id="address"
                    title={data?.detail?.addrFull}
                  >
                    {data?.detail?.addrFull || "-"}
                  </div>

                  <div className="max-sm:hidden"></div>

                  <Label htmlFor="email" className="font-bold">
                    Email
                  </Label>
                  <div className="col-span-2 text-sm" id="email">
                    {data?.detail?.email || "-"}
                  </div>
                </div>
              </section>

              <TabsContent value="hoSo">
                <Collapsible className="my-6" defaultOpen={true}>
                  <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold">
                    THÔNG TIN CHỨNG CHỈ HÀNH NGHỀ
                    <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <CommonTable
                      data={{
                        items: data?.listFullCCHN || [],
                        numberPerPage: 100,
                        pageCount: 1,
                        pageList: [],
                      }}
                      table={cchnTable}
                      isLoading={isLoading}
                      showTitleHeader={false}
                    />
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible className="my-6" defaultOpen={true}>
                  <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold">
                    THÔNG TIN THẺ ĐẤU GIÁ VIÊN
                    <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <CommonTable
                      data={{
                        items: data?.listFullCardDGV || [],
                        numberPerPage: 100,
                        pageCount: 1,
                        pageList: [],
                      }}
                      table={cardTable}
                      isLoading={isLoading}
                      showTitleHeader={false}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </TabsContent>

              {/* <TabsContent value="quaTrinh">
                <p className="mb-3 font-bold">
                  QUÁ TRÌNH HÀNH NGHỀ CỦA ĐẤU GIÁ VIÊN
                </p>
                <div className="flex items-center justify-center bg-[#ECF9FC] p-2">
                  <div className="modal-timeline min-w-[800px] max-sm:min-w-0 max-sm:max-w-full">
                    <Chrono
                      mode={isMobile ? "VERTICAL" : "VERTICAL_ALTERNATING"}
                      disableToolbar
                      theme={{ primary: "#37B1CB", secondary: "#37B1CB" }}
                    >
                      {query?.data?.data?.length ? (
                        query?.data?.data?.map((item, index) => (
                          <div key={index}>
                            {item.strActType ? (
                              <strong>{item.strActType}</strong>
                            ) : (
                              <></>
                            )}
                            {item.orgName ? (
                              <div className="col-span-2 text-sm">
                                <strong>Cơ quan quản lý:</strong> {item.orgName}
                              </div>
                            ) : (
                              <></>
                            )}
                            {item.numberOfDecision ? (
                              <div className="col-span-2 text-sm">
                                <strong>Số quyết định:</strong>{" "}
                                {item.numberOfDecision}
                              </div>
                            ) : (
                              <></>
                            )}
                            {item.dateOfDecision ? (
                              <div className="col-span-2 text-sm">
                                <strong>Ngày quyết định:</strong>{" "}
                                {format(item.dateOfDecision, "dd/MM/yyyy")}
                              </div>
                            ) : (
                              <></>
                            )}
                            {item.effectiveDate ? (
                              <div className="col-span-2 text-sm">
                                <strong>Ngày có hiệu lực:</strong>{" "}
                                {format(item.effectiveDate, "dd/MM/yyyy")}
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        ))
                      ) : (
                        <div>Không có dữ liệu</div>
                      )}
                    </Chrono>
                  </div>
                </div>
              </TabsContent> */}
            </Tabs>
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

export default DGVDetailModal;
