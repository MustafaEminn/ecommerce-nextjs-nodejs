export const API_URL = "http://localhost:8085";

export const checkErrorIsAuth = (err) => {
  if (err.response.status === 401) {
    return true;
  } else {
    return false;
  }
};
