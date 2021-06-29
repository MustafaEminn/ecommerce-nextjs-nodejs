import axios from "axios";
import { API } from "../constants";

export const getData = (url, config) => {
  return axios.get(API.url + url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    ...config,
  });
};

export const postFormData = (url, data, config) => {
  return axios.post(API.url + url, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
    ...config,
  });
};

export const postData = (url, data, config) => {
  return axios.post(API.url + url, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    ...config,
  });
};

export const putData = (url, data, config) => {
  return axios.put(API.url + url, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    ...config,
  });
};

export const deleteData = (url, config) => {
  return axios.delete(API.url + url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    ...config,
  });
};
