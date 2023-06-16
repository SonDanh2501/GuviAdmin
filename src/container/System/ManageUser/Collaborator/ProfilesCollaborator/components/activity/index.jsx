import { List, Pagination, Table } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
      title: "Mã",
      render: (data) => {
        return (
          <a
            className="text-id"
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
      title: "Ngày tạo",
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
    },
    {
      title: "Khách hàng",
      render: (data) => {
        return (
          <Link
            to={`/profile-customer/${data?.id_customer?._id}`}
            className="div-name"
          >
            <a className="text-name-customer">{data?.id_customer?.full_name}</a>
            <a className="text-phone-customer">{data?.id_customer?.phone}</a>
          </Link>
        );
      },
    },
    {
      title: "Dịch vụ",
      render: (data) => {
        return (
          <div className="div-service-activity">
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
          <div className="div-worktime-activity">
            <a className="text-worktime">
              {" "}
              {moment(new Date(data?.date_work)).format("DD/MM/YYYY")}
            </a>
            <a className="text-worktime">
              {moment(new Date(data?.date_work))
                .locale("vi", vi)
                .format("dddd")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Địa điểm",
      render: (data) => (
        <p className="text-address-activity">{data?.address}</p>
      ),
    },
    {
      title: "Trạng thái",
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
      <Table columns={columns} dataSource={data} pagination={false} />

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
