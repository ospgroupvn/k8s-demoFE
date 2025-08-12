import z from "zod";

const infoSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ và tên").trim(),
  gender: z.number().optional(),
  dob: z.string().optional(),
  telNumber: z
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
  idCode: z.string().min(1, "Vui lòng nhập Số CMND/CCCD/Hộ chiếu").trim(),
  idDoi: z.date({ required_error: "Vui lòng chọn ngày cấp" }).nullish(),
  idPoi: z.string().min(1, "Vui lòng chọn nơi cấp").trim(),
  addPermanent: z.string().min(1, "Vui lòng nhập địa chỉ thường trú").trim(),
  provinceCode: z.string().min(1, "Vui lòng chọn tỉnh/thành phố").trim(),
  wardCode: z.string().min(1, "Vui lòng chọn phường/xã").trim(),
});

const certificateSchema = z.object({
  certCode: z.string().min(1, "Vui lòng nhập số CCHN").trim(),
  numberOfDecision: z.string().min(1, "Vui lòng nhập số quyết định").trim(),
  dateOfDecision: z
    .date({ required_error: "Vui lòng chọn ngày quyết định" })
    .nullish(),
  effectiveDate: z
    .date({ required_error: "Vui lòng chọn ngày hiệu lực" })
    .nullish(),
  status: z
    .string({ required_error: "Vui lòng chọn loại quyết định" })
    .min(1, "Vui lòng chọn loại quyết định")
    .trim(),
  files: z.array(z.any()).optional(),
  uuid: z.string().optional(),
});

const cardSchema = z.object({
  cardCode: z.string().min(1, "Vui lòng nhập số thẻ").trim(),
  status: z.string().min(1, "Vui lòng nhập trạng thái").trim(),
  numberOfDecision: z.string().min(1, "Vui lòng nhập số quyết định").trim(),
  dateOfDecision: z
    .date({ required_error: "Vui lòng chọn ngày quyết định" })
    .nullish(),
  effectiveDate: z
    .date({ required_error: "Vui lòng chọn ngày hiệu lực" })
    .nullish(),
  issueDate: z.date({ required_error: "Vui lòng chọn ngày cấp" }).nullish(),
  departmentCode: z
    .string({ required_error: "Vui lòng chọn Sở Tư pháp" })
    .min(1, "Vui lòng chọn Sở Tư pháp")
    .trim(),
  files: z.array(z.any()).optional(),
  uuid: z.string().optional(),
  orgId: z
    .string({ required_error: "Vui lòng chọn tổ chức" })
    .min(1, "Vui lòng chọn tổ chức")
    .trim(),
  orgName: z.string().trim().optional(), // Optional field for organization name
});

export const upsertAuctionSchema = z
  .object({
    ...infoSchema.shape,
    certificates: z
      .array(certificateSchema)
      .min(1, "Vui lòng thêm ít nhất một CCHN"),
    cards: z.array(cardSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.cards && data.cards.length > 1) {
      const effectiveDates = data.cards
        .slice(0, 1)
        .map((card) => card.effectiveDate?.toISOString());
      data.cards.slice(1).forEach((card, index) => {
        if (
          card.effectiveDate &&
          effectiveDates.includes(card.effectiveDate?.toISOString())
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Ngày hiệu lực không hợp lệ`,
            path: [`cards`, index + 1, `effectiveDate`],
          });
        }
      });
    }

    if (data.certificates && data.certificates.length > 1) {
      const effectiveDates = data.certificates
        .slice(0, 1)
        .map((cert) => cert.effectiveDate);

      data.certificates.slice(1).forEach((cert, index) => {
        if (effectiveDates.includes(cert.effectiveDate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Ngày hiệu lực không hợp lệ`,
            path: [`certificates`, index + 1, `effectiveDate`],
          });
        }
      });
    }
  });
