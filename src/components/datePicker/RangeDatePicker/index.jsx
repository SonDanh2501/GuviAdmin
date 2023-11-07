
import { Button, DatePicker, Modal } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import Calendar from "react-calendar";

import "./index.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../redux/selectors/auth";
import i18n from "../../../i18n";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import "react-calendar/dist/Calendar.css";
const { RangePicker } = DatePicker;

const RangeDatePicker = (props) => {
  const lang = useSelector(getLanguageState);
  const {
    setStartDate,
    setEndDate,
    onClick,
    onCancel,
    classNameBtn,
    defaults,
  } = props;
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [valueTab, setValueTab] = useState("");
  const [tabTime, setTabTime] = useState("day");
  const [title, setTitle] = useState("");
  const timeZone = 0;

  useEffect(() => {
    if(defaults) {
      const item = DATA_TAB.find(x => x.value === defaults);
      if(item) {
        const {startDate, endDate} = calculateRangeDate(item.range, item.type_range);
        setStart(startDate)
        setEnd(endDate)
        setStartDate(startDate.toISOString());
        setEndDate(endDate.toISOString());
        setTitle(`${i18n.t(item.title, {lng: lang,})}`)
        setValueTab(item.value);
      }
    }
  }, []);

  

  const handleOk = () => {
    setOpen(false);
    setStartDate(start.toISOString());
    setEndDate(end.toISOString());
    // onClick();
  };

  const handleCancel = () => {
    setOpen(false);
    onCancel();
    setTitle();
  };


  const onChange = (value, event) => {

    console.log(value, 'value');
    console.log(event, 'event');


    setStart(value[0]);
    setEnd(value[1]);
    setStartDate(value[0].toISOString());
    setEndDate(value[1].toISOString());


    // const start = moment(value[0]).format("YYYY-MM-DD");
    // const end = moment(value[1]).format("YYYY-MM-DD");
    // const daySame = moment(end)
    //   .startOf("day")
    //   .diff(moment(start).startOf("days"), "days");
    // setSameStart(
    //   moment(value[0])
    //     .subtract(daySame, "days")
    //     .startOf("days")
    //     .add(timeZone, "hours")
    //     .toISOString()
    // );
    // setSameEnd(
    //   moment(value[1])
    //     .subtract(daySame, "days")
    //     .startOf("days")
    //     .add(timeZone, "hours")
    //     .toISOString()
    // );
  };

  const onSelectTab = (item: any) => {
    setValueTab(item.value)
    if(item.type_range === "setting") {
      setStart("");
      setEnd("");
    } else {
      const {startDate, endDate} = calculateRangeDate(item.range, item.type_range);
      setStart(startDate);
      setEnd(endDate);
    }
  }

  const calculateRangeDate = (rangeDate, typeRange) => {
    const startDate = moment().subtract(rangeDate[0], typeRange).startOf(typeRange).startOf("days");
    const endDate = moment().subtract(rangeDate[1], typeRange).endOf(typeRange).endOf("days");
    return { startDate, endDate}
  }

  const calculateGetStartDate = (date, type) => {
    const temp = moment(date).startOf(`${type}s`).startOf("days");
    return temp;
  }

  const calculateGetEndDate = (date, type) => {
    const temp = moment(date).endOf(`${type}s`).endOf("days");
    return temp;
  }

  const onChangeFilter = useCallback((start, end) => {
    const startDate = calculateGetStartDate(start, tabTime);
    const endDate = calculateGetEndDate(end, tabTime);
    setStart(startDate)
    setEnd(endDate)
  }, [])

  return (
    <div>
      <div>
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
    value: "last_seven",
    type_range: "days",
    range: [7, 1],
  },
  {
    title: "thirty_ago",
    value: "last_thirty",
    type_range: "days",
    range: [30, 1],
  },
  {
    title: "seven_last",
    value: "seven_last",
    type_range: "days",
    range: [6, 0],
  },
  {
    title: "thirty_last",
    value: "thirty_last",
    type_range: "days",
    range: [29, 0],
  },
  {
    title: "ninety_ago",
    value: "last_ninety",
    type_range: "days",
    range: [90, 1],
  },
  {
    title: "this_month",
    value: "this_month",
    type_range: "months",
    range: [0,0]
  },
  {
    title: "last_month",
    value: "last_month",
    type_range: "months",
    range: [1,1]
  },
  {
    title: "custom",
    value: "setting",
    type_range: "setting",
    range: []
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
