import AutoCompleteSearch from "@/components/common/autoCompleteSearch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { USER_TYPE, USER_TYPE_LIST } from "@/constants/common";
import { addUser } from "@/service/admin";
import { ProvinceItem } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  provinceList: ProvinceItem[];
  refetch: () => void;
}

const formSchema = z
  .object({
    username: z
      .string()
      .trim()
      .refine((val) => val?.length > 0, {
        message: "Vui lòng nhập Tên tài khoản",
      }),
    fullName: z
      .string()
      .trim()
      .refine((val) => val?.length > 0, {
        message: "Vui lòng nhập Tên người dùng",
      }),
    type: z
      .string()
      .trim()
      .refine(
        (val) => {
          return val?.length > 0;
        },
        { message: "Vui lòng chọn Loại người dùng" }
      ),
    password: z
      .string()
      .trim()
      .refine((val) => val?.length > 0, {
        message: "Vui lòng nhập Mật khẩu",
      }),
    repeatPassword: z.string().trim().optional(),
    administrationId: z.string().trim().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.type === USER_TYPE.SO_TU_PHAP.toString() && !val.administrationId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn Tỉnh/Thành phố",
        path: ["administrationId"],
      });
    }

    if (!val.repeatPassword?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng nhập lại Mật khẩu",
        path: ["repeatPassword"],
      });
    } else if (
      val.repeatPassword?.length &&
      val.repeatPassword !== val.password
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mật khẩu không trùng khớp",
        path: ["repeatPassword"],
      });
    }
  });

const AddUserModal = ({ open, setOpen, provinceList, refetch }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullName: "",
      type: "",
      administrationId: "",
      password: "",
    },
  });

  const typeValue = form.watch("type");

  const addMutation = useMutation({
    mutationFn: addUser,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addMutation.mutate(
      {
        username: values.username,
        fullName: values.fullName,
        type: Number(values.type),
        administrationId: Number(values.administrationId || "0"),
        password: values.password,
      },
      {
        onSuccess: (data) => {
          if (data?.success) {
            toast.success("Thêm mới người dùng thành công");

            refetch();
            setOpen(false);
            form.reset();
          } else {
            toast.error("Thêm mới người dùng không thành công!");
          }
        },
        onError: () => {
          toast.error("Thêm mới người dùng không thành công!");
        },
      }
    );
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
      <DialogContent className="min-w-[800px] max-h-[500px] z-50 flex flex-col pb-4 max-sm:max-w-full max-sm:min-w-0">
        <DialogHeader className="border-b border-b-[#EBEBF0] pb-4 -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
          <DialogTitle className="font-bold">THÊM MỚI NGƯỜI DÙNG</DialogTitle>
          <DialogDescription>
            <VisuallyHidden>Thêm mới người dùng</VisuallyHidden>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-full overflow-y-auto -mx-6 px-6 max-sm:-mx-2 max-sm:px-2 pb-4"
          >
            <div className="grid grid-cols-4 gap-x-2 gap-y-3 items-start">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-4">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Tên tài khoản<span className="text-red-500">(*)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập Tên tài khoản"
                        {...field}
                        maxLength={50}
                        onChange={(event) => {
                          field.onChange(event?.target.value);
                          form.trigger("username");
                        }}
                        className={getFieldBorder("username")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-4">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Tên người dùng<span className="text-red-500">(*)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập Tên người dùng"
                        {...field}
                        maxLength={100}
                        onChange={(event) => {
                          field.onChange(event?.target.value);
                          form.trigger("fullName");
                        }}
                        className={getFieldBorder("fullName")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-4">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Mật khẩu<span className="text-red-500">(*)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập Mật khẩu"
                        {...field}
                        type="password"
                        maxLength={100}
                        onChange={(event) => {
                          field.onChange(event?.target.value);
                          form.trigger("password");
                        }}
                        className={getFieldBorder("password")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="repeatPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-4">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Nhập lại mật khẩu<span className="text-red-500">(*)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập lại Mật khẩu"
                        {...field}
                        type="password"
                        maxLength={100}
                        onChange={(event) => {
                          field.onChange(event?.target.value);
                          form.trigger("repeatPassword");
                        }}
                        className={getFieldBorder("repeatPassword")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-4">
                    <FormLabel className="font-bold max-sm:text-xs">
                      Loại người dùng<span className="text-red-500">(*)</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.trigger("type");
                        }}
                      >
                        <SelectTrigger className={getFieldBorder("type")}>
                          <SelectValue placeholder="Chọn loại người dùng" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="overflow-y-auto max-h-[200px]">
                            {USER_TYPE_LIST.map((item) => (
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

              {typeValue === USER_TYPE.SO_TU_PHAP.toString() ||
              typeValue === USER_TYPE.DOAN_LUAT_SU.toString() ? (
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
                          displayKey="name"
                          selectPlaceholder="Chọn Tỉnh/Thành phố"
                          emptyMsg="Không tìm thấy dữ liệu"
                          onSelect={(value) => {
                            field.onChange(value?.code?.toString() || "");
                          }}
                          optionKey="code"
                          options={provinceList || []}
                          placeholder="Tìm kiếm theo tên Tỉnh/Thành phố"
                          value={field.value || ""}
                          valueKey="code"
                          triggerClassName={getFieldBorder("administrationId")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <></>
              )}
            </div>
          </form>
        </Form>

        <DialogFooter className="flex items-center max-sm:flex-row gap-1">
          <Button
            type="button"
            className="border border-default-blue bg-default-blue text-white hover:bg-white hover:text-default-blue"
            onClick={() => form.handleSubmit(onSubmit)()}
            disabled={addMutation.isPending}
          >
            {addMutation?.isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <></>
            )}
            Thêm mới
          </Button>
          <Button
            type="button"
            className="border border-[#C3ECF5] bg-white text-default-blue hover:bg-[#C3ECF5]"
            onClick={() => {
              form.clearErrors();
              setOpen(false);
              form.reset();
            }}
            disabled={addMutation.isPending}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
