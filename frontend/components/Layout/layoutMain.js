import { BASE } from "../../constants/base";
import styles from "../../styles/components/Layout/LayoutMain.module.scss";
import Navbar from "../navbar/navbar";
import FooterComp from "../footer/footer";
import Logo from "../logo";
import { useEffect, useState } from "react";
import { getData } from "../../api/fetch";
import { API, PAGE } from "../../constants";
import Spacer from "../Spacer/spacer";
import router from "next/router";

function LayoutMain({
  children,
  fadeBG = false,
  centerContent = false,
  whenAuthDisabledPage = false,
}) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    getData(API.checkAuth)
      .then(() => {
        if (whenAuthDisabledPage) {
          router.push(PAGE.home.href);
        } else {
          setLoading(false);
          setAuth(true);
        }
      })
      .catch(() => {
        setLoading(false);
        setAuth(false);
      });
  }, []);
  return (
    <div
      className={styles.container}
      style={{ backgroundColor: fadeBG ? "#fbfbfa" : "#ffffff" }}
    >
      {loading ? (
        <div className={styles.logo}>
          <Logo fontSize="90px" />
          <Spacer top="20px" />
          <div className={styles.loader}></div>
        </div>
      ) : (
        <>
          <Navbar auth={auth} />
          <div
            className={styles.main}
            style={{
              width: BASE.widthPage,
              display: centerContent ? "flex" : "initial",
            }}
          >
            {children}
          </div>
          <FooterComp />
        </>
      )}
    </div>
  );
}

export default LayoutMain;
