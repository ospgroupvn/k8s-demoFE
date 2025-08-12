export const ADMINISTRATION_TYPE = {
  CUC: 1,
  SO: 2,
};

export const NOTARY_ORG_STATUS = [
  {
    value: 0,
    label: "Đang hoạt động",
  },
  {
    value: 1,
    label: "Chờ thành lập",
  },
  {
    value: 2,
    label: "Giải thể",
  },
  {
    value: 3,
    label: "Chấm dứt hoạt động",
  },
  {
    value: 4,
    label: "Chưa hoạt động",
  },
  {
    value: 8,
    label: "Thu hồi QĐ cho phép thành lập",
  },
  {
    value: 9,
    label: "Chờ cấp Giấy ĐKHĐ",
  },
  {
    value: 10,
    label: "Từ chối cấp Giấy ĐKHĐ",
  },
  {
    value: 11,
    label: "Đã hợp nhất",
  },
  {
    value: 12,
    label: "Đã thành lập",
  },
  {
    value: 13,
    label: "Từ chối thành lập",
  },
  {
    value: 15,
    label: "Tạm ngưng hoạt động",
  },
  {
    value: 16,
    label: "Thu hồi Giấy ĐKHĐ",
  },
  {
    value: 17,
    label: "Thay đổi nội dung ĐKHĐ",
  },
  {
    value: 18,
    label: "Đã chuyển đổi",
  },
  {
    value: 19,
    label: "Đã sáp nhập",
  },
];

export const STATUS_OPTIONS = [
  { value: "0", label: "Đăng ký tập sự" },
  { value: "1", label: "Đang tập sự" },
  { value: "2", label: "Tạm ngừng tập sự" },
  { value: "3", label: "Chấm dứt tập sự" },
  { value: "4", label: "Hoàn thành tập sự" },
  { value: "5", label: "Chờ tiếp nhận bổ nhiệm" },
  { value: "6", label: "Chờ bổ nhiệm" },
  { value: "7", label: "Đã bổ nhiệm" },
  { value: "8", label: "Đang hành nghề" },
  { value: "9", label: "Tạm đình chỉ hành nghề" },
  { value: "10", label: "Đã bổ nhiệm lại" },
  { value: "11", label: "Đã miễn nhiệm" },
  { value: "12", label: "Chờ bổ sung" },
  { value: "13", label: "Đã bổ sung" },
  { value: "14", label: "Từ chối bổ nhiệm" },
  { value: "15", label: "Đã thay đổi nơi tập sự" },
  { value: "16", label: "Chờ tiếp nhận miễn nhiệm" },
  { value: "17", label: "Chờ tiếp nhận bổ nhiệm lại" },
  { value: "18", label: "Từ chối miễn nhiệm" },
  { value: "19", label: "Chờ bổ nhiệm lại" },
  { value: "20", label: "Từ chối bổ nhiệm lại" },
  { value: "21", label: "Chờ miễn nhiệm" },
  { value: "22", label: "Thu hồi thẻ" },
  { value: "23", label: "Chờ cấp thẻ" },
  { value: "24", label: "Từ chối cấp thẻ" },
  { value: "25", label: "Đạt kết quả tập sự" },
];

export const NOTARY_APPOINT_LIST = [
  { value: "1", label: "Đề nghị bổ nhiệm" },
  { value: "2", label: "Quyết định bổ nhiệm" },
  { value: "3", label: "Đề nghị miễn nhiệm" },
  { value: "4", label: "Quyết định miễn nhiệm" },
  { value: "5", label: "Đề nghị bổ nhiệm lại" },
  { value: "6", label: "Quyết định bổ nhiệm lại" },
];

// Type = 1: Đề nghị, Type = 2: Quyết định
// Kind = 1: Bổ nhiệm, Kind = 2: Miễn nhiệm, Kind = 3: Bổ nhiệm lại
export const NOTARY_APPOINT_MAP: Record<
  string,
  { type: number; kind: number }
> = {
  "1": { kind: 1, type: 1 },
  "2": { kind: 1, type: 2 },
  "3": { kind: 2, type: 1 },
  "4": { kind: 2, type: 2 },
  "5": { kind: 3, type: 1 },
  "6": { kind: 3, type: 2 },
};

export const NOTARY_VIOLATION_LEVEL = [
  { value: "1", label: "Cảnh cáo" },
  { value: "2", label: "Phạt tiền" },
  { value: "3", label: "Khiển trách" },
  { value: "4", label: "Kỷ luật cảnh cáo" },
  { value: "5", label: "Hạ bậc lương" },
  { value: "6", label: "Giáng chức" },
  { value: "7", label: "Cách chức" },
  { value: "8", label: "Buộc thôi việc" },
];

export const NOTARY_VIOLATION_TYPE = [
  { value: "1", label: "Kỷ luật" },
  { value: "2", label: "Xử lý vi phạm hành chính" },
  { value: "3", label: "Truy cứu trách nhiệm hình sự" },
];

export const NOTARY_VIOLATION_TYPE_LEVEL_MAP: Record<string, string[]> = {
  "2": ["1", "2"],
  "1": ["3", "4", "5", "6", "7", "8"],
};
