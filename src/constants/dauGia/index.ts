export const ORG_STATUS = [
  {
    value: 0,
    label: "Đang hoạt động",
  },
  {
    value: 1,
    label: "Ngừng hoạt động",
  },
  {
    value: 15,
    label: "Tạm ngừng hoạt động",
  },
];

export const CER_STATUS = [
  {
    value: 1,
    label: "Đã cấp CCHN",
  },
  {
    value: 2,
    label: "Đã cấp lại CCHN",
  },
  {
    value: 3,
    label: "Đã thu hồi CCHN",
  },
];

export const AUCTION_ORG_TYPE: { value: number; label: string }[] = [
  {
    value: 0,
    label: "Trung tâm dịch vụ ĐGTS",
  },
  {
    value: 1,
    label: "DN đấu giá tư nhân",
  },
  {
    value: 2,
    label: "Công ty đấu giá hợp danh",
  },
  {
    value: 11,
    label: "Chi nhánh DN đấu giá tài sản",
  },
  {
    value: 4,
    label: "VAMC",
  },
];

export const AUCTION_CARD_STATUS: { value: number; label: string }[] = [
  { value: 5, label: "Cấp mới" },
  { value: 6, label: "Cấp lại" },
  { value: 7, label: "Thu hồi" },
  { value: 10, label: "Thôi hành nghề" },
];

export const CARD_STATUS = [
  {
    value: "NEW_CARD",
    label: "Cấp mới thẻ ĐGV",
  },
  {
    value: "RENEW_CARD",
    label: "Cấp lại thẻ ĐGV",
  },
  {
    value: "REVOKE_CARD",
    label: "Thu hồi thẻ ĐGV",
  },
  {
    value: "TERMINATED_FROM_ORGANIZATION",
    label: "Đã thôi làm việc tại Tổ chức",
  },
];

export const CERT_STATUS = [
  {
    value: "NEW_CERT",
    label: "Cấp mới CCHN đấu giá",
  },
  {
    value: "RENEW_CERT",
    label: "Cấp lại CCHN đấu giá",
  },
  {
    value: "REVOKE_CERT",
    label: "Thu hồi CCHN đấu giá",
  },
];

export const AUCTION_ORG_TYPE_PRIVATE = [
  {
    value: "AUCTION_SERVICE_CENTER",
    label: "Trung tâm dịch vụ ĐGTS",
  },
  {
    value: "PRIVATE_AUCTION_ENTERPRISE",
    label: "DN đấu giá tư nhân",
  },
  {
    value: "PARTNERSHIP_AUCTION_COMPANY",
    label: "Công ty đấu giá hợp danh",
  },
  {
    value: "AUCTION_BRANCH",
    label: "Chi nhánh DN đấu giá tài sản",
  },
  {
    value: "VAMC",
    label: "VAMC",
  },
];

export const AUCTION_ORG_STATUS = [
  {
    value: "ACTIVE",
    label: "Đang hoạt động",
  },
  {
    value: "INACTIVE",
    label: "Ngừng hoạt động",
  },
  {
    value: "TEMPORARILY_SUSPENDED",
    label: "Tạm ngừng hoạt động",
  },
];
