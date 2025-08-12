import { cn } from "@/lib/utils";

const Footer = () => {
  return (
    <footer
      className={cn(
        "max-h-[250px] min-h-0 pb-4 pt-6 px-12 border-t-2 border-t-[#E5E5E5] shadow-lg bg-[#007C95] space-y-2 text-center text-white"
      )}
    >
      <p className="font-bold text-sm">
        TRANG THÔNG TIN ĐIỆN TỬ QUẢN LÝ LĨNH VỰC BỔ TRỢ TƯ PHÁP
      </p>
      <p className="text-sm">
        Cục Bổ trợ Tư pháp - Địa chỉ: 60 Trần Phú, Ba Đình, Hà Nội.
      </p>
      <p className="text-sm">
        Điện thoại: Hỗ trợ nghiệp vụ:{" "}
        <a href="tel:+8402462739506" className="text-white">
          024.62739506
        </a>{" "}
        - Hỗ trợ kỹ thuật:
        <a href="tel:+1900888824" className="text-white">
          {" "}
          1900.8888.24 (nhánh số 4)
        </a>
        ; Email:{" "}
        <a href="mailto:bttp@moj.gov.vn" className="text-white">
          bttp@moj.gov.vn
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;
