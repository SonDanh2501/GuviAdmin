import { Button } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../redux/selectors/auth";
import i18n from "../../../i18n";

import "./index.scss";
import useWindowDimensions from "../../../helper/useWindowDimensions";

const RangeDatePicker = (props) => {
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);
  const {
    setStartDate,
    setEndDate,
    rangeDateDefaults,
    rangeDatePrevious,
    disableFutureDay,
  } = props;
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState("");
  const [previousDate, setPreviousDate] = useState([]);
  const [end, setEnd] = useState("");
  const [startCalendar, setStartCalendar] = useState("");
  const [endCalendar, setEndCalendar] = useState("");
  const [lastTermStartCalendar, setLastTermStartCalendar] = useState("");
  const [lastTermEndCalendar, setLastTermEndCalendar] = useState("");

  const [valueTab, setValueTab] = useState("");
  const [tabTime, setTabTime] = useState("days");
  const [title, setTitle] = useState("");
  const [typeView, setTypeView] = useState("month");
  const [tempTypeView, setTempTypeView] = useState("month");
  const [selectedMonths, setSelectedMonths] = useState([]);

  const timeZone = 0;

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
  useEffect(() => {
    // var lenghtDaySelectedConvert;
    // Nếu truyền vào rangeDateDefaults (30 ngày trước)
    if (rangeDateDefaults) {
      // Nếu rangeDateDefaults là mảng
      if (Array.isArray(rangeDateDefaults) === true) {
        setValueTab(DATA_TAB[DATA_TAB.length - 1].value);
        setTitle(
          `${i18n.t(DATA_TAB[DATA_TAB.length - 1].title, { lng: lang })}`
        );
        setStart(rangeDateDefaults[0]);
        setEnd(rangeDateDefaults[1]);
        setStartCalendar(rangeDateDefaults[0]);
        setEndCalendar(rangeDateDefaults[1]);
        setStartDate(toIsoString(rangeDateDefaults[0]._d));
        setEndDate(toEndOfDayIsoString(rangeDateDefaults[1]._d));
      } else {
        // Tìm giá trị trong các option có value tương ứng rangeDateDefaults
        const item = DATA_TAB.find((x) => x.value === rangeDateDefaults);
        // Nếu có thì tính
        if (item) {
          const { startDate, endDate } = calculateRangeDate(
            item.range,
            item.type_range
          );
          setStart(startDate);
          setEnd(endDate);
          setStartCalendar(startDate);
          setEndCalendar(endDate);
          // setStartDate(startDate.toISOString());
          // setEndDate(endDate.toISOString());
          setStartDate(toIsoString(startDate._d));
          setEndDate(toEndOfDayIsoString(endDate._d));
          setTitle(`${i18n.t(item.title, { lng: lang })}`);
          setValueTab(item.value);
          calculateRangeDateLastTerm(
            startDate.diff(endDate, item.type_range),
            item,
            caculateLenghtDayUntilNow(startDate)
          );
        }
      }
    } else {
      // Tìm giá trị trong các option có value tương ứng rangeDateDefaults
      const item = DATA_TAB[3];
      // Nếu có thì tính
      const { startDate, endDate } = calculateRangeDate(
        item.range,
        item.type_range
      );
      setStart(startDate);
      setEnd(endDate);
      setStartCalendar(startDate);
      setEndCalendar(endDate);
      // setStartDate(startDate.toISOString());
      // setEndDate(endDate.toISOString());
      setStartDate(toIsoString(startDate._d));
      setEndDate(toEndOfDayIsoString(endDate._d));

      setTitle(`${i18n.t(item.title, { lng: lang })}`);
      setValueTab(item.value);
      calculateRangeDateLastTerm(
        startDate.diff(endDate, item.type_range),
        item,
        caculateLenghtDayUntilNow(startDate)
      );
    }
  }, []);

  {
    /*Hàm tính số ngày tính từ ngày truyền vào đến ngày hiện tại*/
  }
  const caculateLenghtDayUntilNow = (startDate) => {
    const today = moment().startOf("day");
    const lenghtDayUntilNow = startDate.diff(today, "days") * -1;
    return lenghtDayUntilNow;
  };

  {
    /*Hàm apply filter mới*/
  }
  const handleOk = () => {
    setOpen(false);
    if (start._d) {
      setStartDate(toIsoString(start._d));
    } else {
      setStartDate(toIsoString(start));
    }
    if (end._d) {
      setEndDate(toEndOfDayIsoString(end._d));
    } else {
      setEndDate(toEndOfDayIsoString(end));
    }
  };

  {
    /*Hàm cancel*/
  }
  const handleCancel = () => {
    setOpen(false);
  };

  {
    /*Hàm select các tab ngày, tháng, năm*/
  }
  const onSelectTypeTime = (item) => {
    if (item.value === "days") {
      setTypeView("month");
      setTempTypeView("month");
    } else {
      if (item.value === "months") {
        setTypeView("year");
        setTempTypeView("year");
        // reset giá trị calendar để giao diện không bị bug
        // setStartCalendar("");
        // setEndCalendar("");
        // setPreviousDate([])
      }
      if (item.value === "years") {
        setTypeView("decade");
        setTempTypeView("decade");
        // setStartCalendar("");
        // setEndCalendar("");
        // setPreviousDate([])
      }
    }
    setTabTime(item?.value);
  };

  const onChange = (value, event) => {
    // setValueTab("setting")
    setStartCalendar(value[0]);
    setEndCalendar(value[1]);
    setStart(value[0]);
    setEnd(value[1]);
    setTitle(`${i18n.t(DATA_TAB[DATA_TAB.length - 1].title, { lng: lang })}`);
    // Thống kê theo ngày
    if (value[0].setHours(0, 0, 0, 0) == value[1].setHours(0, 0, 0, 0)) {
      calculateRangeDateLastTerm(
        0,
        tabTime,
        caculateLenghtDayUntilNow(moment(value[1])),
        caculateLenghtDayUntilNow(moment(value[1]))
      );
    }
    // Thống kê nhiều ngày
    else {
      calculateRangeDateLastTerm(
        moment(value[0]).diff(moment(value[1]), "days"),
        tabTime,
        caculateLenghtDayUntilNow(moment(value[1])),
        caculateLenghtDayUntilNow(moment(value[1]))
      );
    }
  };

  {
    /*Hàm select các tab thống kê nhanh (7 ngày trước, 30 ngày trước, etc..)*/
  }
  const onSelectTab = (item) => {
    //  Reset view of calendar
    setTabTime("days");
    setTypeView("month");

    setValueTab(item.value);
    if (item.type_range === "setting") {
      if (tempTypeView === "month") {
        setTabTime("days");
      }
      if (tempTypeView === "year") {
        setTabTime("months");
      }
      if (tempTypeView === "decade") {
        setTabTime("years");
      }
      setTypeView(tempTypeView);
    } else {
      const { startDate, endDate } = calculateRangeDate(
        item.range,
        item.type_range
      );
      setStart(startDate);
      setEnd(endDate);
      setStartCalendar(new Date(startDate));
      setEndCalendar(new Date(endDate));
      // Thống kê trong một ngày
      if (
        startDate._d.setHours(0, 0, 0, 0) == endDate._d.setHours(0, 0, 0, 0)
      ) {
        calculateRangeDateLastTerm(0, item, caculateLenghtDayUntilNow(endDate));
      } // Thống kê hơn 1 ngày trở lên
      else {
        calculateRangeDateLastTerm(
          startDate.diff(endDate, "days"),
          item,
          caculateLenghtDayUntilNow(startDate)
        );
      }
    }
  };

  {
    /*Hàm tính số ngày của kì trước*/
  }
  const calculateRangeDateLastTerm = (
    lengthDaySelected,
    item,
    lengthToCurrent,
    lengthDayToCurrent,
    selectedMonths
  ) => {
    // lengthDaySelected số ngày tính từ ngày hiện tại đến ngày cuối cùng của khoảng tg đã chọn
    // lengthToCurrent và lengthDayToCurrent về mặc cơ bản là giống nhau nếu item.type_range === "days"
    // Chỉ khác nhau khi item.type_range === "months" => lengthToCurrent (thống kê theo tháng) lengthDayToCurrent(thống kê theo ngày)
    // lengthToCurrent (thống kế từ ngày hiện tại đến ngày kết thúc trên lịch theo item.type_range)

    // Temporary array to store previous dates
    let previousDateTemp = [];

    // Total days calculation variables
    let lengthDaySelectedConvert;
    let lengthDayFinal;

    // Restructure the item if needed
    if (!item.type_range) {
      item = { type_range: item };
    }

    // Convert lengthDaySelected for past days (lengthDaySelected < 0)
    if (item.type_range === "days") {
      if (lengthDaySelected < 0) {
        lengthDaySelectedConvert = (-lengthDaySelected + 1) * 2;
      } else if (lengthDaySelected > 0) {
        lengthDaySelectedConvert = (lengthDaySelected + 1) * 2;
      } else {
        lengthDaySelectedConvert = lengthDaySelected + 1;
      }
    } else if (item.type_range === "months" && selectedMonths?.length < 2) {
      if (lengthDaySelected < 0) {
        lengthDaySelectedConvert = (-lengthDaySelected + 1) * 2;
      } else if (lengthDaySelected > 0) {
        lengthDaySelectedConvert = (lengthDaySelected + 1) * 2;
      } else {
        lengthDaySelectedConvert = lengthDaySelected + 1;
      }
    } else if (item.type_range === "months" && selectedMonths?.length >= 2) {
      if (lengthDaySelected < 0) {
        lengthDaySelectedConvert = (-lengthDaySelected + 1) * 2;
      } else if (lengthDaySelected > 0) {
        lengthDaySelectedConvert = (lengthDaySelected + 1) * 2;
      } else {
        lengthDaySelectedConvert = lengthDaySelected + 1;
      }
    } else if (item.type_range === "years") {
      if (lengthDaySelected < 0) {
        lengthDaySelectedConvert = (-lengthDaySelected + 1) * 2;
      } else if (lengthDaySelected > 0) {
        lengthDaySelectedConvert = (lengthDaySelected + 1) * 2;
      } else {
        lengthDaySelectedConvert = lengthDaySelected + 1;
      }
    }

    // Calculate the final length of days including the current length
    if (item.type_range === "days") {
      if (!lengthDayToCurrent) {
        lengthDayFinal = lengthDaySelectedConvert;
      } else {
        lengthDayFinal = lengthDayToCurrent + lengthDaySelectedConvert - 1;
      }
    } else if (item.type_range === "months") {
      if (!lengthDayToCurrent) {
        lengthDayFinal = lengthDaySelectedConvert;
      } else {
        lengthDayFinal = lengthDayToCurrent + lengthDaySelectedConvert - 1;
      }
    } else if (item.type_range === "years") {
      if (!lengthDayToCurrent) {
        lengthDayFinal = lengthDaySelectedConvert;
      } else {
        lengthDayFinal = lengthDayToCurrent + lengthDaySelectedConvert - 1;
      }
    }

    if (item.type_range === "days") {
      // Handle day-wise calculations
      if (lengthDaySelectedConvert === 1) {
        // Special case for today or yesterday
        if (item?.value === "today") {
          //
          var previousDay = moment()
            .subtract(1, item.type_range)
            .format("DD-MM-YYYY");
          previousDateTemp.push(previousDay);
        } else if (item?.value === "yesterday") {
          //
          var previousDay = moment()
            .subtract(2, item.type_range)
            .format("DD-MM-YYYY");
          previousDateTemp.push(previousDay);
        } else {
          //
          var previousDay = moment()
            .subtract(lengthDayToCurrent + 1, item.type_range)
            .format("DD-MM-YYYY");
          previousDateTemp.push(previousDay);
          //
        }
        setPreviousDate(previousDateTemp);
      } else {
        // General case for day-wise calculations
        const start = lengthDayToCurrent
          ? lengthDayToCurrent + lengthDaySelectedConvert / 2
          : lengthDaySelectedConvert / 2;
        //

        for (let i = start; i <= lengthDayFinal - 1; i++) {
          var previousDay = moment()
            .subtract(i, item.type_range)
            .format("DD-MM-YYYY");
          previousDateTemp.push(previousDay);
        }
        setPreviousDate(previousDateTemp);
      }
    } else if (item.type_range === "months") {
      // Handle month-wise calculations
      if (item.value === "this_month") {
        var previousMonth = moment()
          .subtract(1, item.type_range)
          .format("YYYY-MM");
        var daysInMonth = moment(previousMonth, "YYYY-MM").daysInMonth();
        for (
          let i = lengthToCurrent + 1;
          i < daysInMonth + lengthToCurrent + 1;
          i++
        ) {
          var previousDay = moment().subtract(i, "days").format("DD-MM-YYYY");
          previousDateTemp.push(previousDay);
        }
        setPreviousDate(previousDateTemp);
      } else if (item.value === "last_month") {
        var previousMonth = moment()
          .subtract(2, item.type_range)
          .format("YYYY-MM");
        var daysInMonth = moment(previousMonth, "YYYY-MM").daysInMonth();
        for (
          let i = lengthToCurrent + 1;
          i < daysInMonth + lengthToCurrent + 1;
          i++
        ) {
          var previousDay = moment().subtract(i, "days").format("DD-MM-YYYY");
          previousDateTemp.push(previousDay);
        }
        setPreviousDate(previousDateTemp);
      } else {
        if (selectedMonths?.length <= 1) {
          // Handle the case with only one month selected
          var previousMonth = moment()
            .subtract(lengthToCurrent + 1, item.type_range)
            .format("YYYY-MM");
          var daysInMonth = moment(previousMonth, "YYYY-MM").daysInMonth();
          for (
            let i = lengthDayToCurrent + lengthDaySelectedConvert / 2;
            i < daysInMonth + lengthDayToCurrent + lengthDaySelectedConvert / 2;
            i++
          ) {
            var previousDay = moment().subtract(i, "days").format("DD-MM-YYYY");
            previousDateTemp.push(previousDay);
          }
          //
          // setPreviousDate(previousDateTemp);
        } else {
          setPreviousDate([]); // Reset last term
          // Handle the case with multiple months selected
          let tempPreviousDayMonthSelected = 0;
          for (let i = 1; i <= selectedMonths.length; i++) {
            var previousMonth = moment()
              .subtract(lengthToCurrent + i, item.type_range)
              .format("YYYY-MM");
            var daysInMonth = moment(previousMonth, "YYYY-MM").daysInMonth();
            tempPreviousDayMonthSelected += daysInMonth;
          }
          for (
            let i = lengthDayToCurrent + lengthDaySelectedConvert / 2;
            i <
            tempPreviousDayMonthSelected +
              lengthDayToCurrent +
              lengthDaySelectedConvert / 2;
            i++
          ) {
            var previousDay = moment().subtract(i, "days").format("DD-MM-YYYY");
            previousDateTemp.push(previousDay);
          }
          // setLastTermStartCalendar(previousDateTemp[previousDateTemp.length - 1]);
          // setLastTermEndCalendar(previousDateTemp[0]);
          // setPreviousDate(previousDateTemp);
        }
        // setLastTermStartCalendar(previousDateTemp[previousDateTemp.length - 1]);
        // setLastTermEndCalendar(previousDateTemp[0]);
        setPreviousDate(previousDateTemp);
      }
    } else if (item.type_range === "years") {
      setPreviousDate([]); // Reset last term
      // Handle the case with multiple months selected
      let tempPreviousDayMonthSelected = 0;
      for (let i = 1; i <= selectedMonths.length; i++) {
        var previousMonth = moment()
          .subtract(lengthToCurrent + i, "months")
          .format("YYYY-MM");
        var daysInMonth = moment(previousMonth, "YYYY-MM").daysInMonth();
        tempPreviousDayMonthSelected += daysInMonth;
      }
      for (
        let i = lengthDayToCurrent + lengthDaySelectedConvert / 2;
        i <
        tempPreviousDayMonthSelected +
          lengthDayToCurrent +
          lengthDaySelectedConvert / 2;
        i++
      ) {
        var previousDay = moment().subtract(i, "days").format("DD-MM-YYYY");
        previousDateTemp.push(previousDay);
      }
      // setLastTermStartCalendar(previousDateTemp[previousDateTemp.length - 1]);
      // setLastTermEndCalendar(previousDateTemp[0]);
      setPreviousDate(previousDateTemp);
    }
    setLastTermStartCalendar(previousDateTemp[previousDateTemp.length - 1]);
    setLastTermEndCalendar(previousDateTemp[0]);

    // if (rangeDatePrevious) {
    //   setStartDateLastTerm((previousDateTemp[previousDateTemp.length - 1]))
    //   setStartDateLastTerm(previousDateTemp[0]);
    // }
  };

  {
    /*Hàm tính số tháng tính từ tháng được chọn đến tháng hiện tại*/
  }
  const calculateMonthsDifference = (selectedDate) => {
    const currentDate = new Date();
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    // Tính số tháng từ tháng được chọn đến tháng hiện tại
    const months =
      (currentYear - selectedYear) * 12 + (currentMonth - selectedMonth);

    return months;
  };

  {
    /*Hàm tìm ngày kết thúc và bắt đầu (dành cho các option thống kê nhanh) */
  }
  const calculateRangeDate = (rangeDate, typeRange) => {
    const startDate = moment()
      .subtract(rangeDate[0], typeRange)
      .startOf(typeRange)
      .startOf("days");
    const endDate = moment()
      .subtract(rangeDate[1], typeRange)
      .endOf(typeRange)
      .endOf("days");
    return { startDate, endDate };
  };

  {
    /*Hàm chuyển sang tab setting nếu người dùng chọn ngày custom trong lịch*/
  }
  const handleDayChange = (value, event) => {
    setValueTab("setting");
  };

  {
    /*Hàm tính toán cho chế độ view là month*/
  }
  const handleMonthChange = (value) => {
    const monthYear = `${value.getMonth() + 1}/${value.getFullYear()}`;

    let updatedMonths;

    if (selectedMonths.includes(monthYear)) {
      // viết lại trường hợp có tháng trong list
      //
      updatedMonths = selectedMonths.filter((m) => m === monthYear);
    } else {
      updatedMonths = [...selectedMonths, monthYear];
    }

    // Sort the months in the array
    const sortedMonths = updatedMonths.sort((a, b) => {
      return moment(a, "M/YYYY").toDate() - moment(b, "M/YYYY").toDate();
    });

    // Add months that lie between the first and last selected months
    if (sortedMonths.length > 1) {
      const startMonth = moment(sortedMonths[0], "M/YYYY");
      const endMonth = moment(sortedMonths[sortedMonths.length - 1], "M/YYYY");

      let currentMonth = startMonth.clone().add(1, "month");
      while (currentMonth.isBefore(endMonth)) {
        const currentMonthYear = `${
          currentMonth.month() + 1
        }/${currentMonth.year()}`;
        if (!sortedMonths.includes(currentMonthYear)) {
          sortedMonths.push(currentMonthYear);
        }
        currentMonth.add(1, "month");
      }

      sortedMonths.sort(
        (a, b) => moment(a, "M/YYYY").toDate() - moment(b, "M/YYYY").toDate()
      );
    }

    if (sortedMonths.length <= 1) {
      const startOfMonth = new Date(value.getFullYear(), value.getMonth(), 1);
      const endOfMonth = new Date(value.getFullYear(), value.getMonth() + 1, 0);
      //
      //
      setStart(moment(startOfMonth));
      setEnd(moment(endOfMonth));
      setStartCalendar(moment(startOfMonth));
      setEndCalendar(moment(endOfMonth));
      calculateRangeDateLastTerm(
        moment(startOfMonth).diff(moment(endOfMonth), "days"),
        tabTime,
        calculateMonthsDifference(endOfMonth),
        caculateLenghtDayUntilNow(moment(endOfMonth)),
        sortedMonths
      );
    } else {
      const startOfMonth = moment(sortedMonths[0], "M/YYYY")
        .startOf("month")
        .format("YYYY-MM-DD");
      const endOfMonth = moment(sortedMonths[sortedMonths.length - 1], "M/YYYY")
        .endOf("month")
        .format("YYYY-MM-DD");
      setStart(moment(startOfMonth));
      setEnd(moment(endOfMonth));
      setStartCalendar(moment(startOfMonth));
      setEndCalendar(moment(endOfMonth));
      calculateRangeDateLastTerm(
        moment(startOfMonth).diff(moment(endOfMonth), "days"),
        tabTime,
        calculateMonthsDifference(moment(startOfMonth)._d),
        caculateLenghtDayUntilNow(moment(endOfMonth)),
        sortedMonths
      );
    }
    setSelectedMonths(sortedMonths);
  };

  const handleYearChange = (value) => {
    let months = [];
    for (let month = 0; month < 12; month++) {
      let firstDayOfMonth = moment()
        .year(value.getFullYear())
        .month(month)
        .startOf("month")
        .format("YYYY-MM");
      months.push(firstDayOfMonth);
    }
    // Sort the months in the array
    const sortedMonths = months.sort((a, b) => {
      return moment(a, "M/YYYY").toDate() - moment(b, "M/YYYY").toDate();
    });
    const firstDayOfSpecificYear = moment()
      .year(value.getFullYear())
      .startOf("year")
      .format("YYYY-MM-DD");
    const endDayOfSpecificYear = moment()
      .year(value.getFullYear())
      .endOf("year")
      .format("YYYY-MM-DD");
    setStart(moment(firstDayOfSpecificYear));
    setEnd(moment(endDayOfSpecificYear));
    setStartCalendar(moment(firstDayOfSpecificYear));
    setEndCalendar(moment(endDayOfSpecificYear));
    calculateRangeDateLastTerm(
      moment(firstDayOfSpecificYear).diff(moment(endDayOfSpecificYear), "days"),
      tabTime,
      calculateMonthsDifference(moment(firstDayOfSpecificYear)._d),
      caculateLenghtDayUntilNow(moment(endDayOfSpecificYear)),
      sortedMonths
    );
    setSelectedMonths(sortedMonths);
  };

  //
  //

  return (
    <div>
      <div>
        <div className="btn-date-picker" onClick={() => setOpen(!open)}>
          <p className="text-gray-700/80 mr-1">Thời gian:</p>
          <p className="font-medium">{title}</p>
        </div>
      </div>
      {open && (
        <div className="div-body-modal">
          {/*Main Container*/}
          <div className="div-main">
            {/*Left Container*/}
            <div className="div-left-body-modal">
              {/*Tùy chỉnh Tab */}
              {DATA_TAB.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={
                      valueTab === item?.value
                        ? "div-btn-date-select"
                        : "div-btn-date"
                    }
                    onClick={() => {
                      onSelectTab(item);
                      setTitle(
                        `${i18n.t(item?.title, {
                          lng: lang,
                        })}`
                      );
                    }}
                  >
                    <p className="text-btn-date hover:text-blue-300">{`${i18n.t(
                      item?.title,
                      {
                        lng: lang,
                      }
                    )}`}</p>
                  </div>
                );
              })}
            </div>
            {/*Right Container*/}
            <div className="div-right-body-modal">
              {/*Các tab chọn ngày, tháng, năm*/}
              <div className="div-tab-time">
                {OPTION.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={
                        tabTime === item?.value
                          ? "div-tab-item-select"
                          : "div-tab-item"
                      }
                    >
                      {valueTab !== "setting" &&
                      width > 490 &&
                      (item.value === "months" || item.value === "years") ? (
                        <a
                          style={{ color: "lightgray", cursor: "not-allowed" }}
                        >
                          {item?.title}
                        </a>
                      ) : (
                        <a
                          onClick={() => {
                            onSelectTypeTime(item);
                          }}
                        >
                          {item?.title}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
              {/*Lịch*/}
              <div className="">
                <Calendar
                  className={""}
                  // showDoubleView
                  onChange={onChange}
                  onClickDay={handleDayChange}
                  onClickMonth={(value) => handleMonthChange(value)}
                  onClickYear={(value) => handleYearChange(value)}
                  value={[startCalendar, endCalendar]}
                  selectRange={true}
                  view={typeView}
                  locale={lang}
                  tileClassName={({ date, view }) => {
                    // Nếu view là month (date sẽ bao gồm tất cả những ngày có trong tháng đang được hiển thị)
                    // Nếu view là year (date sẽ là ngày đầu tiên của các tháng đang được hiển thị)
                    // Nếu view là decade (date sẽ là ngày đầu tiên của tháng đầu tiên của các năm đang được hiển thị)
                    // Trường hợp xem theo ngày
                    if (view === "month") {
                      // Nếu tìm được ngày thuộc kì trước
                      if (
                        previousDate?.find(
                          (x) => x === moment(date).format("DD-MM-YYYY")
                        )
                      ) {
                        // Ngày tìm được là duy nhất
                        if (previousDate?.length === 1) {
                          return "one-day-term";
                        }
                        // Ngày tìm được là ngày đầu tiên của kì
                        else if (
                          previousDate?.find(
                            (x) => x === moment(date).format("DD-MM-YYYY")
                          ) === previousDate[previousDate?.length - 1]
                        ) {
                          return "first-day-in-term";
                        }
                        // Ngày tìm được là ngày cuối cùng của kì
                        else if (
                          previousDate?.find(
                            (x) => x === moment(date).format("DD-MM-YYYY")
                          ) === previousDate[0]
                        ) {
                          return "last-day-in-term";
                        }
                        // Ngày còn lại
                        else {
                          return "day-in-term";
                        }
                      }
                    }
                    // Trường hợp xem theo tháng
                    else if (view === "year") {
                      // Nếu tìm được tháng có chứa ngày thuộc kì trước
                      if (
                        previousDate?.find(
                          (x) => x === moment(date).format("DD-MM-YYYY")
                        )
                      ) {
                        // Tháng tìm được là duy nhất
                        if (
                          moment(lastTermStartCalendar, "DD-MM-YYYY").format(
                            "M"
                          ) ===
                          moment(lastTermEndCalendar, "DD-MM-YYYY").format("M")
                        ) {
                          return "one-day-term";
                        }
                        // Tháng tìm được là tháng chứa ngày bắt đầu
                        else if (
                          previousDate?.find(
                            (x) => x === moment(date).format("DD-MM-YYYY")
                          ) === previousDate[previousDate?.length - 1]
                        ) {
                          return "first-day-in-term";
                        }
                        // Tháng tìm được là tháng chứ ngày kết thúc
                        else if (
                          previousDate?.find(
                            (x) =>
                              x ===
                              moment(date).endOf("month").format("DD-MM-YYYY")
                          ) === previousDate[0]
                        ) {
                          return "last-day-in-term";
                        }
                        // Tháng còn lại
                        else {
                          return "day-in-term";
                        }
                      }
                    }
                    // Trường hợp xem theo năm
                    else if (view === "decade") {
                      // Nếu tìm được năm có chứa ngày thuộc kì trước
                      if (
                        previousDate?.find(
                          (x) => x === moment(date).format("DD-MM-YYYY")
                        )
                      ) {
                        // Năm tìm được là duy nhất
                        if (
                          moment(lastTermStartCalendar, "DD-MM-YYYY").format(
                            "YYYY"
                          ) ===
                          moment(lastTermEndCalendar, "DD-MM-YYYY").format(
                            "YYYY"
                          )
                        ) {
                          return "one-day-term";
                        }
                      }
                    }
                  }}
                  maxDate={disableFutureDay ? new Date() : ""} // Disabled all futured day
                />
              </div>
            </div>
          </div>
          {/*Button Container*/}
          <div style={{ margin: "10px" }} className="div-btn">
            <Button className="btn-cancel-date" onClick={handleCancel}>
              {`${i18n.t("cancel_modal", {
                lng: lang,
              })}`}
            </Button>
            <Button className="btn-confirm-date" onClick={handleOk}>
              {`${i18n.t("apply", {
                lng: lang,
              })}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RangeDatePicker;

const DATA_TAB = [
  {
    title: "today",
    value: "today",
    type_range: "days",
    range: [0, 0],
  },
  {
    title: "yesterday",
    value: "yesterday",
    type_range: "days",
    range: [1, 1],
  },

  {
    title: "seven_ago",
    value: "seven_last",
    type_range: "days",
    range: [6, 0],
  },
  {
    title: "thirty_ago",
    value: "thirty_last",
    type_range: "days",
    range: [29, 0],
  },
  {
    title: "ninety_ago",
    value: "last_ninety",
    type_range: "days",
    // range: [90, 1],
    range: [89, 0],
  },
  {
    title: "this_month",
    value: "this_month",
    type_range: "months",
    range: [0, 0],
  },
  {
    title: "last_month",
    value: "last_month",
    type_range: "months",
    range: [1, 1],
  },
  {
    title: "custom",
    value: "setting",
    type_range: "setting",
    range: [],
  },
];

const OPTION = [
  {
    id: 1,
    title: "Ngày",
    value: "days",
  },
  {
    id: 2,
    title: "Tháng",
    value: "months",
  },
  {
    id: 3,
    title: "Năm",
    value: "years",
  },
];
