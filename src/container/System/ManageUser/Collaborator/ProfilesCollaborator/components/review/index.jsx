import { Pagination, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { getReviewCollaborator } from "../../../../../../../api/collaborator";
import "./index.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import i18n from "../../../../../../../i18n";
import useWindowDimensions from "../../../../../../../helper/useWindowDimensions";

const Review = ({ id, totalReview }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { width } = useWindowDimensions();
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
          <p className="title-column">{`${i18n.t("date_create", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <div className="time-review">
            <p className="text-time">
              {moment(new Date(data?.date_create_review)).format("DD/MM/YYYY")}
            </p>
            <p className="text-time">
              {moment(new Date(data?.date_create_review)).format("HH:mm")}
            </p>
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("assessor", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <p className="name-customer-reivew">{data?.id_customer?.full_name}</p>
        );
      },
      align: "center",
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("number_star", {
            lng: lang,
          })}`}</p>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="name-customer-reivew">
            {data?.star} <i class="uil uil-star icon-star"></i>
          </p>
        );
      },
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("content", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return <p className="text-quick_review">{data?.review}</p>;
      },
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("quick_review", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <div>
            {data?.short_review?.map((item) => (
              <p className="text-quick_review">{item}</p>
            ))}
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div>
        <p className="text-total-star">
          {`${i18n.t("total_review", { lng: lang })}`}: {totalReview}
          <i class="uil uil-star icon-star"></i>
        </p>
      </div>

      <div className="mt-3">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: width < 900 ? 1000 : 0 }}
        />

        <div className="div-pagination p-2">
          <p>
            {`${i18n.t("total", { lng: lang })}`}: {total}
          </p>
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
