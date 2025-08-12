import { ChevronRight } from "lucide-react";
import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { hasPermission } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBuilding,
  FaChartPie,
  FaCog,
  FaHome,
  FaUserTie,
} from "react-icons/fa";
import { USER_TYPE } from "@/constants/common";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const session = useSession();

  const data = {
    navMain: [
      {
        title: "Trang chủ",
        url: "/trang_chu",
        icon: <FaHome size={18} />,
        hidden: false,
      },
      {
        title: "Quản lý chức danh",
        icon: <FaUserTie size={18} />,
        isActive: false,
        items: [
          {
            title: "Công chứng viên",
            url: "/cong_chung/cong_chung_vien",
            isActive: false,
            hidden: session?.data?.user?.type === USER_TYPE.DOAN_LUAT_SU,
          },
          {
            title: "Đấu giá viên",
            url: "/dau_gia/dau_gia_vien",
            hidden: session?.data?.user?.type === USER_TYPE.DOAN_LUAT_SU,
          },
          {
            title: "Luật sư",
            hidden:
              session?.data?.user?.type !== USER_TYPE.ADMIN &&
              session?.data?.user?.type !== USER_TYPE.DOAN_LUAT_SU,
            items: [
              {
                title: "Luật sư trong nước",
                url: "/luat_su/trong_nuoc",
                isActive: false,
                hidden: false,
              },
              {
                title: "Luật sư nước ngoài",
                url: "/luat_su/nuoc_ngoai",
                isActive: false,
              },
            ],
          },
        ],
      },
      {
        title: "Quản lý tổ chức",
        icon: <FaBuilding size={18} />,
        items: [
          {
            title: "Công chứng",
            url: "/cong_chung/to_chuc",
            hidden: session?.data?.user?.type === USER_TYPE.DOAN_LUAT_SU,
          },
          {
            title: "Đấu giá",
            url: "/dau_gia/to_chuc",
            isActive: false,
            hidden: session?.data?.user?.type === USER_TYPE.DOAN_LUAT_SU,
          },
          {
            title: "Luật sư",
            hidden:
              session?.data?.user?.type !== USER_TYPE.ADMIN &&
              session?.data?.user?.type !== USER_TYPE.DOAN_LUAT_SU,
            items: [
              {
                title: "Luật sư trong nước",
                url: "/luat_su/to_chuc_trong_nuoc",
                isActive: false,
              },
              {
                title: "Luật sư nước ngoài",
                url: "/luat_su/to_chuc_nuoc_ngoai",
                isActive: false,
              },
            ],
          },
        ],
      },
      {
        title: "Báo cáo và thống kê",
        icon: <FaChartPie size={18} />,
        hidden:
          session?.data?.user?.type !== USER_TYPE.ADMIN &&
          session?.data?.user?.type !== USER_TYPE.CUC_BO_TRO,
        items: [
          {
            title: "Công chứng",
            items: [
              {
                title: "Báo cáo số liệu tổ chức HNCC",
                url: "/cong_chung/bao_cao_to_chuc",
                isActive: false,
              },
              {
                title: "Tình hình hoạt động TC HNCC",
                url: "/cong_chung/tinh_hinh_hoat_dong",
                isActive: false,
              },
              {
                title: "Báo cáo bổ nhiệm CCV",
                url: "/cong_chung/bao_cao_bo_nhiem",
                isActive: false,
              },
              {
                title: "Báo cáo xử lý vi phạm của CCV",
                url: "/cong_chung/bao_cao_vi_pham_ccv",
                isActive: false,
              },
              {
                title: "Báo cáo xử lý vi phạm của tổ chức HNCC",
                url: "/cong_chung/bao_cao_vi_pham_tc",
                isActive: false,
              },
              {
                title: "Nhập dữ liệu hoạt động HNCC",
                url: "/cong_chung/hoat_dong",
                isActive: false,
                hidden: !hasPermission(
                  "ROLE_NOTARY_ACTIVITY_VIEW",
                  session.data?.user?.authorities || []
                ),
              },
              {
                title: "Báo cáo hoạt động công chứng",
                url: "/cong_chung/bao_cao_hoat_dong",
                isActive: false,
                hidden: !hasPermission(
                  "ROLE_NOTARY_ACTIVITY_VIEW",
                  session.data?.user?.authorities || []
                ),
              },
            ],
          },
          {
            title: "Đấu giá",
            items: [
              {
                title: "Báo cáo số liệu tổ chức HNĐG",
                url: "/dau_gia/bao_cao_to_chuc",
                isActive: false,
              },
              {
                title: "Tình hình hoạt động tổ chức HNĐG",
                url: "/dau_gia/tinh_hinh_hoat_dong",
                isActive: false,
              },
              {
                title: "Báo cáo quản lý thẻ Đấu giá viên",
                url: "/dau_gia/bao_cao_the",
                isActive: false,
              },
              {
                title: "Tổng hợp công khai đấu giá",
                url: "/dau_gia/bao_cao_thong_bao",
                isActive: false,
              },
              {
                title: "Tổng hợp thông báo lựa chọn đơn vị đấu giá",
                url: "/dau_gia/thong_bao_lua_chon",
                isActive: false,
              },
              {
                title: "Thống kê công việc đấu giá tài sản",
                url: "/dau_gia/thong_ke_cong_viec",
                isActive: false,
              },
            ],
          },
          {
            title: "Luật sư",
            hidden: session?.data?.user?.type !== USER_TYPE.ADMIN,
            items: [
              {
                title: "Báo cáo cấp chứng chỉ HNLS",
                url: "/luat_su/chung_chi_luat_su",
                isActive: false,
              },
              {
                title: "Báo cáo số liệu Tổ chức HNLS",
                url: "/luat_su/bao_cao_to_chuc",
                isActive: false,
              },
              {
                title: "Báo cáo số liệu Luật sư",
                url: "/luat_su/bao_cao_luat_su",
                isActive: false,
              },
              {
                title: "Tình hình hoạt động của tổ chức HNLS",
                url: "/luat_su/hoat_dong_to_chuc",
                isActive: false,
              },
              {
                title: "Tình hình hoạt động của Luật sư",
                url: "/luat_su/hoat_dong_luat_su",
                isActive: false,
              },
            ],
          },
        ],
      },
      {
        title: "Quản lý hệ thống",
        icon: <FaCog size={18} />,
        hidden: session?.data?.user?.type !== USER_TYPE.ADMIN,
        items: [
          // {
          //   title: "Quản lý nhóm quyền",
          //   url: "/admin/nhom_quyen",
          //   isActive: false,
          // },
          {
            title: "Quản lý người dùng",
            url: "/admin/user",
            isActive: false,
          },
          {
            title: "Lịch sử hệ thống",
            url: "/admin/lich_su_he_thong",
            isActive: false,
          },
        ],
      },
    ],
  };

  // Helper function to check if any nested item is active
  const hasNestedActiveChild = (items: any[]): boolean => {
    return items.some((child) => {
      if (child.url && pathname.includes(child.url)) return true;
      if (child.items) return hasNestedActiveChild(child.items);
      return false;
    });
  };

  // Helper function to render nested menu items
  const renderNestedItems = (items: any[], level = 2) => {
    return items
      .filter((item) => !item.hidden)
      .map((item) => {
        if (item.items) {
          // Third level collapsible
          const hasActiveChild = hasNestedActiveChild(item.items);
          return (
            <Collapsible
              key={item.title}
              defaultOpen={hasActiveChild}
              className="group/collapsible"
            >
              <SidebarMenuSubItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuSubButton
                    size="md"
                    className="group/trigger cursor-pointer"
                  >
                    {item.title}
                    <ChevronRight className="!text-primary group-hover/trigger:!text-white ml-auto h-3 w-3 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuSubButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="border-none pr-0 mr-0 ml-4">
                    {renderNestedItems(item.items, level + 1)}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuSubItem>
            </Collapsible>
          );
        } else {
          // Leaf item
          return (
            <SidebarMenuSubItem key={item.title}>
              <Link href={item.url || "#"}>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathname.includes(item.url)}
                  size="md"
                  className="cursor-pointer"
                >
                  <span>{item.title}</span>
                </SidebarMenuSubButton>
              </Link>
            </SidebarMenuSubItem>
          );
        }
      });
  };

  return (
    <Sidebar {...props} className="top-14 h-[calc(100vh_-_56px)] bg-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain
              .filter((item) => !item.hidden)
              .map((item, index) => {
                const hasActiveChild = item.items?.some((child: any) => {
                  if (child.url && pathname.includes(child.url)) return true;
                  if (child.items) return hasNestedActiveChild(child.items);
                  return false;
                });
                return (
                  <Collapsible
                    key={item.title}
                    defaultOpen={hasActiveChild}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      {item.items?.length ? (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              className="font-semibold text-base"
                              size="lg"
                            >
                              {item.icon || <></>}
                              {item.title}{" "}
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub className="border-none pr-0 mr-0">
                              {renderNestedItems(item.items)}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : (
                        <Link href={item.url || "#"}>
                          <SidebarMenuButton
                            className="font-semibold text-base"
                            size="lg"
                            isActive={
                              !!item?.url && pathname.includes(item?.url)
                            }
                          >
                            <span className="flex items-center gap-2 h-full">
                              {item.icon || <></>}
                              {item.title}
                            </span>
                          </SidebarMenuButton>
                        </Link>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
