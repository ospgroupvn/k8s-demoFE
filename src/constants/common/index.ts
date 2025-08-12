export const LinkItems = {
  HOME: {
    key: "home",
    href: "/",
    label: "Trang chủ",
  },
  CONG_CHUNG: {
    key: "cong_chung",
    href: "/cong_chung",
    label: "Cơ sở dữ liệu Công chứng",
    children: {
      TO_CHUC: {
        key: "to_chuc_cong_chung",
        href: "/cong_chung/to_chuc",
        label: "Tổ chức hành nghề công chứng",
      },
      CONG_CHUNG_VIEN: {
        key: "cong_chung_vien",
        href: "/cong_chung/cong_chung_vien",
        label: "Công chứng viên",
      },
      BAO_CAO_TO_CHUC: {
        key: "bao_cao_to_chuc",
        href: "/cong_chung/bao_cao_to_chuc",
        label: "Báo cáo số liệu tổ chức hành nghề công chứng",
      },
    },
  },
};

export const SCREENS_SIZE = {
  md: 768,
};

export const LIST_SIZE = [5, 10, 20];
export const PAGE_NUMBER = 1;

export const BAR_CHART_COLORS = [
  "#8979FF",
  "#FF928A",
  "#3CC3DF",
  "#FFAE4C",
  "#537FF1",
  "#6FD195",
  "#8C63DA",
  "#2BB7DC",
  "#1F94FF",
  "#F4CF3B",
  "#55C4AE",
];

export const USER_TYPE = {
  ADMIN: 45,
  CUC_BO_TRO: 40,
  SO_TU_PHAP: 30,
  DOAN_LUAT_SU: 10,
};

export const USER_TYPE_LIST = [
  {
    label: "Admin",
    value: USER_TYPE.ADMIN,
  },
  {
    label: "Cục bổ trợ",
    value: USER_TYPE.CUC_BO_TRO,
  },
  {
    label: "Sở Tư pháp",
    value: USER_TYPE.SO_TU_PHAP,
  },
  {
    label: "Đoàn Luật sư",
    value: USER_TYPE.DOAN_LUAT_SU,
  },
];

export const QUERY_KEY = {
  COMMON: {
    PROVINCE: "listProvince",
    NATION: "listNation",
    DEPARTMENT: "listDepartment",
    WARD: "listWard",
    PLACE_OF_ISSUE: "listPlaceOfIssue",
    AUCTION_ORG: "listAuctionOrg",
  },
  CONG_CHUNG: {
    SO_TU_PHAP: "administrationByType",
    TO_CHUC: "notaryOrg",
    CONG_CHUNG_VIEN: "notaryEmpl",
    TRANG_THAI_CCV: "notaryEmplStatus",
    BAO_CAO_TO_CHUC: "reportNotaryOrg",
    TINH_HINH_HOAT_DONG: "reportOperation",
    BAO_CAO_BO_NHIEM: "reportAppoint",
    VI_PHAM_CCV: "reportCCVViolation",
    VI_PHAM_TC: "reportOrgViolation",
    DASHBOARD: "notaryDashboard",
    ORG_DETAIL: "orgDetail",
    CCV_TIMELINE: "ccvTimeline",
    OPERATION: "notaryOperation",
    OPERATION_REPORT: "notaryOperationReport",
    BAO_CAO_TO_CHUC_QUAN: "reportNotaryOrgByDistrict",
    TRUONG_VAN_PHONG: "chiefNotaryOrg",
    DANH_SACH_CCV: "notaryEmplList",
  },
  DAU_GIA: {
    SO_TU_PHAP: "allOrganizationAuction",
    TO_CHUC: "auctionOrg",
    DAU_GIA_VIEN: "auctioneer",
    BAO_CAO_TO_CHUC: "reportAuctionOrg",
    TINH_HINH_HOAT_DONG: "reportAuctionOperation",
    DASHBOARD: "auctionDashboard",
    BAO_CAO_THE: "reportAuctionCard",
    BAO_CAO_THONG_BAO: "reportAuctionNotice",
    THONG_BAO_LUA_CHON: "reportNoticeAuctionAsset",
    DGV_TIMELINE: "dgvTimeline",
    THONG_KE_CONG_VIEC: "publicAuctionAssetReport",
    CHI_TIET_DGV: "auctioneerDetail",
    DANH_SACH_CHUNG_CHI: "auctioneerCertList",
    CHI_TIET_CHUNG_CHI: "auctioneerCertDetail",
    DOANH_NGHIEP: "listAuctionBusiness",
    CHI_TIET_DOANH_NGHIEP: "auctionBusinessDetail",
  },
  LUAT_SU: {
    LUAT_SU: "lawyer",
    TO_CHUC: "lawyerOrg",
    THE_LUAT_SU: "lawyerCard",
    LS_THUOC_TO_CHUC: "lawyerInOrg",
    DS_CHI_NHANH: "orgBranch",
    DASHBOARD_LUAT_SU: "lawyerDashboard",
    DASHBOARD_TO_CHUC: "orgDashboard",
    DS_DOAN_LS: "allLawyerAssoc",
    DS_TO_CHUC: "allLawyerOrg",
    TO_CHUC_TRONG_NUOC: "lawyerOrgDomestic",
    TO_CHUC_NUOC_NGOAI: "lawyerOrgForeign",
    DS_DAI_DIEN: "lawyerRep",
    DS_LUAT_SU_THUOC_TO_CHUC: "lawyerInOrg",
    BAO_CAO_TO_CHUC: "reportLawyerOrg",
    BAO_CAO_TO_CHUC_ALL: "reportLawyerOrgAll",
    BAO_CAO_LUAT_SU: "reportLawyer",
    BAO_CAO_LUAT_SU_ALL: "reportLawyerAll",
    HOAT_DONG_TO_CHUC: "lawyerOrgActivity",
    HOAT_DONG_TO_CHUC_ALL: "lawyerOrgActivityAll",
    HOAT_DONG_LUAT_SU: "lawyerActivity",
    HOAT_DONG_LUAT_SU_ALL: "lawyerActivityAll",
    CHUNG_CHI_LUAT_SU: "lawyerCert",
  },
  ADMIN: {
    USER_GROUP: "userGroup",
    LIST_AUTH_PARENT: "listAuthParent",
    LIST_AUTH: "listAuthority",
    GROUP_DETAIL: "groupDetail",
    GROUP_DELETE: "groupDelete",
    USER_LIST: "userList",
    HISTORY_SYSTEM: "historySystem",
  },
};
