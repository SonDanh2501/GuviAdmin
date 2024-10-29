import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import { formatMoney } from "../../helper/formatMoney";
import { Link } from "react-router-dom";
import useWindowDimensions from "../../helper/useWindowDimensions";
import "./index.scss";
import moment from "moment";
import { getLanguageState } from "../../redux/selectors/auth";
import { useSelector } from "react-redux";
import icons from "../../utils/icons";
import emptyData from "../../assets/images/empty_data.svg";


const HistoryActivity = (props) => {
  const { data } = props;
  const {
    IoArrowDown,
    IoArrowForward,
    IoArrowUp,
    IoRemove,
    IoSettings,
    IoTrendingDown,
    IoTrendingUp,
  } = icons;
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);
  /* ~~~ Value ~~~ */
  const [arrComponents, setArrComponents] = useState([]);
  const [chooseItem, setChooseItem] = useState();
  /* ~~~ Use effect ~~~ */
  useEffect(() => {}, []);
  const onChooseItem = (item) => {
    if (item?._id === chooseItem?._id) {
      setChooseItem(null);
    } else {
      setChooseItem(item);
    }
  };
  /* ~~~ Main ~~~ */
  return (
    <div className="history-activity">
      {data?.map((item, index) => {
        const { title, body, date_create, id_admin_action, title_admin } = item;
        return (
          <div>
            <div className="history-activity__item">
              {/* left */}
              <div className="history-activity__item--left">
                <span className="history-activity__item--left-time">
                  {moment(new Date(date_create)).format("DD MMM, YYYY - HH:mm")}
                </span>
                <span className="history-activity__item--left-date">
                  {moment(new Date(date_create)).locale(lang).format("dddd")}
                </span>
                <span className="history-activity__item--left-admin">
                  {id_admin_action?.full_name}
                </span>
              </div>
              {/* Line */}
              <div className="history-activity__item--middle">
                <div
                  className={`history-activity__item--middle-icon admin ${
                    item?.status_current_work_wallet === "down"
                      ? "down"
                      : item?.status_current_work_wallet === "up"
                      ? "up"
                      : item?.status_current_collaborator_wallet === "down"
                      ? "down"
                      : item?.status_current_collaborator_wallet === "up"
                      ? "up"
                      : "setting"
                  }`}
                >
                  {item?.status_current_work_wallet === "down" ? (
                    <IoArrowDown size={15} color="red" />
                  ) : item?.status_current_work_wallet === "up" ? (
                    <IoArrowUp size={15} color="green" />
                  ) : item?.status_current_collaborator_wallet === "down" ? (
                    <IoArrowDown size={15} color="red" />
                  ) : item?.status_current_collaborator_wallet === "up" ? (
                    <IoArrowUp size={15} color="green" />
                  ) : (
                    <IoSettings size={15} color="blue" />
                  )}
                </div>
                {index !== data?.length - 1 && (
                  <div className="history-activity__item--middle-line"></div>
                )}
              </div>
              {/* Right */}
              <div className="history-activity__item--right">
                <div className="history-activity__item--right-top">
                  <div>
                    <span className="history-activity__item--right-top-title">
                      {title_admin}
                    </span>
                    {item?.id_collaborator && (
                      <>
                        <div className="history-activity__item--right-top-money">
                          <span className="history-activity__item--right-top-money-title">
                            Ví Nạp:
                          </span>
                          <span className="">
                            {formatMoney(item?.current_work_wallet)}
                          </span>
                          {item?.status_current_work_wallet === "down" ? (
                            <IoTrendingDown color="red" />
                          ) : item?.status_current_work_wallet === "up" ? (
                            <IoTrendingUp color="green" />
                          ) : item?.status_current_work_wallet === "none" ? (
                            <IoRemove color="black" />
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="history-activity__item--right-top-money">
                          <span className="history-activity__item--right-top-money-title">
                            Ví CTV:
                          </span>
                          <span>
                            {formatMoney(item?.current_collaborator_wallet)}
                          </span>
                          {item?.status_current_collaborator_wallet ===
                          "down" ? (
                            <IoTrendingDown color="red" />
                          ) : item?.status_current_collaborator_wallet ===
                            "up" ? (
                            <IoTrendingUp color="green" />
                          ) : item?.status_current_collaborator_wallet ===
                            "none" ? (
                            <IoRemove color="black" />
                          ) : (
                            ""
                          )}
                        </div>
                      </>
                    )}
                    {item?.id_customer && (
                      <div className="history-activity__item--right-top-money">
                        <span className="history-activity__item--right-top-money-title">
                          Số dư tài khoản:
                        </span>
                        <span>{formatMoney(item?.current_pay_point)}</span>
                        {item?.status_current_pay_point === "down" ? (
                          <IoTrendingDown color="red" />
                        ) : item?.status_current_pay_point === "up" ? (
                          <IoTrendingUp color="green" />
                        ) : item?.status_current_pay_point === "none" ? (
                          <IoRemove color="black" />
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                  </div>
                  <div className="history-activity__item--right-top-transiction">
                    <span
                      className={`history-activity__item--right-top-transiction-number ${
                        item?.value > 0 ? "up" : "down"
                      }`}
                    >
                      {`${item?.value > 0 ? "+" : ""}` +
                        formatMoney(item?.value)}
                    </span>
                    <div
                      onClick={() => onChooseItem(item)}
                      className="history-activity__item--right-top-transiction-detail"
                    >
                      {item?.id_collaborator && (
                        <span className="history-activity__item--right-top-transiction-detail-label">
                          Chi tiết
                          <IoArrowForward size={12} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={`history-activity__item--right-bottom ${
                    chooseItem?._id !== item?._id && "hidden"
                  }`}
                >
                  {item?.id_order?.id_view && (
                    <div className="history-activity__item--right-bottom-item">
                      <span className="history-activity__item--right-bottom-item-label">
                        Đơn hàng:
                      </span>
                      <Link
                        style={{ paddingBottom: "3px" }}
                        to={`/details-order/${item?.id_order?.id_group_order}`}
                        target="_blank"
                      >
                        <span className="history-activity__item--right-bottom-item-link">
                          {item?.id_order?.id_view}
                        </span>
                      </Link>
                    </div>
                  )}
                  {item?.id_customer && (
                    <div className="history-activity__item--right-bottom-item">
                      <span className="history-activity__item--right-bottom-item-label">
                        Khách hàng:
                      </span>
                      <Link
                        style={{ paddingBottom: "3px" }}
                        to={`/profile-customer/${item?.id_customer?._id}`}
                      >
                        <span className="history-activity__item--right-bottom-item-link">
                          {item?.id_customer?.id_view}
                        </span>
                      </Link>
                    </div>
                  )}
                  {item?.id_collaborator && (
                    <div className="history-activity__item--right-bottom-item">
                      <span className="history-activity__item--right-bottom-item-label">
                        CTV:
                      </span>
                      <Link
                        style={{ paddingBottom: "3px" }}
                        to={`/details-collaborator/${item?.id_collaborator?._id}`}
                        target="_balance"
                      >
                        <span className="history-activity__item--right-bottom-item-link">
                          {item?.id_collaborator?.full_name}
                        </span>
                      </Link>
                    </div>
                  )}
                  {/*Mã giao dịch, Mã lệnh phạt*/}
                  {item?.id_transaction && (
                    <div className="history-activity__item--right-bottom-item">
                      <span className="history-activity__item--right-bottom-item-label">
                        Mã giao dịch:
                      </span>
                      {/* <Link
                     to={`transaction/manage-transaction`} // link to page manager transaction
                     target="_blank"
                   > */}

                      <span className="history-activity__item--right-bottom-item-link">
                        {item?.id_transaction?.id_view}
                      </span>
                      {/* </Link> */}
                    </div>
                  )}
                  {item?.id_punish_ticket && (
                    <div className="history-activity__item--right-bottom-item">
                      <span className="history-activity__item--right-bottom-item-label">
                        Mã lệnh phạt:
                      </span>
                      {/* <Link 
                   to={`punish/manage-punish`} target="_blank"// link to page manager punish ticket
                   >  */}
                      <span className="history-activity__item--right-bottom-item-link">
                        {item?.id_punish_ticket?.id_view}
                      </span>
                      {/* </Link> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {/* Nếu không có dữ liệu */}
      {data?.length === 0 && (
        <div className="history-activity__empty">
          <img className="history-activity__empty--image" src={emptyData}></img>
          <span className="history-activity__empty--label">
            Không có dữ liệu để hiển thị
          </span>
        </div>
      )}
    </div>
  );
};
export default HistoryActivity;
