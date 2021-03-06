import Head from "next/head";
import styles from "../../styles/pages/payment/applyInvitation.module.scss";
import stylesM from "../../styles/pages/payment/applyInvitationM.module.scss";
import { PAGE } from "../../constants";
import Divider from "../../components/divider/divider";
import { getData, putData } from "../../api/fetch";
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
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { isMobile } from "../../states/index.atom";
import LayoutMainMobile from "../../components/Layout/layoutMainM";

export default function ApplyInvitation() {
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUser] = useState({});
  const [districts, setDistricts] = useState([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [hennaCheck, setHennaCheck] = useState(true);
  const isMobileDevice = useRecoilValue(isMobile);

  const getCartLength = async () => {
    return await getData("/api/cart/getCartLength")
      .then((res) => {
        return res.data.length;
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
      const cartApproved = await getCartApproved();
      if (cartLength > 0 && cartApproved) {
        setPageLoading(false);
      } else {
        router.push(PAGE.login.href);
      }
    })();
  }, []);

  const onApply = async (e) => {
    e.preventDefault();
    setLiveLoading(true);
    // If select same address to ship and billing
    const values = getFormValues("invitation-form");
    var isErrorGived = false;
    if (hennaCheck) {
      await Object.keys(values).map((item) => {
        if (values[item].length <= 0) {
          return (isErrorGived = true);
        }
      });
    } else {
      await Object.keys(values).map((item) => {
        if (values[item].length <= 0 && !item.includes("henna")) {
          return (isErrorGived = true);
        }
      });
    }

    if (!isErrorGived) {
      await putData("/api/member/updateInvitation", values)
        .then(() => {
          return router.push(PAGE.applyAddress.href);
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Hata!",
            text: "L??tfen tekrar deneyiniz.",
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "L??tfen gerekli yerleri doldurunuz.",
      });
    }

    setLiveLoading(false);
  };

  const onChangeHennaCheckbox = (e) => {
    const value = e.target.checked;
    setHennaCheck(value);
  };

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isMobileDevice ? (
        <LayoutMainMobile liveLoading={liveLoading} pageLoading={pageLoading}>
          <div className={stylesM.containerMain}>
            <div className={stylesM.container}>
              <div className={stylesM.leftContainer}>
                <Card width="85vw" padding="15px">
                  <Divider direction="left">Davetiye Bilgileri</Divider>
                  <Form id="invitation-form">
                    <div className={stylesM.rowContainer}>
                      <InputText
                        labelText="Gelinin Ad?? Soyad??"
                        width="77vw"
                        name="brideFullname"
                      />
                      <InputText
                        labelText="Damad??n Ad?? Soyad??"
                        width="77vw"
                        name="groomFullname"
                      />
                    </div>
                    <div className={stylesM.rowContainer}>
                      <InputText
                        labelText="Gelinin Anne Baba Ad??"
                        width="77vw"
                        name="brideParentsName"
                      />
                      <InputText
                        labelText="Damad??n Anne Baba Ad??"
                        width="77vw"
                        name="groomParentsName"
                      />
                    </div>
                    <div className={stylesM.fluidContainer}>
                      <InputText
                        labelText="D??????n Tarihi"
                        width="92.5%"
                        name="weddingDate"
                      />
                    </div>
                    <div className={stylesM.rowContainer}>
                      <InputText
                        labelText="D??????n Ba??lang???? Saati"
                        width="77vw"
                        name="weddingStartTime"
                      />
                      <InputText
                        labelText="D??????n Biti?? Saati"
                        width="77vw"
                        name="weddingEndTime"
                      />
                    </div>
                    <div className={stylesM.rowContainer}>
                      <InputText
                        labelText="D??????n Yeri"
                        width="77vw"
                        name="weddingLocation"
                      />
                      <InputText
                        labelText="D??????n Adresi"
                        width="77vw"
                        name="weddingAddress"
                      />
                    </div>
                    <div className={stylesM.checkboxContainer}>
                      <InputCheckbox
                        defaultChecked={true}
                        onChange={onChangeHennaCheckbox}
                      />
                      <span>K??na yapacak m??s??n??z?</span>
                    </div>

                    {hennaCheck ? (
                      <>
                        <div className={stylesM.fluidContainer}>
                          <InputText
                            labelText="K??na Tarihi"
                            width="92.5%"
                            name="hennaDate"
                          />
                        </div>
                        <div className={stylesM.rowContainer}>
                          <InputText
                            labelText="K??na Ba??lang???? Saati"
                            width="77vw"
                            name="hennaStartTime"
                          />
                          <InputText
                            labelText="K??na Biti?? Saati"
                            width="77vw"
                            name="hennaEndTime"
                          />
                        </div>
                        <div className={stylesM.rowContainer}>
                          <InputText
                            labelText="K??na Yeri"
                            width="77vw"
                            name="hennaLocation"
                          />
                          <InputText
                            labelText="K??na Adresi"
                            width="77vw"
                            name="hennaAddress"
                          />
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    <div className={stylesM.fluidContainer}>
                      <InputText
                        labelText="Davetiye S??z??"
                        width="92.5%"
                        name="invitationWord"
                      />
                    </div>
                    <div className={stylesM.fluidContainer}>
                      <InputText
                        labelText="WhatsApp Numaran??z"
                        width="92.5%"
                        name="whatsappNumber"
                      />
                    </div>

                    <span className={stylesM.warnText}>
                      Verdi??iniz bilgilerle size WhatsApp ??zerinden tasar??m
                      g??nderilecektir. Siz tasar??m?? onaylamad??????n??z s??rece
                      kesinlikle bask?? olmayacakt??r.
                    </span>
                    <div className={stylesM.applyButton}>
                      <MainColorButton
                        text="Onayla"
                        width="100%"
                        height="40px"
                        onClick={onApply}
                      />
                    </div>
                  </Form>
                </Card>
              </div>
            </div>
          </div>
        </LayoutMainMobile>
      ) : (
        <LayoutMain liveLoading={liveLoading} pageLoading={pageLoading}>
          <div className={styles.containerMain}>
            <div className={styles.container}>
              <div className={styles.leftContainer}>
                <Card width="812px" padding="15px">
                  <Divider direction="left">Davetiye Bilgileri</Divider>
                  <Form id="invitation-form">
                    <div className={styles.rowContainer}>
                      <InputText
                        labelText="Gelinin Ad?? Soyad??"
                        width="85%"
                        name="brideFullname"
                      />
                      <InputText
                        labelText="Damad??n Ad?? Soyad??"
                        width="85%"
                        name="groomFullname"
                      />
                    </div>
                    <div className={styles.rowContainer}>
                      <InputText
                        labelText="Gelinin Anne Baba Ad??"
                        width="85%"
                        name="brideParentsName"
                      />
                      <InputText
                        labelText="Damad??n Anne Baba Ad??"
                        width="85%"
                        name="groomParentsName"
                      />
                    </div>
                    <div className={styles.fluidContainer}>
                      <InputText
                        labelText="D??????n Tarihi"
                        width="92.5%"
                        name="weddingDate"
                      />
                    </div>
                    <div className={styles.rowContainer}>
                      <InputText
                        labelText="D??????n Ba??lang???? Saati"
                        width="85%"
                        name="weddingStartTime"
                      />
                      <InputText
                        labelText="D??????n Biti?? Saati"
                        width="85%"
                        name="weddingEndTime"
                      />
                    </div>
                    <div className={styles.rowContainer}>
                      <InputText
                        labelText="D??????n Yeri"
                        width="85%"
                        name="weddingLocation"
                      />
                      <InputText
                        labelText="D??????n Adresi"
                        width="85%"
                        name="weddingAddress"
                      />
                    </div>
                    <div className={styles.checkboxContainer}>
                      <InputCheckbox
                        defaultChecked={true}
                        onChange={onChangeHennaCheckbox}
                      />
                      <span>K??na yapacak m??s??n??z?</span>
                    </div>

                    {hennaCheck ? (
                      <>
                        <div className={styles.fluidContainer}>
                          <InputText
                            labelText="K??na Tarihi"
                            width="92.5%"
                            name="hennaDate"
                          />
                        </div>
                        <div className={styles.rowContainer}>
                          <InputText
                            labelText="K??na Ba??lang???? Saati"
                            width="85%"
                            name="hennaStartTime"
                          />
                          <InputText
                            labelText="K??na Biti?? Saati"
                            width="85%"
                            name="hennaEndTime"
                          />
                        </div>
                        <div className={styles.rowContainer}>
                          <InputText
                            labelText="K??na Yeri"
                            width="85%"
                            name="hennaLocation"
                          />
                          <InputText
                            labelText="K??na Adresi"
                            width="85%"
                            name="hennaAddress"
                          />
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    <div className={styles.fluidContainer}>
                      <InputText
                        labelText="Davetiye S??z??"
                        width="92.5%"
                        name="invitationWord"
                      />
                    </div>
                    <div className={styles.fluidContainer}>
                      <InputText
                        labelText="WhatsApp Numaran??z"
                        width="92.5%"
                        name="whatsappNumber"
                      />
                    </div>

                    <span className={styles.warnText}>
                      Verdi??iniz bilgilerle size WhatsApp ??zerinden tasar??m
                      g??nderilecektir. Siz tasar??m?? onaylamad??????n??z s??rece
                      kesinlikle bask?? olmayacakt??r.
                    </span>
                    <div className={styles.applyButton}>
                      <MainColorButton
                        text="Onayla"
                        width="100%"
                        height="40px"
                        onClick={onApply}
                      />
                    </div>
                  </Form>
                </Card>
              </div>
              <div className={styles.spacer}></div>
              <div className={styles.rightContainer}>
                <MainColorButton
                  text="Onayla"
                  width="248px"
                  height="40px"
                  onClick={onApply}
                />
              </div>
            </div>
          </div>
        </LayoutMain>
      )}
    </div>
  );
}
