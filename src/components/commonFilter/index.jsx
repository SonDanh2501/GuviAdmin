import { CaretDownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import React, { useEffect, useState } from "react";
import RangeDatePicker from "../datePicker/RangeDatePicker";
import moment from "moment";

const CommonFilter = (props) => {
  const { data, setReturnFilter, setDate } = props;
  const [selected, setSelected] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // const [startDate, setStartDate] = useState("2023-02-12T17:00:00.000Z");
  // const [endDate, setEndDate] = useState("2023-02-12T17:00:00.000Z");
  useEffect(() => {
    const tempArr = [];
    data.map((item) => {
      const tempItem = {
        key: item.key,
        value: item.data[0].value,
        label: item.data[0].label,
        name: item.label,
      };
      tempArr.push(tempItem);
    });
    setSelected(tempArr);
    setReturnFilter(tempArr);
  }, []);
  const handleClick = ({ key }, index) => {
    const item = {
      key: data[index].key,
      value: data[index].data[Number(key)].value,
      label: data[index].data[Number(key)].label,
      name: data[index].label,
    };
    const newSelected = [...selected]; // Create a new array with spread syntax
    newSelected[index] = item;
    setSelected(newSelected);
    setReturnFilter(newSelected);
  };
  useEffect(() => {
    if (setDate) {
      const temp = {
        start_date: startDate.toString(),
        end_date: endDate.toString(),
      };
      setDate(temp);
    }
  }, [startDate, endDate]);
  return (
    <div>
      <div className="filter-transfer_container">
        {setDate && (
          <div className="filter-transfer_date">
            <p>
              Ngày tạo:{" "}
              <span className="fw-500">
                {moment(startDate).format("DD/MM/YYYY")} -{" "}
                {moment(endDate).format("DD/MM/YYYY")}
              </span>
            </p>
            <RangeDatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onCancel={() => {}}
              defaults={"thirty_last"}
            />
          </div>
        )}
        {data.map((item, index) => {
          return (
            <div className="filter-transfer_status">
              <Dropdown
                menu={{
                  items: item?.data,
                  selectable: true,
                  defaultSelectedKeys: ["0"],
                  onClick: (key) => handleClick(key, index),
                }}
                trigger={["click"]}
              >
                <Space>
                  <p>
                    {selected[index]?.name}:{" "}
                    <span className="fw-500">{selected[index]?.label}</span>
                  </p>
                  <CaretDownOutlined />
                </Space>
              </Dropdown>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default React.memo(CommonFilter);

// data mẫu
const dataFilter = [
  {
    key: "case_status",
    label: "Trạng thái",
    data: [
      { key: "0", value: "", label: "Tất cả" },
      { key: "1", value: "pending", label: "Đang xử lý" },
      { key: "2", value: "doing", label: "Đang thực thi" },
      { key: "3", value: "cancel", label: "Huỷ" },
      { key: "4", value: "done", label: "Hoàn thành" },
    ],
  },
  {
    key: "payment",
    label: "Phương thức thanh khoản",
    data: [
      { key: "0", value: "", label: "Tất cả" },
      { key: "1", value: "bank", label: "Ngân hàng" },
      { key: "2", value: "momo", label: "MoMo" },
      { key: "3", value: "vnpay", label: "VNPay" },
      { key: "4", value: "pay_point", label: "Pay Point" },
    ],
  },
];
