import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LIST_SIZE, PAGE_NUMBER } from "@/constants/common";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { MdOutlineSkipNext } from "react-icons/md";

interface CommonPaginationProps {
  data?: {
    items: any[];
    rowCount?: number;
    numberPerPage: number;
    pageNumber?: number;
    checkLast?: number;
    pageList: number[];
    pageCount: number;
    total?: number;
  };
  setSearchParam: Dispatch<SetStateAction<any>>;
  searchParam: any;
  className?: string | undefined;
  isShowSelect?: boolean;
}

const CommonPagination: React.FC<CommonPaginationProps> = ({
  data = {
    items: [],
    numberPerPage: 10,
    pageCount: 0,
    pageList: [],
    pageNumber: 1,
  },
  setSearchParam,
  searchParam,
  className,
  isShowSelect = true,
}) => {
  const newPageList = () => {
    if (!data?.pageList?.length) {
      return [];
    }

    if (data?.pageList?.length <= 5) {
      return data?.pageList;
    }

    const currentIndex = data?.pageList?.findIndex(
      (item) => item === data?.pageNumber
    );

    if (currentIndex === -1) {
      return [];
    }

    if (currentIndex > data?.pageList?.length - 3) {
      return data?.pageList?.slice(
        data?.pageList?.length - 5,
        data?.pageList?.length
      );
    }

    if (currentIndex < 2) {
      return data?.pageList?.slice(0, 5);
    } else {
      return data?.pageList?.slice(currentIndex - 2, currentIndex + 3);
    }
  };

  const scrollToTop = () => {
    document
      .getElementById("table")
      ?.parentElement?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={cn(
        "flex justify-between items-center my-4! gap-y-2 flex-col lg:flex-row",
        className
      )}
    >
      <div className="flex gap-2 items-center max-sm:flex-col max-sm:justify-center">
        <div className="flex justify-between items-center">
          <span className="pl-1 mr-4 text-sm">
            Tổng số bản ghi:{" "}
            <span className="font-semibold">
              {data?.rowCount || data?.total || 0}
            </span>
          </span>
        </div>

        {isShowSelect ? (
          <div className="flex justify-between items-center ">
            <span className="mr-2 text-xs font-bold">Hiển thị:</span>
            <Select
              onValueChange={(value: string) => {
                setSearchParam({
                  ...searchParam,
                  numberPerPage: Number(value),
                  pageNumber: PAGE_NUMBER,
                });
                scrollToTop();
              }}
              value={searchParam.numberPerPage.toString()}
            >
              <SelectTrigger className="w-16 border border-[#d9d9d9] rounded-none">
                <SelectValue
                  defaultValue={data?.numberPerPage?.toString()}
                  placeholder={data?.numberPerPage?.toString()}
                />
              </SelectTrigger>
              <SelectContent>
                {LIST_SIZE?.map((item) => (
                  <SelectItem key={item} value={item.toString()}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="font-bold ml-1 text-xs">bản ghi</span>
          </div>
        ) : (
          <></>
        )}
      </div>

      <ul className="flex items-center justify-center rounded-none flex-wrap">
        {(!data?.pageNumber || data?.pageNumber > 1) && (
          <>
            <li
              onClick={() => {
                setSearchParam({ ...searchParam, pageNumber: PAGE_NUMBER });
                scrollToTop();
              }}
              className={cn(
                "page__btn flex items-center justify-center w-8 h-8 cursor-pointer text-sm m-2 rounded-lg",
                "border border-[#0A68FF99] bg-white text-black hover:bg-default-blue hover:text-white shadow-md"
              )}
            >
              <MdOutlineSkipNext
                className="[&>polyline]:stroke-inherit rotate-180"
                size={16}
              />
            </li>
            <li
              onClick={() => {
                setSearchParam({
                  ...searchParam,
                  pageNumber: (data?.pageNumber || 2) - 1,
                });
                scrollToTop();
              }}
              className={cn(
                "page__btn flex items-center justify-center w-8 h-8 cursor-pointer text-sm m-2 rounded-lg",
                "border border-[#0A68FF99] bg-white text-black hover:bg-default-blue hover:text-white shadow-md"
              )}
            >
              <GrFormPrevious
                className="[&>polyline]:stroke-inherit"
                size={16}
              />
            </li>
          </>
        )}
        {newPageList()?.map((item) => (
          <li
            onClick={() => {
              setSearchParam({ ...searchParam, pageNumber: item });
              scrollToTop();
            }}
            key={item}
            className={cn(
              "flex items-center justify-center w-auto min-w-[32px] px-[6px] h-8 cursor-pointer text-xs m-2 rounded-lg",
              "hover:bg-default-blue hover:text-white border border-[#ddd] shadow-md",
              `${
                item === data?.pageNumber
                  ? "bg-default-blue! text-white!"
                  : "bg-white text-[#222222]"
              }
                  `
            )}
          >
            {item}
          </li>
        ))}
        {(!data?.pageNumber || data?.pageNumber < data?.pageCount) && (
          <>
            <li
              onClick={() => {
                setSearchParam({
                  ...searchParam,
                  pageNumber: (data?.pageNumber || 0) + 1,
                });
                scrollToTop();
              }}
              className={cn(
                "page__btn flex items-center justify-center w-8 h-8 cursor-pointer text-sm m-2 rounded-lg",
                "border border-[#0A68FF99] bg-white text-black hover:bg-default-blue hover:text-white shadow-md"
              )}
            >
              <GrFormNext className="[&>polyline]:stroke-inherit" size={16} />
            </li>

            <li
              onClick={() => {
                setSearchParam({ ...searchParam, pageNumber: data?.pageCount });
                scrollToTop();
              }}
              className={cn(
                "page__btn flex items-center justify-center w-8 h-8 cursor-pointer text-sm m-2 rounded-lg",
                "border border-[#0A68FF99] bg-white text-black hover:bg-default-blue hover:text-white shadow-md"
              )}
            >
              <MdOutlineSkipNext
                className="[&>polyline]:stroke-inherit"
                size={16}
              />
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default CommonPagination;
