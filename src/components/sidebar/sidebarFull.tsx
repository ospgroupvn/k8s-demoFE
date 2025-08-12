"use client";
import Logo from "@/assets/images/Logo.png";
import { USER_TYPE } from "@/constants/common";
import { cn, hasPermission } from "@/lib/utils";
import { setIsOpenMenuMobile } from "@/redux/features/systemSlice";
import { useAppDispatch, useAppSelector } from "@/redux/Hooks";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { SidebarItems } from "./sidebarItems";

const SidebarFull = () => {
  const pathname = usePathname();
  const isMobile = useAppSelector((state) => state.systemStateReducer.isMobile);
  const dispatch = useAppDispatch();

  const { data, status } = useSession();

  const itemList = (type: "CONG_CHUNG" | "DAU_GIA" | "LUAT_SU" | "ADMIN") => {
    if (status === "loading" || status === "unauthenticated") {
      return SidebarItems[type]?.filter((item) => item.public);
    }

    return SidebarItems[type]?.filter(
      (item) =>
        !item.permission ||
        hasPermission(item.permission, data?.user?.authorities || [])
    );
  };

  useEffect(() => {
    if (pathname) {
      dispatch(setIsOpenMenuMobile({ isOpenMenuMobile: false }));
    }
  }, [dispatch, pathname]);

  const getDefaultValue = () => {
    if (pathname?.includes("luat_su")) {
      return "luat_su";
    }

    if (pathname?.includes("dau_gia")) {
      return "dau_gia";
    }

    if (pathname?.includes("admin")) {
      return "admin";
    }

    return "cong_chung";
  };

  return (
    <>
      {isMobile && (
        <div className="py-2 flex items-center justify-center relative">
          <Image src={Logo} height={64} alt="logo stp" />
          {isMobile && (
            <AiOutlineClose
              color="black"
              size={16}
              className="absolute right-4"
              onClick={() => {
                dispatch(setIsOpenMenuMobile({ isOpenMenuMobile: false }));
              }}
            />
          )}
        </div>
      )}
      {/* <li>
        <Link
          href="/"
          className={cn(
            "py-2 px-4 rounded-xl bg-white w-full h-full flex text-xs font-bold gap-x-2 items-center hover:shadow-md transition-all",
            pathname === "/" && "shadow-md"
          )}
        >
          <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-default-blue">
            <House width={16} height={16} color="white" />
          </div>
          Trang chủ
        </Link>
      </li> */}
      {/* <li className="font-bold text-xs py-3 mt-4 border-b border-b-[#E0E1E2]">
        CƠ SỞ DỮ LIỆU CÔNG CHỨNG
      </li> */}
      <div className="max-sm:grow max-sm:overflow-y-auto max-sm:-mx-1 max-sm:px-1">
        <Accordion defaultValue={getDefaultValue()} type="single" collapsible>
          <AccordionItem value="cong_chung">
            <AccordionTrigger
              className={cn(
                "text-white text-xs w-full p-3 text-left flex justify-between items-center",
                "group border-b-[#A5E3F0] border-b",
                pathname?.includes("/cong_chung")
                  ? "bg-[#2B8A9E]"
                  : "bg-[#3CC3DF]"
              )}
            >
              CƠ SỞ DỮ LIỆU CÔNG CHỨNG
            </AccordionTrigger>
            <AccordionContent className="flex flex-col">
              {itemList("CONG_CHUNG").map((item) => {
                return (
                  <Link
                    href={item.href}
                    key={item.href}
                    className={cn(
                      "pl-4 py-3 border-b border-b-[#E0E1E2] hover:bg-[#ECF9FC] hover:text-[#37B1CB] group/li",
                      pathname === item.href ? "bg-[#ECF9FC]" : "bg-white"
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs font-bold text-[#8C8C90] group-hover/li:text-[#37B1CB]",
                        pathname === item.href && "text-[#37B1CB]"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="dau_gia">
            <AccordionTrigger
              className={cn(
                "text-white text-xs w-full p-3 text-left flex justify-between items-center",
                "group border-b-[#A5E3F0] border-b",
                pathname?.includes("/dau_gia") ? "bg-[#2B8A9E]" : "bg-[#3CC3DF]"
              )}
            >
              CƠ SỞ DỮ LIỆU ĐẤU GIÁ
              {/* <ChevronUp className="group-data-[state=closed]:rotate-180 transition-all" /> */}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col">
              {itemList("DAU_GIA").map((item) => {
                return (
                  <Link
                    href={item.href}
                    key={item.href}
                    className={cn(
                      "pl-4 py-3 border-b border-b-[#E0E1E2] hover:bg-[#ECF9FC] hover:text-[#37B1CB] group/li",
                      pathname === item.href ? "bg-[#ECF9FC]" : "bg-white"
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs font-bold text-[#8C8C90] group-hover/li:text-[#37B1CB]",
                        pathname === item.href && "text-[#37B1CB]"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="luat_su">
            <AccordionTrigger
              className={cn(
                "text-white text-xs w-full p-3 text-left flex justify-between items-center",
                "group border-b-[#A5E3F0] border-b",
                pathname?.includes("/luat_su") ? "bg-[#2B8A9E]" : "bg-[#3CC3DF]"
              )}
            >
              CƠ SỞ DỮ LIỆU LUẬT SƯ
            </AccordionTrigger>
            <AccordionContent className="flex flex-col">
              {itemList("LUAT_SU").map((item) => {
                return (
                  <Link
                    href={item.href}
                    key={item.href}
                    className={cn(
                      "pl-4 py-3 border-b border-b-[#E0E1E2] hover:bg-[#ECF9FC] hover:text-[#37B1CB] group/li",
                      pathname === item.href ? "bg-[#ECF9FC]" : "bg-white"
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs font-bold text-[#8C8C90] group-hover/li:text-[#37B1CB]",
                        pathname === item.href && "text-[#37B1CB]"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </AccordionContent>
          </AccordionItem>

          {data?.user?.type === USER_TYPE.ADMIN ? (
            <>
              <AccordionItem value="admin">
                <AccordionTrigger
                  className={cn(
                    "text-white text-xs w-full p-3 text-left flex justify-between items-center",
                    "group border-b-[#A5E3F0] border-b",
                    pathname?.includes("/admin")
                      ? "bg-[#2B8A9E]"
                      : "bg-[#3CC3DF]"
                  )}
                >
                  QUẢN TRỊ HỆ THỐNG
                  {/* <ChevronUp className="group-data-[state=closed]:rotate-180 transition-all" /> */}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col">
                  {itemList("ADMIN").map((item) => {
                    return (
                      <Link
                        href={item.href}
                        key={item.href}
                        className={cn(
                          "pl-4 py-3 border-b border-b-[#E0E1E2] hover:bg-[#ECF9FC] hover:text-[#37B1CB] group/li",
                          pathname === item.href ? "bg-[#ECF9FC]" : "bg-white"
                        )}
                      >
                        <span
                          className={cn(
                            "text-xs font-bold text-[#8C8C90] group-hover/li:text-[#37B1CB]",
                            pathname === item.href && "text-[#37B1CB]"
                          )}
                        >
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </>
          ) : (
            <></>
          )}
        </Accordion>
      </div>
      {/* {sidebarItems.map((item, index) => {
          return (
            <li
              key={index}
              className={cn(
                "group flex select-none",
                "transition-colors duration-300 border-t border-[#fff]/5 last:border-b gap-4",
                isActive(item.href) && !item?.children?.length
                  ? "bg-default-blue text-white"
                  : "bg-[#fff] text-black",
                `${
                  !hasOneOfPermissions(
                    item?.role || [],
                    userInfo?.authorities || []
                  ) && item?.role
                    ? "hidden"
                    : ""
                }`
              )}
            >
              
            </li>
          );
        })} */}
    </>
  );
};

export default SidebarFull;
