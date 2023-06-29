import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "./index.scss";
import { useEffect, useState } from "react";
import { cancelGroupOrderApi, getOrderDetailApi } from "../../../../api/order";
import { Button, Col, FloatButton, Image, Popconfirm, Row } from "antd";
import { getLanguageState, getUser } from "../../../../redux/selectors/auth";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { formatMoney } from "../../../../helper/formatMoney";
import { loadingAction } from "../../../../redux/actions/loading";
import userIma from "../../../../assets/images/user.png";

import { errorNotify } from "../../../../helper/toast";
import i18n from "../../../../i18n";

const DetailsOrderSchedule = () => {
  // const { state } = useLocation();
  // const { id } = state || {};
  const params = useParams();
  const id = params?.id;
  const [hideShow, setHideShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getOrderDetailApi(id)
      .then((res) => {
        setData(res);
        setHideShow(true);
      })
      .catch((err) => {});
  }, [id]);

  useEffect(() => {
    data?.service?.optional_service.map((item) => {
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
  }, [data]);

  const showPopconfirm = () => {
    setOpen(true);
  };

  const timeWork = (data) => {
    const start = moment(new Date(data?.date_work)).format("HH:mm");

    const timeEnd = moment(new Date(data?.date_work))
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
          <a className="label">{`${i18n.t("order_detail", { lng: lang })}`}</a>
          <Row>
            <Col span={14} className="col-left">
              <a className="label-customer">{`${i18n.t("customer", {
                lng: lang,
              })}`}</a>
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
                    {`${i18n.t("name", { lng: lang })}`}:{" "}
                    {data?.id_customer?.full_name}
                  </a>
                  <a className="label-name">
                    {`${i18n.t("phone", { lng: lang })}`}:{" "}
                    {data?.id_customer?.phone}
                  </a>
                  <a className="label-name">
                    {`${i18n.t("age", { lng: lang })}`}:{" "}
                    {data?.id_customer?.birthday
                      ? moment().diff(data?.id_customer?.birthday, "years")
                      : `${i18n.t("not_update", { lng: lang })}`}
                  </a>
                </div>
              </div>
            </Col>
            {data?.id_collaborator && (
              <Col span={10} className="col-right">
                <a className="label-ctv">{`${i18n.t("current_collaborator", {
                  lng: lang,
                })}`}</a>
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
                    <Link
                      to={`/details-collaborator/${data?.id_collaborator?._id}`}
                    >
                      <a className="label-name">
                        {`${i18n.t("name", { lng: lang })}`}:{" "}
                        {data?.id_collaborator?.full_name}
                      </a>
                    </Link>

                    <a className="label-name">
                      {`${i18n.t("phone", { lng: lang })}`}:{" "}
                      {data?.id_collaborator?.phone}
                    </a>
                    <a className="label-name">
                      {`${i18n.t("age", { lng: lang })}`}:{" "}
                      {data?.id_collaborator?.birthday
                        ? moment().diff(
                            data?.id_collaborator?.birthday,
                            "years"
                          )
                        : `${i18n.t("not_update", { lng: lang })}`}
                    </a>
                  </div>
                </div>
              </Col>
            )}
          </Row>
          <div>
            <div className="div-details-service">
              <a className="label-details">
                {" "}
                {`${i18n.t("detail", { lng: lang })}`}
              </a>
              <div className="div-details-order">
                <div className="div-title-details">
                  <a className="title">
                    {`${i18n.t("service", { lng: lang })}`}
                  </a>
                </div>
                <a className="text-colon">:</a>
                <a className="text-service-order">
                  {data?.type === "loop" && data?.is_auto_order
                    ? `${i18n.t("repeat", { lng: lang })}`
                    : data?.service?._id?.kind === "giup_viec_theo_gio"
                    ? `${i18n.t("cleaning", { lng: lang })}`
                    : data?.service?._id?.kind === "giup_viec_co_dinh"
                    ? `${i18n.t("cleaning_subscription", {
                        lng: lang,
                      })}`
                    : data?.service?._id?.kind === "phuc_vu_nha_hang"
                    ? `${i18n.t("serve", { lng: lang })}`
                    : ""}
                </a>
              </div>
              <div className="div-details-order">
                <div className="div-title-details">
                  <a className="title">{`${i18n.t("time", { lng: lang })}`}</a>
                </div>
                <a className="text-colon">:</a>
                <div className="div-times">
                  <a className="text-date">
                    - {`${i18n.t("date_work", { lng: lang })}`}:{" "}
                    {moment(new Date(data?.date_work)).format("DD/MM/YYYY")}
                  </a>
                  <a className="text-date">
                    - {`${i18n.t("time_work", { lng: lang })}`}:{" "}
                    {timeWork(data)}
                  </a>
                </div>
              </div>

              <div className="div-details-order">
                <div className="div-title-details">
                  <a className="title">{`${i18n.t("address", {
                    lng: lang,
                  })}`}</a>
                </div>
                <a className="text-colon">:</a>
                <a className="text-address-details">{data?.address}</a>
              </div>

              {data?.note && (
                <div className="div-details-order">
                  <div className="div-title-details">
                    <a className="title">{`${i18n.t("note", {
                      lng: lang,
                    })}`}</a>
                  </div>
                  <a className="text-colon">:</a>
                  <a className="text-address-details">{data?.note}</a>
                </div>
              )}

              {data?.service?.optional_service?.map((item) => {
                return (
                  <>
                    {item?.type === "single_select_horizontal_thumbnail"
                      ? item?.extend_optional?.map((item) => {
                          return (
                            <div className="div-details-order">
                              <div className="div-title-details">
                                <a className="title">{`${i18n.t("business", {
                                  lng: lang,
                                })}`}</a>
                              </div>
                              <a className="text-colon">:</a>
                              <div className="div-add">
                                <a className="text-title-add">
                                  - {item?.title?.[lang]}
                                </a>
                              </div>
                            </div>
                          );
                        })
                      : null}
                  </>
                );
              })}

              {data?.service?.optional_service?.map((item) => {
                return (
                  <>
                    {item?.type === "multi_select_horizontal_thumbnail"
                      ? item?.extend_optional?.map((item) => {
                          return (
                            <div className="div-details-order">
                              <div className="div-title-details">
                                <a className="title">{`${i18n.t(
                                  "extra_service",
                                  { lng: lang }
                                )}`}</a>
                              </div>
                              <a className="text-colon">:</a>
                              <div className="div-add">
                                <a className="text-title-add">
                                  - {item?.title?.[lang]}
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
                  <a className="title">{`${i18n.t("payment", {
                    lng: lang,
                  })}`}</a>
                </div>
                <a className="text-colon">:</a>
                <a className="text-address-details">
                  {data?.payment_method === "cash"
                    ? `${i18n.t("cash", { lng: lang })}`
                    : "G-pay"}
                </a>
              </div>

              <div className="div-details-order">
                <div className="div-title-details">
                  <a className="title">{`${i18n.t("provisional", {
                    lng: lang,
                  })}`}</a>
                </div>
                <a className="text-colon">:</a>
                <div className="div-details-price">
                  <div className="div-price">
                    <div className="div-title-colon">
                      <div className="div-title-details">
                        <a className="title">
                          - {`${i18n.t("provisional_price", { lng: lang })}`}
                        </a>
                      </div>
                      <a className="text-colon">:</a>
                    </div>
                    <a className="text-moeny-details">
                      {data?.service?._id?.kind === "giup_viec_co_dinh"
                        ? formatMoney(data?.initial_fee)
                        : formatMoney(price)}
                    </a>
                  </div>

                  <div className="div-price">
                    <div className="div-title-colon">
                      <div className="div-title-details">
                        <a className="title">
                          - {`${i18n.t("system_fee", { lng: lang })}`}
                        </a>
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
                        {item?.type === "multi_select_horizontal_thumbnail"
                          ? item?.extend_optional?.map((item) => {
                              return (
                                <div className="div-price">
                                  <div className="div-title-colon">
                                    <div className="div-title-details">
                                      <a className="title">
                                        - {item?.title?.[lang]}
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
                  {data?.tip_collaborator !== 0 && (
                    <div className="div-price">
                      <div className="div-title-colon">
                        <div className="div-title-details">
                          <a className="title">
                            - {`${i18n.t("tips", { lng: lang })}`}
                          </a>
                        </div>
                        <a className="text-colon">:</a>
                      </div>
                      <>
                        <a className="text-moeny-details">
                          +{formatMoney(data?.tip_collaborator)}
                        </a>
                      </>
                    </div>
                  )}

                  {data?.code_promotion && (
                    <div className="div-price">
                      <div className="div-title-colon">
                        <div className="div-title-details">
                          <a className="title">
                            - {`${i18n.t("promotion", { lng: lang })}`}
                          </a>
                        </div>
                        <a className="text-colon">:</a>
                      </div>

                      {data?.code_promotion && (
                        <>
                          <a className="text-moeny-details">
                            + {`${i18n.t("code", { lng: lang })}`}:{" "}
                            {data?.code_promotion?.code}
                          </a>
                          <a className="money-red">
                            {formatMoney(-data?.code_promotion?.discount)}
                          </a>
                        </>
                      )}
                    </div>
                  )}

                  {data?.event_promotion?.map((item, key) => {
                    return (
                      <div className="div-price">
                        <div className="div-title-colon">
                          <div className="div-title-details">
                            <a className="title">
                              - {`${i18n.t("programme", { lng: lang })}`}
                            </a>
                          </div>
                          <a className="text-colon">:</a>
                        </div>
                        <>
                          <a>+ {item?._id?.title?.[lang]}</a>
                          <a className="money-event-discount">
                            {formatMoney(-item?.discount)}
                          </a>
                        </>
                      </div>
                    );
                  })}

                  <div className="div-price">
                    <div className="div-title-colon">
                      <div className="div-title-details">
                        <a className="title-total">
                          - {`${i18n.t("total_money", { lng: lang })}`}
                        </a>
                      </div>
                      <a className="text-colon">:</a>
                    </div>
                    <a className="text-moeny-details-total">
                      {formatMoney(data?.final_fee)}
                    </a>
                  </div>
                </div>
              </div>
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
