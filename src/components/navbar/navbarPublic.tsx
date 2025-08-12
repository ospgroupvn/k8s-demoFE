import Logo from "@/assets/images/Logo.png";
import { SCREENS_SIZE } from "@/constants/common";
import useWindowSize from "@/hooks/useWindowResize";
import { cn } from "@/lib/utils";
import {
  setIsMobile,
  setIsOpenMenuMobile,
  setSidebarCollapse,
} from "@/redux/features/systemSlice";
import { useAppDispatch, useAppSelector } from "@/redux/Hooks";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { FaUser } from "react-icons/fa6";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import LoginModal from "./loginModal";
import styles from "./style.module.css";

const NavbarPublic = () => {
  const isMobile = useAppSelector((state) => state.systemStateReducer.isMobile);
  const dispatch = useAppDispatch();

  const windowSize = useWindowSize();
  useEffect(() => {
    if (windowSize && windowSize.width <= SCREENS_SIZE.md) {
      dispatch(setIsMobile({ isMobile: true }));
      dispatch(setSidebarCollapse({ collapsed: false }));
    } else {
      dispatch(setIsMobile({ isMobile: false }));
      dispatch(setIsOpenMenuMobile({ isOpenMenuMobile: false }));
    }
  }, [dispatch, windowSize]);

  const menuItems: { name: string; href: string; disabled?: boolean }[] = [
    {
      name: "Công chứng",
      href: "/public/cong_chung",
    },
    {
      name: "Đấu giá",
      href: "/public/dau_gia",
    },
    {
      name: "Luật sư",
      href: "/public/luat_su",
    },
    {
      name: "Thừa phát lại",
      href: "/public/thua_phat_lai",
      disabled: true,
    },
    {
      name: "Giám định tư pháp",
      href: "/public/giam_dinh_tu_phap",
      disabled: true,
    },
    {
      name: "Hòa giải thương mại",
      href: "/public/hoa_giai_thuong_mai",
      disabled: true,
    },
    {
      name: "Trọng tài thương mại",
      href: "/public/trong_tai_thuong_mai",
      disabled: true,
    },
    {
      name: "Tư vấn pháp luật",
      href: "/public/tu_van_phap_luat",
      disabled: true,
    },
    {
      name: "Quản tài viên",
      href: "/public/quan_tai_vien",
      disabled: true,
    },
  ];

  const pathname = usePathname();
  return (
    <>
      <header
        className={cn(
          "flex h-16 w-full items-center min-h-[64px] bg-white z-50"
        )}
      >
        <div
          className={cn(
            "flex items-center text-white p-4 gap-x-3 w-full",
            isMobile ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center gap-x-3">
            <Image
              src={Logo}
              height={48}
              width={48}
              alt="logo Sở Tư pháp"
              priority
              className="rounded-full border-2 border-white"
            />
            {!isMobile && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold uppercase text-[#555]">
                  TRANG THÔNG TIN ĐIỆN TỬ
                </span>
                <span className="text-lg font-bold uppercase text-default-blue">
                  QUẢN LÝ LĨNH VỰC BỔ TRỢ TƯ PHÁP
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex justify-center align-middle self-center cursor-pointer">
              <LoginModal>
                <button className="bg-[#FFA600] hover:bg-[#FFA600]/60 text-white px-4 py-2 rounded-lg flex gap-x-2 items-center text-sm font-medium transition-colors">
                  <FaUser height={16} width={16} />
                  Đăng nhập
                </button>
              </LoginModal>
            </div>
          </div>
        </div>
      </header>
      <div
        className={cn(
          "w-full flex flex-wrap items-center justify-center bg-[#0076C8] py-0 h-12 overflow-x-auto shadow-md",
          styles.navbarMobile
        )}
      >
        <NavigationMenu className={cn("w-full [&_div]:w-full")}>
          <NavigationMenuList className={cn(`justify-center px-2 gap-1`)}>
            {menuItems.map((item) => (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuLink
                  href={item.href}
                  className={cn(
                    "py-2 px-4 uppercase font-medium text-xs whitespace-nowrap rounded-none transition-colors",
                    pathname === item.href
                      ? "text-white bg-[#026AB3] shadow-sm border-b-2 border-[#FFA600]"
                      : "text-white hover:text-white border-b-2 border-b-transparent hover:bg-[#026AB3] hover:border-[#FFA600] hover:shadow-sm",
                    item.disabled && "cursor-not-allowed opacity-75"
                  )}
                  active={pathname === item.href && !item.disabled}
                >
                  {item.name}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
};

export default NavbarPublic;
