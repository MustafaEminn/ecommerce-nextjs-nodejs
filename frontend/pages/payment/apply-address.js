import Head from "next/head";
import styles from "../../styles/pages/payment/applyAddress.module.scss";
import {API, BASE, PAGE} from "../../constants";
import Divider from "../../components/divider/divider";
import Link from "next/dist/client/link";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {Navigation} from "swiper/core";
import CardProduct from "../../components/cards/cardProduct";
import Spacer from "../../components/Spacer/spacer";
import {deleteData, getData, postData, putData} from "../../api/fetch";
import {useEffect, useState} from "react";
import slugify from "slugify";
import Swal from "sweetalert2";
import jwtDecode from "jwt-decode";
import InputText from "../../components/inputs/inputText";
import InputSelect from "../../components/inputs/inputSelect";
import {cityDistrict} from "../../constants/cityDistrict";
import router from "next/router";
import Form from "../../components/forms/form";
import InputTextbox from "../../components/inputs/inputTextbox";
import Card from "../../components/cards/card";
import MainColorButton from "../../components/buttons/mainColorButton";
import {getFormValues} from "../../utils/getFormValues";
import {resetFormValues} from "../../utils/resetFormValues";
import LayoutMain from "../../components/Layout/layoutMain";
import LargeCounter from "../../components/counter/largeCounter";
import IconButton from "../../components/buttons/iconButton";
import TrashIcon from "../../public/icons/trash";
import InputCheckbox from "../../components/inputs/inputCheckbox";
import {useRecoilValue} from "recoil";
import {isAuthed} from "../../states/index.atom";
import ShoppingCartIcon from "../../public/icons/shoppingCart";

export default function ApplyAdress() {
    const [pageLoading, setPageLoading] = useState(true);
    const [user, setUser] = useState({});
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [liveLoading, setLiveLoading] = useState(false);
    const [billingCheck, setBillingCheck] = useState(true);
    const isAuth = useRecoilValue(isAuthed);

    const getUser = () => {
        const token = localStorage.getItem("token");
        if (token) {
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

    useEffect(() => {
        (async () => {
            const cartLength = await getCartLength();

            if (cartLength > 0) {
                getUser();
            } else {
                router.push(PAGE.login.href);
            }
        })();
    }, []);

    const citys = cityDistrict.map((item) => {
        return {title: item.il_adi, value: item.il_adi};
    });

    const onChangeCity = async (e) => {
        const value = e ? e.target.value : user.City;
        const cityValues = citys.map((item) => item.value);
        var selectedIndex = cityValues.indexOf(value);
        const districtsValue = cityDistrict[selectedIndex]?.ilceler.map((item) => {
            return {value: item.ilce_adi, title: item.ilce_adi};
        });
        setDistricts(districtsValue);
    };

    useEffect(() => {
        onChangeCity();
    }, [user]);

    const onApply = async () => {
        setLiveLoading(true);
        // If select same address to ship and billing
        if (billingCheck) {
            const values = getFormValues("ship-form");
            var isErrorGived = false;
            await Object.values(values).map((item) => {
                if (item.length <= 0) {
                    return isErrorGived = true;
                }

            })

            if (!isErrorGived) {
                let newAddress = {
                    City: values.city,
                    District: values.district,
                    Neighborhood: values.neighborhood,
                    Address: values.address,
                    billingCity: values.city,
                    billingDistrict: values.district,
                    billingNeighborhood: values.neighborhood,
                    billingAddress: values.address,

                };

                await putData("/api/member/updateAddress", newAddress).then(() => {

                }).catch(() => {
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Hata!",
                    text: "Lütfen gerekli yerleri doldurunuz.",
                });
            }


        } else {
            const valuesShip = getFormValues("ship-form");
            const valuesBilling = getFormValues("billing-form");
            var isErrorGived = false;
            await Object.values(valuesShip).map((item) => {
                if (item.length <= 0) {
                    return isErrorGived = true;
                }
            });
            await Object.values(valuesBilling).map((item) => {
                if (item.length <= 0) {
                    return isErrorGived = true;
                }
            })

            if (!isErrorGived) {
                let newAddress = {
                    City: valuesShip.city,
                    District: valuesShip.district,
                    Neighborhood: valuesShip.neighborhood,
                    Address: valuesShip.address,
                    billingCity: valuesBilling.city,
                    billingDistrict: valuesBilling.district,
                    billingNeighborhood: valuesBilling.neighborhood,
                    billingAddress: valuesBilling.address,
                };

                await putData("/api/member/updateAddress", newAddress).then(() => {

                }).catch(() => {
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Hata!",
                    text: "Lütfen gerekli yerleri doldurunuz.",
                });
            }
        }
        setLiveLoading(false)
    };

    const onChangeBillingCheckbox = (e) => {
        const value = e.target.checked;
        setBillingCheck(value);
    };

    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <LayoutMain liveLoading={liveLoading} pageLoading={pageLoading}>
                <div className={styles.containerMain}>
                    <div className={styles.container}>
                        <div className={styles.leftContainer}>
                            <Card width="812px" padding="15px">
                                <Divider direction="left">Teslim Adresi</Divider>
                                <div className={styles.cardTop}>
                                    <Form
                                        id="ship-form"

                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            justifyContent: "space-around",
                                        }}
                                    >
                                        <InputText
                                            defaultValue={user.Name + " " + user.Surname || ""}
                                            name="fullName"
                                            labelText="Teslim Alacak Kişi"

                                        />

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

                                        />
                                        <InputTextbox
                                            defaultValue={user.Address || ""}
                                            name="address"
                                            labelText="Adres"
                                            maxWidth="520px"
                                            rows={5}
                                            maxHeight="500px"
                                            height="200px"

                                        />
                                        <InputText
                                            defaultValue={user.PhoneNumber || ""}
                                            name="phoneNumber"
                                            labelText="Telefon Numarası"

                                        />
                                    </Form>
                                </div>
                                <div className={styles.checkboxContainer}>
                                    <InputCheckbox
                                        defaultChecked={true}
                                        onChange={onChangeBillingCheckbox}
                                    />
                                    <span>Kargo adresimle fatura adresim aynı</span>
                                </div>
                                {!billingCheck ? (
                                    <div className={styles.cardBottom}>
                                        <Divider direction="left">Fatura Adresi</Divider>
                                        <Form
                                            id="billing-form"
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                                justifyContent: "space-around",
                                            }}
                                        >
                                            <InputText
                                                defaultValue={user.Name + " " + user.Surname || ""}
                                                name="fullName"
                                                labelText="Teslim Alacak Kişi"
                                            />

                                            <InputSelect
                                                defaultValue={user.billingCity || ""}
                                                options={citys}
                                                name="city"
                                                labelText="İl"
                                                onChange={onChangeCity}
                                                width="325px"
                                                id="cityMyAccount"
                                            />
                                            <InputSelect
                                                defaultValue={user.billingDistrict || ""}
                                                options={districts}
                                                name="district"
                                                labelText="İlçe"
                                                width="325px"
                                                id="districtMyAccount"
                                            />
                                            <InputText
                                                defaultValue={user.billingNeighborhood || ""}
                                                name="neighborhood"
                                                labelText="Mahalle"
                                            />
                                            <InputTextbox
                                                defaultValue={user.billingAddress || ""}
                                                name="address"
                                                labelText="Adres"
                                                pattern="^.{2,}$"
                                                maxWidth="520px"
                                                rows={5}
                                                maxHeight="500px"
                                                height="200px"
                                            />
                                            <InputText
                                                defaultValue={user.PhoneNumber || ""}
                                                name="phoneNumber"
                                                labelText="Telefon Numarası"
                                            />
                                        </Form>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </Card>
                        </div>
                        <div className={styles.spacer}></div>
                        <div className={styles.rightContainer}>
                            <MainColorButton
                                disabled={loading}
                                text="Adresi Onayla"
                                width="260px"
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
