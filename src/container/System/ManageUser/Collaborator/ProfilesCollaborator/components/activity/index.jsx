import { Pagination, Table } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getHistoryActivityCollaborator } from "../../../../../../../api/collaborator";
import { errorNotify } from "../../../../../../../helper/toast";
import useWindowDimensions from "../../../../../../../helper/useWindowDimensions";
import i18n from "../../../../../../../i18n";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import "./index.scss";
import FilterData from "../../../../../../../components/filterData/filterData";
import DataTable from "../../../../../../../components/tables/dataTable";

const Activity = ({ id }) => {
  const [data, setData] = useState([]);
  const [startPage, setStartPage] = useState(0);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [totalData, setTotalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lang = useSelector(getLanguageState);
  const { width } = useWindowDimensions();

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getHistoryActivityCollaborator(id, startPage, lengthPage)
      .then((res) => {
        setData(res.data);
        setTotalData(res.totalItem);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id, dispatch, startPage, lengthPage]);

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data.length < 10 ? 10 : data.length;
    const start = page * dataLength - dataLength;
    getHistoryActivityCollaborator(id, start, 10)
      .then((res) => {
        setData(res.data);
        setTotalData(res.totalItem);
      })
      .catch((err) => console.log(err));
  };

  const onChangePage = (value) => {
    setStartPage(value);
  };

  const timeWork = (data) => {
    const start = moment(new Date(data.date_work)).format("HH:mm");

    const timeEnd = moment(new Date(data?.date_work))
      .add(data?.total_estimate, "hours")
      .format("HH:mm");

    return start + " - " + timeEnd;
  };

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

  const columns = [
    {
      title: "Mã đơn",
      // dataIndex: "",
      key: "code_order",
      width: 60,
      FontSize: "text-size-M",
    },
    {
      title: "Ngày tạo",
      // dataIndex: "",
      key: "date_create",
      width: 60,
      FontSize: "text-size-M",
    },
    {
      title: "Khách hàng",
      // dataIndex: "",
      key: "customer_name_phone",
      width: 60,
      FontSize: "text-size-M",
    },
    {
      title: "Dịch vụ",
      // dataIndex: "review",
      key: "service",
      width: 60,
      FontSize: "text-size-M",
    },
    {
      title: "Ngày làm",
      // dataIndex: "short_review",
      key: "date_work",
      width: 60,
      FontSize: "text-size-M",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "text",
      width: 60,
      FontSize: "text-size-M",
    },
    {
      title: "Trạng thái",
      // dataIndex: "short_review",
      key: "status",
      width: 60,
      FontSize: "text-size-M",
    },
  ];
  return (
    <div className="collaborator-activity">
      <div className="card-table">
        {/* <FilterData setTimePeriod={setTimePeriod} /> */}
        <DataTable
          columns={columns}
          data={data}
          start={startPage}
          pageSize={lengthPage}
          setLengthPage={setLengthPage}
          totalItem={totalData}
          onCurrentPageChange={onChangePage}
        />
      </div>
    </div>
  );
};

export default memo(Activity);
