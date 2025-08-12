import { addCard } from "@/service/lawyer";
import { FullLawyerItem, LsCardLicenses } from "@/types/luatSu";
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
import { LICENSE_TYPE, OWNER_TYPE } from "@/constants/luat_su";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: LsCardLicenses;
  lawyerData?: FullLawyerItem;
  refetch: () => void;
}

const formSchema = z.object({
  licenseNumber: z.string().trim(),
  issueDate: z.date(),
  type: z.string().optional(),
  licenseDate: z.date(),
});

const LawyerLicenseModal = ({
  open,
  setOpen,
  data,
  refetch,
  lawyerData,
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      licenseNumber: "",
      issueDate: undefined,
      licenseDate: undefined,
    },
  });

  const addMutation = useMutation({
    mutationFn: addCard,
  });

  useEffect(() => {
    if (data && lawyerData) {
      form.reset({
        type: data?.status?.toString(),
        licenseNumber: lawyerData?.certificateNumber || "",
        issueDate: lawyerData?.issueDate
          ? new Date(lawyerData?.issueDate)
          : undefined,
        licenseDate: lawyerData?.issueDate
          ? new Date(lawyerData.issueDate)
          : undefined,
      });
    } else if (lawyerData) {
      form.reset({
        type: "",
        licenseNumber: lawyerData?.certificateNumber || "",
        licenseDate: lawyerData?.issueDate
          ? new Date(lawyerData?.issueDate)
          : undefined,
        issueDate: undefined,
      });
    }
  }, [data, form, lawyerData]);

  const closeForm = () => {
    form.clearErrors();
    setOpen(false);
    form.reset({ type: "", licenseNumber: "", issueDate: undefined });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!lawyerData) {
      return;
    }

    addMutation.mutate(
      {
        status: Number(values.type),
        issueDate: values.issueDate.toISOString(),
        ownerId: lawyerData?.lawyerId,
        licenseType: LICENSE_TYPE.GPHN,
        licenseNumber: values.licenseNumber,
        ownerType: OWNER_TYPE.LAWYER,
        isDomestic: lawyerData.isDomestic,
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật thông tin GPHN thành công!");
          refetch();
          closeForm();
        },
        onError: () => {
          toast.error("Cập nhật thông tin GPHN thất bại!");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogContent className="max-h-[90vh] max-sm:p-2 z-50 flex flex-col pb-4 max-sm:min-w-0 max-sm:max-w-full">
        <DialogHeader className="border-b border-b-[#EBEBF0] pb-4 -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
          <DialogTitle className="font-bold">
            THÊM MỚI GIẤY PHÉP HÀNH NGHỀ
          </DialogTitle>
          <DialogDescription>
            <VisuallyHidden>Chi tiết GPHN</VisuallyHidden>
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-y-auto -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (error) =>
                console.log(error)
              )}
              className="grid grid-cols-2 gap-x-2 gap-y-1 items-start"
            >
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-1 max-sm:col-span-2">
                    <FormLabel className="font-bold">
                      Loại <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Loại" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="overflow-y-auto max-h-[200px]">
                            <SelectItem value="37" key={37}>
                              Gia hạn
                            </SelectItem>
                            <SelectItem value="36" key={36}>
                              Thu hồi
                            </SelectItem>
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
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-leftcol-span-1 max-sm:col-span-2">
                    <FormLabel className="font-bold">
                      Số giấy phép <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Số giấy phép" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="licenseDate"
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
                        disabled
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
                      Ngày gia hạn/thu hồi{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        placeholder="Ngày gia hạn/thu hồi"
                        selected={field.value}
                        onSelect={field.onChange}
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
                  disabled={addMutation.isPending}
                >
                  {addMutation.isPending && (
                    <Loader2 className="animate-spin mr-2" />
                  )}
                  Lưu
                </Button>
                <Button
                  type="button"
                  className="border border-[#C3ECF5] bg-white text-default-blue hover:bg-[#C3ECF5]"
                  onClick={() => closeForm()}
                  disabled={addMutation.isPending}
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

export default LawyerLicenseModal;
