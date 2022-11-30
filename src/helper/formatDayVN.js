export const formatDayVN = function (time) {
  var a = new Date(time).toString().split(/\s/);
  return {
    Mon: "Thứ hai",
    Tue: "Thứ ba",
    Wed: "Thứ tư",
    Thu: "Thứ năm",
    Fri: "Thứ sáu",
    Sat: "Thứ bảy",
    Sun: "Chủ nhật",
  }[a[0]];
};
