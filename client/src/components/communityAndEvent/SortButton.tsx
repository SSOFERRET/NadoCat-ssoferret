import "../../styles/scss/components/communityAndEvent/sortButton.scss";
import { IoIosArrowDown } from "react-icons/io";
import { SortMenu } from "../../utils/sort/sortMenu";

interface IProps {
  sort: SortMenu;
  handleMene: () => void;
}

const SortButton = ({ sort, handleMene }: IProps) => {
  return (
    <button className={`sort-button`} onClick={handleMene}>
      {sort.name} <IoIosArrowDown />
    </button>
  );
};

export default SortButton;
