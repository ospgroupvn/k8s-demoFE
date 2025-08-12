"use client";

import AutoCompleteSearch from "@/components/common/autoCompleteSearch";
import CommonPagination from "@/components/common/commonPagination";
import CommonTable from "@/components/common/commonTable";
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
import { QUERY_KEY, USER_TYPE } from "@/constants/common";
import { NOTARY_ORG_STATUS } from "@/constants/congChung";
import { getListDepartment } from "@/service/common";
import {
  getAdministrationByType,
  getListNotaryAdministration,
  getNotaryOrgListPrivate,
} from "@/service/notaryOrg";
import { CongChungOrg, NotaryOrgParams } from "@/types/congChung";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().trim().optional(),
  orgId: z.string().trim().optional(),
  statusOrg: z.string().trim().optional(),
});

const Organization = () => {
  const [searchParam, setSearchParam] = useState<NotaryOrgParams>({
    pageNumber: 1,
    numberPerPage: 10,
  });
  const session = useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      orgId: "",
      statusOrg: "",
    },
  });

  const orgQuery = useQuery({
    queryKey: [QUERY_KEY.DAU_GIA.SO_TU_PHAP],
    queryFn: () => getListNotaryAdministration(2),
    refetchOnWindowFocus: false,
  });

  const query = useQuery({
    queryKey: [QUERY_KEY.CONG_CHUNG.TO_CHUC, searchParam],
    queryFn: () => getNotaryOrgListPrivate(searchParam),
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  // const chartQuery = useQuery({
  //   queryKey: [
  //     QUERY_KEY.CONG_CHUNG.BAO_CAO_TO_CHUC_QUAN,
  //     { cityCode: searchParam?.orgId?.toString() || "" },
  //   ],
  //   queryFn: reportNotaryOrgByDistrict,
  //   enabled:
  //     session.data?.user?.type !== USER_TYPE.SO_TU_PHAP && !!searchParam?.orgId,
  //   refetchOnWindowFocus: false,
  // });

  // const chartConfig = {
  //   value: {
  //     label: "Số lượng tổ chức công chứng",
  //     color: "#37b1cb",
  //   },
  // } satisfies ChartConfig;

  useEffect(() => {
    if (query?.data?.data?.items && form?.formState?.submitCount > 1) {
      document
        .getElementById("table")
        ?.parentElement?.scrollIntoView({ behavior: "smooth" });
    }
  }, [form?.formState?.submitCount, query?.data?.data?.items]);

  // useEffect(() => {
  //   if (urlSearchParams.get("province") && orgQuery?.data?.data?.length) {
  //     const provinceName = urlSearchParams.get("province") || "";
  //     const provinceItem = orgQuery?.data?.data?.find((item) =>
  //       normalizeText(item.fullName)
  //         ?.replaceAll(/[^a-zA-Z0-9\s]/g, "")
  //         ?.includes(
  //           normalizeText(provinceName)?.replaceAll(/[^a-zA-Z0-9\s]/g, "")
  //         )
  //     );

  //     if (provinceItem) {
  //       form.setValue("org", provinceItem.cityCode);
  //       setSearchParam((prev) => ({
  //         ...prev,
  //         orgId: provinceItem?.cityCode
  //           ? Number(provinceItem.cityCode)
  //           : undefined,
  //         statusOrg: 0,
  //       }));
  //     }
  //   }
  // }, [orgQuery?.data?.data, form, urlSearchParams]);

  const columns: ColumnDef<CongChungOrg>[] = [
    {
      accessorKey: "name",
      header: "Tên tổ chức công chứng",
      cell: ({ row }) => (
        <div className="text-left max-sm:whitespace-nowrap text-default-blue cursor-pointer">
          <Link href={`/cong_chung/to_chuc/${row.original.idOrgNotaryInfo}`}>
            {row.original.name}
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "parentOrg",
      header: "Sở Tư pháp",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.adminName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "representative",
      header: "Trưởng văn phòng/Trưởng đại diện",
      cell: ({ row }) => (
        <div className="text-left">{row.original.officeChiefName || "-"}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Địa chỉ trụ sở tổ chức HNCC",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
          {row.original.address}
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

  const table = useReactTable({
    manualPagination: true,
    data: query.data?.data?.items || [],
    columns: columns,
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
      orgId: values.orgId ? Number(values.orgId) : undefined,
      statusOrg: values.statusOrg ? Number(values.statusOrg) : undefined,
    }));
  };

  return (
    <>
      <h1 className="text-lg font-bold mb-6">
        DANH SÁCH TỔ CHỨC HÀNH NGHỀ CÔNG CHỨNG
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-3 gap-x-8 gap-y-1 items-center bg-white p-4 rounded-lg shadow-sm"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                <FormLabel className="font-bold">
                  Tổ chức hành nghề công chứng
                </FormLabel>
                <FormControl>
                  <Input placeholder="Tìm kiếm tổ chức HNCC" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {session.data?.user?.type !== USER_TYPE.SO_TU_PHAP ? (
            <FormField
              control={form.control}
              name="orgId"
              render={({ field }) => (
                <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                  <FormLabel className="font-bold">Sở Tư pháp</FormLabel>
                  <FormControl>
                    <AutoCompleteSearch
                      disabled={
                        session.data?.user?.type === USER_TYPE.SO_TU_PHAP
                      }
                      displayKey="fullName"
                      selectPlaceholder="Tất cả"
                      emptyMsg="Không tìm thấy dữ liệu"
                      onSelect={(value) => {
                        field.onChange(value?.id?.toString() || "");
                      }}
                      optionKey="id"
                      options={orgQuery?.data?.data || []}
                      placeholder="Tìm kiếm theo tên Sở tư pháp"
                      value={field.value || ""}
                      valueKey="id"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ) : (
            <></>
          )}

          <FormField
            control={form.control}
            name="statusOrg"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                <FormLabel className="font-bold">
                  Trạng thái hoạt động
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    if (value === "all") {
                      field.onChange("");
                      return;
                    }
                    field.onChange(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup className="overflow-y-auto max-h-[200px]">
                      <SelectItem value="all">Tất cả</SelectItem>
                      {NOTARY_ORG_STATUS.map((item) => (
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
              </FormItem>
            )}
          />

          <div className="flex flex-col col-span-3">
            <div className="flex justify-center space-x-4 w-full">
              <Button
                type="button"
                variant="outline"
                className="w-[136px] border border-[#222222]"
                onClick={() => {
                  form.reset();
                  form.handleSubmit(onSubmit)();
                }}
              >
                Xóa điều kiện
              </Button>
              <Button
                type="submit"
                className="w-[136px] bg-default-blue text-white"
              >
                Tìm kiếm
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <div className="mt-4 bg-white p-4 rounded-lg shadow-sm" id="table">
        <CommonTable
          data={query.data?.data}
          table={table}
          isLoading={orgQuery.isFetching || query.isFetching}
          actions={[
            <Button
              key="add"
              className="bg-default-blue hover:bg-default-blue/80"
              onClick={() => router.push("/cong_chung/to_chuc/them_moi")}
            >
              + Thêm mới
            </Button>,
          ]}
        />

        <CommonPagination
          data={query.data?.data}
          setSearchParam={setSearchParam}
          searchParam={searchParam}
        />
      </div>

      {/* {chartQuery?.data?.data?.length ? (
        <div className="p-1 pt-2 bg-white">
          <p className="font-bold mb-2">
            Biểu đồ phân bố số lượng tổ chức hành nghề công chứng trên các quận,
            huyện tại {currentProvinceName}
          </p>
          <div className="overflow-x-auto">
            <ChartContainer
              config={chartConfig}
              className="min-h-[300px] max-h-[500px] min-w-full"
              style={{
                width: (chartQuery?.data?.data?.length || 0) * 20,
              }}
            >
              <BarChart
                accessibilityLayer
                data={chartQuery?.data?.data?.map((item) => ({
                  ...item,
                  value: Number(item.value || "0"),
                }))}
                margin={{
                  right: 80,
                  bottom: 100,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickFormatter={(value) => {
                    if (value.length > 30) {
                      return `${value.substring(0, 30)}...`;
                    }

                    return value;
                  }}
                  angle={45}
                  textAnchor="start"
                  interval={0}
                />
                <YAxis domain={[0, "dataMax + 5"]} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                {Object.keys(chartConfig).map((key) => (
                  <Bar barSize={10} key={key} dataKey={key} fill={"#37b1cb"} />
                ))}
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      ) : (
        <></>
      )} */}

      {/* <OrgDetailModal
        data={detailQuery?.data?.data}
        open={open}
        setOpen={setOpen}
        isLoading={detailQuery.isPending}
      /> */}
    </>
  );
};

export default Organization;
