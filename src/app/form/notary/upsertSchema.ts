import z from "zod";

const infoSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập họ và tên").trim(),
  birthDay: z.date({ required_error: "Vui lòng chọn ngày sinh" }).nullish(),
  sex: z.string().min(1, "Vui lòng nhập giới tính"),
  phoneNumber: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại")
    .max(10, "Sai định dạng số điện thoại")
    .regex(/^0/, "Sai định dạng số điện thoại")
    .trim(),
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .email("Email không hợp lệ")
    .trim(),
  idNo: z.string().min(1, "Vui lòng nhập Số CMND/Hộ chiếu/CCCD").trim(),
  idNoDate: z.date({ required_error: "Vui lòng chọn ngày cấp" }).nullish(), // Ngày cấp
  addressIdNo: z.string().min(1, "Vui lòng nhập nơi cấp").trim(), // Nơi cấp
  addressResident: z.string().min(1, "Vui lòng nhập địa chỉ thường trú").trim(), // Địa chỉ thường trú
  residentProvince: z.string().min(1, "Vui lòng nhập tỉnh/thành phố"),
  addressResidentId: z.string().trim().min(1, "Vui lòng nhập phường/xã"), // Tỉnh/Thành phố thường trú
  addressNow: z.string().trim().optional(), // Địa chỉ hiện tại
  nowProvince: z.string().trim().optional(), // tỉnh thành hiện tại
  addressNowId: z.string().trim().optional(), // phường/xã hiện tại
  status: z
    .string({ required_error: "Vui lòng chọn trạng thái" })
    .min(1, "Vui lòng chọn trạng thái"), // Trạng thái
  administrationId: z.string().min(1, "Vui lòng chọn Sở Tư pháp"), // Sở Tư pháp
});

const internSchema = z.object({
  dispatchCode: z.string().min(1, "Vui lòng nhập số chứng nhận").trim(), // Số chứng nhận
  dateSign: z.date({ required_error: "Vui lòng chọn ngày cấp" }).nullish(), // Ngày cấp
  idOrg: z.string().min(1, "Vui lòng nhập tổ chức HNCC").trim(), // Tổ chức HNCC nhận tập sự
  address: z.string().trim().optional(), // Địa chỉ trụ sở
  dateStart: z.date({ required_error: "Vui lòng chọn ngày bắt đầu" }).nullish(), // Ngày bắt đầu tập sự
  dateNumber: z.number().int().min(0).max(12).optional(), // Thời gian đã tập sự (tháng)
  files: z.array(z.any()).max(1, "Chỉ được chọn 1 file").optional(), // File đính kèm (tối đa 1 file)
  idProbationary: z.string().trim().optional(),
  documentId: z.number().optional(), // ID của tài liệu liên quan
  fileName: z.string().trim().optional(), // Tên file hiện có
  linkFile: z.string().trim().optional(), // Link file hiện có
});

const appointSchema = z.object({
  id: z.string().trim().optional(), // For tracking existing appointments
  type: z.string().min(1, "Vui lòng nhập loại quyết định").trim(),
  dispatchCode: z.string().min(1, "Vui lòng nhập số văn bản").trim(),
  effectiveDate: z
    .date()
    .optional()
    .nullish(),
  dateSign: z
    .date()
    .optional()
    .nullish(),
  signer: z.string().trim().optional(), // Người ký quyết định
  files: z.array(z.any()).max(1, "Chỉ được chọn 1 file").optional(), // File đính kèm (tối đa 1 file)
  documentId: z.number().optional(), // ID của tài liệu liên quan
  fileName: z.string().trim().optional(), // Tên file hiện có
  linkFile: z.string().trim().optional(), // Link file hiện có
});

const registerSchema = z.object({
  orgNotaryInfoId: z.string().trim().optional(),
  orgName: z.string().trim().optional(),
  dispatchCode: z.string().trim().optional(), // Số quyết định
  decisionDate: z.date().optional(), // Ngày quyết định
  effectiveDate: z.date().optional(), // Ngày hiệu lực
  numberCad: z.string().trim().optional(), // Số thẻ
  status: z.string().trim().optional(), // Trạng thái
  reason: z.string().trim().optional(), // Lý do
  id: z.string().trim().optional(),
});

const suspendSchema = z.object({
  dispatchCode: z.string().trim().optional(), // Số quyết định tạm đình chỉ
  decisionDate: z.date().optional(), // Ngày quyết định
  effectiveDate: z.date().optional(), // Ngày hiệu lực
  dateNumber: z.number().int().min(0).max(12).optional(), // Thời gian tạm đình chỉ (tháng)
  signer: z.string().trim().optional(), // Người ký quyết định
  reason: z.string().trim().optional(), // Lý do tạm đình chỉ
  files: z.array(z.any()).max(1, "Chỉ được chọn 1 file").optional(), // File đính kèm (tối đa 1 file)
  id: z.string().trim().optional(),
  documentId: z.number().optional(), // ID của tài liệu liên quan
  fileName: z.string().trim().optional(), // Tên file hiện có
  linkFile: z.string().trim().optional(), // Link file hiện có
});

const violationSchema = z.object({
  id: z.string().trim().optional(), // For tracking existing violations
  dispatchCode: z.string().trim().optional(), // Số quyết định xử lý
  decisionDate: z.date().optional(), // Ngày quyết định xử lý
  effectiveDate: z.date().optional(), // Ngày hiệu lực xử lý
  typePenalize: z.string().trim().optional(), // Hình thức xử lý vi phạm
  reason: z.string().trim().optional(), // Lý do xử lý vi phạm
  files: z.array(z.any()).max(1, "Chỉ được chọn 1 file").optional(), // File đính kèm (tối đa 1 file)
  signer: z.string().trim().optional(), // Người ký quyết định xử lý
  orgNotaryId: z.string().trim().optional(), // Tổ chức xử lý vi phạm
  leverPenalize: z.string().trim().optional(), // Phương thức xử lý
  additionalPenalty: z.string().trim().optional(), // Phương thức xử lý bổ sung
  administrationIdPenalty: z.string().trim().optional(), // Sở Tư pháp xử lý vi phạm
  moneyPenalty: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return undefined;
      const num = parseFloat(val);
      if (isNaN(num)) return val; // Return original string if not a valid number
      return num.toString(); // Convert number back to string
    })
    .refine((val) => {
      if (val === undefined) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, "Số tiền không hợp lệ"), // Số tiền xử lý vi phạm
  documentId: z.number().optional(), // ID của tài liệu liên quan
  fileName: z.string().trim().optional(), // Tên file hiện có
  linkFile: z.string().trim().optional(), // Link file hiện có
});

// const requiredAppointStatus = [5, 6, 7, 10, 11, 14, 16, 17, 18, 19, 20, 21];
// const requiredRegisterStatus = [23, 12, 24, 22, 8];
const requiredSuspendStatus = [9];

export const upsertNotaryFormSchema = z
  .object({
    ...infoSchema.shape,
    intern: z.array(internSchema).max(1, "Chỉ được có tối đa 1 thông tin tập sự").optional(),
    appoints: z.array(appointSchema).optional(),
    register: z.array(registerSchema).max(1, "Chỉ được có tối đa 1 thông tin đăng ký").optional(),
    suspend: z
      .array(suspendSchema)
      .max(1, "Chỉ được có tối đa 1 thông tin tạm đình chỉ")
      .optional(), // Array with max 1 element
    violation: z.array(violationSchema).optional(), // Danh sách vi phạm
  })
  .superRefine((data, ctx) => {
    // Check for duplicate effective dates in appointments
    if (data.appoints && data.appoints.length > 1) {
      const effectiveDates = data.appoints
        .slice(0, 1)
        .map((appoint) => appoint.effectiveDate);
      data.appoints.slice(1).forEach((appoint, index) => {
        if (effectiveDates.includes(appoint.effectiveDate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Ngày hiệu lực không hợp lệ`,
            path: [`appoints`, index + 1, `effectiveDate`],
          });
        }
      });
    }

    // Check for duplicate effective dates in violations
    if (data.violation && data.violation.length > 1) {
      const effectiveDates = data.violation
        .slice(0, 1)
        .map((violation) => violation.effectiveDate);
      data.violation.slice(1).forEach((violation, index) => {
        if (effectiveDates.includes(violation.effectiveDate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Ngày hiệu lực không hợp lệ`,
            path: [`violation`, index + 1, `effectiveDate`],
          });
        }
      });
    }

    /** Suspend */
    if (requiredSuspendStatus.includes(Number(data.status))) {
      if (!data.suspend?.[0]?.dispatchCode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["suspend", 0, "dispatchCode"],
          message: "Vui lòng nhập Số quyết định",
        });
      }

      if (!data.suspend?.[0]?.decisionDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["suspend", 0, "decisionDate"],
          message: "Vui lòng chọn Ngày quyết định",
        });
      }

      if (!data.suspend?.[0]?.effectiveDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["suspend", 0, "effectiveDate"],
          message: "Vui lòng chọn Ngày hiệu lực",
        });
      }

      if (!data.suspend?.[0]?.signer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["suspend", 0, "signer"],
          message: "Vui lòng nhập Người ký",
        });
      }

      if (!data.suspend?.[0]?.reason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["suspend", 0, "reason"],
          message: "Vui lòng nhập Lý do",
        });
      }
    }

    /** Violation */
    if (data.violation && data.violation.length > 0) {
      data.violation.forEach((violation, index) => {
        // Check if any field has a value (excluding dispatchCode itself)
        const hasAnyValue = Boolean(
          violation.decisionDate ||
            violation.effectiveDate ||
            violation.typePenalize ||
            violation.reason ||
            violation.signer ||
            violation.orgNotaryId ||
            violation.leverPenalize ||
            violation.additionalPenalty ||
            violation.moneyPenalty ||
            violation.administrationIdPenalty ||
            (violation.files && violation.files.length > 0)
        );

        // If any field has value, dispatchCode is required
        if (hasAnyValue && !violation.dispatchCode) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["violation", index, "dispatchCode"],
            message: "Vui lòng nhập Số quyết định xử lý",
          });
        }
      });
    }
  });
