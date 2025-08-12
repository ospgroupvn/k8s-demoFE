import { QUERY_KEY } from "@/constants/common";
import {
  ACTIVITY_STATUS,
  LAWYER_STATUS,
  PRACTICE_FORM,
  TYPE_ORG_CHANGE,
} from "@/constants/luat_su";
import { cn } from "@/lib/utils";
import { getListNation, getListWard } from "@/service/common";
import {
  addLawyerOrg,
  deleteBranch,
  deleteContentChange,
  editLawyer,
  getAllAssoc,
  getAllLawyersUnique,
  getLawyerByIdPrivate,
  getLawyerInOrg,
} from "@/service/lawyer";
import { ProvinceItem } from "@/types/common";
import {
  FullLawyerOrgItem,
  LawyerOrgBranchDetail,
  OrgChangeItem,
  OrgLawyerItem,
  OrgLawyerParams,
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
import LawyerOrgBranchModal from "./lawyerOrgBranchModal";
import LawyerOrgContentChangeModal from "./lawyerOrgContentChangeModal";

interface Props {
  isLoading: boolean;
  data?: FullLawyerOrgItem;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  provinces: ProvinceItem[];
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  isAdd: boolean;
  setIsAdd: React.Dispatch<React.SetStateAction<boolean>>;
  isDomestic: number;
  refetch: () => void;
  refetchList: () => void;
}

const formSchema = z
  .object({
    provinceId: z.string().trim().min(1, "Vui lòng chọn Tỉnh/Thành phố"),
    wardId: z.string().trim().optional(),
    lawyerAssociationId: z.string().trim().optional(),
    orgType: z.string().trim().min(1, "Vui lòng chọn Loại tổ chức"),
    orgName: z.string().trim().min(1, "Vui lòng nhập Tên tổ chức"),
    phone: z
      .string()
      .trim()
      .min(10, "Số điện thoại không hợp lệ")
      .max(11, "Số điện thoại không hợp lệ")
      .regex(/^\d{10,11}$/, "Số điện thoại không hợp lệ"),
    // email: z.string().trim().email("Email không đúng định dạng"),
    email: z
      .string()
      .trim()
      .optional()
      .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "Email không đúng định dạng",
      }),
    address: z.string().trim().min(1, "Vui lòng nhập Địa chỉ"),
    businessLicenseNumber: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập Số giấy phép"),
    businessLicenseIssueDate: z
      .date({ required_error: "Vui lòng chọn Ngày cấp ĐKHĐ" })
      .optional(),
    status: z.string().trim().min(1, "Vui lòng chọn trạng thái"),
    representativeId: z.string().trim().optional(),
    dateOfBirth: z.date().optional(),
    licenseNumber: z.string().trim().optional(),
    cardNumber: z.string().trim().optional(),
    note: z.string().trim().optional(),
    isDomestic: z.number(),
    registrationLicenseNumber: z.string().optional(),
    registrationLicenseIssueDate: z.date().optional(),
    nationalityId: z.string().trim().optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.businessLicenseIssueDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn Ngày cấp ĐKHĐ",
        path: ["businessLicenseIssueDate"],
      });
    }

    if (val.isDomestic) {
      if (!val.lawyerAssociationId?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn Đoàn luật sư",
          path: ["lawyerAssociationId"],
        });
      }
      if (!val.representativeId?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn Người đại diện",
          path: ["representativeId"],
        });
      }
    } else {
      if (!val.nationalityId?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn Quốc gia",
          path: ["nationalityId"],
        });
      }
      if (!val.registrationLicenseIssueDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn Ngày cấp GPTL",
          path: ["registrationLicenseIssueDate"],
        });
      }
      if (!val.registrationLicenseNumber?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng nhập Số GPTL",
          path: ["registrationLicenseNumber"],
        });
      }
      if (!val.representativeId?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn Giám đốc/Trưởng chi nhánh",
          path: ["representativeId"],
        });
      }
    }
  });

const defaultValues: z.infer<typeof formSchema> = {
  provinceId: "",
  wardId: "",
  lawyerAssociationId: "",
  orgType: "",
  phone: "",
  email: "",
  address: "",
  orgName: "",
  businessLicenseNumber: "",
  businessLicenseIssueDate: undefined,
  status: "",
  representativeId: "",
  dateOfBirth: undefined,
  licenseNumber: "",
  cardNumber: "",
  note: "",
  isDomestic: 1,
  registrationLicenseIssueDate: undefined,
  registrationLicenseNumber: "",
  nationalityId: "",
};

const LawyerOrgDetailModalAdmin = ({
  isLoading,
  data,
  open,
  setOpen,
  provinces,
  isEdit,
  setIsEdit,
  isAdd,
  setIsAdd,
  isDomestic,
  refetch,
  refetchList,
}: Props) => {
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [isShowConfirmContentModal, setIsShowConfirmContentModal] =
    useState(false);
  const [isEditContent, setIsEditContent] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditBranch, setIsEditBranch] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<
    LawyerOrgBranchDetail | undefined
  >(undefined);
  const [currentContentChange, setCurrentContentChange] = useState<
    OrgChangeItem | undefined
  >(undefined);
  const [lawyerSearchParams, setLawyerSearchParams] = useState<OrgLawyerParams>(
    {
      pageNumber: 1,
      numberPerPage: 100,
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const assocQuery = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.DS_DOAN_LS],
    queryFn: () => getAllAssoc("client"),
    refetchOnWindowFocus: false,
  });

  const representativeListQuery = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.DS_DAI_DIEN],
    queryFn: () => getAllLawyersUnique(),
    refetchOnWindowFocus: false,
    enabled: open && isAdd,
  });

  const representativeDetailQuery = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.LUAT_SU, data?.lawyerLegalRepresentativeId],
    queryFn: () =>
      getLawyerByIdPrivate(data?.lawyerLegalRepresentativeId || -1),
    refetchOnWindowFocus: false,
    enabled: open && !isAdd && !!data?.lawyerLegalRepresentativeId,
  });

  const orgLawyerQuery = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.DS_LUAT_SU_THUOC_TO_CHUC, lawyerSearchParams],
    queryFn: getLawyerInOrg,
    refetchOnWindowFocus: false,
    enabled: !!lawyerSearchParams?.organizationId,
  });

  const nationQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.NATION],
    queryFn: () => getListNation(),
    refetchOnWindowFocus: false,
    enabled: !isDomestic,
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

  const addMutation = useMutation({
    mutationFn: addLawyerOrg,
  });

  const editMutation = useMutation({
    mutationFn: editLawyer,
  });

  const deleteBranchMutation = useMutation({
    mutationFn: deleteBranch,
  });

  const deleteContentChangeMutation = useMutation({
    mutationFn: deleteContentChange,
  });

  useEffect(() => {
    if (data && assocQuery?.data?.data && !isAdd) {
      form.reset({
        provinceId: data.provinceId.toString() || "",
        lawyerAssociationId: data?.lawyerAssociationId?.toString() || "",
        orgType: data.orgType?.toString() || "",
        phone: data?.phone || "",
        email: data?.email || "",
        address: data?.address || "",
        orgName: data?.orgName || "",
        businessLicenseNumber: data?.businessLicenseNumber || "",
        businessLicenseIssueDate: data?.businessLicenseIssueDate
          ? new Date(data?.businessLicenseIssueDate)
          : undefined,
        status: data?.status?.toString() || "",
        representativeId: data?.lawyerLegalRepresentativeId?.toString() || "",
        registrationLicenseIssueDate: data?.registrationLicenseIssueDate
          ? new Date(data?.registrationLicenseIssueDate)
          : undefined,
        registrationLicenseNumber: data?.registrationLicenseNumber || "",
        nationalityId: data?.nationalityId?.toString() || "",
        wardId: data?.wardId?.toString() || "",
      });

      setTimeout(() => {
        form.setValue(
          "lawyerAssociationId",
          data?.lawyerAssociationId?.toString() || ""
        );
        form.setValue("orgType", data?.orgType?.toString() || "");
        form.setValue("status", data?.status?.toString() || "");
        form.setValue("nationalityId", data?.nationalityId?.toString() || "");
      }, 0);

      setLawyerSearchParams((prev) => {
        return { ...prev, organizationId: data?.orgId, isDominic: isDomestic };
      });
    } else {
      form.reset(defaultValues);
      form.setValue("isDomestic", isDomestic);
    }
  }, [assocQuery?.data?.data, data, form, isAdd, isDomestic, isEdit]);

  const columns: ColumnDef<OrgChangeItem>[] = [
    {
      accessorKey: "vbChange",
      header: isDomestic ? "Văn bản thay đổi" : "Văn bản chấp thuận",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.vbChange || "-"}
        </div>
      ),
    },
    {
      accessorKey: "dateChange",
      header: isDomestic ? "Ngày thay đổi" : "Ngày cấp",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.dateChange
            ? format(row.original.dateChange, "dd/MM/yyyy")
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Loại",
      enableHiding: !!isDomestic,
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {TYPE_ORG_CHANGE.find(
            (item) => item.value === row.original.typeChange
          )?.label || "-"}
        </div>
      ),
    },
    {
      accessorKey: "contentChange",
      header: "Nội dung thay đổi",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.contentChange || "-"}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Chức năng",
      enableHiding: !isEdit,
      cell: ({ row }) => (
        <div className="flex space-x-2 items-center justify-center">
          <Button
            onClick={() => {
              setCurrentContentChange(row.original);
              setIsEditContent(true);
              setModalOpen(true);
            }}
            className="bg-default-blue hover:bg-white hover:text-default-blue border-default-blue border"
          >
            Sửa
          </Button>

          <AlertDialog
            open={isShowConfirmContentModal}
            onOpenChange={setIsShowConfirmContentModal}
          >
            <AlertDialogTrigger asChild>
              <Button className="bg-default-blue hover:bg-white hover:text-default-blue border-default-blue border">
                Xóa
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa thông tin</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa thông tin đăng ký thay đổi văn bản{" "}
                  <strong>{row.original?.vbChange}?</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    event.preventDefault();
                    handleDeleteContentChange(row.original.id);
                  }}
                  className="bg-default-blue hover:bg-white hover:text-default-blue border-default-blue border"
                  disabled={deleteBranchMutation.isPending}
                >
                  {deleteBranchMutation.isPending && (
                    <Loader2 className="animate-spin mr-2" />
                  )}
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  const lawyerColumns: ColumnDef<OrgLawyerItem>[] = [
    {
      accessorKey: "fullName",
      header: "Họ tên",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.fullName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "dob",
      header: "Ngày sinh",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.dob ? format(row.original.dob, "dd/MM/yyyy") : "-"}
        </div>
      ),
    },
    {
      accessorKey: "cchnnumer",
      header: "Số CCHN/Số giấy phép",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.cchnnumber || row.original.gphnnumber || "-"}
        </div>
      ),
    },
    {
      accessorKey: "typeWork",
      header: "Hình thức hành nghề",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {PRACTICE_FORM.find((item) => item.value === row.original.typeWork)
            ?.label || "-"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Tình trạng hành nghề",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {ACTIVITY_STATUS.find((item) => item.value === row.original.status)
            ?.label || "-"}
        </div>
      ),
    },
  ];

  const branchColumns: ColumnDef<LawyerOrgBranchDetail>[] = [
    {
      accessorKey: "fullName",
      header: "Tên chi nhánh",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.orgName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Địa chỉ chi nhánh",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.address || "-"}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Số điện thoại",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.phone || "-"}
        </div>
      ),
    },
    {
      accessorKey: "license",
      header: "Số ĐKHĐ",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.businessLicenseNumber || "-"}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Chức năng",
      enableHiding: !isEdit,
      cell: ({ row }) => (
        <div className="flex space-x-2 items-center justify-center">
          <Button
            onClick={() => {
              setCurrentBranch(row.original);
              setIsEditBranch(true);
              setBranchModalOpen(true);
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
                <AlertDialogTitle>Xác nhận xóa chi nhánh</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa chi nhánh{" "}
                  <strong>{row.original?.orgName}?</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    event.preventDefault();
                    handleDeleteBranch(row.original.orgBranchId);
                  }}
                  className="bg-default-blue hover:bg-white hover:text-default-blue border-default-blue border"
                  disabled={deleteBranchMutation.isPending}
                >
                  {deleteBranchMutation.isPending && (
                    <Loader2 className="animate-spin mr-2" />
                  )}
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  const handleDeleteBranch = (id: number) => {
    if (id) {
      deleteBranchMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Xóa chi nhánh thành công!");
          refetch();
          setIsShowConfirmModal(false);
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Xóa chi nhánh thất bại!"
          );
        },
      });
    }
  };

  const handleDeleteContentChange = (id: number) => {
    if (id) {
      deleteContentChangeMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Xóa thông tin thành công!");
          refetch();
          setIsShowConfirmContentModal(false);
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Xóa thông tin thất bại!"
          );
        },
      });
    }
  };

  const table = useReactTable({
    data: data?.getListRegisOrgChange || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });

  const lawyerTable = useReactTable({
    data: orgLawyerQuery?.data?.data?.items || [],
    columns: lawyerColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });

  const branchTable = useReactTable({
    data: data?.branchOrgList || [],
    columns: branchColumns,
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

    const submitData: Partial<FullLawyerOrgItem> = {
      // ...data,
      provinceId: Number(values.provinceId),
      wardId: values.wardId ? Number(values.wardId) : undefined,
      lawyerAssociationId: values.lawyerAssociationId
        ? Number(values.lawyerAssociationId)
        : undefined,
      orgType: Number(values.orgType),
      phone: values.phone,
      email: values.email,
      address: values.address,
      orgName: values.orgName,
      businessLicenseNumber: values?.businessLicenseNumber,
      businessLicenseIssueDate:
        values?.businessLicenseIssueDate?.toISOString() || "",
      status: Number(values.status),
      lawyerLegalRepresentativeId: Number(values.representativeId),
      isDomestic,
      note: values.note,
      registrationLicenseIssueDate:
        values?.registrationLicenseIssueDate?.toISOString() || "",
      registrationLicenseNumber: values?.registrationLicenseNumber,
      nationalityId: values?.nationalityId
        ? Number(values.nationalityId)
        : undefined,
    };

    if (isAdd) {
      addMutation.mutate(submitData, {
        onSuccess: () => {
          toast.success("Thêm mới tổ chức luật sư thành công!");
          refetchList();
          setIsEdit(false);
          setIsAdd(false);
          form.clearErrors();
          onOpenChange(false);
          form.reset();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Thêm mới tổ chức luật sư thất bại!"
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
      setIsAdd(false);
      form.reset();
      form.clearErrors();
    }
    setOpen(isOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => onOpenChange(isOpen)}>
        <DialogContent className="min-w-[1200px] max-h-[90vh] max-sm:p-2 z-50 flex flex-col pb-4 max-sm:min-w-0 max-sm:max-w-full">
          <DialogHeader className="border-b border-b-[#EBEBF0] pb-4 -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
            <DialogTitle className="font-bold">
              THÔNG TIN CHI TIẾT TỔ CHỨC HÀNH NGHỀ LUẬT SƯ{" "}
              {isDomestic ? "TRONG NƯỚC" : "NƯỚC NGOÀI"}
            </DialogTitle>
            <DialogDescription>
              <VisuallyHidden>
                Chi tiết tổ chức hành nghề luật sư
              </VisuallyHidden>
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
                              <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                                <FormLabel className="font-bold">
                                  Đoàn Luật sư{" "}
                                  <span
                                    className={cn(
                                      "text-red-500",
                                      isEdit ? "visible" : "invisible"
                                    )}
                                  >
                                    *
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <AutoCompleteSearch
                                    displayKey="assocName"
                                    selectPlaceholder="Chọn Đoàn luật sư"
                                    emptyMsg="Không tìm thấy dữ liệu"
                                    onSelect={(value) => {
                                      field.onChange(
                                        value.assocId?.toString() || ""
                                      );
                                    }}
                                    optionKey="assocId"
                                    options={assocQuery?.data?.data || []}
                                    placeholder="Tìm kiếm theo tên Đoàn luật sư"
                                    value={field.value || ""}
                                    valueKey="assocId"
                                    disabled={!isAdd}
                                    modal
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      ) : (
                        <></>
                      )}

                      <FormField
                        control={form.control}
                        name="orgType"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                            <FormLabel className="font-bold">
                              Loại tổ chức hành nghề{" "}
                              <span
                                className={cn(
                                  "text-red-500",
                                  isEdit ? "visible" : "invisible"
                                )}
                              >
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={!isAdd}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={"Loại tổ chức hành nghề"}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1" key={1}>
                                    Công ty cổ phần
                                  </SelectItem>
                                  <SelectItem value="2" key={2}>
                                    Văn phòng luật sư
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="orgName"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                            <FormLabel className="font-bold">
                              Tên tổ chức hành nghề Luật sư{" "}
                              <span
                                className={cn(
                                  "text-red-500",
                                  isEdit ? "visible" : "invisible"
                                )}
                              >
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Tên tổ chức"
                                {...field}
                                disabled={!isAdd}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {!isDomestic ? (
                        <>
                          <FormField
                            control={form.control}
                            name="nationalityId"
                            render={({ field }) => (
                              <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                                <FormLabel className="font-bold">
                                  Quốc gia/Vùng lãnh thổ{" "}
                                  <span
                                    className={cn(
                                      "text-red-500",
                                      isEdit ? "visible" : "invisible"
                                    )}
                                  >
                                    *
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={!isAdd}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Quốc gia/Vùng lãnh thổ" />
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
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      ) : (
                        <></>
                      )}

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem
                            className={cn(
                              "flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2"
                            )}
                          >
                            <FormLabel className="font-bold">
                              Số điện thoại{" "}
                              <span
                                className={cn(
                                  "text-red-500",
                                  isEdit ? "visible" : "invisible"
                                )}
                              >
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Số điện thoại"
                                {...field}
                                disabled={!isAdd}
                                onKeyUp={(e) =>
                                  form.setValue(
                                    "phone",
                                    e.currentTarget.value?.replace(
                                      /[^0-9.]/g,
                                      ""
                                    )
                                  )
                                }
                                maxLength={11}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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
                            <FormControl>
                              <Input
                                placeholder="Email"
                                {...field}
                                disabled={!isAdd}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {!isDomestic ? (
                        <>
                          <FormField
                            control={form.control}
                            name="registrationLicenseNumber"
                            render={({ field }) => (
                              <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                                <FormLabel className="font-bold">
                                  Số giấy phép thành lập{" "}
                                  <span
                                    className={cn(
                                      "text-red-500",
                                      isEdit ? "visible" : "invisible"
                                    )}
                                  >
                                    *
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Số giấy phép"
                                    {...field}
                                    disabled={!isAdd}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="registrationLicenseIssueDate"
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
                                <FormControl>
                                  <DatePickerInput
                                    placeholder="Ngày cấp"
                                    value={field.value}
                                    onSelect={field.onChange}
                                    disabledDate={(date) => date > new Date()}
                                    disabled={!isAdd}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      ) : (
                        <></>
                      )}

                      <FormField
                        control={form.control}
                        name="businessLicenseNumber"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                            <FormLabel className="font-bold">
                              Số giấy phép đăng ký hoạt động{" "}
                              <span
                                className={cn(
                                  "text-red-500",
                                  isEdit ? "visible" : "invisible"
                                )}
                              >
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Số giấy phép"
                                {...field}
                                disabled={!isAdd}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="businessLicenseIssueDate"
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
                            <FormControl>
                              <DatePickerInput
                                placeholder="Ngày cấp"
                                value={field.value}
                                onSelect={field.onChange}
                                disabledDate={(date) => date > new Date()}
                                disabled={!isAdd}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                            <FormLabel className="font-bold">
                              Trạng thái hoạt động{" "}
                              <span
                                className={cn(
                                  "text-red-500",
                                  isEdit ? "visible" : "invisible"
                                )}
                              >
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={!isAdd && !isEdit}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Trạng thái hoạt động" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup className="overflow-y-auto max-h-[200px]">
                                    {LAWYER_STATUS.map((item) => (
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
                                  isEdit ? "visible" : "invisible"
                                )}
                              >
                                *
                              </span>
                            </FormLabel>
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
                                disabled={!isAdd && !isEdit}
                              />
                            </FormControl>
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
                                disabled={!isAdd && !isEdit}
                                modal
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-left mb-1 col-span-2 max-sm:col-span-4">
                            <FormLabel className="font-bold">
                              {isDomestic ? "Địa chỉ trụ sở" : "Địa chỉ trụ sở tại Việt Nam"}{" "}
                              <span
                                className={cn(
                                  "text-red-500",
                                  isEdit ? "visible" : "invisible"
                                )}
                              >
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Địa chỉ trụ sở"
                                {...field}
                                disabled={!isAdd && !isEdit}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </section>

                    <p className="mb-3 font-bold text-default-blue">
                      {isDomestic
                        ? "NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT"
                        : "GIÁM ĐỐC/TRƯỞNG CHI NHÁNH"}
                    </p>

                    <section className="grid grid-cols-4 gap-x-2 gap-y-1 items-start">
                      <FormField
                        control={form.control}
                        name="representativeId"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                            <FormLabel className="font-bold">
                              Họ tên{" "}
                              <span
                                className={cn(
                                  "text-red-500",
                                  isEdit ? "visible" : "invisible"
                                )}
                              >
                                *
                              </span>
                            </FormLabel>
                            {isAdd ? (
                              <>
                                <FormControl>
                                  <AutoCompleteSearch
                                    displayKey="fullName"
                                    selectPlaceholder="Chọn Luật sư"
                                    emptyMsg="Không tìm thấy dữ liệu"
                                    onSelect={(value) => {
                                      field.onChange(
                                        value.id?.toString() || ""
                                      );

                                      form.setValue(
                                        "dateOfBirth",
                                        value.dob
                                          ? new Date(value.dob)
                                          : undefined
                                      );
                                      form.setValue(
                                        "licenseNumber",
                                        value?.cerNumber || ""
                                      );
                                      form.setValue(
                                        "cardNumber",
                                        value?.licNumber || ""
                                      );
                                    }}
                                    optionKey="id"
                                    options={
                                      representativeListQuery?.data?.data || []
                                    }
                                    placeholder="Tìm kiếm theo tên Luật sư"
                                    value={field.value || ""}
                                    valueKey="id"
                                    disabled={!isAdd}
                                    modal
                                  />
                                </FormControl>
                                <FormMessage />
                              </>
                            ) : (
                              <div className="text-sm">
                                {representativeDetailQuery?.data?.data
                                  ?.fullName || "-"}
                              </div>
                            )}
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
                            {isAdd ? (
                              <>
                                <FormControl>
                                  <DatePickerInput
                                    placeholder="Ngày sinh"
                                    value={field.value}
                                    onSelect={field.onChange}
                                    disabledDate={(date) => date > new Date()}
                                    disabled
                                  />
                                </FormControl>
                                <FormMessage />
                              </>
                            ) : (
                              <div className="text-sm">
                                {representativeDetailQuery?.data?.data
                                  ?.dateOfBirth
                                  ? format(
                                      representativeDetailQuery?.data?.data
                                        ?.dateOfBirth,
                                      "dd/MM/yyyy"
                                    )
                                  : "-"}
                              </div>
                            )}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="licenseNumber"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                            <FormLabel className="font-bold">
                              Số chứng chỉ hành nghề luật sư
                            </FormLabel>
                            {isAdd ? (
                              <FormControl>
                                <Input
                                  placeholder="Số chứng chỉ hành nghề luật sư"
                                  {...field}
                                  disabled
                                />
                              </FormControl>
                            ) : (
                              <div className="text-sm">
                                {representativeDetailQuery?.data?.data
                                  ?.certificateNumber || "-"}
                              </div>
                            )}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                            <FormLabel className="font-bold">
                              Số Thẻ luật sư
                            </FormLabel>
                            {isAdd ? (
                              <FormControl>
                                <Input
                                  placeholder="Số Thẻ luật sư"
                                  {...field}
                                  disabled
                                />
                              </FormControl>
                            ) : (
                              <div className="text-sm">
                                {representativeDetailQuery?.data?.data
                                  ?.licenseLSNumber || "-"}
                              </div>
                            )}
                          </FormItem>
                        )}
                      />
                    </section>

                    {!isAdd ? (
                      <>
                        <Collapsible className="my-6" defaultOpen={true}>
                          <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold text-default-blue">
                            {isDomestic
                              ? "THÔNG TIN ĐĂNG KÝ THAY ĐỔI"
                              : "THÔNG TIN ĐĂNG KÝ THAY ĐỔI GIẤY PHÉP THÀNH LẬP/ĐĂNG KÝ HOẠT ĐỘNG"}
                            <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2">
                            <CommonTable
                              data={{
                                items: data?.getListRegisOrgChange || [],
                                numberPerPage: 100,
                                pageCount: 1,
                                pageList: [],
                              }}
                              table={table}
                              isLoading={isLoading}
                              showTitleHeader={false}
                            />

                            {isEdit && (
                              <span
                                className="mt-2 text-default-blue text-sm font-bold cursor-pointer"
                                onClick={() => {
                                  setIsEditContent(false);
                                  setModalOpen(true);
                                }}
                              >
                                + Thêm mới
                              </span>
                            )}
                          </CollapsibleContent>
                        </Collapsible>

                        {isDomestic ? (
                          <>
                            <Collapsible className="my-6" defaultOpen={true}>
                              <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold text-default-blue">
                                DANH SÁCH CHI NHÁNH
                                <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-2">
                                <CommonTable
                                  data={{
                                    items: data?.branchOrgList || [],
                                    numberPerPage: 100,
                                    pageCount: 1,
                                    pageList: [],
                                  }}
                                  table={branchTable}
                                  isLoading={isLoading}
                                  showTitleHeader={false}
                                />

                                {isEdit && (
                                  <span
                                    className="mt-2 text-default-blue text-sm font-bold cursor-pointer"
                                    onClick={() => {
                                      setIsEditBranch(false);
                                      setBranchModalOpen(true);
                                    }}
                                  >
                                    + Thêm mới
                                  </span>
                                )}
                              </CollapsibleContent>
                            </Collapsible>
                          </>
                        ) : (
                          <></>
                        )}

                        <Collapsible className="my-6" defaultOpen={true}>
                          <CollapsibleTrigger className="mb-3 border-b border-b-[#EBEBF0] pb-2 w-full flex justify-between items-center text-left group font-bold text-default-blue">
                            DANH SÁCH LUẬT SƯ HÀNH NGHỀ TẠI TỔ CHỨC
                            <ChevronUp className="group-data-[state=closed]:rotate-180 transition-transform" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2">
                            <CommonTable
                              data={orgLawyerQuery?.data?.data}
                              table={lawyerTable}
                              isLoading={isLoading}
                              showTitleHeader={false}
                            />
                          </CollapsibleContent>
                        </Collapsible>
                      </>
                    ) : (
                      <></>
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
                    />

                    <div className="flex justify-center items-center space-x-2">
                      {isEdit || isAdd ? (
                        <Button
                          type="submit"
                          className="border border-default-blue bg-default-blue text-white hover:bg-white hover:text-default-blue"
                          disabled={
                            editMutation.isPending || addMutation.isPending
                          }
                        >
                          {editMutation.isPending || addMutation.isPending ? (
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
                        disabled={
                          editMutation.isPending || addMutation.isPending
                        }
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
        <LawyerOrgContentChangeModal
          open={modalOpen}
          setOpen={setModalOpen}
          data={currentContentChange}
          orgData={data}
          isDomestic={isDomestic}
          isEdit={isEditContent}
          refetch={refetch}
        />
      )}
      {branchModalOpen && (
        <LawyerOrgBranchModal
          open={branchModalOpen}
          setOpen={setBranchModalOpen}
          data={currentBranch}
          orgData={data}
          isDomestic={isDomestic}
          isEdit={isEditBranch}
          refetch={refetch}
          lawyerList={orgLawyerQuery?.data?.data?.items || []}
        />
      )}
    </>
  );
};

export default LawyerOrgDetailModalAdmin;
