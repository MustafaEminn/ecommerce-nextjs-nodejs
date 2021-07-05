import Head from "next/head";
import styles from "../../styles/pages/user/myCart.module.scss";
import { API, BASE, PAGE } from "../../constants";
import Divider from "../../components/divider/divider";
import Link from "next/dist/client/link";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper/core";
import CardProduct from "../../components/cards/cardProduct";
import Spacer from "../../components/Spacer/spacer";
import { deleteData, getData, postData, putData } from "../../api/fetch";
import { useEffect, useState } from "react";
import slugify from "slugify";
import Swal from "sweetalert2";
import jwtDecode from "jwt-decode";
import InputText from "../../components/inputs/inputText";
import InputSelect from "../../components/inputs/inputSelect";
import { cityDistrict } from "../../constants/cityDistrict";
import router from "next/router";
import Form from "../../components/forms/form";
import InputTextbox from "../../components/inputs/inputTextbox";
import Card from "../../components/cards/card";
import MainColorButton from "../../components/buttons/mainColorButton";
import { getFormValues } from "../../utils/getFormValues";
import { resetFormValues } from "../../utils/resetFormValues";
import LayoutMain from "../../components/Layout/layoutMain";
import LargeCounter from "../../components/counter/largeCounter";
import IconButton from "../../components/buttons/iconButton";
import TrashIcon from "../../public/icons/trash";
import InputCheckbox from "../../components/inputs/inputCheckbox";
import { useRecoilValue } from "recoil";
import { isAuthed } from "../../states/index.atom";

export default function MyCart() {
  const [pageLoading, setPageLoading] = useState(true);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const isAuth = useRecoilValue(isAuthed);

  const getCart = () => {
    if (isAuth) {
      getData("/api/cart/getCart")
        .then((res) => {
          setCart(res.data.cart);
          setPageLoading(false);
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Hata!",
            text: "Lütfen sayfayı yenileyiniz.",
          });
        });
    } else {
      // getData("/api/cart/getCartWithoutLogin/" + localStorage.getItem("cart"))
      //   .then((res) => {
      //     setCart(res.data.cart);
      //     setPageLoading(false);
      //   })
      //   .catch(() => {
      //     Swal.fire({
      //       icon: "error",
      //       title: "Hata!",
      //       text: "Lütfen sayfayı yenileyiniz.",
      //     });
      //   });
    }
  };

  useEffect(() => {
    getCart();
  }, [isAuth]);

  const onChangeCount = (productId, count) => {
    setCartLoading(true);
    putData("/api/cart/updateCount", { productId, count })
      .then(() => {
        getCart();
        setCartLoading(false);
        Swal.fire({
          icon: "success",
          title: "Başarılı!",
          text: "Adet değiştirildi.",
          timer: 1250,
          timerProgressBar: true,
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Adet değiştirilemedi. Lütfen tekrar deneyin.",
        });
        setCartLoading(false);
      });
  };

  const deleteCartItem = (productId) => {
    setCartLoading(true);
    deleteData("/api/cart/deleteCart/" + productId)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Başarılı!",
          text: "Ürün sepetten kaldırıldı.",
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
          text: "Ürün sepetten silinemedi lütfen tekrar deneyin.",
        });
        setCartLoading(false);
      });
  };

  const onCheckedChange = (productId, checked) => {
    setCartLoading(true);
    putData("/api/cart/updateChecked/", { productId, checked })
      .then(() => {
        setCartLoading(false);
        getCart();
      })
      .catch(() => {
        setCartLoading(false);
      });
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
            <img src={srcImg} />

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
            <span>{(price * (count / 50)).toFixed(2)} TL</span>
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

  const onApplyCart = () => {};

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LayoutMain centerContent pageLoading={pageLoading}>
        <div className={styles.containerMain}>
          <div className={styles.container}>
            <div className={styles.leftContainer}>
              <Divider direction="left">Sepetim | {cart.length} Ürün</Divider>
              {cart.map((item, index) => {
                return (
                  <CartItem
                    key={index}
                    srcImg={API.imgUrl + item.photos[0]}
                    productName={item.title}
                    price={item.price}
                    productHref={
                      "product/" + slugify(item.title) + "-" + item.id
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
                disabled={loading}
                text="Sepeti Onayla"
                width="100%"
                height="40px"
                onClick={onApplyCart}
              />
              <Card width="260px" height="275px" padding="10px">
                <Divider direction="left">Toplam</Divider>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                ></Form>
              </Card>
              <MainColorButton
                disabled={loading}
                text="Sepeti Onayla"
                width="100%"
                height="40px"
                onClick={onApplyCart}
              />
            </div>
          </div>
        </div>
      </LayoutMain>
    </div>
  );
}
