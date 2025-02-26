import { Pagination, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { getReviewCollaborator } from "../../../../../../../api/collaborator";
import "./index.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import i18n from "../../../../../../../i18n";
import useWindowDimensions from "../../../../../../../helper/useWindowDimensions";
import CardInfo from "../../../../../../../components/card";
import DataTable from "../../../../../../../components/tables/dataTable";
import FilterData from "../../../../../../../components/filterData";

const Review = ({ id, totalReview }) => {
  const [timePeriod, setTimePeriod] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [startPage, setStartPage] = useState(0);

  const onChangePage = (value) => {
    setStartPage(value);
  };

  const columns = [
    {
      title: "Ngày tạo",
      // dataIndex: "",
      key: "rating_date",
      width: 60,
      FontSize: "text-size-M",
    },
    {
      title: "Khách hàng đánh giá",
      // dataIndex: "",
      key: "customer_name_phone",
      width: 60,
      FontSize: "text-size-M",
    },
    {
      title: "Số sao đánh giá",
      // dataIndex: "",
      key: "id_view_name_service",
      width: 60,
      FontSize: "text-size-M",
    },
    {
      title: "Nội dung",
      dataIndex: "review",
      key: "text",
      width: 60,
      FontSize: "text-size-M",
    },
    {
      title: "Đánh giá nhanh",
      dataIndex: "short_review",
      key: "text",
      width: 60,
      FontSize: "text-size-M",
    },
  ];

  useEffect(() => {
    getReviewCollaborator(id, startPage, lengthPage)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [id, startPage, lengthPage]);

  return (
    <div className="collaborator-rating">
      <div className="collaborator-rating__overview">
        {/* Thẻ thống kê lượt đánh giá theo năm */}
        <div className="collaborator-rating__overview--statistic">
          <CardInfo
            collaboratorRatingStatistic={true}
            collaboratorId={id}
            cardHeader="Thống kê đánh giá"
            timePeriod={timePeriod}
            supportIcon={true}
          />
        </div>
        {/* Thẻ tổng lượt đánh giá */}
        <div className="collaborator-rating__overview--total">
          <CardInfo
            collaboratorRatingStar={true}
            collaboratorId={id}
            cardHeader="Số lượt đánh giá"
            collaboratorStar={totalReview}
          />
        </div>
      </div>
      {/* Acvitiy Log */}
      <div className="collaborator-rating__activity-bar shadow">
        <div className="collaborator-rating__activity-bar--header">
          <span>
            Thống kê
          </span>
          <span>
            
          </span>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        start={startPage}
        pageSize={lengthPage}
        setLengthPage={setLengthPage}
        totalItem={total}
        onCurrentPageChange={onChangePage}
      />
    </div>
  );
};

export default Review;
