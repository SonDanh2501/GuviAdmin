import { Button, DatePicker, Modal } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import Calendar from "react-calendar";

import "./index.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../redux/selectors/auth";
import i18n from "../../i18n";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import "react-calendar/dist/Calendar.css";
const { RangePicker } = DatePicker;

const CustomDatePicker = (props) => {
  const lang = useSelector(getLanguageState);
  const {
    setStartDate,
    setEndDate,
    onClick,
    onCancel,
    classNameBtn,
    setSameStart,
    setSameEnd,
    defaults,
  } = props;
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [valueTab, setValueTab] = useState("");
  const [tabTime, setTabTime] = useState("days");
  const [title, setTitle] = useState();

  useEffect(() => {
    setStart(defaults ? moment().subtract(30, "days").startOf("days") : "");
    setEnd(defaults ? moment().subtract(1, "days").endOf("days") : "");
    setTitle(
      defaults
        ? `${i18n.t("thirty_ago", {
            lng: lang,
          })}`
        : ""
    );
    setValueTab(defaults ? "last_thirty" : "");
  }, []);

  const handleOk = () => {
    setOpen(false);
    onClick();
  };

  const handleCancel = () => {
    setOpen(false);
    onCancel();
    setTitle();
  };

  const onSelectTab = (item) => {
    setValueTab(item?.value);
    const today = moment()
      .subtract(1, "days")
      .startOf("days")
      .add(7, "hours")
      .toISOString();
    const todayEnd = moment()
      .subtract(1, "days")
      .endOf("days")
      .add(7, "hours")
      .toISOString();
    const startToday = moment().startOf("days").add(7, "hours").toISOString();
    const endToday = moment().endOf("days").add(7, "hours").toISOString();

    const startYesterday = moment()
      .subtract(1, "days")
      .startOf("date")
      .add(7, "hours")
      .toISOString();
    const endYesterday = moment()
      .subtract(1, "days")
      .endOf("date")
      .add(7, "hours")
      .toISOString();
    const lastSeven = moment()
      .subtract(1, "week")
      .startOf("days")
      .add(7, "hours")
      .toISOString();
    const lastThirty = moment()
      .subtract(30, "days")
      .startOf("days")
      .add(7, "hours")
      .toISOString();
    const lastNinety = moment()
      .subtract(90, "days")
      .startOf("days")
      .add(7, "hours")
      .toISOString();
    const startThisMonth = moment()
      .startOf("month")
      .startOf("days")
      .add(7, "hours")
      .toISOString();
    const endThisMonth = moment().endOf("days").add(7, "hours").toISOString();
    const startLastMonth = moment()
      .subtract(1, "months")
      .startOf("months")
      .add(7, "hours")
      .toISOString();
    const endLastMonth = moment()
      .subtract(1, "months")
      .endOf("months")
      .add(7, "hours")
      .toISOString();
    const endNextDay = moment().add(3, "days").add(7, "hours").toISOString();

    switch (item?.value) {
      case "last_seven":
        setStartDate(lastSeven);
        setStart(moment().subtract(1, "week").startOf("days"));
        setEndDate(todayEnd);
        setEnd(moment().subtract(1, "days").endOf("days"));
        setSameStart(
          moment(lastSeven)
            .subtract(1, "week")
            .startOf("days")
            .add(7, "hours")
            .toISOString()
        );
        setSameEnd(
          moment(todayEnd)
            .subtract(1, "week")
            .subtract(1, "days")
            .endOf("days")
            .add(7, "hours")
            .toISOString()
        );
        break;
      case "last_thirty":
        setStartDate(lastThirty);
        setStart(moment().subtract(30, "days").startOf("days"));
        setEndDate(todayEnd);
        setEnd(moment().subtract(1, "days").endOf("days"));
        setSameStart(
          moment(lastThirty)
            .subtract(30, "days")
            .startOf("days")
            .add(7, "hours")
            .toISOString()
        );
        setSameEnd(
          moment(todayEnd)
            .subtract(30, "days")
            .subtract(1, "days")
            .endOf("days")
            .add(7, "hours")
            .toISOString()
        );
        break;
      case "last_ninety":
        setStartDate(lastNinety);
        setStart(moment().subtract(90, "days").startOf("days"));
        setEndDate(todayEnd);
        setEnd(moment().subtract(1, "days").endOf("days"));
        setSameStart(
          moment(lastNinety)
            .subtract(90, "days")
            .startOf("days")
            .add(7, "hours")
            .toISOString()
        );
        setSameEnd(
          moment(todayEnd)
            .subtract(90, "days")
            .subtract(1, "days")
            .endOf("days")
            .add(7, "hours")
            .toISOString()
        );
        break;
      case "this_month":
        setStartDate(startThisMonth);
        setStart(moment().startOf("month").startOf("days"));
        setEndDate(endThisMonth);
        setEnd(moment().endOf("days").endOf("days"));
        const samDiff = moment(endThisMonth).diff(
          moment(startThisMonth),
          "day"
        );
        const sameStart = moment()
          .subtract(1, "months")
          .startOf("months")
          .toISOString();
        setSameStart(
          moment()
            .subtract(1, "months")
            .startOf("months")
            .startOf("days")
            .add(7, "hours")
            .toISOString()
        );
        setSameEnd(
          moment(sameStart)
            .add(samDiff, "days")
            .endOf("days")
            .add(7, "hours")
            .toISOString()
        );
        break;
      case "last_month":
        setStartDate(startLastMonth);
        setStart(
          moment().subtract(1, "months").startOf("months").startOf("days")
        );
        setEndDate(endLastMonth);
        setEnd(moment().subtract(1, "months").endOf("months").endOf("days"));
        setSameStart(
          moment(startLastMonth)
            .subtract(1, "months")
            .startOf("months")
            .startOf("days")
            .add(7, "hours")
            .toISOString()
        );
        setSameEnd(
          moment(startLastMonth)
            .subtract(1, "months")
            .endOf("months")
            .endOf("days")
            .add(7, "hours")
            .toISOString()
        );
        break;
      case "last_next_day":
        setStartDate(today);
        setStart(today);
        setEndDate(endNextDay);
        setEnd(moment().add(3, "day").startOf("days"));
        break;
      case "today":
        setStartDate(startToday);
        setStart(moment().startOf("days"));
        setEndDate(endToday);
        setEnd(moment());
        setSameStart(
          moment(startToday)
            .subtract(1, "day")
            .startOf("days")
            .add(7, "hours")
            .toISOString()
        );
        setSameEnd(
          moment(startToday)
            .subtract(1, "day")
            .endOf("days")
            .add(7, "hours")
            .toISOString()
        );
        break;
      case "yesterday":
        setStartDate(startYesterday);
        setStart(moment().subtract(1, "day").startOf("days"));
        setEndDate(endYesterday);
        setEnd(moment().subtract(1, "day").endOf("days"));
        setSameStart(
          moment(startYesterday)
            .subtract(1, "days")
            .startOf("days")
            .add(7, "hours")
            .toISOString()
        );
        setSameEnd(
          moment(startYesterday)
            .subtract(1, "days")
            .endOf("days")
            .add(7, "hours")
            .toISOString()
        );
        break;
      case "setting":
        setStart("");
        setEnd("");
        break;
      default:
        break;
    }
  };

  const onChange = (value, event) => {
    setStart(value[0]);
    setEnd(value[1]);
    setStartDate(value[0].toISOString());
    setEndDate(value[1].toISOString());
    const start = moment(value[0]).format("YYYY-MM-DD");
    const end = moment(value[1]).format("YYYY-MM-DD");
    const daySame = moment(end)
      .startOf("day")
      .diff(moment(start).startOf("days"), "days");
    setSameStart(
      moment(value[0])
        .subtract(daySame, "days")
        .startOf("days")
        .add(7, "hours")
        .toISOString()
    );
    setSameEnd(
      moment(value[1])
        .subtract(daySame, "days")
        .startOf("days")
        .add(7, "hours")
        .toISOString()
    );
  };

  const onChangeFilter = useCallback((start, end) => {
    const dayStart = moment(start)
      .startOf(
        tabTime === "month"
          ? "month"
          : tabTime === "week"
          ? "week"
          : tabTime === "day"
          ? "date"
          : "quarter"
      )

      .toISOString();
    const dayEnd = moment(end)
      .endOf(
        tabTime === "month"
          ? "month"
          : tabTime === "week"
          ? "week"
          : tabTime === "day"
          ? "date"
          : "quarter"
      )

      .toISOString();
    setStartDate(dayStart);
    setEndDate(dayEnd);
    const sam = moment(dayEnd).diff(moment(dayStart), "day");
    setSameStart(
      moment(dayStart)
        .subtract(sam, "days")
        .startOf("days")
        .add(7, "hours")
        .toISOString()
    );
    setSameEnd(
      moment(dayEnd)
        .subtract(sam, "days")
        .endOf("days")
        .add(7, "hours")
        .toISOString()
    );
  }, []);

  return (
    <div>
      <div>
        {/* <a className="title-time">Thời gian</a> */}
        <div className="btn-date-picker" onClick={() => setOpen(!open)}>
          <a>Thời gian: {title}</a>
        </div>
      </div>

      {open && (
        <div className="div-body-modal">
          <div className="div-main">
            <div className="div-left-body-modal">
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
                    <p className="text-btn-date">{`${i18n.t(item?.title, {
                      lng: lang,
                    })}`}</p>
                  </div>
                );
              })}
            </div>
            <div className="div-right-body-modal">
              {valueTab === "setting" ? (
                <>
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
                          onClick={() => {
                            setTabTime(item?.value);
                          }}
                        >
                          <a>{item?.title}</a>
                        </div>
                      );
                    })}
                  </div>
                  <div className="ml-3 mt-4">
                    <RangePicker
                      picker={tabTime}
                      className="picker"
                      onChange={(e) => onChangeFilter(e[0]?.$d, e[1]?.$d)}
                      locale={lang}
                    />
                  </div>
                </>
              ) : (
                <Calendar
                  onChange={onChange}
                  value={[start, end]}
                  selectRange={true}
                  view="month"
                  className="calendar-picker"
                  locale={lang}
                  next2Label={
                    <DoubleRightOutlined style={{ color: "black" }} />
                  }
                  nextLabel={<RightOutlined style={{ color: "black" }} />}
                  prev2Label={<DoubleLeftOutlined style={{ color: "black" }} />}
                  prevLabel={<LeftOutlined style={{ color: "black" }} />}
                  tileClassName="classname_title"
                />
              )}
            </div>
          </div>
          <div className="div-btn">
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

export default CustomDatePicker;

const DATA_TAB = [
  {
    title: "today",
    value: "today",
  },
  {
    title: "yesterday",
    value: "yesterday",
  },
  {
    title: "seven_ago",
    value: "last_seven",
  },
  {
    title: "thirty_ago",
    value: "last_thirty",
  },
  {
    title: "ninety_ago",
    value: "last_ninety",
  },
  {
    title: "this_month",
    value: "this_month",
  },
  {
    title: "last_month",
    value: "last_month",
  },
  {
    title: "custom",
    value: "setting",
  },
];

const OPTION = [
  {
    id: 1,
    title: "Ngày",
    value: "day",
  },
  {
    id: 3,
    title: "Tuần",
    value: "week",
  },
  {
    id: 1,
    title: "Tháng",
    value: "month",
  },
  {
    id: 1,
    title: "Quý",
    value: "quarter",
  },
];
