import React from "react";
import { Popover, Steps } from "antd";
import { format } from "date-fns";
const ActivityHistory = (props) => {
  const { data } = props;
  return (
    <div>
      <h5>Hoạt động</h5>
      {data?.length > 0 ? (
        data.map((item, index) => {
          const { title, description, date_create } = item;
          return (
            <div className="activity-history_item-container">
              <div>
                <p>{format(new Date(date_create), "HH:mm")}</p>
                <p>{format(new Date(date_create), "dd/MM/yyyy")}</p>
              </div>
              <div className="item-vertical-line">
                <div className={index === 0 ? `circle` : "circle-black"}></div>
                {arr.length - 1 > index && <div className="line"></div>}
              </div>
              <div className="item-info">
                <p className="title">{title}</p>
                <p>{description}</p>
              </div>
            </div>
          );
        })
      ) : (
        <div>
          <p>Chưa có hoạt động nào</p>
        </div>
      )}
    </div>
  );
};
export default ActivityHistory;
const arr = [
  {
    _id: 1,
    title: "admin đã tạo lệnh phạt",
    description: "description activity history",
    date_create: "2024-04-01T04:05:08.169Z",
  },
  {
    _id: 3,
    title: "Log lich sủ",
    description: "description activity history",
    date_create: "2024-03-31T04:05:08.169Z",
  },
  {
    _id: 4,
    title: "Log lịch sử",
    description: "description activity history",
    date_create: "2024-03-01T04:05:08.169Z",
  },
  {
    _id: 2,
    title: "Log lịch sử",
    description: "description activity history",
    date_create: "2024-02-01T04:05:08.169Z",
  },
];
