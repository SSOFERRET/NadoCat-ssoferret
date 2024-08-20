import { useCallback, useRef } from "react";

export const useThrottle = <T extends (...args: any[]) => void>() => {
  const isWaiting = useRef(false);

  return useCallback((callback: T, delay: number) => {
    return (...args: Parameters<T>) => {
      if (!isWaiting.current) {
        callback(...args);

        isWaiting.current = true;
        setTimeout(() => {
          isWaiting.current = false;
        }, delay);
      }
    };
  }, []);
};
