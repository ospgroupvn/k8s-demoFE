import { OWNER_TYPE, TYPE_ORG_CHANGE } from "@/constants/luat_su";
import { addContentChange, editContentChange } from "@/service/lawyer";
import { FullLawyerOrgItem, OrgChangeItem } from "@/types/luatSu";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/datepicker";
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

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: OrgChangeItem;
  orgData?: FullLawyerOrgItem;
  isEdit: boolean;
  refetch: () => void;
  isDomestic: number;
}

const formSchema = z
  .object({
    vbChange: z.string().trim(),
    issueDate: z.date().optional(),
    changeContent: z.string().trim().optional(),
    isDomestic: z.number(),
    typeOrgChange: z.string().trim().optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.issueDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn Ngày cấp",
        path: ["issueDate"],
      });
    }

    if (!val.changeContent?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng nhập Nội dung thay đổi",
        path: ["changeContent"],
      });
    }

    if (val.isDomestic) {
      if (!val.vbChange?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng nhập Số giấy phép",
          path: ["vbChange"],
        });
      }
    } else {
      if (!val.typeOrgChange?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn Loại thay đổi",
          path: ["typeOrgChange"],
        });
      }
    }
  });

const LawyerOrgContentChangeModal = ({
  open,
  setOpen,
  data,
  isEdit,
  refetch,
  orgData,
  isDomestic,
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      changeContent: "",
      vbChange: "",
      issueDate: undefined,
      isDomestic: 1,
    },
  });

  const addMutation = useMutation({
    mutationFn: addContentChange,
  });

  const updateMutation = useMutation({
    mutationFn: editContentChange,
  });

  useEffect(() => {
    if (data && isEdit) {
      form.reset({
        changeContent: data?.contentChange?.toString(),
        vbChange: data?.vbChange,
        issueDate: data?.dateChange ? new Date(data?.dateChange) : undefined,
        isDomestic,
      });
    } else if (!isEdit) {
      form.reset({
        changeContent: "",
        vbChange: "",
        issueDate: undefined,
        isDomestic,
      });
    }
  }, [data, form, isEdit, isDomestic]);

  const closeForm = () => {
    form.clearErrors();
    form.reset({ changeContent: "", vbChange: "", issueDate: undefined });
    setOpen(false);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!orgData) {
      return;
    }

    if (!isEdit) {
      addMutation.mutate(
        {
          vbChange: values.vbChange,
          issueDate: values.issueDate?.toISOString(),
          changeContent: values.changeContent,
          isDomestic,
          ownerId: orgData?.orgId,
          ownerType: OWNER_TYPE.ORG,
          ...(!isDomestic
            ? { typeOrgChange: Number(values.typeOrgChange) }
            : {}),
        },
        {
          onSuccess: () => {
            toast.success("Thêm mới thông tin thay đổi thành công!");
            closeForm();
            refetch();
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data?.message ||
                "Thêm mới thông tin thay đổi thất bại!"
            );
          },
        }
      );
    } else if (data) {
      updateMutation.mutate(
        {
          idLic: data.id,
          ownerId: orgData?.orgId,
          ownerType: OWNER_TYPE.ORG,
          issueDate: values.issueDate!.toISOString(),
          changeContent: values.changeContent!,
          isDomestic,
          vbChange: values.vbChange,
          ...(!isDomestic
            ? { typeOrgChange: Number(values.typeOrgChange) }
            : {}),
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật thông tin thẻ thành công!");
            refetch();
            closeForm();
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data?.message ||
                "Cập nhật thông tin thẻ thất bại!"
            );
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogContent className="max-h-[90vh] max-sm:p-2 z-50 flex flex-col pb-4 max-sm:min-w-0 max-sm:max-w-full">
        <DialogHeader className="border-b border-b-[#EBEBF0] pb-4 -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
          <DialogTitle className="font-bold">
            CHI TIẾT THAY ĐỔI NỘI DUNG ĐKHĐ CỦA TỔ CHỨC HNLS TRONG NƯỚC
          </DialogTitle>
          <DialogDescription>
            <VisuallyHidden>Chi tiết thay đổi nội dung</VisuallyHidden>
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-y-auto -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-x-2 gap-y-1 items-start"
            >
              {!isDomestic ? (
                <FormField
                  control={form.control}
                  name="typeOrgChange"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                      <FormLabel className="font-bold">
                        Loại thay đổi <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="mb-2">
                            <SelectValue placeholder="Trưởng chi nhánh" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup className="overflow-y-auto max-h-[200px]">
                              {TYPE_ORG_CHANGE.map((item) => (
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
              ) : (
                <></>
              )}

              <FormField
                control={form.control}
                name="vbChange"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-1 max-sm:col-span-2">
                    <FormLabel className="font-bold">
                      {isDomestic ? "Văn bản thay đổi" : "Văn bản chấp thuận"}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          isDomestic ? "Văn bản thay đổi" : "Văn bản chấp thuận"
                        }
                        {...field}
                        disabled={isEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-1 max-sm:col-span-2">
                    <FormLabel className="font-bold">
                      Ngày cấp {!isDomestic ? "văn bản thay đổi" : ""}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        placeholder="Ngày cấp"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabledDate={(date) => date > new Date()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="changeContent"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-4">
                    <FormLabel className="font-bold">
                      Nội dung thay đổi <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nội dung thay đổi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center items-center space-x-2 col-span-2">
                <Button
                  type="submit"
                  className="border border-default-blue bg-default-blue text-white hover:bg-white hover:text-default-blue"
                  disabled={updateMutation.isPending || addMutation.isPending}
                >
                  {(updateMutation.isPending || addMutation.isPending) && (
                    <Loader2 className="animate-spin mr-2" />
                  )}
                  Lưu
                </Button>
                <Button
                  type="button"
                  className="border border-[#C3ECF5] bg-white text-default-blue hover:bg-[#C3ECF5]"
                  onClick={() => closeForm()}
                  disabled={updateMutation.isPending || addMutation.isPending}
                >
                  Đóng
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LawyerOrgContentChangeModal;
