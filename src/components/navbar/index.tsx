"use client";

import Logo from "@/assets/images/Logo.png";
import { SCREENS_SIZE } from "@/constants/common";
import useWindowSize from "@/hooks/useWindowResize";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/redux/Hooks";
import { setIsOpenMenuMobile } from "@/redux/features/systemSlice";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { BsList } from "react-icons/bs";
import { FaCaretDown, FaUserCircle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Navbar = () => {
  const { data: session, status } = useSession();
  const userInfo = session?.user;
  const windowSize = useWindowSize();
  const isMobile = windowSize.width > 0 && windowSize.width <= SCREENS_SIZE.md;
  const dispatch = useAppDispatch();

  return (
    <header
      className={cn(
        "flex h-14 w-full items-center min-h-[56px] bg-[#057CCE] shadow-md z-50",
        isMobile ? " fixed top-0 flex justify-between" : "sticky top-0"
      )}
    >
      {isMobile && (
        <div
          className="cursor-pointer ml-2"
          onClick={() => {
            dispatch(setIsOpenMenuMobile({ isOpenMenuMobile: true }));
          }}
        >
          <BsList color="black" size={32} />
        </div>
      )}
      <div
        className={cn(
          "flex items-center text-black p-2 gap-x-2 justify-between",
          !isMobile && "w-full"
        )}
      >
        {!isMobile && (
          <div className="space-x-2 flex items-center font-bold text-xl text-white">
            <Image src={Logo} height={46} width={46} alt="logo Sở Tư pháp" />
            <span>TRANG THÔNG TIN ĐIỆN TỬ QUẢN LÝ LĨNH VỰC BỔ TRỢ TƯ PHÁP</span>
          </div>
        )}

        <div className="relative flex justify-center align-middle self-center cursor-pointer">
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <menu className="flex flex-row mt-1 mr-1">
                  {isMobile ? (
                    <FaUserCircle color="black" size={32} />
                  ) : (
                    <>
                      <div
                        className="self-center ml-1 text-white text-[13px] min-w-[40px] max-w-[300px] text-left line-clamp-2"
                        title={userInfo?.fullName || "-"}
                      >
                        {userInfo?.fullName || "-"}
                      </div>
                      <FaCaretDown className="self-center text-white text-[13px] ml-1" />
                    </>
                  )}
                </menu>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50">
                {isMobile && (
                  <>
                    <DropdownMenuItem className="font-bold cursor-text pointer-events-none break-words max-w-[150px]">
                      <div className="line-clamp-2">
                        {userInfo?.fullName || "-"}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {/* <DropdownMenuItem className="cursor-pointer">
                <Link href={LinkItems.CHANGE_PASS.href}>
                  Đổi mật khẩu
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator /> */}
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    window.localStorage.setItem("selectCompany", "");
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            status === "unauthenticated" && (
              <Link href={"/login"} className="text-[#718096]">
                Đăng nhập
              </Link>
            )
          )}
        </div>
      </div>

      {/* <AlertDialog open={visible} onOpenChange={setVisible}>
        <AlertDialogContent className="w-52 flex flex-col justify-center items-center">
          <div>{c("toast.changingCompany")}</div>
          <Loader2 className="w-4 h-4 animate-spin" />
        </AlertDialogContent>
      </AlertDialog> */}
    </header>
  );
};

export { Navbar };

