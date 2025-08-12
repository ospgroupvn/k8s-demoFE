"use client";

import { Navbar } from "@/components/navbar";
import { AppSidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/Hooks";
import { useSession } from "next-auth/react";
// import { useSession } from "next-auth/react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import Loading from "../loading";
import { ProgressProvider } from "@bprogress/next/app";

const LayoutClient = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isMobile = useAppSelector((state) => state.systemStateReducer.isMobile);
  // const pathname = usePathname();
  // const collapsed = useAppSelector(
  //   (state) => state?.systemStateReducer?.collapsed
  // );
  const session = useSession();
  // const userInfo = session?.user;

  if (session?.status === "unauthenticated") {
    redirect("/public/cong_chung");
  }

  return (
    <>
      {session.status === "loading" ? (
        <Loading />
      ) : (
        <ProgressProvider
          height="2px"
          color="#ff833d"
          options={{ showSpinner: false }}
          shallowRouting
        >
          <div className="h-screen overflow-y-auto">
            <div className="[--header-height:calc(--spacing(14))]">
              <Navbar />
              <SidebarProvider className="flex flex-col">
                <div className="flex flex-1">
                  <AppSidebar />
                  <SidebarInset
                    className={cn(
                      "bg-[#F8FAFC] w-full",
                      !isMobile &&
                        "p-4 w-[calc(100vw_-_var(--sidebar-width)_-_20px)]"
                    )}
                  >
                    <div className="w-full">{children}</div>
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </div>
          </div>
        </ProgressProvider>
      )}
    </>
  );
};

export default LayoutClient;
