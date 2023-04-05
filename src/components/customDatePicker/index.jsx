import { DatePicker, Modal } from "antd";
import moment from "moment";
import { useCallback, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "dayjs/locale/zh-cn";
import vi from "antd/locale/vi_VN";
import "./index.scss";
const { RangePicker } = DatePicker;

const CustomDatePicker = (props) => {
  const { setStartDate, setEndDate, onClick, onCancel } = props;
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [valueTab, setValueTab] = useState("");
  const [tabTime, setTabTime] = useState("day");
  const [title, setTitle] = useState("Chọn thời gian");

  const handleOk = () => {
    setOpen(false);
    onClick();
  };

  const handleCancel = () => {
    setOpen(false);
    onCancel();
    setTitle("Chọn thời gian");
  };

  const onSelectTab = (item) => {
    setValueTab(item?.value);
    const today = moment(moment().toISOString()).add(7, "hours").toISOString();
    const lastSeven = moment(
      moment().subtract(7, "d").startOf("date").toISOString()
    )
      .add(7, "hours")
      .toISOString();
    const lastThirty = moment(
      moment().subtract(30, "d").startOf("date").toISOString()
    )
      .add(7, "hours")
      .toISOString();
    const lastNinety = moment(
      moment().subtract(90, "d").startOf("date").toISOString()
    )
      .add(7, "hours")
      .toISOString();
    const startThisMonth = moment(moment().startOf("month").toISOString())
      .add(7, "hours")
      .toISOString();
    const endThisMonth = moment(moment().endOf("month").toISOString())
      .add(7, "hours")
      .toISOString();
    const startLastMonth = moment(
      moment().subtract(1, "months").startOf("month").toISOString()
    )
      .add(7, "hours")
      .toISOString();
    const endLastMonth = moment(
      moment().subtract(1, "months").endOf("month").toISOString()
    )
      .add(7, "hours")
      .toISOString();

    switch (item?.value) {
      case "last_seven":
        setStartDate(lastSeven);
        setStart(moment().subtract(7, "d"));
        setEndDate(today);
        setEnd(moment());
        setTitle(item?.title);
        break;
      case "last_thirty":
        setStartDate(lastThirty);
        setStart(moment().subtract(30, "d"));
        setEndDate(today);
        setEnd(moment());
        setTitle(item?.title);

        break;
      case "last_ninety":
        setStartDate(lastNinety);
        setStart(moment().subtract(90, "d"));
        setEndDate(today);
        setEnd(moment());
        setTitle(item?.title);
        break;
      case "this_month":
        setStartDate(startThisMonth);
        setStart(moment().startOf("month"));
        setEndDate(endThisMonth);
        setEnd(moment().endOf("month"));
        setTitle(item?.title);
        break;
      case "last_month":
        setStartDate(startLastMonth);
        setStart(moment().subtract(1, "months").startOf("month"));
        setEndDate(endLastMonth);
        setEnd(moment().subtract(1, "months").endOf("month"));
        setTitle(item?.title);
        break;
      case "setting":
        setTitle(item?.title);
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
                    onClick={() => onSelectTab(item)}
                  >
                    <a className="text-btn-date">{item?.title}</a>
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
                      locale={vi}
                    />
                  </div>
                </>
              ) : (
                <Calendar
                  onChange={onChange}
                  value={[start, end]}
                  selectRange={true}
                  view="month"
                  className="calendar"
                  locale={"vi-VI"}
                />
              )}
            </div>
          </div>
          <div className="div-btn">
            <button className="btn-cancel-date" onClick={handleCancel}>
              Huỷ
            </button>
            <button className="btn-confirm-date" onClick={handleOk}>
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;

const DATA_TAB = [
  {
    id: 1,
    title: "7 ngày trước",
    value: "last_seven",
  },
  {
    id: 2,
    title: "30 ngày trước",
    value: "last_thirty",
  },
  {
    id: 3,
    title: "90 ngày trước",
    value: "last_ninety",
  },
  {
    id: 4,
    title: "Tháng này",
    value: "this_month",
  },
  {
    id: 5,
    title: "Tháng trước",
    value: "last_month",
  },
  {
    id: 6,
    title: "Tuỳ chỉnh",
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
