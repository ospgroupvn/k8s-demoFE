"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LinkItems } from "@/constants/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import * as z from "zod";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { toast } from "sonner";
import Script from "next/script";

const FormLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowPass, setIsShowPass] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const turnstileRef = useRef<HTMLDivElement | null>(null);

  const formSchema = z.object({
    username: z.string().min(1, "Vui lòng nhập Tài khoản!"),
    password: z.string().min(1, "Vui lòng nhập Mật khẩu!"),
  });

  const params = useSearchParams();

  const loginForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (document) {
      document.title = `Đăng nhập`;
    }
  }, []);

  useEffect(() => {
    if (params?.get("reason") === "expired") {
      toast.error("Phiên đăng nhập đã hết hạn!", {
        richColors: true,
        position: "top-right",
      });
    }
  }, [params]);

  // const renderCaptcha = () => {
  //   if (window.turnstile && turnstileRef.current) {
  //     window.turnstile.render(turnstileRef.current, {
  //       sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY,
  //       callback: (token: string) => {
  //         setCaptchaToken(token);
  //       },
  //       theme: "light",
  //       language: "vi-VN",
  //     });
  //   }
  // };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // if (!captchaToken) {
    //   toast.error("Captcha không hợp lệ!");
    //   return;
    // }

    if (!loading) {
      setLoading(true);
      await signIn("login", {
        ...values,
        cf_turnstile_response: captchaToken,
        redirect: false,
      })
        .then((res) => {
          if (res?.ok && !res?.error) {
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

  redirect("/trang_chu");

  // return (
  //   <>
  //     {/* <Script
  //       src="https://challenges.cloudflare.com/turnstile/v0/api.js"
  //       async
  //       defer
  //       onLoad={() => renderCaptcha()}
  //     ></Script> */}

  //     <div className="flex items-center justify-center h-screen w-screen">
  //       <Card className="w-[420px] rounded-none border border-[#e8e8e8] max-sm:w-[95%]">
  //         <CardHeader className="py-2.5 bg-[#f5f5f5] border-b border-[#e8e8e8] rounded-none">
  //           <CardTitle className="text-center font-bold text-xl text-[#333]">
  //             Đăng nhập hệ thống
  //           </CardTitle>
  //         </CardHeader>
  //         <CardContent className="bg-white p-7 border-b rounded-2xl">
  //           <Collapsible open={!!error}>
  //             <CollapsibleContent className="p-2.5 mb-5 border rounded border-[#ebccd1] text-[#a94442] bg-[#f2dede] text-xs">
  //               {error}
  //             </CollapsibleContent>
  //           </Collapsible>
  //           <Form {...loginForm}>
  //             <form onSubmit={loginForm.handleSubmit(onSubmit)}>
  //               <FormField
  //                 control={loginForm.control}
  //                 name="username"
  //                 render={({ field }) => (
  //                   <FormItem className="pb-2">
  //                     <FormLabel className="text-[#717171]">
  //                       Tài khoản
  //                     </FormLabel>
  //                     <FormControl className="col-span-2">
  //                       <Input
  //                         placeholder={"Tài khoản"}
  //                         {...field}
  //                         className="pr-8 rounded-none"
  //                         onPaste={(e) => field.onChange(e.currentTarget.value)}
  //                         onKeyDown={() => setError("")}
  //                       />
  //                     </FormControl>
  //                     <FormMessage />
  //                   </FormItem>
  //                 )}
  //               />
  //               <FormField
  //                 control={loginForm.control}
  //                 name="password"
  //                 render={({ field }) => (
  //                   <FormItem className="pb-2">
  //                     <FormLabel className="text-[#717171]">Mật khẩu</FormLabel>
  //                     <FormControl className="col-span-2">
  //                       <div className="relative w-full">
  //                         <Input
  //                           type={isShowPass ? "text" : "password"}
  //                           placeholder="Mật khẩu"
  //                           {...field}
  //                           className="pr-8 rounded-none"
  //                         />
  //                         <div
  //                           className="absolute z-10 cursor-pointer right-3 top-[50%] translate-y-[-50%] "
  //                           onClick={() => {
  //                             setIsShowPass(!isShowPass);
  //                           }}
  //                         >
  //                           {isShowPass ? (
  //                             <BsEyeSlashFill size={16} />
  //                           ) : (
  //                             <BsEyeFill size={16} />
  //                           )}
  //                         </div>
  //                       </div>
  //                     </FormControl>
  //                     <FormMessage />
  //                   </FormItem>
  //                 )}
  //               />

  //               {/* <div
  //                 ref={turnstileRef}
  //                 className="flex justify-center items-center"
  //               /> */}

  //               {/* <div className="flex justify-between items-center">
  //               <div className="flex items-center space-x-2 my-2">
  //                 <Checkbox
  //                   aria-label="checkbox"
  //                   id="terms"
  //                   checked={checked}
  //                   onCheckedChange={setChecked}
  //                 />
  //                 <Label htmlFor="terms" className="pl-5 text-[#717171]">
  //                   {t("rememberPassword")}
  //                 </Label>
  //               </div>
  //             </div> */}
  //               <Button className="bg-default-blue border border-default-blue hover:bg-white hover:text-default-blue rounded-none my-2.5 w-full">
  //                 {loading && (
  //                   <Loader2 className=" mr-4 h-6 w-6 animate-spin" />
  //                 )}{" "}
  //                 Đăng nhập
  //               </Button>
  //               <hr className="border-t border-dotted border-t-[#ececec] bg-transparent"></hr>
  //             </form>
  //           </Form>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   </>
  // );
};

export default FormLogin;
