import { addBranch, updateBranch } from "@/service/lawyer";
import {
  FullLawyerOrgItem,
  LawyerOrgBranchDetail,
  OrgLawyerItem,
} from "@/types/luatSu";
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
  data?: LawyerOrgBranchDetail;
  orgData?: FullLawyerOrgItem;
  isEdit: boolean;
  refetch: () => void;
  isDomestic: number;
  lawyerList?: OrgLawyerItem[];
}

const formSchema = z.object({
  orgName: z.string().trim().min(1, "Vui lòng nhật Tên chi nhánh"),
  phone: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập Số điện thoại")
    .regex(/^0\d{9}$/, "Số điện thoại không hợp lệ")
    .length(10, "Số điện thoại không hợp lệ"),
  businessLicenseIssueDate: z.date({
    required_error: "Vui lòng chọn Ngày cấp",
  }),
  lawyerLegalRepresentativeId: z
    .string()
    .trim()
    .min(1, "Vui lòng chọn Trưởng chi nhánh"),
  address: z.string().trim().min(1, "Vui lòng nhập Địa chỉ chi nhánh"),
  businessLicenseNumber: z.string().trim().min(1, "Vui lòng nhập Số giấy phép"),
  isDomestic: z.number(),
});

const LawyerOrgBranchModal = ({
  open,
  setOpen,
  data,
  isEdit,
  refetch,
  orgData,
  isDomestic,
  lawyerList,
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgName: "",
      phone: "",
      businessLicenseIssueDate: undefined,
      isDomestic: 1,
      address: "",
      businessLicenseNumber: "",
      lawyerLegalRepresentativeId: "",
    },
  });

  const addMutation = useMutation({
    mutationFn: addBranch,
  });

  const updateMutation = useMutation({
    mutationFn: updateBranch,
  });

  useEffect(() => {
    if (data && isEdit) {
      form.reset({
        orgName: data?.orgName || "",
        phone: data?.phone || "-",
        businessLicenseIssueDate: data?.businessLicenseIssueDate
          ? new Date(data?.businessLicenseIssueDate)
          : undefined,
        isDomestic,
        address: data?.address || "",
        businessLicenseNumber: data?.businessLicenseNumber || "",
        lawyerLegalRepresentativeId:
          data?.lawyerLegalRepresentativeId?.toString() || "",
      });
    } else if (!isEdit) {
      form.reset({
        orgName: "",
        phone: "",
        businessLicenseIssueDate: undefined,
        isDomestic,
        address: "",
        businessLicenseNumber: "",
        lawyerLegalRepresentativeId: "",
      });
    }
  }, [data, form, isEdit, isDomestic]);

  const closeForm = () => {
    form.clearErrors();
    setOpen(false);
    form.reset({
      orgName: "",
      phone: "",
      businessLicenseIssueDate: undefined,
      isDomestic,
      address: "",
      businessLicenseNumber: "",
      lawyerLegalRepresentativeId: "",
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!orgData) {
      return;
    }

    if (!isEdit) {
      addMutation.mutate(
        {
          orgName: values.orgName,
          phone: values.phone,
          businessLicenseIssueDate:
            values.businessLicenseIssueDate.toISOString(),
          address: values.address,
          businessLicenseNumber: values.businessLicenseNumber,
          lawyerLegalRepresentativeId: Number(
            values.lawyerLegalRepresentativeId
          ),
          orgId: orgData?.orgId,
        },
        {
          onSuccess: () => {
            toast.success("Thêm mới chi nhánh thành công!");
            refetch();
            closeForm();
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data?.message || "Thêm mới chi nhánh thất bại!"
            );
          },
        }
      );
    } else if (data) {
      updateMutation.mutate(
        {
          ...data,
          orgName: values.orgName,
          phone: values.phone,
          businessLicenseIssueDate:
            values.businessLicenseIssueDate.toISOString(),
          address: values.address,
          businessLicenseNumber: values.businessLicenseNumber,
          lawyerLegalRepresentativeId: Number(
            values.lawyerLegalRepresentativeId
          ),
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật chi nhánh thành công!");
            closeForm();
            refetch();
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data?.message ||
                "Cập nhật chi nhánh thất bại!"
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
            CHI NHÁNH TỔ CHỨC HNLS TRONG NƯỚC
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
              <FormField
                control={form.control}
                name="orgName"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-1 max-sm:col-span-2">
                    <FormLabel className="font-bold">
                      Tên chi nhánh <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Tên chi nhánh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-1 max-sm:col-span-2">
                    <FormLabel className="font-bold">
                      Số điện thoại <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Số điện thoại"
                        {...field}
                        onKeyUp={(e) =>
                          form.setValue(
                            "phone",
                            e.currentTarget.value?.replace(/[^0-9.]/g, "")
                          )
                        }
                        maxLength={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lawyerLegalRepresentativeId"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left mb-1 col-span-1 max-sm:col-span-2">
                    <FormLabel className="font-bold">
                      Trưởng chi nhánh <span className="text-red-500">*</span>
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
                            {(lawyerList || []).map((item) => (
                              <SelectItem
                                value={item.id.toString()}
                                key={item.id}
                              >
                                {item.fullName}
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
                name="address"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-1 max-sm:col-span-2">
                    <FormLabel className="font-bold">
                      Địa chỉ chi nhánh <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Địa chỉ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessLicenseNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-1 max-sm:col-span-2">
                    <FormLabel className="font-bold">
                      Số giấy phép ĐKHĐ <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Số giấy phép ĐKHĐ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessLicenseIssueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-1 max-sm:col-span-2">
                    <FormLabel className="font-bold">
                      Ngày cấp <span className="text-red-500">*</span>
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

export default LawyerOrgBranchModal;
