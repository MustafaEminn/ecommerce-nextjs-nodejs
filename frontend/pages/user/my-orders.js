import Head from "next/head";
import styles from "../../styles/pages/user/myOrders.module.scss";
import { API, PAGE } from "../../constants";
import Divider from "../../components/divider/divider";
import { getData, putData } from "../../api/fetch";
import { useEffect, useState } from "react";
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

export default function MyOrders() {
  const [pageLoading, setPageLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    if (localStorage.getItem("token")) {
      await getData("/api/order/getOrders")
        .then((res) => {
          setOrders(res.data.orders);
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

  useEffect(() => {
    (async () => {
      await getOrders();
      console.log(orders);
    })();
  }, []);
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LayoutSidebar pageLoading={pageLoading}>
        <div className={styles.container}>
          <Card width="100%"></Card>
        </div>
      </LayoutSidebar>
    </div>
  );
}
