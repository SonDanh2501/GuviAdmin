import { useLocation, useNavigate } from "react-router-dom";
import "./index.scss";
import { useEffect, useState } from "react";
import { cancelGroupOrderApi, getOrderDetailApi } from "../../../../api/order";
import { Button, Col, FloatButton, Image, Popconfirm, Row } from "antd";
import { getUser } from "../../../../redux/selectors/auth";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { formatMoney } from "../../../../helper/formatMoney";
import { loadingAction } from "../../../../redux/actions/loading";
import userIma from "../../../../assets/images/user.png";

import { errorNotify } from "../../../../helper/toast";

const DetailsOrderSchedule = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [hideShow, setHideShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  useEffect(() => {
    getOrderDetailApi(id)
      .then((res) => {
        setData(res);
        setHideShow(true);
      })
      .catch((err) => {});
  }, [id]);

  const showPopconfirm = () => {
    setOpen(true);
  };

  const timeWork = (data) => {
    const start = moment(new Date(data?.date_work)).format("HH:mm");

    const timeEnd =
      Number(start?.slice(0, 2)) + data?.total_estimate + start?.slice(2, 5);

    return start + " - " + timeEnd + "   (" + data?.total_estimate + " giờ )";
  };

  const handleOk = (_id) => {
    dispatch(loadingAction.loadingRequest(true));
    cancelGroupOrderApi(_id)
      .then((res) => {})
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
    <>
      <i
        class="uil uil-arrow-left"
        style={{ width: 50, height: 50 }}
        onClick={() => navigate(-1)}
      ></i>
      {hideShow && (
        <div className="div-container">
          <a className="label">Chi tiết công việc</a>
          <Row>
            <Col span={14} className="col-left">
              <a className="label-customer">Khách hàng</a>
              <div className="div-body">
                <Image
                  src={
                    data?.id_customer?.avatar
                      ? data?.id_customer?.avatar
                      : userIma
                  }
                  className="img-customer"
                />

                <div className="div-info">
                  <a className="label-name">
                    Tên: {data?.id_customer?.full_name}
                  </a>
                  <a className="label-name">SĐT: {data?.id_customer?.phone}</a>
                  <a className="label-name">
                    Tuổi:{" "}
                    {data?.id_customer?.birthday
                      ? moment().diff(data?.id_customer?.birthday, "years")
                      : "Chưa cập nhật"}
                  </a>
                </div>
              </div>
            </Col>
            {data?.id_collaborator && (
              <Col span={10} className="col-right">
                <a className="label-ctv">Cộng tác viên hiện tại</a>
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
                    <a
                      className="label-name"
                      onClick={() => {
                        if (user?.role !== "support_customer") {
                          navigate(
                            "/group-order/manage-order/details-collaborator",
                            {
                              state: {
                                id: data?.id_collaborator?._id,
                              },
                            }
                          );
                        }
                      }}
                    >
                      Tên: {data?.id_collaborator?.full_name}
                    </a>
                    <a className="label-name">
                      SĐT: {data?.id_collaborator?.phone}
                    </a>
                    <a className="label-name">
                      Tuổi:{" "}
                      {data?.id_collaborator?.birthday
                        ? moment().diff(
                            data?.id_collaborator?.birthday,
                            "years"
                          )
                        : "Chưa cập nhật"}
                    </a>
                  </div>
                </div>
              </Col>
            )}
          </Row>
          <div>
            <div className="div-details-service">
              <a className="label-details">Chi tiết</a>
              <div className="div-details-order">
                <div className="div-title-details">
                  <a className="title">Dịch vụ</a>
                </div>
                <a className="text-colon">:</a>
                <a className="text-service-order">
                  {data?.type === "schedule"
                    ? "Giúp việc cố định"
                    : data?.type === "loop" && !data?.is_auto_order
                    ? "Giúp việc theo giờ"
                    : data?.type === "loop" && data?.is_auto_order
                    ? "Lặp lại hàng tuần"
                    : ""}
                </a>
              </div>
              <div className="div-details-order">
                <div className="div-title-details">
                  <a className="title">Thời gian</a>
                </div>
                <a className="text-colon">:</a>
                <div className="div-times">
                  <a className="text-date">
                    - Ngày làm:{" "}
                    {moment(new Date(data?.date_work)).format("DD/MM/YYYY")}
                  </a>
                  <a className="text-date">- Giờ làm: {timeWork(data)}</a>
                </div>
              </div>

              <div className="div-details-order">
                <div className="div-title-details">
                  <a className="title"> Địa điểm</a>
                </div>
                <a className="text-colon">:</a>
                <a className="text-address-details">{data?.address}</a>
              </div>

              {data?.note && (
                <div className="div-details-order">
                  <div className="div-title-details">
                    <a className="title">Ghi chú</a>
                  </div>
                  <a className="text-colon">:</a>
                  <a className="text-address-details">{data?.note}</a>
                </div>
              )}

              <div className="div-details-order">
                <div className="div-title-details">
                  <a className="title">Dịch vụ thêm</a>
                </div>
                <a className="text-colon">:</a>
                <div className="div-add">
                  {data?.service?.optional_service.map((item) => {
                    return (
                      <>
                        {item?._id === "632148d02bacd0aa8648657c"
                          ? item?.extend_optional?.map((item) => (
                              <a className="text-title-add">
                                - {item?.title?.vi}
                              </a>
                            ))
                          : null}
                      </>
                    );
                  })}
                </div>
              </div>

              <div className="div-details-order">
                <div className="div-title-details">
                  <a className="title">Thanh toán</a>
                </div>
                <a className="text-colon">:</a>
                <a className="text-address-details">
                  {data?.payment_method === "cash" ? "Tiền mặt" : "G-point"}
                </a>
              </div>

              <div className="div-details-order">
                <div className="div-title-details">
                  <a className="title">Tạm tính</a>
                </div>
                <a className="text-colon">:</a>
                <div className="div-details-price">
                  <div className="div-price">
                    <div className="div-title-colon">
                      <div className="div-title-details">
                        <a className="title">- Tồng tiền</a>
                      </div>
                      <a className="text-colon">:</a>
                    </div>
                    <a className="text-moeny-details">
                      {formatMoney(data?.initial_fee)}
                    </a>
                  </div>

                  <div className="div-price">
                    <div className="div-title-colon">
                      <div className="div-title-details">
                        <a className="title">- Dịch vụ thêm</a>
                      </div>
                      <a className="text-colon">:</a>
                    </div>
                    {data?.service_fee?.map((item) => (
                      <a className="text-moeny-details">
                        +{formatMoney(item?.fee)}
                      </a>
                    ))}
                  </div>

                  {data?.service?.optional_service.map((item) => {
                    return (
                      <>
                        {item?._id === "632148d02bacd0aa8648657c"
                          ? item?.extend_optional?.map((item) => {
                              return (
                                <div className="div-price">
                                  <div className="div-title-colon">
                                    <div className="div-title-details">
                                      <a className="title">
                                        - {item?.title?.vi}
                                      </a>
                                    </div>
                                    <a className="text-colon">:</a>
                                  </div>

                                  <a className="text-moeny-details">
                                    {item?.price !== 0
                                      ? "+" + formatMoney(item?.price)
                                      : ""}
                                  </a>
                                </div>
                              );
                            })
                          : null}
                      </>
                    );
                  })}

                  <div className="div-price">
                    <div className="div-title-colon">
                      <div className="div-title-details">
                        <a className="title">- Khuyến mãi</a>
                      </div>
                      <a className="text-colon">:</a>
                    </div>

                    {data?.code_promotion && (
                      <>
                        <a className="text-moeny-details">
                          + Mã code: {data?.code_promotion?.code}
                        </a>
                        <a className="money-red">
                          {formatMoney(-data?.code_promotion?.discount)}
                        </a>
                      </>
                    )}
                  </div>

                  {data?.event_promotion && (
                    <div className="div-price">
                      <div className="div-title-colon">
                        <div className="div-title-details">
                          <a className="title">- Chương trình</a>
                        </div>
                        <a className="text-colon">:</a>
                      </div>
                      <div className="div-price-event">
                        {data?.event_promotion.map((item, key) => {
                          return (
                            <a className="money-event-discount">
                              {formatMoney(-item?.discount)}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="div-price">
                    <div className="div-title-colon">
                      <div className="div-title-details">
                        <a className="title-total">- Giá</a>
                      </div>
                      <a className="text-colon">:</a>
                    </div>
                    <a className="text-moeny-details-total">
                      {formatMoney(data?.final_fee)}
                    </a>
                  </div>
                </div>
              </div>

              {/* <a className="title">
                Trạng thái:{" "}
                {dataGroup?.status === "pending" ? (
                  <a className="text-pending ">Đang chờ làm</a>
                ) : dataGroup?.status === "confirm" ? (
                  <a className="text-confirm">Đã nhận</a>
                ) : dataGroup?.status === "doing" ? (
                  <a className="text-doing">Đang làm</a>
                ) : dataGroup?.status === "done" ? (
                  <a className="text-done">Đã xong</a>
                ) : (
                  <a className="text-cancel">Đã huỷ</a>
                )}
              </a> */}
            </div>
          </div>
          {user?.role !== "support_customer" && data?.type === "schedule" && (
            <div>
              {data?.status === "pending" || data?.status === "confirm" ? (
                <Popconfirm
                  title="Bạn có muốn huỷ việc"
                  // description="Open Popconfirm with async logic"
                  open={open}
                  onConfirm={() => handleOk(data?._id)}
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
            </div>
          )}
          <FloatButton.BackTop />
        </div>
      )}
    </>
  );
};

export default DetailsOrderSchedule;
