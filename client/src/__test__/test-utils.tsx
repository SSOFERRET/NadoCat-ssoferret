import { vi } from "vitest";

const intersectionObserverMock = () => ({
  observe: (target: HTMLImageElement) => {
    const dataSrc = target.dataset.src;
    if (dataSrc) {
      target.src = dataSrc;
    }
  },
  disconnect: () => null,
  unobserve: () => null,
});

window.IntersectionObserver = vi.fn().mockImplementation(intersectionObserverMock);
