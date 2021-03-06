import Head from "next/head";
import styles from "../../styles/pages/user/myCart.module.scss";
import stylesM from "../../styles/pages/user/myCartM.module.scss";
import { API, PAGE } from "../../constants";
import Divider from "../../components/divider/divider";
import Link from "next/dist/client/link";
import { deleteData, getData, postData, putData } from "../../api/fetch";
import { useEffect, useState } from "react";
import slugify from "slugify";
import Swal from "sweetalert2";
import router from "next/router";
import Card from "../../components/cards/card";
import MainColorButton from "../../components/buttons/mainColorButton";
import LayoutMain from "../../components/Layout/layoutMain";
import LargeCounter from "../../components/counter/largeCounter";
import IconButton from "../../components/buttons/iconButton";
import TrashIcon from "../../public/icons/trash";
import InputCheckbox from "../../components/inputs/inputCheckbox";
import { useRecoilValue } from "recoil";
import { isAuthed, isMobile } from "../../states/index.atom";
import ShoppingCartIcon from "../../public/icons/shoppingCart";
import { calcPrice } from "../../utils/calcPrice";
import LayoutMainMobile from "../../components/Layout/layoutMainM";
import Spacer from "../../components/Spacer/spacer";
import Image from "next/dist/client/image";
import { srcLoader } from "../../utils/srcLoader";

export default function MyCart() {
  const [pageLoading, setPageLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const isAuth = useRecoilValue(isAuthed);
  const isMobileDevice = useRecoilValue(isMobile);

  const getCart = () => {
    if (isAuth) {
      getData("/api/cart/getCart")
        .then((res) => {
          var totalPriceItems = 0;
          res.data.cart.map((item) => {
            return item.checked
              ? (totalPriceItems += +calcPrice(item.price, item.count))
              : void 0;
          });
          setTotalPrice(totalPriceItems);
          setCart(res.data.cart.reverse());
          setPageLoading(false);
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Hata!",
            text: "L??tfen sayfay?? yenileyiniz.",
          });
        });
    } else {
      getData("/api/cart/getCartWithoutLogin/" + localStorage.getItem("cart"))
        .then((res) => {
          setCart(res.data.cart);
          var totalPriceItems = 0;
          res.data.cart.map((item) => {
            totalPriceItems += +calcPrice(item.count, item.price);
          });
          setTotalPrice(totalPriceItems);
          setPageLoading(false);
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Hata!",
            text: "L??tfen sayfay?? yenileyiniz.",
          });
        });
    }
  };

  useEffect(() => {
    getCart();
  }, [isAuth]);

  const onChangeCount = (productId, count) => {
    if (isAuth) {
      setCartLoading(true);
      putData("/api/cart/updateCount", { productId, count })
        .then(() => {
          getCart();
          setCartLoading(false);
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Hata!",
            text: "Adet de??i??tirilemedi. L??tfen tekrar deneyin.",
          });
          setCartLoading(false);
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "L??tfen daha fazla i??lem yapmak i??in kay??t olunuz veya giri?? yap??n??z.",
      });
    }
  };

  const deleteCartItem = (productId) => {
    if (isAuth) {
      setCartLoading(true);
      deleteData("/api/cart/deleteCart/" + productId)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Ba??ar??l??!",
            text: "??r??n sepetten kald??r??ld??.",
            timer: 1250,
            timerProgressBar: true,
          });
          setCartLoading(false);
          getCart();
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Hata!",
            text: "??r??n sepetten silinemedi l??tfen tekrar deneyin.",
          });
          setCartLoading(false);
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "L??tfen daha fazla i??lem yapmak i??in kay??t olunuz veya giri?? yap??n??z.",
      });
    }
  };

  const onCheckedChange = (productId, checked) => {
    if (isAuth) {
      setCartLoading(true);
      putData("/api/cart/updateChecked/", { productId, checked })
        .then(() => {
          setCartLoading(false);
          getCart();
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Hata!",
            text: "Bir hata oldu l??tfen tekrar se??imi de??i??tiriniz.",
          });
          setCartLoading(false);
          getCart();
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "L??tfen daha fazla i??lem yapmak i??in kay??t olunuz veya giri?? yap??n??z.",
      });
      getCart();
    }
  };

  const CartItemMobile = ({
    srcImg = "",
    productName = "",
    productHref = "",
    price = 0,
    checked = true,
    count = 50,
    productId,
  }) => {
    return (
      <Card
        className={stylesM.containerCartItemCard}
        width="85vw"
        padding="20px"
        height="100%"
      >
        <div className={stylesM.containerCartItem}>
          <div className={stylesM.leftContainerCartItem}>
            <div id="input-checkbox-container">
              <InputCheckbox
                onChange={(e) => {
                  onCheckedChange(productId, e.target.checked);
                }}
                defaultChecked={checked}
              />
            </div>
            <div className={stylesM.cartItemImgContainer}>
              <Image src={srcImg} loader={srcLoader} layout="fill" />
            </div>

            <Link href={productHref}>
              <a>{productName}</a>
            </Link>
          </div>
          <Spacer top="20px" />
          <div className={stylesM.rightContainerCartItem}>
            <LargeCounter
              value={count}
              onChange={(newCount) => {
                onChangeCount(productId, count + newCount);
              }}
            />
            <span>{calcPrice(price, count)} TL</span>
            <IconButton
              onClick={() => {
                deleteCartItem(productId);
              }}
              icon={<TrashIcon width="18px" height="18px" />}
            />
          </div>
        </div>
      </Card>
    );
  };
  const CartItem = ({
    srcImg = "",
    productName = "",
    productHref = "",
    price = 0,
    checked = true,
    count = 50,
    productId,
  }) => {
    return (
      <Card
        className={styles.containerCartItemCard}
        width="812px"
        padding="20px"
        height="55px"
      >
        <div className={styles.containerCartItem}>
          <div className={styles.leftContainerCartItem}>
            <div id="input-checkbox-container">
              <InputCheckbox
                onChange={(e) => {
                  onCheckedChange(productId, e.target.checked);
                }}
                defaultChecked={checked}
              />
            </div>
            <div className={styles.cartItemImgContainer}>
              <Image src={srcImg} loader={srcLoader} layout="fill" />
            </div>

            <Link href={productHref}>
              <a>{productName}</a>
            </Link>
          </div>

          <div className={styles.rightContainerCartItem}>
            <LargeCounter
              value={count}
              onChange={(newCount) => {
                onChangeCount(productId, count + newCount);
              }}
            />
            <span>{calcPrice(price, count)} TL</span>
            <IconButton
              onClick={() => {
                deleteCartItem(productId);
              }}
              icon={<TrashIcon width="18px" height="18px" />}
            />
          </div>
        </div>
      </Card>
    );
  };

  const onApplyCart = async () => {
    if (!isAuth) {
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "L??tfen hesab??n??z yoksa kay??t olun. Hesab??n??z varsa ??st taraftan giri?? yaparak al????veri?? edebilirsiniz.",
      });
    } else {
      var checkedList = [];
      cart.map((item) => {
        return item.checked ? checkedList.push(item.checked) : void 0;
      });
      if (checkedList.length > 1) {
        await putData("/api/cart/updateApproved", { approved: false })
          .then(() => {})
          .catch(() => {});
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Ayn?? anda sadece 1 sipari?? verebilirsiniz. Sonraki sayfada davetiyede kullan??lacak bilgiler istenecektir.",
        });
      } else {
        await putData("/api/cart/updateApproved", { approved: true })
          .then((res) => {
            return router.push(PAGE.applyInvitation.href);
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Hata!",
              text: "L??tfen tekrar deneyiniz.",
            });
          });
      }
    }
  };

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isMobileDevice ? (
        <LayoutMainMobile liveLoading={cartLoading} pageLoading={pageLoading}>
          <div className={stylesM.containerMain}>
            {cart.length > 0 ? (
              <div className={stylesM.container}>
                <div className={stylesM.leftContainer}>
                  <Divider direction="left">
                    Sepetim | {cart.length} ??r??n
                  </Divider>
                  {cart.map((item, index) => {
                    return (
                      <CartItemMobile
                        key={index}
                        srcImg={API.imgUrl + item.photos[0]}
                        productName={item.title}
                        price={item.price}
                        productHref={
                          "/product/" + slugify(item.title) + "-" + item.id
                        }
                        productId={item.id}
                        count={item.count}
                        checked={item.checked}
                      />
                    );
                  })}
                </div>
                <div className={stylesM.spacer}></div>
                <div className={stylesM.rightContainer}>
                  <Card width="85vw" padding="10px">
                    <Divider direction="left">Toplam</Divider>
                    {cart.map((item, index) => {
                      return item.checked ? (
                        <div key={index} className={stylesM.totalItemContainer}>
                          <span className={stylesM.totalItemTitle}>
                            {item.title}
                          </span>
                          <span className={stylesM.totalItemPrice}>
                            {calcPrice(item.price, item.count)}
                          </span>
                        </div>
                      ) : (
                        void 0
                      );
                    })}
                    <div className={stylesM.totalItemBottomContainer}>
                      <hr />
                      <div className={stylesM.totalPrice}>
                        <span className={stylesM.totalText}>Toplam</span>
                        <span className={stylesM.totalPriceText}>
                          {totalPrice} TL
                        </span>
                      </div>
                    </div>
                  </Card>
                  <MainColorButton
                    text="Sepeti Onayla"
                    width="100%"
                    height="40px"
                    onClick={onApplyCart}
                  />
                </div>
              </div>
            ) : (
              <div className={stylesM.cartEmpty}>
                <ShoppingCartIcon />
                Sepetiniz bo??
              </div>
            )}
          </div>
        </LayoutMainMobile>
      ) : (
        <LayoutMain liveLoading={cartLoading} pageLoading={pageLoading}>
          <div className={styles.containerMain}>
            {cart.length > 0 ? (
              <div className={styles.container}>
                <div className={styles.leftContainer}>
                  <Divider direction="left">
                    Sepetim | {cart.length} ??r??n
                  </Divider>
                  {cart.map((item, index) => {
                    return (
                      <CartItem
                        key={index}
                        srcImg={API.imgUrl + item.photos[0]}
                        productName={item.title}
                        price={item.price}
                        productHref={
                          "/product/" + slugify(item.title) + "-" + item.id
                        }
                        productId={item.id}
                        count={item.count}
                        checked={item.checked}
                      />
                    );
                  })}
                </div>
                <div className={styles.spacer}></div>
                <div className={styles.rightContainer}>
                  <MainColorButton
                    text="Sepeti Onayla"
                    width="100%"
                    height="40px"
                    onClick={onApplyCart}
                  />
                  <Card width="260px" padding="10px">
                    <Divider direction="left">Toplam</Divider>
                    {cart.map((item, index) => {
                      return item.checked ? (
                        <div key={index} className={styles.totalItemContainer}>
                          <span className={styles.totalItemTitle}>
                            {item.title}
                          </span>
                          <span className={styles.totalItemPrice}>
                            {calcPrice(item.price, item.count)}
                          </span>
                        </div>
                      ) : (
                        void 0
                      );
                    })}
                    <div className={styles.totalItemBottomContainer}>
                      <hr />
                      <div className={styles.totalPrice}>
                        <span className={styles.totalText}>Toplam</span>
                        <span className={styles.totalPriceText}>
                          {totalPrice} TL
                        </span>
                      </div>
                    </div>
                  </Card>
                  <MainColorButton
                    text="Sepeti Onayla"
                    width="100%"
                    height="40px"
                    onClick={onApplyCart}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.cartEmpty}>
                <ShoppingCartIcon />
                Sepetiniz bo??
              </div>
            )}
          </div>
        </LayoutMain>
      )}
    </div>
  );
}
