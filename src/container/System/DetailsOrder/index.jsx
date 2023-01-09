import { Button, Col, FloatButton, Image, Popconfirm, Row } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Modal, ModalFooter, ModalHeader } from "reactstrap";
import { getCollaboratorsById } from "../../../api/collaborator";
import { fetchCustomerById } from "../../../api/customer";
import { changeStatusOrderApi, getOrderDetailApi } from "../../../api/order";
import user from "../../../assets/images/user.png";
import { formatMoney } from "../../../helper/formatMoney";
import { errorNotify } from "../../../helper/toast";
import { loadingAction } from "../../../redux/actions/loading";
import "./index.scss";

const DetailsOrder = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useDispatch();

  const toggle = () => setModal(!modal);

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getOrderDetailApi(id)
      .then((res) => {
        setData(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id]);

  const timeWork = (data) => {
    const start = moment(new Date(data.date_work)).format("HH:mm");

    const timeEnd =
      Number(start?.slice(0, 2)) + data?.total_estimate + start?.slice(2, 5);

    return start + " - " + timeEnd;
  };

  const showPopconfirm = () => {
    setOpen(true);
  };
  const handleOk = () => {
    dispatch(loadingAction.loadingRequest(true));
    changeStatusOrderApi(id, { status: "cancel" })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        setModal(!modal);
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="div-container">
      <a className="label">Chi tiết công việc</a>
      <Row>
        <Col span={16} className="col-left">
          <a className="label-customer">Khách hàng</a>
          <div className="div-body">
            <Image
              src={data?.id_customer?.avatar ? data?.id_customer?.avatar : user}
              className="img-customer"
            />

            <div className="div-info">
              <a className="label-name">Tên: {data?.id_customer?.full_name}</a>
              <a className="label-name">SĐT: {data?.id_customer?.phone}</a>
              <a className="label-name">
                Tuổi:{" "}
                {data?.id_customer?.birthday
                  ? moment().diff(data?.id_customer?.birthday, "years")
                  : "Chưa cập nhật"}
              </a>
            </div>
          </div>

          <a className="label-details">Chi tiết</a>
          <div className="div-details-service">
            <a className="title">
              Dịch vụ:{" "}
              <a className="text-service">
                {data?.service?._id?.kind === "giup_viec_theo_gio"
                  ? "Giúp việc theo giờ"
                  : "Giúp việc cố định"}
              </a>
            </a>
            <div className="div-datework">
              <a className="title">Thời gian: </a>
              <div className="div-times">
                <a>
                  -Ngày làm:{" "}
                  {moment(new Date(data?.date_work)).format("DD/MM/YYYY")}
                </a>
                <a>-Giờ làm: {timeWork(data)}</a>
              </div>
            </div>
            <a className="title">
              Địa điểm: <a className="text-service">{data?.address}</a>
            </a>
            {data?.note && (
              <a className="title">
                Ghi chú: <a className="text-service">{data?.note}</a>
              </a>
            )}
            <a className="title">
              Thanh toán:{" "}
              <a className="text-service">
                {data?.payment_method === "cash" ? "Tiền mặt" : "G-point"}
              </a>
            </a>
            <a className="title">
              Tổng tiền:{" "}
              <a className="text-service">{formatMoney(data?.final_fee)}</a>
            </a>
            <a className="title">
              Trạng thái:{" "}
              {data?.status === "pending" ? (
                <a className="text-pending ">Đang chờ làm</a>
              ) : data?.status === "confirm" ? (
                <a className="text-confirm">Đã nhận</a>
              ) : data?.status === "doing" ? (
                <a className="text-doing">Đang làm</a>
              ) : data?.status === "done" ? (
                <a className="text-done">Đã xong</a>
              ) : (
                <a className="text-cancel">Đã huỷ</a>
              )}
            </a>
          </div>
        </Col>
        {data?.id_collaborator && (
          <Col span={8} className="col-right">
            <a className="label-ctv">Cộng tác viên</a>
            <div className="div-body">
              <Image
                style={{
                  with: 100,
                  height: 100,
                  backgroundColor: "transparent",
                }}
                src={data?.id_collaborator?.avatar}
                className="img-collaborator"
              />

              <div className="div-info">
                <a className="label-name">
                  Tên: {data?.id_collaborator?.full_name}
                </a>
                <a className="label-name">
                  SĐT: {data?.id_collaborator?.phone}
                </a>
                <a className="label-name">
                  Tuổi:{" "}
                  {data?.id_collaborator?.birthday
                    ? moment().diff(data?.id_collaborator?.birthday, "years")
                    : "Chưa cập nhật"}
                </a>
              </div>
            </div>
          </Col>
        )}
      </Row>
      {/* 
      <Button className="btn-cancel" onClick={toggle}>
        Huỷ việc
      </Button> */}

      {data?.status === "pending" || data?.status === "confirm" ? (
        <Popconfirm
          title="Bạn có muốn huỷ việc"
          // description="Open Popconfirm with async logic"
          open={open}
          onConfirm={handleOk}
          okButtonProps={{
            loading: confirmLoading,
          }}
          onCancel={handleCancel}
        >
          <Button className="btn-cancel" onClick={showPopconfirm}>
            Huỷ việc
          </Button>
        </Popconfirm>
      ) : null}

      <FloatButton.BackTop />
    </div>
  );
};

export default DetailsOrder;
