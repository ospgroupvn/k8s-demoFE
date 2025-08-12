"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BsCheck } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
  title?: string;
  body?: React.ReactElement | string;
  footer?: React.ReactElement;
  actionLabel?: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  isShowIcon?: boolean;
  isShowSecondaryButton?: boolean;
  isShowActionButton?: boolean;
  isLoading?: boolean;
  actionClassName?: string;
  secondaryClassName?: string;
  uppercaseTitle?: boolean;
  overlayClassName?: string;
}
const ConfirmModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
  isShowIcon,
  isShowSecondaryButton = true,
  isShowActionButton = true,
  isLoading = false,
  actionClassName = "",
  secondaryClassName = "",
  uppercaseTitle = true,
  overlayClassName = "",
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) return;
    setShowModal(false);
    const func = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300);
    return () => clearTimeout(func);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) return;
    if (onSubmit) {
      onSubmit();
    }
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) return;
    secondaryAction();
  }, [disabled, secondaryAction]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className={cn(
          "justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-hidden focus:outline-hidden bg-neutral-800/70 pointer-events-auto",
          overlayClassName
        )}
      >
        <div className="relative w-[424px] my-6 mx-auto lg:h-auto md:h-auto max-sm:max-w-[95%]">
          {/* Content */}
          <div
            className={cn(
              "translate duration-300 h-full",
              showModal
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            )}
          >
            <div className="translate h-full w-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-hidden focus:outline-hidden">
              {/* Header */}
              <div className="flex items-center p-6 pb-3 rounded-t justify-center relative">
                <div
                  className={cn(
                    "text-lg font-semibold",
                    uppercaseTitle ? "uppercase" : ""
                  )}
                >
                  {title || "Xác Nhận"}
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1 border-0 hover:opacity-70 transition absolute right-6 z-1000"
                >
                  <IoMdClose size={18} />
                </button>
              </div>
              {/* body */}
              <div className="relative text-sm text-[#6B7280] p-6 flex-auto text-center">
                {body}
              </div>
              {/* footer */}
              <div className="flex flex-col p-6">
                <div className="flex flex-row gap-2 items-center justify-center w-full">
                  {isShowSecondaryButton && (
                    <Button
                      type="button"
                      disabled={disabled || isLoading}
                      onClick={handleSecondaryAction}
                      className={cn(
                        "min-w-[85px] h-9 border border-[#222222] relative",
                        secondaryClassName
                      )}
                      variant="outline"
                    >
                      {isShowIcon && (
                        <IoMdClose
                          color="white"
                          size={18}
                          className="mr-2 front-bold "
                        />
                      )}
                      {secondaryActionLabel || "Quay lại"}
                    </Button>
                  )}
                  {isShowActionButton && (
                    <Button
                      type="button"
                      disabled={disabled || isLoading}
                      onClick={handleSubmit}
                      className={cn(
                        "bg-[#52525B] hover:bg-[#52525bda] min-w-[85px] h-9 relative",
                        actionClassName
                      )}
                    >
                      {isShowIcon && !isLoading ? (
                        <BsCheck
                          color="white"
                          size={18}
                          className="mr-2 front-bold"
                        />
                      ) : (
                        <></>
                      )}
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {actionLabel || "Chấp nhận"}
                    </Button>
                  )}
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
