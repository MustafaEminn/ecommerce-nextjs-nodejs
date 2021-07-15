import { useRouter } from "next/router";
import { useState } from "react";
import slugify from "slugify";
import Swal from "sweetalert2";
import { getData } from "../../api/fetch";
import { BASE } from "../../constants/base";
import styles from "../../styles/components/SearchBar/searchbarM.module.scss";
import MainColorButton from "../buttons/mainColorButton";

function SearchBarMobile({ containerWidth = "590px", inputWidth = "539px" }) {
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
        onChange={(e) => setValue(e.target.value)}
      />
      <MainColorButton onClick={onSearch} height="30px" text="Ara" />
    </div>
  );
}

export default SearchBarMobile;
