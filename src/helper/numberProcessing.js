export const number_processing = (point) => {
  // đang để max là 99999999:
  if (!point) return 0;
  else if (point.toString().length === 8) {
    return point.toString().slice(0, 3) / 10 + "M";
  } else if (point.toString().length === 7) {
    return point.toString().slice(0, 2) / 10 + "M";
  } else if (point.toString().length === 6) {
    return point.toString().slice(0, 3) + "K";
  } else if (point.toString().length === 5) {
    return point.toString().slice(0, 3) / 10 + "K";
  } else if (point.toString().length === 4) {
    return point.toString().slice(0, 1) + "K";
  } else {
    return point.toString();
  }
};
