"use client";

import { upsertAuctionSchema as formSchema } from "@/app/form/auction/upsertSchema";
import ConfirmModal from "@/components/common/confirmModal";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { QUERY_KEY } from "@/constants/common";
import { getDGVById } from "@/service/auctionOrg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import CardSection from "./cardSection";
import CertificateSection from "./certificateSection";
import InfoSection from "./infoSection";

type FormData = z.infer<typeof formSchema>;

const defaultValues: z.infer<typeof formSchema> = {
  fullName: "",
  gender: undefined,
  dob: undefined,
  telNumber: "",
  email: "",
  idCode: "",
  idDoi: undefined,
  idPoi: "",
  addPermanent: "",
  provinceCode: "",
  wardCode: "",
  certificates: [],
  cards: [],
};
interface Props {
  id?: string;
}

const UpsertAuctioneerForm = ({ id }: Props) => {
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletedCerts, setDeletedCerts] = useState<string[]>([]);
  const [deletedCards, setDeletedCards] = useState<string[]>([]);
  const [deletedCertFiles, setDeletedCertFiles] = useState<
    Record<string, string[]>[]
  >([]);
  const [deletedCardFiles, setDeletedCardFiles] = useState<
    Record<string, string[]>[]
  >([]);

  const router = useRouter();

  const detailQuery = useQuery({
    queryKey: [QUERY_KEY.DAU_GIA.CHI_TIET_DGV, id],
    queryFn: () => getDGVById(Number(id!)),
    enabled: !!id,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (detailQuery.data && detailQuery.data.data) {
      const apiData = detailQuery.data.data;
      const detail = apiData.detail || {};
      form.reset({
        fullName: detail.fullname ?? "",
        gender: detail.sex || undefined,
        dob: detail.dob || "",
        telNumber: detail.telNumber ?? "",
        email: detail.email ?? "",
        idCode: detail.idCode ?? "",
        idDoi: detail.idDOI ? new Date(detail.idDOI) : undefined,
        idPoi: detail.idPOI || "",
        addPermanent: detail.addrFull ?? "", // addrFull is closest to addPermanent
        provinceCode: "",
        wardCode: "",
        certificates: Array.isArray(apiData.listFullCCHN)
          ? apiData.listFullCCHN.map((cert: any) => ({
              uuid: cert.id ? String(cert.id) : "",
              certCode: cert.cerCode ?? "",
              numberOfDecision: cert.numberOfDecision ?? "",
              status: cert.actTypeStr ?? "",
              dateOfDecision: cert.dateOfDecision
                ? new Date(cert.dateOfDecision)
                : undefined,
              effectiveDate: cert.effectiveDate
                ? new Date(cert.effectiveDate)
                : undefined,
              files: cert.attachFile ?? [],
            }))
          : [],
        cards: Array.isArray(apiData.listFullCardDGV)
          ? apiData.listFullCardDGV.map((card) => ({
              uuid: card.id ? String(card.id) : "",
              cardCode: card.cardCode ?? "",
              status: card.actTypeStr ?? "",
              numberOfDecision: card.cerCode ?? "",
              departmentCode: card.orgID ? String(card.orgID) : "",
              dateOfDecision: card.dateOfDecision
                ? new Date(card.dateOfDecision)
                : undefined,
              effectiveDate: card.effectiveDate
                ? new Date(card.effectiveDate)
                : undefined,
              // issueDate: card.issueDate ? new Date(card.issueDate) : undefined,
              // files: card.attachFile ?? [],
              orgId: card.orgID ? String(card.orgID) : "",
              orgName: card.orgName ?? "",
            }))
          : [],
      });
    }
  }, [detailQuery.data]);

  // const addMutation = useMutation({
  //   mutationFn: addAuctioneer,
  // });

  // const updateMutation = useMutation({
  //   mutationFn: updateAuctioneer,
  // });

  // /** API chứng chỉ */
  // const addCertMutation = useMutation({
  //   mutationFn: addCertificateForAuctioneer,
  // });

  // const updateCertMutation = useMutation({
  //   mutationFn: updateCertificateForAuctioneer,
  // });

  // const deleteCertMutation = useMutation({
  //   mutationFn: deleteCertificateForAuctioneer,
  // });

  // const uploadCertFilesMutation = useMutation({
  //   mutationFn: uploadFilesForCert,
  // });

  // const deleteCertFilesMutation = useMutation({
  //   mutationFn: deleteFilesForCert,
  // });

  // /** API thẻ đấu giá viên */
  // const addCardMutation = useMutation({
  //   mutationFn: addCardForAuctioneer,
  // });

  // const updateCardMutation = useMutation({
  //   mutationFn: updateCardForAuctioneer,
  // });

  // const deleteCardMutation = useMutation({
  //   mutationFn: deleteCardForAuctioneer,
  // });

  // const uploadCardFilesMutation = useMutation({
  //   mutationFn: uploadFilesForCard,
  // });

  // const deleteCardFilesMutation = useMutation({
  //   mutationFn: deleteFilesForCard,
  // });

  // const checkCertExistMutation = useMutation({
  //   mutationFn: ({ certCode, certId }: { certCode: string; certId?: string }) =>
  //     checkCertExist(certCode, certId),
  // });

  // const checkCardExistMutation = useMutation({
  //   mutationFn: ({
  //     organizationId,
  //     cardCode,
  //     cardId,
  //   }: {
  //     organizationId: string;
  //     cardCode: string;
  //     cardId?: string;
  //   }) => checkCardExist(organizationId, cardCode, cardId),
  // });

  // Xử lý file
  // const handleFileUpload = async (
  //   files: any[],
  //   uploadMutation: any,
  //   entityId: string
  // ) => {
  //   if (files && files.length > 0) {
  //     const newFiles = files.filter((file: any) => file instanceof File);
  //     if (newFiles.length > 0) {
  //       try {
  //         await uploadMutation.mutateAsync({
  //           data: newFiles,
  //           id: entityId,
  //         });
  //       } catch (uploadError) {
  //         console.error(uploadError);
  //       }
  //     }
  //   }
  // };

  // Xử lý cert
  // const processCertificates = (
  //   certs: any[],
  //   isUpdate = false,
  //   parentUuid?: string
  // ) => {
  //   const promises: Promise<any>[] = [];

  //   certs.forEach((cert, index) => {
  //     const certData = {
  //       ...cert,
  //       dateOfDecision: format(cert.dateOfDecision, "yyyy-MM-dd"),
  //       effectiveDate: format(cert.effectiveDate, "yyyy-MM-dd"),
  //     };

  //     if (isUpdate && cert.uuid && !!id) {
  //       // Update existing certificate only if touched
  //       const isTouched =
  //         form.formState.touchedFields.certificates?.[index] ||
  //         form.formState.dirtyFields.certificates?.[index];
  //       if (!isTouched) return;

  //       const promise = updateCertMutation
  //         .mutateAsync({ data: certData, uuid: id })
  //         .then(async () => {
  //           await handleFileUpload(
  //             cert.files,
  //             uploadCertFilesMutation,
  //             cert.uuid
  //           );
  //         });
  //       promises.push(promise);
  //     } else if (!cert.uuid) {
  //       // Add new certificate
  //       const promise = addCertMutation
  //         .mutateAsync({ data: certData, uuid: parentUuid || id! })
  //         .then(async (certResult) => {
  //           if (certResult.uuid) {
  //             await handleFileUpload(
  //               cert.files,
  //               uploadCertFilesMutation,
  //               certResult.uuid
  //             );
  //           }
  //         });
  //       promises.push(promise);
  //     }
  //   });

  //   return promises;
  // };

  // Xử lý thẻ
  // const processCards = (
  //   cardList: any[],
  //   isUpdate = false,
  //   parentUuid?: string
  // ) => {
  //   const promises: Promise<any>[] = [];

  //   cardList.forEach((card, index) => {
  //     const cardData = {
  //       ...card,
  //       dateOfDecision: format(card.dateOfDecision, "yyyy-MM-dd"),
  //       effectiveDate: format(card.effectiveDate, "yyyy-MM-dd"),
  //       issueDate: format(card.issueDate, "yyyy-MM-dd"),
  //     };

  //     if (isUpdate && card.uuid && !!id) {
  //       // Update existing card only if touched
  //       const isTouched =
  //         form.formState.touchedFields.cards?.[index] ||
  //         form.formState.dirtyFields.cards?.[index];
  //       if (!isTouched) return;

  //       const promise = updateCardMutation
  //         .mutateAsync({ data: cardData, uuid: id })
  //         .then(async () => {
  //           await handleFileUpload(
  //             card.files,
  //             uploadCardFilesMutation,
  //             card.uuid
  //           );
  //         });
  //       promises.push(promise);
  //     } else if (!card.uuid) {
  //       // Add new card
  //       const promise = addCardMutation
  //         .mutateAsync({ data: cardData, uuid: parentUuid || id! })
  //         .then(async (cardResult) => {
  //           if (cardResult.uuid) {
  //             await handleFileUpload(
  //               card.files,
  //               uploadCardFilesMutation,
  //               cardResult.uuid
  //             );
  //           }
  //         });
  //       promises.push(promise);
  //     }
  //   });

  //   return promises;
  // };

  // const onSubmit = async (data: FormData) => {
  //   setIsSubmitting(true);

  //   const { certificates, cards, ...info } = data;

  //   // Chỉ check các trường đã đổi
  //   const touchedCerts = (form.formState.touchedFields.certificates || [])
  //     .map((v, i) => i)
  //     .filter(
  //       (index) =>
  //         form.formState.touchedFields.certificates?.[index] ||
  //         form.formState.dirtyFields.certificates?.[index]
  //     );
  //   const touchedCards = (form.formState.touchedFields.cards || [])
  //     .map((v, i) => i)
  //     .filter(
  //       (index) =>
  //         form.formState.touchedFields.cards?.[index] ||
  //         form.formState.dirtyFields.cards?.[index]
  //     );

  //   // Check các trường thêm mói
  //   const newCerts = (certificates || [])
  //     .map((cert, index) => (!cert.uuid ? index : null))
  //     .filter((v) => v !== null);
  //   const newCards = (cards || [])
  //     .map((card, index) => (!card.uuid ? index : null))
  //     .filter((v) => v !== null);

  //   const certindexsToCheck = Array.from(
  //     new Set([...touchedCerts, ...newCerts])
  //   );
  //   const cardindexsToCheck = Array.from(
  //     new Set([...touchedCards, ...newCards])
  //   );

  //   const certExistPromises = certindexsToCheck.map((index) => {
  //     const cert = certificates?.[index];
  //     if (!cert || !cert.certCode)
  //       return Promise.resolve({ index, exists: false });
  //     return checkCertExistMutation
  //       .mutateAsync({ certCode: cert.certCode, certId: cert.uuid || "" })
  //       .then((exists) => ({ index, exists }))
  //       .catch(() => ({ index, exists: false }));
  //   });

  //   const cardExistPromises = cardindexsToCheck.map((index) => {
  //     const card = cards?.[index];
  //     if (!card || !card.cardCode || !card.orgId)
  //       return Promise.resolve({ index, exists: false });
  //     return checkCardExistMutation
  //       .mutateAsync({
  //         organizationId: card.orgId,
  //         cardCode: card.cardCode,
  //         cardId: card.uuid || "",
  //       })
  //       .then((exists) => ({ index, exists }))
  //       .catch(() => ({ index, exists: false }));
  //   });

  //   const [certResults, cardResults] = await Promise.all([
  //     Promise.allSettled(certExistPromises),
  //     Promise.allSettled(cardExistPromises),
  //   ]);

  //   // 2. Highlight trường lỗi (exists === true)
  //   let hasInvalid = false;
  //   (certResults || []).forEach((res) => {
  //     if (
  //       res.status === "fulfilled" &&
  //       res.value &&
  //       res.value.exists === true
  //     ) {
  //       hasInvalid = true;
  //       form.setError(`certificates.${res.value.index}.certCode`, {
  //         type: "manual",
  //         message: "Số CCHN đã tồn tại",
  //       });
  //     }
  //   });
  //   (cardResults || []).forEach((res) => {
  //     if (
  //       res.status === "fulfilled" &&
  //       res.value &&
  //       res.value.exists === true
  //     ) {
  //       hasInvalid = true;
  //       form.setError(`cards.${res.value.index}.cardCode`, {
  //         type: "manual",
  //         message: "Số thẻ ĐGV đã tồn tại",
  //       });
  //     }
  //   });

  //   if (hasInvalid) {
  //     setIsSubmitting(false);
  //     toast.error("Vui lòng kiểm tra lại các trường bị trùng.");
  //     return;
  //   }

  //   const submitInfo = {
  //     ...info,
  //     dob: info.dob ? format(info.dob, "yyyy-MM-dd") : "",
  //     idDoi: info.idDoi ? format(info.idDoi, "yyyy-MM-dd") : "",
  //   };

  //   if (!id) {
  //     // Thêm mới
  //     addMutation.mutate(submitInfo, {
  //       onSuccess: async (mainResult) => {
  //         if (mainResult.uuid) {
  //           const promises = [
  //             ...processCertificates(certificates, false, mainResult.uuid),
  //             ...processCards(cards || [], false, mainResult.uuid),
  //           ];

  //           const results = await Promise.allSettled(promises);
  //           const failures = results.filter(
  //             (result) => result.status === "rejected"
  //           );

  //           if (failures.length > 0) {
  //             toast.error(
  //               `Có ${failures.length} lỗi xảy ra khi thêm thông tin chi tiết`
  //             );
  //           } else {
  //             toast.success("Thêm mới Đấu giá viên thành công");
  //           }

  //           router.push("/dau_gia/dau_gia_vien");
  //         }
  //       },
  //       onError: (error: any) => {
  //         toast.error(
  //           error?.response?.data?.errorMessage ||
  //             "Thêm mới Đấu giá viên thất bại"
  //         );
  //       },
  //       onSettled: () => setIsSubmitting(false),
  //     });
  //   } else {
  //     // Cập nhật
  //     try {
  //       const promises: Promise<any>[] = [];

  //       // Cập nhật thông tin chung
  //       const touchedFields = form.formState.touchedFields;
  //       const hasMainInfoTouched = Object.keys(touchedFields).some(
  //         (key) => key !== "certificates" && key !== "cards"
  //       );

  //       if (hasMainInfoTouched) {
  //         promises.push(
  //           updateMutation
  //             .mutateAsync({ ...submitInfo, uuid: id })
  //             .catch((error) => {
  //               console.error("Failed to update main auctioneer info:", error);
  //               throw error;
  //             })
  //         );
  //       }

  //       // Logic xóa
  //       const deletionPromises = [
  //         ...(deletedCerts?.length > 0
  //           ? [
  //               deleteCertMutation.mutateAsync({
  //                 auctioneerId: id,
  //                 uuid: deletedCerts,
  //               }),
  //             ]
  //           : []),
  //         ...(deletedCards?.length > 0
  //           ? [
  //               deleteCardMutation.mutateAsync({
  //                 auctioneerId: id,
  //                 uuid: deletedCards,
  //               }),
  //             ]
  //           : []),
  //         ...deletedCertFiles.flatMap((fileMap) =>
  //           Object.entries(fileMap)
  //             .filter(([certUuid]) => !deletedCerts.includes(certUuid))
  //             .map(([uuid, filePaths]) =>
  //               deleteCertFilesMutation.mutateAsync({ uuid, filePaths })
  //             )
  //         ),
  //         ...deletedCardFiles.flatMap((fileMap) =>
  //           Object.entries(fileMap)
  //             .filter(([cardUuid]) => !deletedCards.includes(cardUuid))
  //             .map(([uuid, filePaths]) =>
  //               deleteCardFilesMutation.mutateAsync({ uuid, filePaths })
  //             )
  //         ),
  //       ];

  //       promises.push(...deletionPromises);

  //       // Xử lý cert và card
  //       promises.push(...processCertificates(certificates, true));
  //       promises.push(...processCards(cards || [], true));

  //       const results = await Promise.allSettled(promises);
  //       const failures = results.filter(
  //         (result) => result.status === "rejected"
  //       );

  //       if (failures.length > 0) {
  //         toast.error(
  //           `Có ${failures.length} lỗi xảy ra khi cập nhật thông tin`
  //         );
  //         console.error("Update failures:", failures);
  //       } else {
  //         toast.success("Cập nhật Đấu giá viên thành công");
  //       }

  //       router.push("/dau_gia/dau_gia_vien");
  //     } catch (error: any) {
  //       const err = error as AxiosError<any>;
  //       toast.error(
  //         err?.response?.data?.errorMessage || "Cập nhật Đấu giá viên thất bại"
  //       );
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   }
  // };

  // const onError = (errors: any) => {
  //   console.error("Form submission errors:", errors);
  //   Object.entries(errors).forEach(([field, error]) => {
  //     console.log(field, error);
  //   });
  // };

  return (
    <>
      <h1 className="text-lg font-bold mb-6 flex items-center gap-2">
        <Link href="/dau_gia/dau_gia_vien">
          <ChevronLeft
            size={24}
            className="p-1 rounded-sm bg-[#E6F2FB] hover:bg-[#E6F2FB]/50 cursor-pointer"
          />
        </Link>
        {id ? "Cập nhật Đấu giá viên" : "Thêm mới Đấu giá viên"}
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
            <InfoSection />
            <FormField
              name="certificates"
              control={form.control}
              render={() => (
                <CertificateSection
                  setDeletedCerts={setDeletedCerts}
                  setDeletedCertFiles={setDeletedCertFiles}
                />
              )}
            />

            <FormField
              name="cards"
              control={form.control}
              render={() => (
                <CardSection
                  setDeletedCardFiles={setDeletedCardFiles}
                  setDeletedCards={setDeletedCards}
                />
              )}
            />

            <section className="flex items-center justify-center gap-4 w-full mt-6 sticky bottom-0 bg-white p-4 border-t">
              {/* <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : id ? "Cập nhật" : "Thêm mới"}
              </Button> */}
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dau_gia/dau_gia_vien")}
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
        onSubmit={() => router.push("/dau_gia/dau_gia_vien")}
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

export default UpsertAuctioneerForm;
