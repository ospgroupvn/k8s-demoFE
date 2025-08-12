"use client";

import ConfirmModal from "@/components/common/confirmModal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { QUERY_KEY } from "@/constants/common";
import { getAuctionOrgById } from "@/service/auctionOrg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import AuctioneerSection from "./auctioneerSection";
import BusinessManagerSection from "./businessManagerSection";
import BusinessSection from "./businessSection";
import InfoSection from "./infoSection";
import OrgMemberSection from "./orgMemberSection";
import RepresentativeSection from "./representativeSection";

const memberSchema = z.object({
  uuid: z.string().optional(),
  fullName: z.string().min(1, "Vui lòng nhập tên thành viên"),
  dob: z.string().min(1, "Vui lòng nhập năm sinh"),
  certCode: z.string().min(1, "Vui lòng nhập số chứng chỉ"),
  dateOfDecision: z.date({ required_error: "Vui lòng chọn ngày cấp" }),
});

const managerSchema = z.object({
  fullName: z.string().optional(),
  dob: z.string().optional(),
  addPermanent: z.string().optional(),
  certCode: z.string().optional(),
  dateOfDecisionCert: z.string().optional(),
  cardCode: z.string().optional(),
  dateOfDecisionCard: z.string().optional(),
  gender: z.number().optional(),
  idCode: z.string().optional(),
  idDOI: z.date().optional(),
  idPOI: z.string().optional(),
});

const formSchema = z
  .object({
    licenseNo: z.string().min(1, "Vui lòng nhập số quyết định"),
    licenseDate: z
      .date({ required_error: "Vui lòng chọn ngày quyết định" })
      .nullish(),
    type: z.string().min(1, "Vui lòng chọn loại tổ chức"),
    fullName: z.string().min(1, "Vui lòng nhập tên doanh nghiệp"),
    provinceCode: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
    wardCode: z.string().min(1, "Vui lòng chọn phường/xã"),
    address: z.string().min(1, "Vui lòng nhập địa chỉ"),
    telNumber: z
      .string()
      .min(1, "Vui lòng nhập số điện thoại")
      .max(10, "Sai định dạng số điện thoại")
      .regex(/^0/, "Sai định dạng số điện thoại")
      .trim(),
    email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
    status: z.string().min(1, "Vui lòng chọn trạng thái"),
    orgRoot: z.string().optional(),
    managerUuid: z.string().min(1, "Vui lòng chọn số chứng chỉ"),
    manager: managerSchema.optional(),
    orgRootDepartmentCode: z.string().optional(),
    orgRootDepartmentName: z.string().optional(),
    memberPartners: z.array(memberSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "AUCTION_BRANCH" && !data.orgRoot) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn doanh nghiệp",
        path: ["orgRoot"],
      });
    }

    data.memberPartners?.forEach((member, index) => {
      if (
        member.dob &&
        (parseInt(member.dob) < 1900 ||
          parseInt(member.dob) > new Date().getFullYear())
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Năm sinh không hợp lệ",
          path: ["memberPartners", index, "dob"],
        });
      }
    });
  });

type FormData = z.infer<typeof formSchema>;

const UpsertAuctionOrgForm = ({ id }: { id?: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [deletedMembers, setDeletedMembers] = useState<string[]>([]);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      licenseNo: "",
      licenseDate: undefined,
      type: "",
      fullName: "",
      provinceCode: "",
      wardCode: "",
      address: "",
      telNumber: "",
      email: "",
      status: "",
      orgRoot: "",
      managerUuid: "",
      manager: undefined,
      memberPartners: [],
      orgRootDepartmentCode: "",
      orgRootDepartmentName: "",
    },
  });

  const detailQuery = useQuery({
    queryKey: [QUERY_KEY.DAU_GIA.CHI_TIET_DOANH_NGHIEP, id],
    queryFn: () => getAuctionOrgById(Number(id!)),
    enabled: !!id,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  useEffect(() => {
    if (detailQuery.data?.data) {
      const api = detailQuery.data.data;
      // Map API response to form fields
      form.reset({
        licenseNo: api.organization.licenseNo || "",
        licenseDate: api.organization.licenseDate
          ? new Date(api.organization.licenseDate)
          : undefined,
        type: api.organization.orgType?.toString() || "",
        fullName: api.organization.fullname || "",
        provinceCode: api.organization.cityId?.toString() || "",
        wardCode: api.organization.districtId?.toString() || "",
        address: api.organization.address || "",
        telNumber: api.organization.foneNumber || "",
        email: api.organization.email || "",
        status: api.organization.status?.toString() || "",
        orgRoot: api.organization.orgRoot?.toString() || "",
        managerUuid: api.manager?.cerCode || "",
        manager: api.manager
          ? {
              fullName: api.manager.fullname || "",
              dob: api.manager.dob || "",
              addPermanent: api.manager.addPermanent || "",
              certCode: api.manager.cerCode || "",
              dateOfDecisionCert: api.manager.cerDOI || "",
              cardCode: api.manager.cardCode || "",
              dateOfDecisionCard: api.manager.cardDOI || "",
              gender: api.manager.sex || undefined,
              idCode: api.manager.idCode || "",
              idDOI: api.manager.idDOI
                ? new Date(api.manager.idDOI)
                : undefined,
              idPOI: api.manager.idPOI || "",
            }
          : undefined,
        orgRootDepartmentCode: "", // Map if available in API
        orgRootDepartmentName: "", // Map if available in API
        memberPartners:
          api.ltsMemberParters?.map((member) => ({
            uuid: member.id?.toString() || "",
            fullName: member.fullname || "",
            dob: member.dob || "",
            certCode: member.cerCode || "",
            dateOfDecision: member.cerDOI ? new Date(member.cerDOI) : undefined,
          })) || [],
      });
    }
  }, [detailQuery.data]);

  const type = useWatch({
    control: form.control,
    name: "type",
  });

  // const addMutation = useMutation({
  //   mutationFn: addAuctionOrgPrivate,
  //   onSuccess: () => {
  //     toast.success("Tạo mới tổ chức đấu giá thành công");
  //     router.push("/dau_gia/to_chuc");
  //   },
  //   onError: (error: any) => {
  //     toast.error(
  //       error?.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại"
  //     );
  //   },
  //   onSettled: () => {
  //     setIsSubmitting(false);
  //   },
  // });

  // const editMutation = useMutation({
  //   mutationFn: ({ id, data }: { id: string; data: AuctionOrgDetailItem }) =>
  //     updateAuctionOrgPrivate(id, data),
  // });

  // const addMemberMutation = useMutation({
  //   mutationFn: ({
  //     id,
  //     data,
  //   }: {
  //     id: string;
  //     data: Partial<AuctionOrgMemberPartners>[];
  //   }) => addMemberPartner(id, data),
  // });

  // const updateMemberMutation = useMutation({
  //   mutationFn: ({
  //     id,
  //     data,
  //   }: {
  //     id: string;
  //     data: AuctionOrgMemberPartners;
  //   }) => updateMemberPartner(id, data),
  // });

  // const deleteMemberMutation = useMutation({
  //   mutationFn: ({ id, memberUuids }: { id: string; memberUuids: string[] }) =>
  //     deleteMemberPartner(id, memberUuids),
  // });

  // Process organization members section
  // const processOrgMember = (
  //   memberData: any[],
  //   isUpdate = false,
  //   parentId?: string
  // ) => {
  //   const promises: Promise<any>[] = [];
  //   const newMembers: Partial<AuctionOrgMemberPartners>[] = [];

  //   if (memberData && memberData.length > 0) {
  //     memberData.forEach((member, index) => {
  //       if (isUpdate) {
  //         const isTouched =
  //           form.formState.touchedFields.memberPartners?.[index] ||
  //           form.formState.dirtyFields.memberPartners?.[index];
  //         if (!isTouched) return;
  //       }

  //       if (member.fullName || member.dob || member.certCode) {
  //         const submitMember = {
  //           ...member,
  //           dateOfDecision: member.dateOfDecision
  //             ? format(member.dateOfDecision, "yyyy-MM-dd")
  //             : undefined,
  //         };

  //         if (isUpdate && member.uuid && member.uuid.trim() !== "") {
  //           // Update existing member
  //           const promise = updateMemberMutation.mutateAsync({
  //             id: parentId!,
  //             data: submitMember as AuctionOrgMemberPartners,
  //           });
  //           promises.push(promise);
  //         } else if (!isUpdate || !member.uuid || member.uuid.trim() === "") {
  //           // Collect new members for batch addition
  //           newMembers.push(submitMember);
  //         }
  //       }
  //     });
  //   }

  //   // Batch add all new members at once
  //   if (newMembers.length > 0) {
  //     const promise = addMemberMutation.mutateAsync({
  //       id: parentId!,
  //       data: newMembers,
  //     });
  //     promises.push(promise);
  //   }

  //   return promises;
  // };

  // const onSubmit = async (data: z.infer<typeof formSchema>) => {
  //   setIsSubmitting(true);

  //   const { memberPartners, ...mainData } = data;

  //   const submitData: Partial<AuctionOrgDetailItem> = {
  //     ...mainData,
  //     licenseDate: data.licenseDate
  //       ? format(data.licenseDate, "yyyy-MM-dd")
  //       : undefined,
  //     memberPartners: memberPartners?.map((member) => ({
  //       ...member,
  //       uuid: member.uuid || "",
  //       dateOfDecision: member.dateOfDecision
  //         ? format(member.dateOfDecision, "yyyy-MM-dd")
  //         : "",
  //     })),
  //   };

  //   if (!id) {
  //     // CREATE MODE
  //     addMutation.mutate(submitData);
  //   } else {
  //     // UPDATE MODE
  //     editMutation.mutate(
  //       { id, data: submitData as AuctionOrgDetailItem },
  //       {
  //         onSuccess: async () => {
  //           try {
  //             const touchedFields = form.formState.touchedFields;
  //             const dirtyFields = form.formState.dirtyFields;
  //             const promises: Promise<any>[] = [];

  //             // Handle deleted members first
  //             if (deletedMembers.length > 0) {
  //               const deletePromise = deleteMemberMutation.mutateAsync({
  //                 id: id,
  //                 memberUuids: deletedMembers,
  //               });
  //               promises.push(deletePromise);
  //             }

  //             // Process members only if touched
  //             if (touchedFields.memberPartners || dirtyFields.memberPartners) {
  //               promises.push(
  //                 ...processOrgMember(memberPartners || [], true, id)
  //               );
  //             }

  //             // Execute all member operations
  //             if (promises.length > 0) {
  //               const results = await Promise.allSettled(promises);
  //               const failures = results.filter(
  //                 (result) => result.status === "rejected"
  //               );

  //               if (failures.length > 0) {
  //                 console.error("Some member operations failed:", failures);
  //                 toast.error("Có lỗi khi xử lý thành viên");
  //               } else {
  //                 toast.success("Cập nhật tổ chức đấu giá thành công");
  //               }
  //             } else {
  //               toast.success("Cập nhật tổ chức đấu giá thành công");
  //             }

  //             router.push("/dau_gia/to_chuc");
  //           } catch (error) {
  //             console.error("Error processing members:", error);
  //             toast.error("Có lỗi khi xử lý thành viên");
  //           } finally {
  //             setIsSubmitting(false);
  //           }
  //         },
  //         onError: (error: any) => {
  //           toast.error(
  //             error?.response?.data?.message ||
  //               "Đã có lỗi xảy ra, vui lòng thử lại"
  //           );
  //           setIsSubmitting(false);
  //         },
  //       }
  //     );
  //   }
  // };

  return (
    <>
      <h1 className="text-lg font-bold mb-6 flex items-center gap-2">
        <Link href="/dau_gia/to_chuc">
          <ChevronLeft
            size={24}
            className="p-1 rounded-sm bg-[#E6F2FB] hover:bg-[#E6F2FB]/50 cursor-pointer"
          />
        </Link>
        {id ? "Cập nhật Tổ chức đấu giá" : "Tạo mới Tổ chức đấu giá"}
      </h1>

      <div className="relative">
        {(isSubmitting || detailQuery?.isFetching) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Đang xử lý...</p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form>
            <InfoSection id={id} />
            {!!type && type !== "11" && <RepresentativeSection />}
            {type === "11" && (
              <>
                <BusinessSection data={detailQuery.data?.data?.toChucDuocSN} />
                <BusinessManagerSection />
              </>
            )}
            {type === "2" && (
              <OrgMemberSection setDeletedMembers={setDeletedMembers} />
            )}

            {!!id && (
              <AuctioneerSection
                auctioneers={detailQuery?.data?.data?.auctioneers || []}
              />
            )}

            <section className="flex items-center justify-center gap-4 w-full mt-6 sticky bottom-0 bg-white p-4 border-t">
              {/* <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : id ? "Cập nhật" : "Tạo mới"}
              </Button> */}
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dau_gia/to_chuc")}
                className="border-[#222]"
              >
                Quay lại
              </Button>
            </section>
          </form>
        </Form>
      </div>

      <ConfirmModal
        title={id ? "Xác nhận hủy cập nhật" : "Xác nhận hủy thêm mới"}
        actionLabel="Hủy"
        secondaryActionLabel="Đóng"
        isOpen={isShowConfirmModal}
        onClose={() => setIsShowConfirmModal(false)}
        onSubmit={() => router.push("/dau_gia/to_chuc")}
        secondaryAction={() => setIsShowConfirmModal(false)}
        body={
          <>
            Bạn có chắc chắn muốn hủy {id ? "cập nhật" : "thêm mới"} bản ghi
            không?
          </>
        }
        actionClassName="bg-red-500 hover:bg-red-600 text-white"
      />
    </>
  );
};

export default UpsertAuctionOrgForm;
