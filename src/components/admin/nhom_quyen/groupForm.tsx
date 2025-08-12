"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PAGE_NUMBER,
  QUERY_KEY,
  USER_TYPE,
  USER_TYPE_LIST,
} from "@/constants/common";
import {
  addGroup,
  editGroup,
  getDetailGroup,
  getListAuthoritySearch,
  getListAuthParent,
} from "@/service/admin";
import { GroupDataAdd } from "@/types/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  QueryFunctionContext,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import DivAuthority from "./divAuthority";

const GroupAddForm = () => {
  const params = useParams();
  const router = useRouter();
  const isEditForm = params?.id ? true : false;
  const [checked, setChecked] = useState<boolean>(false);
  const [authParentAll, setAuthParentAll] = useState<any[]>([]); // list tất cả nhóm quyền cha
  const [selectedItemsCMS, setSelectedItemsCMS] = useState<any[]>([]);
  const [authParentListCMS, setAuthParentListCMS] = useState<any[]>([]);
  const [authListAllCMS, setAuthListAllCMS] = useState<any[]>([]);
  const [detailGroup, setDetailGroup] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChangeType, setIsChangeType] = useState<boolean>(false);

  const formSchema = z.object({
    groupName: z.string().trim().min(1, "Vui lòng nhập tên nhóm quyền!"),
    type: !checked
      ? z.string().optional()
      : z.string().min(1, "Vui lòng chọn loại người dùng!"),
    description: z.string().optional(),
  });

  const groupAddForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
      type: "",
      description: "",
    },
  });

  const typeValue = useWatch({
    control: groupAddForm.control,
    name: "type",
  });

  useEffect(() => {
    if (!detailGroup?.id) {
      setSelectedItemsCMS([]);
      groupAddForm.setValue("type", "");
    } else {
      groupAddForm.setValue("type", detailGroup?.type?.toString());
    }
  }, [detailGroup?.id, detailGroup?.type, groupAddForm]);

  // set check quyền theo detail
  useEffect(() => {
    if (isChangeType) {
      if (!detailGroup?.id) {
        setSelectedItemsCMS([]);
      } else {
        if (
          typeValue === detailGroup?.type?.toString() ||
          (detailGroup?.type === null && typeValue === "")
        ) {
          const currentAuthority = detailGroup?.listAuthority?.split(",");
          setSelectedItemsCMS(
            authListAllCMS?.filter(
              (item) =>
                currentAuthority?.includes(item?.id?.toString()) && !item.isApp
            ) || []
          );
        } else {
          setSelectedItemsCMS([]);
        }
      }
    }
  }, [
    authListAllCMS,
    detailGroup?.id,
    detailGroup?.listAuthority,
    detailGroup?.type,
    isChangeType,
    typeValue,
  ]);

  const getListAuthParentQuery = useQuery({
    queryKey: [QUERY_KEY.ADMIN.LIST_AUTH_PARENT, { type: typeValue }],
    queryFn: getListAuthParent,
    retry: 3,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (getListAuthParentQuery.isSuccess) {
      setAuthParentAll(getListAuthParentQuery?.data || []);
      setAuthParentListCMS(
        getListAuthParentQuery?.data?.map((item) => ({ ...item, isOpen: true }))
      );
    }
  }, [getListAuthParentQuery?.data, getListAuthParentQuery.isSuccess]);

  const getListAuthoritySearchQuery = useQuery({
    queryKey: [
      QUERY_KEY.ADMIN.LIST_AUTH,
      {
        pageNumber: PAGE_NUMBER,
        numberPerPage: 15000,
        type: typeValue,
      },
    ],
    queryFn: async () => {
      try {
        const res = await getListAuthoritySearch({
          pageNumber: PAGE_NUMBER,
          numberPerPage: 15000,
          type: typeValue,
        });

        const newArr = res?.data?.items.filter(
          (item) =>
            item?.fid === 0 ||
            authParentAll?.find((itemFind) => itemFind.id === item.fid)
        );
        setAuthListAllCMS(newArr || []);
        return res;
      } catch (err: any) {
        console.error(err);
        return null;
      }
    },
    retry: 3,
    enabled: authParentAll?.length > 0,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });

  const getDetailGroupQuery = useQuery({
    queryKey: [QUERY_KEY.ADMIN.GROUP_DETAIL, { id: params?.id || "0" }],
    queryFn: async (
      query: QueryFunctionContext<[string, { id: string | string[] }]>
    ) => {
      try {
        const res = await getDetailGroup(query);
        setDetailGroup(res?.data?.item);
        groupAddForm.setValue("groupName", res.data?.item?.groupName || "");

        groupAddForm.setValue("type", res.data?.item?.type?.toString());

        groupAddForm.setValue("description", res.data?.item?.description || "");
        setChecked(!!res.data?.item?.isDefault);

        const currentAuthority = res.data?.item?.listAuthority?.split(",");
        setSelectedItemsCMS(
          authListAllCMS?.filter(
            (item) =>
              currentAuthority?.includes(item?.id?.toString()) && !item.isApp
          ) || []
        );
        return res;
      } catch (err: any) {
        toast.error(
          err?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
          {
            richColors: true,
            position: "top-right",
          }
        );

        return null;
      }
    },
    enabled: isEditForm && authListAllCMS?.length > 0,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });

  const { mutate: doAddGroup } = useMutation({
    mutationFn: addGroup,
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
        {
          richColors: true,
          position: "top-right",
        }
      );
      toast.error(
        err?.response?.data?.message ||
          "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
      );
      setIsLoading(false);
    },
    onSuccess: (response) => {
      if (response?.success) {
        toast.success("Thêm nhóm quyền thành công!");
        setIsLoading(false);
        router.push("/admin/nhom_quyen");
      } else {
        toast.error(
          response?.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        );
        setIsLoading(false);
      }
    },
  });

  const { mutate: doEditGroup } = useMutation({
    mutationFn: editGroup,
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
      );
      setIsLoading(false);
    },
    onSuccess: (response) => {
      if (response?.success) {
        toast.success("Cập nhật nhóm quyền thành công");
        setIsLoading(false);
        router.push("/admin/nhom_quyen");
      } else {
        toast.error(
          response?.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        );
        setIsLoading(false);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (selectedItemsCMS?.length === 0) {
      return;
    }

    setIsLoading(true);

    const dataSubmit: GroupDataAdd = {
      description: values?.description || "",
      groupName: values?.groupName || "",
      isDefault: checked ? 1 : 0,
      type: values?.type ? parseInt(values?.type) : USER_TYPE.ADMIN,
      listAuthority: selectedItemsCMS?.map((item) => item.id).join(","),
    };

    if (isEditForm) {
      doEditGroup({
        ...detailGroup,
        ...dataSubmit,
      });
    } else {
      doAddGroup({
        ...dataSubmit,
      });
    }
  };

  const onFail = (values: any) => {
    console.log("fields error", values);
  };

  return (
    <>
      {isEditForm &&
      (getDetailGroupQuery.isFetching ||
        getListAuthParentQuery.isFetching ||
        getListAuthoritySearchQuery.isFetching) ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      ) : (
        <Card className="rounded border border-[#e8e8e8]">
          <CardContent className="rounded bg-white p-6">
            <Form {...groupAddForm}>
              <form
                onSubmit={groupAddForm.handleSubmit(onSubmit, onFail)}
                className="grid grid-cols-2 gap-x-6 gap-y-1"
              >
                <FormField
                  control={groupAddForm.control}
                  name="groupName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-left mb-4  col-span-2 lg:col-span-1">
                      <FormLabel className="font-bold">
                        Tên nhóm quyền <span className="text-red-500"> *</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          maxLength={255}
                          placeholder={"Nhập tên nhóm quyền"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={groupAddForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-left mb-4 col-span-2 lg:col-span-1">
                      <FormLabel className="font-bold">
                        Loại người dùng{" "}
                        {checked ? (
                          <span className="text-red-500"> *</span>
                        ) : (
                          <></>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setIsChangeType(true);
                          }}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={"Lựa chọn"} />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {USER_TYPE_LIST.map((item) => (
                              <SelectItem
                                key={item?.value}
                                value={item?.value.toString()}
                              >
                                {item?.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={groupAddForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-left mb-4 col-span-2 lg:col-span-1 ">
                      <FormLabel className="font-bold">Mô tả</FormLabel>
                      <FormControl>
                        <Input
                          maxLength={255}
                          placeholder={"Nhập mô tả"}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex items-center space-x-2 mb-4 lg:mb-0 col-span-2 lg:col-span-1">
                  <Checkbox
                    id={"checkDefault"}
                    checked={checked}
                    onCheckedChange={(value) => setChecked(!!value)}
                    aria-label="checkDefault"
                  />
                  <Label
                    htmlFor="checkDefault"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Mặc định
                  </Label>
                </div>

                {/* Quyền trên CMS */}
                <div className="flex justify-start w-full h-full col-span-2 lg:col-span-1">
                  <DivAuthority
                    title="Danh sách quyền"
                    setSelectedItems={setSelectedItemsCMS}
                    selectedItems={selectedItemsCMS}
                    authListAll={authListAllCMS}
                    authParentList={authParentListCMS}
                    setAuthParentList={setAuthParentListCMS}
                    isLoading={
                      getListAuthParentQuery.isFetching ||
                      getListAuthoritySearchQuery.isFetching
                    }
                  />
                </div>

                <div className="col-span-2 text-center items-center flex justify-center mt-4 gap-x-4">
                  <Link href={"/admin/nhom_quyen"}>
                    <Button type="button" onClick={groupAddForm.reset}>
                      Hủy
                    </Button>
                  </Link>

                  <Button type="submit">
                    {isLoading ? (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <></>
                    )}
                    {isEditForm ? "Cập nhật" : "Thêm mới"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default GroupAddForm;
