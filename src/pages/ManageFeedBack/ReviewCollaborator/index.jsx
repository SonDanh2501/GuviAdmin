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

const ReviewCollaborator = () => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const [data, setData] = useState([]);
  const [star, setStar] = useState(0);
  const [startPage, setStartPage] = useState(0);
  const [totalRating, setTotalRating] = useState({
    totalFiveStar: 0,
    totalFourStar: 0,
    totalThreeStar: 0,
    totalTwoStar: 0,
    totalOneStar: 0,
  });

  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage")).value
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [valueSearch, setValueSearch] = useState("");
  const [detectLoading, setDetectLoading] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // const toggle = () => setModal(!modal);
  const [modal, setModal] = useState("");
  const [inputModal, setInputModal] = useState(null);
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (startDate !== "") {
      getReviewCollaborator();
    }
  }, [valueSearch, startPage, startDate, lengthPage]);

  const handleSearch = useCallback(
    _debounce((value) => {
      setDetectLoading(value);
      setValueSearch(value);
    }, 500),
    []
  );

  const getAllReviewCollaborator = async (lengthData) => {
    const res = await getDataReviewCollaborator(
      startPage,
      lengthData,
      startDate,
      endDate,
      star
    );
    calculateRating(res);
  };

  const getReviewCollaborator = async () => {
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

      // res.data[i]["service_title"] = res.data[i].service._id.title.vi

      res.data[i]["short_review"] = res.data[i].short_review.toString();
      res.data[i]["full_name_user_system_handle_review"] = res.data[i]
        .id_user_system_handle_review
        ? res.data[i].id_user_system_handle_review.full_name
        : "";

      // res.data[i]["name_service"] = res.data[i].service._id.title.vi
    }
    //
    getAllReviewCollaborator(res?.totalItem);
    setData(res?.data);
    setTotalItem(res?.totalItem);
  };

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
    getReviewCollaborator();
    setModal("");
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "",
      key: "ordinal",
      width: 60,
      fontSize: "text-size-M",
    },
    {
      // title: "Mã Đơn Hàng",
      customTitle: (
        <CustomHeaderDatatable
          title="Mã đơn hàng"
          textToolTip="Mã đơn hàng được đánh giá, nhấn vào để xem chi tiết"
        />
      ),
      dataIndex: "id_view",
      key: "code_order_name_service",
      width: 140,
      fontSize: "text-size-M",
    },
    {
      // i18n_title: 'date_create',
      // title: "Thời Gian",
      customTitle: (
        <CustomHeaderDatatable
          title="Thời Gian"
          textToolTip="Thời gian đánh giá được gửi đến"
        />
      ),
      dataIndex: "date_create_review",
      key: "date_time",
      width: 110,
      fontSize: "text-size-M",
    },
    {
      // i18n_title: "customer",
      // title: "Khách Hàng",
      customTitle: (
        <CustomHeaderDatatable
          title="Khách Hàng"
          textToolTip="Thông tin khách hàng gửi đánh giá"
        />
      ),
      dataIndex: "id_customer",
      key: "customer_full_name",
      width: 140,
      fontSize: "text-size-M",
    },
    {
      // i18n_title: "service",
      // title: "Dịch vụ",\
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
      // title: "Số Sao",
      customTitle: (
        <CustomHeaderDatatable
          title="Số Sao"
          textToolTip="Số sao được đánh giá bởi khách hàng sử dụng dịch vụ"
        />
      ),
      dataIndex: "service_title",
      key: "id_view_name_service",
      width: 130,
      // maxLength: 35,
      fontSize: "text-size-M",
    },
    {
      // i18n_title: 'customer',
      title: "Cộng tác viên",
      dataIndex: "id_collaborator",
      key: "collaborator_no_star",
      width: 190,
      fontSize: "text-size-M",
    },
    {
      // i18n_title: "status",
      customTitle: (
        <CustomHeaderDatatable
          title="Trạng Thái"
          textToolTip="Trạng thái của đánh giá được duyệt bởi nhân viên chăm sóc khách hàng"
        />
      ),
      // title: "Trạng Thái",
      dataIndex: "status_handle_review",
      key: "status_handle_review",
      selectOptions: OPTIONS_SELECT_STATUS_HANDLE_REVIEW,
      width: 140,
      fontSize: "text-size-M",
    },

    {
      // i18n_title: 'address',

      // title: "Đánh Giá",
      customTitle: (
        <CustomHeaderDatatable
          title="Đánh Giá"
          textToolTip="Nội dung đánh giá mà khách hàng gửi"
        />
      ),
      dataIndex: "short_review",
      key: "text",
      width: 200,
      // maxLength: 90,
      fontSize: "text-size-M",
    },
    {
      // title: "Chi Tiết",
      customTitle: (
        <CustomHeaderDatatable
          title="Chi Tiết"
          textToolTip="Chi tiết của đánh giá"
        />
      ),
      dataIndex: "review",
      key: "text",
      width: 200,
      // maxLength: 90,
      fontSize: "text-size-M",
    },





    // {
    //   title: "NV liên hệ",
    //   dataIndex: "full_name_user_system_handle_review",
    //   key: "other",
    //   width: 110,
    //   fontSize: "text-size-M",
    // },
    // {
    //   i18n_title: "note",
    //   dataIndex: "note_admin",
    //   key: "text",
    //   maxLength: 90,
    //   width: 200,
    //   fontSize: "text-size-M",
    // },
  ];

  const showModal = (key) => {
    setModal(key);
    //
  };

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
    setTotalRating({
      // ...totalRating,
      totalFiveStar: totalFiveStarTemp,
      totalFourStar: totalFourStarTemp,
      totalThreeStar: totalThreeStarTemp,
      totalTwoStar: totalTwoStarTemp,
      totalOneStar: totalOneStarTemp,
    });
  };

  const handleFilter = useCallback(
    (star) => {
      // setTotalRating({
      //   totalFiveStar: 0,
      //   totalFourStar: 0,
      //   totalThreeStar: 0,
      //   totalTwoStar: 0,
      //   totalOneStar: 0,
      // });

      setStar(star);

      getDataReviewCollaborator(
        startPage,
        totalItem,
        startDate,
        endDate,
        star
      ).then((res) => {
        setData(res?.data);
        calculateRating(res);
        setTotalItem(res?.totalItem);
      });
    },
    [startPage, lengthPage, startDate, endDate, star]
  );
  //
  //
  return (
    <>
      <div className="div-container-content">
        {/* Label */}
        <div className="div-flex-row">
          <div className="div-header-container">
            <h4 className="title-cv">Đánh giá CTV</h4>
          </div>
          {/* <div className="btn-action-header"></div> */}
        </div>
        {/* Container cho total đánh giá */}
        <div className="flex flex-row gap-8">
          <CardStatistical
            totalStar={totalRating.totalFiveStar}
            totalPercent={calculateNumberPercent(
              totalItem,
              totalRating.totalFiveStar
            )}
            color={"rgb(34 197 94 / 0.25)"}
            icon_color={"#008000"}
          />
          <CardStatistical
            totalStar={totalRating.totalFourStar}
            totalPercent={calculateNumberPercent(
              totalItem,
              totalRating.totalFourStar
            )}
            color={"rgb(132 204 22 / 0.25)"}
            icon_color={"#2fc22f"}
          />
          <CardStatistical
            totalStar={totalRating.totalThreeStar}
            totalPercent={calculateNumberPercent(
              totalItem,
              totalRating.totalThreeStar
            )}
            color={"rgb(234 179 8 / 0.25)"}
            icon_color={"#FFD700"}
          />
          <CardStatistical
            totalStar={totalRating.totalTwoStar}
            totalPercent={calculateNumberPercent(
              totalItem,
              totalRating.totalTwoStar
            )}
            color={"rgb(249 115 22 / 0.25)"}
            icon_color={"#FFA500"}
          />
          <CardStatistical
            totalStar={totalRating.totalOneStar}
            totalPercent={calculateNumberPercent(
              totalItem,
              totalRating.totalOneStar
            )}
            color={"rgb(239 68 68 / 0.25)"}
            icon_color={"#FF0000"}
          />
          {/*<div className="w-1/5 rounded-xl bg-white card-shadow flex flex-col px-2 py-2.5">
            <div className="flex px-2 py-3 items-center gap-2 h-1/3 bg-green-500/25 rounded-lg">
              <IoStar
                size="1.2rem"
                color="#008000" // green
                style={{ marginBottom: "2px" }}
              />
              <span className=" uppercase font-bold">Đánh giá 5 sao</span>
            </div>
            <div className="h-2/3 flex my-2">
              <span className="w-1/2 flex flex-col items-center justify-center border-r-2">
                <span>Số lượng</span>
                <span className="font-bold">{totalRating.totalFiveStar}</span>
              </span>
              <span className="w-1/2 flex flex-col items-center justify-center">
                <span>Chiếm</span>
                <span className="font-bold">
                  {calculateNumberPercent(totalItem, totalRating.totalFiveStar)}{" "}
                  %
                </span>
              </span>
            </div>
          </div>
           <div className="w-1/5 rounded-xl bg-white card-shadow flex flex-col px-2 py-2.5">
            <div className="flex px-2 py-3 items-center gap-2 h-1/3 bg-lime-500/25 rounded-lg">
              <IoStar
                size="1.2rem"
                color="#2fc22f" // light green
                style={{ marginBottom: "2px" }}
              />
              <span className=" uppercase font-bold">Đánh giá 4 sao</span>
            </div>
            <div className="h-2/3 flex my-2">
              <span className="w-1/2 flex flex-col items-center justify-center border-r-2">
                <span>Số lượng</span>
                <span className="font-bold">{totalRating.totalFourStar}</span>
              </span>
              <span className="w-1/2 flex flex-col items-center justify-center">
                <span>Chiếm</span>
                <span className="font-bold">
                  {calculateNumberPercent(totalItem, totalRating.totalFourStar)}{" "}
                  %
                </span>
              </span>
            </div>
          </div>
          <div className="w-1/5 rounded-xl bg-white card-shadow flex flex-col px-2 py-2.5">
            <div className="flex px-2 py-3 items-center gap-2 h-1/3 bg-yellow-500/25 rounded-lg">
              <IoStar
                size="1.2rem"
                color="#FFD700"
                style={{ marginBottom: "2px" }}
              />
              <span className=" uppercase font-bold">Đánh giá 3 sao</span>
            </div>
            <div className="h-2/3 flex my-2">
              <span className="w-1/2 flex flex-col items-center justify-center border-r-2">
                <span>Số lượng</span>
                <span className="font-bold">{totalRating.totalThreeStar}</span>
              </span>
              <span className="w-1/2 flex flex-col items-center justify-center">
                <span>Chiếm</span>
                <span className="font-bold">
                  {calculateNumberPercent(
                    totalItem,
                    totalRating.totalThreeStar
                  )}{" "}
                  %
                </span>
              </span>
            </div>
          </div>
          <div className="w-1/5 rounded-xl bg-white card-shadow flex flex-col px-2 py-2.5">
            <div className="flex px-2 py-3 items-center gap-2 h-1/3 bg-orange-500/25 rounded-lg">
              <IoStar
                size="1.2rem"
                color="#FFA500" // orange
                style={{ marginBottom: "2px" }}
              />
              <span className=" uppercase font-bold">Đánh giá 2 sao</span>
            </div>
            <div className="h-2/3 flex my-2">
              <span className="w-1/2 flex flex-col items-center justify-center border-r-2">
                <span>Số lượng</span>
                <span className="font-bold">{totalRating.totalTwoStar}</span>
              </span>
              <span className="w-1/2 flex flex-col items-center justify-center">
                <span>Chiếm</span>
                <span className="font-bold">
                  {calculateNumberPercent(totalItem, totalRating.totalTwoStar)}{" "}
                  %
                </span>
              </span>
            </div>
          </div>
          <div className="w-1/5 rounded-xl bg-white card-shadow flex flex-col px-2 py-2.5">
            <div className="flex px-2 py-3 items-center gap-2 h-1/3 bg-red-500/25 rounded-lg">
              <IoStar
                size="1.2rem"
                color="red"
                style={{ marginBottom: "2px" }}
              />
              <span className=" uppercase font-bold">Đánh giá 1 sao</span>
            </div>
            <div className="h-2/3 flex my-2">
              <span className="w-1/2 flex flex-col items-center justify-center border-r-2">
                <span>Số lượng</span>
                <span className="font-bold">{totalRating.totalOneStar}</span>
              </span>
              <span className="w-1/2 flex flex-col items-center justify-center">
                <span>Chiếm</span>
                <span className="font-bold">
                  {calculateNumberPercent(totalItem, totalRating.totalOneStar)}{" "}
                  %
                </span>
              </span>
            </div>
          </div> */}
        </div>
        <div className="bg-white rounded-xl my-4 p-4 card-shadow border-gray-300 border">
          <div className="flex gap-6">
            <div className="w-3/4 flex gap-4">
              {/* Lịch */}
              <div className="flex flex-col gap-1">
                <div>
                  <span className="font-bold">Khoảng thời gian</span>
                </div>
                <div className="flex gap-2">
                  <RangeDatePicker
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    onCancel={() => {}}
                    defaults={"thirty_last"}
                  />
                  <div className="border rounded-md flex justify-center items-center px-[10px] py-[6.4px]">
                    <p className="m-0 text-date-same">
                      Khoảng ngày: {moment(startDate).format("DD/MM/YYYY")}-
                      {moment(endDate).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
              </div>
              {/* Bộ lọc */}
              <div className="flex flex-col gap-1 min-w-[150px]">
                <div>
                  <span className="font-bold">Đánh giá</span>
                </div>
                <div className="">
                  <Select
                    value={star}
                    // style={{ width: width <= 490 ? "100%" : "18%" }}
                    onChange={handleFilter}
                    style={{ width: "100%" }}
                    options={[
                      { value: 0, label: `${i18n.t("Tất cả", { lng: lang })}` },
                      { value: 5, label: `5 ${i18n.t("star", { lng: lang })}` },
                      { value: 4, label: `4 ${i18n.t("star", { lng: lang })}` },
                      { value: 3, label: `3 ${i18n.t("star", { lng: lang })}` },
                      { value: 2, label: `2 ${i18n.t("star", { lng: lang })}` },
                      { value: 1, label: `1 ${i18n.t("star", { lng: lang })}` },
                    ]}
                    defaultValue={"Tất cả"}
                  />
                </div>
              </div>
            </div>
            {/* Tìm kiếm  */}
            <div className="w-1/4 flex flex-col gap-1">
              <div>
                <span className="font-bold">Tìm kiếm</span>
              </div>
              <div className="">
                <Input
                  placeholder={`${i18n.t("search", { lng: lang })}`}
                  value={valueSearch}
                  prefix={<SearchOutlined />}
                  // className="input-search"
                  onChange={(e) => {
                    handleSearch(e.target.value);
                    setValueSearch(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          {/* table */}
          <div>
            <DataTable
              columns={columns}
              data={data}
              actionColumn={addActionColumn}
              start={startPage}
              pageSize={lengthPage}
              totalItem={totalItem}
              onCurrentPageChange={onChangePage}
              detectLoading={detectLoading}
              onChangeValue={onChangePropsValue}
              setLengthPage={setLengthPage}
              // onShowModal={onShowModal}
              getItemRow={setItem}
            />
          </div>
        </div>
      </div>
      <ModalNoteAdmin
        isShow={modal === "update_handle_review" ? true : false}
        item={item}
        handleOk={(payload) => processHandleReview(payload)}
        handleCancel={setModal}
      />
      {/* {isLoading && <LoadingPagination />} */}
      {/* <DeleteModal isShow={(modal === "delete") ? true : false} item={item} handleOk={(payload) => processHandleReview(payload)} handleCancel={setModal}/> */}
    </>
  );
};

export default ReviewCollaborator;
