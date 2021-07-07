import Swal from "sweetalert2";
import { postData } from "../api/fetch";

export const addCartWithoutLogin = (product) => {
  const oldCart = localStorage.getItem("cart");
  if (oldCart) {
    const decodedOldCart = JSON.parse(oldCart);
    var cart = [];
    var haveSameItem = false;
    for (var i = 0; i <= decodedOldCart.length - 1; i++) {
      if (decodedOldCart[i].productId === product.productId) {
        haveSameItem = true;
        cart.push({
          productId: product.productId,
          count: decodedOldCart[i].count + product.count,
        });
      } else {
        cart.push(decodedOldCart[i]);
      }
    }
    const newCart = haveSameItem ? cart : [...cart, product];
    Swal.fire({
      timer: 1500,
      timerProgressBar: true,
      icon: "success",
      title: "Başarılı!",
      text: "Ürün sepete eklendi.",
    });
    return localStorage.setItem("cart", JSON.stringify(newCart));
  }
  const newCart = [product];
  return localStorage.setItem("cart", JSON.stringify(newCart));
};

export const addCartWithLogin = async (product) => {
  var res = false;
  await postData("/api/cart/addItem", product)
    .then(() => {
      Swal.fire({
        timer: 1500,
        timerProgressBar: true,
        icon: "success",
        title: "Başarılı!",
        text: "Ürün sepete eklendi.",
      });
      return (res = true);
    })
    .catch(() => {
      Swal.fire({
        timer: 1500,
        timerProgressBar: true,
        icon: "error",
        title: "Hata!",
        text: "Ürün sepete eklenirken hata oluştu lütfen tekrar deneyiniz.",
      });
      return (res = false);
    });
  return res;
};

export const addCart = (product, authed) => {
  if (authed) {
    return addCartWithLogin(product);
  } else {
    return addCartWithoutLogin(product);
  }
};
