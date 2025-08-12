import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { AuthItem } from "@/types/admin";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { GrFormSubtract } from "react-icons/gr";

interface SelectAuthItem extends AuthItem {
  isOpen: boolean;
}

interface DivAuthorityProps {
  setSelectedItems: Dispatch<SetStateAction<SelectAuthItem[]>>;
  setAuthParentList: Dispatch<SetStateAction<SelectAuthItem[]>>;
  selectedItems: SelectAuthItem[];
  authListAll: SelectAuthItem[];
  authParentList: SelectAuthItem[];
  title: string;
  isLoading: boolean;
}

const DivAuthority: React.FC<DivAuthorityProps> = ({
  selectedItems,
  setSelectedItems,
  authListAll,
  authParentList,
  title,
  setAuthParentList,
  isLoading = false,
}) => {
  const [isExpandAll, setIsExpandAll] = useState<boolean>(true);
  const [isCheckAll, setIsCheckAll] = useState<CheckedState>(false);

  useEffect(() => {
    let checkAll: CheckedState = false;

    if (selectedItems?.length && authListAll?.length) {
      if (selectedItems?.length === authListAll?.length) {
        checkAll = true;
      } else if (
        selectedItems?.length < authListAll?.length &&
        selectedItems?.length > 0
      ) {
        checkAll = "indeterminate";
      }
    }

    setIsCheckAll(checkAll);
  }, [authListAll, selectedItems]);

  const onCheckedChange = (value: CheckedState, group: SelectAuthItem) => {
    if (group?.fid == 0) {
      // checked parent
      const listChildrenItem = [
        ...authListAll?.filter(
          (item) => item?.fid == group?.id || item?.id == group?.id
        ),
      ];
      if (value) {
        setSelectedItems([
          ...selectedItems.filter(
            (item) => !listChildrenItem?.find((i) => i.id == item.id)
          ),
          ...listChildrenItem,
        ]);
      } else {
        setSelectedItems([
          ...selectedItems.filter(
            (item) => !listChildrenItem?.find((i) => i.id == item.id)
          ),
        ]);
      }
    } else {
      // checked children
      const listAllChildren = authListAll?.filter(
        (item) => item?.fid == group?.fid
      );
      if (value) {
        const listCheckedItems = [
          ...selectedItems?.filter((item) => item?.fid == group?.fid),
          group,
        ];
        if (
          listCheckedItems?.length == listAllChildren?.length &&
          !selectedItems?.find((item) => item?.id == group?.fid)
        ) {
          const parentItem = authListAll?.find(
            (item) => item?.id == group?.fid
          );

          const newSelectedItem = [group];
          if (parentItem) {
            newSelectedItem.push(group);
          }

          setSelectedItems([...selectedItems, ...newSelectedItem]);
        } else {
          setSelectedItems([...selectedItems, group]);
        }
      } else {
        if (selectedItems?.find((item) => item?.id == group?.fid)) {
          setSelectedItems(
            selectedItems.filter(
              (item) => item?.id != group?.id && item?.id != group?.fid
            )
          );
        } else {
          setSelectedItems(
            selectedItems.filter((item) => item?.id != group?.id)
          );
        }
      }
    }
  };

  // check all
  const onCheckedAllChange = (value: CheckedState) => {
    if (value) {
      setSelectedItems(authListAll);
    } else {
      setSelectedItems([]);
    }
    setIsCheckAll(value);
  };

  //expand all
  const onExpandAllClick = () => {
    setIsExpandAll(!isExpandAll);
    setAuthParentList(
      authParentList?.map((itemMap) => ({
        ...itemMap,
        isOpen: !isExpandAll,
      }))
    );
  };

  //  kiểm tra xem có đang mở tất cả không
  useMemo(() => {
    const isExpandAll = authParentList
      .filter(
        (itemFilter) =>
          authListAll?.filter((i) => i?.fid === itemFilter?.id)?.length > 0
      )
      .every((item) => item.isOpen === true);
    setIsExpandAll(isExpandAll);
  }, [authParentList, authListAll]);

  return (
    <div className="w-full h-fit p-4 mt-2 rounded border border-[rgba(0, 0, 0, 0.10)] bg-[#FAFAFA] grid">
      <span className="font-semibold text-base text-[#2563EB]">{title}</span>
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          {authParentList?.length > 0 && (
            <div className="flex items-center justify-between py-2 px-3 my-4 bg-[#ECECEC] mb-4 rounded">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={"checkALlGroup" + title}
                  checked={isCheckAll}
                  onCheckedChange={onCheckedAllChange}
                  className="bg-white"
                />
                <Label
                  htmlFor={"checkALlGroup" + title}
                  className="text-sm font-medium cursor-pointer"
                >
                  Tất cả quyền
                </Label>
              </div>
              <Button
                type="button"
                className="w-fit h-9 px-4 py-2 hover:bg-[#fff] bg-[#fff] border border-[#A9A9AD]  cursor-pointer rounded  font-medium text-[#52525B]"
                onClick={onExpandAllClick}
              >
                {isExpandAll ? (
                  <>
                    <GrFormSubtract className="mr-1" />
                    <span className="text-sm font-medium"> Mỏ tất cả</span>
                  </>
                ) : (
                  <>
                    <AiOutlinePlus className="mr-1" />
                    <span className="text-sm font-medium"> Đóng tất cả</span>
                  </>
                )}
              </Button>
            </div>
          )}
          {authParentList?.map((item) => (
            <Collapsible
              key={item?.id}
              open={item.isOpen}
              onClick={(e) => e.stopPropagation()}
              onOpenChange={(open) => {
                setAuthParentList((prev) =>
                  prev?.map((itemMap) => {
                    if (itemMap?.id === item?.id) {
                      return { ...item, isOpen: open };
                    }
                    return itemMap;
                  })
                );
              }}
              className="cursor-pointer transition-all duration-250 group/collapse w-full text-sm mb-2 px-2 bg-[#fff] rounded-lg border border-[rgba(0, 0, 0, 0.10)]"
            >
              <div className="flex items-center  rounded-sm cursor-default">
                <div className=" p-3.5 flex items-center">
                  <Checkbox
                    id={item?.id.toString()}
                    checked={
                      selectedItems?.find(
                        (itemGroup) =>
                          itemGroup?.id?.toString() === item?.id?.toString()
                      )
                        ? true
                        : selectedItems?.find(
                            (i) => i.fid.toString() === item?.id.toString()
                          )
                        ? "indeterminate"
                        : false
                    }
                    onCheckedChange={(value) => onCheckedChange(value, item)}
                  />
                  <Label
                    htmlFor={item.id.toString()}
                    className="text-sm ml-2 cursor-pointer"
                  >
                    {item?.description || item?.authority}
                  </Label>
                </div>
                <CollapsibleTrigger asChild>
                  {authListAll?.filter(
                    (itemFilter) => itemFilter?.fid === item?.id
                  )?.length > 0 ? (
                    <div className="cursor-pointer grow  p-3.5 flex justify-end h-full">
                      <span className="group-data-[state=open]/collapse:hidden group-data-[state=closed]/collapse:block">
                        <FaAngleDown />
                      </span>
                      <span className="group-data-[state=open]/collapse:block group-data-[state=closed]/collapse:hidden">
                        <FaAngleUp />
                      </span>
                    </div>
                  ) : (
                    <></>
                  )}
                </CollapsibleTrigger>
              </div>

              {authListAll?.filter((itemFilter) => itemFilter?.fid === item?.id)
                ?.length > 0 ? (
                <CollapsibleContent className="pb-2 rounded-lg">
                  {authListAll
                    ?.filter((itemFilter) => itemFilter?.fid === item?.id)
                    ?.map((subItem) => (
                      <div
                        key={subItem?.id}
                        className="flex items-center ml-6 rounded-sm p-1 mb-1"
                      >
                        <Checkbox
                          id={subItem?.id?.toString()}
                          checked={
                            selectedItems?.find(
                              (itemGroup) => itemGroup?.id === subItem?.id
                            )
                              ? true
                              : false
                          }
                          onCheckedChange={(value) =>
                            onCheckedChange(value, subItem)
                          }
                        />
                        <Label
                          htmlFor={subItem?.id?.toString()}
                          className="text-sm ml-3 cursor-pointer"
                        >
                          {subItem?.description || subItem?.authority}
                        </Label>
                      </div>
                    ))}
                </CollapsibleContent>
              ) : (
                <></>
              )}
            </Collapsible>
          ))}
        </>
      )}
    </div>
  );
};

export default DivAuthority;
