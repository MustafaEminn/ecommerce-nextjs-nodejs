import { API, BASE, PAGE } from "../../constants/index";
import ShoppingCartIcon from "../../public/icons/shoppingCart";
import UserIcon from "../../public/icons/user";
import styles from "../../styles/components/navbar/navbar.module.scss";
import Logo from "../logo";
import SearchBar from "../SearchBar/searchbar";
import Link from "next/link";
import { useRouter } from "next/router";
import { ListPopupContainer, ListPopup } from "../popups/listPopup";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { cartChangeTrigger, isAuthed } from "../../states/index.atom";
import { getData } from "../../api/fetch";

function Navbar({ auth }) {
  const [cartLength, setCartLength] = useState(0);
  const isAuth = useRecoilValue(isAuthed);
  const cartChange = useRecoilValue(cartChangeTrigger);
  const router = useRouter();
  const NavbarFooterItem = ({ title, activeLinkText, href }) => {
    return router.pathname.split("/")[1] === activeLinkText ? (
      <li className={styles.activeFooterItem}>
        <Link href={href}>
          <a>{title}</a>
        </Link>
      </li>
    ) : (
      <li className={styles.deactiveFooterItem}>
        <Link href={href}>
          <a>{title}</a>
        </Link>
      </li>
    );
  };

  const NavbarPopupItem = ({ title, href = "/", onClick = () => {} }) => {
    return (
      <li onClick={onClick} className={styles.navbarPopupItem}>
        <Link href={href}>
          <a>{title}</a>
        </Link>
      </li>
    );
  };

  const getCartLength = async () => {
    if (isAuth) {
      return await getData("/api/cart/getCartLength")
        .then((res) => {
          return setCartLength(res.data.length);
        })
        .catch(() => {
          return setCartLength(0);
        });
    } else {
      const cart = localStorage.getItem("cart");
      const decodedCart = JSON.parse(cart);
      setCartLength(decodedCart?.length || 0);
    }
  };

  useEffect(() => {
    getCartLength();
  }, [isAuth, cartChange]);

  return (
    <div className={styles.container}>
      {/* Navbar Head Begin */}
      <div className={styles.navbarHead} style={{ width: BASE.widthNavbar }}>
        <Link href={PAGE.home.href}>
          <a>
            <Logo fontSize="46px" />
          </a>
        </Link>

        <SearchBar />

        <div className={styles.navbarHeadUserSectionContainer}>
          <ul className={styles.navbarHeadUserSectionUl}>
            <li className={styles.navbarHeadUserSectionLiMyAccount}>
              <ListPopupContainer>
                {auth ? (
                  <div>
                    <Link href={PAGE.myAccount.href}>
                      <a>
                        <UserIcon width="16px" height="16px" />
                        <span>Hesabım</span>
                      </a>
                    </Link>
                    <ListPopup>
                      <ul>
                        <NavbarPopupItem
                          href={PAGE.myAccount.href}
                          title="Hesabım"
                        />
                        <NavbarPopupItem
                          href={PAGE.myAccount.href}
                          title="Siparişlerim"
                        />
                        <NavbarPopupItem
                          onClick={() => {
                            localStorage.removeItem("token");
                          }}
                          href={PAGE.login.href}
                          title="Çıkış Yap"
                        />
                      </ul>
                    </ListPopup>
                  </div>
                ) : (
                  <div>
                    <Link href={PAGE.login.href}>
                      <a>
                        <UserIcon width="16px" height="16px" />
                        <span>Giriş Yap</span>
                      </a>
                    </Link>
                    <ListPopup>
                      <ul>
                        <NavbarPopupItem
                          href={PAGE.register.href}
                          title="Kayıt Ol"
                        />
                        <NavbarPopupItem
                          href={PAGE.login.href}
                          title="Giriş Yap"
                        />
                      </ul>
                    </ListPopup>
                  </div>
                )}
              </ListPopupContainer>
            </li>

            <li
              style={{
                paddingRight: `${15 + cartLength.toString().length * 3.5}px`,
              }}
              className={styles.navbarHeadUserSectionLiMyCart}
            >
              <Link href={PAGE.cart.href}>
                <a>
                  <ShoppingCartIcon width="16px" height="16px" />
                  <span>Sepetim</span>
                  <span className={styles.cartBubble}>{cartLength}</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Navbar Head End */}

      {/* Navbar Footer Begin */}
      <div className={styles.navbarFooter} style={{ width: BASE.widthNavbar }}>
        <ul className={styles.navbarFooterUl}>
          <NavbarFooterItem
            title={PAGE.home.name}
            activeLinkText={PAGE.home.urlPathname}
            href={PAGE.home.href}
          />
          <NavbarFooterItem
            title={PAGE.aboutUs.name}
            activeLinkText={PAGE.aboutUs.urlPathname}
            href={PAGE.aboutUs.href}
          />
        </ul>
      </div>
      {/* Navbar Footer End */}

      <div className={styles.bottomBorder}></div>
    </div>
  );
}

export default Navbar;
