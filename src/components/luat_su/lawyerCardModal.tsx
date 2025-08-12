import { LICENSE_TYPE, OWNER_TYPE } from "@/constants/luat_su";
import { addCard, updateCard } from "@/service/lawyer";
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

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: LsCardLicenses;
  lawyerData?: FullLawyerItem;
  isEdit: boolean;
  refetch: () => void;
}

const formSchema = z.object({
  licenseNumber: z.string().trim(),
  issueDate: z.date(),
  type: z.string().optional(),
});

const LawyerCardModal = ({
  open,
  setOpen,
  data,
  isEdit,
  refetch,
  lawyerData,
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      licenseNumber: "",
      issueDate: undefined,
    },
  });

  const addMutation = useMutation({
    mutationFn: addCard,
  });

  const updateMutation = useMutation({
    mutationFn: updateCard,
  });

  useEffect(() => {
    if (data && isEdit) {
      form.reset({
        type: data?.status?.toString(),
        licenseNumber: data?.licenseNumber,
        issueDate: data?.issueDate ? new Date(data?.issueDate) : undefined,
      });
    } else if (!isEdit) {
      form.reset({ type: "25", licenseNumber: "", issueDate: undefined });
    }
  }, [data, form, isEdit]);

  const closeForm = () => {
    form.clearErrors();
    setOpen(false);
    form.reset({ type: "", licenseNumber: "", issueDate: undefined });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!lawyerData) {
      return;
    }

    if (!isEdit) {
      addMutation.mutate(
        {
          status: Number(values.type),
          issueDate: values.issueDate.toISOString(),
          ownerId: lawyerData?.lawyerId,
          licenseType: LICENSE_TYPE.THE_LS,
          licenseNumber: values.licenseNumber,
          ownerType: OWNER_TYPE.LAWYER,
          isDomestic: lawyerData.isDomestic,
        },
        {
          onSuccess: () => {
            toast.success("Thêm mới thông tin thẻ thành công!");
            refetch();
            closeForm();
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data?.message ||
                "Thêm mới thông tin thẻ thất bại!"
            );
          },
        }
      );
    } else if (data) {
      updateMutation.mutate(
        {
          ...data,
          status: Number(values.type),
          issueDate: values.issueDate.toISOString(),
          isDomestic: lawyerData?.isDomestic,
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
            CHI TIẾT THẺ LUẬT SƯ TRONG NƯỚC
          </DialogTitle>
          <DialogDescription>
            <VisuallyHidden>Chi tiết thẻ luật sư</VisuallyHidden>
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
                            <SelectItem value="25" key={25}>
                              Cấp mới
                            </SelectItem>
                            <SelectItem value="26" key={26}>
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
                      Số thẻ Luật sư <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Số thẻ Luật sư"
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

export default LawyerCardModal;
