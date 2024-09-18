import { create } from "zustand";

interface ICounts {
  communities: number;
  events: number;
  missings: number;
  streetCats: number;
}

interface ICountState {
  counts: ICounts;
  setCounts: (newCounts: ICounts) => void;
}

const useSearchCountStore = create<ICountState>((set) => ({
  counts: {
    communities: 0,
    events: 0,
    missings: 0,
    streetCats: 0
  },
  setCounts: (newCounts: ICounts) => {
    set(() => ({
      counts: newCounts
    }));
  }
}));

export default useSearchCountStore;
