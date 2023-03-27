import { Modal } from "antd";
import moment from "moment";
import { useState } from "react";
import "./index.scss";
const CustomDatePicker = (props) => {
  const { setStartDate, setEndDate, onClick } = props;
  const [open, setOpen] = useState(false);
  const [valueTab, setValueTab] = useState("");
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
        setEndDate(today);
        setTitle(item?.title);
        break;
      case "last_thirty":
        setStartDate(lastThirty);
        setEndDate(today);
        setTitle(item?.title);

        break;
      case "last_ninety":
        setStartDate(lastNinety);
        setEndDate(today);
        setTitle(item?.title);
        break;
      case "this_month":
        setStartDate(startThisMonth);
        setEndDate(endThisMonth);
        setTitle(item?.title);
        break;
      case "last_month":
        setStartDate(startLastMonth);
        setEndDate(endLastMonth);
        setTitle(item?.title);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div className="btn-date-picker" onClick={() => setOpen(!open)}>
        <a>{title}</a>
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
          <div className="div-right-body-modal">
            {DATA_TAB.map((item) => {
              return (
                <div
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
          <div className="div-left-body-modal"></div>
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
