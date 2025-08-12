"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const NotFound = () => {
  const router = useRouter();
  const session = useSession();
  useEffect(() => {
    if (session.status === "authenticated") {
      router.replace("/trang_chu");
    } else if (session.status === "unauthenticated") {
      router.replace("/public/cong_chung");
    }
  }, [router, session.status]);

  return <></>;
};

export default NotFound;
