"use client";

import ConfirmModal from "@/components/common/confirmModal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import ChiefSection from "./chiefSection";
import InfoSection from "./infoSection";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addCCVOrg, getCCVOrgById, updateCCVOrg } from "@/service/notaryOrg";
import { toast } from "sonner";
import { QUERY_KEY } from "@/constants/common";
import { format, fromUnixTime } from "date-fns";
import { CCVOrgSubmitBody } from "@/types/congChung";
import NotarySection from "./notarySection";

const formSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên tổ chức"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  tel: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại")
    .max(10, "Sai định dạng số điện thoại")
    .regex(/^0/, "Sai định dạng số điện thoại")
    .trim(),
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  provinceId: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
  addressId: z.string().min(1, "Vui lòng chọn phường/xã"),
  administrationId: z.string().min(1, "Vui lòng nhập ID quản lý"),
  status: z.string().min(1, "Vui lòng chọn trạng thái"),
  // Trưởng văn phòng
  notaryIdOfficeChief: z.string().min(1, "Vui lòng chọn trưởng văn phòng"),
  idNo: z.string().optional(),
  chiefName: z.string().optional(),
  phoneNumber: z
    .string()
    .max(10, "Sai định dạng số điện thoại")
    .regex(/^0/, "Sai định dạng số điện thoại")
    .optional()
    .or(z.literal("")),
  sex: z.string().optional(),
  birthDay: z.string().optional(),
  addressResident: z.string().optional(),
  idAppoint: z.string().optional(),
  genDateAppoint: z.string().optional(),
});

const UpsertNotaryOrgForm = ({ id }: { id?: number }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      tel: "",
      email: "",
      provinceId: "",
      addressId: "",
      administrationId: "",
      status: "",
      // Trưởng văn phòng
      notaryIdOfficeChief: "",
      idNo: "",
      chiefName: "",
      phoneNumber: "",
      sex: "",
      birthDay: "",
      addressResident: "",
      idAppoint: "",
      genDateAppoint: "",
    },
  });

  const addMutation = useMutation({
    mutationFn: addCCVOrg,
  });

  const updateMutation = useMutation({
    mutationFn: updateCCVOrg,
    onSuccess: () => {
      toast.success("Cập nhật Tổ chức hành nghề công chứng thành công");
      router.push("/cong_chung/to_chuc");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.errorMessage ||
          "Cập nhật Tổ chức hành nghề công chứng thất bại"
      );
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const detailQuery = useQuery({
    queryKey: [QUERY_KEY.CONG_CHUNG.TO_CHUC, id],
    queryFn: () => getCCVOrgById(id!),
    refetchOnWindowFocus: false,
    enabled: !!id,
    gcTime: 0,
    staleTime: 0,
  });

  useEffect(() => {
    if (detailQuery.data) {
      const data = detailQuery.data.data.orgNotaryInfoView;
      form.reset({
        name: data.name || "",
        address: data.address || "",
        tel: data.tel || "",
        email: data.email || "",
        provinceId: data.cityId || "",
        addressId: data.addressId?.toString() || "",
        administrationId: data.administrationId?.toString() || "",
        notaryIdOfficeChief: data.notaryIdOfficeChief?.toString() || "",
        idNo: data.idNo || "",
        chiefName: data.officeChiefName || "",
        phoneNumber: data.phoneNumber || "",
        status: data.statusOrg?.toString() || "",
        sex: data?.sex === 2 ? "Nữ" : data?.sex === 1 ? "Nam" : "",
        birthDay: data.birthDay
          ? format(fromUnixTime(data.birthDay / 1000), "dd/MM/yyyy")
          : "",
      });
    }
  }, [detailQuery.data]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    const submitData: CCVOrgSubmitBody = {
      name: data.name,
      address: data.address,
      tel: data.tel,
      email: data.email,
      notaryIdOfficeChief: Number(data.notaryIdOfficeChief),
      addressId: Number(data.addressId),
      administrationId: Number(data.administrationId),
      status: Number(data.status),
    };
    if (!id) {
      addMutation.mutate(submitData, {
        onSuccess: () => {
          toast.success("Thêm mới Tổ chức hành nghề công chứng thành công");
          router.push("/cong_chung/to_chuc");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.errorMessage ||
              "Thêm mới Tổ chức hành nghề công chứng thất bại"
          );
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      });
    } else {
      updateMutation.mutate({
        id: id,
        ...submitData,
      });
    }
  };

  const onError = (errors: any) => {
    console.error("Form submission errors:", errors);

    if (errors && errors.info) {
      console.log("Info section errors:", errors.info);
    }

    Object.entries(errors).forEach(([section, err]) => {
      console.log(section, err);
    });
  };

  return (
    <>
      <h1 className="flex items-center gap-2 text-lg font-bold mb-6">
        <Link href="/cong_chung/to_chuc">
          <ChevronLeft
            size={24}
            className="p-1 rounded-sm bg-[#E6F2FB] hover:bg-[#E6F2FB]/50 cursor-pointer"
          />
        </Link>
        {id
          ? "Cập nhật Tổ chức hành nghề công chứng"
          : "Tạo mới Tổ chức hành nghề công chứng"}
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

            <ChiefSection />

            {!!id && <NotarySection id={id} />}

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
        onSubmit={() => router.push("/cong_chung/to_chuc")}
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

export default UpsertNotaryOrgForm;
