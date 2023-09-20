import { useEffect, useState } from "react";
import { getReviewByCustomers } from "../../../../../api/customer";
import { Rate, Table } from "antd";
import "./styles.scss";
import moment from "moment";
import { Link } from "react-router-dom";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";

const CustomerReview = ({ id }) => {
  const { width } = useWindowDimensions();
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
  }, [id]);

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
        return <p className="title-column">Ngày đánh giá</p>;
      },
      render: (data) => {
        return (
          <div className="div-date-review">
            <p className="text-date">
              {moment(data?.date_create_review).format("DD/MM/YYYY")}
            </p>
            <p className="text-date">
              {moment(data?.date_create_review).format("HH:mm")}
            </p>
          </div>
        );
      },
    },
    {
      title: () => {
        return <p className="title-column">Mã đơn</p>;
      },
      render: (data) => {
        return (
          <div className="div-order-review">
            <p className="text-id-view">{data?.service?._id?.title?.vi}</p>
            <p className="text-id-view">{data?.id_view}</p>
          </div>
        );
      },
    },
    {
      title: () => {
        return <p className="title-column">Cộng tác viên</p>;
      },
      render: (data) => {
        return (
          <Link
            to={`/details-collaborator/${data?.id_collaborator?._id}`}
            className="div-star-collaborator"
          >
            <p className="text-name">{data?.id_collaborator?.full_name}</p>

            <p className="text-name">{data?.id_collaborator?.phone}</p>
          </Link>
        );
      },
    },
    {
      title: () => {
        return <p className="title-column">Nội dung</p>;
      },
      render: (data) => {
        return <p className="text-review-by-customer">{data?.review}</p>;
      },
      responsive: ["xl"],
    },
    {
      title: () => {
        return <p className="title-column">Đánh giá</p>;
      },
      render: (data) => {
        return (
          <p className="text-review-by-customer">{data?.short_review[0]}</p>
        );
      },
      responsive: ["xl"],
    },
    {
      title: () => {
        return <p className="title-column">Số sao</p>;
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
          expandable={
            width <= 1200
              ? {
                  expandedRowRender: (record) => {
                    return (
                      <div className="div-plus">
                        <p>Nội dung: {record?.review}</p>
                        <p>Đánh giá: {record?.short_review[0]}</p>
                      </div>
                    );
                  },
                }
              : ""
          }
          scroll={{
            x: width < 900 ? 900 : 0,
          }}
        />
      </div>
    </div>
  );
};

export default CustomerReview;
