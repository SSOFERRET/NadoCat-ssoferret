import { TCategoryId } from "../types/category";

export const CATEGORY = Object.freeze({
  COMMUNITIES: 1,
  EVENTS: 2,
  MISSINGS: 3,
  MISSING_REPORTS: 4,
  STREET_CATS: 5,
});

export const getCategory = (categoryId: TCategoryId) => {
  switch (categoryId) {
    case CATEGORY.COMMUNITIES: return "communities";
    case CATEGORY.EVENTS: return "events";
    case CATEGORY.MISSINGS: return "missings";
    case CATEGORY.MISSING_REPORTS: return "missingsReports";
    case CATEGORY.STREET_CATS: return "streetCats"
  }
};

const getCategoryUrlString = (category: ReturnType<typeof getCategory>) => category === getCategory(CATEGORY.STREET_CATS) ? "street-cats" : category;

export const getCategoryUrlStringById = (categoryId: TCategoryId) => getCategoryUrlString(getCategory(categoryId));