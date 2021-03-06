import { BASE } from "../../constants/base";
import styles from "../../styles/components/Layout/LayoutSidebar.module.scss";
import Navbar from "../navbar/navbar";
import FooterComp from "../footer/footer";
import Logo from "../logo";
import { useEffect, useState } from "react";
import { getData } from "../../api/fetch";
import { API, PAGE } from "../../constants";
import Spacer from "../Spacer/spacer";
import router from "next/router";
import Sidebar from "../sidebar/sidebar";

function LayoutSidebar({
  children,
  fadeBG = false,
  centerContent = false,
  whenAuthDisabledPage = false,
  pageLoading = false,
}) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    getData(API.checkAuth)
      .then(() => {
        if (whenAuthDisabledPage) {
          return router.push(PAGE.home.href);
        }
        setAuth(true);
        if (!pageLoading) {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
        setAuth(false);
      });
  }, []);

  useEffect(() => {
    setLoading(pageLoading);
  }, [pageLoading]);
  return (
    <div
      className={styles.container}
      style={{ backgroundColor: fadeBG ? "#fbfbfa" : "#ffffff" }}
    >
      {loading ? (
        <div className={styles.logo}>
          <Logo fontSize="90px" />
          <div className={styles.loader}></div>
        </div>
      ) : (
        <>
          <Navbar auth={auth} />
          <div
            className={styles.main}
            style={{
              width: BASE.widthPage,
            }}
          >
            <div className={styles.sidebar}>
              <Sidebar />
            </div>
            <div className={styles.padding}></div>
            <div className={styles.children}>{children}</div>
          </div>
          <FooterComp />
        </>
      )}
    </div>
  );
}

export default LayoutSidebar;
