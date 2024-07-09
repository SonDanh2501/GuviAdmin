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
    scrollX,
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
  const [ordinalNumber, setOrdinalNumber] = useState(1);
  // const [items3, setItems3] = useState(items);
  // let items3 = [...items]
  let widthPage = 0;
  let headerTable = [];
  const [hidePhone, setHidePhone] = useState(false);
  const [rowIndex, setRowIndex] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {}, []);

  useEffect(() => {
    setOrdinalNumber(start);
    if (start === 0) {
      setCurrentPage(1);
    }
  }, [start]);

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
    // Duyệt qua từng item trong list Columns
    // Gán title = item title (i18n => đa ngôn ngữ)
    const title = item.i18n_title
      ? i18n.t(`${item.i18n_title}`, { lng: lang })
      : item.title;

    const temp = {
      // Title
      title: () => {
        // Nếu có customTitle thì trả về customTitle không thì trả về title bình thường
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
      // Dữ liệu
      render: (data, record, index) => {
        // Link default
        let linkRedirect = `#`;
        switch (item.key) {
          case "id_view":
            return <p>{data[item.dataIndex]}</p>;
            break;
          case "code_order":
            linkRedirect = `/details-order/${data?.id_group_order}`;
            return (
              <Link
                target="_blank"
                onClick={() => saveToCookie("order_scrolly", scrollY)}
                to={linkRedirect}
              >
                <p className={`text-id-code-order ${item?.fontSize}`}>
                  {data?.id_view}
                </p>
              </Link>
            );
            break;
          case "id_view_order":
            linkRedirect = `/details-order/${data?.id_order?.id_group_order}`;
            return (
              <Link
                onClick={() => saveToCookie("order_scrolly", scrollY)}
                to={linkRedirect}
                target="_blank"
              >
                <p className={`text-id-code-order ${item?.fontSize}`}>
                  {data?.id_order?.id_view}
                </p>
              </Link>
            );
            break;
          case "code_punish_ticket":
            linkRedirect = `/punish/punish-detail/${data?._id}`;
            return (
              // <Link to={linkRedirect} target="_blank">
              <p className={`text-id-code-order ${item?.fontSize}`}>
                {data?.id_view}
              </p>
              // </Link>
            );
            break;
          case "code_transaction":
            linkRedirect = `/transaction/transaction-detail/${data?._id}`;
            return (
              <Link to={linkRedirect} target="_blank">
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
          // Ngày tạo của sổ quỹ
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
                        target="_blank"
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
          case "subject_transaction": {
            let _type_wallet = "";
            if (data?.type_transfer === "top_up") {
              if (data?.subject === "customer") {
                _type_wallet = (
                  <p>
                    Nạp vào: <strong>Pay-Point</strong>
                  </p>
                );
              } else if (data?.subject === "collaborator") {
                if (data?.type_wallet === "work_wallet") {
                  _type_wallet = (
                    <p>
                      Nạp vào: <strong>Ví Công việc</strong>
                    </p>
                  );
                } else {
                  _type_wallet = (
                    <p>
                      Nạp vào: <strong>Ví CTV</strong>
                    </p>
                  );
                }
              } else if (data?.subject === "other") {
              }
            } else if (data?.type_transfer === "withdraw") {
              if (data?.subject === "customer") {
                _type_wallet = (
                  <p>
                    Rút từ: <strong>Pay-Point</strong>
                  </p>
                );
              } else if (data?.subject === "collaborator") {
                if (data?.type_wallet === "work_wallet") {
                  _type_wallet = (
                    <p>
                      Rút từ: <strong>Ví Công việc</strong>
                    </p>
                  );
                } else {
                  _type_wallet = (
                    <p>
                      Rút từ: <strong>Ví CTV</strong>
                    </p>
                  );
                }
              } else if (data?.subject === "other") {
              }
            }
            return (
              <>
                <div className="div-collaborator">
                  {data?.id_customer && (
                    <div className="div-name-star">
                      <Link
                        to={`/profile-customer/${
                          data?.id_customer?._id || data?._id
                        }`}
                        target="_blank"
                      >
                        <div className="div-name">
                          <p className={`${item?.fontSize}`}>
                            KH - {data?.id_customer?.full_name}
                          </p>
                        </div>
                        <div className="div-phone-star">
                          <p className={`${item?.fontSize}`}>
                            {data?.id_customer?.phone}
                          </p>
                        </div>
                        <div>
                          <p>{_type_wallet}</p>
                        </div>
                      </Link>
                    </div>
                  )}
                  {data?.id_collaborator && (
                    <>
                      <Link
                        to={`/details-collaborator/${data?.id_collaborator?._id}`}
                        className="div-name-star"
                        target="_blank"
                      >
                        <div className="div-name">
                          <p className={`${item?.fontSize}`}>
                            CTV - {data?.id_collaborator?.full_name}
                          </p>
                        </div>
                        <div className="div-phone-star">
                          <p className={`${item?.fontSize}`}>
                            {data?.id_collaborator?.phone}
                          </p>
                        </div>
                        <div>
                          <p>{_type_wallet}</p>
                        </div>
                      </Link>
                    </>
                  )}
                  {!data?.id_collaborator && !data?.id_customer && (
                    <div className="div-name">
                      <p className={`${item?.fontSize}`}>
                        Khác - {data?.id_admin_action?.full_name}
                      </p>
                    </div>
                  )}
                </div>
              </>
            );
            break;
          }
          case "created_by": {
            let _created_by_customer = false;
            let _created_by_collborator = false;
            let _created_by_admin = false;
            if (data?.id_admin_action) {
              _created_by_admin = true;
            } else {
              if (data?.id_customer) {
                _created_by_customer = true;
              } else {
                _created_by_collborator = true;
              }
            }
            return (
              <>
                <div className="div-collaborator">
                  {_created_by_customer && (
                    <div className="div-name-star">
                      <Link
                        to={`/profile-customer/${
                          data?.id_customer?._id || data?._id
                        }`}
                        target="_blank"
                      >
                        <div className="div-name">
                          <p className={`${item?.fontSize}`}>
                            KH - {data?.id_customer?.full_name}
                          </p>
                        </div>
                        <div className="div-phone-star">
                          <p className={`${item?.fontSize}`}>
                            {data?.id_customer?.phone}
                          </p>
                        </div>
                        <div>
                          <p>Nạp</p>
                        </div>
                      </Link>
                    </div>
                  )}
                  {_created_by_collborator && (
                    <>
                      <Link
                        to={`/details-collaborator/${data?.id_collaborator?._id}`}
                        className="div-name-star"
                        target="_blank"
                      >
                        <div className="div-name">
                          <p className={`${item?.fontSize}`}>
                            CTV - {data?.id_collaborator?.full_name}
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
                  {_created_by_admin && (
                    <div className="div-name">
                      <p className={`${item?.fontSize}`}>
                        Quản trị - {data?.id_admin_action?.full_name}
                      </p>
                    </div>
                  )}
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
          case "admin_action":
            return (
              <div>
                <p>{data?.id_admin_action?.full_name}</p>
              </div>
            );
            break;
          case "id_admin_action":
            return (
              <div>
                <p>{data?.id_admin_action?.full_name || "Hệ thống"}</p>
              </div>
            );
            break;
          case "id_transaction":
            return (
              <div className="div-name">
                <Link
                  to={`/transaction-detail/${data?.id_transaction?._id}`}
                  target="_blank"
                >
                  <p className={`text-color-1 ${item?.fontSize}`}>
                    {data?.id_transaction?.id_view}
                  </p>
                </Link>
              </div>
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
          case "kind_transfer":
            const _kind_transfer =
              data?.kind_transfer === "income" ? "Phiếu thu" : "Phiếu chi";
            return (
              <p className={`text-address-customer ${item?.fontSize}`}>
                {_kind_transfer}
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
            linkRedirect = `/details-order/${data?.id_group_order}`;
            const max = item.maxLength || 75;
            let getDataView = data[item.dataIndex] || "";
            const indexSlice = getDataView.length - max;
            const sliceData =
              indexSlice > 0 ? getDataView.slice(0, max) + "..." : getDataView;
            return (
              <Link target="_blank" to={linkRedirect}>
                <Tooltip placement="topRight" title={getDataView}>
                  <span className={`${item?.fontSize} text-id-code-order`}>
                    {" "}
                    {sliceData}
                  </span>
                </Tooltip>
              </Link>
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
          case "type_transfer": {
            let type_transfer = "Nạp";
            switch (data?.type_transfer) {
              case "other":
                type_transfer = "Khác";
                break;
              case "withdraw":
                type_transfer = "Rút";
                break;
              case "refund_service":
                type_transfer = "Hoàn tiền đơn hàng";
                break;
              case "reward":
                type_transfer = "Thưởng";
                break;
              case "punish":
                type_transfer = "Phạt";
                break;
              case "pay_service":
                type_transfer = "Thanh toán dịch vụ";
                break;
              default:
                break;
            }
            return (
              <div className="div-type-transaction">
                {type_transfer === "Rút" ? (
                  <div className="div-status-order">
                    <p className="text-status-cancel">{type_transfer}</p>
                  </div>
                ) : (
                  <div className="div-status-order">
                    <p className="text-status-done">{type_transfer}</p>
                  </div>
                )}
              </div>
            );
          }
          case "status_transfer": {
            let _text_status = <span></span>;
            switch (data.status) {
              case "stanby":
              case "pending":
                _text_status = (
                  <span className="text-status-pending">{`${i18n.t(
                    "processing"
                  )}`}</span>
                );
                break;
              case "transferred":
              case "processing":
              case "doing":
              case "revoke":
                _text_status = (
                  <span className="text-status-confirm">{`${i18n.t(
                    "money_transferred"
                  )}`}</span>
                );
                break;
              case "done":
                _text_status = (
                  <span className="text-status-done">{`${i18n.t(
                    "complete"
                  )}`}</span>
                );
                break;
              case "cancel":
              case "cancel":
              case "out_date":
                _text_status = (
                  <span className="text-status-cancel">Đã huỷ</span>
                );
                break;
              case "holding":
                _text_status = (
                  <span className="text-status-doing">{`Tạm giữ`}</span>
                );
                break;
              default:
                break;
            }
            return <div className="div-status-order">{_text_status}</div>;
          }
          case "status_ticket": {
            let _text_status = <span></span>;
            switch (data.status) {
              case "standby":
                _text_status = (
                  <span className="text-status-pending">Chờ duyệt</span>
                );
                break;
              case "processing":
              case "waiting":
                _text_status = (
                  <span className="text-status-confirm">Đang xử lý</span>
                );
                break;
              case "doing":
                _text_status = (
                  <span className="text-status-doing">Đang thực thi</span>
                );
                break;
              case "cancel":
                _text_status = (
                  <span className="text-status-cancel">Đã hủy</span>
                );
                break;
              case "revoke":
                _text_status = (
                  <span className="text-status-cancel">Đã thu hồi</span>
                );
                break;
              case "done":
                _text_status = (
                  <span className="text-status-done">Hoàn thành</span>
                );
                break;
              default:
                break;
            }
            return <div className="div-status-order">{_text_status}</div>;
          }
          case "type_wallet": {
            let _wallet;
            switch (data?.payment_in) {
              case "momo":
                _wallet = "MoMo";
                break;
              case "vnpay":
                _wallet = "VNPAY";
                break;
              case "viettel_pay":
                _wallet = "Viettel Pay";
                break;
              case "collaborator_wallet":
                _wallet = "Ví CTV";
                break;
              case "work_wallet":
                _wallet = "Ví công việc";
                break;
              case "pay_point":
                _wallet = "G-Pay";
                break;
              case "other":
                _wallet = "Khác";
                break;
              default:
                break;
            }
            return (
              <div className="div-date-create">
                <p className="title-detail">{_wallet}</p>
              </div>
            );
          }
          case "title_punish_ticket": {
            return (
              <div className="div-date-create">
                <p className="title-detail">{data?.title["vi"]}</p>
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

                {data?.date_verify && (
                  <p className={`${item?.fontSize}`}>
                    {moment(new Date(data?.date_verify)).format("DD/MM/YYYY")}
                  </p>
                )}
                {data?.date_verify && (
                  <p className={`${item?.fontSize}`}>
                    {moment(new Date(data?.date_verify)).format("HH:mm")}
                  </p>
                )}
              </div>
            );
            break;
          case "time_end":
            return (
              <div className="div-date-create">
                {data?.time_end && (
                  <p className={`${item?.fontSize}`}>
                    {moment(new Date(data?.time_end)).format("DD/MM/YYYY")}
                  </p>
                )}
                {data?.time_end && (
                  <p className={`${item?.fontSize}`}>
                    {moment(new Date(data?.time_end)).format("HH:mm")}
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
          case "payment_out":
            let _payment_out = "Chuyển khoản";
            switch (data?.payment_out) {
              case "momo":
                _payment_out = "MoMo";
                break;
              case "vnpay":
                _payment_out = "VNPAY";
                break;
              case "viettel_pay":
                _payment_out = "Viettel Pay";
                break;
              case "collaborator_wallet":
                _payment_out = "Ví CTV";
                break;
              case "work_wallet":
                _payment_out = "Ví công việc";
                break;
              case "pay_point":
                _payment_out = "G-Pay";
                break;
              case "cash":
                _payment_out = "Tiền mặt";
                break;
              case "bank":
                _payment_out = "Chuyển khoản";
                break;
              default:
                break;
            }
            return (
              <div className="div-date-create">
                <p>{_payment_out}</p>
              </div>
            );
            break;
          // Verify nạp tiền
          case "verify": {
            // Nếu các status sau là true thì button sẽ disable
            const _isDisableVerify =
              data?.status === "done" ||
              data?.status === "cancel" ||
              data?.status === "revoke" ||
              data?.status === "waiting" ||
              data?.status === "doing" ||
              data?.status === "processing";
            return (
              <div className="div-date-create">
                <Button
                  disabled={_isDisableVerify}
                  onClick={() => setOpenModalChangeStatus(true)}
                >
                  Xác nhận
                </Button>
                <Button
                  type="primary"
                  danger
                  disabled={_isDisableVerify}
                  onClick={() => setOpenModalCancel(true)}
                >
                  Huỷ
                </Button>
              </div>
            );
            break;
          }
          // STT Sổ quỹ
          case "ordinal": {
            return (
              <div className="div-date-create">
                <p>{index + ordinalNumber + 1}</p>
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
  // Nếu có actionColumn thì đẩy vào table
  if (actionColumn) headerTable.push(actionColumn);
  const calculateCurrentPage = (event) => {
    // console.log("evet", event);
    setCurrentPage(event);
    if (props.onCurrentPageChange) {
      setIsLoading(true);
      props.onCurrentPageChange(event * pageSize - pageSize);
    }
  };

  const toggleModal = (event) => {
    if (props.onToggleModal) props.onToggleModal(true);
  };
  // console.log("CHECK WIDTH", width);
  return (
    <React.Fragment>
      <div className="mr-t">
        <Table
          columns={headerTable}
          dataSource={data}
          pagination={false}
          scroll={{ x: scrollX ? scrollX : widthPage }}
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