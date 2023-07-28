import { List, Pagination, Table } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getHistoryActivityCollaborator } from "../../../../../../../api/collaborator";
import { errorNotify } from "../../../../../../../helper/toast";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import vi from "moment/locale/vi";
import "./index.scss";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import i18n from "../../../../../../../i18n";
import useWindowDimensions from "../../../../../../../helper/useWindowDimensions";

const Activity = ({ id }) => {
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lang = useSelector(getLanguageState);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getHistoryActivityCollaborator(id, 0, 10)
      .then((res) => {
        setData(res.data);
        setTotalData(res.totalItem);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id]);

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

  const timeWork = (data) => {
    const start = moment(new Date(data.date_work)).format("HH:mm");

    const timeEnd = moment(new Date(data?.date_work))
      .add(data?.total_estimate, "hours")
      .format("HH:mm");

    return start + " - " + timeEnd;
  };

  const columns = [
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("code_order", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <a
            className="text-id-activity"
            onClick={() =>
              navigate(
                "/system/collaborator-manage/details-collaborator/details-activity",
                {
                  state: { idOrder: data?._id, idCollaborator: id },
                }
              )
            }
          >
            {data?.id_view}
          </a>
        );
      },
    },
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
          <div className="div-create-activity">
            <a className="text-create">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </a>
            <a className="text-create">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </a>
          </div>
        );
      },
      responsive: ["xl"],
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("customer", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <Link
            to={`/profile-customer/${data?.id_customer?._id}`}
            className="div-name-activity"
          >
            <a className="text-name-customer">{data?.id_customer?.full_name}</a>
            <a className="text-phone-customer">{data?.id_customer?.phone}</a>
          </Link>
        );
      },
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("service", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <div className="div-service-activity">
            <a className="text-service">
              {data?.type === "loop" && data?.is_auto_order
                ? `${i18n.t("repeat", { lng: lang })}`
                : data?.service?._id?.kind === "giup_viec_theo_gio"
                ? `${i18n.t("cleaning", { lng: lang })}`
                : data?.service?._id?.kind === "giup_viec_co_dinh"
                ? `${i18n.t("cleaning_subscription", { lng: lang })}`
                : data?.service?._id?.kind === "phuc_vu_nha_hang"
                ? `${i18n.t("serve", { lng: lang })}`
                : ""}
            </a>
            <a className="text-service">{timeWork(data)}</a>
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("date_work", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <div className="div-worktime-activity">
            <a className="text-worktime">
              {" "}
              {moment(new Date(data?.date_work)).format("DD/MM/YYYY")}
            </a>
            <a className="text-worktime">
              {moment(new Date(data?.date_work)).locale(lang).format("dddd")}
            </a>
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("address", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => (
        <p className="text-address-activity">{data?.address}</p>
      ),
      responsive: ["xl"],
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("status", { lng: lang })}`}</a>
        );
      },
      render: (data) => (
        <a
          className={
            data?.status === "pending"
              ? "text-pending-activity"
              : data?.status === "confirm"
              ? "text-confirm-activity"
              : data?.status === "doing"
              ? "text-doing-activity"
              : data?.status === "done"
              ? "text-done-activity"
              : "text-cancel-activity"
          }
        >
          {data?.status === "pending"
            ? `${i18n.t("pending", { lng: lang })}`
            : data?.status === "confirm"
            ? `${i18n.t("confirm", { lng: lang })}`
            : data?.status === "doing"
            ? `${i18n.t("doing", { lng: lang })}`
            : data?.status === "done"
            ? `${i18n.t("complete", { lng: lang })}`
            : `${i18n.t("cancel", { lng: lang })}`}
        </a>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{
          x: width <= 900 ? 1000 : 0,
        }}
        expandable={
          width <= 1200
            ? {
                expandedRowRender: (record) => {
                  return (
                    <div className="div-plus">
                      <a>
                        {`${i18n.t("address", { lng: lang })}`}:{" "}
                        {record?.address}
                      </a>
                      <a>
                        {`${i18n.t("date_create", { lng: lang })}`}:{" "}
                        {moment(new Date(record?.date_create)).format(
                          "DD/MM/YYYY - HH:mm"
                        )}
                      </a>
                    </div>
                  );
                },
              }
            : ""
        }
      />

      <div className="div-pagination p-2">
        <a>Tổng: {totalData}</a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={totalData}
            showSizeChanger={false}
            pageSize={10}
          />
        </div>
      </div>
    </>
  );
};

export default memo(Activity);
