export const randomNumber = (min = 1, max = 10) => {
  return Math.floor(Math.random() * max) + min;
};
