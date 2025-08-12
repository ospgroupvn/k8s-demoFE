"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa6";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập Tài khoản!"),
  password: z.string().min(1, "Vui lòng nhập Mật khẩu!"),
});

interface LoginModalProps {
  children: React.ReactNode;
}

const LoginModal = ({ children }: LoginModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowPass, setIsShowPass] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const loginForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (params?.get("reason") === "expired") {
      toast.error("Phiên đăng nhập đã hết hạn!", {
        richColors: true,
        position: "top-right",
      });
    }
  }, [params]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!loading) {
      setLoading(true);
      await signIn("login", {
        ...values,
        cf_turnstile_response: captchaToken,
        redirect: false,
      })
        .then((res) => {
          if (res?.ok && !res?.error) {
            setOpen(false);
            router.refresh();
            router.push("/trang_chu");
          } else if (res?.error) {
            setError(res?.error);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[420px] max-w-[95%] p-0 rounded-sm border border-[#e8e8e8]">
        <DialogHeader className="py-3 rounded-none">
          <DialogTitle className="mx-4 py-2 font-bold text-xl text-[#333] border-b-3 border-[#0076C8]">
            ĐĂNG NHẬP
          </DialogTitle>
          <DialogDescription hidden>Login</DialogDescription>
        </DialogHeader>

        <div className="bg-white p-6 pt-2">
          <Collapsible open={!!error}>
            <CollapsibleContent className="p-2.5 mb-5 border rounded text-[#a94442] bg-[#f2dede] text-xs">
              {error}
            </CollapsibleContent>
          </Collapsible>

          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#717171] text-sm">
                      Tài khoản đăng nhập
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Nhập tài khoản..."
                          {...field}
                          className="rounded-sm border-[#ccc] focus:border-[#0076C8]"
                          onPaste={(e) => field.onChange(e.currentTarget.value)}
                          onKeyDown={() => setError("")}
                        />
                        <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999] w-4 h-4" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#717171] text-sm">
                      Mật khẩu
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isShowPass ? "text" : "password"}
                          placeholder="Nhập mật khẩu..."
                          {...field}
                          className="pr-10 rounded-sm border-[#ccc] focus:border-[#0076C8]"
                        />
                        <div
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#999]"
                          onClick={() => setIsShowPass(!isShowPass)}
                        >
                          {isShowPass ? (
                            <BsEyeSlashFill size={16} />
                          ) : (
                            <BsEyeFill size={16} />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between py-2">
                <div className="flex gap-x-2">
                  <Checkbox
                    id="remember"
                    checked={isRememberMe}
                    onCheckedChange={(checked) =>
                      setIsRememberMe(checked === true)
                    }
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-[#717171] cursor-pointer"
                  >
                    Ghi nhớ
                  </label>
                </div>
                <Button
                  type="submit"
                  className="bg-[#0076C8] hover:bg-[#026AB3] rounded-sm text-white py-2.5 text-sm font-medium"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Đăng nhập
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
