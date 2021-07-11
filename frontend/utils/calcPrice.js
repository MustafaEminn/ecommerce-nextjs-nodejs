export const calcPrice = (price, count) => {
  if (count <= 200) {
    return (Number(price) * (Number(count) / 50) + 30).toFixed(2);
  }

  return (Number(price) * (Number(count) / 50)).toFixed(2);
};
