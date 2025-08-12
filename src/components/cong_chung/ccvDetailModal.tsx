"use client";

import {
  CCVAppointPrivate,
  CCVProbationaryPrivate,
  CCVRegAndAuctionCardPrivate,
  OrgCCVDetailResponsePrivate,
} from "@/types/congChung";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronUp, Loader2 } from "lucide-react";
// import { Chrono } from "react-chrono";
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
  data?: OrgCCVDetailResponsePrivate | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

const CCVDetailModal = ({ open, data, setOpen, isLoading }: Props) => {
  // const windowSize = useWindowSize();
  // const isMobile = windowSize.width > 0 && windowSize.width <= SCREENS_SIZE.md;

  // const query = useQuery({
  //   queryKey: [QUERY_KEY.CONG_CHUNG.CCV_TIMELINE, data?.idNotaryInfo || 0],
  //   queryFn: getCCVProcess,
  //   enabled: !!data?.idNotaryInfo,
  //   refetchOnWindowFocus: false,
  // });

  const appointColumns: ColumnDef<CCVAppointPrivate>[] = [
    {
      accessorKey: "type",
      header: () => <div className="text-left">Loại</div>,
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.type}
        </div>
      ),
    },
    {
      accessorKey: "dispatchCode",
      header: () => (
        <div className="text-left">Số quyết định bổ nhiệm/đề nghị bổ nhiệm</div>
      ),
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] min-w-[100px]">
          {row.original.dispatchCode}
        </div>
      ),
    },
    {
      accessorKey: "dateSignStr",
      header: () => <div className="text-left">Ngày quyết định</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.original.dateSign}</div>
      ),
    },
    {
      accessorKey: "effectiveDate",
      header: () => <div className="text-left">Ngày hiệu lực</div>,
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
          {row.original.effectiveDate}
        </div>
      ),
    },
    {
      accessorKey: "signer",
      header: () => <div className="text-left">Người ký</div>,
      cell: ({ row }) => <div className="text-left">-</div>,
    },
    {
      accessorKey: "status",
      header: () => <div className="text-left">Trạng thái</div>,
      cell: ({ row }) => <div className="text-left">{row.original.status}</div>,
    },
  ];

  const cardColumns: ColumnDef<CCVRegAndAuctionCardPrivate>[] = [
    {
      accessorKey: "orgNotaryInfoId",
      header: "Sở Tư pháp Quản lý",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.orgNotaryInfoId}
        </div>
      ),
    },
    {
      accessorKey: "notaryInfoId",
      header: "Tổ chức HNCC",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] min-w-[100px]">
          {row.original.notaryInfoId}
        </div>
      ),
    },
    {
      accessorKey: "dispatchCode",
      header: "Số Quyết định HNCC",
      cell: ({ row }) => (
        <div className="text-left">{row.original.dispatchCode}</div>
      ),
    },
    {
      accessorKey: "decisionDate",
      header: "Ngày quyết định",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
          {row.original.decisionDate}
        </div>
      ),
    },
    {
      accessorKey: "effectiveDate",
      header: "Ngày hiệu lực",
      cell: ({ row }) => (
        <div className="text-left">{row.original.effectiveDate}</div>
      ),
    },
    {
      accessorKey: "numberCad",
      header: "Số thẻ",
      cell: ({ row }) => (
        <div className="text-left">{row.original.numberCad}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <div className="text-center min-w-[100px]">{row.original.status}</div>
      ),
    },
  ];

  const probationaryColumns: ColumnDef<CCVProbationaryPrivate>[] = [
    {
      accessorKey: "dispatchCode",
      header: "Giấy chứng nhận tốt nghiệp/hoàn thành khóa bồi dưỡng",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.dispatchCode}
        </div>
      ),
    },
    {
      accessorKey: "dateSign",
      header: "Ngày cấp",
      cell: ({ row }) => (
        <div className="text-left">{row.original.dateSign}</div>
      ),
    },
    {
      accessorKey: "orgName",
      header: "Tổ chức HNCC nhận tập sự",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] min-w-[100px]">
          {row.original.orgName}
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Địa chỉ trụ sở",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
          {row.original.address}
        </div>
      ),
    },
    {
      accessorKey: "dateStartStr",
      header: "Ngày bắt đầu",
      cell: ({ row }) => (
        <div className="text-left">{row.original.dateStart}</div>
      ),
    },
    {
      accessorKey: "dateNumber",
      header: "Thời gian tập sự",
      cell: ({ row }) => (
        <div className="text-left">{row.original.dateNumber}</div>
      ),
    },
  ];

  const appointTable = useReactTable({
    data: data?.notaryAppointResponses || [],
    columns: appointColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });

  // const cardTable = useReactTable({
  //   data: data?.notaryRegAndAuctionCardResponse || [],
  //   columns: cardColumns,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   initialState: {
  //     pagination: {
  //       pageSize: 100,
  //     },
  //   },
  // });

  // const probationaryTable = useReactTable({
  //   data: data?.notaryProbationaryResponse || [],
  //   columns: probationaryColumns,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   initialState: {
  //     pagination: {
  //       pageSize: 100,
  //     },
  //   },
  // });

  // const generateTimelineItem = (item: CCVProcessItem) => {
  //   return item.body?.map((item, index) => {
  //     const text = item?.split(":");
  //     return (
  //       <div key={index} className="text-xs">
  //         <strong>{text?.[0]}:</strong>
  //         {text?.[1]}
  //       </div>
  //     );
  //   });
  // };

  return (
    // <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
    //   <DialogContent className="min-w-[1200px] max-h-[90vh] max-sm:p-2 z-50 flex flex-col max-sm:min-w-0 max-sm:max-w-full">
    //     <DialogHeader className="border-b border-b-[#EBEBF0] pb-4 -mx-6 px-6 max-sm:-mx-2 max-sm:px-2 max-sm:pb-2">
    //       <DialogTitle className="font-bold max-sm:text-xs max-sm:pt-2">
    //         THÔNG TIN CHI TIẾT CÔNG CHỨNG VIÊN
    //       </DialogTitle>
    //       <DialogDescription>
    //         <VisuallyHidden>Chi tiết Công chứng viên</VisuallyHidden>
    //       </DialogDescription>
    //     </DialogHeader>
    //     <div className="h-full overflow-y-auto -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
    //       {isLoading ? (
    //         <div className="w-full flex items-center justify-center h-[250px]">
    //           <Loader2 className="animate-spin h-6 w-6" />
    //         </div>
    //       ) : (
    //         <Tabs defaultValue="hoSo">
    //           <TabsList className="flex items-center justify-start flex-wrap h-auto space-y-1">
    //             <TabsTrigger value="hoSo">Xem theo hồ sơ chi tiết</TabsTrigger>
    //             {/* <TabsTrigger value="quaTrinh">
    //               Xem theo quá trình hành nghề
    //             </TabsTrigger> */}
    //           </TabsList>
    //           <section className="mb-6 mt-4 overflow-y-auto">
    //             <p className="mb-3 font-bold">
    //               THÔNG TIN CHUNG CỦA CÔNG CHỨNG VIÊN
    //             </p>
    //             <div className="grid grid-cols-7 items-center gap-x-2 gap-y-4 max-sm:grid-cols-3">
    //               <Label htmlFor="name" className="font-bold">
    //                 Họ và tên
    //               </Label>
    //               <div className="col-span-2 text-sm" id="name">
    //                 {data?.nameNotaryInfo || "-"}
    //               </div>

    //               <div className="max-sm:hidden"></div>

    //               <Label htmlFor="phoneNumberNotaryInfo" className="font-bold">
    //                 Số điện thoại
    //               </Label>
    //               <div
    //                 className="col-span-2 text-sm"
    //                 id="phoneNumberNotaryInfo"
    //               >
    //                 {data?.phoneNumber || "-"}
    //               </div>

    //               <Label htmlFor="sexStr" className="font-bold">
    //                 Giới tính
    //               </Label>
    //               <div className="col-span-2 text-sm" id="sexStr">
    //                 {data?.sexStr || "-"}
    //               </div>

    //               <div className="max-sm:hidden"></div>

    //               <Label htmlFor="birthDayStr" className="font-bold">
    //                 Ngày sinh
    //               </Label>
    //               <div className="col-span-2 text-sm" id="birthDayStr">
    //                 {data?.birthDayStr_ || "-"}
    //               </div>

    //               <Label htmlFor="address" className="font-bold">
    //                 Địa chỉ thường trú
    //               </Label>
    //               <div
    //                 className="line-clamp-3 col-span-2 text-sm"
    //                 id="address"
    //                 title={data?.addressResident}
    //               >
    //                 {data?.addressResident || "-"}
    //               </div>

    //               <div className="max-sm:hidden"></div>

    //               <Label htmlFor="dispatchCode" className="font-bold">
    //                 Quyết định bổ nhiệm CCV
    //               </Label>
    //               <div className="col-span-2 text-sm" id="dispatchCode">
    //                 {data?.dispatchCode ||
    //                   data?.notaryAppointResponses?.[0]?.dispatchCode ||
    //                   "-"}
    //               </div>

    //               <Label htmlFor="dateSignStr" className="font-bold">
    //                 Ngày bổ nhiệm
    //               </Label>
    //               <div className="col-span-2 text-sm" id="dateSignStr">
    //                 {data?.dateSignStr ||
    //                   data?.notaryAppointResponses?.[0]?.dateSign ||
    //                   "-"}
    //               </div>

    //               <div className="max-sm:hidden"></div>

    //               <Label htmlFor="numberCad" className="font-bold">
    //                 Số thẻ CCV
    //               </Label>
    //               <div className="col-span-2 text-sm" id="numberCad">
    //                 {data?.numberCad ||
    //                   data?.notaryRegAndAuctionCardResponse?.[0]?.numberCad ||
    //                   "-"}
    //               </div>

    //               <Label htmlFor="dateProvide" className="font-bold">
    //                 Ngày cấp
    //               </Label>
    //               <div className="cols-span-2 text-sm" id="dateProvide">
    //                 {data?.notaryRegAndAuctionCardResponse?.[0]?.decisionDate ||
    //                   "-"}
    //               </div>
    //             </div>
    //           </section>

    //           <TabsContent value="hoSo">
    //             <Collapsible className="my-6" defaultOpen={true}>
    //               <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold">
    //                 THÔNG TIN BỔ NHIỆM CÔNG CHỨNG VIÊN
    //                 <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
    //               </CollapsibleTrigger>
    //               <CollapsibleContent className="mt-2">
    //                 <CommonTable
    //                   data={{
    //                     items: data?.notaryAppointResponses || [],
    //                     numberPerPage: 100,
    //                     pageList: [1],
    //                     pageCount: 1,
    //                   }}
    //                   table={appointTable}
    //                   isLoading={isLoading}
    //                   showTitleHeader={false}
    //                 />
    //               </CollapsibleContent>
    //             </Collapsible>

    //             <Collapsible className="my-6" defaultOpen={true}>
    //               <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold">
    //                 ĐĂNG KÝ HNCC VÀ THẺ CÔNG CHỨNG VIÊN
    //                 <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
    //               </CollapsibleTrigger>
    //               <CollapsibleContent className="mt-2">
    //                 <CommonTable
    //                   data={{
    //                     items: data?.notaryRegAndAuctionCardResponse || [],
    //                     numberPerPage: 100,
    //                     pageList: [1],
    //                     pageCount: 1,
    //                   }}
    //                   table={cardTable}
    //                   isLoading={isLoading}
    //                   showTitleHeader={false}
    //                 />
    //               </CollapsibleContent>
    //             </Collapsible>

    //             <Collapsible className="my-6" defaultOpen={true}>
    //               <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold">
    //                 THÔNG TIN ĐĂNG KÝ TẬP SỰ HÀNH NGHỀ CÔNG CHỨNG
    //                 <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
    //               </CollapsibleTrigger>
    //               <CollapsibleContent className="mt-2">
    //                 <CommonTable
    //                   data={{
    //                     items: data?.notaryProbationaryResponse || [],
    //                     numberPerPage: 100,
    //                     pageList: [1],
    //                     pageCount: 1,
    //                   }}
    //                   table={probationaryTable}
    //                   isLoading={isLoading}
    //                   showTitleHeader={false}
    //                 />
    //               </CollapsibleContent>
    //             </Collapsible>
    //           </TabsContent>

    //           {/* <TabsContent value="quaTrinh">
    //             <p className="mb-3 font-bold">
    //               QUÁ TRÌNH HÀNH NGHỀ CỦA CÔNG CHỨNG VIÊN
    //             </p>
    //             <div className="flex items-center justify-center bg-[#ECF9FC] p-2">
    //               <div className="modal-timeline min-w-[800px] max-sm:min-w-0 max-sm:max-w-full">
    //                 <Chrono
    //                   mode={isMobile ? "VERTICAL" : "VERTICAL_ALTERNATING"}
    //                   disableToolbar
    //                   theme={{ primary: "#37B1CB", secondary: "#37B1CB" }}
    //                 >
    //                   {query?.data?.data?.length ? (
    //                     query?.data?.data?.map((item, index) => (
    //                       <div key={index}>
    //                         <strong>{item.ten_chinh || "-"}</strong>
    //                         {generateTimelineItem(item)}
    //                       </div>
    //                     ))
    //                   ) : (
    //                     <div>Không có dữ liệu</div>
    //                   )}
    //                 </Chrono>
    //               </div>
    //             </div>
    //           </TabsContent> */}
    //         </Tabs>
    //       )}
    //     </div>
    //     <DialogFooter className="flex items-center">
    //       <Button
    //         onClick={() => setOpen(false)}
    //         type="button"
    //         className="bg-default-blue text-white border border-default-blue hover:bg-white hover:text-default-blue min-w-[150px]"
    //       >
    //         Đóng
    //       </Button>
    //     </DialogFooter>
    //   </DialogContent>
    // </Dialog>
    <></>
  );
};

export default CCVDetailModal;
