import { BASE } from "../../constants/base";
import SearchIcon from "../../public/icons/search";
import styles from "../../styles/components/SearchBar/searchbarM.module.scss";
import MainColorButton from "../buttons/mainColorButton";

function SearchBarMobile({ containerWidth = "590px", inputWidth = "539px" }) {
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
      <MainColorButton height="30px" text="Ara" />
    </div>
  );
}

export default SearchBarMobile;
