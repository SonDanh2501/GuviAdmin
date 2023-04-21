import { Pagination, Table } from "antd";
import { useState } from "react";
import "./index.scss";

const PriceService = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [tab, setTab] = useState("morning");

  const columns =
    tab === "morning"
      ? [
          {
            title: "Ngày",
          },
          {
            title: "7:00",
          },
          {
            title: "7:30",
          },
          {
            title: "8:00",
          },
          {
            title: "8:30",
          },
          {
            title: "9:00",
          },
          {
            title: "9:30",
          },
          {
            title: "10:00",
          },
          {
            title: "10:30",
          },
          {
            title: "11:00",
          },
          {
            title: "11:30",
          },
          {
            title: "12:00",
          },
          {
            title: "12:30",
          },
        ]
      : tab === "afternoon"
      ? [
          {
            title: "Ngày",
          },
          {
            title: "13:00",
          },
          {
            title: "13:30",
          },
          {
            title: "14:00",
          },
          {
            title: "14:30",
          },
          {
            title: "15:00",
          },
          {
            title: "15:30",
          },
          {
            title: "16:00",
          },
          {
            title: "16:30",
          },
        ]
      : [
          {
            title: "Ngày",
          },
          {
            title: "17:00",
          },
          {
            title: "17:30",
          },
          {
            title: "18:00",
          },
          {
            title: "18:30",
          },
          {
            title: "19:00",
          },
          {
            title: "19:30",
          },
          {
            title: "20:00",
          },
        ];

  return (
    <>
      <div className="div-tab-service">
        {TAB_DATA?.map((item, index) => {
          return (
            <div
              onClick={() => setTab(item?.value)}
              className={
                item?.value === tab ? "div-item-tab-selected" : "div-item-tab"
              }
            >
              <a className="text-tab">{item?.title}</a>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
      <div className="div-pagination p-2">
        <a>Tổng: {total}</a>
        <div>
          <Pagination
            current={currentPage}
            // onChange={onChange}
            total={total}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
};

export default PriceService;

const TAB_DATA = [
  {
    title: "Sáng",
    value: "morning",
  },
  {
    title: "Chiều",
    value: "afternoon",
  },
  {
    title: "Tối",
    value: "evening",
  },
];
