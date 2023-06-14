import {
  Button,
  Col,
  Dropdown,
  FloatButton,
  Image,
  Input,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tabs,
} from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
import { getElementState, getUser } from "../../../redux/selectors/auth";
import { MoreOutlined } from "@ant-design/icons";
import EditTimeOrder from "../ManageOrder/EditTimeGroupOrder";
import EditTimeOrderSchedule from "./EditTimeOrderSchedule";
import { getListReasonCancel } from "../../../api/reasons";
import { ModalBody, ModalFooter, ModalHeader, Modal } from "reactstrap";
import LoadingPagination from "../../../components/paginationLoading";
const width = window.innerWidth;

const DetailsOrder = () => {
  // const { state } = useLocation();
  // const { id } = state || {};
  const params = useParams();
  const id = params?.id;
  const [dataGroup, setDataGroup] = useState({
    date_work_schedule: [{ data: "2023-02-21T00:30:00.000Z" }],
  });
  const [dataList, setDataList] = useState([]);
  const [dataHistory, setDataHistory] = useState([]);
  const [totalHistory, setTotalHistory] = useState([]);
  const [hideShow, setHideShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalDeleteList, setModalDeleteList] = useState(false);
  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openCancelOrder, setOpenCancelOrder] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [rowIndex, setRowIndex] = useState();
  const [itemEdit, setItemEdit] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState(0);
  const [idReason, setIdReason] = useState("");
  const [dataReason, setDataReason] = useState([]);
  const [noteReason, setNoteReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggle = () => setModal(!modal);
  const toggleDelete = () => setModalDelete(!modalDelete);
  const toggleDeleteList = () => setModalDeleteList(!modalDeleteList);
  const reasonOption = [];
  const user = useSelector(getUser);
  const checkElement = useSelector(getElementState);

  useEffect(() => {
    getListReasonCancel()
      .then((res) => {
        setDataReason(res?.data);
      })
      .catch((err) => {});
  }, []);

  dataReason?.map((item) => {
    reasonOption.push({
      value: item?._id,
      label: item?.title?.vi,
    });
  });

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

  useEffect(() => {
    dataGroup?.service?.optional_service.map((item) => {
      return (
        <>
          {item?.type === "select_horizontal_no_thumbnail"
            ? item?.extend_optional?.map((i) => {
                setPrice(i?.price);
              })
            : null}
        </>
      );
    });
  }, [dataGroup]);

  const timeWork = (data) => {
    const start = moment(new Date(data?.date_work_schedule[0]?.date)).format(
      "HH:mm"
    );

    const timeEnd = moment(new Date(data?.date_work_schedule[0]?.date))
      .add(data?.total_estimate, "hours")
      .format("HH:mm");

    return start + " - " + timeEnd + "   (" + data?.total_estimate + " giờ )";
  };

  const timeWorkList = (data) => {
    const start = moment(new Date(data?.date_work)).format("HH:mm");

    const timeEnd = moment(new Date(data?.date_work))
      .add(data?.total_estimate, "hours")
      .format("HH:mm");

    return start + " - " + timeEnd;
  };

  const handleCancelGroupOrder = (_id) => {
    dispatch(loadingAction.loadingRequest(true));
    cancelGroupOrderApi(_id, {
      id_reason_cancel: idReason,
    })
      .then((res) => {
        setModalDelete(false);
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
    changeStatusOrderApi(_id, {
      status: "cancel",
      id_reason_cancel: idReason,
      note_admin: noteReason,
    })
      .then((res) => {
        setModalDeleteList(false);
        getOrderByGroupOrderApi(id)
          .then((res) => {
            setDataGroup(res?.data?.groupOrder);
            setDataList(res?.data?.listOrder);
            dispatch(loadingAction.loadingRequest(false));
          })
          .catch((err) => {});
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = dataHistory?.length < 20 ? 20 : dataHistory.length;
    const start = page * dataLength - dataLength;
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
      width: "10%",
    },
    {
      title: "Ngày tạo",
      render: (data) => {
        return (
          <div className="div-create-details-order">
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
              {dataGroup?.type === "loop" && dataGroup?.is_auto_order
                ? "Lặp lại"
                : dataGroup?.service?._id?.kind === "giup_viec_theo_gio"
                ? "Theo giờ"
                : dataGroup?.service?._id?.kind === "giup_viec_co_dinh"
                ? "Cố định"
                : dataGroup?.service?._id?.kind === "phuc_vu_nha_hang"
                ? "Phục vụ "
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
          <div className="div-worktime-detail-order">
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
      render: (data) => <p className="text-address-details">{data?.address}</p>,
    },
    {
      title: "Cộng tác viên",
      render: (data) => (
        <>
          {!data?.id_collaborator ? (
            <a>Đang tìm kiếm</a>
          ) : (
            <Link to={`/details-collaborator/${data?.id_collaborator}`}>
              <a className="text-collaborator">{data?.name_collaborator}</a>
            </Link>
          )}
        </>
      ),
      align: "center",
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
      align: "center",
      render: (data, record, index) => {
        return (
          <>
            <div>
              {checkElement?.includes("change_status_order_guvi_job") && (
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
                          rowIndex === index ? setOpenStatus(true) : ""
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
              )}

              {checkElement?.includes("cancel_order_detail_guvi_job") && (
                <div>
                  {data?.status === "done" ||
                  data?.status === "cancel" ? null : (
                    <div>
                      <Button
                        className="btn-confirm-order mt-1"
                        onClick={toggleDeleteList}
                      >
                        Huỷ việc
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
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
        <Link to={`/details-order/details-order-schedule/${itemEdit?._id}`}>
          <a>Chi tiết</a>
        </Link>
      ),
    },
    {
      key: 2,
      label: (
        <EditTimeOrderSchedule
          idOrder={itemEdit?._id}
          dateWork={itemEdit?.date_work}
          id={id}
          setDataGroup={setDataGroup}
          setDataList={setDataList}
          setIsLoading={setIsLoading}
          estimate={itemEdit?.total_estimate}
        />
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
                  <a className="label-detail">Chi tiết công việc</a>
                  <div className="div-details-kh-ctv">
                    <div className="col-left">
                      <a className="label-customer">Khách hàng</a>
                      <div className="div-body-details">
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
                    </div>
                    {dataGroup?.id_collaborator && (
                      <div className="col-right">
                        <a className="label-ctv">Cộng tác viên hiện tại</a>
                        <div className="div-body-details">
                          <Image
                            src={dataGroup?.id_collaborator?.avatar}
                            className="img-collaborator"
                          />

                          <div className="div-info">
                            <Link
                              to={`/details-collaborator/${dataGroup?.id_collaborator?._id}`}
                            >
                              <a className="label-name">
                                Tên: {dataGroup?.id_collaborator?.full_name}
                              </a>
                            </Link>

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
                            <a className="label-name">
                              Số sao: {dataGroup?.id_collaborator?.star}
                              <i class="uil uil-star icon-star"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="div-details-service">
                      <a className="label-details">Chi tiết</a>
                      <div className="div-details-order">
                        <div className="div-title-details">
                          <a className="title">Dịch vụ </a>
                        </div>
                        <a className="text-colon">:</a>
                        <a className="text-service-order">
                          {dataGroup?.type === "loop" &&
                          dataGroup?.is_auto_order
                            ? "Lặp lại hàng tuần"
                            : dataGroup?.service?._id?.kind ===
                              "giup_viec_theo_gio"
                            ? "Giúp việc theo giờ"
                            : dataGroup?.service?._id?.kind ===
                              "giup_viec_co_dinh"
                            ? "Giúp việc cố định"
                            : dataGroup?.service?._id?.kind ===
                              "phuc_vu_nha_hang"
                            ? "Phục vụ nhà hàng"
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
                            ).format("DD/MM/YYYY")}{" "}
                            (
                            {moment(
                              new Date(dataGroup?.date_work_schedule[0].date)
                            )
                              .locale("vi", vi)
                              .format("dd")}
                            )
                          </a>
                          <a className="text-date">
                            - Giờ làm: {timeWork(dataGroup)}
                          </a>
                        </div>
                        {dataGroup?.status === "pending" &&
                        dataGroup?.service?._id?.kind !==
                          "giup_viec_co_dinh" ? (
                          <div className="div-edit">
                            <EditTimeOrder
                              idOrder={dataGroup?._id}
                              dateWork={dataGroup?.date_work_schedule[0].date}
                              code={
                                dataGroup?.code_promotion
                                  ? dataGroup?.code_promotion?.code
                                  : ""
                              }
                              setIsLoading={setIsLoading}
                              idDetail={id}
                              setDataGroup={setDataGroup}
                              setDataList={setDataList}
                              details={true}
                            />
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="div-details-order">
                        <div className="div-title-details">
                          <a className="title"> Địa chỉ</a>
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

                      {dataGroup?.service?.optional_service?.map((item) => {
                        return (
                          <>
                            {item?.type === "single_select_horizontal_thumbnail"
                              ? item?.extend_optional?.map((item) => {
                                  return (
                                    <div className="div-details-order">
                                      <div className="div-title-details">
                                        <a className="title">Kinh doanh</a>
                                      </div>
                                      <a className="text-colon">:</a>
                                      <div className="div-add">
                                        <a className="text-title-add">
                                          - {item?.title?.vi}
                                        </a>
                                      </div>
                                    </div>
                                  );
                                })
                              : null}
                          </>
                        );
                      })}

                      {dataGroup?.service?.optional_service?.map((item) => {
                        return (
                          <>
                            {item?.type === "multi_select_horizontal_thumbnail"
                              ? item?.extend_optional?.map((item) => {
                                  return (
                                    <div className="div-details-order">
                                      <div className="div-title-details">
                                        <a className="title">Dịch vụ thêm</a>
                                      </div>
                                      <a className="text-colon">:</a>
                                      <div className="div-add">
                                        <a className="text-title-add">
                                          - {item?.title?.vi}
                                        </a>
                                      </div>
                                    </div>
                                  );
                                })
                              : null}
                          </>
                        );
                      })}

                      <div className="div-details-order">
                        <div className="div-title-details">
                          <a className="title">Thanh toán</a>
                        </div>
                        <a className="text-colon">:</a>
                        <a className="text-address-details">
                          {dataGroup?.payment_method === "cash"
                            ? "Tiền mặt"
                            : "G-pay"}
                        </a>
                      </div>

                      <div className="div-details-order-price">
                        <div className="div-title-details">
                          <a className="title">Tạm tính</a>
                        </div>
                        {/* <a className="text-colon">:</a> */}
                        <div className="div-details-price">
                          <div className="div-price">
                            <div className="div-title-colon">
                              <div className="div-title-details">
                                <a className="title">- Giá tạm tính</a>
                              </div>
                              <a className="text-colon">:</a>
                            </div>
                            <a className="text-moeny-details">
                              {dataGroup?.type === "schedule"
                                ? formatMoney(dataGroup?.initial_fee)
                                : dataGroup?.type === "loop" &&
                                  !dataGroup?.is_auto_order
                                ? formatMoney(price)
                                : dataGroup?.type === "loop" &&
                                  dataGroup?.is_auto_order
                                ? formatMoney(price)
                                : ""}
                            </a>
                          </div>

                          <div className="div-price">
                            <div className="div-title-colon">
                              <div className="div-title-details">
                                <a className="title">- Phí hệ thống</a>
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
                                {item?.type ===
                                "multi_select_horizontal_thumbnail"
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

                          {dataGroup?.code_promotion && (
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
                          )}

                          {dataGroup?.event_promotion?.map((item, key) => {
                            return (
                              <div className="div-price">
                                <div className="div-title-colon">
                                  <div className="div-title-details">
                                    <a className="title">- Chương trình</a>
                                  </div>
                                  <a className="text-colon">:</a>
                                </div>
                                <>
                                  <a className="text-name-promotion">
                                    + {item?._id?.title?.vi}
                                  </a>
                                  <a className="money-event-discount">
                                    {formatMoney(-item?.discount)}
                                  </a>
                                </>
                              </div>
                            );
                          })}

                          {dataGroup?.tip_collaborator !== 0 && (
                            <div className="div-price">
                              <div className="div-title-colon">
                                <div className="div-title-details">
                                  <a className="title">- Tiền tip</a>
                                </div>
                                <a className="text-colon">:</a>
                              </div>
                              <>
                                <a className="text-moeny-details">
                                  +{formatMoney(dataGroup?.tip_collaborator)}
                                </a>
                              </>
                            </div>
                          )}

                          <div className="div-price">
                            <div className="div-title-colon">
                              <div className="div-title-details">
                                <a className="title-total">- Tổng tiền</a>
                              </div>
                              <a className="text-colon">:</a>
                            </div>
                            <a className="text-moeny-details-total">
                              {formatMoney(dataGroup?.final_fee)}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {checkElement?.includes("cancel_order_detail_guvi_job") && (
                    <>
                      {dataGroup?.type === "schedule" && (
                        <div>
                          {dataGroup?.status === "pending" ||
                          dataGroup?.status === "confirm" ? (
                            <Button
                              className="btn-cancel"
                              onClick={toggleDelete}
                            >
                              Huỷ việc
                            </Button>
                          ) : null}
                        </div>
                      )}
                    </>
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
                      scroll={
                        width <= 490
                          ? {
                              x: 1600,
                            }
                          : null
                      }
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
                    <div key={index} className="div-item-activity-detail-order">
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

      <div>
        <Modal isOpen={modalDelete} toggle={toggleDelete}>
          <ModalHeader toggle={toggleDelete}>Huỷ công việc</ModalHeader>
          <ModalBody>
            <a>
              Bạn có chắc muốn huỷ việc
              {dataGroup?.id_view} này không?
            </a>
            <div>
              <a>Chọn lí do huỷ</a>
              <Select
                style={{ width: "100%" }}
                value={idReason}
                onChange={(e) => setIdReason(e)}
                options={reasonOption}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="primary"
              onClick={() => handleCancelGroupOrder(dataGroup?._id)}
            >
              Có
            </Button>
            <Button type="#ddd" onClick={toggleDelete}>
              Không
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      <div>
        <Modal isOpen={modalDeleteList} toggle={toggleDeleteList}>
          <ModalHeader toggle={toggleDeleteList}>Huỷ công việc</ModalHeader>
          <ModalBody>
            <a>Bạn có chắc muốn huỷ việc {itemEdit?.id_view} này không?</a>
            <div>
              <a>Chọn lí do huỷ</a>
              <Select
                style={{ width: "100%" }}
                value={idReason}
                onChange={(e) => setIdReason(e)}
                options={reasonOption}
              />
            </div>
            <div>
              <a>Nhập lí do khác</a>
              <Input
                placeholder="Vui lòng nhập nếu có lí do khác"
                onChange={(e) => setNoteReason(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="primary"
              onClick={() => handleCancelOrder(itemEdit?._id)}
            >
              Có
            </Button>
            <Button type="#ddd" onClick={toggleDeleteList}>
              Không
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default DetailsOrder;
