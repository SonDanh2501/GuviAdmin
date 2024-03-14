import React, { memo, useEffect, useState } from "react";
import i18n from "../../../i18n";
import {
  Dropdown,
  Pagination,
  Space,
  Table,
  Tooltip,
  Rate,
  Button,
} from "antd";
import { StarFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCookies } from "../../../helper/useCookies";
import useWindowDimensions from "../../../helper/useWindowDimensions";
import { formatMoney } from "../../../helper/formatMoney";
import { useWindowScrollPositions } from "../../../helper/useWindowPosition";
import moment from "moment";
import { Spin, Image } from "antd";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import "./style.scss";
import gold from "../../../assets/images/iconGold.svg";
import member from "../../../assets/images/iconMember.svg";
import platinum from "../../../assets/images/iconPlatinum.svg";
import silver from "../../../assets/images/iconSilver.svg";
import { useNavigate } from "react-router-dom";
import SelectDefault from "../../Select/SelectDefault";

const DataTable = (props) => {
  const {
    columns,
    data,
    actionColumn,
    start,
    pageSize,
    totalItem,
    detectLoading,
    setOpenModalChangeStatus,
    setOpenModalCancel,
  } = props;
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const [saveToCookie] = useCookies();
  const { width } = useWindowDimensions();
  const timeWork = (data) => {
    const start = moment(new Date(data.date_work)).format("HH:mm");
    const timeEnd = moment(new Date(data.date_work))
      .add(data?.total_estimate, "hours")
      .format("HH:mm");
    return start + " - " + timeEnd;
  };
  const { scrollY } = useWindowScrollPositions();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState(data[0]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [items3, setItems3] = useState(items);
  // let items3 = [...items]
  let widthPage = 0;
  let headerTable = [];
  const [hidePhone, setHidePhone] = useState(false);
  const [rowIndex, setRowIndex] = useState(0);
  const navigate = useNavigate();

  // useEffect(() => {
  //   setIsLoading(false);
  // }, [data]);

  // useEffect(() => {
  //   setIsLoading(true);
  // }, [detectLoading]);

  const HeaderTitle = (title) => {
    return (
      <React.Fragment>
        <p className="title-column">{title}</p>
      </React.Fragment>
    );
  };

  const onChangeValue = (item, dataIndex, value) => {
    // item: phan tu trong mang data
    // dataIndex: ten field thay doi
    // value: gia tri moi da thay doi

    if (props.onChangeValue) {
      const data = {
        item,
        dataIndex,
        value,
      };
      props.onChangeValue(data);
    }
  };

  for (const item of columns) {
    const title = item.i18n_title
      ? i18n.t(`${item.i18n_title}`, { lng: lang })
      : item.title;

    const temp = {
      title: () => {
        if (item.customTitle) {
          return item.customTitle;
        } else {
          return (
            <>
              <p className={`title-column ${item?.fontSize}`}>{title}</p>
            </>
          );
        }
      },
      render: (data, record, index) => {
        let linkRedirect = `#`;
        switch (item.key) {
          case "id_view":
            return <p>{data[item.dataIndex]}</p>;
            break;
          case "code_order":
            linkRedirect = `/details-order/${data?.id_group_order}`;
            return (
              <Link
                onClick={() => saveToCookie("order_scrolly", scrollY)}
                to={linkRedirect}
              >
                <p className={`text-id-code-order ${item?.fontSize}`}>
                  {data?.id_view}
                </p>
              </Link>
            );
            break;
          case "code_customer":
            linkRedirect = checkElement?.includes("detail_customer")
              ? `/profile-customer/${data?._id}`
              : "";
            return (
              <Link
                onClick={() => saveToCookie("order_scrolly", scrollY)}
                to={linkRedirect}
              >
                <p className={`text-id-code-customer ${item?.fontSize}`}>
                  {data?.id_view}
                </p>
              </Link>
            );
            break;
          case "date_create":
            return (
              <div className="div-date-create">
                <p className={`${item?.fontSize}`}>
                  {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
                </p>
                <p className={`${item?.fontSize}`}>
                  {moment(new Date(data?.date_create)).format("HH:mm")}
                </p>
              </div>
            );
            break;
          case "customer-name-phone":
            return (
              <div className="div-customer-name-phone">
                <Link to={`/profile-customer/${data?.id_customer?._id}`}>
                  <p className={`text-name-customer ${item?.fontSize}`}>
                    {data?.id_customer?.full_name || data?.full_name}
                  </p>
                </Link>

                <p className={`text-phone-customer ${item?.fontSize}`}>
                  {data?.id_customer?.phone || data?.phone}
                </p>
              </div>
            );
            break;
          case "customer_full_name":
            return (
              <div className="div-customer-name-phone">
                <Link
                  to={`/profile-customer/${
                    data?.id_customer?._id || data?._id
                  }`}
                >
                  <p className={`text-name-customer ${item?.fontSize}`}>
                    {data?.id_customer?.full_name || data?.full_name}
                  </p>
                </Link>
              </div>
            );
            break;

          case "service":
            return (
              <div>
                <p className={`${item?.fontSize}`}>
                  {data?.type === "loop" && data?.is_auto_order
                    ? `${i18n.t("repeat", { lng: lang })}`
                    : data?.service?._id?.kind === "giup_viec_theo_gio"
                    ? `${i18n.t("cleaning", { lng: lang })}`
                    : data?.service?._id?.kind === "giup_viec_co_dinh"
                    ? `${i18n.t("cleaning_subscription", { lng: lang })}`
                    : data?.service?._id?.kind === "phuc_vu_nha_hang"
                    ? `${i18n.t("serve", { lng: lang })}`
                    : data?.service?._id?.kind === "ve_sinh_may_lanh"
                    ? `${i18n.t("Máy lạnh", { lng: lang })}`
                    : data?.service?._id?.kind === "rem_tham_sofa"
                    ? `${i18n.t("Rèm - Thảm - Sofa", { lng: lang })}`
                    : ""}
                </p>
                <p className={`${item?.fontSize}`}>{timeWork(data)}</p>
              </div>
            );
            break;
          case "date_work":
            return (
              <div className="div-date-work">
                <p className={`text-worktime ${item?.fontSize}`}>
                  {moment(new Date(data?.date_work)).format("DD/MM/YYYY")}
                </p>
                <p className={`text-worktime ${item?.fontSize}`}>
                  {moment(new Date(data?.date_work))
                    .locale(lang)
                    .format("dddd")}
                </p>
              </div>
            );
            break;
          case "collaborator":
            return (
              <>
                <div className="div-collaborator">
                  {!data?.id_collaborator ? (
                    <p
                      className={`text-pending-search ${item?.fontSize}`}
                    >{`${i18n.t("searching", {
                      lng: lang,
                    })}`}</p>
                  ) : (
                    <>
                      <Link
                        to={`/details-collaborator/${data?.id_collaborator?._id}`}
                        className="div-name-star"
                      >
                        <div className="div-name">
                          <p className={`${item?.fontSize}`}>
                            {data?.id_collaborator?.full_name}
                          </p>
                        </div>
                        <div className="div-phone-star">
                          <p className={`${item?.fontSize}`}>
                            {data?.id_collaborator?.phone}
                          </p>
                          {data?.id_collaborator?.star && (
                            <div className="div-star">
                              <StarFilled className="icon-star" />
                              <p className={`text-star ${item?.fontSize}`}>
                                {data?.id_collaborator?.star}
                              </p>
                            </div>
                          )}
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </>
            );
            break;
          case "collaborator_no_star": {
            return (
              <>
                <div className="div-collaborator">
                  {!data?.id_collaborator ? (
                    <p
                      className={`text-pending-search ${item?.fontSize}`}
                    >{`${i18n.t("searching", {
                      lng: lang,
                    })}`}</p>
                  ) : (
                    <>
                      <Link
                        to={`/details-collaborator/${data?.id_collaborator?._id}`}
                        className="div-name-star"
                      >
                        <div className="div-name">
                          <p className={`${item?.fontSize}`}>
                            {data?.id_collaborator?.full_name}
                          </p>
                        </div>
                        <div className="div-phone-star">
                          <p className={`${item?.fontSize}`}>
                            {data?.id_collaborator?.phone}
                          </p>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </>
            );
            break;
          }
          case "collaborator_name_phone_avatar": {
            return (
              <>
                <div className="div-collaborator-avatar">
                  <div className="div-avatar ">
                    <img
                      class="ant-image-img img_collaborator css-2q8sxy"
                      src={data?.avatar}
                    ></img>
                  </div>

                  <div className="div-name-star">
                    <Link to={`/details-collaborator/${data?._id}`}>
                      <p className={`${item?.fontSize}`}>{data.full_name}</p>
                    </Link>
                    <div className="div-phone-star">
                      <p className={`${item?.fontSize}`}>{data?.phone}</p>
                      {data?.star && (
                        <div className="div-star">
                          <StarFilled className="icon-star" />
                          <p className={`text-star ${item?.fontSize}`}>
                            {data?.star}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            );
            break;
          }
          case "status":
            return (
              <div className="div-status-order">
                <span
                  className={`text-star ${item?.fontSize} ${
                    data?.status === "pending"
                      ? "text-status-pending"
                      : data?.status === "confirm"
                      ? "text-status-confirm"
                      : data?.status === "doing"
                      ? "text-status-doing"
                      : data?.status === "done"
                      ? "text-status-done"
                      : "text-status-cancel"
                  }`}
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
                </span>
              </div>
            );
            break;
          case "pay":
            return (
              <div className="div-payment">
                <p className={`text-payment-method ${item?.fontSize}`}>
                  {data?.payment_method === "cash"
                    ? `${i18n.t("cash", { lng: lang })}`
                    : data?.payment_method === "point"
                    ? `${i18n.t("wallet_gpay", { lng: lang })}`
                    : ""}
                </p>
                <p className={`text-payment-method ${item?.fontSize}`}>
                  {formatMoney(data?.final_fee)}
                </p>
              </div>
            );
            break;
          case "name_customer":
            return (
              <Link
                to={
                  checkElement?.includes("detail_customer")
                    ? `/profile-customer/${data?._id}`
                    : ""
                }
                className="name_customer"
              >
                <Image
                  preview={false}
                  src={
                    data?.rank_point < 100
                      ? member
                      : data?.rank_point >= 100 && data?.rank_point < 300
                      ? silver
                      : data?.rank_point >= 300 && data?.rank_point < 1500
                      ? gold
                      : platinum
                  }
                  style={{ width: 20, height: 20 }}
                />
                <span className={`text-name-customer ${item?.fontSize}`}>
                  {" "}
                  {data?.full_name}
                </span>
              </Link>
            );
            break;
          case "nearest_order":
            return (
              <>
                {data?.id_group_order ? (
                  <Link to={`/details-order/${data?.id_group_order}`}>
                    <p className={`text-id-code-order ${item?.fontSize}`}>
                      {data?.id_view_group_order}
                    </p>
                  </Link>
                ) : (
                  <p className={`${item?.fontSize}`}>{`${i18n.t(
                    "not_available",
                    {
                      lng: lang,
                    }
                  )}`}</p>
                )}
              </>
            );
            break;
          case "address":
            const temp = item.dataIndex.split(".");
            let getData = data[temp[0]];
            for (let i = 1; i < temp.length; i++) {
              if (getData === undefined || getData === null) {
                getData = "";
                break;
              }
              getData = getData[temp[i]];
            }
            const indexSlice = getData.length - 75;
            const viewAddress =
              indexSlice > 0 ? getData.slice(0, 75) + "..." : getData;
            return (
              <p className={`text-address-order ${item?.fontSize}`}>
                {getData !== ""
                  ? viewAddress
                  : `${i18n.t("not_available", { lng: lang })}`}
              </p>
            );
            break;
          case "phone_action_hide":
            const phone = data?.phone
              ? data?.phone.slice(-4)
              : data?.id_customer?.phone.slice(-4);
            return (
              <div className="hide-phone">
                <p className={`phone-text ${item?.fontSize}`}>
                  {rowIndex === index
                    ? hidePhone
                      ? data?.phone || data?.id_customer?.phone
                      : "********" + phone
                    : "********" + phone}
                </p>
                <p
                  className="btn-eyes"
                  onClick={() =>
                    rowIndex === index
                      ? setHidePhone(!hidePhone)
                      : setHidePhone(!hidePhone)
                  }
                >
                  {rowIndex === index ? (
                    hidePhone ? (
                      <i class="uil uil-eye"></i>
                    ) : (
                      <i class="uil uil-eye-slash"></i>
                    )
                  ) : (
                    <i class="uil uil-eye-slash"></i>
                  )}
                </p>
              </div>
            );
            break;
          case "total_order":
            return (
              <p className={`text-address-customer ${item?.fontSize}`}>
                {data[item.dataIndex] || 0}
              </p>
            );
            break;
          case "description_request":
            return (
              <p className={`text-address-customer ${item?.fontSize}`}>
                {data[item.dataIndex] || 0}
              </p>
            );
            break;
          case "status_request":
            return (
              <div className="status_request">
                {data?.status === "done" ? (
                  <p className={`text-contacted ${item?.fontSize}`}>
                    {`${i18n.t("contacted", { lng: lang })}`}
                  </p>
                ) : (
                  <div className="div-uncontact">
                    <p className="text-uncontact">{`${i18n.t("not_contacted", {
                      lng: lang,
                    })}`}</p>
                    {checkElement?.includes("contact_request_service") && (
                      <div
                        className="btn-contacted-deep2"
                        onClick={toggleModal}
                      >
                        <p className="text-btn-contact">{`${i18n.t("contact", {
                          lng: lang,
                        })}`}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
            break;
          case "user_contact":
            return (
              <>
                <div className="user_contact">
                  {data?.status === "done" ? (
                    <>
                      <p className={`text-user ${item?.fontSize}`}>
                        {" "}
                        {data?.full_name_admin}
                      </p>
                      <p className={`${item?.fontSize}`}>
                        {moment(
                          new Date(data?.date_admin_contact_create)
                        ).format("DD/MM/YYYY")}
                      </p>
                      <p className={`${item?.fontSize}`}>
                        {moment(
                          new Date(data?.date_admin_contact_create)
                        ).format("HH:mm")}
                      </p>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            );
            break;
          case "money": {
            return (
              <p className={`text-address-customer ${item?.fontSize}`}>
                {formatMoney(data[item.dataIndex] || 0)}
              </p>
            );
            break;
          }
          case "percent": {
            return (
              <p className={`text-address-customer ${item?.fontSize}`}>
                {data[item.dataIndex]} %
              </p>
            );
            break;
          }
          case "punish": {
            return (
              <p className={`text-user ${item?.fontSize}`}> {data?.punish}</p>
            );
            break;
          }
          case "date_hour": {
            return (
              <div className="div-date-create">
                <p className={`${item?.fontSize}`}>
                  {moment(new Date(data[item.dataIndex][0])).format(
                    "DD/MM/YYYY"
                  )}
                </p>
                <p className={`${item?.fontSize}`}>
                  {moment(new Date(data[item.dataIndex][0])).format("HH:mm")}
                </p>
              </div>
            );
            break;
          }
          case "id_view_group_report": {
            return (
              <Link to={`/details-order/${data?.id_group_order?._id}`}>
                <p className={`${item?.fontSize}`}>
                  {data?.id_group_order?.id_view}
                </p>
              </Link>
            );
            break;
          }
          case "id_date_work": {
            const dataView = data[item.dataIndex] || "";
            return (
              <p
                className={`${item?.fontSize}`}
                onClick={() =>
                  navigate(item.navigate, {
                    state: { date: data?._id },
                  })
                }
              >
                {" "}
                {dataView}
              </p>
            );
            break;
          }
          case "id_customer_report": {
            return (
              <p
                className={`${item?.fontSize}`}
                onClick={() =>
                  navigate(`/profile-customer/${data.id_customer._id}`, {
                    state: { date: data?._id },
                  })
                }
              >
                {" "}
                {data.id_customer.full_name}
              </p>
            );
            break;
          }
          case "id_collaborator": {
            return (
              <p
                className={`${item?.fontSize}`}
                onClick={() =>
                  navigate(
                    `/report/manage-report/report-order-by-collaborator/${data.id_collaborator._id}`,
                    {
                      state: {
                        startDate: data?.start_date,
                        endDate: data?.end_date,
                        status: data.status,
                      },
                    }
                  )
                }
              >
                {" "}
                {data.id_collaborator.full_name}
              </p>
            );
            break;
          }
          case "date_time": {
            return (
              <div className="div-date-create">
                <p className={`${item?.fontSize}`}>
                  {moment(new Date(data[item.dataIndex])).format("DD/MM/YYYY")}
                </p>
                <p className={`${item?.fontSize}`}>
                  {moment(new Date(data[item.dataIndex])).format("HH:mm")}
                </p>
              </div>
            );
            break;
          }
          case "select": {
            return (
              <>
                <SelectDefault
                  className={`${item?.fontSize}`}
                  onChange={(value) => {
                    return onChangeValue(data, item.dataIndex, value);
                  }}
                  value={data[item.dataIndex]}
                  selectOptions={item.selectOptions}
                />
              </>
            );
            break;
          }
          case "text": {
            const max = item.maxLength || 75;
            let getDataView = data[item.dataIndex] || "";
            const indexSlice = getDataView.length - max;
            const sliceData =
              indexSlice > 0 ? getDataView.slice(0, max) + "..." : getDataView;
            return (
              <>
                <Tooltip placement="topRight" title={getDataView}>
                  <span className={`${item?.fontSize}`}> {sliceData}</span>
                </Tooltip>
              </>
            );
            break;
          }
          case "status_handle_review": {
            const getItemStatus = item.selectOptions.filter(
              (a) => a.value === data[item.dataIndex]
            );

            return (
              <div
                className={`current-status-handle ${getItemStatus[0]?.className}`}
                onClick={() =>
                  onChangeValue(item, item.dataIndex, getItemStatus[0].value)
                }
              >
                <p>{getItemStatus[0].label}</p>
              </div>
            );
            break;
          }
          case "code_order_name_service": {
            linkRedirect = `/details-order/${data?.id_group_order}`;
            return (
              <>
                <Link
                  className="code_order_star"
                  onClick={() => saveToCookie("order_scrolly", scrollY)}
                  to={linkRedirect}
                >
                  <p className={`text-id-code-order ${item?.fontSize}`}>
                    {data?.id_view}
                  </p>
                </Link>

                <p className={` ${item?.fontSize}`}>{data?.service_title}</p>
              </>
            );
            break;
          }
          case "id_view_name_service": {
            linkRedirect = `/details-order/${data?.id_group_order}`;
            return (
              <Link
                className="id_order_start"
                onClick={() => saveToCookie("order_scrolly", scrollY)}
                to={linkRedirect}
              >
                <Rate
                  value={data?.star}
                  style={{ width: "100%" }}
                  disabled={true}
                />
              </Link>
            );
            break;
          }
          case "status_handle_collaborator": {
            const getItemStatus = item.selectOptions.filter(
              (a) => a.value === data[item.dataIndex]
            );
            return (
              <>
                {getItemStatus.length > 0 ? (
                  <div
                    className={`current-status-handle ${getItemStatus[0]?.className}`}
                    onClick={() =>
                      onChangeValue(
                        item,
                        item.dataIndex,
                        getItemStatus[0].value
                      )
                    }
                  >
                    <p>{getItemStatus[0].label}</p>
                  </div>
                ) : (
                  <></>
                )}
              </>
            );
            break;
          }
          case "number": {
            const dataView = data[item.dataIndex] || 0;
            return <p className={`${item?.fontSize}`}> {dataView}</p>;
            break;
          }
          case "hour_date": {
            return (
              <div className="div-date-create">
                <p className={`${item?.fontSize}`}>
                  {moment(new Date(data[item.dataIndex])).format("DD/MM/YYYY")}
                </p>
                <p className={`${item?.fontSize}`}>
                  {moment(new Date(data[item.dataIndex])).format("HH:mm")}
                </p>
              </div>
            );
            break;
          }
          case "change_status": {
            let _isShowChangeStatus = true;
            let _title = "Bắt đầu";
            let _isShow = true;
            if (data?.status === "pending") {
              _isShowChangeStatus = false;
            } else if (data?.status === "doing") {
              _title = "Kết thúc";
            } else if (data?.status === "done") {
              _isShow = false;
            } else if (data?.status === "cancel") {
              _isShow = false;
            }
            return (
              <div className="div-date-create">
                {_isShow && (
                  <>
                    {_isShowChangeStatus && (
                      <Button onClick={() => setOpenModalChangeStatus(true)}>
                        {_title}
                      </Button>
                    )}
                    <Button
                      type="primary"
                      danger
                      onClick={() => setOpenModalCancel(true)}
                    >
                      Huỷ đơn
                    </Button>
                  </>
                )}
              </div>
            );
            break;
          }
          case "total_fee": {
            let _service_fee = 0;
            for (let i of record?.service_fee) {
              _service_fee += i?.fee;
            }
            const total_fee =
              record?.initial_fee + record?.tip_collaborator + _service_fee;
            return (
              <div className="div-date-create">
                <p className={`${item?.fontSize}`}>{formatMoney(total_fee)}</p>
                <p className={`${item?.fontSize}`}></p>
              </div>
            );
            break;
          }
          case "total_discount": {
            let _total_code_promotion_fee = record?.code_promotion
              ? record?.code_promotion?.discount
              : 0;
            let _total_event_fee = 0;
            for (let i of record?.event_promotion) {
              _total_event_fee += i?.discount;
            }
            const total_discount = _total_code_promotion_fee + _total_event_fee;
            return (
              <div className="div-date-create">
                <p className={`${item?.fontSize}`}>
                  {formatMoney(total_discount)}
                </p>
                <p className={`${item?.fontSize}`}></p>
              </div>
            );
            break;
          }
          case "method_transfer": {
            return (
              <div className="div-date-create">
                {data?.type_transfer === "top_up" ? (
                  <div className="div-money-withdraw-topup">
                    <i class="uil uil-money-insert icon-topup"></i>
                    <p className="text-topup">{`${i18n.t("topup", {
                      lng: lang,
                    })}`}</p>
                  </div>
                ) : (
                  <div className="div-money-withdraw-topup">
                    <i class="uil uil-money-withdraw icon-withdraw"></i>
                    <p className="text-withdraw">
                      {`${i18n.t("withdraw", { lng: lang })}`}
                    </p>
                  </div>
                )}
              </div>
            );
          }
          case "status_transfer": {
            let _text_status = <p></p>;
            switch (data.status) {
              case "pending":
                _text_status = (
                  <p className="text-pending-topup">{`${i18n.t(
                    "processing"
                  )}`}</p>
                );
                break;
              case "transferred":
                _text_status = (
                  <p className="text-transfered">{`${i18n.t(
                    "money_transferred"
                  )}`}</p>
                );
                break;
              case "done":
                _text_status = (
                  <p className="text-done-topup">{`${i18n.t("complete")}`}</p>
                );
                break;
              case "cancel":
                _text_status = (
                  <p className="text-cancel-topup-ctv">{`${i18n.t(
                    "cancel"
                  )}`}</p>
                );
              case "holding":
                _text_status = <p className="text-transfered">{`Tạm giữ`}</p>;
                break;
              default:
                break;
            }
            return <div className="div-date-create">{_text_status}</div>;
          }
          case "type_wallet": {
            let _wallet = data?.type_wallet === "work_wallet" ? "Nạp" : "CTV";
            return (
              <div className="div-date-create">
                <p className="title-detail">Ví {_wallet}</p>
              </div>
            );
          }
          case "date_verify":
            return (
              <div className="div-date-create">
                {data?.date_verify_created && (
                  <p className={`${item?.fontSize}`}>
                    {moment(new Date(data?.date_verify_created)).format(
                      "DD/MM/YYYY"
                    )}
                  </p>
                )}
                {data?.date_verify_created && (
                  <p className={`${item?.fontSize}`}>
                    {moment(new Date(data?.date_verify_created)).format(
                      "HH:mm"
                    )}
                  </p>
                )}
              </div>
            );
            break;
          case "admin_verify":
            return (
              <div className="div-date-create">
                <p className="fw-500">{data?.id_admin_verify?.full_name}</p>
              </div>
            );
            break;
          case "payment_source":
            let _payment_source = "Chuyển khoản";
            if (data?.paymnet_source === "momo") {
              _payment_source = "MoMo";
            } else if (data?.paymnet_source === "vnpay") {
              _payment_source = "VNPAY";
            } else if (data?.paymnet_source === "viettel_pay") {
              _payment_source = "Viettel Pay";
            } else if (data?.paymnet_source === "other") {
              _payment_source = "Khác";
            }
            return (
              <div className="div-date-create">
                <p>{_payment_source}</p>
              </div>
            );
            break;
          case "verify": {
            const _isDisableVerify =
              data?.status === "done" || data?.status === "cancel";
            return (
              <div className="div-date-create">
                <Button
                  disabled={_isDisableVerify}
                  onClick={() => setOpenModalChangeStatus(true)}
                >
                  Duyệt lệnh
                </Button>
                <Button
                  type="primary"
                  danger
                  disabled={_isDisableVerify}
                  onClick={() => setOpenModalCancel(true)}
                >
                  Huỷ lệnh
                </Button>
              </div>
            );
            break;
          }
          case "ordinal": {
            return (
              <div className="div-date-create">
                <p>
                  {index +
                    1 +
                    currentPage * (pageSize || 20) -
                    (pageSize || 20)}
                </p>
              </div>
            );
            break;
          }
          default: {
            const dataView = data[item.dataIndex] || "";
            return <p className={`${item?.fontSize}`}> {dataView}</p>;
            break;
          }
        }
      },
      width: item.width || 100,
    };
    headerTable.push(temp);
    widthPage += Number(temp.width);
  }
  if (actionColumn) headerTable.push(actionColumn);

  const calculateCurrentPage = (event) => {
    setCurrentPage(event);
    if (props.onCurrentPageChange) {
      setIsLoading(true);
      props.onCurrentPageChange(event * pageSize - pageSize);
    }
  };

  const toggleModal = (event) => {
    if (props.onToggleModal) props.onToggleModal(true);
  };

  return (
    <React.Fragment>
      <div className="mr-t">
        <Table
          columns={headerTable}
          dataSource={data}
          pagination={false}
          scroll={{ x: widthPage }}
          // loading={detectLoading}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setItem(record);
                setRowIndex(rowIndex);
                if (props.getItemRow) props.getItemRow(record);
              },
            };
          }}
        />
      </div>

      <div className="mt-2 p-2 pagination">
        <p>
          {`${i18n.t("total", { lng: lang })}`}: {totalItem}
        </p>
        <div>
          <Pagination
            current={currentPage}
            onChange={calculateCurrentPage}
            total={totalItem}
            showSizeChanger={false}
            pageSize={pageSize || 20}
            hideOnSinglePage={true}
          />
        </div>
      </div>

      {/* {isLoading && <LoadingPagination />} */}
    </React.Fragment>
  );
};

export default memo(DataTable);
