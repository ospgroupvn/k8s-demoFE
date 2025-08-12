import { QUERY_KEY } from "@/constants/common";
import {
  ACTIVITY_STATUS,
  GPHN_STATUS,
  THE_LS_STATUS,
} from "@/constants/luat_su";
import { cn } from "@/lib/utils";
import { getListNation, getListWard } from "@/service/common";
import {
  addLawyer,
  deleteCard,
  editLawyer,
  getAllAssoc,
  getAllOrg,
  getCardByLawyer,
} from "@/service/lawyer";
import { ProvinceItem } from "@/types/common";
import {
  FullLawyerItem,
  LawyerCardParams,
  LsCardLicenses,
} from "@/types/luatSu";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronUp, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldErrors, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import AutoCompleteSearch from "../common/autoCompleteSearch";
import CommonTable from "../common/commonTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { DatePickerInput } from "../ui/datepickerinput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import LawyerCardModal from "./lawyerCardModal";
import LawyerLicenseModal from "./lawyerLicenseModal";

interface Props {
  isLoading: boolean;
  data?: FullLawyerItem;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  provinces: ProvinceItem[];
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  isAdd: boolean;
  setIsAdd: React.Dispatch<React.SetStateAction<boolean>>;
  isDomestic: number;
  refetch: () => void;
}

const formSchema = z
  .object({
    isDomestic: z.number(),
    provinceId: z.string().trim().optional(),
    wardId: z.string().trim().optional(),
    lawyerAssociationId: z.string().trim().optional(),
    organizationId: z.string().trim().optional(),
    fullName: z.string().trim().min(1, "Vui lòng nhập Họ và tên"),
    dateOfBirth: z.date({ required_error: "Vui lòng chọn ngày sinh" }),
    gender: z.string().trim().min(1, "Vui lòng chọn giới tính"),
    identityCardNumber: z
      .string()
      .trim()
      .optional()
      .refine((val) => !val || /^\d{12}$/.test(val), {
        message: "Số CCCD không hợp lệ",
      }),
    phone: z
      .string()
      .trim()
      .optional()
      .refine((val) => !val || /^0\d{9}$/.test(val), {
        message: "Số điện thoại không hợp lệ",
      }),
    email: z
      .string()
      .trim()
      .optional()
      .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "Email không hợp lệ",
      }),
    address: z.string().trim().optional(),
    activityStatus: z
      .string()
      .trim()
      .min(1, "Vui lòng chọn Tình trạng hành nghề"),
    certificateNumber: z.string().trim().optional(),
    decisionNumber: z.string().trim().optional(),
    issueDate: z.date({ required_error: "Vui lòng chọn ngày cấp" }),
    revokeDecisionNumber: z.string().trim().optional(),
    revokeDate: z.date().optional(),
    note: z.string().trim().optional(),
    nationalityId: z.string().trim().optional(),
  })
  .superRefine((val, ctx) => {
    // Conditional and cross-field validation
    if (val.isDomestic) {
      if (!val.identityCardNumber?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng nhập số CCCD",
          path: ["identityCardNumber"],
        });
      }
      if (!val.address?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng nhập địa chỉ",
          path: ["address"],
        });
      }
      if (!val.certificateNumber?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng nhập số chứng chỉ",
          path: ["certificateNumber"],
        });
      }
      if (!val.provinceId?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn Tỉnh/Thành phố",
          path: ["provinceId"],
        });
      }
      if (!val.wardId?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn Phường/Xã",
          path: ["wardId"],
        });
      }
    } else {
      if (!val.nationalityId?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn quốc tịch",
          path: ["nationalityId"],
        });
      }
      if (!val.certificateNumber?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng nhập Số GPHN",
          path: ["certificateNumber"],
        });
      }
    }
  });

const LawyerDetailModalAdmin = ({
  isLoading,
  data,
  open,
  setOpen,
  provinces,
  isEdit,
  setIsEdit,
  isAdd: isAdd,
  setIsAdd,
  isDomestic,
  refetch,
}: Props) => {
  const [isEditCard, setIsEditCard] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [foreignModalOpen, setForeignModalOpen] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [currentCard, setCurrentCard] = useState<LsCardLicenses | undefined>(
    undefined
  );
  const [searchParams, setSearchParams] = useState<
    LawyerCardParams | undefined
  >(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provinceId: "",
      wardId: "",
      lawyerAssociationId: "",
      organizationId: "",
      fullName: "",
      dateOfBirth: undefined,
      gender: "",
      nationalityId: "",
      phone: "",
      email: "",
      address: "",
      activityStatus: "",
      certificateNumber: "",
      decisionNumber: "",
      issueDate: undefined,
      revokeDecisionNumber: "",
      revokeDate: undefined,
      note: "",
      isDomestic: 1,
      identityCardNumber: "",
    },
  });

  const assocQuery = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.DS_DOAN_LS],
    queryFn: () => getAllAssoc("client"),
    refetchOnWindowFocus: false,
  });

  const orgQuery = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.DS_TO_CHUC],
    queryFn: () => getAllOrg("client"),
    refetchOnWindowFocus: false,
  });

  const nationQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.NATION],
    queryFn: () => getListNation(),
    refetchOnWindowFocus: false,
    enabled: !isDomestic,
  });

  const cardQuery = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.THE_LUAT_SU, searchParams!],
    queryFn: getCardByLawyer,
    enabled: !!searchParams && open,
    refetchOnWindowFocus: false,
  });

  const provinceId = useWatch({
    control: form.control,
    name: "provinceId",
  });

  const wardQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.WARD, "lawyer", provinceId],
    queryFn: () => getListWard(provinceId!),
    refetchOnWindowFocus: false,
    enabled: !!provinceId && open,
  });

  const deleteCardMutation = useMutation({
    mutationFn: deleteCard,
  });

  const editMutation = useMutation({
    mutationFn: editLawyer,
  });

  const addMutation = useMutation({
    mutationFn: addLawyer,
  });

  useEffect(() => {
    if (data && assocQuery?.data?.data && orgQuery?.data?.data && !isAdd) {
      form.reset({
        provinceId: data.provinceId.toString() || "",
        lawyerAssociationId: data?.lawyerAssociationId?.toString() || "",
        organizationId: data?.organizationId?.toString() || "",
        fullName: data.fullName || "",
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data?.gender?.toString() || "",
        nationalityId: data?.nationalityId?.toString() || "",
        phone: data?.phone || "",
        email: data?.email || "",
        address: data?.address || "",
        activityStatus: data?.activityStatus?.toString(),
        certificateNumber: data?.certificateNumber || "",
        decisionNumber: data?.decisionNumber || "",
        issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
        revokeDecisionNumber: data?.revokeDecisionNumber || "",
        revokeDate: data.revokeDate ? new Date(data.revokeDate) : undefined,
        note: "",
        identityCardNumber: data?.identityCardNumber || "",
        isDomestic,
        wardId: data?.wardId?.toString() || "",
      });

      setTimeout(() => {
        form.setValue(
          "lawyerAssociationId",
          data?.lawyerAssociationId?.toString() || ""
        );
        form.setValue("organizationId", data?.organizationId?.toString() || "");
        form.setValue("activityStatus", data.activityStatus?.toString() || "");
        form.setValue("gender", data.gender?.toString() || "");
        form.setValue("nationalityId", data?.nationalityId?.toString() || "");
        form.setValue("isDomestic", isDomestic);
      }, 0);

      setSearchParams({
        idLaw: data.lawyerId,
        isDomestic: isDomestic,
      });
    } else {
      form.setValue("isDomestic", isDomestic);
    }
  }, [
    assocQuery?.data?.data,
    data,
    form,
    isDomestic,
    orgQuery?.data?.data,
    isAdd,
  ]);

  const columns: ColumnDef<LsCardLicenses>[] = [
    {
      accessorKey: "licenseNumber",
      header: "Số thẻ Luật sư",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.licenseNumber || "-"}
        </div>
      ),
    },
    {
      accessorKey: "issueDate",
      header: "Ngày cấp",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.issueDate
            ? format(row.original.issueDate, "dd/MM/yyyy")
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {THE_LS_STATUS.find((item) => item.value === row.original.status)
            ?.label || "-"}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Chức năng",
      enableHiding: !isEdit,
      cell: ({ row }) => {
        return row.index === 0 && row.original.status === 25 ? (
          <div className="flex space-x-2 items-center justify-center">
            <Button
              onClick={() => {
                setCurrentCard(row.original);
                setIsEditCard(true);
                setModalOpen(true);
              }}
              className="bg-default-blue hover:bg-white hover:text-default-blue border-default-blue border"
            >
              Sửa
            </Button>
            <AlertDialog
              open={isShowConfirmModal}
              onOpenChange={setIsShowConfirmModal}
            >
              <AlertDialogTrigger asChild>
                <Button className="bg-default-blue hover:bg-white hover:text-default-blue border-default-blue border">
                  Xóa
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa thẻ luật sư</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa thẻ{" "}
                    <strong>{row.original?.licenseNumber}?</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(event) => {
                      event.preventDefault();
                      handleDeleteCard(row.original.licenseId);
                    }}
                    className="bg-default-blue hover:bg-white hover:text-default-blue border-default-blue border"
                    disabled={deleteCardMutation.isPending}
                  >
                    {deleteCardMutation.isPending && (
                      <Loader2 className="animate-spin mr-2" />
                    )}
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <></>
        );
      },
    },
  ];

  const foreignColumn: ColumnDef<LsCardLicenses>[] = [
    {
      accessorKey: "countChanges",
      header: "Lần gia hạn/thu hồi",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.countChange ? `Lần ${row.original.countChange}` : "-"}
        </div>
      ),
    },
    {
      accessorKey: "issueDate",
      header: "Ngày gia hạn/thu hồi",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.issueDate
            ? format(row.original.issueDate, "dd/MM/yyyy")
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Loại",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {GPHN_STATUS.find((item) => item.value === row.original.status)
            ?.label || "-"}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: cardQuery?.data?.data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });

  const foreignTable = useReactTable({
    data: cardQuery?.data?.data || [],
    columns: foreignColumn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEdit && !isAdd && !data) {
      return;
    }

    const submitData: Partial<FullLawyerItem> = {
      provinceId: Number(values.provinceId),
      wardId: Number(values.wardId),
      lawyerAssociationId: values.lawyerAssociationId
        ? Number(values.lawyerAssociationId)
        : undefined,
      organizationId: values.organizationId
        ? Number(values.organizationId)
        : undefined,
      fullName: values.fullName,
      dateOfBirth: values.dateOfBirth?.toISOString(),
      gender: Number(values.gender),
      nationalityId: values.nationalityId,
      phone: values.phone,
      identityCardNumber: values.identityCardNumber,
      email: values.email,
      address: values.address,
      activityStatus: Number(values.activityStatus),
      certificateNumber: values.certificateNumber,
      decisionNumber: values?.decisionNumber,
      issueDate: values.issueDate?.toISOString() || undefined,
      revokeDecisionNumber: values.revokeDecisionNumber,
      note: values.note,
      isDomestic,
    };

    if (
      isEdit &&
      !isAdd &&
      (cardQuery?.data?.data?.[0]?.status === 26 ||
        !cardQuery?.data?.data?.length)
    ) {
      toast.error("Vui lòng thêm mới Thông tin thẻ luật sư");
      return;
    }

    if (!isAdd && data) {
      editMutation.mutate(
        { ...data, ...submitData },
        {
          onSuccess: () => {
            toast.success("Cập nhật thông tin luật sư thành công!");
            refetch();
            form.clearErrors();
            onOpenChange(false);
            form.reset();
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message ||
                "Cập nhật thông tin luật sư thất bại!"
            );
          },
        }
      );
    } else {
      addMutation.mutate(submitData, {
        onSuccess: () => {
          toast.success("Thêm mới luật sư thành công!");
          refetch();
          form.clearErrors();
          onOpenChange(false);
          form.reset();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Thêm mới luật sư thất bại!"
          );
        },
      });
    }
  };

  const onSubmitError = (errors: FieldErrors<z.infer<typeof formSchema>>) => {
    console.log(errors);
  };

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setIsEdit(false);
      setIsAdd?.(false);
      form.clearErrors();
      form.reset();
    }
    setOpen(isOpen);
  };

  const handleDeleteCard = (id: number) => {
    if (id) {
      deleteCardMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Xóa thông tin thẻ thành công!");
          cardQuery.refetch();
          setIsShowConfirmModal(false);
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Xóa thông tin thẻ thất bại!"
          );
        },
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => onOpenChange(isOpen)}>
        <DialogContent className="min-w-[1200px] max-h-[90vh] max-sm:p-2 z-50 flex flex-col pb-4 max-sm:min-w-0 max-sm:max-w-full">
          <DialogHeader className="border-b border-b-[#EBEBF0] pb-4 -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
            <DialogTitle className="font-bold">
              THÔNG TIN CHI TIẾT LUẬT SƯ{" "}
              {isDomestic ? "TRONG NƯỚC" : "NƯỚC NGOÀI"}
            </DialogTitle>
            <DialogDescription>
              <VisuallyHidden>Chi tiết luật sư</VisuallyHidden>
            </DialogDescription>
          </DialogHeader>
          <div className="h-full overflow-y-auto -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
            {isLoading ? (
              <div className="w-full flex items-center justify-center h-[250px]">
                <Loader2 className="animate-spin h-6 w-6" />
              </div>
            ) : (
              <section className="mb-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit, onSubmitError)}>
                    <p className="mb-3 font-bold text-default-blue">
                      THÔNG TIN CHUNG
                    </p>
                    <section className="grid grid-cols-4 gap-x-2 gap-y-1 items-start">
                      {isDomestic ? (
                        <>
                          <FormField
                            control={form.control}
                            name="lawyerAssociationId"
                            render={({ field }) => (
                              <FormItem className="flex flex-col items-left mb-1 col-span-2">
                                <FormLabel className="font-bold">
                                  Đoàn Luật sư
                                </FormLabel>
                                {isEdit ? (
                                  <FormControl>
                                    <AutoCompleteSearch
                                      displayKey="assocName"
                                      selectPlaceholder="Chọn Đoàn Luật sư"
                                      emptyMsg="Không tìm thấy dữ liệu"
                                      onSelect={(value) => {
                                        field.onChange(
                                          value.assocId?.toString() || ""
                                        );
                                      }}
                                      optionKey="assocId"
                                      options={assocQuery?.data?.data || []}
                                      placeholder="Tìm kiếm theo tên Đoàn Luật sư"
                                      value={field.value || ""}
                                      valueKey="assocId"
                                      disabled={!isEdit}
                                      modal
                                    />
                                  </FormControl>
                                ) : (
                                  <p className="mt-2 text-sm">
                                    {data?.assocName || "-"}
                                  </p>
                                )}
                              </FormItem>
                            )}
                          />
                        </>
                      ) : (
                        <></>
                      )}

                      <FormField
                        control={form.control}
                        name="organizationId"
                        render={({ field }) => (
                          <FormItem
                            className={cn(
                              "flex flex-col items-left mb-1 col-span-2 max-sm:col-span-4",
                              isDomestic
                                ? "col-span-2 max-sm:col-span-4"
                                : "col-span-1 max-sm:col-span-2"
                            )}
                          >
                            <FormLabel className="font-bold">
                              Nơi làm việc/hành nghề
                            </FormLabel>
                            {isEdit ? (
                              <FormControl>
                                <AutoCompleteSearch
                                  displayKey="orgName"
                                  selectPlaceholder="Chọn nơi làm việc/hành nghề"
                                  emptyMsg="Không tìm thấy dữ liệu"
                                  onSelect={(value) => {
                                    field.onChange(value.id?.toString() || "");
                                  }}
                                  optionKey="id"
                                  options={orgQuery?.data?.data || []}
                                  placeholder="Tìm kiếm theo tên nơi làm việc/hành nghề"
                                  value={field.value || ""}
                                  valueKey="id"
                                  disabled={!isEdit}
                                  modal
                                />
                              </FormControl>
                            ) : (
                              <p className="mt-1">{data?.orgName || "-"}</p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                            <FormLabel className="font-bold">
                              Họ và tên{" "}
                              <span
                                className={cn(
                                  "text-red-500",
                                  isEdit ? "visible" : "invisible"
                                )}
                              >
                                *
                              </span>
                            </FormLabel>
                            {isEdit ? (
                              <FormControl>
                                <Input
                                  placeholder="Họ và tên"
                                  {...field}
                                  disabled={!isEdit}
                                />
                              </FormControl>
                            ) : (
                              <p className="mt-2 text-sm">
                                {data?.fullName || "-"}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                            <FormLabel className="font-bold">
                              Ngày sinh{" "}
                              <span
                                className={cn(
                                  "text-red-500",
                                  isEdit ? "visible" : "invisible"
                                )}
                              >
                                *
                              </span>
                            </FormLabel>
                            {isEdit ? (
                              <FormControl>
                                <DatePickerInput
                                  placeholder="Ngày sinh"
                                  value={field.value}
                                  onSelect={field.onChange}
                                  disabledDate={(date) => date > new Date()}
                                  disabled={!isEdit}
                                />
                              </FormControl>
                            ) : (
                              <p className="mt-2 text-sm">
                                {data?.dateOfBirth
                                  ? format(data?.dateOfBirth, "dd/MM/yyyy")
                                  : "-"}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                            <FormLabel className="font-bold">
                              Giới tính{" "}
                              <span
                                className={cn(
                                  "text-red-500",
                                  isEdit ? "visible" : "invisible"
                                )}
                              >
                                *
                              </span>
                            </FormLabel>
                            {isEdit ? (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={!isEdit}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Giới tính" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup className="overflow-y-auto max-h-[200px]">
                                    <SelectItem value="1" key={1}>
                                      Nam
                                    </SelectItem>
                                    <SelectItem value="2" key={2}>
                                      Nữ
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            ) : (
                              <p className="mt-2 text-sm">
                                {data?.gender === 1 ? "Nam" : "Nữ"}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {isDomestic ? (
                        <FormField
                          control={form.control}
                          name="identityCardNumber"
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                              <FormLabel className="font-bold">
                                Số CCCD{" "}
                                <span
                                  className={cn(
                                    "text-red-500",
                                    isEdit ? "visible" : "invisible"
                                  )}
                                >
                                  *
                                </span>
                              </FormLabel>
                              {isEdit ? (
                                <FormControl>
                                  <Input
                                    {...field}
                                    onKeyUp={(e) =>
                                      form.setValue(
                                        "identityCardNumber",
                                        e.currentTarget.value?.replace(
                                          /[^0-9.]/g,
                                          ""
                                        )
                                      )
                                    }
                                    maxLength={12}
                                    placeholder="Số CCCD"
                                    type="text"
                                    disabled={!isEdit}
                                  />
                                </FormControl>
                              ) : (
                                <p className="mt-2 text-sm">
                                  {data?.identityCardNumber || "-"}
                                </p>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <FormField
                          control={form.control}
                          name="nationalityId"
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                              <FormLabel className="font-bold">
                                Quốc tịch{" "}
                                <span
                                  className={cn(
                                    "text-red-500",
                                    isEdit && isDomestic
                                      ? "visible"
                                      : "invisible"
                                  )}
                                >
                                  *
                                </span>
                              </FormLabel>
                              {isEdit ? (
                                <FormControl>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={!isEdit}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Quốc tịch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup className="overflow-y-auto max-h-[200px]">
                                        {(nationQuery?.data?.data || []).map(
                                          (item) => (
                                            <SelectItem
                                              value={item.nationalityId.toString()}
                                              key={item.nationalityId}
                                            >
                                              {item.nationalityName}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                              ) : (
                                <p className="mt-2 text-sm">
                                  {data?.nationalityName || "-"}
                                </p>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                            <FormLabel className="font-bold">
                              Số điện thoại{" "}
                            </FormLabel>
                            {isEdit ? (
                              <FormControl>
                                <Input
                                  placeholder="Số điện thoại"
                                  {...field}
                                  disabled={!isEdit}
                                  onKeyUp={(e) =>
                                    form.setValue(
                                      "phone",
                                      e.currentTarget.value?.replace(
                                        /[^0-9.]/g,
                                        ""
                                      )
                                    )
                                  }
                                  maxLength={10}
                                />
                              </FormControl>
                            ) : (
                              <p className="mt-2 text-sm">
                                {data?.phone || "-"}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {isDomestic ? (
                        <>
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                                <FormLabel className="font-bold">
                                  Email{" "}
                                  {/* <span
                                    className={cn(
                                      "text-red-500",
                                      isEdit ? "visible" : "invisible"
                                    )}
                                  >
                                    *
                                  </span> */}
                                </FormLabel>
                                {isEdit ? (
                                  <FormControl>
                                    <Input
                                      placeholder="Email"
                                      {...field}
                                      disabled={!isEdit}
                                    />
                                  </FormControl>
                                ) : (
                                  <p className="mt-2 text-sm">
                                    {data?.email || "-"}
                                  </p>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      ) : (
                        <>
                          <FormField
                            control={form.control}
                            name="certificateNumber"
                            render={({ field }) => (
                              <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                                <FormLabel className="font-bold">
                                  Số GPHN{" "}
                                  <span
                                    className={cn(
                                      "text-red-500",
                                      isEdit && isDomestic
                                        ? "visible"
                                        : "invisible"
                                    )}
                                  >
                                    *
                                  </span>
                                </FormLabel>
                                {isEdit ? (
                                  <FormControl>
                                    <Input
                                      placeholder="Số GPHN"
                                      {...field}
                                      disabled={!isEdit}
                                    />
                                  </FormControl>
                                ) : (
                                  <p className="mt-2 text-sm">
                                    {data?.certificateNumber || "-"}
                                  </p>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="issueDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                                <FormLabel className="font-bold">
                                  Ngày cấp GPHN{" "}
                                  <span
                                    className={cn(
                                      "text-red-500",
                                      isEdit ? "visible" : "invisible"
                                    )}
                                  >
                                    *
                                  </span>
                                </FormLabel>
                                {isEdit ? (
                                  <FormControl>
                                    <DatePickerInput
                                      placeholder="Ngày cấp"
                                      value={field.value}
                                      onSelect={field.onChange}
                                      disabledDate={(date) => date > new Date()}
                                      disabled={!isEdit}
                                    />
                                  </FormControl>
                                ) : (
                                  <p className="mt-2 text-sm">
                                    {data?.issueDate
                                      ? format(data.issueDate, "dd/MM/yyyy")
                                      : "-"}
                                  </p>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      <FormField
                        control={form.control}
                        name="activityStatus"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-left mb-1 col-span-2 max-sm:col-span-4">
                            <FormLabel className="font-bold">
                              Tình trạng hành nghề{" "}
                              <span
                                className={cn(
                                  "text-red-500",
                                  isEdit ? "visible" : "invisible"
                                )}
                              >
                                *
                              </span>
                            </FormLabel>
                            {isEdit ? (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={!isEdit}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Trạng thái hành nghề" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup className="overflow-y-auto max-h-[200px]">
                                    {ACTIVITY_STATUS.map((item) => (
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
                            ) : (
                              <p className="mt-2 text-sm">
                                {ACTIVITY_STATUS.find(
                                  (item) => item.value === data?.activityStatus
                                )?.label || "-"}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="provinceId"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                            <FormLabel className="font-bold">
                              Tỉnh/Thành phố{" "}
                              <span
                                className={cn(
                                  "text-red-500",
                                  isEdit && isDomestic ? "visible" : "invisible"
                                )}
                              >
                                *
                              </span>
                            </FormLabel>
                            {isEdit ? (
                              <FormControl>
                                <AutoCompleteSearch
                                  displayKey="name"
                                  selectPlaceholder="Chọn Tỉnh/Thành phố"
                                  emptyMsg="Không tìm thấy dữ liệu"
                                  onSelect={(value) => {
                                    form.setValue("wardId", "");
                                    field.onChange(value.id?.toString() || "");
                                  }}
                                  optionKey="id"
                                  options={provinces}
                                  placeholder="Tìm kiếm theo tên Tỉnh/Thành phố"
                                  value={field.value || ""}
                                  valueKey="id"
                                  disabled={!isEdit}
                                  modal
                                />
                              </FormControl>
                            ) : (
                              <p className="mt-2 text-sm">
                                {data?.provinceName || "-"}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="wardId"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                            <FormLabel className="font-bold">
                              Phường/Xã{" "}
                              <span
                                className={cn(
                                  "text-red-500",
                                  isEdit && isDomestic ? "visible" : "invisible"
                                )}
                              >
                                *
                              </span>
                            </FormLabel>
                            {isEdit ? (
                              <FormControl>
                                <AutoCompleteSearch
                                  displayKey="name"
                                  selectPlaceholder="Chọn Phường/Xã"
                                  emptyMsg="Không tìm thấy dữ liệu"
                                  onSelect={(value) => {
                                    field.onChange(value.id?.toString() || "");
                                  }}
                                  optionKey="id"
                                  options={wardQuery?.data?.data || []}
                                  placeholder="Tìm kiếm theo tên Phường/Xã"
                                  value={field.value || ""}
                                  valueKey="id"
                                  disabled={!isEdit}
                                  modal
                                />
                              </FormControl>
                            ) : (
                              <p className="mt-2 text-sm">
                                {data?.wardName || "-"}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem
                            className="flex flex-col items-left mb-1 col-span-2 max-sm:col-span-4"
                            hidden={!isDomestic}
                          >
                            <FormLabel className="font-bold">
                              Địa chỉ thường trú{" "}
                              <span
                                className={cn(
                                  "text-red-500",
                                  isEdit ? "visible" : "invisible"
                                )}
                              >
                                *
                              </span>
                            </FormLabel>
                            {isEdit ? (
                              <FormControl>
                                <Input
                                  placeholder="Địa chỉ thường trú"
                                  {...field}
                                  disabled={!isEdit}
                                />
                              </FormControl>
                            ) : (
                              <p className="mt-2 text-sm">
                                {[
                                  data?.address,
                                  data?.wardName,
                                  data?.provinceName,
                                ]
                                  ?.filter((item) => item)
                                  ?.join(", ") || "-"}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </section>
                    {isDomestic ? (
                      <>
                        <Collapsible className="my-6" defaultOpen={true}>
                          <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold text-default-blue">
                            CHỨNG CHỈ HÀNH NGHỀ LUẬT SƯ
                            <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2">
                            <section className="grid grid-cols-4 gap-x-2 gap-y-1 items-start">
                              <FormField
                                control={form.control}
                                name="certificateNumber"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col items-left mb-1 col-span-2 max-sm:col-span-4">
                                    <FormLabel className="font-bold">
                                      Số chứng chỉ hành nghề luật sư{" "}
                                      <span
                                        className={cn(
                                          "text-red-500",
                                          isEdit ? "visible" : "invisible"
                                        )}
                                      >
                                        *
                                      </span>
                                    </FormLabel>
                                    {isEdit ? (
                                      <FormControl>
                                        <Input
                                          placeholder="Số chứng chỉ hành nghề luật sư"
                                          {...field}
                                          disabled={!isEdit}
                                        />
                                      </FormControl>
                                    ) : (
                                      <p className="mt-2 text-sm">
                                        {data?.certificateNumber || "-"}
                                      </p>
                                    )}
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="decisionNumber"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                                    <FormLabel className="font-bold">
                                      Quyết định
                                    </FormLabel>
                                    {isEdit ? (
                                      <FormControl>
                                        <Input
                                          placeholder="Quyết định"
                                          {...field}
                                          disabled={!isEdit}
                                        />
                                      </FormControl>
                                    ) : (
                                      <p className="mt-2 text-sm">
                                        {data?.decisionNumber || "-"}
                                      </p>
                                    )}
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="issueDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                                    <FormLabel className="font-bold">
                                      Ngày cấp{" "}
                                      <span
                                        className={cn(
                                          "text-red-500",
                                          isEdit ? "visible" : "invisible"
                                        )}
                                      >
                                        *
                                      </span>
                                    </FormLabel>
                                    {isEdit ? (
                                      <FormControl>
                                        <DatePickerInput
                                          placeholder="Ngày cấp"
                                          value={field.value}
                                          onSelect={field.onChange}
                                          disabledDate={(date) =>
                                            date > new Date()
                                          }
                                          disabled={!isEdit}
                                        />
                                      </FormControl>
                                    ) : (
                                      <p className="mt-2 text-sm">
                                        {data?.issueDate
                                          ? format(data.issueDate, "dd/MM/yyyy")
                                          : "-"}
                                      </p>
                                    )}
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="revokeDecisionNumber"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col items-left mb-1 col-span-2 max-sm:col-span-4">
                                    <FormLabel className="font-bold">
                                      Số quyết định thu hồi
                                    </FormLabel>
                                    {isEdit ? (
                                      <FormControl>
                                        <Input
                                          placeholder="Số quyết định thu hồi"
                                          {...field}
                                          disabled={!isEdit}
                                        />
                                      </FormControl>
                                    ) : (
                                      <p className="mt-2 text-sm">
                                        {data?.revokeDecisionNumber || "-"}
                                      </p>
                                    )}
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="revokeDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col items-left mb-1 col-span-2 max-sm:col-span-4">
                                    <FormLabel className="font-bold">
                                      Ngày thu hồi
                                    </FormLabel>
                                    {isEdit ? (
                                      <FormControl>
                                        <DatePickerInput
                                          placeholder="Ngày thu hồi"
                                          value={field.value}
                                          onSelect={field.onChange}
                                          disabledDate={(date) =>
                                            date > new Date()
                                          }
                                          disabled={!isEdit}
                                        />
                                      </FormControl>
                                    ) : (
                                      <p className="mt-2 text-sm">
                                        {data?.revokeDate
                                          ? format(
                                              data.revokeDate,
                                              "dd/MM/yyyy"
                                            )
                                          : "-"}
                                      </p>
                                    )}
                                  </FormItem>
                                )}
                              />
                            </section>
                          </CollapsibleContent>
                        </Collapsible>

                        {!isAdd && (
                          <Collapsible className="my-6" defaultOpen={true}>
                            <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold text-default-blue">
                              THÔNG TIN THẺ LUẬT SƯ
                              <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2">
                              <CommonTable
                                data={{
                                  items: cardQuery?.data?.data || [],
                                  numberPerPage: 100,
                                  pageCount: 1,
                                  pageList: [],
                                }}
                                table={table}
                                isLoading={isLoading}
                                showTitleHeader={false}
                              />

                              {isEdit &&
                              (!cardQuery?.data?.data?.length ||
                                cardQuery?.data?.data?.[0]?.status === 26) ? (
                                <div
                                  className="mt-2 text-default-blue text-sm font-bold cursor-pointer"
                                  onClick={() => {
                                    setCurrentCard(undefined);
                                    setIsEditCard(false);
                                    setModalOpen(true);
                                  }}
                                >
                                  + Thêm mới
                                </div>
                              ) : (
                                <></>
                              )}
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </>
                    ) : (
                      <>
                        {!isAdd && (
                          <Collapsible className="my-6" defaultOpen={true}>
                            <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold text-default-blue">
                              GIA HẠN THU HỒI GIẤY PHÉP HÀNH NGHỀ
                              <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2">
                              <CommonTable
                                data={{
                                  items: cardQuery?.data?.data || [],
                                  numberPerPage: 100,
                                  pageCount: 1,
                                  pageList: [],
                                }}
                                table={foreignTable}
                                isLoading={isLoading}
                                showTitleHeader={false}
                              />

                              {isEdit && (
                                <div
                                  className="mt-2 text-default-blue text-sm font-bold cursor-pointer"
                                  onClick={() => {
                                    setForeignModalOpen(true);
                                  }}
                                >
                                  + Thêm mới
                                </div>
                              )}
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </>
                    )}
                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-left my-4">
                          <FormLabel className="font-bold">Ghi chú</FormLabel>
                          {isEdit ? (
                            <FormControl>
                              <Input
                                placeholder="Ghi chú"
                                {...field}
                                disabled={!isEdit}
                              />
                            </FormControl>
                          ) : (
                            <p className="mt-2 text-sm">-</p>
                          )}
                        </FormItem>
                      )}
                    />{" "}
                    <div className="flex justify-center items-center space-x-2">
                      {isEdit ? (
                        <Button
                          type="submit"
                          className="border border-default-blue bg-default-blue text-white hover:bg-white hover:text-default-blue"
                          disabled={editMutation.isPending}
                        >
                          {editMutation.isPending ? (
                            <Loader2 className="animate-spin mr-2" />
                          ) : (
                            <></>
                          )}
                          Lưu
                        </Button>
                      ) : (
                        <></>
                      )}
                      <Button
                        type="button"
                        className="border border-[#C3ECF5] bg-white text-default-blue hover:bg-[#C3ECF5]"
                        onClick={() => {
                          form.clearErrors();
                          onOpenChange(false);
                          form.reset();
                        }}
                        disabled={editMutation.isPending}
                      >
                        Đóng
                      </Button>
                    </div>
                  </form>
                </Form>
              </section>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {modalOpen && (
        <LawyerCardModal
          data={currentCard}
          open={modalOpen}
          setOpen={setModalOpen}
          isEdit={isEditCard}
          refetch={cardQuery.refetch}
          lawyerData={data}
        />
      )}
      {foreignModalOpen && (
        <LawyerLicenseModal
          data={cardQuery?.data?.data?.[0]}
          open={foreignModalOpen}
          setOpen={setForeignModalOpen}
          refetch={cardQuery.refetch}
          lawyerData={data}
        />
      )}
    </>
  );
};

export default LawyerDetailModalAdmin;
