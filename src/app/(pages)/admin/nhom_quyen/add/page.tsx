"use client";

import GroupAddForm from "@/components/admin/nhom_quyen/groupForm";
import { redirect } from "next/navigation";

const UserGroupAdd = () => {
  redirect("/");
  return (
    <>
      <h1 className="text-lg font-bold mb-6 uppercase">THÊM MỚI NHÓM QUYỀN</h1>

      <GroupAddForm />
    </>
  );
};

export default UserGroupAdd;
