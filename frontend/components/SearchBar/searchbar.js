import { useState } from "react";
import Swal from "sweetalert2";
import { BASE } from "../../constants/base";
import SearchIcon from "../../public/icons/search";
import styles from "../../styles/components/SearchBar/searchbar.module.scss";
import { useRouter } from "next/router";
import slugify from "slugify";
import { getData } from "../../api/fetch";

function SearchBar({ containerWidth = "590px", inputWidth = "539px" }) {
  const [value, setValue] = useState("");
  const router = useRouter();
  const onSearch = () => {
    if (value.length === 10) {
      getData("/api/product/getProductById/" + value)
        .then((res) => {
          return router.push(
            "/product/" + slugify(res.data.product[0].title + "-" + value)
          );
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Hata!",
            text: "Ürün bulunamadı.",
            timer: 1250,
            timerProgressBar: true,
          });
        });
    } else {
      return Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Davetiye kodu 10 haneli olmalıdır.",
      });
    }
  };
  return (
    <div
      style={{ width: containerWidth }}
      className={styles.searchBarContainer}
    >
      <input
        style={{ width: inputWidth }}
        placeholder={BASE.navbarSearchbarPlaceholder}
        className={styles.searchBar}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onKeyUp={(e) => {
          e.key === "Enter" ? onSearch() : void 0;
        }}
      />
      <SearchIcon
        onClick={onSearch}
        className={styles.searchBarIcon}
        width="18px"
        height="18px"
      />
    </div>
  );
}

export default SearchBar;
