import { API, BASE, PAGE } from "../../constants/index";
import ShoppingCartIcon from "../../public/icons/shoppingCart";
import UserIcon from "../../public/icons/user";
import styles from "../../styles/components/navbar/navbarM.module.scss";
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
import MenuIcon from "../../public/icons/menu";
import SearchBarMobile from "../SearchBar/searchbarM";
import CloseIcon from "../../public/icons/close";
import BottomArrowIcon from "../../public/icons/bottomArrow";
import {
  ListPopupMobile,
  ListPopupMobileContainer,
} from "../popups/listPopupM";

function NavbarMobile({ auth }) {
  const [cartLength, setCartLength] = useState(0);
  const [categories, setCategories] = useState([]);
  const isAuth = useRecoilValue(isAuthed);
  const cartChange = useRecoilValue(cartChangeTrigger);
  const [categoryChange, setCategoryChange] = useRecoilState(
    categoryChangeTrigger
  );
  const [sideBarStatus, setSideBarStatus] = useState(false);
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

  const onToggleSidebar = () => {
    setSideBarStatus(!sideBarStatus);
  };

  const onRouteCategory = () => {
    onToggleSidebar();
    setCategoryChange(!categoryChange);
  };

  const onToggleDropdown = (index) => {
    var dropDownElement = document.getElementById("sub-dropdown-" + index).style
      .display;
    if (dropDownElement === "none" || dropDownElement === "") {
      return (document.getElementById("sub-dropdown-" + index).style.display =
        "flex");
    }

    return (document.getElementById("sub-dropdown-" + index).style.display =
      "none");
  };

  return (
    <>
      <div
        status={sideBarStatus ? "open" : "close"}
        className={styles.mobileSidebarContainer}
        onClick={onToggleSidebar}
      ></div>
      <div
        className={styles.mobileSidebar}
        status={sideBarStatus ? "open" : "close"}
      >
        <ul className={styles.sidebarUl}>
          <li className={styles.sidebarLiHeader}>
            <Link href={PAGE.home.href}>
              <a>
                <Logo fontSize="35px" />
              </a>
            </Link>
            <button onClick={onToggleSidebar}>
              <CloseIcon width="18px" height="18px" />
            </button>
          </li>
          <li className={styles.sidebarLi}>
            <Link href={PAGE.home.href}>
              <a>Ana Sayfa</a>
            </Link>
          </li>
          <li className={styles.sidebarLi}>
            <Link href={PAGE.aboutUs.href}>
              <a>Hakkımızda</a>
            </Link>
          </li>
          {Object.keys(categories).map((item, index) => {
            return (
              <li className={styles.sidebarLiDropdown}>
                <div
                  onClick={() => onToggleDropdown(index)}
                  className={styles.sidebarLiDropdownContainer}
                >
                  <h2>{item}</h2>
                  <BottomArrowIcon width="15px" height="15px" />
                </div>
                <ul
                  id={"sub-dropdown-" + index}
                  className={styles.sidebarLiDropdownSubUl}
                >
                  {Object.keys(categories[item]).map((item2, index2) => {
                    return (
                      <li className={styles.sidebarLiDropdownSubLi}>
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
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.container}>
        {/* Navbar Head Begin */}
        <div className={styles.navbarHead} style={{ width: "100vw" }}>
          <div className={styles.navbarHeadLeftContainer}>
            <button onClick={onToggleSidebar}>
              <MenuIcon width="24px" height="24px" />
            </button>

            <Link href={PAGE.home.href}>
              <a>
                <Logo fontSize="36px" />
              </a>
            </Link>
          </div>

          <div className={styles.navbarHeadUserSectionContainer}>
            <ul className={styles.navbarHeadUserSectionUl}>
              <li className={styles.navbarHeadUserSectionLiMyAccount}>
                <ListPopupMobileContainer>
                  {auth ? (
                    <div>
                      <UserIcon width="24px" height="24px" />

                      <ListPopupMobile>
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
                      </ListPopupMobile>
                    </div>
                  ) : (
                    <div>
                      <UserIcon width="24px" height="24px" />

                      <ListPopupMobile>
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
                      </ListPopupMobile>
                    </div>
                  )}
                </ListPopupMobileContainer>
              </li>

              <li
                style={{
                  paddingRight: `${6 + cartLength.toString().length * 3.5}px`,
                }}
                className={styles.navbarHeadUserSectionLiMyCart}
              >
                <Link href={PAGE.cart.href}>
                  <a>
                    <ShoppingCartIcon width="24px" height="24px" />

                    <span className={styles.cartBubble}>{cartLength}</span>
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Navbar Head End */}

        {/* Search Bar Begin */}
        <SearchBarMobile containerWidth="100vw" inputWidth="95vw" />

        {/* Search Bar End */}

        {/* Navbar Footer Begin */}
        {/* <div className={styles.navbarFooter} style={{ width: BASE.widthNavbar }}>
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
      </div> */}
        {/* Navbar Footer End */}

        <div className={styles.bottomBorder}></div>
      </div>
    </>
  );
}

export default NavbarMobile;
