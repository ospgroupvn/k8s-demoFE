"use client";

import AutoCompleteSearch from "@/components/common/autoCompleteSearch";
import CommonPagination from "@/components/common/commonPagination";
import CommonTable from "@/components/common/commonTable";
import MapChart from "@/components/common/map";
import ProvinceMap from "@/components/common/provinceMap";
import DGVDetailModal from "@/components/dau_gia/auctionDgvDetailModal";
import AuctionOrgDetailModal from "@/components/dau_gia/auctionOrgDetailModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUERY_KEY } from "@/constants/common";
import {
  AUCTION_ORG_STATUS,
  AUCTION_ORG_TYPE_PRIVATE,
  CERT_STATUS,
} from "@/constants/dauGia";
import { cn, normalizeText } from "@/lib/utils";
import {
  getAllOrganizationAuctionPublic,
  getAuctionOrgById,
  getDGVById,
  reportAuctionDashboard2,
  searchAuctioneerNew,
} from "@/service/auctionOrg";
import { getListProvinceNew } from "@/service/common";
import {
  AuctioneerItemPrivate,
  AuctioneerParamsPrivate,
  AuctionOrgItemPrivate,
  AuctionOrgParamsPrivate,
} from "@/types/dauGia";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().trim().optional(),
  type: z.string().trim().optional(),
  org: z.string().trim().optional(),
  status: z.string().trim().optional(),
  orgType: z.string().trim().optional(),
});

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [dgvOpen, setDgvOpen] = useState(false);

  const [searchParam, setSearchParam] = useState<AuctioneerParamsPrivate>({
    page: 1,
    size: 10,
  });

  // Use orgParam for organization-related queries
  const [orgParam, setOrgParam] = useState<AuctionOrgParamsPrivate>({
    page: 1,
    size: 10,
  });

  const [enableSearching, setEnableSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  const orgQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE],
    queryFn: () => getListProvinceNew(),
    refetchOnWindowFocus: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "1",
      org: "",
      status: "",
      orgType: "all",
    },
  });

  const typeValue = form.watch("type");

  const query = useQuery({
    queryKey: [QUERY_KEY.DAU_GIA.TO_CHUC, orgParam],
    queryFn: () => getAllOrganizationAuctionPublic(orgParam),
    enabled: enableSearching && typeValue === "1",
    refetchOnWindowFocus: false,
    gcTime: 0,
  });

  const dgvQuery = useQuery({
    queryKey: [QUERY_KEY.DAU_GIA.DAU_GIA_VIEN, searchParam],
    queryFn: () => searchAuctioneerNew(searchParam),
    enabled: enableSearching && typeValue === "2",
    refetchOnWindowFocus: false,
  });

  const { data: dashboardData, isFetching: isDashboardFetching } = useQuery({
    queryKey: [QUERY_KEY.DAU_GIA.DASHBOARD, {}],
    queryFn: reportAuctionDashboard2,
    refetchOnWindowFocus: false,
  });

  const detailQuery = useMutation({
    mutationFn: getAuctionOrgById,
  });

  const detailDgvQuery = useMutation({
    mutationFn: getDGVById,
  });

  const columnsOrg: ColumnDef<AuctionOrgItemPrivate>[] = [
    {
      accessorKey: "provinceName",
      header: "Tỉnh, Thành phố",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.provinceName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "departmentName",
      header: "Phòng/Ban quản lý",
      cell: ({ row }) => (
        <div className="text-left whitespace-nowrap">
          {row.original.departmentName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "fullName",
      header: "Tên tổ chức HNĐG",
      cell: ({ row }) => (
        <div className="text-left min-w-[300px] whitespace-normal line-clamp-3 text-default-blue cursor-pointer">
          {row.original.fullName}
        </div>
      ),
    },
    {
      accessorKey: "managerName",
      header: "Người đại diện Pháp luật",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.managerName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Địa chỉ trụ sở",
      cell: ({ row }) => (
        <div className="text-left min-w-[300px] whitespace-normal line-clamp-3">
          {row.original.address || "-"}
        </div>
      ),
    },
    {
      accessorKey: "auctioneerCount",
      header: "Số ĐGV",
      cell: ({ row }) => <div>{row.original.auctioneerCount ?? "-"}</div>,
    },
    {
      accessorKey: "status",
      header: "Trạng thái hoạt động",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {AUCTION_ORG_STATUS.find((item) => item.value === row.original.status)
            ?.label || "-"}
        </div>
      ),
    },
  ];

  const columnsDGV: ColumnDef<AuctioneerItemPrivate>[] = [
    {
      accessorKey: "fullName",
      header: "Họ và tên ĐGV",
    },
    {
      accessorKey: "dob",
      header: "Ngày sinh",
      cell: ({ row }) => (
        <div className="text-left">
          {row.original.dob
            ? new Date(row.original.dob).toLocaleDateString("vi-VN")
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "organizationName",
      header: "Tên TCĐG đang hành nghề",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max">
          {row.original.organizationName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "organizationAddress",
      header: "Địa chỉ trụ sở nơi hành nghề",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max line-clamp-3">
          {row.original.organizationAddress || "-"}
        </div>
      ),
    },
    {
      accessorKey: "orgProvinceName",
      header: "Tỉnh, Thành phố",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.orgProvinceName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "certCode",
      header: "Số CCHN",
      cell: ({ row }) => <div>{row.original.certCode || "-"}</div>,
    },
    {
      accessorKey: "certStatus",
      header: "Trạng thái hoạt động",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {CERT_STATUS.find((item) => item.value === row.original.certStatus)
            ?.label || "-"}
        </div>
      ),
    },
  ];

  const tableOrg = useReactTable({
    data: query.data?.data || [],
    columns: columnsOrg,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: orgParam.size || 10,
      },
    },
  });

  const tableDgv = useReactTable({
    data: dgvQuery.data?.data || [],
    columns: columnsDGV,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: searchParam.size || 10,
      },
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (typeValue === "1") {
      setOrgParam((prev) => ({
        ...prev,
        page: 1,
        name: values.name,
        "department-code": values?.org || "",
        status: values.status || "",
        types:
          values.orgType && values.orgType !== "all"
            ? [values.orgType]
            : undefined,
      }));
    } else {
      setSearchParam((prev) => ({
        ...prev,
        page: 1,
        name: values.name,
        "org-id": values?.org || "",
        "cert-status": values.status || "",
      }));
    }

    setSelectedProvince(
      orgQuery?.data?.find((item) => item.code === values.org)?.name || ""
    );
    setEnableSearching(true);
  };

  const onProvinceClick = (name: string) => {
    const provinceItem = orgQuery?.data?.find((item) =>
      normalizeText(item.name)?.includes(normalizeText(name))
    );

    if (provinceItem) {
      form.setValue("org", provinceItem?.code);
      form.setValue("status", typeValue === "1" ? "0" : "1");
      setSelectedProvince(name); // Set the selected province
      form.handleSubmit(onSubmit)();

      document
        .getElementById("table")
        ?.parentElement?.scrollIntoView({ block: "start" });
    }
  };

  return (
    <>
      <div
        className={cn(
          "bg-white pt-6 pb-16 px-14 max-sm:px-2 flex flex-col items-center"
        )}
      >
        <Form {...form}>
          <h1 className="text-center font-bold text-4xl text-[#0D3D56]">
            TỔ CHỨC HÀNH NGHỀ ĐẤU GIÁ VÀ ĐẤU GIÁ VIÊN
          </h1>
          <h2 className="text-center font-light text-lg text-[#4A5568] mt-4">
            Hệ thống tra cứu chính thức, cung cấp thông tin minh bạch và chính
            xác từ Cục Bổ trợ tư pháp.
          </h2>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[900px] p-8 bg-white rounded-xl shadow-2xl backdrop-blur-sm my-10 border border-[#E5E7EB]"
          >
            <div
              className={cn("grid grid-cols-6 gap-x-2 gap-y-1 items-center")}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-3">
                    <FormLabel>Tên tổ chức / Đấu giá viên</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập từ khóa để tìm kiếm"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      "flex flex-col items-left col-span-2 max-sm:col-span-3"
                    )}
                  >
                    <FormLabel>Loại hình</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("status", "");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tất cả" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="overflow-y-auto max-h-[200px]">
                            <SelectItem value="1">Tổ chức hành nghề</SelectItem>
                            <SelectItem value="2">Đấu giá viên</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className={cn(
                  "bg-default-blue hover:text-[#057cce] hover:bg-white border border-[#057cce]",
                  "col-span-1 max-sm:col-span-6 self-end"
                )}
              >
                Tìm kiếm
              </Button>
            </div>

            <div
              className="text-xs mt-3 text-default-blue cursor-pointer self-start"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              Công cụ lọc dữ liệu
            </div>

            <div
              className={cn(
                "transition-all duration-300 ease-in-out overflow-hidden",
                showFilters ? "max-h-20 opacity-100 mt-3" : "max-h-0 opacity-0"
              )}
            >
              <div
                className={cn("grid grid-cols-6 gap-x-2 gap-y-1 items-center")}
              >
                <FormField
                  control={form.control}
                  name="org"
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        "flex flex-col items-left",
                        "col-span-2 max-sm:col-span-3"
                      )}
                    >
                      <FormControl>
                        <AutoCompleteSearch
                          displayKey="name"
                          selectPlaceholder="Tỉnh/Thành phố"
                          emptyMsg="Không tìm thấy dữ liệu"
                          onSelect={(value) => {
                            field.onChange(value.code?.toString() || "");
                          }}
                          optionKey="code"
                          options={orgQuery?.data || []}
                          placeholder="Tỉnh/Thành phố"
                          value={field.value || ""}
                          valueKey="code"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {typeValue === "1" ? (
                  <FormField
                    control={form.control}
                    name="orgType"
                    render={({ field }) => (
                      <FormItem
                        className={cn(
                          "flex flex-col items-left",
                          "col-span-1 max-sm:col-span-2"
                        )}
                      >
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Loại hình tổ chức" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup className="overflow-y-auto max-h-[200px]">
                                <SelectItem value="all">Tất cả</SelectItem>
                                {AUCTION_ORG_TYPE_PRIVATE.map((item) => (
                                  <SelectItem
                                    value={item.value.toString()}
                                    key={item.value}
                                  >
                                    {item.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ) : (
                  <></>
                )}

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        "flex flex-col items-left",
                        "col-span-2 max-sm:col-span-3"
                      )}
                    >
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Trạng thái hoạt động" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup className="overflow-y-auto max-h-[200px]">
                              {typeValue === "1"
                                ? AUCTION_ORG_STATUS.map((item) => (
                                    <SelectItem
                                      value={item.value.toString()}
                                      key={item.value}
                                    >
                                      {item.label}
                                    </SelectItem>
                                  ))
                                : CERT_STATUS.map((item) => (
                                    <SelectItem
                                      value={item.value.toString()}
                                      key={item.value}
                                    >
                                      {item.label}
                                    </SelectItem>
                                  ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "border border-default-blue text-default-blue hover:text-default-blue",
                    "col-span-1 max-sm:col-span-6"
                  )}
                  onClick={() => {
                    form.reset();
                    setShowFilters(false);
                    setSelectedProvince(""); // Clear selected province
                  }}
                >
                  Xóa điều kiện
                </Button>
              </div>
            </div>
          </form>
        </Form>

        <div
          className={cn(
            "mt-4 w-full max-w-full",
            form?.formState?.submitCount > 0 ? "block" : "hidden"
          )}
          id="table"
        >
          {form?.formState?.submitCount > 0 ? (
            <>
              <div className="flex gap-4 mb-4 max-w-full">
                {selectedProvince && (
                  <div className="w-80 flex-shrink-0">
                    <ProvinceMap
                      provinceName={selectedProvince}
                      data={
                        dashboardData?.data?.dataMap
                          ? Object.values(dashboardData?.data?.dataMap)?.map(
                              (item: any) => ({
                                name: item?.name,
                                value: item?.value,
                              })
                            )
                          : []
                      }
                      label={
                        typeValue === "1"
                          ? "Số tổ chức hành nghề đấu giá"
                          : "Số đấu giá viên"
                      }
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0 overflow-x-auto">
                  {typeValue === "1" ? (
                    <CommonTable
                      data={{
                        items: query.data?.data || [],
                        numberPerPage: orgParam.size || 10,
                      }}
                      table={tableOrg}
                      isLoading={orgQuery.isFetching || query.isFetching}
                      showTitleHeader={false}
                    />
                  ) : (
                    <CommonTable
                      data={{
                        items: dgvQuery.data?.data || [],
                        numberPerPage: searchParam.size || 10,
                      }}
                      table={tableDgv}
                      isLoading={orgQuery.isFetching || dgvQuery.isFetching}
                      showTitleHeader={false}
                    />
                  )}

                  <CommonPagination
                    data={
                      typeValue === "1"
                        ? {
                            items: query.data?.data || [],
                            numberPerPage: orgParam.size || 10,
                            pageNumber: orgParam.page || 1,
                            pageList: Array.from(
                              { length: query.data?.totalPage || 1 },
                              (_, i) => i + 1
                            ),
                            total: query.data?.totalItem || 0,
                            pageCount: query.data?.totalPage || 0,
                          }
                        : {
                            items: dgvQuery.data?.data || [],
                            numberPerPage: searchParam.size || 10,
                            pageNumber: searchParam.page || 1,
                            pageList: Array.from(
                              { length: dgvQuery.data?.totalPage || 1 },
                              (_, i) => i + 1
                            ),
                            total: dgvQuery.data?.totalItem || 0,
                            pageCount: dgvQuery.data?.totalPage || 0,
                          }
                    }
                    setSearchParam={(value) => {
                      if (typeValue === "1") {
                        setOrgParam((prev) => ({
                          ...prev,
                          ...value,
                          page: value.pageNumber,
                          size: value.numberPerPage,
                        }));
                      } else {
                        setSearchParam((prev) => ({
                          ...prev,
                          ...value,
                          page: value.pageNumber,
                          size: value.numberPerPage,
                        }));
                      }
                    }}
                    searchParam={
                      typeValue === "1"
                        ? {
                            ...orgParam,
                            pageNumber: orgParam.page,
                            numberPerPage: orgParam.size,
                          }
                        : {
                            ...searchParam,
                            pageNumber: searchParam.page,
                            numberPerPage: searchParam.size,
                          }
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div
        className={cn(
          "mt-7 relative w-full min-h-0 bg-white p-4 shadow-lg h-fit",
          form?.formState?.submitCount > 0 ? "hidden" : "block"
        )}
      >
        <div className="mb-4 font-semibold text-center">
          Mức độ phân bố tổ chức đấu giá tài sản đang hoạt động tại Việt Nam
        </div>
        {isDashboardFetching ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <Loader2 className="text-lg animate-spin" />
          </div>
        ) : (
          <MapChart
            data={
              Object.values(dashboardData?.data?.dataMap || {})?.map(
                (item: any) => ({
                  name: item?.name,
                  value: item?.value,
                })
              ) || []
            }
            isLoading={isDashboardFetching}
            legendLabel="Mức độ phân bổ theo số lượng tổ chức đấu giá tài sản"
            label="Tổ chức đấu giá tài sản"
            onProvinceClick={onProvinceClick}
          />
        )}
      </div>

      <AuctionOrgDetailModal
        data={detailQuery?.data?.data}
        open={open}
        setOpen={setOpen}
        isLoading={detailQuery?.isPending}
      />

      <DGVDetailModal
        data={detailDgvQuery?.data?.data}
        open={dgvOpen}
        setOpen={setDgvOpen}
        isLoading={detailDgvQuery?.isPending}
      />
    </>
  );
};

export default Dashboard;
