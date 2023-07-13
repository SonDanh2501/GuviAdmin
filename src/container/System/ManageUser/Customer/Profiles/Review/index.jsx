import { useEffect, useState } from "react";
import { getReviewByCustomers } from "../../../../../../api/customer";
import { Rate, Table } from "antd";
import "./styles.scss";
import moment from "moment";
import { Link } from "react-router-dom";

const CustomerReview = ({ id }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    getReviewByCustomers(id, 0, 10)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const onChange = (page) => {
    setCurrentPage(page);
    const lengthData = data.length < 10 ? 10 : data.length;
    const start = page * lengthData - lengthData;
    getReviewByCustomers(id, start, 10)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const columns = [
    {
      title: () => {
        return <a className="title-column">Ngày đánh giá</a>;
      },
      render: (data) => {
        return (
          <div className="div-date-review">
            <a className="text-date">
              {moment(data?.date_create_review).format("DD/MM/YYYY")}
            </a>
            <a className="text-date">
              {moment(data?.date_create_review).format("HH:mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: () => {
        return <a className="title-column">Mã đơn</a>;
      },
      render: (data) => {
        return (
          <div className="div-order-review">
            <a className="text-id-view">{data?.service?._id?.title?.vi}</a>
            <a className="text-id-view">{data?.id_view}</a>
          </div>
        );
      },
    },
    {
      title: () => {
        return <a className="title-column">Cộng tác viên</a>;
      },
      render: (data) => {
        return (
          <Link
            to={`/details-collaborator/${data?.id_collaborator?._id}`}
            className="div-star-collaborator"
          >
            <a className="text-name">{data?.id_collaborator?.full_name}</a>

            <a className="text-name">{data?.id_collaborator?.phone}</a>
          </Link>
        );
      },
    },
    {
      title: () => {
        return <a className="title-column">Nội dung</a>;
      },
      render: (data) => {
        return <a className="text-review-by-customer">{data?.review}</a>;
      },
    },
    {
      title: () => {
        return <a className="title-column">Đánh giá</a>;
      },
      render: (data) => {
        return (
          <a className="text-review-by-customer">{data?.short_review[0]}</a>
        );
      },
    },
    {
      title: () => {
        return <a className="title-column">Số sao</a>;
      },
      render: (data) => {
        return (
          <Rate value={data?.star} style={{ width: "100%" }} disabled={true} />
        );
      },
    },
  ];

  return (
    <div>
      <div className="mt-3">
        <Table
          dataSource={data}
          columns={columns}
          pagination={{
            current: currentPage,
            total: total,
            pageSize: 10,
            onChange: onChange,
          }}
        />
      </div>
    </div>
  );
};

export default CustomerReview;
