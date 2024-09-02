import { useEffect, useRef } from "react";

type Callback = (entries: IntersectionObserverEntry[]) => void;

interface ObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export const useIntersectionObserver = (callback: Callback, options?: ObserverOptions) => {
  const targetRef = useRef(null);

  useEffect(() => {
    const currentElement = targetRef.current;

    const observer = new IntersectionObserver(callback, options);

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [callback, options]);

  return targetRef;
};
