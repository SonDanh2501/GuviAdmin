import { number } from "yup";

export const formatMoney = (number) => {
  const result = number
    ? number?.toString()?.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " đ"
    : "0 đ";
  return result;
};

export const formatNumber = (number) => {
  if (number === "0" || number === 0) {
    return 0;
  }
  // Xóa các ký tự không phải số và loại bỏ số 0 ở đầu
  number = number?.toString()?.replace(/\D/g, "").replace(/^0+/, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const formatCardNumber = (number) => {
  if (number === undefined || number === null) {
    return "";
  }
  const str = number.toString();
  const regex = /\d{3}(?=\d{3})/g;
  return str.replace(regex, '$& ');
}

export const clearFormatNumber = (number) => {
  if (number === "0" || number === 0) {
    return 0;
  }
  // Xóa các ký tự không phải số và loại bỏ số 0 ở đầu
  number = number?.toString()?.replace(/\D/g, "").replace(/^0+/, "");
  return Number(number);
};
