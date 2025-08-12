"use client";

import { useEffect, useState } from "react";

// hook
function useWindowSize() {
  // initialize state with undefined width/height so server and client renders match
  // learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowsize, setwindowsize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== "undefined") {
      // handler to call on window resize
      const handleResize = () => {
        // set window width/height to state
        setwindowsize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      // add event listener
      window.addEventListener("resize", handleResize);

      // call handler right away so state gets updated with initial window size
      handleResize();

      // remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // empty array ensures that effect is only run on mount
  return windowsize;
}

export default useWindowSize;
