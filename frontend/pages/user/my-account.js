import Head from "next/head";
import styles from "../../styles/pages/user/myAccount.module.scss";
import stylesM from "../../styles/pages/user/myAccountM.module.scss";
import { API, PAGE } from "../../constants";
import Divider from "../../components/divider/divider";
import Link from "next/dist/client/link";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper/core";
import CardProduct from "../../components/cards/cardProduct";
import Spacer from "../../components/Spacer/spacer";
import { getData, postData, putData } from "../../api/fetch";
import { useEffect, useState } from "react";
import slugify from "slugify";
import Swal from "sweetalert2";
import jwtDecode from "jwt-decode";
import LayoutSidebar from "../../components/Layout/layoutSidebar";
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
import { useRecoilValue } from "recoil";
import { isMobile } from "../../states/index.atom";
import LayoutMainMobile from "../../components/Layout/layoutMainM";

export default function MyAccount() {
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUser] = useState({});
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMobileDevice = useRecoilValue(isMobile);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const decoded = jwtDecode(localStorage.getItem("token"));
      getData("/api/member/getMemberById/" + decoded.userId)
        .then((res) => {
          setUser(res.data.member[0]);
          setPageLoading(false);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Hata!",
            text: "Lütfen sayfayı yenileyiniz. Eğer tekrar bu hatayı alırsanız bu hatayı en kısa sürede düzelteceğiz.",
          });
        });
    } else {
      router.push(PAGE.login.href);
    }
  }, []);

  const citys = cityDistrict.map((item) => {
    return { title: item.il_adi, value: item.il_adi };
  });

  const onChangeCity = async (e) => {
    const value = e ? e.target.value : user.City;
    const cityValues = citys.map((item) => item.value);
    var selectedIndex = cityValues.indexOf(value);
    const districtsValue = cityDistrict[selectedIndex]?.ilceler.map((item) => {
      return { value: item.ilce_adi, title: item.ilce_adi };
    });
    setDistricts(districtsValue);
  };

  useEffect(() => {
    onChangeCity();
  }, [user]);

  const onUpdatePassword = () => {
    setLoading(true);
    var fields = getFormValues("form-password");
    var haveError = false;
    Object.values(fields).map((item) => {
      return item.length >= 4 ? void 0 : (haveError = true);
    });
    if (haveError) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Şifreniz 4 haneden fazla olmak zorundadır.",
      });
    } else if (fields["oldPassword"] === fields["newPassword"]) {
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Eski şifrenizle yeni şifreniz aynıdır. Lütfen farklı şekilde giriniz.",
      });
    } else {
      putData("/api/member/updatePassword", fields)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Başarılı!",
            text: "Şifreniz güncellendi.",
          });
          resetFormValues("form-password");
          setLoading(false);
        })
        .catch((err) => {
          if (err?.response?.data?.code === 3) {
            Swal.fire({
              icon: "error",
              title: "Hata!",
              text: "Şuanki şifrenizi yanlış girdiniz.",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Hata!",
              text: "Lütfen tekrar deneyin.",
            });
          }

          setLoading(false);
        });
    }
  };
  const onUpdateUser = () => {
    setLoading(true);
    var fields = getFormValues("personalInfos");
    var haveError = false;
    Object.values(fields).map((item) => {
      return item.length >= 2 ? void 0 : (haveError = true);
    });
    if (haveError) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Lütfen boş alanları doldurunuz.",
      });
    } else {
      let sendingData = {
        Name: fields.name,
        Surname: fields.surname,
        PhoneNumber: fields.phoneNumber,
        Email: user.Email,
        City: fields.city,
        District: fields.district,
        Neighborhood: fields.neighborhood,
        Address: fields.address,
        id: user.id,
      };
      putData("/api/member/updateMember", sendingData)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Başarılı!",
            text: "Bilgileriniz güncellendi.",
          });
          setLoading(false);
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Hata!",
            text: "Lütfen tekrar deneyin.",
          });
          setLoading(false);
        });
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
        <LayoutMainMobile pageLoading={pageLoading}>
          <div className={stylesM.container}>
            <Card width="85vw">
              <Divider direction="left">Kişisel Bilgilerim</Divider>
              <Form
                id="personalInfos"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <InputText
                  defaultValue={user.Name || ""}
                  name="name"
                  labelText="Ad"
                  pattern="^.{2,}$"
                  width="80vw"
                />
                <InputText
                  defaultValue={user.Surname || ""}
                  name="surname"
                  labelText="Soyad"
                  pattern="^.{2,}$"
                  width="80vw"
                />
                <InputText
                  defaultValue={user.PhoneNumber || ""}
                  name="phoneNumber"
                  labelText="Telefon Numarası"
                  pattern="^.{6,}$"
                  width="80vw"
                />
                <div className={styles.spaceDivider} />
                <Divider direction="left">Adres Bilgilerim</Divider>
                <InputSelect
                  defaultValue={user.City || ""}
                  options={citys}
                  name="city"
                  labelText="İl"
                  onChange={onChangeCity}
                  id="cityMyAccount"
                  width="88vw"
                />
                <InputSelect
                  defaultValue={user.District || ""}
                  options={districts}
                  name="district"
                  labelText="İlçe"
                  width="88vw"
                  id="districtMyAccount"
                />
                <InputText
                  defaultValue={user.Neighborhood || ""}
                  name="neighborhood"
                  labelText="Mahalle"
                  pattern="^.{2,}$"
                  width="80vw"
                />
                <InputTextbox
                  defaultValue={user.Address || ""}
                  name="address"
                  labelText="Adres"
                  pattern="^.{2,}$"
                  maxWidth="520px"
                  rows={5}
                  maxHeight="500px"
                  height="200px"
                  width="80vw"
                />
                <MainColorButton
                  center
                  disabled={loading}
                  width="80vw"
                  height="40px"
                  text="Güncelle"
                  onClick={onUpdateUser}
                />
              </Form>
            </Card>
            <Card width="85vw" height="275px">
              <Divider direction="left">Şifre Yenileme</Divider>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                id="form-password"
              >
                <InputText
                  name="oldPassword"
                  labelText="Şuanki Şifreniz"
                  pattern="^.{2,}$"
                  type="password"
                  width="80vw"
                />
                <InputText
                  name="newPassword"
                  labelText="Yeni Şifreniz"
                  pattern="^.{2,}$"
                  type="password"
                  width="80vw"
                />
                <MainColorButton
                  center
                  width="80vw"
                  height="40px"
                  text="Güncelle"
                  onClick={onUpdatePassword}
                />
              </Form>
            </Card>
          </div>
        </LayoutMainMobile>
      ) : (
        <LayoutSidebar pageLoading={pageLoading}>
          <div className={styles.container}>
            <Card width="50%">
              <Divider direction="left">Kişisel Bilgilerim</Divider>
              <Form
                id="personalInfos"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <InputText
                  defaultValue={user.Name || ""}
                  name="name"
                  labelText="Ad"
                  pattern="^.{2,}$"
                />
                <InputText
                  defaultValue={user.Surname || ""}
                  name="surname"
                  labelText="Soyad"
                  pattern="^.{2,}$"
                />
                <InputText
                  defaultValue={user.PhoneNumber || ""}
                  name="phoneNumber"
                  labelText="Telefon Numarası"
                  pattern="^.{6,}$"
                />
                <div className={styles.spaceDivider} />
                <Divider direction="left">Adres Bilgilerim</Divider>
                <InputSelect
                  defaultValue={user.City || ""}
                  options={citys}
                  name="city"
                  labelText="İl"
                  onChange={onChangeCity}
                  width="325px"
                  id="cityMyAccount"
                />
                <InputSelect
                  defaultValue={user.District || ""}
                  options={districts}
                  name="district"
                  labelText="İlçe"
                  width="325px"
                  id="districtMyAccount"
                />
                <InputText
                  defaultValue={user.Neighborhood || ""}
                  name="neighborhood"
                  labelText="Mahalle"
                  pattern="^.{2,}$"
                />
                <InputTextbox
                  defaultValue={user.Address || ""}
                  name="address"
                  labelText="Adres"
                  pattern="^.{2,}$"
                  maxWidth="520px"
                  rows={5}
                  maxHeight="500px"
                  height="200px"
                />
                <MainColorButton
                  center
                  disabled={loading}
                  width="328px"
                  height="40px"
                  text="Güncelle"
                  onClick={onUpdateUser}
                />
              </Form>
            </Card>
            <Card width="50%" height="275px">
              <Divider direction="left">Şifre Yenileme</Divider>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                id="form-password"
              >
                <InputText
                  name="oldPassword"
                  labelText="Şuanki Şifreniz"
                  pattern="^.{2,}$"
                  type="password"
                />
                <InputText
                  name="newPassword"
                  labelText="Yeni Şifreniz"
                  pattern="^.{2,}$"
                  type="password"
                />
                <MainColorButton
                  center
                  width="328px"
                  height="40px"
                  text="Güncelle"
                  onClick={onUpdatePassword}
                />
              </Form>
            </Card>
          </div>
        </LayoutSidebar>
      )}
    </div>
  );
}
