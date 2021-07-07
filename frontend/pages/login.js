import LayoutMain from "../components/Layout/layoutMain";
import Head from "next/dist/next-server/lib/head";
import styles from "../styles/pages/giris/giris.module.scss";
import Card from "../components/cards/card";
import Form from "../components/forms/form";
import InputText from "../components/inputs/inputText";
import Spacer from "../components/Spacer/spacer";
import { PAGE } from "../constants";
import Modal from "../components/modals/modal";
import { useState } from "react";
import MainColorButton from "../components/buttons/mainColorButton";
import WhiteButton from "../components/buttons/whiteButton";
import Link from "next/dist/client/link";
import Swal from "sweetalert2";
import { postData } from "../api/fetch";
import router from "next/router";

function Giris() {
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] =
    useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [forgotPassEmail, setForgotPassEmail] = useState("");

  const onLogin = (e) => {
    e.preventDefault();
    const values = Form.getFields();
    let isFormSuccess = true;

    Object.keys(values).map((item) => {
      if (!values[item].verified) {
        isFormSuccess = false;
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Lütfen boş kısımları doldurunuz.",
        });
      }
    });

    if (isFormSuccess) {
      let sendValues = {};
      Object.keys(values).map((item) => {
        sendValues[item] = values[item].value;
      });
      setDisableButton(true);
      postData("/api/auth/login", sendValues)
        .then(async (res) => {
          localStorage.setItem("token", res.data.token);
          const cart = localStorage.getItem("cart");
          if (cart) {
            postData("/api/cart/loginSetCart", { cart: cart })
              .then((res) => {
                localStorage.removeItem("cart");
              })
              .catch(() => {});
          }
          Swal.fire({
            icon: "success",
            title: "Başarılı!",
            text: "Giriş yapıldı.",
            didClose: () => {
              router.push(PAGE.home.href);
            },
          });
        })
        .catch((err) => {
          if (err.response?.data.code === 1) {
            Swal.fire({
              icon: "error",
              title: "Hata!",
              text: "Email adresiniz veya şifreniz yanlış.",
            });
          }
        });

      setDisableButton(false);
    }
  };

  const onResetPassword = (e) => {
    e.preventDefault();
    let isFormSuccess = true;

    if (forgotPassEmail.length < 6) {
      isFormSuccess = false;
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Lütfen şifrenizi unuttuğunuz hesabınız emailini giriniz.",
      });
    }

    if (isFormSuccess) {
      setDisableButton(true);
      postData("/api/auth/resetPasswordSendMail", { email: forgotPassEmail })
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: "Başarılı!",
            text: "Mail gönderildi.",
            didClose: () => {
              router.push(PAGE.home.href);
            },
          });
        })
        .catch((err) => {
          if (err.response?.data.code === 1) {
            Swal.fire({
              icon: "error",
              title: "Hata!",
              text: "Bu emaile ait bir hesap bulunamadı.",
            });
          }
        });

      setDisableButton(false);
    }
  };
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LayoutMain
        whenAuthDisabledPage={true}
        centerContent={true}
        fadeBG={true}
      >
        <Modal
          title="Şifre Yenile"
          width="400px"
          height="200px"
          visible={forgotPasswordModalVisible}
          onClose={() => {
            setForgotPasswordModalVisible(false);
          }}
        >
          <Spacer top="20px" />
          <h4 className={styles.forgotPassHeader}>
            Lütfen email adresinizi giriniz. Size şifrebizi sıfırlamanız için
            mail göndereceğiz.
          </h4>
          <Spacer top="15px" />
          <Form onSubmit={onResetPassword}>
            <InputText
              width="94%"
              labelText="Email"
              name="email"
              type="email"
              onChange={(e) => {
                setForgotPassEmail(e.target.value);
              }}
            />
            <Spacer top="14px" />
            <MainColorButton
              height="44px"
              type="button"
              disabled={disableButton}
              text="Şifre Sıfırlama Maili Gönder"
              onClick={onResetPassword}
            />
          </Form>
        </Modal>
        <div className={styles.container}>
          <Card width="325px" height="320px">
            <Form onSubmit={onLogin}>
              <InputText
                labelText="Email"
                name="email"
                type="email"
                pattern="^.{6,}$"
              />
              <Spacer top="16px" />
              <InputText
                labelText="Şifre"
                name="password"
                type="password"
                pattern="^.{6,}$"
              />
              <Spacer top="24px" />
              <div className={styles.forgotPass}>
                <button
                  onClick={() => {
                    setForgotPasswordModalVisible(true);
                  }}
                  className={styles.forgotPassButton}
                  type="button"
                >
                  Şifremi unuttum
                </button>
              </div>
              <Spacer bottom="10px" />
              <MainColorButton
                onClick={onLogin}
                type="button"
                height="44px"
                text="Giriş Yap"
                disabled={disableButton}
              />
              <Spacer bottom="16px" />
              <Link href={PAGE.register.href}>
                <a>
                  <WhiteButton type="button" height="44px" text="Kayıt Ol" />
                </a>
              </Link>
            </Form>
          </Card>
        </div>
      </LayoutMain>
    </div>
  );
}

export default Giris;
