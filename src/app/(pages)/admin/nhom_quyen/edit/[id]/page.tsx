"use client";

import GroupAddForm from "@/components/admin/nhom_quyen/groupForm";
import { redirect } from "next/navigation";

const GroupEditForm = () => {
  redirect("/")
  return (
    <>
      <h1 className="text-lg font-bold mb-6 uppercase">CẬP NHẬT NHÓM QUYỀN</h1>

      <GroupAddForm />
    </>
  );
};

export default GroupEditForm;
