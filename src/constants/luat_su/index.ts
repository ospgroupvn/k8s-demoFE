export const LAWYER_STATUS = [
  {
    value: 1,
    label: "Đang hoạt động",
  },
  {
    value: 0,
    label: "Dừng hoạt động",
  },
];

export const ACTIVITY_STATUS = [
  {
    value: 4,
    label: "Đang hành nghề",
  },
  { value: 6, label: "Đã thu hồi giấy phép" },
];

export const PRACTICE_FORM = [
  {
    value: 1,
    label: "Thành viên cho chi nhánh/công ty luật nước ngoài",
  },
  {
    value: 2,
    label: "Hợp đồng cho chi nhánh, công ty luật nước ngoài, TCHNLS Việt Nam",
  },
  {
    value: 3,
    label: "Thành lập/tham gia thành lập TCHNLS",
  },
  {
    value: 4,
    label: "Làm việc theo hợp đồng lao động cho TCHNLS",
  },
  {
    value: 5,
    label: "Hành nghề với tư cách cá nhân",
  },
];

export const CCHN_STATUS = [
  {
    value: 14,
    label: "Đang hành nghề",
  },
  {
    value: 15,
    label: "Đã cấp CCHN",
  },
  {
    value: 16,
    label: "Thu hồi CCHN",
  },
  {
    value: 17,
    label: "Gia hạn CCHN",
  },
];

export const THE_LS_STATUS = [
  {
    value: 24,
    label: "Đang hành nghề",
  },
  {
    value: 25,
    label: "Đã cấp thẻ",
  },
  {
    value: 26,
    label: "Đã thu hồi thẻ",
  },
  {
    value: 27,
    label: "Đã gia hạn thẻ",
  },
];

export const GPHN_STATUS = [
  {
    value: 34,
    label: "Đang hành nghề",
  },
  {
    value: 35,
    label: "Đã cấp GPHN",
  },
  {
    value: 36,
    label: "Thu hồi GPHN",
  },
  {
    value: 37,
    label: "Gia hạn GPHN",
  },
];

export const LICENSE_TYPE = {
  CCHN: 1,
  THE_LS: 2,
  GPHN: 3,
};

export const LICENSE_TYPE_STR = [
  { value: LICENSE_TYPE.CCHN, label: "Chứng chỉ hành nghề" },
  { value: LICENSE_TYPE.THE_LS, label: "Thẻ Luật sư" },
  { value: LICENSE_TYPE.GPHN, label: "Giấy phép hành nghề" },
];

export const OWNER_TYPE = {
  LAWYER: 1,
  ORG: 2,
};

export const TYPE_ORG_CHANGE = [
  {
    value: 1,
    label: "Đăng ký hoạt động",
  },
  {
    value: 2,
    label: "Giấy phép thành lập",
  },
];
