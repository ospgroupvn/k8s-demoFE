"use client";
import { SCREENS_SIZE } from "@/constants/common";
import useWindowSize from "@/hooks/useWindowResize";
import {
  setIsMobile,
  setIsOpenMenuMobile,
  setSidebarCollapse,
} from "@/redux/features/systemSlice";
import { useAppDispatch, useAppSelector } from "@/redux/Hooks";
import { useEffect } from "react";
import SidebarFull from "./sidebarFull";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const collapsed = useAppSelector(
    (state) => state.systemStateReducer.collapsed
  );
  const isMobile = useAppSelector((state) => state.systemStateReducer.isMobile);
  const isOpenMenuMobile = useAppSelector(
    (state) => state.systemStateReducer.isOpenMenuMobile
  );
  const dispatch = useAppDispatch();

  const windowSize = useWindowSize();

  useEffect(() => {
    if (windowSize && windowSize.width <= SCREENS_SIZE.md) {
      dispatch(setIsMobile({ isMobile: true }));
      dispatch(setSidebarCollapse({ collapsed: false }));
    } else {
      dispatch(setIsMobile({ isMobile: false }));
      dispatch(setIsOpenMenuMobile({ isOpenMenuMobile: false }));
    }
  }, [dispatch, windowSize]);

  return (
    <aside
      className={
        isMobile
          ? `fixed w-full z-1500 overflow-y-auto left-[-100%] transition-all duration-100 ease-linear bg-white shadow-lg ${
              isOpenMenuMobile ? "left-0!" : ""
            }`
          : "flex flex-col relative  " +
            `${collapsed ? "w-[60px]" : "w-[250px]"}`
      }
    >
      <nav className={cn("grow overflow-y-auto", isMobile && "px-1")}>
        <ul className="flex flex-col items-stretch max-sm:h-screen">
          <SidebarFull />
        </ul>
      </nav>
      {/* <SidebarFooter /> */}
    </aside>
  );
};

export { Sidebar };
