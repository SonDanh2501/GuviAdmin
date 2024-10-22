import { Pagination, Table } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getHistoryOrderCollaborator,
  getHistoryActivityCollaborator,
} from "../../../../../../../api/collaborator";
import { errorNotify } from "../../../../../../../helper/toast";
import useWindowDimensions from "../../../../../../../helper/useWindowDimensions";
import i18n from "../../../../../../../i18n";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import "./index.scss";
import FilterData from "../../../../../../../components/filterData/filterData";
import DataTable from "../../../../../../../components/tables/dataTable";
import CardInfo from "../../../../../../../components/card";
import CardTotalValue from "../../../../../../../components/card/cardTotalValue";

import CardBarChart from "../../../../../../../components/card/cardBarChart";

import icons from "../../../../../../../utils/icons";
import CardActivityLog from "../../../../../../../components/card/cardActivityLog";

const {
  IoLogoUsd,
  IoTrendingUp,
  IoTime,
  IoStatsChart,
  IoCalendarNumber,
  IoTrendingDown,
  IoStatsChartOutline,
  IoTimeOutline,
  IoCalendarNumberOutline,
  IoCubeOutline,
  IoPieChartOutline,
} = icons;

const Activity = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lang = useSelector(getLanguageState);
  const { width } = useWindowDimensions();
  const [startPageOrder, setStartPageOrder] = useState(0);
  const [startPageHistoryActivities, setStartPageHistoryActivities] =
    useState(0);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  /* ~~~ Value ~~~ */
  const [dataHistoryOrderCollaborator, setDataHistoryOrderCollaborator] =
    useState([]);
  const [
    dataHistoryActivitiesCollaborator,
    setDataHistoryActivitiesCollaborator,
  ] = useState([]);
  const [timePeriod, setTimePeriod] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [valueActivityStatistics, setValueActivityStatistics] = useState([
    {
      label: "Tổng đơn đến nay",
      value: 0,
      icon: IoCubeOutline,
      color: "green",
    },
    {
      label: "Tổng đơn tháng này",
      value: 0,
      icon: IoCalendarNumberOutline,
      color: "red",
    },
    {
      label: "Tổng đơn năm trước",
      value: 0,
      icon: IoStatsChartOutline,
      color: "blue",
    },
    {
      label: "Tổng đơn năm nay",
      value: 0,
      icon: IoPieChartOutline,
      color: "yellow",
    },
  ]);

  /* ~~~ List ~~~ */
  // 1. Danh sách các cột trong bảng
  const columns = [
    {
      title: "Mã đơn",
      // dataIndex: "",
      key: "code_order",
      width: 60,
      FontSize: "text-size-M",
    },
    {
      title: "Khách hàng",
      // dataIndex: "",
      key: "customer_name_phone",
      width: 55,
      FontSize: "text-size-M",
    },
    {
      title: "Dịch vụ",
      // dataIndex: "review",
      key: "service",
      width: 50,
      FontSize: "text-size-M",
    },
    {
      title: "Ngày làm",
      // dataIndex: "short_review",
      key: "date_work",
      width: 50,
      FontSize: "text-size-M",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "text",
      width: 70,
      FontSize: "text-size-M",
    },
    {
      title: "Phương thức thanh toán",
      // dataIndex: "short_review",
      key: "pay",
      width: 70,
      FontSize: "text-size-M",
    },
    {
      title: "Trạng thái",
      // dataIndex: "short_review",
      key: "status",
      width: 50,
      FontSize: "text-size-M",
    },
  ];
  // 2. Danh sách đơn hàng thống kê theo tháng
  const orderDataStatistic = [
    {
      name: "Thg 1",
      value: 4,
    },
    {
      name: "Thg 2",
      value: 5,
    },
    {
      name: "Thg 3",
      value: 6,
    },
    {
      name: "Thg 4",
      value: 7,
    },
    {
      name: "Thg 5",
      value: 1,
    },
    {
      name: "Thg 6",
      value: 7,
    },
    {
      name: "Thg 7",
      value: 7,
    },
    {
      name: "Thg 8",
      value: 9,
    },
    {
      name: "Thg 9",
      value: 11,
    },
    {
      name: "Thg 10",
      value: 5,
    },
    {
      name: "Thg 11",
      value: 13,
    },
    {
      name: "Thg 12",
      value: 1,
    },
  ];
  /* ~~~ Handle function ~~~ */
  // 1. Hàm xử lý khi chuyển trang bảng lịch sử đơn hàng
  const onChangePageOrder = (value) => {
    setStartPageOrder(value);
  };
  // 2. Hàm xử lý khi chuyển trang lịch sử hoạt động
  const onChangePageHistoryActivity = (value) => {
    setStartPageHistoryActivities(value);
  };
  // 3. Hàm fetch dữ liệu đơn hàng của đối tác
  const fetchHistoryOrderCollaborator = async (id, start, length) => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await getHistoryOrderCollaborator(id, start, length);
      setDataHistoryOrderCollaborator(res);
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      console.log("Lỗi lấy dữ liệu đơn hàng: ", err);
    }
  };
  // 4. Hàm fetch dữ liệu lịch sử hoạt động (lịch sử hoạt động là phần tử cha của lịch sử trạng thái)
  const fetchHistoryActivitiesCollaborator = async (id, start, length) => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await getHistoryActivityCollaborator(id, start, length);
      setDataHistoryActivitiesCollaborator(res);
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      console.log("Lỗi lấy dữ liệu lịch sử hoạt động: ", err);
    }
  };
  /* ~~~ Use effect ~~~ */
  // 1. Fetch giá trị lịch sử đơn hàng của đối tác
  useEffect(() => {
    fetchHistoryOrderCollaborator(id, startPageOrder, lengthPage);
  }, [id, dispatch, startPageOrder, lengthPage]);
  // 2. Fetch giá trị lịch sử hoạt động của đối tác
  useEffect(() => {
    fetchHistoryActivitiesCollaborator(
      id,
      startPageHistoryActivities,
      lengthPage
    );
  }, [id, dispatch, startPageHistoryActivities, lengthPage]);
  /* ~~~ Main ~~~ */
  return (
    <div className="collaborator-activity">
      {/* Các thẻ thống kê (hiện tại đang ẩn đi chừng nào viết xong api thì mở ra và truyền dữ liệu vào) */}
      <div className="collaborator-activity__statistics">
        <div className="collaborator-activity__statistics--overview grid-column-2">
          {valueActivityStatistics.map((item, index) => {
            return (
              <CardInfo
                cardContent={
                  <CardTotalValue
                    label={item.label}
                    total={item.value}
                    previousCompare="0"
                    IconComponent={item.icon}
                    color={item.color}
                  />
                }
              />
            );
          })}
        </div>
        <div className="collaborator-activity__statistics--chart">
          <CardInfo
            cardHeader="Thống kê đơn hàng"
            cardContent={
              <CardBarChart
                data={orderDataStatistic}
                height={220}
                verticalValue="value"
                // verticalLine={true}
                horizontalValue="name"
                horizontalLine={true}
                chartUnit="đơn hàng"
                total={20}
                color="#bbf7d0"
                colorTotal="#22c55e"
              />
            }
            supportIcon={true}
          />
        </div>
      </div>
      {/* Lịch sử đơn hàng và Lịch sử hoạt động */}
      <div className="collaborator-activity__history">
        <div className="collaborator-activity__history--order">
          <DataTable
            columns={columns}
            data={dataHistoryOrderCollaborator?.data || []}
            start={startPageOrder}
            pageSize={lengthPage}
            setLengthPage={setLengthPage}
            totalItem={dataHistoryOrderCollaborator?.totalItem || 0}
            onCurrentPageChange={onChangePageOrder}
          />
        </div>
        {/* Lịch sử đơn hàng */}
        <div className="collaborator-activity__history--activities">
          <div className="collaborator-activity__history--activities-activity">
            <CardInfo
              cardHeader="Lịch sử hoạt động"
              cardContent={
                <CardActivityLog
                  data={dataHistoryActivitiesCollaborator?.data}
                  totalItem={dataHistoryActivitiesCollaborator?.totalItem}
                  dateIndex="date_create"
                  statusIndex="type"
                  pageSize={lengthPage}
                  setLengthPage={setLengthPage}
                  onCurrentPageChange={onChangePageHistoryActivity}
                  pagination={true}
                />
              }
            />
          </div>
          {/* <div className="collaborator-activity__history--activities-activity">
            <CardInfo
              cardHeader="Lịch sử trạng thái"
              cardContent={
                <CardActivityLog
                  data={dataHistoryActivitiesCollaborator?.data}
                  totalItem={dataHistoryActivitiesCollaborator?.totalItem}
                  dateIndex="date_create"
                  statusIndex="type"
                  start={startPageOrder}
                  pageSize={lengthPage}
                  setLengthPage={setLengthPage}
                  onCurrentPageChange={onChangePageOrder}
                />
              }
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default memo(Activity);

// const columns = [
//   {
//     title: () => {
//       return (
//         <p className="title-column">{`${i18n.t("code_order", {
//           lng: lang,
//         })}`}</p>
//       );
//     },
//     render: (data) => {
//       return (
//         <p
//           className="text-id-activity"
//           onClick={() =>
//             navigate(
//               "/system/collaborator-manage/details-collaborator/details-activity",
//               {
//                 state: { idOrder: data?._id, idCollaborator: id },
//               }
//             )
//           }
//         >
//           {data?.id_view}
//         </p>
//       );
//     },
//   },
//   {
//     title: () => {
//       return (
//         <p className="title-column">{`${i18n.t("date_create", {
//           lng: lang,
//         })}`}</p>
//       );
//     },
//     render: (data) => {
//       return (
//         <div className="div-create-activity">
//           <p className="text-create">
//             {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
//           </p>
//           <p className="text-create">
//             {moment(new Date(data?.date_create)).format("HH:mm")}
//           </p>
//         </div>
//       );
//     },
//     responsive: ["xl"],
//   },
//   {
//     title: () => {
//       return (
//         <p className="title-column">{`${i18n.t("customer", {
//           lng: lang,
//         })}`}</p>
//       );
//     },
//     render: (data) => {
//       return (
//         <Link
//           to={`/profile-customer/${data?.id_customer?._id}`}
//           className="div-name-activity"
//         >
//           <p className="text-name-customer">{data?.id_customer?.full_name}</p>
//           <p className="text-phone-customer">{data?.id_customer?.phone}</p>
//         </Link>
//       );
//     },
//   },
//   {
//     title: () => {
//       return (
//         <p className="title-column">{`${i18n.t("service", {
//           lng: lang,
//         })}`}</p>
//       );
//     },
//     render: (data) => {
//       return (
//         <div className="div-service-activity">
//           <p className="text-service">
//             {data?.type === "loop" && data?.is_auto_order
//               ? `${i18n.t("repeat", { lng: lang })}`
//               : data?.service?._id?.kind === "giup_viec_theo_gio"
//               ? `${i18n.t("cleaning", { lng: lang })}`
//               : data?.service?._id?.kind === "giup_viec_co_dinh"
//               ? `${i18n.t("cleaning_subscription", { lng: lang })}`
//               : data?.service?._id?.kind === "phuc_vu_nha_hang"
//               ? `${i18n.t("serve", { lng: lang })}`
//               : ""}
//           </p>
//           <p className="text-service">{timeWork(data)}</p>
//         </div>
//       );
//     },
//   },
//   {
//     title: () => {
//       return (
//         <p className="title-column">{`${i18n.t("date_work", {
//           lng: lang,
//         })}`}</p>
//       );
//     },
//     render: (data) => {
//       return (
//         <div className="div-worktime-activity">
//           <p className="text-worktime">
//             {" "}
//             {moment(new Date(data?.date_work)).format("DD/MM/YYYY")}
//           </p>
//           <p className="text-worktime">
//             {moment(new Date(data?.date_work)).locale(lang).format("dddd")}
//           </p>
//         </div>
//       );
//     },
//   },
//   {
//     title: () => {
//       return (
//         <p className="title-column">{`${i18n.t("address", {
//           lng: lang,
//         })}`}</p>
//       );
//     },
//     render: (data) => (
//       <p className="text-address-activity">{data?.address}</p>
//     ),
//     responsive: ["xl"],
//   },
//   {
//     title: () => {
//       return (
//         <p className="title-column">{`${i18n.t("status", { lng: lang })}`}</p>
//       );
//     },
//     render: (data) => (
//       <p
//         className={
//           data?.status === "pending"
//             ? "text-pending-activity"
//             : data?.status === "confirm"
//             ? "text-confirm-activity"
//             : data?.status === "doing"
//             ? "text-doing-activity"
//             : data?.status === "done"
//             ? "text-done-activity"
//             : "text-cancel-activity"
//         }
//       >
//         {data?.status === "pending"
//           ? `${i18n.t("pending", { lng: lang })}`
//           : data?.status === "confirm"
//           ? `${i18n.t("confirm", { lng: lang })}`
//           : data?.status === "doing"
//           ? `${i18n.t("doing", { lng: lang })}`
//           : data?.status === "done"
//           ? `${i18n.t("complete", { lng: lang })}`
//           : `${i18n.t("cancel", { lng: lang })}`}
//       </p>
//     ),
//   },
// ];
