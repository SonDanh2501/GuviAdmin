import { Pagination, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { getReviewCollaborator } from "../../../../../../../api/collaborator";
import "./index.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import i18n from "../../../../../../../i18n";

const Review = ({ id, totalReview }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getReviewCollaborator(id, 0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [id]);

  const onChange = (page) => {
    setCurrentPage(page);
    const lengthData = data?.length < 20 ? 20 : data.length;
    const start = page * lengthData - lengthData;
    getReviewCollaborator(id, start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const columns = [
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("date_create", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <div className="time-review">
            <a className="text-time">
              {moment(new Date(data?.date_create_review)).format("DD/MM/YYYY")}
            </a>
            <a className="text-time">
              {moment(new Date(data?.date_create_review)).format("HH:mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("assessor", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <a className="name-customer-reivew">{data?.id_customer?.full_name}</a>
        );
      },
      align: "center",
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("number_star", {
            lng: lang,
          })}`}</a>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="name-customer-reivew">
            {data?.star} <i class="uil uil-star icon-star"></i>
          </a>
        );
      },
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("content", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return <a className="text-quick_review">{data?.review}</a>;
      },
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("quick_review", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <div>
            {data?.short_review?.map((item) => (
              <a className="text-quick_review">{item}</a>
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
          {`${i18n.t("total_review", { lng: lang })}`}: {totalReview}
          <i class="uil uil-star icon-star"></i>
        </a>
      </div>

      <div className="mt-3">
        <Table columns={columns} dataSource={data} pagination={false} />

        <div className="div-pagination p-2">
          <a>
            {`${i18n.t("total", { lng: lang })}`}: {total}
          </a>
          <div>
            <Pagination
              current={currentPage}
              onChange={onChange}
              total={total}
              showSizeChanger={false}
              pageSize={20}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
