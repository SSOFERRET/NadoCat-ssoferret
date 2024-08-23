import "../../styles/scss/components/communityAndEvent/postSortMenu.scss";
import { useOutsideClick } from "../../hooks/useOutSideClick";
import { sortMenu, SortMenu } from "../../utils/sort/sortMenu";

interface IProps {
  sort: SortMenu;
  isOpenMenu: boolean;
  handleSortMenu: (item: SortMenu) => void;
  onCloseMenu: () => void;
}

const PostSortMenu = ({ sort, isOpenMenu, handleSortMenu, onCloseMenu }: IProps) => {
  const menuRef = useOutsideClick(onCloseMenu);

  return (
    <div className={`sort-menu ${isOpenMenu ? "fade-in" : "fade-out"}`} ref={menuRef}>
      <ul className="sorting-options">
        {sortMenu.map((item) => (
          <li
            className={`sort-option ${sort.name === item.name ? "seleted" : ""}`}
            key={item.id}
            onClick={() => handleSortMenu(item)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostSortMenu;
