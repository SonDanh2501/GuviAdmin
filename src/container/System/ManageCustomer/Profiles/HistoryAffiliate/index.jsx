import React, { useEffect, useState } from "react";
import { errorNotify } from "../../../../../helper/toast";
import { getListHistoryDiscountApi } from "../../../../../api/affiliate";
import moment from "moment";
import icons from "../../../../../utils/icons";
import { formatMoney } from "../../../../../helper/formatMoney";
import { Pagination } from "antd";
import notFoundImage from "../../../../../assets/images/empty_data.svg";
import "./index.scss";

const HistoryAffiliate = (props) => {
  const {
    IoArrowUp,
    IoArrowDown,
    IoSettings,
    IoTrendingDown,
    IoTrendingUp,
    IoRemove,
  } = icons;
  const { id } = props;
  const [lengthPage, setLengthPage] = useState(25);
  /* ~~~ Value ~~~ */
  const [listDataHistoryDiscount, setListDataHistoryDiscount] = useState([]);
  const [startPageHistoryDiscount, setStartPageHistoryDiscount] = useState(0); // Giá trị phần tử bắt đầu hiển thì
  const [currentPageHistoryDiscount, setCurrentPageHistoryDiscount] =
    useState(1); // Giá trị trang đang chọn hiển thị hiện tại

  /* ~~~ Handle function ~~~ */
  // 1. Hàm fetch giá trị danh sách nhận chiết khấu
  const fetchDataHistoryDiscount = async () => {
    try {
      const res = await getListHistoryDiscountApi(
        id,
        startPageHistoryDiscount,
        lengthPage,
        "",
        ""
      );
      setListDataHistoryDiscount(res);
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
    }
  };

  /* ~~~ Use effect ~~~ */
  useEffect(() => {
    fetchDataHistoryDiscount();
  }, [startPageHistoryDiscount, lengthPage, id]);

  /* ~~~ Other ~~~ */
  // 1.Hàm set giá trị cho phân
  const calculateCurrentPage = (event) => {
    setCurrentPageHistoryDiscount(event);
    setStartPageHistoryDiscount(event * lengthPage - lengthPage);
  };

  /* ~~~ Main ~~~ */
  return (
    <div>
      {listDataHistoryDiscount?.data?.length > 0 ? (
        <>
          {listDataHistoryDiscount?.data?.map((el, index) => (
            <div className="refferend-list-affiliate__content--middle-content-history-receiving">
              {/* Left */}
              <div className="refferend-list-affiliate__content--middle-content-history-receiving-left">
                <span className="refferend-list-affiliate__content--middle-content-history-receiving-left-time">
                  {moment(new Date(el?.date_create)).format(
                    "DD MMM, YYYY - HH:mm"
                  )}
                </span>
                <span className="refferend-list-affiliate__content--middle-content-history-receiving-left-date">
                  {moment(new Date(el?.date_create)).format("dddd")}
                </span>
              </div>
              {/* Line */}
              <div className="refferend-list-affiliate__content--middle-content-history-receiving-middle">
                <div
                  className={`refferend-list-affiliate__content--middle-content-history-receiving-middle-icon admin ${
                    el?.type === "system_receive_discount"
                      ? "up"
                      : el?.type === "customer_request_withdraw_affiliate"
                      ? "down"
                      : "setting"
                  }`}
                >
                  {el?.type === "system_receive_discount" ? (
                    <IoArrowUp size={16} color="green" />
                  ) : el?.type === "customer_request_withdraw_affiliate" ? (
                    <IoArrowDown size={16} color="red" />
                  ) : (
                    <IoSettings size={16} color="setting" />
                  )}
                </div>

                <div
                  className={`refferend-list-affiliate__content--middle-content-history-receiving-middle-line ${
                    index === listDataHistoryDiscount?.data?.length - 1 &&
                    "hidden"
                  }`}
                ></div>
              </div>
              {/* Right */}
              <div className="refferend-list-affiliate__content--middle-content-history-receiving-right">
                <div className="refferend-list-affiliate__content--middle-content-history-receiving-right-top">
                  <div>
                    <span className="refferend-list-affiliate__content--middle-content-history-receiving-right-top-title">
                      {el?.title?.vi}
                    </span>
                    <>
                      <div className="refferend-list-affiliate__content--middle-content-history-receiving-right-top-money ">
                        <span className="refferend-list-affiliate__content--middle-content-history-receiving-right-top-money-title">
                          Ví A Pay:
                        </span>
                        <span>{formatMoney(el?.current_a_pay)}</span>
                        {el?.status_current_a_pay === "up" ? (
                          <IoTrendingUp color="green" />
                        ) : el?.status_current_a_pay === "down" ? (
                          <IoTrendingDown color="red" />
                        ) : (
                          <IoRemove color="black" />
                        )}
                      </div>
                    </>
                  </div>
                  {el?.value !== 0 && (
                    <div className="refferend-list-affiliate__content--middle-content-history-receiving-right-top-transiction">
                      <span
                        className={`refferend-list-affiliate__content--middle-content-history-receiving-right-top-transiction-number ${
                          el?.status_current_a_pay === "up"
                            ? "up"
                            : el?.status_current_a_pay === "down"
                            ? "down"
                            : "none"
                        }`}
                      >
                        {formatMoney(el?.value)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="refferend-list-affiliate__content--middle-content-pagination">
            <div></div>
            <Pagination
              current={currentPageHistoryDiscount}
              onChange={calculateCurrentPage}
              total={listDataHistoryDiscount?.totalItem}
              showSizeChanger={false}
              pageSize={lengthPage}
            />
          </div>
        </>
      ) : (
        <div className="refferend-list-affiliate__content--middle-content-history-receiving">
          <div className="refferend-list-affiliate__content--middle-content-history-receiving-not-found">
            <img className="" src={notFoundImage}></img>
            <span className="refferend-list-affiliate__content--middle-content-history-receiving-not-found-label">
              Chưa có dữ liệu
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryAffiliate;
