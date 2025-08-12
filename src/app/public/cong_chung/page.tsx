"use client";

import AutoCompleteSearch from "@/components/common/autoCompleteSearch";
import CommonPagination from "@/components/common/commonPagination";
import CommonTable from "@/components/common/commonTable";
import MapChart from "@/components/common/map";
import ProvinceMap from "@/components/common/provinceMap";
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
import { NOTARY_ORG_STATUS } from "@/constants/congChung";
import { cn, normalizeText } from "@/lib/utils";
import { getListProvinceNew } from "@/service/common";
import {
  getNotaryEmplStatus,
  getNotaryOrgList,
  reportNotaryDashboard,
  searchNotaryEmpl,
} from "@/service/notaryOrg";
import {
  CongChungOrg,
  NotaryEmplItem,
  NotaryOrgParams,
} from "@/types/congChung";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
});

const Dashboard = () => {
  const [searchParam, setSearchParam] = useState<
    NotaryOrgParams & { status?: number }
  >({
    pageNumber: 1,
    numberPerPage: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  const orgQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE],
    queryFn: () => getListProvinceNew(),
    refetchOnWindowFocus: false,
  });

  const statusQuery = useQuery({
    queryKey: [QUERY_KEY.CONG_CHUNG.TRANG_THAI_CCV],
    queryFn: getNotaryEmplStatus,
    refetchOnWindowFocus: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "1",
      org: "",
      status: "",
    },
  });

  const typeValue = form.watch("type");

  const query = useQuery({
    queryKey: [QUERY_KEY.CONG_CHUNG.TO_CHUC, searchParam],
    queryFn: getNotaryOrgList,
    enabled: typeValue === "1" && form.formState.submitCount > 0,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });

  const ccvQuery = useQuery({
    queryKey: [QUERY_KEY.CONG_CHUNG.CONG_CHUNG_VIEN, searchParam],
    queryFn: searchNotaryEmpl,
    enabled: typeValue === "2" && form.formState.submitCount > 0,
    refetchOnWindowFocus: false,
  });

  const { data: dashboardData, isFetching: isDashboardFetching } = useQuery({
    queryKey: [QUERY_KEY.CONG_CHUNG.DASHBOARD, { type: Number(typeValue) }],
    queryFn: reportNotaryDashboard,
    refetchOnWindowFocus: false,
  });

  const columnsOrg: ColumnDef<CongChungOrg>[] = [
    {
      accessorKey: "adminName",
      header: "Tỉnh, Thành phố",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
          {row.original.adminName?.replace("Sở Tư pháp", "")?.trim()}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Tổ chức CCV đang hành nghề",
      cell: ({ row }) => (
        <div className="text-left max-sm:whitespace-nowrap">
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "representative",
      header: "Trưởng PCC, Trưởng VPCC",
      cell: ({ row }) => (
        <div className="text-left">{row.original.officeChiefName || "-"}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Địa chỉ trụ sở tổ chức HNCC",
      cell: ({ row }) => (
        <div className="text-left whitespace-normal min-w-[400px] max-sm:min-w-[200px] line-clamp-3">
          {row.original.address}
        </div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Số điện thoại",
      cell: ({ row }) => (
        <div className="text-left">{row.original.phoneNumber || "-"}</div>
      ),
    },
    {
      accessorKey: "numCCV",
      header: "Số CCV",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {row.original.countNotary || ""}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái hoạt động",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {NOTARY_ORG_STATUS.find(
            (item) => item.value === row.original.statusOrg
          )?.label || "-"}
        </div>
      ),
    },
  ];

  const columnsCCV: ColumnDef<NotaryEmplItem>[] = [
    {
      accessorKey: "ccvName",
      header: "Họ và tên CCV",
      enableHiding: typeValue === "1",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original?.nameNotaryInfo}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Tổ chức CCV đang hành nghề",
      cell: ({ row }) => (
        <div className="text-left max-sm:whitespace-nowrap">
          {row.original.nameOrgNotaryInfo}
        </div>
      ),
    },
    {
      accessorKey: "parentOrg",
      header: "Tỉnh, Thành phố",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.nameAdmin?.replace("Sở Tư pháp", "")?.trim()}
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Địa chỉ trụ sở tổ chức HNCC",
      cell: ({ row }) => (
        <div className="text-left whitespace-normal min-w-[400px] max-sm:min-w-[200px] line-clamp-3">
          {row.original.orgNotaryAddress}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái hoạt động",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {row.original.statusNotaryInfoStr || "-"}
        </div>
      ),
    },
  ];

  const tableOrg = useReactTable({
    data: query.data?.data?.items || [],
    columns: columnsOrg,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: searchParam.numberPerPage || 10,
      },
    },
  });

  const tableCcv = useReactTable({
    data: ccvQuery.data?.data?.items || [],
    columns: columnsCCV,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: searchParam.numberPerPage || 10,
      },
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSearchParam((prev) => ({
      ...prev,
      pageNumber: 1,
      name: values.name,
      orgId: values?.org ? Number(values.org || "0") : undefined,
      ...(typeValue === "1"
        ? { statusOrg: values.status ? Number(values.status) : undefined }
        : { status: values.status ? Number(values.status) : undefined }),
    }));

    setSelectedProvince(
      orgQuery?.data?.find((item) => item.code === values.org)?.name || ""
    );
  };

  const onProvinceClick = (name: string) => {
    const provinceItem = orgQuery?.data?.find((item) =>
      normalizeText(item.name)?.includes(normalizeText(name))
    );

    if (provinceItem) {
      form.setValue("org", provinceItem?.code);
      form.setValue("status", typeValue === "1" ? "0" : "8");
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
            LĨNH VỰC CÔNG CHỨNG CHỨNG THỰC
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
                    <FormLabel>Tên tổ chức / Công chứng viên</FormLabel>
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
                            <SelectItem value="2">Công chứng viên</SelectItem>
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
                                ? NOTARY_ORG_STATUS.map((item) => (
                                    <SelectItem
                                      value={item.value.toString()}
                                      key={item.value}
                                    >
                                      {item.label}
                                    </SelectItem>
                                  ))
                                : statusQuery?.data?.data?.map((item) => (
                                    <SelectItem
                                      value={item.status.toString()}
                                      key={item.status}
                                    >
                                      {item.name}
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
                      data={dashboardData?.data?.dataMap || []}
                      label={
                        typeValue === "1"
                          ? "Số tổ chức hành nghề công chứng"
                          : "Số công chứng viên"
                      }
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0 overflow-x-auto">
                  {typeValue === "1" ? (
                    <CommonTable
                      data={query.data?.data}
                      table={tableOrg}
                      isLoading={orgQuery.isFetching || query.isFetching}
                      showTitleHeader={false}
                    />
                  ) : (
                    <CommonTable
                      data={ccvQuery.data?.data}
                      table={tableCcv}
                      isLoading={orgQuery.isFetching || ccvQuery.isFetching}
                      showTitleHeader={false}
                    />
                  )}

                  <CommonPagination
                    data={
                      typeValue === "1" ? query.data?.data : ccvQuery.data?.data
                    }
                    setSearchParam={setSearchParam}
                    searchParam={searchParam}
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
          {typeValue === "1"
            ? "Bản đồ phân bổ tổ chức hành nghề công chứng đang hoạt động tại Việt Nam"
            : "Bản đồ phân bổ số lượng CCV đang hành nghề tại Việt Nam"}
        </div>
        {isDashboardFetching ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <Loader2 className="text-lg animate-spin" />
          </div>
        ) : (
          <MapChart
            data={
              dashboardData?.data?.dataMap?.filter(
                (item) => item.name !== "Tổng số"
              ) || []
            }
            isLoading={isDashboardFetching}
            legendLabel={
              typeValue === "1"
                ? "Mức độ phân bổ theo số lượng tổ chức công chứng"
                : "Mức độ phân bổ theo số lượng Công chứng viên"
            }
            label={
              typeValue === "1"
                ? "Tổ chức hành nghề công chứng"
                : "Công chứng viên"
            }
            onProvinceClick={onProvinceClick}
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;
