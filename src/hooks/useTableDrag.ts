import { useCallback, useRef } from "react";

// Hook để thêm drag scroll cho table
function useTableDrag(ref: React.MutableRefObject<HTMLElement | null>) {
  const mousePos = useRef({ startX: 0, scrollLeft: 0 });
  const isMouseDown = useRef<boolean>(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLTableElement>) => {
      if (!ref.current || e.button === 1) {
        return;
      }

      const slider = ref.current.children[0] as HTMLDivElement;
      const startX = e.pageX - slider.offsetLeft;
      const scrollLeft = slider.scrollLeft;

      if (slider.offsetWidth === slider.scrollWidth) {
        return;
      }

      mousePos.current = { startX, scrollLeft };
      isMouseDown.current = true;
      document.body.style.cursor = "grabbing";
    },
    [ref]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLTableElement>) => {
      isMouseDown.current = false;
      if (!ref.current || e.button === 1) {
        return;
      }
      document.body.style.cursor = "default";
    },
    [ref]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLTableElement>) => {
      if (!isMouseDown.current || !ref.current || e.button === 1) {
        return;
      }

      e.preventDefault();
      const slider = ref.current.children[0] as HTMLDivElement;
      const x = e.pageX - slider.offsetLeft;
      const walkX = (x - mousePos.current.startX) * 1.5;
      slider.scrollLeft = mousePos.current.scrollLeft - walkX;
    },
    [isMouseDown, ref]
  );

  return [handleMouseDown, handleMouseUp, handleMouseMove];
}

export default useTableDrag;
