import "../../styles/scss/components/communityAndEvent/sortButton.scss";
import { IoIosArrowDown } from "react-icons/io";
import { SortMenu } from "../../utils/sort/sortMenu";

interface IProps {
  onOpenMenu: () => void;
  sort: SortMenu;
  isOpenMenu: boolean;
}

const SortButton = ({ onOpenMenu, sort, isOpenMenu }: IProps) => {
  return (
    <button className={`sort-button ${isOpenMenu ? "is-open" : ""}`} onClick={onOpenMenu}>
      {sort.name} <IoIosArrowDown />
    </button>
  );
};

export default SortButton;
