import React, { memo, useEffect, useState } from "react";
import RangeDatePicker from "../datePicker/RangeDatePicker";
import { Input, Select } from "antd";
import i18n from "../../i18n";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../redux/selectors/auth";
import moment from "moment";
import "./index.scss";
import InputTextCustom from "../inputCustom";

const FilterData = (props) => {
  const {
    isTimeFilter,
    setTimePeriod,
    leftContent,
    rightContent,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  } = props;
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("")

  const toIsoString = (date) => {
    var tzo = -date?.getTimezoneOffset(),
      dif = tzo >= 0 ? "+" : "-",
      pad = function (num) {
        return (num < 10 ? "0" : "") + num;
      };

    return date.toISOString();
  };

  const toEndOfDayIsoString = (date) => {
    var tzo = -date?.getTimezoneOffset(),
      dif = tzo >= 0 ? "+" : "-",
      pad = function (num) {
        return (num < 10 ? "0" : "") + num;
      };

    // Set hours, minutes, seconds, and milliseconds to the end of the day
    date?.setHours(23);
    date?.setMinutes(59);
    date?.setSeconds(59);
    date?.setMilliseconds(999);

    return date.toISOString();
  };

  const handleCountMonth = (start, end) => {
    let months = [];
    if (start && end) {
      let currentForStartDate = moment(start).startOf("month"); // Bắt đầu từ đầu tháng của startDate
      let currentForEndDate = moment(start).startOf("month");

      // Vòng lặp qua từng tháng cho đến khi qua endDate
      while (
        currentForStartDate.isBefore(end) ||
        currentForStartDate.isSame(end, "month") ||
        currentForEndDate.isBefore(end) ||
        currentForEndDate.isSame(end, "month")
      ) {
        // Kiểm tra tháng hiện tại có phải là tháng bắt đầu hoặc tháng kết thúc
        const startOfMonth = currentForStartDate.isSame(start, "month")
          ? start
          : currentForStartDate.startOf("month");
        const endOfMonth = currentForEndDate.isSame(end, "month")
          ? end
          : currentForEndDate.endOf("month");

        // Thêm vào mảng dưới dạng đối tượng
        months.push({
          startOfMonth: toIsoString(startOfMonth._d),
          endOfMonth: toEndOfDayIsoString(endOfMonth._d),
          month: currentForStartDate.format("M"),
          year: currentForStartDate.format("YYYY"),
        });

        // Chuyển sang tháng tiếp theo
        currentForStartDate.add(1, "month").startOf("month");
        currentForEndDate.add(1, "month").startOf("month");
      }
      setTimePeriod(months);
    }
  };

  useEffect(() => {
    if (isTimeFilter && setTimePeriod) {
      handleCountMonth(moment(startDate), moment(endDate));
    }
  }, [startDate, endDate]);


  return (
    <div className="filter-data card-shadow">
      {/* Nội dung bên trái */}
      <div className="filter-data__left">
        {isTimeFilter && (
          <div className="filter-data__left--date-time-picker">
            <div className="filter-data__left--date-time-picker-label">
              <RangeDatePicker
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                onCancel={() => {}}
                rangeDateDefaults={"thirty_last"}
              />
            </div>
          </div>
        )}
        {leftContent && <div>{leftContent}</div>}
      </div>
      {/* Nội dung bên phải */}
      <div className="filter-data__right">{rightContent}</div>
    </div>
  );
};

export default memo(FilterData);
