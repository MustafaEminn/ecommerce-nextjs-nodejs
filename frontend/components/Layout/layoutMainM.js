import { BASE } from "../../constants/base";
import styles from "../../styles/components/Layout/LayoutMainM.module.scss";
import Navbar from "../navbar/navbar";
import FooterComp from "../footer/footer";
import Logo from "../logo";
import { useEffect, useState } from "react";
import { getData } from "../../api/fetch";
import { API, PAGE } from "../../constants";
import Spacer from "../Spacer/spacer";
import router from "next/router";
import { useRecoilState } from "recoil";
import { isAuthed } from "../../states/index.atom";
import NavbarMobile from "../navbar/navbarM";
import FooterCompMobile from "../footer/footerM";

function LayoutMainMobile({
  children,
  fadeBG = false,
  centerContent = false,
  whenAuthDisabledPage = false,
  pageLoading = false,
  liveLoading = false,
}) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [, setIsAuthed] = useRecoilState(isAuthed);

  const checkAuth = () => {
    getData(API.checkAuth)
      .then(() => {
        setAuth(true);
        setIsAuthed(true);
        if (whenAuthDisabledPage) {
          return router.push(PAGE.home.href);
        }

        if (!pageLoading) {
          setLoading(false);
        }
      })
      .catch(() => {
        setIsAuthed(false);
        setLoading(false);
        setAuth(false);
      });
  };

  useEffect(() => {
    (async () => {
      await checkAuth();
    })();
  }, []);

  useEffect(() => {
    setLoading(pageLoading);
  }, [pageLoading]);
  return (
    <>
      <div
        loading={liveLoading ? "true" : "false"}
        className={styles.liveLoading}
      >
        <div className="loader"></div>
      </div>
      <div
        className={styles.container}
        style={{ backgroundColor: fadeBG ? "#fbfbfa" : "#ffffff" }}
      >
        {loading ? (
          <div className={styles.logo}>
            <Logo fontSize="16px" />
            <div className={styles.loader}></div>
          </div>
        ) : (
          <>
            <NavbarMobile auth={auth} />
            <div
              className={styles.main}
              style={{
                width: "100%",
                display: centerContent ? "flex" : "initial",
              }}
            >
              {children}
            </div>
            <FooterCompMobile />
          </>
        )}
      </div>
    </>
  );
}

export default LayoutMainMobile;
