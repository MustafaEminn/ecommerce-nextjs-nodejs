import axios from "axios";
import { API } from "../constants";

export const getData = async (url, config, auth = false) => {
  await axios.get(API.url + url, {
    headers: {
      Authorization: auth ? `Bearer ${localStorage.getItem("token")}` : "",
      "Content-Type": "application/json",
    },
    ...config,
  });
};

export const postData = async (url, data, config, auth = false) => {
  await axios.post(API.url + url, data, {
    headers: {
      Authorization: auth ? `Bearer ${localStorage.getItem("token")}` : "",
      "Content-Type": "application/json",
    },
    ...config,
  });
};

export const putData = async (url, data, config, auth = false) => {
  await axios.put(API.url + url, data, {
    headers: {
      Authorization: auth ? `Bearer ${localStorage.getItem("token")}` : "",
      "Content-Type": "application/json",
    },
    ...config,
  });
};

export const deleteData = async (url, config, auth = false) => {
  await axios.delete(API.url + url, {
    headers: {
      Authorization: auth ? `Bearer ${localStorage.getItem("token")}` : "",
      "Content-Type": "application/json",
    },
    ...config,
  });
};
