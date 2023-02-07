import { Table } from "antd";
import "./index.scss";

const Review = () => {
  const columns = [
    {
      title: "Thời gian",
    },
    {
      title: "Người đánh giá",
    },
    {
      title: "Số sao",
    },
    {
      title: "Nội dung",
    },
  ];
  return (
    <div>
      <div></div>

      <div className="mt-3">
        <Table
          columns={columns}
          // dataSource={dataFilter.length > 0 ? dataFilter : data}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Review;
