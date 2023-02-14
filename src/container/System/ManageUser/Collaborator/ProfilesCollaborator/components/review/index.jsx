import { Table } from "antd";
import "./index.scss";

const Review = () => {
  const columns = [
    {
      title: "Thời gian",
      width: "15%",
    },
    {
      title: "Người đánh giá",
      width: "20%",
    },
    {
      title: "Số sao",
      width: "10%",
      align: "center",
    },
    {
      title: "Nội dung",
      width: "45%",
    },
  ];
  return (
    <div>
      <div>
        <a className="text-total-star">
          Tổng lượt đánh giá: 3 <i class="uil uil-star icon-star"></i>
        </a>
      </div>

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
