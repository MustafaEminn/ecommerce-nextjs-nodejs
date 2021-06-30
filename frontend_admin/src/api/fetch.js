import axios from "axios";
import { API_URL } from "../API";

export const getData = (url, config) => {
  return axios.get(API_URL + url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    ...config,
  });
};

export const postFormData = (url, data, config) => {
  return axios.post(API_URL + url, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
    ...config,
  });
};

export const postData = (url, data, config) => {
  return axios.post(API_URL + url, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    ...config,
  });
};

export const putData = (url, data, config) => {
  return axios.put(API_URL + url, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    ...config,
  });
};

export const deleteData = (url, config) => {
  return axios.delete(API_URL + url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    ...config,
  });
};
