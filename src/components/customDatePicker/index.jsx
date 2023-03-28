import { DatePicker, Modal } from "antd";
import moment from "moment";
import { useCallback, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./index.scss";
const { RangePicker } = DatePicker;

const CustomDatePicker = (props) => {
  const { setStartDate, setEndDate, onClick } = props;
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
  };

  const onSelectTab = (item) => {
    setValueTab(item?.value);
    const today = moment().toISOString();
    const lastSeven = moment().subtract(7, "d").toISOString();
    const lastThirty = moment().subtract(30, "d").toISOString();
    const lastNinety = moment().subtract(90, "d").toISOString();
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

      <Modal
        title="Chọn thời gian"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Áp dụng"
        cancelText="Huỷ"
      >
        <div className="div-body-modal">
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
                <div className="ml-5 mt-4">
                  <RangePicker
                    picker={tabTime}
                    className="picker"
                    onChange={(e) => onChangeFilter(e[0]?.$d, e[1]?.$d)}
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
              />
            )}
          </div>
        </div>
      </Modal>
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
