import { getCategory } from "../../constants/category";
import { TCategoryId } from "../../types/category";

const createModelMap = () => {
  const map: Record<number, ReturnType<typeof getCategory>> = {};
  for (let i = 1; i <= 5; i++) {
    map[i] = getCategory(i as TCategoryId);
  }
  return map;
};

export const modelMap = createModelMap();

export const getCategoryModel = (categoryId: TCategoryId) => modelMap[categoryId as keyof typeof modelMap];