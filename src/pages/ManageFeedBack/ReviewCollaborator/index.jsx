import React, { useCallback, useEffect, useState } from "react";
import { Dropdown, Space, Input, Select, ConfigProvider } from "antd";
import { UilEllipsisV } from "@iconscout/react-unicons";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import DataTable from "../../../components/tables/dataTable";
import RangeDatePicker from "../../../components/datePicker/RangeDatePicker";
import {
  getDataReviewCollaborator,
  updateProcessHandleReview,
} from "../../../api/feedback";
import { useSelector } from "react-redux";
import _debounce from "lodash/debounce";
import ModalNoteAdmin from "./components/NoteAdminModal";
import i18n from "../../../i18n";
import { OPTIONS_SELECT_STATUS_HANDLE_REVIEW } from "../../../@core/constant/constant";

import "./index.scss";
import DeleteModal from "./components/DeleteModal";
import LoadingPagination from "../../../components/paginationLoading";
import CustomHeaderDatatable from "../../../components/tables/tableHeader";
import CardStatistical from "../../../components/card/cardStatistical";
import { IoStar } from "react-icons/io5";
import { calculateNumberPercent } from "../../../utils/contant";
import FilterData from "../../../components/filterData";
import ButtonCustom from "../../../components/button";
import InputTextCustom from "../../../components/inputCustom";
import { errorNotify } from "../../../helper/toast";
import CardCustomerSatisfication from "../../../components/card/cardCustomerSatisfication";
import { getReportCustomerStatisfaction } from "../../../api/report";

const ReviewCollaborator = () => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const [startPage, setStartPage] = useState(0);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  /* ~~~ Value ~~~ */
  const [data, setData] = useState([]);
  const [star, setStar] = useState(0);
  const [dataCustomerSatisfication, setDataCustomerSatisfication] = useState(
    []
  );
  const [totalRating, setTotalRating] = useState([
    {
      total: 0,
      percent: 0,
      color: "rgb(34 197 94 / 0.25)",
      colorIcon: "#008000",
      label: "Đánh giá 5 sao",
    },
    {
      total: 0,
      percent: 0,
      color: "rgb(132 204 22 / 0.25)",
      colorIcon: "#2fc22f",
      label: "Đánh giá 4 sao",
    },
    {
      total: 0,
      percent: 0,
      color: "rgb(234 179 8 / 0.25)",
      colorIcon: "#FFD700",
      label: "Đánh giá 3 sao",
    },
    {
      total: 0,
      percent: 0,
      color: "rgb(249 115 22 / 0.25)",
      colorIcon: "#FFA500",
      label: "Đánh giá 2 sao",
    },
    {
      total: 0,
      percent: 0,
      color: "rgb(239 68 68 / 0.25)",
      colorIcon: "#FF0000",
      label: "Đánh giá 1 sao",
    },
  ]);
  const [valueSearch, setValueSearch] = useState("");
  const [detectLoading, setDetectLoading] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modal, setModal] = useState("");
  const [inputModal, setInputModal] = useState(null);
  const [item, setItem] = useState(null);
  /* ~~~ List ~~~ */
  const columns = [
    {
      title: "STT",
      dataIndex: "",
      key: "ordinal",
      width: 60,
      fontSize: "text-size-M",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Mã đơn hàng"
          textToolTip="Mã đơn hàng được đánh giá, nhấn vào để xem chi tiết"
        />
      ),
      dataIndex: "id_view",
      key: "code_order_name_service",
      width: 145,
      fontSize: "text-size-M",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Ngày đánh giá"
          textToolTip="Thời gian đánh giá được tạo ra"
        />
      ),
      dataIndex: "date_create_review",
      key: "date_time",
      width: 130,
      fontSize: "text-size-M",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Khách Hàng"
          textToolTip="Thông tin khách hàng gửi đánh giá"
        />
      ),
      dataIndex: "id_customer",
      key: "customer_name_phone",
      width: 140,
      fontSize: "text-size-M",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Dịch Vụ"
          textToolTip="Dịch vụ được lựa chọn"
        />
      ),
      dataIndex: "service._id.title.vi",
      key: "service_customer",
      width: 130,
      fontSize: "text-size-M",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Số Sao"
          textToolTip="Số sao được đánh giá bởi khách hàng sử dụng dịch vụ"
        />
      ),
      dataIndex: "service_title",
      key: "id_view_name_service",
      width: 125,
      fontSize: "text-size-M",
    },
    {
      title: "Cộng tác viên",
      dataIndex: "id_collaborator",
      key: "collaborator_no_star",
      width: 145,
      fontSize: "text-size-M",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Trạng Thái"
          textToolTip="Trạng thái của đánh giá được duyệt bởi nhân viên chăm sóc khách hàng"
        />
      ),
      dataIndex: "status_handle_review",
      key: "status_handle_review",
      selectOptions: OPTIONS_SELECT_STATUS_HANDLE_REVIEW,
      width: 150,
      fontSize: "text-size-M",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Đánh Giá"
          textToolTip="Nội dung đánh giá mà khách hàng gửi"
        />
      ),
      dataIndex: "short_review",
      key: "text",
      width: 190,
      fontSize: "text-size-M",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Chi Tiết"
          textToolTip="Chi tiết của đánh giá"
        />
      ),
      dataIndex: "review",
      key: "text",
      width: 190,
      fontSize: "text-size-M",
    },
  ];
  let items = [
    // {
    //   key: "0",
    //   label: checkElement?.includes("delete_request_service") &&
    //     (<p className="m-0" onClick={()=>showModal("delete")}>{`${i18n.t("delete", { lng: lang })}`}</p>)
    // },
    {
      key: "0",
      label: checkElement?.includes("delete_request_service") && (
        <p className="m-0" onClick={() => showModal("update_handle_review")}>
          Cập nhật ghi chú
        </p>
      ),
    },
  ];

  items = items.filter((x) => x.label !== false);
  const ratingList = [
    { code: 0, label: `${i18n.t("Tất cả", { lng: lang })}` },
    { code: 5, label: `5 ${i18n.t("star", { lng: lang })}` },
    { code: 4, label: `4 ${i18n.t("star", { lng: lang })}` },
    { code: 3, label: `3 ${i18n.t("star", { lng: lang })}` },
    { code: 2, label: `2 ${i18n.t("star", { lng: lang })}` },
    { code: 1, label: `1 ${i18n.t("star", { lng: lang })}` },
  ];
  /* ~~~ Use effect ~~~ */
  // 1. Fetch dữ liệu bảng
  useEffect(() => {
    if (startDate !== "" && endDate !== "") {
      fetchReviewCollaborator();
    }
  }, [valueSearch, startPage, startDate, endDate, lengthPage, star]);
  // 2. Fetch dữ liệu thống kê
  useEffect(() => {
    if (totalItem > 0) fetchAllReviewCollaborator(totalItem);
  }, [valueSearch, startDate, endDate, totalItem]);
  // 3. Fetch dữ liệu CSAT
  // useEffect(() => {
  //   fetchCustomerSatisfactionReport();
  // }, [startDate, endDate]);
  /* ~~~ Handle function ~~~ */
  // 1. Fetch toàn bộ đánh giá để thống kê
  const fetchAllReviewCollaborator = async (lengthData) => {
    try {
      const res = await getDataReviewCollaborator(
        0,
        lengthData,
        startDate,
        endDate,
        star
      );
      calculateRating(res);
    } catch (err) {
      errorNotify({
        message: err,
      });
    }
  };
  // 2. Fetch đánh giá theo phân trang
  const fetchReviewCollaborator = async () => {
    setIsLoading(true);
    const res = await getDataReviewCollaborator(
      startPage,
      lengthPage,
      startDate,
      endDate,
      star
    );
    for (let i = 0; i < res.data.length; i++) {
      res.data[i]["service_title"] =
        res.data[i].service._id._id === "654dd5598b3f1a21b7011e3f"
          ? "Rèm - Thảm - Sofa"
          : res.data[i].service._id.title.vi;
      res.data[i]["short_review"] = res.data[i].short_review.toString();
      res.data[i]["full_name_user_system_handle_review"] = res.data[i]
        .id_user_system_handle_review
        ? res.data[i].id_user_system_handle_review.full_name
        : "";
    }
    setData(res?.data);
    setTotalItem(res?.totalItem);
    setIsLoading(false);
  };
  // 3. Hàm search
  const handleSearch = useCallback(
    _debounce((value) => {
      setDetectLoading(value);
      setValueSearch(value);
    }, 500),
    []
  );
  // 4. Fetch chỉ số CAST
  const fetchCustomerSatisfactionReport = async () => {
    const res = await getReportCustomerStatisfaction(startDate, endDate);
    setDataCustomerSatisfication(res);
  };
  /* ~~~ Other ~~~ */
  const onChangePage = (value) => {
    setStartPage(value);
  };
  const onChangePropsValue = async (props) => {
    if (props.dataIndex === "status_handle_review") {
      setModal("update_handle_review");
    }
  };
  const processHandleReview = async (dataChange) => {
    const payload = {
      id_order: item._id,
      note_admin: dataChange.note_admin,
      status_handle_review: dataChange.status_handle_review,
    };
    //
    await updateProcessHandleReview(payload);
    fetchReviewCollaborator();
    setModal("");
  };
  const showModal = (key) => {
    setModal(key);
    //
  };
  const addActionColumn = {
    i18n_title: "",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 55,
    render: () => (
      <Space size="middle">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <a>
            <UilEllipsisV />
          </a>
        </Dropdown>
      </Space>
    ),
  };
  const calculateRating = (data) => {
    let totalFiveStarTemp = 0;
    let totalFourStarTemp = 0;
    let totalThreeStarTemp = 0;
    let totalTwoStarTemp = 0;
    let totalOneStarTemp = 0;
    // Vòng lặp từng page
    data?.data.forEach((rating) => {
      if (rating.star === 5) totalFiveStarTemp += 1;
      if (rating.star === 4) totalFourStarTemp += 1;
      if (rating.star === 3) totalThreeStarTemp += 1;
      if (rating.star === 2) totalTwoStarTemp += 1;
      if (rating.star === 1) totalOneStarTemp += 1;
    });
    const totalRatings =
      totalFiveStarTemp +
      totalFourStarTemp +
      totalThreeStarTemp +
      totalTwoStarTemp +
      totalOneStarTemp;
    setTotalRating((prevTotalRating) => [
      {
        ...prevTotalRating[0],
        total: totalFiveStarTemp,
        percent: calculateNumberPercent(totalRatings, totalFiveStarTemp),
      },
      {
        ...prevTotalRating[1],
        total: totalFourStarTemp,
        percent: calculateNumberPercent(totalRatings, totalFourStarTemp),
      },
      {
        ...prevTotalRating[2],
        total: totalThreeStarTemp,
        percent: calculateNumberPercent(totalRatings, totalThreeStarTemp),
      },
      {
        ...prevTotalRating[3],
        total: totalTwoStarTemp,
        percent: calculateNumberPercent(totalRatings, totalTwoStarTemp),
      },
      {
        ...prevTotalRating[4],
        total: totalOneStarTemp,
        percent: calculateNumberPercent(totalRatings, totalOneStarTemp),
      },
    ]);
  };
  const filterLeftContent = () => {
    return (
      <div className="review-collaborator__searching">
        <InputTextCustom
          type="text"
          placeHolderNormal="Tìm kiếm"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>
    );
  };
  const filterRightContent = () => {
    return (
      <div>
        <ButtonCustom
          label="Loại đánh giá"
          options={ratingList}
          value={star}
          setValueSelectedProps={setStar}
        />
      </div>
    );
  };

  /* ~~~ Main ~~~ */
  return (
    <div className="review-collaborator">
      {/* Header */}
      <div className="review-collaborator__header">
        <span>Đánh giá đối tác</span>
      </div>
      {/* Thẻ CSAT */}
      {/* <div>
        <CardCustomerSatisfication data={dataCustomerSatisfication[0]} />
      </div> */}
      {/* Các thẻ đánh giá */}
      <div className="review-collaborator__statistic">
        {totalRating.map((rating) => (
          <CardStatistical
            label={rating.label}
            totalStar={rating.total}
            totalPercent={rating.percent}
            color={rating.color}
            icon_color={rating.colorIcon}
          />
        ))}
      </div>
      {/* Filter */}
      <FilterData
        isTimeFilter={true}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        leftContent={filterLeftContent()}
        rightContent={filterRightContent()}
      />
      {/* Total */}
      <DataTable
        columns={columns}
        data={data}
        actionColumn={addActionColumn}
        start={startPage}
        pageSize={lengthPage}
        totalItem={totalItem}
        onCurrentPageChange={onChangePage}
        loading={isLoading}
        detectLoading={detectLoading}
        onChangeValue={onChangePropsValue}
        setLengthPage={setLengthPage}
        // onShowModal={onShowModal}
        getItemRow={setItem}
      />
      {/* Modal Update Note */}
      <ModalNoteAdmin
        isShow={modal === "update_handle_review" ? true : false}
        item={item}
        handleOk={(payload) => processHandleReview(payload)}
        handleCancel={setModal}
      />
    </div>
  );
};

export default ReviewCollaborator;
