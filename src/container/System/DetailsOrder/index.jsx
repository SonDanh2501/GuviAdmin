import { Button, Col, FloatButton, Image, Popconfirm, Row, Table } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import vi from "moment/locale/vi";
import {
  changeStatusOrderApi,
  getOrderByGroupOrderApi,
  changeOrderCancelToDoneApi,
  cancelGroupOrderApi,
} from "../../../api/order";
import user from "../../../assets/images/user.png";
import { formatMoney } from "../../../helper/formatMoney";
import { errorNotify } from "../../../helper/toast";
import { loadingAction } from "../../../redux/actions/loading";
import "./index.scss";
import { getUser } from "../../../redux/selectors/auth";

const DetailsOrder = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [dataGroup, setDataGroup] = useState({
    date_work_schedule: [{ data: "2023-02-21T00:30:00.000Z" }],
  });
  const [dataList, setDataList] = useState([]);
  const [hideShow, setHideShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [serviceFee, setServiceFee] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggle = () => setModal(!modal);
  const user = useSelector(getUser);

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getOrderByGroupOrderApi(id)
      .then((res) => {
        setHideShow(true);
        setDataGroup(res?.data?.groupOrder);
        setDataList(res?.data?.listOrder);
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
    const start = moment(new Date(data?.date_work_schedule[0]?.date)).format(
      "HH:mm"
    );

    const timeEnd =
      Number(start?.slice(0, 2)) + data?.total_estimate + start?.slice(2, 5);

    return start + " - " + timeEnd + "   (" + data?.total_estimate + " giờ )";
  };

  const timeWorkList = (data) => {
    const start = moment(new Date(data?.date_work)).format("HH:mm");

    const timeEnd =
      Number(start?.slice(0, 2)) + data?.total_estimate + start?.slice(2, 5);

    return start + " - " + timeEnd;
  };

  const showPopconfirm = () => {
    setOpen(true);
  };

  const showPopStatusconfirm = () => {
    setOpenStatus(true);
  };

  const showPopupconfirm = () => {
    setOpenPopup(true);
  };

  const handleOk = (_id) => {
    dispatch(loadingAction.loadingRequest(true));
    cancelGroupOrderApi(_id)
      .then((res) => {
        getOrderByGroupOrderApi(id)
          .then((res) => {
            setHideShow(true);
            setDataGroup(res?.data?.groupOrder);
            setDataList(res?.data?.listOrder);
            dispatch(loadingAction.loadingRequest(false));
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
            dispatch(loadingAction.loadingRequest(false));
          });
      })
      .catch((err) => {
        setModal(!modal);
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const handleChangeStatus = (id) => {
    dispatch(loadingAction.loadingRequest(true));
    changeStatusOrderApi(id, { status: "next" })
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

  const handleChangeCancelToOrder = () => {
    dispatch(loadingAction.loadingRequest(true));
    changeOrderCancelToDoneApi(dataGroup?._id)
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

  const columns = [
    {
      title: "Mã",
      render: (data) => {
        return <a className="text-id">{data?.id_view}</a>;
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
      title: "Dịch vụ",
      render: (data) => {
        return (
          <div className="div-service">
            <a className="text-service">
              {dataGroup?.type === "schedule"
                ? "Giúp việc cố định"
                : dataGroup?.type === "loop" && !dataGroup?.is_auto_order
                ? "Giúp việc theo giờ"
                : dataGroup?.type === "loop" && dataGroup?.is_auto_order
                ? "Lặp lại hàng tuần"
                : ""}
            </a>
            <a className="text-service">{timeWorkList(data)}</a>
          </div>
        );
      },
    },
    {
      title: "Thời gian",
      render: (data) => {
        return (
          <div className="div-worktime">
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
      render: (data) => <p className="text-address">{data?.address}</p>,
    },
    {
      title: "Cộng tác viên",
      render: (data) => (
        <>
          {!data?.id_collaborator ? (
            <a>Đang tìm kiếm</a>
          ) : (
            <a
              onClick={() =>
                navigate("/group-order/manage-order/details-collaborator", {
                  state: { id: data?.id_collaborator },
                })
              }
              className="text-collaborator"
            >
              {data?.name_collaborator}
            </a>
          )}
        </>
      ),
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
    {
      key: "actions",
      render: (data) => {
        return (
          <>
            <div>
              {data?.status === "doing" || data?.status === "confirm" ? (
                <Popconfirm
                  title="Bạn có chuyển trạng thái công việc"
                  // description="Open Popconfirm with async logic"
                  open={openStatus}
                  onConfirm={() => handleChangeStatus(data?._id)}
                  okButtonProps={{
                    loading: confirmLoading,
                  }}
                  onCancel={() => setOpenStatus(false)}
                >
                  <Button
                    className="btn-confirm-order"
                    onClick={showPopStatusconfirm}
                  >
                    {data?.status === "confirm"
                      ? "Bắt đầu"
                      : data?.status === "doing"
                      ? "Hoàn thành"
                      : ""}
                  </Button>
                </Popconfirm>
              ) : null}
            </div>

            {/* <div>
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
                  <Button
                    className="btn-confirm-order mt-1"
                    onClick={showPopconfirm}
                  >
                    Huỷ việc
                  </Button>
                </Popconfirm>
              ) : null}
            </div> */}
          </>
        );
      },
    },
  ];

  return (
    <>
      {hideShow && (
        <div className="div-container">
          <a className="label">Chi tiết công việc</a>
          <Row>
            <Col span={16} className="col-left">
              <a className="label-customer">Khách hàng</a>
              <div className="div-body">
                <Image
                  src={
                    dataGroup?.id_customer?.avatar
                      ? dataGroup?.id_customer?.avatar
                      : user
                  }
                  className="img-customer"
                />

                <div className="div-info">
                  <a className="label-name">
                    Tên: {dataGroup?.id_customer?.full_name}
                  </a>
                  <a className="label-name">
                    SĐT: {dataGroup?.id_customer?.phone}
                  </a>
                  <a className="label-name">
                    Tuổi:{" "}
                    {dataGroup?.id_customer?.birthday
                      ? moment().diff(dataGroup?.id_customer?.birthday, "years")
                      : "Chưa cập nhật"}
                  </a>
                </div>
              </div>
            </Col>
            {dataGroup?.id_collaborator && (
              <Col span={8} className="col-right">
                <a className="label-ctv">Cộng tác viên hiện tại</a>
                <div className="div-body">
                  <Image
                    style={{
                      with: 100,
                      height: 100,
                      backgroundColor: "transparent",
                    }}
                    src={dataGroup?.id_collaborator?.avatar}
                    className="img-collaborator"
                  />

                  <div className="div-info">
                    <a
                      className="label-name"
                      onClick={() =>
                        navigate(
                          "/group-order/manage-order/details-collaborator",
                          {
                            state: { id: dataGroup?.id_collaborator?._id },
                          }
                        )
                      }
                    >
                      Tên: {dataGroup?.id_collaborator?.full_name}
                    </a>
                    <a className="label-name">
                      SĐT: {dataGroup?.id_collaborator?.phone}
                    </a>
                    <a className="label-name">
                      Tuổi:{" "}
                      {dataGroup?.id_collaborator?.birthday
                        ? moment().diff(
                            dataGroup?.id_collaborator?.birthday,
                            "years"
                          )
                        : "Chưa cập nhật"}
                    </a>
                  </div>
                </div>
              </Col>
            )}
          </Row>
          <Row>
            <div className="div-details-service">
              <a className="label-details">Chi tiết</a>
              <a className="title">
                Dịch vụ:{" "}
                <a className="text-service">
                  {dataGroup?.type === "schedule"
                    ? "Giúp việc cố định"
                    : dataGroup?.type === "loop" && !dataGroup?.is_auto_order
                    ? "Giúp việc theo giờ"
                    : dataGroup?.type === "loop" && dataGroup?.is_auto_order
                    ? "Lặp lại hàng tuần"
                    : ""}
                </a>
              </a>
              <div className="div-datework">
                <a className="title">Thời gian: </a>
                <div className="div-times">
                  <a>
                    -Ngày làm:{" "}
                    {moment(
                      new Date(dataGroup?.date_work_schedule[0]?.date)
                    ).format("DD/MM/YYYY")}
                  </a>
                  <a>-Giờ làm: {timeWork(dataGroup)}</a>
                </div>
              </div>
              <a className="title">
                Địa điểm: <a className="text-service">{dataGroup?.address}</a>
              </a>
              {dataGroup?.note && (
                <a className="title">
                  Ghi chú: <a className="text-service">{dataGroup?.note}</a>
                </a>
              )}
              <div style={{ flexDirection: "row" }}>
                <a className="title">Dịch vụ thêm: </a>
                {dataGroup?.service?.optional_service.map((item) => {
                  return (
                    <a>
                      {item?._id === "632148d02bacd0aa8648657c"
                        ? item?.extend_optional?.map((item) => (
                            <a>- {item?.title?.vi}</a>
                          ))
                        : null}
                    </a>
                  );
                })}
              </div>

              <a className="title">
                Thanh toán:{" "}
                <a className="text-service">
                  {dataGroup?.payment_method === "cash"
                    ? "Tiền mặt"
                    : "G-point"}
                </a>
              </a>
              <div className="div-price">
                <a className="title">Tạm tính:</a>
                <div className="detail-price">
                  <div className="div-total">
                    <a>- Tổng tiền:</a>
                    <a>{formatMoney(dataGroup?.initial_fee + 2000)}</a>
                  </div>
                  {dataGroup?.code_promotion && (
                    <div className="div-total">
                      <a>- Khuyến mãi:</a>
                      <a>-Mã code: {dataGroup?.code_promotion?.code}</a>
                      <a>
                        <a style={{ color: "red", marginLeft: 5 }}>
                          {formatMoney(-dataGroup?.code_promotion?.discount)}
                        </a>
                      </a>
                    </div>
                  )}
                  {dataGroup?.event_promotion && (
                    <div className="div-event-promo">
                      <a>- Chương trình:</a>
                      <div className="div-price-event">
                        {dataGroup?.event_promotion.map((item, key) => {
                          return (
                            <a className="text-event-discount">
                              {formatMoney(-item?.discount)}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {dataGroup?.service?.optional_service.map((item) => {
                    return (
                      <div>
                        {item?._id === "632148d02bacd0aa8648657c"
                          ? item?.extend_optional?.map((item) => {
                              return (
                                <div className="div-event-promo">
                                  <a>- {item?.title?.vi}</a>
                                  <a> +{formatMoney(item?.price)}</a>
                                </div>
                              );
                            })
                          : null}
                      </div>
                    );
                  })}
                  <div className="div-total">
                    <a className="title">- Giá: </a>
                    <a className="title">{formatMoney(dataGroup?.final_fee)}</a>
                  </div>
                </div>
              </div>

              <a className="title">
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
              </a>
            </div>
          </Row>
          {dataGroup?.status === "pending" ||
          dataGroup?.status === "confirm" ? (
            <Popconfirm
              title="Bạn có muốn huỷ việc"
              // description="Open Popconfirm with async logic"
              open={open}
              onConfirm={() => handleOk(dataGroup?._id)}
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

          {user === "admin" && dataGroup?.status === "cancel" ? (
            <Popconfirm
              title="Bạn có chuyển trạng thái sang hoàn tất"
              // description="Open Popconfirm with async logic"
              open={openPopup}
              onConfirm={handleChangeCancelToOrder}
              okButtonProps={{
                loading: confirmLoading,
              }}
              onCancel={() => setOpenPopup(false)}
            >
              <Button className="btn-cancel" onClick={showPopupconfirm}>
                Hoàn tất
              </Button>
            </Popconfirm>
          ) : null}

          <div className="mt-5">
            <Table columns={columns} dataSource={dataList} pagination={false} />
          </div>

          <FloatButton.BackTop />
        </div>
      )}
    </>
  );
};

export default DetailsOrder;
