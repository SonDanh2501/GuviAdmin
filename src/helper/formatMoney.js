export const formatMoney = (number) => {
  return number?.toString()?.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " đ";
};
