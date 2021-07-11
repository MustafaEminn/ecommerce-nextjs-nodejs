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
import { useRecoilState, useRecoilValue } from "recoil";
import {
  cartChangeTrigger,
  categoryChangeTrigger,
  isAuthed,
} from "../../states/index.atom";
import { getData } from "../../api/fetch";
import Swal from "sweetalert2";

function Navbar({ auth }) {
  const [cartLength, setCartLength] = useState(0);
  const [categories, setCategories] = useState([]);
  const isAuth = useRecoilValue(isAuthed);
  const cartChange = useRecoilValue(cartChangeTrigger);
  const [categoryChange, setCategoryChange] = useRecoilState(
    categoryChangeTrigger
  );
  const router = useRouter();
  const NavbarFooterItem = ({ title, href }) => {
    return (
      <li className={styles.footerItem}>
        <Link href={href}>
          <a>{title}</a>
        </Link>
      </li>
    );
  };
  const NavbarFooterWithDropdownItem = ({ title, children }) => {
    return (
      <li className={styles.footerWithDropdownItem}>
        <Link href={""}>
          <a>{title}</a>
        </Link>
        <div className={styles.footerDropdown}>{children}</div>
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

  const getCategories = async () => {
    return await getData("/api/category/getCategories")
      .then((res) => {
        return setCategories(res.data.categories);
      })
      .catch(() => {
        return Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "LÜtfen sayfayı yenileyiniz!",
        });
      });
  };

  useEffect(() => {
    getCartLength();
  }, [isAuth, cartChange]);

  useEffect(() => {
    getCategories();
  }, []);

  const onRouteCategory = () => {
    setCategoryChange(!categoryChange);
  };

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
                          href={PAGE.myOrders.href}
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
          <NavbarFooterItem title={PAGE.home.name} href={PAGE.home.href} />
          <NavbarFooterItem
            title={PAGE.aboutUs.name}
            href={PAGE.aboutUs.href}
          />
          {Object.keys(categories).map((item, index) => {
            return (
              <NavbarFooterWithDropdownItem key={index} title={item}>
                {Object.keys(categories[item]).map((item2, index2) => {
                  return (
                    <div key={index2}>
                      <Link
                        href={{
                          pathname:
                            PAGE.category.href + categories[item][item2].slug,
                          query: {
                            page: 1,
                          },
                        }}
                      >
                        <a onClick={onRouteCategory}>{item2}</a>
                      </Link>
                    </div>
                  );
                })}
              </NavbarFooterWithDropdownItem>
            );
          })}
        </ul>
      </div>
      {/* Navbar Footer End */}

      <div className={styles.bottomBorder}></div>
    </div>
  );
}

export default Navbar;
