"use client";

import AutoCompleteSearch from "@/components/common/autoCompleteSearch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DatePickerInput } from "@/components/ui/datepickerinput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QUERY_KEY } from "@/constants/common";
import { getCCVById, getListChief } from "@/service/notaryOrg";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { format, fromUnixTime } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const ChiefSection = () => {
  const form = useFormContext();
  const [searchQuery, setSearchQuery] = useState("");

  const notaryId = useWatch({
    control: form.control,
    name: "notaryIdOfficeChief",
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        QUERY_KEY.CONG_CHUNG.TRUONG_VAN_PHONG,
        "infinite",
        searchQuery,
      ],
      queryFn: ({ pageParam = 0 }) =>
        getListChief({
          pageNo: pageParam,
          pageSize: 10,
          name: searchQuery || undefined, // Add search parameter
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, _, lastPageParam) => {
        const currentPage = lastPageParam || 0;
        const totalPages = lastPage?.totalPage || 1;
        return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
      },
    });

  const handleLazySearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const notaryDetail = useQuery({
    queryKey: [QUERY_KEY.CONG_CHUNG.CONG_CHUNG_VIEN, notaryId],
    queryFn: () => getCCVById(parseInt(notaryId)),
    enabled: !!notaryId,
    refetchOnWindowFocus: false,
  });

  const chiefList = useMemo(() => {
    const list = data?.pages?.flatMap((page) => page?.data || []) || [];

    // If notaryIdOfficeChief exists in form but not in chiefList, add it from notaryDetail
    if (notaryId && notaryDetail.data?.data) {
      const existsInList = list.some(
        (item) => item.id?.toString() === notaryId
      );

      if (!existsInList) {
        const currentNotary = {
          id: notaryDetail.data.data.idNotaryInfo,
          ccv:
            notaryDetail.data.data.notaryRegAndAuctionCardResponse?.numberCad ||
            "",
          name: notaryDetail.data.data.name,
          ...notaryDetail.data.data,
        };
        return [currentNotary, ...list];
      }
    }

    return list;
  }, [data, notaryId, notaryDetail.data]);

  useEffect(() => {
    if (notaryDetail.data) {
      form.reset({
        ...form.getValues(),
        idNo:
          notaryDetail?.data?.data?.notaryRegAndAuctionCardResponse
            ?.numberCad || "",
        chiefName: notaryDetail?.data?.data?.name || "",
        phoneNumber: notaryDetail?.data?.data?.phoneNumber || "",
        birthDay: notaryDetail?.data?.data?.birthDay
          ? format(
              fromUnixTime(Number(notaryDetail?.data?.data?.birthDay) / 1000),
              "dd/MM/yyyy"
            )
          : "",
        sex: notaryDetail?.data?.data?.sexStr || "",
        addressResident: notaryDetail?.data?.data?.addressResident || "",
        idAppoint: notaryDetail?.data?.data?.idAppoint || "",
        genDateAppoint: notaryDetail?.data?.data?.genDateAppoint
          ? format(
              fromUnixTime(
                Number(notaryDetail?.data?.data?.genDateAppoint) / 1000
              ),
              "dd/MM/yyyy"
            )
          : "",
      });
    }
  }, [notaryDetail.data]);

  return (
    <Collapsible defaultOpen className="mb-4 group/collapsible">
      <CollapsibleTrigger className="font-semibold flex items-center justify-between text-default-blue bg-[#F3F3F3] rounded p-2 w-full">
        Thông tin Trưởng văn phòng công chứng
        <ChevronDown
          size={16}
          className="group-data-[state=open]/collapsible:rotate-180 transition-transform"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white">
        <FormField
          control={form.control}
          name="notaryIdOfficeChief"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Số CMND/CCCD/Hộ chiếu</FormLabel>
              <FormControl>
                <AutoCompleteSearch
                  displayKey="cccd"
                  secondDisplayKey="name"
                  emptyMsg="Không tìm thấy CCV"
                  optionKey="id"
                  valueKey="id"
                  placeholder="Tìm kiếm tên CCV"
                  value={field.value || ""}
                  options={chiefList || []}
                  onSelect={(selectedOrg) => {
                    field.onChange(selectedOrg.id?.toString() || "");
                  }}
                  isLoading={isLoading || isFetchingNextPage}
                  onScrollLoad={hasNextPage ? fetchNextPage : undefined}
                  onLazyLoadingSearch={handleLazySearch}
                  selectPlaceholder="Tất cả"
                  defaultSelect={true}
                  triggerClassName="min-w-50"
                  showSearch={true}
                  inputDebounce={300}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số CCV</FormLabel>
              <FormControl>
                <Input placeholder="Nhập Số CCV" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chiefName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input placeholder="Nhập họ và tên" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  {...field}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới tính</FormLabel>
              <FormControl>
                <Input placeholder="Nhập giới tính" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày sinh</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập ngày sinh"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressResident"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Địa chỉ thường trú</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập địa chỉ thường trú"
                  {...field}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idAppoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quyết định bổ nhiệm CCV</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập quyết định bổ nhiệm"
                  {...field}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="genDateAppoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày bổ nhiệm</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập ngày bổ nhiệm"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ChiefSection;
