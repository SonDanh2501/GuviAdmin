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
  ConfigProvider,
  Popover,
  Tabs,
} from "antd";
import { StarFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCookies } from "../../../helper/useCookies";
import useWindowDimensions from "../../../helper/useWindowDimensions";
import { formatMoney } from "../../../helper/formatMoney";
import { useWindowScrollPositions } from "../../../helper/useWindowPosition";
import moment from "moment";
import { Spin, Image, Select } from "antd";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import "./style.scss";
import gold from "../../../assets/images/iconGold.svg";
import member from "../../../assets/images/iconMember.svg";
import platinum from "../../../assets/images/iconPlatinum.svg";
import silver from "../../../assets/images/iconSilver.svg";
import notFoundImage from "../../../assets/images/not_found_image.svg";
import { useNavigate } from "react-router-dom";
import SelectDefault from "../../Select/SelectDefault";
import { IoAlertCircleOutline, IoHelpCircleOutline } from "react-icons/io5";
import ButtonCustom from "../../button";
import { convertPhoneNumber } from "../../../utils/contant";
import { getProvince, getService } from "../../../redux/selectors/service";

const DataTable = (props) => {
  const {
    columns,
    data,
    actionColumn,
    start,
    pageSize,
    totalItem,
    setOpenModalChangeStatus,
    setOpenModalCancel,
    scrollX,
    setLengthPage,
    emptyText,
    headerRightContent,
    onCurrentPageChange,
    loading,
  } = props;
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const [saveToCookie] = useCookies();
  const service = useSelector(getService);
  const province = useSelector(getProvince);
  const { width } = useWindowDimensions();
  const timeWork = (data) => {
    const start = moment(
      new Date(
        data?.date_work ? data?.date_work : data?.date_work_schedule[0].date
      )
    ).format("HH:mm");
    const timeEnd = moment(
      new Date(
        data?.date_work ? data?.date_work : data?.date_work_schedule[0].date
      )
    )
      .add(data?.total_estimate, "hours")
      .format("HH:mm");
    return start + " - " + timeEnd;
  };
  const { scrollY } = useWindowScrollPositions();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState(data[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordinalNumber, setOrdinalNumber] = useState(1);
  const [scrollYValue, setScrollYValue] = useState(
    JSON.parse(localStorage.getItem("tableHeight"))?.y === 700
      ? 1
      : JSON.parse(localStorage.getItem("tableHeight"))?.y === 500
      ? 2
      : JSON.parse(localStorage.getItem("tableHeight"))?.y === 300
      ? 3
      : JSON.parse(localStorage.getItem("tableHeight"))?.y
      ? JSON.parse(localStorage.getItem("tableHeight"))?.y
      : 0
  );
  const [scroll, setScroll] = useState([]);
  const [pageSizeOption, setPageSizeOption] = useState({
    value: JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : pageSize,
    label: JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).label
      : `${pageSize} dòng/trang`,
  });
  let pageSizeOptions = [
    { value: 10, label: "10 dòng/trang" },
    { value: 25, label: "25 dòng/trang" },
    { value: 50, label: "50 dòng/trang" },
    { value: 100, label: "100 dòng/trang" },
  ];
  let locale = {
    emptyText: (
      <div className="flex flex-col items-center justify-center gap-2">
        <IoAlertCircleOutline size={35} color="#d1d5db" />
        <span className="text-gray-300 text-lg">
          {emptyText ? emptyText : "Không có dữ liệu để hiển thị"}
        </span>
      </div>
    ),
  };
  let widthPage = 0;
  let headerTable = [];
  const [hidePhone, setHidePhone] = useState(false);
  const [rowIndex, setRowIndex] = useState(0);
  const navigate = useNavigate();
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys?.length > 0;

  /* ~~~ Use effect ~~~ */
  // 1.
  useEffect(() => {
    setOrdinalNumber(start);
    if (start === 0) {
      setCurrentPage(1);
    }
  }, [start]);

  /* ~~~ Other ~~~ */
  // 1. Hàm hiển thị các dữ liệu truyền vào tương ứng với từng cột trong bảng
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
            linkRedirect = `/details-order/${
              data?.id_group_order ? data?.id_group_order : data?._id
            }`;
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
              <Link
                style={{ textDecoration: "none" }}
                to={linkRedirect}
                target="_blank"
              >
                <div className="case__code-id">
                  <span className="case__code-id--number">{data?.id_view}</span>
                </div>
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
              <div
                className={`case__date-create ${
                  item?.position === "center" && "center"
                }`}
              >
                <span className="case__date-create-date">
                  {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
                </span>
                <span className="case__date-create-time">
                  {moment(new Date(data?.date_create)).format("HH:mm:ss")}
                </span>
              </div>
            );
            break;
          case "customer_name_phone":
            return (
              <div className="div-customer-name-phone">
                <Link
                  to={`/profile-customer/${
                    data?.id_customer?._id ? data?.id_customer?._id : data?._id
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <p className={`text-name-customer ${item?.fontSize}`}>
                      {data?.id_customer?.full_name || data?.full_name}
                    </p>
                    {/* <Image
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
                    /> */}
                  </div>
                </Link>
                <p className={`text-phone-customer ${item?.fontSize}`}>
                  {data?.id_customer?.phone || data?.phone}
                </p>
                {/* <div className="flex items-center gap-1">
                  <span className="font-normal">Hạng:</span>
                  <span
                    className={`${
                      data?.rank_point < 100
                        ? "bg-orange-100 text-orange-500 border-orange-500" // Copper
                        : data?.rank_point >= 100 && data?.rank_point < 300
                        ? "bg-stone-100 text-stone-500 border-stone-500" // Silver
                        : data?.rank_point >= 300 && data?.rank_point < 1500
                        ? "bg-yellow-100 text-amber-500 border-yellow-500" // Gold
                        : "bg-cyan-100 text-sky-500 border-cyan-500" // Platium
                    } px-1 py-[1px] border-[1px] rounded-lg`}
                  >
                    {
                      data?.rank_point < 100
                        ? "Đồng" // Copper
                        : data?.rank_point >= 100 && data?.rank_point < 300
                        ? "Bạc" // Silver
                        : data?.rank_point >= 300 && data?.rank_point < 1500
                        ? "Vàng" // Gold
                        : "Bạch kim" // Platium
                    }
                  </span>
                </div> */}
              </div>
            );
            break;
          case "customer_name_phone_rank":
            return (
              <div className="div-customer-name-phone">
                <Link
                  to={`/profile-customer/${
                    data?.id_customer?._id ? data?.id_customer?._id : data?._id
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <p className={`text-name-customer ${item?.fontSize}`}>
                      {data?.id_customer?.full_name || data?.full_name}
                    </p>
                  </div>
                </Link>
                <p className={`text-phone-customer ${item?.fontSize}`}>
                  {data?.id_customer?.phone || data?.phone}
                </p>
                <div className="flex items-center gap-1">
                  <span className="font-normal">Hạng:</span>
                  {data?.id_customer?.rank === "member" &&
                  data?.id_customer?.rank_point > 0 ? (
                    <span className="bg-orange-100 text-orange-500 border-orange-500 px-1 py-[1px] border-[1px] rounded-lg">
                      Thành viên
                    </span>
                  ) : data?.id_customer?.rank === "silver" ? (
                    <span className="bg-slate-200 text-slate-500 border-slate-500 px-1 py-[1px] border-[1px] rounded-lg">
                      Bạc
                    </span>
                  ) : data?.id_customer?.rank === "gold" ? (
                    <span className="bg-yellow-100 text-amber-500 border-yellow-500 px-1 py-[1px] border-[1px] rounded-lg">
                      Vàng
                    </span>
                  ) : data?.id_customer?.rank === "platinum" ? (
                    <span className="bg-cyan-100 text-sky-500 border-cyan-500 px-1 py-[1px] border-[1px] rounded-lg">
                      Bạch kim
                    </span>
                  ) : data?.rank === "member" &&
                    data?.id_group_customer[0] ===
                      "63a8730e6a5e979e0d637c6d" ? (
                    <span className="bg-orange-100 text-orange-500 border-orange-500 px-1 py-[1px] border-[1px] rounded-lg">
                      Thành viên
                    </span>
                  ) : data?.rank === "silver" ? (
                    <span className="bg-slate-100 text-slate-500 border-slate-500 px-1 py-[1px] border-[1px] rounded-lg">
                      Bạc
                    </span>
                  ) : data?.rank === "gold" ? (
                    <span className="bg-yellow-100 text-amber-500 border-yellow-500 px-1 py-[1px] border-[1px] rounded-lg">
                      Vàng
                    </span>
                  ) : data?.rank === "platinum" ? (
                    <span className="bg-cyan-100 text-sky-500 border-cyan-500 px-1 py-[1px] border-[1px] rounded-lg">
                      Bạch kim
                    </span>
                  ) : (
                    <span className="bg-orange-500 text-white border-orange-500 px-1 py-[1px] border-[1px] rounded-lg">
                      Mới
                    </span>
                  )}
                </div>
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
          case "service_customer":
            return (
              <p>
                {data?.service_title
                  ? data?.service_title
                  : data?.service?._id?.title?.vi}
              </p>
            );
            break;
          case "date_work":
            return (
              <div
                className={`case__date-create ${
                  item?.position === "center" && "center"
                }`}
              >
                <span className="case__date-create-date">
                  {moment(
                    new Date(
                      data?.date_work
                        ? data?.date_work
                        : data?.date_work_schedule[0].date
                    )
                  ).format("DD/MM/YYYY")}
                </span>
                <span className="case__date-create-time">
                  {moment(
                    new Date(
                      data?.date_work
                        ? data?.date_work
                        : data?.date_work_schedule[0].date
                    )
                  )
                    .locale(lang)
                    .format("dddd")}
                </span>
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
                        to={`/details-collaborator/${
                          data?.id_collaborator?._id
                            ? data?.id_collaborator?._id
                            : data?.id_collaborator
                        }`}
                        className="div-name-star"
                      >
                        <div className="div-name">
                          <p className={`${item?.fontSize}`}>
                            {data?.id_collaborator?.full_name
                              ? data?.id_collaborator?.full_name
                              : data?.name_collaborator}
                          </p>
                        </div>
                        <div className="div-phone-star">
                          <p className={`${item?.fontSize}`}>
                            {data?.id_collaborator?.phone
                              ? data?.id_collaborator?.phone
                              : data?.phone_collaborator}
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
                      <p className={`${item?.fontSize}`}>{data?.full_name}</p>
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
          case "subject": {
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
          // Tên, số điện thoại
          case "information": {
            return (
              <div className="case__information">
                {data?.id_customer && (
                  <Link
                    to={`/profile-customer/${
                      data?.id_customer?._id || data?._id
                    }`}
                    target="_blank"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="case__information--info">
                      <span className="case__information--info-name">
                        {data?.id_customer?.full_name}
                      </span>
                      <span className="case__information--info-phone">
                        {convertPhoneNumber(data?.id_customer?.phone, 4)}
                      </span>
                    </div>
                  </Link>
                )}
                {data?.id_collaborator && (
                  <Link
                    to={`/details-collaborator/${data?.id_collaborator?._id}`}
                    className="div-name-star"
                    target="_blank"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="case__information--info">
                      <span className="case__information--info-name">
                        {data?.id_collaborator?.full_name}
                      </span>
                      <span className="case__information--info-phone">
                        {convertPhoneNumber(data?.id_collaborator?.phone, 4)}
                      </span>
                    </div>
                  </Link>
                )}
                {!data?.id_collaborator && !data?.id_customer && (
                  <div className="case__information--info">
                    <span className="case__information--info-name">
                      {data?.id_admin_action?.full_name}
                    </span>
                  </div>
                )}
              </div>
            );
            break;
          }
          // Loại tài khoản
          case "type_account": {
            return (
              <div
                className={`case__type-account ${
                  data?.id_collaborator
                    ? "collaborator"
                    : data?.id_customer
                    ? "customer"
                    : "other"
                }`}
              >
                <span className="case__type-account--label">
                  {data?.id_collaborator
                    ? "Đối tác"
                    : data?.id_customer
                    ? "Khách hàng"
                    : "Khác"}
                </span>
              </div>
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
              <div className="case__create-by">
                {_created_by_customer && (
                  <Link
                    to={`/profile-customer/${
                      data?.id_customer?._id || data?._id
                    }`}
                    target="_blank"
                  >
                    <div className="case__create-by--person">
                      <span className="case__create-by--person-name">
                        {data?.id_customer?.full_name}
                      </span>
                      {/* <span>{data?.id_collaborator?.phone}</span> */}
                      <span className="case__create-by--person-phone">
                        Khách hàng
                      </span>
                    </div>
                  </Link>
                )}
                {_created_by_collborator && (
                  <Link
                    style={{ textDecoration: "none" }}
                    to={`/details-collaborator/${data?.id_collaborator?._id}`}
                    target="_blank"
                  >
                    {/* <div className="div-name">
                        <p className={`${item?.fontSize}`}>
                          CTV - {data?.id_collaborator?.full_name}
                        </p>
                      </div>
                      <div className="div-phone-star">
                        <p className={`${item?.fontSize}`}>
                          {data?.id_collaborator?.phone}
                        </p>
                      </div> */}
                    <div className="case__create-by--person">
                      <span className="case__create-by--person-name">
                        {data?.id_collaborator?.full_name}
                      </span>
                      {/* <span>{data?.id_collaborator?.phone}</span> */}
                      <span className="case__create-by--person-phone">
                        Đối tác
                      </span>
                    </div>
                  </Link>
                )}
                {_created_by_admin && (
                  <div className="case__create-by--person">
                    <span className="case__create-by--person-name">
                      {data?.id_admin_action?.full_name}
                    </span>
                    {/* <span>{data?.id_collaborator?.phone}</span> */}
                    <span className="case__create-by--person-phone">GUVI</span>
                  </div>
                )}
              </div>
            );
            break;
          }
          case "status":
            return (
              <div className="case__status-text">
                <span
                  className={`${
                    data?.status === "pending"
                      ? "case__status-text--pending"
                      : data?.status === "done"
                      ? "case__status-text--done"
                      : data?.status === "confirm"
                      ? "case__status-text--confirm"
                      : data?.status === "doing"
                      ? "case__status-text--doing"
                      : data?.status === "processing"
                      ? "case__status-text--processing"
                      : "case__status-text--cancel"
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
                    : data?.status === "processing"
                    ? "Chờ thanh toán"
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
                    : data?.payment_method === "momo"
                    ? "Momo"
                    : data?.payment_method === "vnpay"
                    ? "VNPAY-QR"
                    : data?.payment_method === "vnbank"
                    ? "VNPAY-ATM"
                    : data?.payment_method === "intcard"
                    ? "Thẻ quốc tế"
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
            for (let i = 1; i < temp?.length; i++) {
              if (getData === undefined || getData === null) {
                getData = "";
                break;
              }
              getData = getData[temp[i]];
            }
            const indexSlice = getData?.length - 75;
            const viewAddress =
              indexSlice > 0 ? getData.slice(0, 75) + "..." : getData;
            return (
              <Tooltip placement="top" title={getData}>
                <p className={`text-address-order ${item?.fontSize}`}>
                  {getData !== ""
                    ? viewAddress
                    : `${i18n.t("not_available", { lng: lang })}`}
                </p>
              </Tooltip>
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
              <div className="case__money">
                <span className="case__money--number">
                  {formatMoney(data[item.dataIndex] || 0)}
                </span>
              </div>
            );
            break;
          }
          case "percent": {
            return (
              <div
                className={`case__normal-text ${
                  item.position === "center" && "center"
                }`}
              >
                <span className="case__normal-text--label bold">
                  {data[item.dataIndex]} %
                </span>
              </div>
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
              style={{cursor: "pointer"}}
                className={`${item?.fontSize}`}
                onClick={() =>
                  navigate(item.navigate, {
                    state: { date: data?._id },
                  })
                }
              >
                {dataView}
              </p>
            );
            break;
          }
          case "id_customer_report": {
            return (
              <p
                style={{ cursor: "pointer" }}
                className={`${item?.fontSize}`}
                onClick={() =>
                  window.open(
                    `/profile-customer/${data?.id_customer._id}`,
                    "_blank"
                  )
                }
              >
                {data?.id_customer.full_name}
              </p>
            );
            break;
          }
          case "id_collaborator": {
            return (
              // <p
              //   className={`${item?.fontSize}`}
              //   onClick={() =>
              //     navigate(

              //       `/report/manage-report/report-order-by-collaborator/${data?.id_collaborator._id}`,
              //       {
              //         state: {
              //           startDate: data?.start_date,
              //           endDate: data?.end_date,
              //           status: data?.status,
              //         },
              //       }
              //     )
              //   }
              // >
              //   {" "}
              //   {data?.id_collaborator.full_name}
              // </p>
              <Link
                target="_blank"
                to={{
                  pathname: `/report/manage-report/report-order-by-collaborator/${data?.id_collaborator._id}`,
                }}
                state={{
                  startDate: data?.start_date,
                  endDate: data?.end_date,
                  status: data?.status,
                }}
              >
                <div className="case__normal-text">
                  <span className="case__normal-text--label">
                    {data?.id_collaborator.full_name}
                  </span>
                </div>
              </Link>
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
            return (
              <Tooltip placement="top" title={data[item.dataIndex]}>
                <div
                  className={`case__normal-text ${
                    item.position === "center" && "center"
                  }`}
                >
                  <span className="case__normal-text--label">
                    {data[item.dataIndex] || ""}
                  </span>
                </div>
              </Tooltip>
            );
            break;
          }
          case "text_link": {
            linkRedirect = `/details-order/${data?.id_group_order}`;
            const max = item.maxLength || 75;
            let getDataView = data[item.dataIndex] || "";
            const indexSlice = getDataView?.length - max;
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
                {/* <p className={` ${item?.fontSize}`}>{data?.service_title}</p> */}
              </>
            );
            break;
          }
          case "id_view_name_service": {
            linkRedirect = `/details-order/${data?.id_group_order}`;
            return data?.id_group_order ? (
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
            ) : (
              <div>
                <Rate
                  value={data?.star}
                  style={{ width: "100%" }}
                  disabled={true}
                />
              </div>
            );
            break;
          }
          case "status_handle_collaborator": {
            const getItemStatus = item.selectOptions.filter(
              (a) => a.value === data[item.dataIndex]
            );
            return (
              <>
                {getItemStatus?.length > 0 ? (
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
            return (
              <div
                className={`case__normal-text ${
                  item.position === "center" && "center"
                }`}
              >
                <span className="case__normal-text--label bold">
                  {dataView}
                </span>
              </div>
              // <div className="case__normal-text">
              //   <span className="case__normal-text--label"> {dataView}</span>
              // </div>
            );

            // return <p className={`${item?.fontSize}`}> {dataView}</p>;
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
          // Loại giao dịch
          case "type_transfer": {
            const typeTransferMap = {
              other: "Khác",
              withdraw: "Phiếu chi", // Rút
              top_up: "Phiếu thu", // Nạp
              refund_service: "Hoàn tiền đơn hàng",
              reward: "Thưởng",
              punish: "Phạt",
              pay_service: "Thanh toán dịch vụ",
              withdraw_affiliate: "Affiliate",
              order_payment: "Phiếu thu",
            };
            const type_transfer = typeTransferMap[data?.type_transfer] || "";
            return (
              <div className="case__transfer-type-transfer">
                <span
                  className={`case__transfer-type-transfer--text ${
                    data?.type_transfer === "withdraw"
                      ? "withdraw"
                      : data?.type_transfer === "top_up"
                      ? "top-up"
                      : data?.type_transfer === "order_payment"
                      ? "top-up"
                      : "other"
                  }`}
                >
                  {type_transfer}
                </span>
              </div>
            );
          }
          case "status_ticket": {
            let _text_status = <span></span>;
            switch (data?.status) {
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
              <div
                className={`case__date-create ${
                  item?.position === "center" && "center"
                }`}
              >
                <span className="case__date-create-date">
                  {data?.date_verify_created &&
                    moment(new Date(data?.date_verify_created)).format(
                      "DD/MM/YYYY"
                    )}
                  {data?.date_verify &&
                    moment(new Date(data?.date_verify)).format("DD/MM/YYYY")}
                </span>
                <span className="case__date-create-time">
                  {data?.date_verify_created &&
                    moment(new Date(data?.date_verify_created)).format(
                      "HH:mm:ss"
                    )}
                  {data?.date_verify &&
                    moment(new Date(data?.date_verify)).format("HH:mm:ss")}
                </span>
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
              <div className="case__admin-verify">
                {data?.id_admin_verify ? (
                  <div className="case__admin-verify--info">
                    <span className="case__admin-verify--info-name">
                      {data?.id_admin_verify?.full_name}
                    </span>
                    <span className="case__admin-verify--info-sub">
                      Kế toán
                    </span>
                  </div>
                ) : data?.status === "done" ? (
                  <div className="case__admin-verify--info">
                    <span className="case__admin-verify--info-name">
                      Hệ thống
                    </span>
                    <span className="case__admin-verify--info-sub">
                      Automation
                    </span>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            );
            break;
          case "payment_out":
            let _payment_out = "Chuyển khoản";
            switch (data?.payment_out) {
              case "momo":
                _payment_out = "Ví MoMo";
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
                _payment_out = "Chuyển khoản NH";
                break;
              case "intcard":
                _payment_out = "Thẻ quốc tế";
                break;
              case "vnbank":
                _payment_out = "VNPAY-ATM";
                break;
              case "vnpay":
                _payment_out = "VNPAY-QR";
                break;
              default:
                break;
            }
            return (
              <div className="case__payment-out">
                {/* <p>{_payment_out}</p> */}
                <span className="case__payment-out--label">{_payment_out}</span>
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
              <div className="case__serial-number">
                <span className="case__serial-number--number">
                  {index + ordinalNumber + 1}
                </span>
              </div>
            );
            break;
          }
          case "text-discount": {
            return (
              <span className={`${item?.fontSize} `}>
                {data?.code_promotion?._id?.title?.vi}
              </span>
            );
            break;
          }
          case "discount_money": {
            return (
              <span className={`${item?.fontSize} `}>
                {formatMoney(data?.code_promotion?.discount)}
              </span>
            );
            break;
          }
          case "rating_date": {
            return (
              <div className="data-table__date-time">
                <span className={`${item?.fontSize} `}>
                  {moment(new Date(data?.date_create_review)).format(
                    "DD/MM/YYYY"
                  )}
                </span>
                <span>
                  {moment(new Date(data?.date_create_review)).format("HH:mm")}
                </span>
              </div>
            );
            break;
          }
          case "rating_content": {
            return <span>{data?.review}</span>;
            break;
          }
          case "withdrawal_date": {
            return (
              <div className="case__withdrawal-date">
                <span>
                  {moment(new Date(data?.date_created)).format("DD/MM/YYYY")}
                </span>
                <span>
                  {moment(new Date(data?.date_created)).format("HH:mm")}
                </span>
              </div>
            );
            break;
          }
          case "withdrawal_money": {
            return <span>{formatMoney(data?.money)}</span>;
            break;
          }
          case "withdrawal_type_transfer": {
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
              <div className="case__withdrawal-type-transfer">
                {type_transfer === "withdraw" ? (
                  <p className="case__withdrawal-type-transfer withdrawal">
                    {type_transfer}
                  </p>
                ) : (
                  <p className="case__withdrawal-type-transfer deposit">
                    {type_transfer}
                  </p>
                )}
              </div>
            );
          }
          case "transfer_status": {
            let _text_status = <span></span>;
            switch (data?.status) {
              case "stanby":
              case "pending":
                _text_status = (
                  <span className="case__transfer-status--name pending">{`${i18n.t(
                    "processing"
                  )}`}</span>
                );
                break;
              case "transferred":
                _text_status = (
                  <span className="case__transfer-status--name transferred">
                    Đã chuyền tiền
                  </span>
                );
                break;
              case "processing":
                _text_status = (
                  <span className="case__transfer-status--name processing">
                    Đang xử lý
                  </span>
                );
                break;
              case "doing":
                _text_status = (
                  <span className="case__transfer-status--name doing">
                    Đang làm
                  </span>
                );
                break;
              case "revoke":
                _text_status = (
                  <span className="case__transfer-status--name revoke">
                    Đã thu hồi
                  </span>
                );
                break;
              case "done":
                _text_status = (
                  <span className="case__transfer-status--name done">
                    Hoàn thành
                  </span>
                );
                break;
              case "cancel":
                _text_status = (
                  <span className="case__transfer-status--name out_date">
                    Đã huỷ
                  </span>
                );
                break;
              case "out_date":
                _text_status = (
                  <span className="case__transfer-status--name out_date">
                    Quá hạn
                  </span>
                );
                break;
              case "holding":
                _text_status = (
                  <span className="case__transfer-status--name holding">
                    Tạm giữ
                  </span>
                );
                break;
              default:
                break;
            }
            return <div className="case__transfer-status">{_text_status}</div>;
          }
          case "notification_title": {
            return (
              <div
                className={`case__normal-text ${
                  item.position === "center" && "center"
                }`}
              >
                <span className="case__normal-text--label bold">
                  {data?.title}
                </span>
              </div>
            );
            break;
          }
          case "notification_content": {
            return <span className="case__normal-text-old">{data?.body}</span>;
            break;
          }
          case "notification_date_schedule": {
            return (
              <div
                className={`case__date-create ${
                  item.position === "center" && "center"
                }`}
              >
                <span className="case__date-create-date">
                  {moment(new Date(data?.date_schedule)).format("DD/MM/YYYY")}
                </span>
                <span className="case__date-create-time">
                  {moment(new Date(data?.date_schedule)).format("HH:mm:ss")}
                </span>
              </div>
            );
            break;
          }
          case "promotion_code": {
            return (
              <div
                className="case__promotion-code"
                onClick={() =>
                  navigate("/promotion/manage-setting/edit-promotion", {
                    state: { id: data?._id },
                  })
                }
              >
                {data?.type_promotion === "code" &&
                data?.type_discount === "partner_promotion" ? (
                  <div className="case__promotion-code--brand">
                    <span className="case__promotion-code--brand-name">
                      {data?.brand}
                    </span>
                    <span className="case__promotion-code--brand-sub">
                      Tài trợ khuyến mãi này: {data?.code}
                    </span>
                  </div>
                ) : (
                  <div className="case__promotion-code--un-brand">
                    <span className="case__promotion-code--un-brand-coupon">
                      {data?.code}
                    </span>
                    <span className="case__promotion-code--un-brand-sub">
                      {data?.discount_unit === "amount"
                        ? `Giảm giá ${formatMoney(
                            data?.discount_max_price
                          )} cho dịch vụ`
                        : `Giảm giá ${
                            data?.discount_value
                          }%, tối đa ${formatMoney(data?.discount_max_price)} ${
                            data?.price_min_order > 0
                              ? ` đơn từ ${formatMoney(
                                  data?.price_min_order
                                )} cho dịch vụ`
                              : "cho dịch vụ"
                          }`}
                      {service?.map((item, index) => {
                        if (data?.service_apply?.includes(item?._id)) {
                          return (
                            <span
                              key={index}
                              className="case__promotion-code--un-brand-sub-service"
                            >
                              {item?.title?.vi}
                            </span>
                          );
                        }
                      })}
                    </span>
                  </div>
                )}
              </div>
            );
            break;
          }
          case "type_promotion": {
            return (
              <div
                className={`case__normal-text ${
                  item?.position === "center" && "center"
                }`}
              >
                <span className="case__normal-text--label">
                  {data?.type_promotion === "code" &&
                  data?.type_discount === "order"
                    ? "Mã KM"
                    : data?.type_promotion === "code" &&
                      data?.type_discount === "partner_promotion"
                    ? "Mã KM"
                    : "CTKM"}
                </span>
              </div>
            );
            break;
          }
          case "img_promotion": {
            return (
              <div className="case__promotion-image">
                {data?.type_promotion === "code" &&
                data?.type_discount === "order" ? (
                  <Image
                    className="case__promotion-image-picture"
                    src={data?.thumbnail}
                    preview={true}
                  />
                ) : data?.type_promotion === "code" &&
                  data?.type_discount === "partner_promotion" ? (
                  <Image
                    className="case__promotion-image-picture"
                    src={data?.thumbnail}
                    preview={true}
                  />
                ) : (
                  <Image
                    className="case__promotion-image-picture"
                    src={notFoundImage}
                    preview={true}
                  />
                )}
              </div>
            );
            break;
          }
          case "area_promotion": {
            return (
              <div className="case__promotion-province">
                {!data?.is_apply_area ? (
                  <span className="case__promotion-province--label">
                    Toàn quốc
                  </span>
                ) : (
                  <div className="case__promotion-province--provinces">
                    {province?.map((item, index) => {
                      if (data?.city?.includes(item?.code)) {
                        return (
                          <span className="case__promotion-province--label">
                            {item?.name?.replace(
                              new RegExp(`${"Thành phố"}|${"Tỉnh"}`),
                              ""
                            )}
                          </span>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
            );
            break;
          }
          case "status_promotion": {
            let _text_status = <span></span>;
            switch (data?.status) {
              case "upcoming":
                _text_status = (
                  <span className="case__promotion-status--name upcoming">
                    {`${i18n.t("upcoming", {
                      lng: lang,
                    })}`}
                  </span>
                );
                break;
              case "doing":
                _text_status = (
                  <span className="case__promotion-status--name doing">
                    {`${i18n.t("happenning", {
                      lng: lang,
                    })}`}
                  </span>
                );
                break;
              case "out_of_stock":
                _text_status = (
                  <span className="case__promotion-status--name out_of_stock">
                    {`${i18n.t("out_stock", {
                      lng: lang,
                    })}`}
                  </span>
                );
                break;
              case "out_of_date":
                _text_status = (
                  <span className="case__promotion-status--name out_of_date">
                    {`${i18n.t("out_date", {
                      lng: lang,
                    })}`}
                  </span>
                );
                break;
              case "done":
                _text_status = (
                  <span className="case__promotion-status--name done">
                    {`${i18n.t("closed", {
                      lng: lang,
                    })}`}
                  </span>
                );
                break;
              default:
                break;
            }
            return <div className="case__promotion-status">{_text_status}</div>;
            break;
          }
          case "time_using_promotion": {
            return (
              <div
                className={`case__normal-text ${
                  item.position === "center" && "center"
                }`}
              >
                <span className="case__normal-text--label">
                  {data?.is_parrent_promotion
                    ? data?.total_used_promotion +
                      "/" +
                      data?.total_child_promotion
                    : data?.limit_count > 0
                    ? data?.total_used_promotion + "/" + data?.limit_count
                    : data?.total_used_promotion}
                </span>
              </div>
            );
            break;
          }
          case "time_using_promotion": {
            return (
              <div
                className={`case__normal-text ${
                  item.position === "center" && "center"
                }`}
              >
                <span className="case__normal-text--label">
                  {data?.is_parrent_promotion
                    ? data?.total_used_promotion +
                      "/" +
                      data?.total_child_promotion
                    : data?.limit_count > 0
                    ? data?.total_used_promotion + "/" + data?.limit_count
                    : data?.total_used_promotion}
                </span>
              </div>
            );
            break;
          }
          case "start_date_promotion": {
            return (
              <div
                className={`case__date-create ${
                  item.position === "center" && "center"
                }`}
              >
                {data?.is_limit_date ? (
                  <>
                    <span className="case__date-create-date">
                      {moment(new Date(data?.limit_start_date))
                        .utc()
                        .format("DD/MM/YYYY")}
                    </span>
                    <span className="case__date-create-time">
                      {moment(new Date(data?.limit_start_date))
                        .utc()
                        .format("HH:mm:ss")}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="case__date-create-date">
                      {moment(new Date(data?.date_create))
                        .utc()
                        .format("DD/MM/YYYY")}
                    </span>
                    <span className="case__date-create-time">
                      {moment(new Date(data?.date_create))
                        .utc()
                        .format("HH:mm:ss")}
                    </span>
                  </>
                )}
              </div>
            );
            break;
          }
          case "end_date_promotion": {
            return (
              <div
                className={`case__date-create ${
                  item.position === "center" && "center"
                }`}
              >
                {data?.is_limit_date ? (
                  <>
                    <span className="case__date-create-date">
                      {moment(new Date(data?.limit_end_date))
                        .utc()
                        .format("DD/MM/YYYY")}
                    </span>
                    <span className="case__date-create-time">
                      {moment(new Date(data?.limit_end_date))
                        .utc()
                        .format("HH:mm:ss")}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="case__date-create-date">
                      Không giới hạn
                    </span>
                  </>
                )}
              </div>
            );
            break;
          }
          case "image": {
            return (
              <div className="case__promotion-image">
                <Image
                  className="case__promotion-image-picture"
                  src={data[item?.dataIndex] || notFoundImage}
                  preview={true}
                />
              </div>
            );
            break;
          }
          default: {
            return (
              <Tooltip placement="top" title={data[item.dataIndex]}>
                <div
                  className={`case__normal-text ${
                    item.position === "center" && "center"
                  }`}
                >
                  <span className="case__normal-text--label">
                    {data[item.dataIndex] || ""}
                  </span>
                </div>
              </Tooltip>
              // <div
              //   className={`case__normal-text ${
              //     item.position === "center" && "center"
              //   }`}
              // >
              //   <span className="case__normal-text--label">
              //     {data[item.dataIndex] || ""}
              //   </span>
              // </div>
            );
          }
        }
      },
      width: item.width || 100,
      align: item.align || "left",
    };
    headerTable.push(temp);
    widthPage += Number(temp.width);
  }
  // 2. Gắn giá trị cho chiều dài bảng và số dòng/trang (dựa trên local storage)
  scroll.y = JSON.parse(localStorage.getItem("tableHeight"))
    ? JSON.parse(localStorage.getItem("tableHeight")).y
    : [];
  scroll.x = scrollX ? scrollX : widthPage;
  // 3. Đẩy action column vào bảng(cột hiển thị gắn cứng góc phải của bảng)
  if (actionColumn) headerTable.push(actionColumn);

  /* ~~~ Handle function ~~~ */
  // 1. Hàm chọn chiều dài bảng
  const handleSelectScrollY = (e) => {
    let myObj_serialized;
    if (e === 0) {
      myObj_serialized = JSON.stringify({ y: "" });
      setScrollYValue(0);
    } else if (e === 1) {
      myObj_serialized = JSON.stringify({ y: 700 });
    } else if (e === 2) {
      myObj_serialized = JSON.stringify({ y: 500 });
    } else if (e === 3) {
      myObj_serialized = JSON.stringify({ y: 300 });
    }
    localStorage.setItem("tableHeight", myObj_serialized);
    setScrollYValue(e);
  };
  // 2. Hàm chọn số dòng/trang
  const handleSelectPagination = (e) => {
    const tempPageSizeOption = { value: e, label: `${e} dòng/trang` };
    let myObj_serialized = JSON.stringify(tempPageSizeOption);
    localStorage.setItem("linePerPage", myObj_serialized);
    setPageSizeOption(tempPageSizeOption);
    if (setLengthPage) {
      setLengthPage(e);
    }
  };

  /* ~~~ Support function ~~~ */
  // 1. Hàm tính trang hiện tại đang hiển thị
  const calculateCurrentPage = (event) => {
    setCurrentPage(event);
    if (onCurrentPageChange) {
      // setIsLoading(true);
      onCurrentPageChange(event * pageSize - pageSize);
    }
  };
  // 2.
  const toggleModal = (event) => {
    if (props.onToggleModal) props.onToggleModal(true);
  };
  // 3.
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
  // 4.
  const HeaderTitle = (title) => {
    return (
      <React.Fragment>
        <p className="title-column">{title}</p>
      </React.Fragment>
    );
  };
  // 5.
  const hideMiddleChars = (str) => {
    const length = str?.length;
    const numStars = Math.floor(length / 2);
    const halfIndex = Math.floor((length - numStars) / 2);

    const stars = "*".repeat(numStars);

    return str.slice(0, halfIndex) + stars + str.slice(halfIndex + numStars);
  };

  /* ~~~ Table child ~~~ */
  // 1. Header của table
  const tableHeader = () => {
    return (
      <div className="table__header-content">
        <div className="table__header-content--left">
          <span className="table__header-content--left-label">
            {`${i18n.t("total", { lng: lang })}`}:
          </span>
          <span className="table__header-content--left-number">
            {totalItem}
          </span>
        </div>
        <div className="table__header-content--right">{headerRightContent}</div>
      </div>
    );
  };
  // 2. Footer của table
  const tableFooter = () => {
    return (
      <div className="table-data__footer">
        <div className="table-data__footer--left">
          <div className="table-data__footer--left-select">
            <Popover
              content={
                "Chiều dài của bảng dữ liệu, người dùng chọn để giới hạn chiều dài bảng"
              }
              placement="top"
              overlayInnerStyle={{
                backgroundColor: "white",
              }}
            >
              <div className="table-data__footer--left-select-label">
                <span>Chiều dài bảng</span>
                <IoHelpCircleOutline />
              </div>
            </Popover>
            <Select
              value={scrollYValue}
              onChange={(e) => handleSelectScrollY(e)}
              style={{ width: "100%" }}
              options={[
                { value: 0, label: "Hiển thị tất cả" },
                { value: 1, label: "Hiển thị nhiều" },
                { value: 2, label: "Hiển thị vừa" },
                { value: 3, label: "Hiển thị ít" },
              ]}
              defaultValue={0}
            />
          </div>
          <div className="table-data__footer--left-select">
            <Popover
              content={"Số dòng hiển thị trong một trang"}
              placement="top"
              overlayInnerStyle={{
                backgroundColor: "white",
              }}
            >
              <div className="table-data__footer--left-select-label">
                <span className="table-data__footer--left-select-label-main-text">
                  Số dòng
                </span>
                <IoHelpCircleOutline />
              </div>
            </Popover>
            <Select
              value={pageSizeOption}
              onChange={(e) => handleSelectPagination(e)}
              style={{ width: "100%" }}
              options={pageSizeOptions}
              defaultValue={0}
            />
          </div>
        </div>
        <div>
          <Pagination
            current={currentPage}
            onChange={calculateCurrentPage}
            total={totalItem}
            showSizeChanger={false}
            pageSize={pageSizeOption?.value || 20}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="table-data">
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#8b5cf6",
              rowHoverBg: "#f0f0f0",
              borderColor: "#e7ecf3",
              lineWidth: 1,
              headerBorderRadius: 6,
              footerBg: "#ffffff",
            },
          },
        }}
      >
        <Table
          style={{ borderRadius: "6px", overflow: "hidden" }}
          locale={locale}
          columns={headerTable}
          title={() => tableHeader()}
          footer={() => tableFooter()}
          dataSource={data}
          pagination={false}
          scroll={scroll}
          loading={loading || false}
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
      </ConfigProvider>
    </div>
  );
};

export default memo(DataTable);
