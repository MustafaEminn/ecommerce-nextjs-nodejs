import { BASE } from "../../constants/base";
import SearchIcon from "../../public/icons/search";
import styles from "../../styles/components/SearchBar/searchbar.module.scss";

function SearchBar({ containerWidth = "590px", inputWidth = "539px" }) {
  return (
    <div
      style={{ width: containerWidth }}
      className={styles.searchBarContainer}
    >
      <input
        style={{ width: inputWidth }}
        placeholder={BASE.navbarSearchbarPlaceholder}
        className={styles.searchBar}
      />
      <SearchIcon className={styles.searchBarIcon} width="18px" height="18px" />
    </div>
  );
}

export default SearchBar;
