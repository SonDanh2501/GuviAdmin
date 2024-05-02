import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";

const HistoryActivity = (props) => {
  const { data } = props;
  const [arrComponents, setArrComponents] = useState([]);
  const [chooseItem, setChooseItem] = useState();
  useEffect(() => {}, []);
  const onChooseItem = (item) => {
    if (item?._id === chooseItem?._id) {
      setChooseItem(null);
    } else {
      setChooseItem(item);
    }
  };
  const DetailHistoryConfirmOrder = (detailHistoryActivity) => {
    const {
      id_order,
      id_customer,
      id_collaborator,
      id_transaction,
      id_punish_ticket,
    } = detailHistoryActivity;
    return (
      <div className="detail-history-activity_confirm-order_container">
        <div className="item-left">
          <div className="content-container">
            <p>Đơn hàng: </p>
            <p>{"#24790002789.001"}</p>
          </div>
          <div className="content-container">
            <p>Khách hàng: </p>
            <p>{"Nguyễn Nguyên"}</p>
          </div>
          <div className="content-container">
            <p>CTV: </p>
            <p>{"Nguyễn Lam Trường"}</p>
          </div>
        </div>
        <div className="item-right">
          <div className="content-container">
            <p>Mã giao dịch: </p>
            <p>{"#0328374810BAHF"}</p>
          </div>
          <div className="content-container">
            <p>Mã lệnh phạt: </p>
            <p>{"#24790002789.001"}</p>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="history-activity_container">
      {arr.map((item, index) => {
        const { title, body, date_create, id_admin_action } = item;
        return (
          <div className="history-activity_item-container">
            <div className="item-left">
              <p>{format(new Date(date_create), "dd/MM/yyyy - HH:mm")}</p>
              <p>name admin action</p>
            </div>
            <div className="item-vertical-line">
              <div className={index === 0 ? `circle` : "circle-black"}></div>
              {index !== arr.length - 1 && <div className="line"></div>}
            </div>

            <div className="item-info">
              <div
                className="item-info_title"
                onClick={() => onChooseItem(item)}
              >
                <div className="title_admin">
                  <div>
                    <p className="">{title.vi}</p>
                    <div className="flex">
                      <p className="">Ví Nạp {230000}</p>
                      <p className="">Ví CTV: {120000}</p>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <p>{"+230.000 VND"}</p>
                  <DownOutlined color="#000" />
                </div>
              </div>
              <div className="item-info_detail">
                {chooseItem?._id === item?._id && (
                  <DetailHistoryConfirmOrder detailHistoryActivity={item} />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default HistoryActivity;

const arr = [
  {
    _id: 1,
    title: { vi: "admin đã tạo lệnh phạt" },
    body: { vi: "description activity history" },
    date_create: "2024-04-01T04:05:08.169Z",
  },
  {
    _id: 3,
    title: { vi: "Log lich sủ" },
    body: { vi: "description activity history" },
    date_create: "2024-03-31T04:05:08.169Z",
  },
  {
    _id: 4,
    title: { vi: "Log lịch sử" },
    body: { vi: "description activity history" },
    date_create: "2024-03-01T04:05:08.169Z",
  },
  {
    _id: 2,
    title: { vi: "Log lịch sử" },
    body: { vi: "description activity history" },
    date_create: "2024-02-01T04:05:08.169Z",
  },
];
