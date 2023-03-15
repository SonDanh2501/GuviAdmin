import { List, Pagination, Table } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getHistoryActivityCollaborator } from "../../../../../../../api/collaborator";
import { errorNotify } from "../../../../../../../helper/toast";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import vi from "moment/locale/vi";
import "./index.scss";

const Activity = ({ id }) => {
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    const start = page * data.length - data.length;
    getHistoryActivityCollaborator(id, start, 10)
      .then((res) => {
        setData(res.data);
        setTotalData(res.totalItem);
      })
      .catch((err) => console.log(err));
  };

  const renderItem = (item) => {
    const subject = item?.id_admin_action
      ? item?.title_admin.replace(
          item?.id_admin_action?._id,
          item?.id_admin_action?.full_name
        )
      : item?.id_collaborator
      ? item?.title_admin.replace(
          item?.id_collaborator?._id,
          item?.id_collaborator?.full_name
        )
      : item?.id_customer
      ? item?.title_admin.replace(
          item?.id_customer?._id,
          item?.id_customer?.full_name
        )
      : "";

    const predicate = item?.id_order
      ? subject.replace(item?.id_order?._id, item?.id_order?.id_view)
      : item?.id_promotion
      ? subject.replace(item?.id_promotion?._id, item?.id_promotion?.title?.vi)
      : item?.id_collaborator
      ? subject.replace(
          item?.id_collaborator?._id,
          item?.id_collaborator?.full_name
        )
      : item?.id_customer
      ? subject.replace(item?.id_customer?._id, item?.id_customer?.full_name)
      : item?.id_admin_action
      ? subject.replace(
          item?.id_admin_action?._id,
          item?.id_admin_action?.full_name
        )
      : item?.id_transistion_collaborator
      ? subject.replace(
          item?.id_transistion_collaborator?._id,
          item?.id_transistion_collaborator?.transfer_note
        )
      : item?.id_transistion_customer
      ? subject.replace(
          item?.id_transistion_customer?._id,
          item?.id_transistion_customer?.transfer_note
        )
      : "";

    const object = item?.id_order
      ? predicate.replace(item?.id_order?._id, item?.id_order?.id_view)
      : item?.id_transistion_collaborator
      ? predicate.replace(
          item?.id_transistion_collaborator?._id,
          item?.id_transistion_collaborator?.transfer_note
        )
      : item?.id_transistion_customer
      ? predicate.replace(
          item?.id_transistion_customer?._id,
          item?.id_transistion_customer?.transfer_note
        )
      : predicate.replace(
          item?.id_reason_cancel?._id,
          item?.id_reason_cancel?.title?.vi
        );

    return (
      <div className="div-list-item">
        <a className="text-title">{object}</a>
        <a className="text-date">
          {moment(new Date(item?.date_create)).format("DD/MM/yyy HH:mm")}
        </a>
      </div>
    );
  };
  const timeWork = (data) => {
    const start = moment(new Date(data.date_work_schedule[0].date)).format(
      "HH:mm"
    );

    const timeEnd =
      Number(start?.slice(0, 2)) + data?.total_estimate + start?.slice(2, 5);

    return start + " - " + timeEnd;
  };

  const columns = [
    {
      title: "Mã",
      render: (data) => {
        return (
          <a
            className="text-id"
            onClick={() =>
              navigate("/details-order", {
                state: { id: data?._id },
              })
            }
          >
            {data?.id_view}
          </a>
        );
      },
    },
    {
      title: "Ngày tạo",
      render: (data) => {
        return (
          <div className="div-create">
            <a className="text-create">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </a>
            <a className="text-create">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Khách hàng",
      // dataIndex: ["id_customer", "full_name"],
      render: (data) => {
        return (
          <div
            onClick={() =>
              navigate("/profile-customer", {
                state: { id: data?.id_customer?._id },
              })
            }
            className="div-name"
          >
            <a className="text-name-customer">{data?.id_customer?.full_name}</a>
            <a className="text-phone-customer">{data?.id_customer?.phone}</a>
          </div>
        );
      },
    },
    {
      title: "Dịch vụ",
      render: (data) => {
        return (
          <div className="div-service">
            <a className="text-service">
              {data?.type === "schedule"
                ? "Giúp việc cố định"
                : data?.type === "loop" && !data?.is_auto_order
                ? "Giúp việc theo giờ"
                : data?.type === "loop" && data?.is_auto_order
                ? "Lặp lại hàng tuần"
                : ""}
            </a>
            <a className="text-service">{timeWork(data)}</a>
          </div>
        );
      },
    },
    {
      title: "Ngày làm",
      render: (data) => {
        return (
          <div className="div-worktime">
            <a className="text-worktime">
              {" "}
              {moment(new Date(data?.date_work_schedule[0].date)).format(
                "DD/MM/YYYY"
              )}
            </a>
            <a className="text-worktime">
              {moment(new Date(data?.date_work_schedule[0].date))
                .locale("vi", vi)
                .format("dddd")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Địa điểm",
      render: (data) => <p className="text-address">{data?.address}</p>,
    },
    {
      title: "Trạng thái",
      render: (data) => (
        <a
          className={
            data?.status === "pending"
              ? "text-pending-order"
              : data?.status === "confirm"
              ? "text-confirm"
              : data?.status === "doing"
              ? "text-doing"
              : data?.status === "done"
              ? "text-done"
              : "text-cancel"
          }
        >
          {data?.status === "pending"
            ? "Đang chờ làm"
            : data?.status === "confirm"
            ? "Đã nhận"
            : data?.status === "doing"
            ? "Đang làm"
            : data?.status === "done"
            ? "Hoàn thành"
            : "Đã huỷ"}
        </a>
      ),
    },
  ];

  return (
    <>
      {/* <List itemLayout="horizontal" dataSource={data} renderItem={renderItem} /> */}

      <Table columns={columns} />

      {/* <div className="div-pagination p-2">
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
      </div> */}
    </>
  );
};

export default memo(Activity);
