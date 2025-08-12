"use client";

import bg from "@/assets/images/trong_dong.png";
import Footer from "@/components/common/footer";
import NavbarPublic from "@/components/navbar/navbarPublic";
import { SCREENS_SIZE } from "@/constants/common";
import useWindowSize from "@/hooks/useWindowResize";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ProgressProvider } from "@bprogress/next/app";

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const windowSize = useWindowSize();
  const isMobile = windowSize && windowSize.width <= SCREENS_SIZE.md;
  const pathname = usePathname();

  return (
    <ProgressProvider
      height="2px"
      color="#ff833d"
      options={{ showSpinner: false }}
      shallowRouting
    >
      <div className="h-screen overflow-y-auto bg-[#f3f3f3]">
        <div
          className={cn(
            isMobile ? "" : "min-h-screen flex flex-col justify-between",
            "bg-default-gray"
          )}
        >
          <NavbarPublic />
          <div className="w-full bg-[#f3f3f3] items-stretch flex justify-center relative">
            <main
              key={pathname}
              className={cn(
                "overflow-y-auto relative bg-white scroll-smooth w-full max-w-[1200px] my-8 min-h-[600px]"
              )}
            >
              <div className="pt-0">{children}</div>
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </ProgressProvider>
  );
};

export default PublicLayout;
