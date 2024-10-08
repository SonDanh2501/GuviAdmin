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
  const { setTimePeriod} = props;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

    const toIsoString = (date) => {
    var tzo = -date?.getTimezoneOffset(),
      dif = tzo >= 0 ? "+" : "-",
      pad = function (num) {
        return (num < 10 ? "0" : "") + num;
      };
  
    return date.toISOString();
    // date?.getFullYear() +
    // "-" +
    // pad(date?.getMonth() + 1) +
    // "-" +
    // pad(date?.getDate()) +
    // "T" +
    // pad(date?.getHours()) +
    // ":" +
    // pad(date?.getMinutes()) +
    // ":" +
    // pad(date?.getSeconds())
    //  + dif +
    // pad(Math.floor(Math.abs(tzo) / 60)) +
    // ":" +
    // pad(Math.abs(tzo) % 60)
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
    // date?.getFullYear() +
    // "-" +
    // pad(date?.getMonth() + 1) +
    // "-" +
    // pad(date?.getDate()) +
    // "T" +
    // pad(date?.getHours()) +
    // ":" +
    // pad(date?.getMinutes()) +
    // ":" +
    // pad(date?.getSeconds())
    // + dif +
    // pad(Math.floor(Math.abs(tzo) / 60)) +
    // ":" +
    // pad(Math.abs(tzo) % 60)
  };

  const handleCountMonth = (start, end) => {
    let months = [];
    if (start && end) {
      let currentForStartDate = moment(start).startOf('month'); // Bắt đầu từ đầu tháng của startDate
      let currentForEndDate = moment(start).startOf('month'); 
  
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
    handleCountMonth(moment(startDate), moment(endDate));
    // setCurrentMonth(moment(startDate).startOf("month"));
  }, [startDate, endDate]);

  return (
    <div className="filter-data card-shadow">
      <div className="filter-data__left">
        {/* Lịch */}
        <div className="filter-data__left--date-time-picker">
          <span>Khoảng thời gian</span>
          <div className="filter-data__left--date-time-picker-label">
            <RangeDatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onCancel={() => {}}
              rangeDateDefaults={"last_ninety"}
            />
            <div className="filter-data__left--date-time-picker-label-period-time">
              <span className="filter-data__left--date-time-picker-label-period-time-sub">
                Mốc chọn:
              </span>
              <span className="filter-data__left--date-time-picker-label-period-time-main">
                {moment(startDate).format("DD/MM/YYYY")} -{" "}
                {moment(endDate).format("DD/MM/YYYY")}
              </span>
            </div>
          </div>
        </div>
        {/* Bộ lọc */}
        {/* <div className="filter-data__left--data-filter-option">
          <span className="font-bold">Đánh giá</span>
          <div className="">
            {/* <Select
              // value={star}
              // style={{ width: width <= 490 ? "100%" : "18%" }}
              // onChange={handleFilter}
              style={{ width: "100%" }}
              options={[
                { value: 0, label: `1 ` },
                { value: 5, label: `5 ` },
                { value: 4, label: `4 ` },
                { value: 3, label: `3 ` },
                { value: 2, label: `2 ` },
                { value: 1, label: `1 ` },
              ]}
              defaultValue={"Tất cả"}
            /> 
            <InputTextCustom
              type="select"
              // value={gender}
              // placeHolder="Giới tính"
              // setValueSelectedProps={setGender}
              options={[
                {
                  code: "other",
                  label: `Nam`,
                },
                {
                  code: "male",
                  label: `Nu`,
                },
                {
                  code: "female",
                  label: `Khac`,
                },
              ]}
            />
            { <RangeDatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onCancel={() => {}}
              defaults={"thirty_last"}
            /> 
          </div>
        </div> */}
      </div>
      {/* Tìm kiếm  */}
      {/* <div className="w-1/4 flex flex-col gap-1">
        <div>
          <span className="font-bold">Tìm kiếm</span>
        </div>
        <div className="">
          <Input
          // placeholder={`${i18n.t("search", { lng: lang })}`}
          // value={valueSearch}
          // prefix={<SearchOutlined />}
          // className="input-search"
          // onChange={(e) => {
          //   handleSearch(e.target.value);
          //   setValueSearch(e.target.value);
          // }}
          />
        </div>
      </div> */}
    </div>
  );
};

export default memo(FilterData);
