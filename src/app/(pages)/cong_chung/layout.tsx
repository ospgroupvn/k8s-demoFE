import { USER_TYPE } from "@/constants/common";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const NotaryLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (session?.user?.type === USER_TYPE.DOAN_LUAT_SU) {
    redirect("/");
  }
  
  return <>{children}</>;
};

export default NotaryLayout;
