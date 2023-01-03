import { Table } from "antd";
import React from "react";
import "./index.scss";

const ReportManager = () => {
  const columns = [
    {
      title: "Mã CTV",
    },
    {
      title: "Tên CTV",
    },
    {
      title: "Số ca làm",
    },
    {
      title: "Doanh thu",
      align: "center",
    },
    {
      title: "Giảm giá",
      align: "center",
    },
    {
      title: "Doanh thu thuần",
      align: "center",
    },
    {
      title: "Tổng",
      align: "center",
    },
    {
      title: "Phí dịch vụ trả CTV",
      align: "center",
    },
    {
      title: "Tổng lợi nhuận",
      align: "center",
    },
    {
      title: "% Lợi nhuận",
      align: "center",
    },
  ];

  return (
    <div>
      <div></div>
      <div className="mt-3">
        <Table columns={columns} pagination={false} />
      </div>
    </div>
  );
};

export default ReportManager;
