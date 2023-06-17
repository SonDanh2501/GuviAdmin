import { Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { getReviewCollaborator } from "../../../../../../../api/collaborator";
import "./index.scss";

const Review = ({ id, totalReview }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getReviewCollaborator(id)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {});
  }, [id]);

  const columns = [
    {
      title: "Thời gian",

      render: (data) => {
        return (
          <div className="time-review">
            <a>
              {moment(new Date(data?.date_create_review)).format("DD/MM/YYYY")}
            </a>
            <a>{moment(new Date(data?.date_create_review)).format("HH:mm")}</a>
          </div>
        );
      },
    },
    {
      title: "Người đánh giá",

      render: (data) => {
        return <a>{data?.id_customer?.full_name}</a>;
      },
      align: "center",
    },
    {
      title: "Số sao",

      align: "center",
      render: (data) => {
        return (
          <a>
            {data?.star} <i class="uil uil-star icon-star"></i>
          </a>
        );
      },
    },
    {
      title: "Nội dung",

      render: (data) => {
        return <a>{data?.review}</a>;
      },
    },
    {
      title: "Đánh giá nhanh",
      render: (data) => {
        return (
          <div>
            {data?.short_review?.map((item) => (
              <a>{item}</a>
            ))}
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div>
        <a className="text-total-star">
          Tổng lượt đánh giá: {totalReview}
          <i class="uil uil-star icon-star"></i>
        </a>
      </div>

      <div className="mt-3">
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
    </div>
  );
};

export default Review;
