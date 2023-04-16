import {
  Button,
  Col,
  Dropdown,
  FloatButton,
  Image,
  Pagination,
  Popconfirm,
  Row,
  Space,
  Table,
  Tabs,
} from "antd";
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
  getHistoryOrderApi,
} from "../../../api/order";
import userIma from "../../../assets/images/user.png";
import { formatMoney } from "../../../helper/formatMoney";
import { errorNotify } from "../../../helper/toast";
import { loadingAction } from "../../../redux/actions/loading";
import "./index.scss";
import { getUser } from "../../../redux/selectors/auth";
import { MoreOutlined } from "@ant-design/icons";

const DetailsOrder = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [dataGroup, setDataGroup] = useState({
    date_work_schedule: [{ data: "2023-02-21T00:30:00.000Z" }],
  });
  const [dataList, setDataList] = useState([]);
  const [dataHistory, setDataHistory] = useState([]);
  const [totalHistory, setTotalHistory] = useState([]);
  const [hideShow, setHideShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openCancelOrder, setOpenCancelOrder] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [serviceFee, setServiceFee] = useState(0);
  const [rowIndex, setRowIndex] = useState();
  const [itemEdit, setItemEdit] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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

    getHistoryOrderApi(id, 0, 20)
      .then((res) => {
        setDataHistory(res?.data);
        setTotalHistory(res?.totalItem);
      })
      .catch((err) => {
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

  const showPopCancelOrder = () => {
    setOpenCancelOrder(true);
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

  const handleChangeStatus = (_id) => {
    dispatch(loadingAction.loadingRequest(true));
    changeStatusOrderApi(_id, { status: "next" })
      .then((res) => {
        getOrderByGroupOrderApi(id)
          .then((res) => {
            setOpenStatus(false);
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

  const handleCancelOrder = (_id) => {
    dispatch(loadingAction.loadingRequest(true));
    changeStatusOrderApi(_id, { status: "cancel" })
      .then((res) => {
        getOrderByGroupOrderApi(id)
          .then((res) => {
            setOpenCancelOrder(false);
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

  const handleCancel = () => {
    setOpen(false);
  };

  const onChange = (page) => {
    setCurrentPage(page);

    const start = page * dataHistory.length - dataHistory.length;
    getHistoryOrderApi(id, start, 20)
      .then((res) => {
        setDataHistory(res?.data);
        setTotalHistory(res?.totalItem);
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
      });
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
              onClick={() => {
                if (user?.role !== "support_customer") {
                  navigate("/group-order/manage-order/details-collaborator", {
                    state: { id: data?.id_collaborator },
                  });
                }
              }}
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
      key: "action",
      render: (data, record, index) => {
        return (
          <>
            {user?.role !== "support_customer" && (
              <div>
                <div>
                  {data?.status === "doing" || data?.status === "confirm" ? (
                    <div>
                      {rowIndex === index && (
                        <Popconfirm
                          title="Bạn có chuyển trạng thái công việc"
                          // description="Open Popconfirm with async logic"
                          open={openStatus}
                          onConfirm={() => handleChangeStatus(data?._id)}
                          okButtonProps={{
                            loading: confirmLoading,
                          }}
                          onCancel={() => setOpenStatus(false)}
                        />
                      )}

                      <Button
                        className="btn-confirm-order"
                        onClick={() =>
                          rowIndex === index ? showPopStatusconfirm() : ""
                        }
                      >
                        {data?.status === "confirm"
                          ? "Bắt đầu"
                          : data?.status === "doing"
                          ? "Hoàn thành"
                          : ""}
                      </Button>
                    </div>
                  ) : (
                    " "
                  )}
                </div>

                <div>
                  {data?.status === "pending" || data?.status === "confirm" ? (
                    <div>
                      {rowIndex === index && (
                        <Popconfirm
                          title="Bạn có muốn huỷ việc"
                          open={openCancelOrder}
                          onConfirm={() => handleCancelOrder(data?._id)}
                          okButtonProps={{
                            loading: confirmLoading,
                          }}
                          onCancel={() => setOpenCancelOrder(false)}
                        />
                      )}
                      <Button
                        className="btn-confirm-order mt-1"
                        onClick={() =>
                          rowIndex === index ? showPopCancelOrder() : ""
                        }
                      >
                        Huỷ việc
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </>
        );
      },
    },
    {
      key: "action",
      align: "center",
      render: (data) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items,
            }}
            placement="bottom"
            trigger={["click"]}
          >
            <a>
              <MoreOutlined className="icon-more" />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <a
          onClick={() =>
            navigate("/details-order/details-order-schedule", {
              state: { id: itemEdit?._id },
            })
          }
        >
          Chi tiết
        </a>
      ),
    },
  ];

  return (
    <div>
      <>
        <Tabs defaultActiveKey="1" size="large">
          <Tabs.TabPane tab="Chi tiết đơn hàng" key="1">
            <>
              {hideShow && (
                <div className="div-container">
                  <a className="label">Chi tiết công việc</a>
                  <Row>
                    <Col span={14} className="col-left">
                      <a className="label-customer">Khách hàng</a>
                      <div className="div-body">
                        <Image
                          src={
                            dataGroup?.id_customer?.avatar
                              ? dataGroup?.id_customer?.avatar
                              : userIma
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
                              ? moment().diff(
                                  dataGroup?.id_customer?.birthday,
                                  "years"
                                )
                              : "Chưa cập nhật"}
                          </a>
                        </div>
                      </div>
                    </Col>
                    {dataGroup?.id_collaborator && (
                      <Col span={10} className="col-right">
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
                              onClick={() => {
                                if (user?.role !== "support_customer") {
                                  navigate(
                                    "/group-order/manage-order/details-collaborator",
                                    {
                                      state: {
                                        id: dataGroup?.id_collaborator?._id,
                                      },
                                    }
                                  );
                                }
                              }}
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
                  <div>
                    <div className="div-details-service">
                      <a className="label-details">Chi tiết</a>
                      <div className="div-details-order">
                        <div className="div-title-details">
                          <a className="title">Dịch vụ</a>
                        </div>
                        <a className="text-colon">:</a>
                        <a className="text-service-order">
                          {dataGroup?.type === "schedule"
                            ? "Giúp việc cố định"
                            : dataGroup?.type === "loop" &&
                              !dataGroup?.is_auto_order
                            ? "Giúp việc theo giờ"
                            : dataGroup?.type === "loop" &&
                              dataGroup?.is_auto_order
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
                            {moment(
                              new Date(dataGroup?.date_work_schedule[0]?.date)
                            ).format("DD/MM/YYYY")}
                          </a>
                          <a className="text-date">
                            - Giờ làm: {timeWork(dataGroup)}
                          </a>
                        </div>
                      </div>

                      <div className="div-details-order">
                        <div className="div-title-details">
                          <a className="title"> Địa điểm</a>
                        </div>
                        <a className="text-colon">:</a>
                        <a className="text-address-details">
                          {dataGroup?.address}
                        </a>
                      </div>

                      {dataGroup?.note && (
                        <div className="div-details-order">
                          <div className="div-title-details">
                            <a className="title">Ghi chú</a>
                          </div>
                          <a className="text-colon">:</a>
                          <a className="text-address-details">
                            {dataGroup?.note}
                          </a>
                        </div>
                      )}

                      <div className="div-details-order">
                        <div className="div-title-details">
                          <a className="title">Dịch vụ thêm</a>
                        </div>
                        <a className="text-colon">:</a>
                        <div className="div-add">
                          {dataGroup?.service?.optional_service.map((item) => {
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
                          {dataGroup?.payment_method === "cash"
                            ? "Tiền mặt"
                            : "G-point"}
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
                              {formatMoney(dataGroup?.initial_fee)}
                            </a>
                          </div>

                          <div className="div-price">
                            <div className="div-title-colon">
                              <div className="div-title-details">
                                <a className="title">- Phí nền tảng</a>
                              </div>
                              <a className="text-colon">:</a>
                            </div>
                            {dataGroup?.service_fee?.map((item) => (
                              <a className="text-moeny-details">
                                +{formatMoney(item?.fee)}
                              </a>
                            ))}
                          </div>

                          {dataGroup?.service?.optional_service.map((item) => {
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

                            {dataGroup?.code_promotion && (
                              <>
                                <a className="text-moeny-details">
                                  + Mã code: {dataGroup?.code_promotion?.code}
                                </a>
                                <a className="money-red">
                                  {formatMoney(
                                    -dataGroup?.code_promotion?.discount
                                  )}
                                </a>
                              </>
                            )}
                          </div>

                          {dataGroup?.event_promotion && (
                            <div className="div-price">
                              <div className="div-title-colon">
                                <div className="div-title-details">
                                  <a className="title">- Chương trình</a>
                                </div>
                                <a className="text-colon">:</a>
                              </div>
                              <div className="div-price-event">
                                {dataGroup?.event_promotion.map((item, key) => {
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
                              {formatMoney(dataGroup?.final_fee)}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* 
                     

                      <div className="div-price-order">
                        <a className="title-price-order">Tạm tính:</a>
                        <div className="detail-price">
                      
                         

                    

                          <div className="div-total">
                            <a className="title">- Giá: </a>
                            <a className="title">
                              {formatMoney(dataGroup?.final_fee)}
                            </a>
                          </div>
                        </div>
                      </div> */}

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
                  {user?.role !== "support_customer" &&
                    dataGroup?.type === "schedule" && (
                      <div>
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
                            <Button
                              className="btn-cancel"
                              onClick={showPopconfirm}
                            >
                              Huỷ việc
                            </Button>
                          </Popconfirm>
                        ) : null}
                      </div>
                    )}

                  <div className="mt-3">
                    <Table
                      columns={columns}
                      dataSource={dataList}
                      pagination={false}
                      onRow={(record, rowIndex) => {
                        return {
                          onClick: (event) => {
                            setRowIndex(rowIndex);
                            setItemEdit(record);
                          },
                        };
                      }}
                    />
                  </div>

                  <FloatButton.BackTop />
                </div>
              )}
            </>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Hoạt động đơn hàng" key="2">
            <div>
              <div className="mt-3">
                {dataHistory?.map((item, index) => {
                  const money = item?.value?.toString();
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

                  const predicate = item?.id_address
                    ? subject.replace(item?.id_address, item?.value_string)
                    : item?.id_order
                    ? subject.replace(
                        item?.id_order?._id,
                        item?.id_order?.id_view
                      )
                    : item?.id_promotion
                    ? subject.replace(
                        item?.id_promotion?._id,
                        item?.id_promotion?.title?.vi
                      )
                    : item?.id_collaborator
                    ? subject.replace(
                        item?.id_collaborator?._id,
                        item?.id_collaborator?.full_name
                      )
                    : item?.id_customer
                    ? subject.replace(
                        item?.id_customer?._id,
                        item?.id_customer?.full_name
                      )
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
                    ? predicate.replace(
                        item?.id_order?._id,
                        item?.id_order?.id_view
                      )
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
                    <div
                      key={index}
                      className="div-item-list-activity-detail-order"
                    >
                      <div className="div-name">
                        <a className="text-title">{object}</a>
                        {item?.type !== "customer_collect_points_order" && (
                          <a
                            className={
                              money.slice(0, 1) === "-"
                                ? "text-money-deduction"
                                : "text-money-plus"
                            }
                          >
                            {item?.value === 0
                              ? ""
                              : money.slice(0, 1) === "-"
                              ? formatMoney(item?.value)
                              : "+" + formatMoney(item?.value)}
                          </a>
                        )}
                      </div>
                      <a className="text-date">
                        {moment(new Date(item?.date_create)).format(
                          "DD/MM/yyy - HH:mm"
                        )}
                      </a>
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 div-pagination p-2">
                <a>Tổng: {totalHistory}</a>
                <div>
                  <Pagination
                    current={currentPage}
                    onChange={onChange}
                    total={totalHistory}
                    showSizeChanger={false}
                    pageSize={20}
                  />
                </div>
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </>
    </div>
  );
};

export default DetailsOrder;
