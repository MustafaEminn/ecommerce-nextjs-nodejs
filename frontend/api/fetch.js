import axios from "axios";
import { API } from "../constants";

export const getData = (url, config, auth = false) => {
  return axios.get(API.url + url, {
    headers: {
      Authorization: auth ? `Bearer ${localStorage.getItem("token")}` : "",
      "Content-Type": "application/json",
    },
    ...config,
  });
};

export const postData = (url, data, config, auth = false) => {
  return axios.post(API.url + url, data, {
    headers: {
      Authorization: auth ? `Bearer ${localStorage.getItem("token")}` : "",
      "Content-Type": "application/json",
    },
    ...config,
  });
};

export const putData = (url, data, config, auth = false) => {
  return axios.put(API.url + url, data, {
    headers: {
      Authorization: auth ? `Bearer ${localStorage.getItem("token")}` : "",
      "Content-Type": "application/json",
    },
    ...config,
  });
};

export const deleteData = (url, config, auth = false) => {
  return axios.delete(API.url + url, {
    headers: {
      Authorization: auth ? `Bearer ${localStorage.getItem("token")}` : "",
      "Content-Type": "application/json",
    },
    ...config,
  });
};
