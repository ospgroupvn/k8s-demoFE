import { USER_TYPE } from "@/constants/common";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const LawyerLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (
    session?.user?.type !== USER_TYPE.DOAN_LUAT_SU &&
    session?.user?.type !== USER_TYPE.ADMIN
  ) {
    redirect("/");
  }

  return <>{children}</>;
};

export default LawyerLayout;
