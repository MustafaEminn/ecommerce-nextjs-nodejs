import { getData } from "./fetch";

export const checkAuth = () => {
  let isAuthed = false;
  getData("/api/auth/checkAuth").then(() => {
    isAuthed = true;
  });
  return isAuthed;
};
