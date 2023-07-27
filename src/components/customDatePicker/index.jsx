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
  const { setStartDate, setEndDate, onClick, onCancel, classNameBtn } = props;
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [valueTab, setValueTab] = useState("");
  const [tabTime, setTabTime] = useState("day");
  const [title, setTitle] = useState(
    `${i18n.t("choose_time", {
      lng: lang,
    })}`
  );

  useEffect(() => {
    setTitle(
      `${i18n.t("choose_time", {
        lng: lang,
      })}`
    );
  }, [lang]);

  const handleOk = () => {
    setOpen(false);
    onClick();
  };

  const handleCancel = () => {
    setOpen(false);
    onCancel();
    setTitle(
      `${i18n.t("choose_time", {
        lng: lang,
      })}`
    );
  };

  const onSelectTab = (item) => {
    setValueTab(item?.value);
    const today = moment().endOf("date").toISOString();
    const startToday = moment().startOf("date").toISOString();
    const startYesterday = moment()
      .subtract(1, "d")
      .startOf("date")
      .toISOString();
    const endYesterday = moment().subtract(1, "d").endOf("date").toISOString();
    const lastSeven = moment().subtract(7, "d").startOf("date").toISOString();
    const lastThirty = moment().subtract(30, "d").startOf("date").toISOString();
    const lastNinety = moment().subtract(90, "d").startOf("date").toISOString();
    const startThisMonth = moment().startOf("month").toISOString();
    const endThisMonth = moment().endOf("month").toISOString();
    const startLastMonth = moment()
      .subtract(1, "months")
      .startOf("month")
      .toISOString();
    const endLastMonth = moment()
      .subtract(1, "months")
      .endOf("month")
      .toISOString();
    const endNextDay = moment().add(3, "days").startOf("date").toISOString();

    switch (item?.value) {
      case "last_seven":
        setStartDate(lastSeven);
        setStart(moment().subtract(7, "d"));
        setEndDate(today);
        setEnd(moment());
        break;
      case "last_thirty":
        setStartDate(lastThirty);
        setStart(moment().subtract(30, "d"));
        setEndDate(today);
        setEnd(moment());
        break;
      case "last_ninety":
        setStartDate(lastNinety);
        setStart(moment().subtract(90, "d"));
        setEndDate(today);
        setEnd(moment());

        break;
      case "this_month":
        setStartDate(startThisMonth);
        setStart(moment().startOf("month"));
        setEndDate(endThisMonth);
        setEnd(moment().endOf("month"));
        break;
      case "last_month":
        setStartDate(startLastMonth);
        setStart(moment().subtract(1, "months").startOf("month"));
        setEndDate(endLastMonth);
        setEnd(moment().subtract(1, "months").endOf("month"));
        break;
      case "last_next_day":
        setStartDate(today);
        setStart(today);
        setEndDate(endNextDay);
        setEnd(moment().add(3, "days"));
        break;
      case "today":
        setStartDate(startToday);
        setStart(moment().startOf("date"));
        setEndDate(today);
        setEnd(moment());
        break;
      case "yesterday":
        setStartDate(startYesterday);
        setStart(moment().subtract(1, "d").startOf("date"));
        setEndDate(endYesterday);
        setEnd(moment().subtract(1, "d").endOf("date"));
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
      .add(7, "hours")
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
      .add(7, "hours")
      .toISOString();
    setStartDate(dayStart);
    setEndDate(dayEnd);
  }, []);

  return (
    <div>
      <div>
        {/* <a className="title-time">Thời gian</a> */}
        <div className="btn-date-picker" onClick={() => setOpen(!open)}>
          <a>{title}</a>
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
                    <a className="text-btn-date">{`${i18n.t(item?.title, {
                      lng: lang,
                    })}`}</a>
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
    title: "three_next",
    value: "last_next_day",
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
