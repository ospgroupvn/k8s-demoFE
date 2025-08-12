import { USER_TYPE } from "@/constants/common";
import { addNotaryOperation, editNotaryOperation } from "@/service/notaryOrg";
import { OrganizationItem } from "@/types/common";
import { NotaryOperationItem } from "@/types/congChung";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useMutation } from "@tanstack/react-query";
import { getYear } from "date-fns";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import AutoCompleteSearch from "../common/autoCompleteSearch";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item?: NotaryOperationItem;
  provinceList: OrganizationItem[];
  refetch: () => void;
}

const formSchema = z.object({
  yearReport: z
    .string()
    .trim()
    .refine(
      (val) => {
        return val?.length > 0;
      },
      { message: "Vui lòng chọn năm" }
    ),
  monthReport: z
    .string()
    .trim()
    .refine((val) => val?.length > 0, { message: "Vui lòng chọn tháng" }),
  numNotaryContracts: z
    .string()
    .trim()
    .refine((val) => val?.length > 0, {
      message: "Vui lòng nhập Số công việc",
    }),
  notaryFeesContracts: z
    .string()
    .trim()
    .refine((val) => val?.length > 0, {
      message: "Vui lòng nhập Thù lao công việc",
    }),
  numOtherNotaryTasks: z
    .string()
    .trim()
    .refine((val) => val?.length > 0, {
      message: "Vui lòng nhập Số công việc",
    }),
  notaryFeesOtherTasks: z
    .string()
    .trim()
    .refine((val) => val?.length > 0, {
      message: "Vui lòng nhập Thù lao công việc",
    }),
  totalTasks: z.string().trim().optional(),
  totalFees: z.string().trim().optional(),
  taxContribution: z.string().trim().optional(),
  numNotariesWorking: z
    .string()
    .trim()
    .refine((val) => val?.length > 0, {
      message: "Vui lòng nhập Số công chứng viên",
    }),
  numNotaryOfficesReporting: z
    .string()
    .trim()
    .refine((val) => val?.length > 0, {
      message: "Vui lòng nhập Số tổ chức",
    }),
  administrationId: z
    .string()
    .trim()
    .refine((val) => val?.length > 0, {
      message: "Vui lòng chọn Tỉnh/Thành phố",
    }),
});

const NotaryOperationModal = ({
  open,
  setOpen,
  item,
  provinceList,
  refetch,
}: Props) => {
  const currentYear = getYear(new Date());
  const session = useSession();
  const addMutation = useMutation({
    mutationFn: addNotaryOperation,
  });

  const editMutation = useMutation({
    mutationFn: editNotaryOperation,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearReport: getYear(new Date()).toString(),
      monthReport: "",
      numNotaryContracts: "",
      notaryFeesContracts: "",
      numOtherNotaryTasks: "",
      notaryFeesOtherTasks: "",
      totalTasks: "",
      totalFees: "",
      taxContribution: "",
      numNotariesWorking: "",
      numNotaryOfficesReporting: "",
      administrationId: "",
    },
    values: {
      yearReport:
        item?.reportYear?.toString() || getYear(new Date()).toString(),
      monthReport: item?.reportMonth?.toString() || "",
      numNotaryContracts: item?.numNotaryContracts?.toString() || "",
      notaryFeesContracts:
        item?.notaryFeesContracts?.toLocaleString("vi-VN") || "",
      numOtherNotaryTasks: item?.numOtherNotaryTasks?.toString() || "",
      notaryFeesOtherTasks:
        item?.notaryFeesOtherTasks?.toLocaleString("vi-VN") || "",
      taxContribution: item?.taxContribution?.toLocaleString("vi-VN") || "",
      numNotariesWorking: item?.numNotariesWorking?.toString() || "",
      numNotaryOfficesReporting:
        item?.numNotaryOfficesReporting?.toString() || "",
      administrationId:
        (session.data?.user?.type === USER_TYPE.SO_TU_PHAP
          ? session.data?.user?.administrationId?.toString()
          : item?.administrationId?.toString()) || "",
    },
  });

  const onSubmit = (
    values: z.infer<typeof formSchema>,
    closeModal: boolean
  ) => {
    const submitItem: Partial<NotaryOperationItem> = {
      administrationId: Number(values.administrationId),
      numNotaryContracts: Number(values.numNotaryContracts),
      notaryFeesContracts: Number(
        values.notaryFeesContracts?.replaceAll(".", "")
      ),
      numOtherNotaryTasks: Number(values.numOtherNotaryTasks),
      notaryFeesOtherTasks: Number(
        values.notaryFeesOtherTasks?.replaceAll(".", "")
      ),
      totalTasks:
        Number(values.numNotaryContracts || "0") +
        Number(values.numOtherNotaryTasks || "0"),
      totalFees:
        Number(form.watch("notaryFeesContracts")?.replaceAll(".", "") || "0") +
        Number(form.watch("notaryFeesOtherTasks")?.replaceAll(".", "") || "0"),
      taxContribution: Number(
        values.taxContribution?.replaceAll(".", "") || "0"
      ),
      numNotaryOfficesReporting: Number(values.numNotaryOfficesReporting),
      numNotariesWorking: Number(values.numNotariesWorking),
      reportYear: Number(values.yearReport),
      reportMonth: Number(values.monthReport),
      reportDate: new Date(
        Number(values.yearReport),
        Number(values.monthReport) - 1,
        1
      ).toISOString(),
    };

    if (!item?.id) {
      addMutation.mutate(submitItem, {
        onSuccess: (data) => {
          if (data?.success) {
            toast.success("Thêm mới dữ liệu hoạt động công chứng thành công");

            refetch();
            if (closeModal) {
              setOpen(false);
            }

            form.reset();
          } else {
            toast.error(
              "Thêm mới dữ liệu hoạt động công chứng không thành công!"
            );
          }
        },
        onError: () => {
          toast.error(
            "Thêm mới dữ liệu hoạt động công chứng không thành công!"
          );
        },
      });
    } else {
      editMutation.mutate(
        { ...submitItem, id: item.id },
        {
          onSuccess: (data) => {
            if (data?.status === 200) {
              toast.success(
                "Chỉnh sửa dữ liệu hoạt động công chứng thành công"
              );

              form.clearErrors();
              if (closeModal) {
                refetch();
                setOpen(false);
              }

              form.reset();
            } else {
              toast.error(
                "Chỉnh sửa dữ liệu hoạt động công chứng không thành công!"
              );
            }
          },
          onError: () => {
            toast.error(
              "Chỉnh sửa dữ liệu hoạt động công chứng không thành công!"
            );
          },
        }
      );
    }
  };

  const getFieldBorder = (name: keyof z.infer<typeof formSchema>) => {
    const { isDirty, invalid } = form.getFieldState(name);

    const shouldCheck = isDirty || form.formState.submitCount > 0;

    if (!shouldCheck) {
      return "";
    }

    if (invalid) {
      return "border-red-500";
    }

    return "border-default-blue";
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        form.clearErrors();
        setOpen(isOpen);
        form.reset();
      }}
    >
      <DialogContent className="min-w-[1200px] max-h-[500px] z-50 flex flex-col pb-4 max-sm:max-w-full max-sm:min-w-0">
        <DialogHeader className="border-b border-b-[#EBEBF0] pb-4 -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
          <DialogTitle className="font-bold">
            {`${
              item?.id ? "CHỈNH SỬA" : "THÊM MỚI"
            } DỮ LIỆU HOẠT ĐỘNG CÔNG CHỨNG`}
          </DialogTitle>
          <DialogDescription>
            <VisuallyHidden>Dữ liệu hoạt động công chứng</VisuallyHidden>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => onSubmit(values, true))}
            className="h-full overflow-y-auto -mx-6 px-6 max-sm:-mx-2 max-sm:px-2 pb-4"
          >
            <div className="grid grid-cols-4 gap-x-2 gap-y-3 items-end">
              <FormField
                control={form.control}
                name="yearReport"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-1 max-sm:col-span-2">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Năm<span className="text-red-500">(*)</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tất cả" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="overflow-y-auto max-h-[200px]">
                            {Array.from({ length: 20 }, (_, i) => (
                              <SelectItem
                                key={i}
                                value={(currentYear - i).toString()}
                              >
                                {currentYear - i}
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
                name="monthReport"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-1 max-sm:col-span-2">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Tháng<span className="text-red-500">(*)</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.trigger("monthReport");
                        }}
                      >
                        <SelectTrigger
                          className={getFieldBorder("monthReport")}
                        >
                          <SelectValue placeholder="Tất cả" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="overflow-y-auto max-h-[200px]">
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i} value={(i + 1).toString()}>
                                Tháng {i + 1}
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
                name="administrationId"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-4">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Tỉnh/Thành phố<span className="text-red-500">(*)</span>
                    </FormLabel>
                    <FormControl>
                      <AutoCompleteSearch
                        disabled={
                          session.data?.user?.type === USER_TYPE.SO_TU_PHAP
                        }
                        displayKey="fullName"
                        selectPlaceholder="Chọn Tỉnh/Thành phố"
                        emptyMsg="Không tìm thấy dữ liệu"
                        onSelect={(value) => {
                          field.onChange(value.cityCode?.toString() || "");
                          form.trigger("administrationId");
                        }}
                        optionKey="id"
                        options={provinceList || []}
                        placeholder="Tìm kiếm theo tên Tỉnh/Thành phố"
                        value={field.value || ""}
                        valueKey="cityCode"
                        triggerClassName={getFieldBorder("administrationId")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numNotaryContracts"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-4">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Số công việc công chứng hợp đồng, giao dịch
                      <span className="text-red-500">(*)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập Số công việc"
                        {...field}
                        onChange={(event) => {
                          const { value } = event.target;
                          if (/^\d*\.?\d*$/.test(value) || value === "") {
                            field.onChange(value);
                            form.trigger("numNotaryContracts");
                          }
                        }}
                        className={getFieldBorder("numNotaryContracts")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notaryFeesContracts"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-4">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Phí công chứng<span className="text-red-500">(*)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập Phí công chứng"
                        {...field}
                        onChange={(event) => {
                          const { value } = event.target;
                          const parsedText = value.replaceAll(".", "");
                          if (
                            /^\d*\.?\d*$/.test(parsedText) ||
                            parsedText === ""
                          ) {
                            field.onChange(
                              Number(parsedText).toLocaleString("vi-VN")
                            );
                            form.trigger("notaryFeesContracts");
                          }
                        }}
                        className={getFieldBorder("notaryFeesContracts")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numOtherNotaryTasks"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-4">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Số công việc công chứng bản dịch và các loại khác
                      <span className="text-red-500">(*)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập Số công việc"
                        {...field}
                        onChange={(event) => {
                          const { value } = event.target;
                          if (/^\d*\.?\d*$/.test(value) || value === "") {
                            field.onChange(value);
                            form.trigger("numOtherNotaryTasks");
                          }
                        }}
                        className={getFieldBorder("numOtherNotaryTasks")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notaryFeesOtherTasks"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-4">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Giá dịch vụ công chứng và chi
                      <span className="text-red-500">(*)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập Giá dịch vụ công chứng và chi"
                        {...field}
                        onChange={(event) => {
                          const { value } = event.target;
                          const parsedText = value.replaceAll(".", "");
                          if (
                            /^\d*\.?\d*$/.test(parsedText) ||
                            parsedText === ""
                          ) {
                            field.onChange(
                              Number(parsedText).toLocaleString("vi-VN")
                            );
                            form.trigger("notaryFeesOtherTasks");
                          }
                        }}
                        className={getFieldBorder("notaryFeesOtherTasks")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalTasks"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-1 max-sm:col-span-2">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Tổng số công việc
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Nhập Tổng số công việc"
                        {...field}
                        value={
                          Number(form.watch("numNotaryContracts") || "0") +
                          Number(form.watch("numOtherNotaryTasks") || "0")
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalFees"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-1 max-sm:col-span-2">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Tổng số phí, giá dịch vụ công chứng và chi phí khác
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Nhập Tổng số phí, giá dịch vụ"
                        {...field}
                        value={(
                          Number(
                            form
                              .watch("notaryFeesContracts")
                              ?.replaceAll(".", "") || "0"
                          ) +
                          Number(
                            form
                              .watch("notaryFeesOtherTasks")
                              ?.replaceAll(".", "") || "0"
                          )
                        ).toLocaleString("vi-VN")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxContribution"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-4">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Số tiền nộp ngân sách nhà nước
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập Số tiền nộp ngân sách nhà nước"
                        {...field}
                        onChange={(event) => {
                          const { value } = event.target;
                          const parsedText = value.replaceAll(".", "");
                          if (
                            /^\d*\.?\d*$/.test(parsedText) ||
                            parsedText === ""
                          ) {
                            field.onChange(
                              Number(parsedText).toLocaleString("vi-VN")
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numNotaryOfficesReporting"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-4">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Số tổ chức hành nghề CC có báo cáo (Tổ chức)
                      <span className="text-red-500">(*)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập Số tổ chức hành nghề"
                        {...field}
                        onChange={(event) => {
                          const { value } = event.target;
                          if (/^\d*\.?\d*$/.test(value) || value === "") {
                            field.onChange(value);
                            form.trigger("numNotaryOfficesReporting");
                          }
                        }}
                        className={getFieldBorder("numNotaryOfficesReporting")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numNotariesWorking"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-4">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Số công chứng viên thực hiện các công việc trong tháng
                      (Người)<span className="text-red-500">(*)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập Số công chứng viên"
                        {...field}
                        onChange={(event) => {
                          const { value } = event.target;
                          if (/^\d*\.?\d*$/.test(value) || value === "") {
                            field.onChange(value);
                            form.trigger("numNotariesWorking");
                          }
                        }}
                        className={getFieldBorder("numNotariesWorking")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter className="flex items-center max-sm:flex-row gap-1">
          {!item?.id ? (
            <Button
              type="button"
              className="border border-[#C3ECF5] bg-[#C3ECF5] text-default-blue hover:bg-white"
              disabled={addMutation.isPending || editMutation.isPending}
              onClick={() =>
                form.handleSubmit((values) => onSubmit(values, false))()
              }
            >
              {addMutation?.isPending || editMutation.isPending ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <></>
              )}
              Lưu và nhập liệu
            </Button>
          ) : (
            <></>
          )}
          <Button
            type="button"
            className="border border-default-blue bg-default-blue text-white hover:bg-white hover:text-default-blue"
            onClick={() =>
              form.handleSubmit((values) => onSubmit(values, true))()
            }
            disabled={addMutation.isPending || editMutation.isPending}
          >
            {addMutation?.isPending || editMutation.isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <></>
            )}
            {!item?.id ? "Lưu và đóng" : "Lưu"}
          </Button>
          <Button
            type="button"
            className="border border-[#C3ECF5] bg-white text-default-blue hover:bg-[#C3ECF5]"
            onClick={() => {
              form.clearErrors();
              setOpen(false);
              form.reset();
            }}
            disabled={addMutation.isPending || editMutation.isPending}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotaryOperationModal;
