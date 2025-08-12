interface Sidebar {
  [x: string]: {
    label: string;
    href: string;
    public: boolean;
    permission?: string;
  }[];
}

export const SidebarItems: Sidebar = {
  CONG_CHUNG: [
    { label: "Tổng hợp số liệu", href: "/cong_chung", public: true },
    {
      label: "Tổ chức hành nghề công chứng",
      href: "/cong_chung/to_chuc",
      public: true,
    },
    {
      label: "Công chứng viên",
      href: "/cong_chung/cong_chung_vien",
      public: true,
    },
    {
      label: "Báo cáo số liệu tổ chức HNCC",
      href: "/cong_chung/bao_cao_to_chuc",
      public: false,
    },
    {
      label: "Tình hình hoạt động TC HNCC",
      href: "/cong_chung/tinh_hinh_hoat_dong",
      public: false,
    },
    {
      label: "Báo cáo bổ nhiệm CCV",
      href: "/cong_chung/bao_cao_bo_nhiem",
      public: false,
    },
    {
      label: "Báo cáo xử lý vi phạm của CCV",
      href: "/cong_chung/bao_cao_vi_pham_ccv",
      public: false,
    },
    {
      label: "Báo cáo xử lý vi phạm của tổ chức HNCC",
      href: "/cong_chung/bao_cao_vi_pham_tc",
      public: false,
    },
    {
      label: "Nhập dữ liệu hoạt động HNCC",
      href: "/cong_chung/hoat_dong",
      public: false,
      permission: "ROLE_NOTARY_ACTIVITY_VIEW",
    },
    {
      label: "Báo cáo hoạt động công chứng",
      href: "/cong_chung/bao_cao_hoat_dong",
      public: false,
      permission: "ROLE_NOTARY_ACTIVITY_VIEW",
    },
  ],
  DAU_GIA: [
    { label: "Tổng hợp số liệu", href: "/dau_gia", public: true },
    {
      label: "Tổ chức hành nghề đấu giá",
      href: "/dau_gia/to_chuc",
      public: true,
    },
    {
      label: "Đấu giá viên",
      href: "/dau_gia/dau_gia_vien",
      public: true,
    },
    {
      label: "Báo cáo số liệu tổ chức HNĐG",
      href: "/dau_gia/bao_cao_to_chuc",
      public: false,
    },
    {
      label: "Tình hình hoạt động tổ chức HNĐG",
      href: "/dau_gia/tinh_hinh_hoat_dong",
      public: false,
    },
    {
      label: "Báo cáo quản lý thẻ Đấu giá viên",
      href: "/dau_gia/bao_cao_the",
      public: false,
    },
    {
      label: "Tổng hợp công khai đấu giá",
      href: "/dau_gia/bao_cao_thong_bao",
      public: false,
    },
    {
      label: "Tổng hợp thông báo lựa chọn đơn vị đấu giá",
      href: "/dau_gia/thong_bao_lua_chon",
      public: false,
    },
    {
      label: "Thống kê công việc đấu giá tài sản",
      href: "/dau_gia/thong_ke_cong_viec",
      public: false,
    },
  ],
  LUAT_SU: [
    { label: "Luật sư trong nước", href: "/luat_su/trong_nuoc", public: true },
    { label: "Luật sư nước ngoài", href: "/luat_su/nuoc_ngoai", public: true },
    {
      label: "Tổ chức HNLS trong nước",
      href: "/luat_su/to_chuc_trong_nuoc",
      public: true,
    },
    {
      label: "Tổ chức HNLS nước ngoài",
      href: "/luat_su/to_chuc_nuoc_ngoai",
      public: true,
    },
    {
      label: "Báo cáo cấp chứng chỉ HNLS",
      href: "/luat_su/chung_chi_luat_su",
      public: false,
    },
    {
      label: "Báo cáo số liệu Tổ chức HNLS",
      href: "/luat_su/bao_cao_to_chuc",
      public: false,
    },
    {
      label: "Báo cáo số liệu Luật sư",
      href: "/luat_su/bao_cao_luat_su",
      public: false,
    },
    {
      label: "Tình hình hoạt động của tổ chức HNLS",
      href: "/luat_su/hoat_dong_to_chuc",
      public: false,
    },
    {
      label: "Tình hình hoạt động của Luật sư",
      href: "/luat_su/hoat_dong_luat_su",
      public: false,
    },
  ],
  ADMIN: [
    {
      label: "Quản lý nhóm quyền",
      href: "/admin/nhom_quyen",
      public: false,
    },
    {
      label: "Quản lý người dùng",
      href: "/admin/user",
      public: false,
    },
  ],
};
