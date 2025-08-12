"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { NotaryOperationItem } from "@/types/congChung";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { deleteNotaryOperation } from "@/service/notaryOrg";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: NotaryOperationItem;
  refetch: () => void;
}

const NotaryOperationDeleteModal = ({
  open,
  setOpen,
  item,
  refetch,
}: Props) => {
  const deleteMutation = useMutation({
    mutationFn: deleteNotaryOperation,
  });

  const onDeleteClick = () => {
    if (!item?.id) {
      return;
    }

    deleteMutation.mutate(item?.id, {
      onSuccess: (data) => {
        if (data?.status === 200) {
          toast.success("Xóa dữ liệu hoạt động công chứng thành công");
        } else {
          toast.error("Xóa dữ liệu hoạt động công chứng không thành công!");
        }
      },
      onError: () => {
        toast.error("Xóa dữ liệu hoạt động công chứng không thành công!");
      },
      onSettled: () => {
        refetch();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogContent className="max-h-[500px] z-50 flex flex-col pb-4">
        <DialogHeader className="border-b border-b-[#EBEBF0] -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
          <DialogTitle className="font-bold">
            XÓA HOẠT ĐỘNG CÔNG CHỨNG
          </DialogTitle>
          <DialogDescription>
            <VisuallyHidden>Xóa hoạt động công chứng</VisuallyHidden>
          </DialogDescription>
        </DialogHeader>

        <p className="text-center">
          Xác nhận xóa dữ liệu hoạt động công chứng tháng{" "}
          <strong>{item.reportMonth}</strong> năm{" "}
          <strong>{item.reportYear}</strong>?
        </p>

        <DialogFooter className="flex items-center">
          <Button
            type="button"
            className="border border-[red] bg-red-500 text-white hover:bg-white hover:text-red-500"
            onClick={() => onDeleteClick()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation?.isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <></>
            )}
            Xóa
          </Button>
          <Button
            type="button"
            className="border border-[#C3ECF5] bg-white text-default-blue hover:bg-[#C3ECF5]"
            onClick={() => setOpen(false)}
            disabled={deleteMutation.isPending}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotaryOperationDeleteModal;
