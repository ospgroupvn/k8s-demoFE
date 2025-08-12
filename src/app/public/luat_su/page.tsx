"use client";

import AutoCompleteSearch from "@/components/common/autoCompleteSearch";
import CommonPagination from "@/components/common/commonPagination";
import CommonTable from "@/components/common/commonTable";
import MapChart from "@/components/common/map";
import ProvinceMap from "@/components/common/provinceMap";
import LawyerOrgDetailModal from "@/components/luat_su/lawyerOrgDetailModal";
import LawyerDetailModal from "@/components/luat_su/laywerDetailModal";
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
import { ACTIVITY_STATUS, LAWYER_STATUS } from "@/constants/luat_su";
import { cn, normalizeText } from "@/lib/utils";
import { getListProvinceNew } from "@/service/common";
import {
  getLawyerById,
  getLawyerOrgById,
  lawyerDashboard,
  lawyerOrgDashboard,
  searchLawyer,
  searchLawyerOrg,
} from "@/service/lawyer";
import { LawyerItem, LawyerOrgItem, LawyerParams } from "@/types/luatSu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().trim().optional(),
  type: z.string().trim().optional(),
  isDomestic: z.string().trim().optional(),
  org: z.string().trim().optional(),
  status: z.string().trim().optional(),
});

const Dashboard = () => {
  const [searchParam, setSearchParam] = useState<LawyerParams>({
    pageNumber: 1,
    numberPerPage: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [lsOpen, setLsOpen] = useState<boolean>(false);
  const [orgOpen, setOrgOpen] = useState<boolean>(false);
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
      isDomestic: "1",
      org: "",
      status: "",
    },
  });

  const typeValue = form.watch("type");

  const query = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.TO_CHUC, searchParam],
    queryFn: searchLawyerOrg,
    enabled: typeValue === "1" && form.formState.submitCount > 0,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });

  const lsQuery = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.LUAT_SU, searchParam],
    queryFn: searchLawyer,
    enabled: typeValue === "2" && form.formState.submitCount > 0,
    refetchOnWindowFocus: false,
  });

  const detailLsQuery = useMutation({
    mutationFn: getLawyerById,
  });

  const detailOrgQuery = useMutation({
    mutationFn: getLawyerOrgById,
  });

  const { data: dashboardDataLs, isFetching: isDashboardLsFetching } = useQuery(
    {
      queryKey: [QUERY_KEY.LUAT_SU.DASHBOARD_LUAT_SU, {}],
      queryFn: lawyerDashboard,
      refetchOnWindowFocus: false,
    }
  );

  const { data: dashboardDataOrg, isFetching: isDashboardOrgFetching } =
    useQuery({
      queryKey: [QUERY_KEY.LUAT_SU.DASHBOARD_TO_CHUC, {}],
      queryFn: lawyerOrgDashboard,
      refetchOnWindowFocus: false,
    });

  const mapData = useMemo(() => {
    return (
      (typeValue === "1"
        ? dashboardDataOrg?.data.dataMap
        : dashboardDataLs?.data.dataMap) || []
    );
  }, [
    dashboardDataLs?.data.dataMap,
    dashboardDataOrg?.data.dataMap,
    typeValue,
  ]);

  const columnsOrg: ColumnDef<LawyerOrgItem>[] = [
    {
      accessorKey: "province",
      header: "Tỉnh/Thành phố",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
          {row.original.provinceName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Tên tổ chức hành nghề",
      cell: ({ row }) => (
        <div
          className="text-left text-default-blue max-sm:max-w-[100px] max-sm:w-max cursor-pointer"
          onClick={() => {
            detailOrgQuery.mutate(row.original.id);
            setOrgOpen(true);
          }}
        >
          {row.original.orgName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "national",
      header: "Quốc gia/Vùng lãnh thổ",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
          {row.original.nationalName || "-"}
        </div>
      ),
      enableHiding: form.watch("isDomestic") === "1",
    },
    {
      accessorKey: "registrationLicenseNumber",
      header: "Số giấy phép ĐKHĐ",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {row.original.registrationLicenseNumber || "-"}
        </div>
      ),
      enableHiding: form.watch("isDomestic") === "0",
    },
    {
      accessorKey: "address",
      header: "Địa chỉ trụ sở",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
          {row.original.address || "-"}
        </div>
      ),
    },
    {
      accessorKey: "businessLicenseNumber",
      header: "Số GPTL",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {row.original.businessLicenseNumber || "-"}
        </div>
      ),
      enableHiding: form.watch("isDomestic") === "1",
    },
    {
      accessorKey: "registrationLicenseNumberForeign",
      header: "Số giấy phép ĐKHĐ",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {row.original.registrationLicenseNumber || "-"}
        </div>
      ),
      enableHiding: form.watch("isDomestic") === "1",
    },
    {
      accessorKey: "representative",
      header:
        form.watch("isDomestic") === "1"
          ? "Người đại diện theo pháp luật"
          : "Giám đốc/Trưởng chi nhánh",
      cell: ({ row }) => (
        <div className="text-left">
          {row.original.lawyerLegalRepresentativeName || "-"}
        </div>
      ),
    },

    {
      accessorKey: "status",
      header: "Trạng thái hoạt động",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {LAWYER_STATUS.find((item) => item.value === row.original.status)
            ?.label || "-"}
        </div>
      ),
    },
  ];

  const columnsLS: ColumnDef<LawyerItem>[] = [
    {
      accessorKey: "name",
      header: "Nơi làm việc/nơi hành nghề",
      cell: ({ row }) => (
        <div className="text-left max-sm:whitespace-nowrap">
          {row.original.organizationName || "-"}
        </div>
      ),
      enableHiding: typeValue === "1" || form.watch("isDomestic") === "0",
    },
    {
      accessorKey: "lsName",
      header: "Họ tên",
      enableHiding: typeValue === "1",
      cell: ({ row }) => (
        <div
          className="text-left text-default-blue max-sm:max-w-[250px] max-sm:w-max cursor-pointer min-w-[100px]"
          onClick={() => {
            detailLsQuery.mutate(row.original.id);
            setLsOpen(true);
          }}
        >
          {row.original.fullName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "national",
      header: "Quốc tịch",
      cell: ({ row }) => (
        <div className="text-left max-sm:whitespace-nowrap">
          {row.original.nationalName || "-"}
        </div>
      ),
      enableHiding: typeValue === "1" || form.watch("isDomestic") === "1",
    },
    {
      accessorKey: "dob",
      header: "Ngày sinh",
      enableHiding: typeValue === "1" || form.watch("isDomestic") === "0",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original?.dateOfBirth
            ? format(row.original.dateOfBirth, "dd/MM/yyyy")
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "licenseNum",
      header: form.watch("isDomestic") === "1" ? "Số CCHN" : "Số GPHN",
      enableHiding: typeValue === "1",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original?.licenseCCHNNumber || "-"}
        </div>
      ),
    },
    {
      accessorKey: "issueDate",
      header: "Ngày cấp",
      enableHiding: typeValue === "1" || form.watch("isDomestic") === "1",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original?.issueDate
            ? format(row.original.issueDate, "dd/MM/yyyy")
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "cardNum",
      header: "Số thẻ Luật sư",
      enableHiding: typeValue === "1" || form.watch("isDomestic") === "0",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.licenseLSNumber || "-"}
        </div>
      ),
    },
    // {
    //   accessorKey: "address",
    //   header: "Địa chỉ nơi hành nghề",
    //   enableHiding: typeValue === "1" || form.watch("isDomestic") === "0",
    //   cell: ({ row }) => (
    //     <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
    //       {row.original?.address || "-"}
    //     </div>
    //   ),
    // },
    {
      accessorKey: "nameForeign",
      header: "Nơi hành nghề",
      cell: ({ row }) => (
        <div className="text-left max-sm:whitespace-nowrap">
          {row.original.organizationName || "-"}
        </div>
      ),
      enableHiding: typeValue === "1" || form.watch("isDomestic") === "1",
    },
    {
      accessorKey: "status",
      header: "Tình trạng hành nghề",
      enableHiding: typeValue === "1",
      cell: ({ row }) => (
        <div className="whitespace-nowrap max-w-[200px]">
          {ACTIVITY_STATUS.find(
            (item) => item.value === row.original.activityStatus
          )?.label || "-"}
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

  const tableLs = useReactTable({
    data: lsQuery.data?.data?.items || [],
    columns: columnsLS,
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
      ...(typeValue === "1"
        ? { orgName: values.name }
        : { fullName: values.name }),
      provinceId: values?.org ? Number(values.org || "0") : undefined,
      listStatus: values.status ? [Number(values.status)] : [],
      listIsDomestic: values.isDomestic ? [Number(values.isDomestic)] : [],
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
      form.setValue("org", provinceItem?.id?.toString());
      form.setValue("status", typeValue === "1" ? "1" : "4");
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
            TỔ CHỨC HÀNH NGHỀ LUẬT SƯ VÀ LUẬT SƯ
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
                  <FormItem className="flex flex-col items-left col-span-3 max-sm:col-span-6">
                    <FormLabel>Tên tổ chức / Luật sư</FormLabel>
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
                      "flex flex-col items-left col-span-1 max-sm:col-span-3"
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
                            <SelectItem value="2">Luật sư</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isDomestic"
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      "flex flex-col items-left col-span-1 max-sm:col-span-3"
                    )}
                  >
                    <FormLabel>Phạm vi</FormLabel>
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
                            <SelectItem value="1">Trong nước</SelectItem>
                            <SelectItem value="0">Nước ngoài</SelectItem>
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
                            field.onChange(value.id?.toString() || "");
                          }}
                          optionKey="id"
                          options={orgQuery?.data || []}
                          placeholder="Tỉnh/Thành phố"
                          value={field.value || ""}
                          valueKey="id"
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
                            {typeValue === "1" ? (
                              <SelectGroup className="overflow-y-auto max-h-[200px]">
                                <SelectItem value="1" key={1}>
                                  Đang hoạt động
                                </SelectItem>
                                <SelectItem value="0" key={0}>
                                  Dừng hoạt động
                                </SelectItem>
                              </SelectGroup>
                            ) : (
                              <SelectGroup className="overflow-y-auto max-h-[200px]">
                                <SelectItem value="4" key={4}>
                                  Đang hành nghề
                                </SelectItem>
                                <SelectItem value="6" key={6}>
                                  Đã thu hồi giấy phép
                                </SelectItem>
                              </SelectGroup>
                            )}
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
                        mapData?.filter((item) => item.name !== "Tổng số") || []
                      }
                      label={
                        typeValue === "1"
                          ? "Số tổ chức hành nghề luật sư"
                          : "Số luật sư"
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
                      data={lsQuery.data?.data}
                      table={tableLs}
                      isLoading={orgQuery.isFetching || lsQuery.isFetching}
                      showTitleHeader={false}
                    />
                  )}

                  <CommonPagination
                    data={
                      typeValue === "1" ? query.data?.data : lsQuery.data?.data
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
            ? "Bản đồ phân bổ tổ chức hành nghề Luật sư tại Việt Nam"
            : "Bản đồ phân bổ số lượng Luật sư tại Việt Nam"}
        </div>
        {(typeValue === "1" && isDashboardOrgFetching) ||
        (typeValue === "2" && isDashboardLsFetching) ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <Loader2 className="text-lg animate-spin" />
          </div>
        ) : (
          <MapChart
            data={mapData?.filter((item) => item.name !== "Tổng số") || []}
            isLoading={
              typeValue === "1" ? isDashboardOrgFetching : isDashboardLsFetching
            }
            legendLabel={
              typeValue === "1"
                ? "Mức độ phân bổ theo số lượng tổ chức hành nghề Luật sư"
                : "Mức độ phân bổ theo số lượng Luật sư"
            }
            label={typeValue === "1" ? "Tổ chức hành nghề luật sư" : "Luật sư"}
            onProvinceClick={onProvinceClick}
          />
        )}
      </div>

      <LawyerDetailModal
        data={detailLsQuery?.data?.data}
        open={lsOpen}
        setOpen={setLsOpen}
        isLoading={detailLsQuery?.isPending}
      />

      <LawyerOrgDetailModal
        data={detailOrgQuery?.data?.data}
        open={orgOpen}
        setOpen={setOrgOpen}
        isLoading={detailOrgQuery?.isPending}
        provinces={orgQuery.data || []}
      />
    </>
  );
};

export default Dashboard;
