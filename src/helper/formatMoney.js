export const formatMoney = (number) => {
  const result = (number) ? number?.toString()?.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " đ" : "0 đ"
  return result;
};
