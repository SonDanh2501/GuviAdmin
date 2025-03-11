import React, { useState } from "react";
import "./index.scss";
import moment from "moment";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../redux/selectors/auth";
import icons from "../../../utils/icons";
import { Pagination, Tooltip } from "antd";
import i18n from "../../../i18n";

const {
  IoAlertOutline,
  IoCalendarNumberOutline,
  IoCalendarOutline,
  IoCallOutline,
  IoCashOutline,
  IoCheckmark,
  IoCheckmarkCircleOutline,
  IoCheckmarkDoneOutline,
  IoCloseCircleOutline,
  IoFlagOutline,
  IoHeartOutline,
  IoHelpCircleOutline,
  IoHourglassOutline,
  IoLogoUsd,
  IoMedalOutline,
  IoNewspaperOutline,
  IoPersonOutline,
  IoReceiptOutline,
  IoShieldCheckmarkOutline,
  IoThumbsDownOutline,
  IoTimeOutline,
  IoCaretDown,
  IoTrendingUp,
  IoTrendingDown,
  IoAdd,
  IoRemove,
  IoConstruct,
  IoPeopleOutline,
  IoSettingsOutline,
  IoWalletOutline,
} = icons;

const CardActivityLog = (props) => {
  const {
    data,
    totalItem,
    start,
    pageSize,
    setLengthPage,
    onCurrentPageChange,
    dateIndex,
    statusIndex,
    pagination,
  } = props;
  const lang = useSelector(getLanguageState);
  const [currentPage, setCurrentPage] = useState(1);

  /* Hàm hỗ trợ */
  // 1. Hàm tính thời gian bắt đầu - thời gian kết thúc
  const timeWork = (data) => {
    const start = moment(new Date(data.date_work)).format("HH:mm");
    const timeEnd = moment(new Date(data?.date_work))
      .add(data?.total_estimate, "hours")
      .format("HH:mm");
    return start + " - " + timeEnd;
  };
  // 2.
  const onChange = (page) => {
    setLengthPage(page);
  };
  const calculateCurrentPage = (event) => {
    setCurrentPage(event);
    if (onCurrentPageChange) {
      onCurrentPageChange(event * pageSize - pageSize);
    }
  };
  /* Hàm render */
  // 1. Hàm render nội dung bên trái (ngày tháng năm, thời gian và tên (nếu có))
  const leftContent = (date, dayInWeek, time) => {
    return (
      <div className="card-activities--activity-left">
        <div>
          <span className="card-activities--activity-left-date">{date}</span>
        </div>
        <div>
          <span className="card-activities--activity-left-day-in-week">
            {dayInWeek}
          </span>
        </div>
        <div>
          <span className="card-activities--activity-left-time">{time}</span>
        </div>
      </div>
    );
  };
  // 2. Hàm render nội dung giữa (line và icon)
  const middleContent = (status, lastItem) => {
    let iconType;
    if (statusIndex === "type") {
      switch (status?.split("_")[0]) {
        case "admin":
          iconType = (
            <div className="card-activities--activity-line-icon violet">
              <IoPeopleOutline size={15} color="violet" />
            </div>
          );
          break;
        case "collaborator":
          iconType = (
            <div className="card-activities--activity-line-icon blue">
              <IoPersonOutline size={15} color="blue" />
            </div>
          );
          break;
        case "verify":
          iconType = (
            <div className="card-activities--activity-line-icon red">
              <IoCloseCircleOutline size={15} color="red" />
            </div>
          );
          break;
        case "create":
          iconType = (
            <div className="card-activities--activity-line-icon green">
              <IoCheckmarkDoneOutline size={15} color="green" />
            </div>
          );
          break;
        default:
          iconType = (
            <div className="card-activities--activity-line-icon yellow">
              <IoSettingsOutline size={15} color="orange" />
            </div>
          );
          break;
      }
    } else if (statusIndex === "status") {
      switch (status) {
        case "pending":
          iconType = (
            <div className="card-activities--activity-line-icon pending">
              <IoAlertOutline size={15} color="orange" />
            </div>
          );
          break;
        case "confirm":
          iconType = (
            <div className="card-activities--activity-line-icon confirm">
              <IoFlagOutline size={15} color="blue" />
            </div>
          );
          break;
        case "doing":
          iconType = (
            <div className="card-activities--activity-line-icon doing">
              <IoHourglassOutline size={15} color="blue" />
            </div>
          );
          break;
        case "done":
          iconType = (
            <div className="card-activities--activity-line-icon done">
              <IoCheckmarkDoneOutline size={15} color="green" />
            </div>
          );
          break;
        case "cancel":
          iconType = (
            <div className="card-activities--activity-line-icon cancel">
              <IoCloseCircleOutline size={15} color="red" />
            </div>
          );
          break;
        default:
          iconType = "";
          break;
      }
    }
    return (
      <div className="card-activities--activity-line">
        {iconType}
        {!lastItem && (
          <div className="card-activities--activity-line-icon-line"></div>
        )}
      </div>
    );
  };
  // 3. Hàm render nội dung bên phải
  const rightConent = (data) => {
    let headerContent;
    let status;
    // Header content
    switch (data?.service?._id?.kind) {
      case "giup_viec_theo_gio":
        headerContent = `${i18n.t("cleaning", { lng: lang })} / ${timeWork(
          data
        )}`;
        break;
      case "giup_viec_co_dinh":
        headerContent = `${i18n.t("cleaning_subscription", {
          lng: lang,
        })} / ${timeWork(data)}`;
        break;
      case "phuc_vu_nha_hang":
        headerContent = `${i18n.t("serve", { lng: lang })} / ${timeWork(data)}`;
        break;
      default:
        headerContent = "";
        break;
    }
    if (data?.title_admin) headerContent = data?.title_admin;
    // Status content
    switch (data?.status) {
      case "pending":
        status = (
          <div className="card-activities--activity-right-status pending">
            <span>{i18n.t("pending", { lng: lang })}</span>
          </div>
        );
        break;
      case "confirm":
        status = (
          <div className="card-activities--activity-right-status confirm">
            <span>{i18n.t("confirm", { lng: lang })}</span>
          </div>
        );
        break;
      case "doing":
        status = (
          <div className="card-activities--activity-right-status doing">
            <span>{i18n.t("doing", { lng: lang })}</span>
          </div>
        );
        break;
      case "done":
        status = (
          <div className="card-activities--activity-right-status done">
            <span>{i18n.t("done", { lng: lang })}</span>
          </div>
        );
        break;
      case "cancel":
        status = (
          <div className="card-activities--activity-right-status cancel">
            <span>{i18n.t("cancel", { lng: lang })}</span>
          </div>
        );
        break;
      default:
        status = "";
        break;
    }
    return (
      <div className="card-activities--activity-right">
        {/* Header */}
        <div>
          <span className="card-activities--activity-right-time">
            {headerContent}
          </span>
        </div>
        {/* Sub content */}
        <div>
          <Tooltip placement="top" title={data?.address}>
            <span className="card-activities--activity-right-address">
              {data?.address && data?.address}
            </span>
          </Tooltip>
        </div>
        {/* Status */}
        {status}
      </div>
    );
  };

  // const groupedData = data?.reduce((acc, item) => {
  //   const date = item.date_create.split("T")[0]; // Lấy phần ngày từ ISO string
  //   if (!acc[date]) {
  //     acc[date] = [];
  //   }
  //   acc[date].push(item);
  //   return acc;
  // }, {});

  // const sortedGroupedData = Object.fromEntries(
  //   Object.entries(groupedData).sort(
  //     ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
  //   )
  // );

  // console.log(sortedGroupedData);

  // groupedArray?.map((el, index) => console.log("check >>>"));
  return (
    <div>
    {totalItem > 0 ? (
      <div className="card-activities">
        {data?.map((activity, index) => (
          <div className="card-activities--activity">
            {/* Nội dung bên trái */}
            {leftContent(
              moment(new Date(activity[dateIndex])).format("DD MMM, YYYY"),
              "",
              moment(new Date(activity[dateIndex]))
                .locale(lang)
                .format("dddd - HH:mm")
            )}
            {/* Icon và line ở giữa */}
            {index === data?.length - 1
              ? middleContent(activity[statusIndex], true)
              : middleContent(activity[statusIndex], false)}
            {/* Nội dung bên phải */}
            {rightConent(activity)}
            </div>
            ))}
            <div
              className={`card-activities--pagination ${!pagination && "hidden"}`}
            >
              <Pagination
                current={currentPage}
                onChange={calculateCurrentPage}
                total={totalItem}
                showSizeChanger={false}
                pageSize={pageSize}
              />
              </div>
        </div>
      ) : (
        <div className="flex justify-center items-center p-4">
          <span className="text-xs text-gray-500/60 italic">
            Cộng tác viên chưa có hoạt động nào
          </span>
        </div>
      )}
    </div>
  );
};

export default CardActivityLog;