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
            align: "center",
          },
          {
            title: "7:30",
            align: "center",
          },
          {
            title: "8:00",
            align: "center",
          },
          {
            title: "8:30",
            align: "center",
          },
          {
            title: "9:00",
            align: "center",
          },
          {
            title: "9:30",
            align: "center",
          },
          {
            title: "10:00",
            align: "center",
          },
          {
            title: "10:30",
            align: "center",
          },
          {
            title: "11:00",
            align: "center",
          },
          {
            title: "11:30",
            align: "center",
          },
          {
            title: "12:00",
            align: "center",
          },
          {
            title: "12:30",
            align: "center",
          },
        ]
      : tab === "afternoon"
      ? [
          {
            title: "Ngày",
          },
          {
            title: "13:00",
            align: "center",
          },
          {
            title: "13:30",
            align: "center",
          },
          {
            title: "14:00",
            align: "center",
          },
          {
            title: "14:30",
            align: "center",
          },
          {
            title: "15:00",
            align: "center",
          },
          {
            title: "15:30",
            align: "center",
          },
          {
            title: "16:00",
            align: "center",
          },
          {
            title: "16:30",
            align: "center",
          },
        ]
      : [
          {
            title: "Ngày",
          },
          {
            title: "17:00",
            align: "center",
          },
          {
            title: "17:30",
            align: "center",
          },
          {
            title: "18:00",
            align: "center",
          },
          {
            title: "18:30",
            align: "center",
          },
          {
            title: "19:00",
            align: "center",
          },
          {
            title: "19:30",
            align: "center",
          },
          {
            title: "20:00",
            align: "center",
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
