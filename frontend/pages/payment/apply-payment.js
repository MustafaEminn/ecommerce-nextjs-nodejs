import Head from "next/head";
import styles from "../../styles/pages/payment/applyPayment.module.scss";
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
import LayoutMain from "../../components/Layout/layoutMain";
import InputCheckbox from "../../components/inputs/inputCheckbox";
import InputCardRadio from "../../components/inputs/inputCardRadio";
import { calcPrice } from "../../utils/calcPrice";

export default function ApplyPayment() {
  const [pageLoading, setPageLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [liveLoading, setLiveLoading] = useState(false);
  const [cart, setCart] = useState([]);

  const getCart = async () => {
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
          text: "Lütfen sayfayı yenileyiniz.",
        });
      });
  };

  const getCartLength = async () => {
    return await getData("/api/cart/getCartLength")
      .then((res) => {
        return res.data.length;
      })
      .catch(() => {
        return router.push(PAGE.home.href);
      });
  };
  const getIsAddressEntered = async () => {
    return await getData("/api/member/checkAddress")
      .then((res) => {
        return res.data.address;
      })
      .catch(() => {
        return router.push(PAGE.home.href);
      });
  };

  const getCartApproved = async () => {
    return await getData("/api/cart/getCartApproved")
      .then((res) => {
        return res.data.approved;
      })
      .catch(() => {
        return router.push(PAGE.home.href);
      });
  };

  useEffect(() => {
    (async () => {
      const cartLength = await getCartLength();
      const addressEntered = await getIsAddressEntered();
      const cartApproved = await getCartApproved();
      if (cartLength > 0 && addressEntered && cartApproved) {
        getCart();
      } else {
        router.push(PAGE.login.href);
      }
    })();
  }, []);

  // const CreditCardExplainItem = () => {
  //   return (
  //     <div className={styles.explainItemContainer}>
  //       <p>
  //         Ödeme Yap butonuna tıkladığınızda sizi güvenle ödeme yapmak için
  //         iyzico sayfasına yönlendireceğiz. Ödemeniz yapıldıktan sonra
  //         siparişiniz alınacaktır. (Kart bilgileriniz bizde tutulmamaktadır.)
  //       </p>
  //     </div>
  //   );
  // };

  const PayAtTheDoorExplainItem = () => {
    return (
      <div className={styles.explainItemContainer}>
        <p>
          WhatsApp üzerinden tasarımı onayladıktan sonra kapıda ödeme yöntemiyle
          davetiyeniz size iletilecektir.
        </p>
      </div>
    );
  };

  const onApply = async () => {
    setLiveLoading(true);
    var productId = "";
    var countProduct = 0;
    var priceProduct = 0;
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    cart.map((item) => {
      if (item.checked) {
        countProduct = item.count;
        priceProduct = item.price;
        return (productId = item.id);
      }
    });
    const user = await getData(
      "/api/member/getMemberById/" + decodedToken.userId
    )
      .then((res) => {
        return res.data.member[0];
      })
      .catch(() => {});
    console.log(user);
    const invitation = JSON.parse(user.Invitation);

    const sendData = {
      orderShippingAddress: {
        contactName: `${decodedToken.name} ${decodedToken.surname}`,
        city: user.City,
        country: "Turkey",
        address: `${user.Neighborhood} ${user.Address} ${user.District}`,
      },
      orderShippingAddress: {
        contactName: `${decodedToken.name} ${decodedToken.surname}`,
        city: user.billingCity,
        country: "Turkey",
        address: `${user.billingNeighborhood} ${user.billingAddress} ${user.billingDistrict}`,
      },
      orderStatus: 1,
      productId: productId,
      invitation: invitation,
      count: countProduct,
      price: calcPrice(priceProduct, countProduct),
    };
    await postData("/api/order/addOrder", sendData)
      .then(async () => {
        await deleteData("/api/cart/deleteCart/" + productId)
          .then(async () => {
            await putData("/api/member/updateInvitation", {})
              .then(() => {
                Swal.fire({
                  icon: "success",
                  title: "Başarılı",
                  text: "Siparişiniz başarıyla alındı. WhatsApp üzerinden size dönülecek. Sipariş durumunu siparişlerim kısmından takip edebilirsiniz.",
                  didClose: () => {
                    return router.push(PAGE.home.href);
                  },
                });
              })
              .catch(() => {});
          })
          .catch(() => {});
      })
      .catch(() => {});
  };

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LayoutMain liveLoading={liveLoading} pageLoading={pageLoading}>
        <div className={styles.containerMain}>
          <div className={styles.container}>
            <div className={styles.leftContainer}>
              <Card width="812px" padding="15px">
                <Divider direction="left">Ödeme Yöntemi</Divider>
                <div>
                  <InputCardRadio
                    width="96%"
                    name="paymentType"
                    options={[
                      {
                        title: "Kapıda Ödeme",
                        value: "payAtTheDoor",
                        explain: <PayAtTheDoorExplainItem />,
                      },
                    ]}
                  />
                  <Spacer top="15px" />
                </div>
              </Card>
            </div>
            <div className={styles.spacer}></div>
            <div className={styles.rightContainer}>
              <Card width="260px" padding="10px">
                <Divider direction="left">Toplam</Divider>
                {cart.map((item, index) => {
                  return item.checked ? (
                    <div key={index} className={styles.totalItemContainer}>
                      <span className={styles.totalItemTitle}>
                        {item.title}
                      </span>
                      <span className={styles.totalItemPrice}>
                        {(item.price * (item.count / 50)).toFixed(2)}
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
              <Spacer top="15px" />
              <MainColorButton
                text="Ödeme Yap"
                width="100%"
                height="40px"
                onClick={onApply}
              />
            </div>
          </div>
        </div>
      </LayoutMain>
    </div>
  );
}
