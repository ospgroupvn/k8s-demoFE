"use client";

import { upsertNotaryFormSchema as formSchema } from "@/app/form/notary/upsertSchema";
import ConfirmModal from "@/components/common/confirmModal";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { QUERY_KEY } from "@/constants/common";
import { NOTARY_APPOINT_MAP } from "@/constants/congChung";
import {
  addCCV,
  addCCVProbation,
  appointCCV,
  deleteAppointCCV,
  deleteCCV,
  deleteFileCCV,
  deletePenalizeCCV,
  getCCVById,
  penalizeCCV,
  registerPracticeCCV,
  suspendCCV,
  updateAppointCCV,
  updateCCV,
  updateCCVProbation,
  updatePenalizeCCV,
  updateRegisterPracticeCCV,
  updateSuspendCCV,
  UploadFileCCV,
} from "@/service/notaryOrg";
import { OrgCCVDetailResponsePrivate } from "@/types/congChung";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import AppointSection from "./appointSection";
import InfoSection from "./infoSection";
import InternSection from "./internSection";
import RegisterSection from "./registerSection";
import SuspendSection from "./suspendSection";
import ViolationHandlingSection from "./violationSection";

const UpsertNotaryForm = ({ id }: { id?: number }) => {
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletedAppoints, setDeletedAppoints] = useState<string[]>([]);
  const [deletedViolations, setDeletedViolations] = useState<string[]>([]);
  const [deletedInternFiles, setDeletedInternFiles] = useState<string[]>([]);
  const [deletedAppointFiles, setDeletedAppointFiles] = useState<
    Record<string, string[]>[]
  >([]);
  const [deletedSuspendFiles, setDeletedSuspendFiles] = useState<string[]>([]);
  const [deletedViolationFiles, setDeletedViolationFiles] = useState<
    Record<string, string[]>[]
  >([]);
  const router = useRouter();

  const defaultValues: z.infer<typeof formSchema> = {
    administrationId: "",
    name: "",
    birthDay: undefined,
    sex: "",
    phoneNumber: "",
    email: "",
    idNo: "",
    idNoDate: undefined,
    addressIdNo: "",
    addressResident: "",
    addressResidentId: "",
    residentProvince: "",
    addressNow: "",
    addressNowId: "",
    nowProvince: "",
    status: "",
    intern: [
      {
        dispatchCode: "",
        dateSign: undefined,
        idOrg: "",
        address: "",
        dateStart: undefined,
        dateNumber: 0,
        files: [],
        fileName: "",
        linkFile: "",
      },
    ],
    appoints: [],
    register: [
      {
        orgNotaryInfoId: "",
        orgName: "",
        dispatchCode: "",
        decisionDate: undefined,
        effectiveDate: undefined,
        numberCad: "",
        status: "",
        reason: "",
      },
    ],
    suspend: [
      {
        dispatchCode: "",
        decisionDate: undefined,
        effectiveDate: undefined,
        dateNumber: 0,
        signer: "",
        reason: "",
        files: [],
        fileName: "",
        linkFile: "",
      },
    ],
    violation: [],
  };

  const detailQuery = useQuery({
    queryKey: [QUERY_KEY.CONG_CHUNG.CONG_CHUNG_VIEN, id!],
    queryFn: () => getCCVById(id!),
    enabled: !!id,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (detailQuery.data) {
      const data = detailQuery.data?.data;
      form.reset({
        administrationId: data.administrationId?.toString() || "",
        name: data.name || "",
        birthDay: data.birthDay ? new Date(data.birthDay) : undefined,
        sex: data.sex?.toString() || "",
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
        idNo: data.idNo || "",
        idNoDate: data.idNoDate ? new Date(data.idNoDate) : undefined,
        addressIdNo: data.addressIdNo || "",
        addressResident: data.addressResident || "",
        residentProvince: data.cityResidentId || "",
        addressResidentId: data.addressResidentId?.toString() || "",
        addressNow: data.addressNow || "",
        nowProvince: data.cityNowId || "",
        addressNowId: data.addressNowId?.toString() || "",
        status: data.status?.toString() || "",
        intern: data.notaryProbationaryResponse
          ? [
              {
                dispatchCode:
                  data.notaryProbationaryResponse.dispatchCode || "",
                dateSign: data.notaryProbationaryResponse.dateSign
                  ? new Date(data.notaryProbationaryResponse.dateSign)
                  : undefined,
                idOrg: data.notaryProbationaryResponse.idOrg?.toString() || "",
                address: data.notaryProbationaryResponse.address || "",
                dateStart: data.notaryProbationaryResponse.dateStart
                  ? new Date(data.notaryProbationaryResponse.dateStart)
                  : undefined,
                dateNumber: data.notaryProbationaryResponse.dateNumber || 0,
                files: data.notaryProbationaryResponse.linkFile
                  ? [
                      {
                        fileName: data.notaryProbationaryResponse.fileName,
                        filePath:
                          data.notaryProbationaryResponse.linkFile || "",
                      },
                    ]
                  : [],
                idProbationary:
                  data.notaryProbationaryResponse.idProbationary?.toString() ||
                  "",
                documentId:
                  data.notaryProbationaryResponse.documentId || undefined,
                fileName: data.notaryProbationaryResponse.fileName || "",
                linkFile: data.notaryProbationaryResponse.linkFile || "",
              },
            ]
          : [
              {
                dispatchCode: "",
                dateSign: undefined,
                idOrg: "",
                address: "",
                dateStart: undefined,
                dateNumber: 0,
                files: [],
                idProbationary: "",
                fileName: "",
                linkFile: "",
              },
            ],
        appoints:
          data.notaryAppointResponses?.map((appoint) => {
            const appointType = Object.entries(NOTARY_APPOINT_MAP).find(
              ([key, value]) =>
                value.type === appoint.type && value.kind === appoint.kind
            );
            return {
              id: appoint.id?.toString() || "", // Add id for update tracking
              type: appointType ? appointType[0] : "",
              dispatchCode: appoint.dispatchCode || "",
              requestDate: appoint.requestDate
                ? new Date(appoint.requestDate)
                : undefined,
              dateSign: appoint.dateSign
                ? new Date(appoint.dateSign)
                : undefined,
              signer: appoint.signer || "",
              files: appoint.linkFile
                ? [
                    {
                      fileName: appoint.fileName,
                      filePath: appoint.linkFile || "",
                    },
                  ]
                : [],
              effectiveDate: appoint.effectiveDate
                ? new Date(appoint.effectiveDate)
                : undefined,
              documentId: appoint.documentId || undefined,
              fileName: appoint.fileName || "",
              linkFile: appoint.linkFile || "",
            };
          }) || [],
        register: data.notaryRegAndAuctionCardResponse
          ? [
              {
                orgNotaryInfoId:
                  data.notaryRegAndAuctionCardResponse.orgNotaryInfoId?.toString() ||
                  "",
                orgName: "", // Not available in response
                dispatchCode:
                  data.notaryRegAndAuctionCardResponse.dispatchCode || "",
                decisionDate: data.notaryRegAndAuctionCardResponse.decisionDate
                  ? new Date(data.notaryRegAndAuctionCardResponse.decisionDate)
                  : undefined,
                effectiveDate: data.notaryRegAndAuctionCardResponse
                  .effectiveDate
                  ? new Date(data.notaryRegAndAuctionCardResponse.effectiveDate)
                  : undefined,
                numberCad: data.notaryRegAndAuctionCardResponse.numberCad || "",
                status:
                  data.notaryRegAndAuctionCardResponse.status?.toString() || "",
                reason: "", // Not available in response
                id: data.notaryRegAndAuctionCardResponse.id?.toString() || "",
              },
            ]
          : [
              {
                orgNotaryInfoId: "",
                orgName: "",
                dispatchCode: "",
                decisionDate: undefined,
                effectiveDate: undefined,
                numberCad: "",
                status: "",
                reason: "",
              },
            ],
        suspend: data.notarySuspendWorkResponse
          ? [
              {
                dispatchCode: data.notarySuspendWorkResponse.dispatchCode || "",
                decisionDate: data.notarySuspendWorkResponse.decisionDate
                  ? new Date(data.notarySuspendWorkResponse.decisionDate)
                  : undefined,
                effectiveDate: data.notarySuspendWorkResponse.effectiveDate
                  ? new Date(data.notarySuspendWorkResponse.effectiveDate)
                  : undefined,
                dateNumber: data.notarySuspendWorkResponse.dateNumber || 0,
                signer: data.notarySuspendWorkResponse.signer || "",
                reason: data.notarySuspendWorkResponse.reason || "",
                files: data.notarySuspendWorkResponse.linkFile
                  ? [
                      {
                        fileName: data.notarySuspendWorkResponse.fileName,
                        filePath: data.notarySuspendWorkResponse.linkFile || "",
                      },
                    ]
                  : [],
                id: data.notarySuspendWorkResponse.id?.toString() || "",
                documentId:
                  data.notarySuspendWorkResponse.documentId || undefined,
                fileName: data.notarySuspendWorkResponse.fileName || "",
                linkFile: data.notarySuspendWorkResponse.linkFile || "",
              },
            ]
          : [
              {
                dispatchCode: "",
                decisionDate: undefined,
                effectiveDate: undefined,
                dateNumber: 0,
                signer: "",
                reason: "",
                files: [],
                fileName: "",
                linkFile: "",
              },
            ],
        violation:
          data.notaryPenalizeResponse?.map((violation) => ({
            id: violation.id?.toString() || "", // Add id for update tracking
            dispatchCode: violation.dispatchCode || "",
            decisionDate: violation.decisionDate
              ? new Date(violation.decisionDate)
              : undefined,
            effectiveDate: violation.effectiveDate
              ? new Date(violation.effectiveDate)
              : undefined,
            typePenalize: violation.typePenalize?.toString() || "",
            reason: violation.reason || "",
            files: violation.linkFile
              ? [
                  {
                    fileName: violation.fileName,
                    filePath: violation.linkFile || "",
                  },
                ]
              : [],
            signer: "", // Not available in response
            orgNotaryId: violation.orgNotaryId?.toString() || "",
            leverPenalize: violation.leverPenalize?.toString() || "",
            additionalPenalty: violation.additionalPenalty?.toString() || "",
            moneyPenalty: violation.moneyPenalty?.toString() || "",
            administrationIdPenalty:
              violation.administrationIdPenalty?.toString() || "",
            fileName: violation.fileName || "",
            linkFile: violation.linkFile || "",
          })) || [],
      });
    }
  }, [detailQuery.data, form]);

  /** Thông tin chung */
  const addNotaryMutation = useMutation({
    mutationFn: addCCV,
  });

  const updateNotaryMutation = useMutation({
    mutationFn: updateCCV,
  });

  const deleteNotaryMutation = useMutation({
    mutationFn: deleteCCV,
  });

  /** Tập sự */
  const addProbationMutation = useMutation({
    mutationFn: addCCVProbation,
  });

  const updateProbationMutation = useMutation({
    mutationFn: updateCCVProbation,
  });

  /** Đăng ký HNCC */
  const addRegisterMutation = useMutation({
    mutationFn: registerPracticeCCV,
  });

  const updateRegisterMutation = useMutation({
    mutationFn: updateRegisterPracticeCCV,
  });

  /** Bổ nhiệm/miễn nhiệm */
  const addAppointCCVMutation = useMutation({
    mutationFn: appointCCV,
  });

  const updateAppointCCVMutation = useMutation({
    mutationFn: updateAppointCCV,
  });

  const deleteAppointCCVMutation = useMutation({
    mutationFn: deleteAppointCCV,
  });

  /** Tạm đình chỉ */
  const addSuspendCCVMutation = useMutation({
    mutationFn: suspendCCV,
  });

  const updateSuspendCCVMutation = useMutation({
    mutationFn: updateSuspendCCV,
  });

  /** Xử lý vi phạm */
  const addPenalizeMutation = useMutation({
    mutationFn: penalizeCCV,
  });

  const updatePenalizeMutation = useMutation({
    mutationFn: updatePenalizeCCV,
  });

  const deletePenalizeMutation = useMutation({
    mutationFn: deletePenalizeCCV,
  });

  /** File upload */
  const uploadFileMutation = useMutation({
    mutationFn: ({ file, id }: { file: File; id: number }) =>
      UploadFileCCV(file, id),
  });

  const deleteFileMutation = useMutation({
    mutationFn: deleteFileCCV,
  });

  // Handle single file upload for cong_chung sections
  const handleFileUpload = async (file: File | undefined, entityId: number) => {
    if (file && file instanceof File) {
      try {
        await uploadFileMutation.mutateAsync({
          file,
          id: entityId,
        });
      } catch (uploadError) {
        console.error("File upload failed:", uploadError);
        toast.error("Tải file lên thất bại");
      }
    }
  };

  // Process intern/probation section
  const processIntern = (
    internData: any[],
    isUpdate = false,
    parentId?: number
  ) => {
    const promises: Promise<any>[] = [];

    if (internData && internData.length > 0 && internData[0]) {
      const intern = internData[0];

      if (isUpdate) {
        const isTouched =
          form.formState.touchedFields.intern?.[0] ||
          form.formState.dirtyFields.intern?.[0];
        if (!isTouched) return promises;
      }

      const formattedData = {
        ...intern,
        dateSign: intern.dateSign
          ? format(intern.dateSign, "yyyy-MM-dd")
          : undefined,
        dateStart: intern.dateStart
          ? format(intern.dateStart, "yyyy-MM-dd")
          : undefined,
      };

      if (isUpdate && intern.idProbationary) {
        // Update existing
        const promise = updateProbationMutation
          .mutateAsync({
            ...formattedData,
            idProbationary: intern.idProbationary?.toString(),
          })
          .then(async (res) => {
            console.log(res.data?.documentId, intern.files);
            if (intern.files && intern.files.length > 0 && intern?.documentId) {
              await handleFileUpload(intern.files[0], intern?.documentId);
            }
          });
        promises.push(promise);
      } else if (!isUpdate || !intern.idProbationary) {
        // Add new
        const promise = addProbationMutation
          .mutateAsync({
            data: formattedData,
            id: parentId!,
          })
          .then(async (res) => {
            if (
              intern.files &&
              intern.files.length > 0 &&
              res.data?.documentCertificateId
            ) {
              await handleFileUpload(
                intern.files[0],
                res.data?.documentCertificateId
              );
            }
          });
        promises.push(promise);
      }
    }

    return promises;
  };

  // Process register section
  const processRegister = (
    registerData: any[],
    isUpdate = false,
    parentId?: number
  ) => {
    const promises: Promise<any>[] = [];

    if (
      registerData &&
      registerData.length > 0 &&
      registerData[0] &&
      (registerData[0].dispatchCode || registerData[0].decisionDate)
    ) {
      const register = registerData[0];

      if (isUpdate) {
        const isTouched =
          form.formState.touchedFields.register?.[0] ||
          form.formState.dirtyFields.register?.[0];
        if (!isTouched) return promises;
      }

      const formattedData = {
        ...register,
        decisionDate: register.decisionDate
          ? format(register.decisionDate, "yyyy-MM-dd")
          : undefined,
        effectiveDate: register.effectiveDate
          ? format(register.effectiveDate, "yyyy-MM-dd")
          : undefined,
      };

      if (isUpdate && register.id) {
        // Update existing
        const promise = updateRegisterMutation.mutateAsync({
          ...formattedData,
          orgNotaryInfoId: register.orgNotaryInfoId
            ? parseInt(register.orgNotaryInfoId)
            : undefined,
          status: register.status ? parseInt(register.status) : undefined,
          notaryInfoId: parentId!,
          id: parseInt(register.id),
        });
        promises.push(promise);
      } else if (!isUpdate || !register.id) {
        // Add new
        const { id: _, ...registerDataWithoutId } = formattedData;
        const promise = addRegisterMutation.mutateAsync({
          ...registerDataWithoutId,
          orgNotaryInfoId: register.orgNotaryInfoId
            ? parseInt(register.orgNotaryInfoId)
            : undefined,
          status: register.status ? parseInt(register.status) : undefined,
          notaryInfoId: parentId!,
          id: formattedData.id ? parseInt(formattedData.id) : undefined,
        });
        promises.push(promise);
      }
    }

    return promises;
  };

  // Process suspend section
  const processSuspend = (
    suspendData: any[],
    isUpdate = false,
    parentId?: number
  ) => {
    const promises: Promise<any>[] = [];

    if (
      suspendData &&
      suspendData.length > 0 &&
      suspendData[0] &&
      (suspendData[0].dispatchCode || suspendData[0].decisionDate)
    ) {
      const suspend = suspendData[0];

      if (isUpdate) {
        const isTouched =
          form.formState.touchedFields.suspend?.[0] ||
          form.formState.dirtyFields.suspend?.[0];
        if (!isTouched) return promises;
      }

      const formattedData = {
        ...suspend,
        decisionDate: suspend.decisionDate
          ? format(suspend.decisionDate, "yyyy-MM-dd")
          : undefined,
        effectiveDate: suspend.effectiveDate
          ? format(suspend.effectiveDate, "yyyy-MM-dd")
          : undefined,
      };

      if (isUpdate && suspend.id) {
        // Update existing
        const promise = updateSuspendCCVMutation
          .mutateAsync({
            ...formattedData,
            notaryInfoId: parentId!,
          })
          .then(async (res) => {
            if (
              suspend.files &&
              suspend.files.length > 0 &&
              suspend?.documentId
            ) {
              await handleFileUpload(suspend.files[0], suspend?.documentId);
            }
          });
        promises.push(promise);
      } else if (!isUpdate || !suspend.id) {
        // Add new
        const { id: _, ...suspendDataWithoutId } = formattedData;
        const promise = addSuspendCCVMutation
          .mutateAsync({
            ...suspendDataWithoutId,
            notaryInfoId: parentId!,
          })
          .then(async (res) => {
            if (
              suspend.files &&
              suspend.files.length > 0 &&
              res.data?.documentId
            ) {
              await handleFileUpload(suspend.files[0], res.data?.documentId);
            }
          });
        promises.push(promise);
      }
    }

    return promises;
  };

  // Process appointments section
  const processAppointments = (
    appointsData: any[],
    isUpdate = false,
    parentId?: number
  ) => {
    const promises: Promise<any>[] = [];

    if (appointsData && appointsData.length > 0) {
      appointsData.forEach((appointment, index) => {
        if (isUpdate) {
          const isTouched =
            form.formState.touchedFields.appoints?.[index] ||
            form.formState.dirtyFields.appoints?.[index];
          if (!isTouched) return;
        }

        const appointType = NOTARY_APPOINT_MAP[appointment.type];
        const formattedData = {
          ...appointment,
          dateSign: appointment.dateSign
            ? format(appointment.dateSign, "yyyy-MM-dd")
            : undefined,
          effectiveDate: appointment.effectiveDate
            ? format(appointment.effectiveDate, "yyyy-MM-dd")
            : undefined,
          type: appointType.type,
          kind: appointType.kind,
        };

        if (isUpdate && appointment.id && appointment.id.trim() !== "") {
          // Update existing
          const promise = updateAppointCCVMutation
            .mutateAsync({
              ...formattedData,
              notaryInfoId: parentId!,
            })
            .then(async (res) => {
              if (
                appointment.files &&
                appointment.files.length > 0 &&
                appointment?.documentId
              ) {
                await handleFileUpload(
                  appointment.files[0],
                  appointment?.documentId
                );
              }
            });
          promises.push(promise);
        } else if (
          !isUpdate ||
          !appointment.id ||
          appointment.id.trim() === ""
        ) {
          // Add new
          const promise = addAppointCCVMutation
            .mutateAsync({
              ...formattedData,
              notaryInfoId: parentId!,
            })
            .then(async (res) => {
              if (
                appointment.files &&
                appointment.files.length > 0 &&
                res.data?.documentId
              ) {
                await handleFileUpload(
                  appointment.files[0],
                  res.data?.documentId
                );
              }
            });
          promises.push(promise);
        }
      });
    }

    return promises;
  };

  // Process violations section
  const processViolations = (
    violationData: any[],
    isUpdate = false,
    parentId?: number
  ) => {
    const promises: Promise<any>[] = [];

    if (violationData && violationData.length > 0) {
      violationData.forEach((violationItem, index) => {
        if (isUpdate) {
          const isTouched =
            form.formState.touchedFields.violation?.[index] ||
            form.formState.dirtyFields.violation?.[index];
          if (!isTouched) return;
        }

        const formattedData = {
          ...violationItem,
          decisionDate: violationItem.decisionDate
            ? format(violationItem.decisionDate, "yyyy-MM-dd")
            : undefined,
          effectiveDate: violationItem.effectiveDate
            ? format(violationItem.effectiveDate, "yyyy-MM-dd")
            : undefined,
          orgNotaryId: violationItem.orgNotaryId
            ? parseInt(violationItem.orgNotaryId)
            : undefined,
          moneyPenalty: violationItem.moneyPenalty
            ? parseInt(violationItem.moneyPenalty)
            : undefined,
          leverPenalize: violationItem.leverPenalize
            ? parseInt(violationItem.leverPenalize)
            : undefined,
          additionalPenalty: violationItem.additionalPenalty
            ? parseInt(violationItem.additionalPenalty)
            : undefined,
          typePenalize: violationItem.typePenalize
            ? parseInt(violationItem.typePenalize)
            : undefined,
          administrationIdPenalty: violationItem.administrationIdPenalty
            ? parseInt(violationItem.administrationIdPenalty)
            : undefined,
        };

        if (isUpdate && violationItem.id) {
          // Update existing
          const promise = updatePenalizeMutation
            .mutateAsync({
              ...formattedData,
              id: violationItem.id,
              notaryInfoId: parentId!,
            })
            .then(async (res) => {
              if (
                violationItem.files &&
                violationItem.files.length > 0 &&
                res.data?.documentId
              ) {
                await handleFileUpload(
                  violationItem.files[0],
                  res.data?.documentId
                );
              }
            });
          promises.push(promise);
        } else if (!isUpdate || !violationItem.id) {
          // Add new
          const promise = addPenalizeMutation
            .mutateAsync({
              ...formattedData,
              notaryInfoId: parentId!,
            })
            .then(async (res) => {
              if (
                violationItem.files &&
                violationItem.files.length > 0 &&
                res.data?.documentId
              ) {
                await handleFileUpload(
                  violationItem.files[0],
                  res.data?.documentId
                );
              }
            });
          promises.push(promise);
        }
      });
    }

    return promises;
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    const { appoints, violation, register, suspend, intern, ...info } = data;

    // Prepare main info with formatted dates
    const submitInfo: Partial<OrgCCVDetailResponsePrivate> = {
      ...info,
      addressNowId: info.addressNowId ? parseInt(info.addressNowId) : undefined,
      addressResidentId: info.addressResidentId
        ? parseInt(info.addressResidentId)
        : undefined,
      birthDay: info.birthDay ? format(info.birthDay, "yyyy-MM-dd") : undefined,
      idNoDate: info.idNoDate ? format(info.idNoDate, "yyyy-MM-dd") : undefined,
      status: info.status ? parseInt(info.status) : undefined,
    };

    if (!id) {
      // CREATE MODE
      addNotaryMutation.mutate(submitInfo, {
        onSuccess: async (mainResult) => {
          if (mainResult.data) {
            const parentId = mainResult.data;

            try {
              // Step 2: Add intern/probation info first (required step)
              const internPromises = processIntern(
                intern || [],
                false,
                parentId
              );
              if (internPromises.length > 0) {
                try {
                  await Promise.allSettled(internPromises);
                } catch (probationError) {
                  console.error("Probation creation failed:", probationError);
                }
              }

              // Step 3: Add the rest in parallel after probation is successful
              const promises = [
                ...(appoints
                  ? processAppointments(appoints, false, parentId)
                  : []),
                ...(register ? processRegister(register, false, parentId) : []),
                ...(suspend ? processSuspend(suspend, false, parentId) : []),
                ...(violation
                  ? processViolations(violation, false, parentId)
                  : []),
              ];

              // Execute remaining promises in parallel
              if (promises.length > 0) {
                const results = await Promise.allSettled(promises);
                const failures = results.filter(
                  (result) => result.status === "rejected"
                );

                if (failures.length > 0) {
                  toast.error(
                    `Có ${failures.length} lỗi xảy ra khi thêm thông tin chi tiết`
                  );
                  console.error("Submission failures:", failures);
                } else {
                  toast.success("Tạo mới Công chứng viên thành công");
                }
              } else {
                toast.success("Tạo mới Công chứng viên thành công");
              }

              router.push("/cong_chung/cong_chung_vien");
            } catch (error) {
              console.error("Error in sequential submission:", error);
              toast.error("Có lỗi xảy ra trong quá trình thêm thông tin");
            } finally {
              setIsSubmitting(false);
            }
          }
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.errorMessage ||
              "Thêm mới Công chứng viên thất bại"
          );
          setIsSubmitting(false);
        },
      });
    } else {
      // UPDATE MODE
      updateNotaryMutation.mutate(
        { ...submitInfo, idNotaryInfo: id },
        {
          onSuccess: async () => {
            const touchedFields = form.formState.touchedFields;
            const dirtyFields = form.formState.dirtyFields;

            try {
              const promises: Promise<any>[] = [];

              // Handle deletions first
              const deletionPromises = [
                ...deletedAppoints.map((appointId) =>
                  deleteAppointCCVMutation.mutateAsync(parseInt(appointId))
                ),
                ...deletedViolations.map((violationId) =>
                  deletePenalizeMutation.mutateAsync(parseInt(violationId))
                ),
                // Handle file deletions
                ...deletedInternFiles.map((filePath) =>
                  deleteFileMutation.mutateAsync(filePath)
                ),
                ...deletedSuspendFiles.map((filePath) =>
                  deleteFileMutation.mutateAsync(filePath)
                ),
                ...deletedAppointFiles.flatMap((fileMap) =>
                  Object.entries(fileMap)
                    .filter(
                      ([appointId]) => !deletedAppoints.includes(appointId)
                    )
                    .map(([_, filePaths]) =>
                      filePaths.map((filePath) =>
                        deleteFileMutation.mutateAsync(filePath)
                      )
                    )
                    .flat()
                ),
                ...deletedViolationFiles.flatMap((fileMap) =>
                  Object.entries(fileMap)
                    .filter(
                      ([violationId]) =>
                        !deletedViolations.includes(violationId)
                    )
                    .map(([_, filePaths]) =>
                      filePaths.map((filePath) =>
                        deleteFileMutation.mutateAsync(filePath)
                      )
                    )
                    .flat()
                ),
              ];

              promises.push(...deletionPromises);

              // Process touched sections using modular functions
              if (touchedFields.intern || dirtyFields.intern) {
                promises.push(...processIntern(intern || [], true, id!));
              }

              if (touchedFields.appoints || dirtyFields.appoints) {
                promises.push(
                  ...(appoints ? processAppointments(appoints, true, id!) : [])
                );
              }

              if (touchedFields.register || dirtyFields.register) {
                promises.push(
                  ...(register ? processRegister(register, true, id!) : [])
                );
              }

              if (touchedFields.suspend || dirtyFields.suspend) {
                promises.push(
                  ...(suspend ? processSuspend(suspend, true, id!) : [])
                );
              }

              if (touchedFields.violation || dirtyFields.violation) {
                promises.push(
                  ...(violation ? processViolations(violation, true, id!) : [])
                );
              }

              // Execute all promises in parallel
              if (promises.length > 0) {
                const results = await Promise.allSettled(promises);
                const failures = results.filter(
                  (result) => result.status === "rejected"
                );

                if (failures.length > 0) {
                  toast.error(
                    `Có ${failures.length} lỗi xảy ra khi cập nhật thông tin chi tiết`
                  );
                  console.error("Update failures:", failures);
                } else {
                  toast.success("Cập nhật Công chứng viên thành công");
                }
              } else {
                toast.success("Cập nhật Công chứng viên thành công");
              }

              router.push("/cong_chung/cong_chung_vien");
            } catch (error) {
              console.error("Error in update submission:", error);
              toast.error("Có lỗi xảy ra trong quá trình cập nhật thông tin");
            } finally {
              setIsSubmitting(false);
            }
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.errorMessage ||
                "Cập nhật Công chứng viên thất bại"
            );
            setIsSubmitting(false);
          },
        }
      );
    }
  };

  const onError = (errors: any) => {
    console.error("Form submission errors:", errors);
    // If using zodResolver, errors from Zod are in errors (from RHF), but you can also:
    if (errors && errors.info) {
      console.log("Info section errors:", errors.info);
    }
    // To see all error paths and messages:
    Object.entries(errors).forEach(([section, err]) => {
      console.log(section, err);
    });
  };

  return (
    <>
      <h1 className="flex items-center gap-2 text-lg font-bold mb-6">
        <Link href="/cong_chung/cong_chung_vien">
          <ChevronLeft
            size={24}
            className="p-1 rounded-sm bg-[#E6F2FB] hover:bg-[#E6F2FB]/50 cursor-pointer"
          />
        </Link>
        {id ? "Cập nhật Công chứng viên" : "Tạo mới Công chứng viên"}
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
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <InfoSection />
            <InternSection setDeletedInternFiles={setDeletedInternFiles} />
            <FormField
              name="appoints"
              control={form.control}
              render={() => (
                <AppointSection
                  setDeletedAppoints={setDeletedAppoints}
                  setDeletedAppointFiles={setDeletedAppointFiles}
                />
              )}
            />
            <FormField
              name="register"
              control={form.control}
              render={() => <RegisterSection />}
            />
            <FormField
              name="suspend"
              control={form.control}
              render={() => (
                <SuspendSection
                  setDeletedSuspendFiles={setDeletedSuspendFiles}
                />
              )}
            />
            <FormField
              name="violation"
              control={form.control}
              render={() => (
                <ViolationHandlingSection
                  setDeletedViolations={setDeletedViolations}
                  setDeletedViolationFiles={setDeletedViolationFiles}
                />
              )}
            />
            <section className="flex items-center justify-center gap-4 w-full sticky bottom-0 bg-white p-4 border-t">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : id ? "Cập nhật" : "Tạo mới"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsShowConfirmModal(true)}
                className="border-[#222]"
                disabled={isSubmitting}
              >
                Hủy
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
        onSubmit={() => router.push("/cong_chung/cong_chung_vien")}
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

export default UpsertNotaryForm;
