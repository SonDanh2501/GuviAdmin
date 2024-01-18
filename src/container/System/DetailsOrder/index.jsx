import { MoreOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Dropdown,
  FloatButton,
  Image,
  Pagination,
  Space,
  Table,
  Tabs,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  blockCustomerApi,
  favouriteCustomerApi,
  unblockCustomerApi,
  unfavouriteCustomerApi,
} from "../../../api/customer";
import {
  cancelGroupOrderApi,
  changeStatusOrderApi,
  checkOrderApi,
  getHistoryOrderApi,
  getOrderByGroupOrderApi,
} from "../../../api/order";
import { getListReasonCancel } from "../../../api/reasons";
import userIma from "../../../assets/images/user.png";
import ModalCustom from "../../../components/modalCustom";
import LoadingPagination from "../../../components/paginationLoading";
import InputCustom from "../../../components/textInputCustom";
import { formatMoney } from "../../../helper/formatMoney";
import { errorNotify } from "../../../helper/toast";
import i18n from "../../../i18n";
import { loadingAction } from "../../../redux/actions/loading";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import EditTimeOrder from "../ManageOrder/EditTimeGroupOrder";
import EditTimeOrderSchedule from "./EditTimeOrderSchedule";
import "./index.scss";
import InfoService from "./components/InfoService";
import InfoBill from "../../../pages/ManageOrder/CreateOrder/InfoBill";
import DetailBill from "../../../pages/ManageOrder/CreateOrder/DetailBill";
const width = window.innerWidth;

const DetailsOrder = () => {
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
  const [openStatus, setOpenStatus] = useState(false);
  const [openCancelOrder, setOpenCancelOrder] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [rowIndex, setRowIndex] = useState();
  const [itemEdit, setItemEdit] = useState({
    date_work: new Date().toISOString(),
    event_promotion: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState(0);
  const [priceAddService, setPriceAddService] = useState(0);
  const [idReason, setIdReason] = useState("");
  const [dataReason, setDataReason] = useState([]);
  const [noteReason, setNoteReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalFavourite, setModalFavourite] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [modalCheck, setModalCheck] = useState(false);
  const [note, setNote] = useState("");
  const dispatch = useDispatch();
  const toggleDelete = () => setModalDelete(!modalDelete);
  const toggleDeleteList = () => setModalDeleteList(!modalDeleteList);
  const reasonOption = [];
  const lang = useSelector(getLanguageState);
  const checkElement = useSelector(getElementState);

  useEffect(() => {
    getListReasonCancel(lang)
      .then((res) => {
        setDataReason(res?.data);
      })
      .catch((err) => {});

    window.scroll(0, 0);
  }, []);

  dataReason?.map((item) => {
    reasonOption.push({
      value: item?._id,
      label: item?.title?.[lang],
    });
  });

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getOrderByGroupOrderApi(id, lang)
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

    getHistoryOrderApi(id, 0, 20, lang)
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

    return (
      start +
      " - " +
      timeEnd +
      "   (" +
      data?.total_estimate +
      ` ${i18n.t("hour", { lng: lang })} )`
    );
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
        getOrderByGroupOrderApi(id, lang)
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
        setOpenStatus(false);
        getOrderByGroupOrderApi(id, lang)
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
        setOpenStatus(false);
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
        getOrderByGroupOrderApi(id, lang)
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

  const onHandleFavourite = () => {
    setIsLoading(true);
    const checkFavourite =
      dataGroup?.id_customer?.id_favourite_collaborator?.includes(
        dataGroup?.id_collaborator?._id
      );
    if (checkFavourite) {
      unfavouriteCustomerApi(
        dataGroup?.id_customer?._id,
        dataGroup?.id_collaborator?._id
      )
        .then((res) => {
          setIsLoading(false);
          setModalFavourite(false);
          getOrderByGroupOrderApi(id, lang)
            .then((res) => {
              setDataGroup(res?.data?.groupOrder);
              setDataList(res?.data?.listOrder);
              dispatch(loadingAction.loadingRequest(false));
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    } else {
      favouriteCustomerApi(
        dataGroup?.id_customer?._id,
        dataGroup?.id_collaborator?._id
      )
        .then((res) => {
          setIsLoading(false);
          setModalFavourite(false);
          getOrderByGroupOrderApi(id, lang)
            .then((res) => {
              setDataGroup(res?.data?.groupOrder);
              setDataList(res?.data?.listOrder);
              dispatch(loadingAction.loadingRequest(false));
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    }
  };

  const onHandleBlock = () => {
    setIsLoading(true);
    const checkFavourite =
      dataGroup?.id_customer?.id_block_collaborator?.includes(
        dataGroup?.id_collaborator?._id
      );
    if (checkFavourite) {
      unblockCustomerApi(
        dataGroup?.id_customer?._id,
        dataGroup?.id_collaborator?._id
      )
        .then((res) => {
          setIsLoading(false);
          setModalBlock(false);
          getOrderByGroupOrderApi(id, lang)
            .then((res) => {
              setDataGroup(res?.data?.groupOrder);
              setDataList(res?.data?.listOrder);
              dispatch(loadingAction.loadingRequest(false));
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    } else {
      blockCustomerApi(
        dataGroup?.id_customer?._id,
        dataGroup?.id_collaborator?._id
      )
        .then((res) => {
          setIsLoading(false);
          setModalBlock(false);
          getOrderByGroupOrderApi(id, lang)
            .then((res) => {
              setDataGroup(res?.data?.groupOrder);
              setDataList(res?.data?.listOrder);
              dispatch(loadingAction.loadingRequest(false));
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    }
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

  const checkNoteOrder = (_id) => {
    setIsLoading(true);
    checkOrderApi(_id, { note_admin: note })
      .then((res) => {
        setIsLoading(false);
        setModalCheck(false);
        getOrderByGroupOrderApi(id, lang)
          .then((res) => {
            setDataGroup(res?.data?.groupOrder);
            setDataList(res?.data?.listOrder);
            dispatch(loadingAction.loadingRequest(false));
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const columns = [
    {
      title: `${i18n.t("code", { lng: lang })}`,
      render: (data) => {
        return <a className="text-id">{data?.id_view}</a>;
      },
      width: "10%",
    },
    {
      title: `${i18n.t("date_create", { lng: lang })}`,
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
      title: `${i18n.t("service", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-service">
            <a className="text-service">
              {dataGroup?.type === "loop" && dataGroup?.is_auto_order
                ? `${i18n.t("repeat", { lng: lang })}`
                : dataGroup?.service?._id?.kind === "giup_viec_theo_gio"
                ? `${i18n.t("cleaning", { lng: lang })}`
                : dataGroup?.service?._id?.kind === "giup_viec_co_dinh"
                ? `${i18n.t("cleaning_subscription", {
                    lng: lang,
                  })}`
                : dataGroup?.service?._id?.kind === "phuc_vu_nha_hang"
                ? `${i18n.t("serve", { lng: lang })}`
                : ""}
            </a>
            <a className="text-service">{timeWorkList(data)}</a>
          </div>
        );
      },
    },
    {
      title: `${i18n.t("time", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-worktime-detail-order">
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
      title: `${i18n.t("address", { lng: lang })}`,
      render: (data) => <p className="text-address-details">{data?.address}</p>,
    },
    {
      title: `${i18n.t("collaborator", { lng: lang })}`,
      render: (data) => (
        <>
          {!data?.id_collaborator ? (
            <a>{`${i18n.t("searching", { lng: lang })}`}</a>
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
      title: `${i18n.t("status", { lng: lang })}`,
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
                        <ModalCustom
                          isOpen={openStatus}
                          title={`${i18n.t("change_status_job", {
                            lng: lang,
                          })}`}
                          handleCancel={() => setOpenStatus(false)}
                          handleOk={() => handleChangeStatus(data?._id)}
                          textOk={`${i18n.t("yes", {
                            lng: lang,
                          })}`}
                        />
                      )}

                      <Button
                        className="btn-confirm-order"
                        style={{ width: "auto" }}
                        onClick={() =>
                          rowIndex === index ? setOpenStatus(true) : ""
                        }
                      >
                        {data?.status === "confirm"
                          ? `${i18n.t("start", { lng: lang })}`
                          : data?.status === "doing"
                          ? `${i18n.t("complete", { lng: lang })}`
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
                        style={{ width: "auto" }}
                        className="btn-confirm-order mt-1"
                        onClick={toggleDeleteList}
                      >
                        {`${i18n.t("cancellation", { lng: lang })}`}
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
    {
      title: `${i18n.t("note", { lng: lang })}`,
      render: (data) => {
        return (
          <div>
            {data?.note_admin === "" && (
              <Checkbox
                checked={data?.note_admin === "" ? false : true}
                onChange={() => setModalCheck(true)}
              />
            )}
            <a>{data?.note_admin}</a>
          </div>
        );
      },
      align: "center",
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <Link to={`/details-order/details-order-schedule/${itemEdit?._id}`}>
          <p className="m-0">{`${i18n.t("detail", { lng: lang })}`}</p>
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
  // ------------------------ Phần mới viết---------------------------------------- //
  const [infoBill, setInfoBill] = useState();
  const [codePromotion, setCodePromotion] = useState();
  const [eventPromotion, setEventPromotion] = useState();
  const [tipCollaborator, setTipCollaborator] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [finalFee, setFinalFee] = useState(0);
  const [initialFee, setInitialFee] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [netIncomeCollaborator, setNetIncomeCollaborator] = useState(0);
  // code_promotion={resultCodePromotion}
  // event_promotion={listEventPromotion}
  // tip_collaborator={tipCollaborator}
  // service_fee={serviceFee}
  // total_fee={totalFee}
  // final_fee={finalFee}
  // initial_fee={initialFee}
  // platform_fee={platformFee}
  // net_income_collaborator={netIncomeCollaborator}
  useEffect(() => {
    let _temp_service_fee = 0;
    if (dataGroup) {
      setInfoBill({
        date_work_schedule: dataGroup?.date_work_schedule,
        info: dataGroup,
      });
      dataGroup?.service_fee?.map((item) => {
        _temp_service_fee += item.fee;
      });
      setCodePromotion(dataGroup?.code_promotion);
      setEventPromotion(dataGroup?.event_promotion);
      setTipCollaborator(dataGroup?.tip_collaborator);
      setFinalFee(dataGroup?.final_fee);
      setInitialFee(dataGroup?.initial_fee);
      setPlatformFee(dataGroup?.platform_fee);
      setNetIncomeCollaborator(dataGroup?.net_income_collaborator);
      setTotalFee(dataGroup?.initial_fee + _temp_service_fee);
      setServiceFee(_temp_service_fee);
    }
  }, [dataGroup]);
  // console.log("codePromotion   ", codePromotion);
  // ------------------------ Phần mới viết---------------------------------------- //
  return (
    <div>
      <>
        <Tabs defaultActiveKey="1" size="large">
          <Tabs.TabPane
            tab={`${i18n.t("order_detail", { lng: lang })}`}
            key="1"
          >
            <>
              {hideShow && (
                <div className="div-container">
                  <a className="label-detail">{`${i18n.t("order_detail", {
                    lng: lang,
                  })}`}</a>
                  <div className="div-details-kh-ctv">
                    <div className="col-left">
                      <a className="label-customer">{`${i18n.t("customer", {
                        lng: lang,
                      })}`}</a>
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
                          <Link
                            to={`/profile-customer/${dataGroup?.id_customer?._id}`}
                          >
                            <a className="label-name">
                              {`${i18n.t("name", { lng: lang })}`}:{" "}
                              {dataGroup?.id_customer?.full_name}
                            </a>
                          </Link>

                          <a className="label-name">
                            {`${i18n.t("phone", { lng: lang })}`}:{" "}
                            {dataGroup?.id_customer?.phone}
                          </a>
                          <a className="label-name">
                            {`${i18n.t("age", { lng: lang })}`}:{" "}
                            {dataGroup?.id_customer?.birthday
                              ? moment().diff(
                                  dataGroup?.id_customer?.birthday,
                                  "years"
                                )
                              : `${i18n.t("not_update", { lng: lang })}`}
                          </a>
                        </div>
                      </div>
                    </div>
                    {dataGroup?.id_collaborator && (
                      <div className="col-right">
                        <div className="div-ctv-favourite">
                          <a className="label-ctv">{`${i18n.t(
                            "current_collaborator",
                            { lng: lang }
                          )}`}</a>
                          <Button
                            onClick={() => setModalFavourite(true)}
                            className={
                              dataGroup?.id_customer?.id_favourite_collaborator?.includes(
                                dataGroup?.id_collaborator?._id
                              )
                                ? "btn-favourite"
                                : "btn-unfavourite"
                            }
                          >
                            {dataGroup?.id_customer?.id_favourite_collaborator?.includes(
                              dataGroup?.id_collaborator?._id
                            )
                              ? `${i18n.t("unfavourite", { lng: lang })}`
                              : `${i18n.t("favourite", { lng: lang })}`}
                          </Button>
                          <Button
                            onClick={() => setModalBlock(true)}
                            className="btn-add-block"
                          >
                            {dataGroup?.id_customer?.id_block_collaborator?.includes(
                              dataGroup?.id_collaborator?._id
                            )
                              ? `${i18n.t("unblock", { lng: lang })}`
                              : `${i18n.t("block", { lng: lang })}`}
                          </Button>
                        </div>
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
                                {`${i18n.t("name", { lng: lang })}`}:{" "}
                                {dataGroup?.id_collaborator?.full_name}
                              </a>
                            </Link>

                            <a className="label-name">
                              {`${i18n.t("phone", { lng: lang })}`}:{" "}
                              {dataGroup?.id_collaborator?.phone}
                            </a>
                            <a className="label-name">
                              {`${i18n.t("age", { lng: lang })}`}:{" "}
                              {dataGroup?.id_collaborator?.birthday
                                ? moment().diff(
                                    dataGroup?.id_collaborator?.birthday,
                                    "years"
                                  )
                                : `${i18n.t("not_update", { lng: lang })}`}
                            </a>
                            <a className="label-name">
                              {`${i18n.t("number_star", { lng: lang })}`}:{" "}
                              {dataGroup?.id_collaborator?.star}
                              <i class="uil uil-star icon-star"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <InfoService
                    data={dataGroup}
                    setIsLoading={setIsLoading}
                    setDataGroup={setDataGroup}
                    setDataList={setDataList}
                  />
                  <div className="detail-order_info-service">
                    <InfoBill
                      data={infoBill}
                      title={"Thông tin dịch vụ đơn hàng"}
                    />
                    <DetailBill
                      code_promotion={codePromotion}
                      event_promotion={eventPromotion}
                      tip_collaborator={tipCollaborator}
                      service_fee={serviceFee}
                      total_fee={totalFee}
                      final_fee={finalFee}
                      initial_fee={initialFee}
                      platform_fee={platformFee}
                      net_income_collaborator={netIncomeCollaborator}
                      total_date_work={dataGroup?.date_work_schedule.length}
                    />
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
                              {`${i18n.t("cancellation", { lng: lang })}`}
                            </Button>
                          ) : null}
                        </div>
                      )}
                    </>
                  )}

                  <div className="mt-3 table-detail">
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
          <Tabs.TabPane
            tab={`${i18n.t("order_activity", { lng: lang })}`}
            key="2"
          >
            <div>
              <div className="mt-3">
                {dataHistory?.map((item, index) => {
                  const money = item?.value?.toString();
                  const subject = item?.id_user_system
                    ? item?.title_admin.replace(
                        item?.id_user_system?._id,
                        item?.id_user_system?.full_name
                      )
                    : item?.id_admin_action
                    ? item?.title_admin.replace(
                        item?.id_admin_action?._id,
                        item?.id_admin_action?.full_name
                      )
                    : item?.id_customer
                    ? item?.title_admin.replace(
                        item?.id_customer?._id,
                        item?.id_customer?.full_name
                      )
                    : item?.id_collaborator
                    ? item?.title_admin.replace(
                        item?.id_collaborator?._id,
                        item?.id_collaborator?.full_name
                      )
                    : item?.title_admin.replace(
                        item?.id_promotion?._id,
                        item?.id_promotion?.code
                      );

                  const predicate = item?.id_punish
                    ? subject.replace(
                        item?.id_punish?._id,
                        item?.id_punish?.note_admin
                      )
                    : item?.id_reason_punish
                    ? subject.replace(
                        item?.id_reason_punish?._id,
                        item?.id_reason_punish?.title?.vi
                      )
                    : item?.id_order
                    ? subject.replace(
                        item?.id_order?._id,
                        item?.id_order?.id_view
                      )
                    : item?.id_reward
                    ? subject.replace(
                        item?.id_reward?._id,
                        item?.id_reward?.title?.vi
                      )
                    : item?.id_info_reward_collaborator
                    ? subject.replace(
                        item?.id_info_reward_collaborator?._id,
                        item?.id_info_reward_collaborator
                          ?.id_reward_collaborator?.title?.vi
                      )
                    : item?.id_transistion_collaborator
                    ? subject.replace(
                        item?.id_transistion_collaborator?._id,
                        item?.id_transistion_collaborator?.transfer_note
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
                    : item?.id_promotion
                    ? subject.replace(
                        item?.id_promotion?._id,
                        item?.id_promotion?.title?.vi
                      )
                    : item?.id_admin_action
                    ? subject.replace(
                        item?.id_admin_action?._id,
                        item?.id_admin_action?.full_name
                      )
                    : item?.id_address
                    ? subject.replace(item?.id_address, item?.value_string)
                    : subject.replace(
                        item?.id_transistion_customer?._id,
                        item?.id_transistion_customer?.transfer_note
                      );

                  const object = item?.id_reason_cancel
                    ? predicate.replace(
                        item?.id_reason_cancel?._id,
                        item?.id_reason_cancel?.title?.vi
                      )
                    : item?.id_collaborator
                    ? predicate.replace(
                        item?.id_collaborator?._id,
                        item?.id_collaborator?.full_name
                      )
                    : item?.id_customer
                    ? predicate.replace(
                        item?.id_customer?._id,
                        item?.id_customer?.full_name
                      )
                    : item?.id_address
                    ? predicate.replace(item?.id_address, item?.value_string)
                    : item?.id_order
                    ? predicate.replace(
                        item?.id_order?._id,
                        item?.id_order?.id_view
                      )
                    : item?.id_transistion_collaborator
                    ? predicate.replace(
                        item?.id_transistion_collaborator?._id,
                        item?.id_transistion_collaborator?.transfer_note
                      )
                    : predicate.replace(
                        item?.id_transistion_customer?._id,
                        item?.id_transistion_customer?.transfer_note
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
                <a>
                  {`${i18n.t("total", { lng: lang })}`}: {totalHistory}
                </a>
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
        <ModalCustom
          isOpen={modalDelete}
          title={`${i18n.t("cancel_job", { lng: lang })}`}
          handleOk={() => handleCancelGroupOrder(dataGroup?._id)}
          textOk={`${i18n.t("yes", { lng: lang })}`}
          handleCancel={toggleDelete}
          body={
            <>
              <a>
                {`${i18n.t("want_cancel_job", { lng: lang })}`}{" "}
                {dataGroup?.id_view}
              </a>
              <div>
                <InputCustom
                  title={`${i18n.t("reason_cancellation", { lng: lang })}`}
                  style={{ width: "100%" }}
                  value={idReason}
                  onChange={(e) => setIdReason(e)}
                  options={reasonOption}
                  select={true}
                />
              </div>
            </>
          }
        />

        <ModalCustom
          isOpen={modalFavourite}
          title={
            dataGroup?.id_customer?.id_favourite_collaborator?.includes(
              dataGroup?.id_collaborator?._id
            )
              ? `${i18n.t("cancel_collaborator_favourite", { lng: lang })}`
              : `${i18n.t("add_collaborator_favourite", { lng: lang })}`
          }
          handleOk={onHandleFavourite}
          textOk={
            dataGroup?.id_customer?.id_favourite_collaborator?.includes(
              dataGroup?.id_collaborator?._id
            )
              ? `${i18n.t("cancel_modal", { lng: lang })}`
              : `${i18n.t("add", { lng: lang })}`
          }
          handleCancel={() => setModalFavourite(false)}
          body={
            <a>
              {dataGroup?.id_customer?.id_favourite_collaborator?.includes(
                dataGroup?.id_collaborator?._id
              )
                ? `${i18n.t("want_unfavor_collaborator", { lng: lang })}"${
                    dataGroup?.id_collaborator?.full_name
                  }" ${i18n.t("for_customers", { lng: lang })} "${
                    dataGroup?.id_customer?.full_name
                  }"`
                : `${i18n.t("want_add_unfavor_collaborator", { lng: lang })} "${
                    dataGroup?.id_collaborator?.full_name
                  }" ${i18n.t("for_customers", { lng: lang })} "${
                    dataGroup?.id_customer?.full_name
                  }"`}
            </a>
          }
        />

        <ModalCustom
          isOpen={modalBlock}
          title={
            dataGroup?.id_customer?.id_block_collaborator?.includes(
              dataGroup?.id_collaborator?._id
            )
              ? "Bỏ chặn cộng tác viên"
              : "Chặn công tác viên"
          }
          handleOk={onHandleBlock}
          textOk={
            dataGroup?.id_customer?.id_block_collaborator?.includes(
              dataGroup?.id_collaborator?._id
            )
              ? "Bỏ chặn"
              : "Chặn"
          }
          handleCancel={() => setModalBlock(false)}
          body={
            <a>
              {dataGroup?.id_customer?.id_block_collaborator?.includes(
                dataGroup?.id_collaborator?._id
              )
                ? `Bạn có chắc muốn bỏ chặn cộng tác viên ${dataGroup?.id_collaborator?.full_name} cho khách hàng ${dataGroup?.id_customer?.full_name}`
                : `Bạn có chắc muốn chặn công tác viên ${dataGroup?.id_collaborator?.full_name} cho khách hàng ${dataGroup?.id_customer?.full_name}`}
            </a>
          }
        />
      </div>

      <div>
        <ModalCustom
          isOpen={modalDeleteList}
          title={`${i18n.t("cancel_job", { lng: lang })}`}
          handleOk={() => handleCancelOrder(itemEdit?._id)}
          textOk={`${i18n.t("yes", { lng: lang })}`}
          handleCancel={toggleDeleteList}
          body={
            <>
              <a>
                {`${i18n.t("want_cancel_job", { lng: lang })}`}{" "}
                {itemEdit?.id_view}{" "}
              </a>
              <div>
                <InputCustom
                  title={`${i18n.t("reason_cancellation", { lng: lang })}`}
                  style={{ width: "100%" }}
                  value={idReason}
                  onChange={(e) => setIdReason(e)}
                  options={reasonOption}
                  select={true}
                />
              </div>
              <div>
                <InputCustom
                  title={`${i18n.t("other_reason", { lng: lang })}`}
                  onChange={(e) => setNoteReason(e.target.value)}
                />
              </div>
            </>
          }
        />

        <ModalCustom
          isOpen={modalCheck}
          title="Ghi chú"
          handleOk={() => checkNoteOrder(itemEdit?._id)}
          handleCancel={() => setModalCheck(false)}
          textOk="Xong"
          body={
            <>
              <InputCustom
                title="Ghi chú"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                textArea={true}
              />
            </>
          }
        />
      </div>
      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default DetailsOrder;
