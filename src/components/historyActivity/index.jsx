import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import { formatMoney } from "../../helper/formatMoney";
import { Link } from "react-router-dom";
import useWindowDimensions from "../../helper/useWindowDimensions";

const HistoryActivity = (props) => {
  const { width } = useWindowDimensions();
  const { data } = props;
  const [arrComponents, setArrComponents] = useState([]);
  const [chooseItem, setChooseItem] = useState();
  useEffect(() => {}, []);
  const onChooseItem = (item) => {
    if (item?._id === chooseItem?._id) {
      setChooseItem(null);
    } else {
      setChooseItem(item);
    }
  };
  const DetailHistoryConfirmOrder = ({ detailHistoryActivity }) => {
    const {
      id_order,
      id_customer,
      id_collaborator,
      id_transaction,
      id_punish_ticket,
    } = detailHistoryActivity;
    console.log("detailHistoryActivity ", detailHistoryActivity);
    return (
      <div className="detail-history-activity_confirm-order_container">
        <div className="item-left ">
          {/*Đơn hàng, Khách Hàng, CTV*/}
          {id_order?.id_view && (
            <div className="content-container ">
              <p style={{ marginRight: "4px" }}>Đơn hàng:</p>
              <Link
                to={`/details-order/${id_order?.id_group_order}`}
                target="_blank"
              >
                <p className="link-to">{id_order?.id_view}</p>
              </Link>
            </div>
          )}
          {id_customer && (
            <div className="content-container ">
              <p style={{ marginRight: "4px" }}>Khách hàng:</p>
              <Link to={`/profile-customer/${id_customer?._id}`}>
                <p className="link-to">{id_customer?.id_view}</p>
              </Link>
            </div>
          )}
          {id_collaborator && (
            <div className="content-container ">
              <p style={{ marginRight: "4px" }}>CTV: </p>
              <Link
                to={`/details-collaborator/${id_collaborator?._id}`}
                target="_balance"
              >
                <p className="link-to">{id_collaborator?.full_name}</p>
              </Link>
            </div>
          )}
          {/*Mã giao dịch, Mã lệnh phạt*/}
          {id_transaction && (
            <div className="content-container ">
              <p style={{ marginRight: "4px" }}>Mã giao dịch: </p>
              {/* <Link
                to={`transaction/manage-transaction`} // link to page manager transaction
                target="_blank"
              > */}
              <p className="link-to">{id_transaction?.id_view}</p>
              {/* </Link> */}
            </div>
          )}
          {id_punish_ticket && (
            <div className="content-container ">
              <p style={{ marginRight: "4px" }}>Mã lệnh phạt: </p>
              {/* <Link 
              to={`punish/manage-punish`} target="_blank"// link to page manager punish ticket
              >  */}
              <p className="link-to">{id_punish_ticket?.id_view}</p>
              {/* </Link> */}
            </div>
          )}
        </div>
      </div>
    );
  };
  return (
    <div className="history-activity_container">
      {data.map((item, index) => {
        const { title, body, date_create, id_admin_action, title_admin } = item;
        console.log("item ", item);
        return (
          <div className="history-activity_item-container">
            {/* Line Horizontal*/}
            {width < 490 && (
              <div className="item-vertical-line">
                <div className={index === 0 ? `circle` : "circle-black"}></div>
                {/* {index !== data.length - 1 && <div className="line"></div>} */}
                <div className="line"></div>
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: `${width < 490 ? "row" : "column"}`,
                padding: `${width < 490 ? "0px 15px" : "0px 0px"}`,
                width: `${width < 490 ? "100%" : "140px"}`,
                gap: "4px",
              }}
              // className="item-left"
            >
              {/*Date*/}
              <p className="">
                {format(new Date(date_create), "dd/MM/yyyy - HH:mm")}
              </p>
              {/*Admin name*/}
              <p className="link-to">{id_admin_action?.full_name}</p>
            </div>
            {/* Line Vertical*/}
            {width > 490 && (
              <div className="item-vertical-line">
                <div className={index === 0 ? `circle` : "circle-black"}></div>
                {index !== data.length - 1 && <div className="line"></div>}
                {/* <div className="line"></div> */}
              </div>
            )}
            {/*Item Info*/}
            <div className="item-info">
              <div
                className="item-info_title"
                onClick={() => onChooseItem(item)}
              >
                <div className="title_admin">
                  <div style={{ width: "100%" }}>
                    {/*Header mỗi giao dịch */}
                    <p style={{ fontSize: "14px" }}>{title?.vi}</p>
                    {/*Container for web*/}
                    {width > 490 && (
                      <div className="container-wallet">
                        {/*Tiền ví nạp sau giao dịch*/}
                        <p style={{ width: "50%" }}>
                          <span className="title-wallet">Ví Nạp:</span>{" "}
                          <span className="">
                            {formatMoney(item?.current_work_wallet)}
                          </span>
                          {item?.status_current_work_wallet === "down" ? (
                            <i
                              style={{ color: "red" }}
                              class="uil uil-arrow-down icon-deduction"
                            ></i>
                          ) : item?.status_current_work_wallet === "up" ? (
                            <i
                              style={{ color: "green" }}
                              class="uil uil-arrow-up icon-plus"
                            ></i>
                          ) : (
                            <></>
                          )}
                        </p>
                        {/*Tiền ví CTV sau giao dịch*/}
                        <p style={{ width: "50%" }}>
                          <span className="title-wallet"> Ví CTV: </span>{" "}
                          <span>
                            {formatMoney(item?.current_collaborator_wallet)}
                          </span>
                          {item?.status_current_collaborator_wallet ===
                          "down" ? (
                            <i
                              style={{ color: "red" }}
                              class="uil uil-arrow-down icon-deduction"
                            ></i>
                          ) : item?.status_current_collaborator_wallet ===
                            "up" ? (
                            <i
                              style={{ color: "green" }}
                              class="uil uil-arrow-up icon-plus"
                            ></i>
                          ) : (
                            <></>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {/*Số tiền giao dịch và dropdown icon*/}
                <div className="container-drop-down">
                  <p className={item?.value > 0 ? "plus-money" : "minus-money"}>
                    {`${item?.value > 0 ? "+" : ""}` + formatMoney(item?.value)}
                  </p>
                  {width > 490 && <DownOutlined style={{ color: "blue" }} />}
                  {/*Container for mobile*/}
                  {width < 490 && (
                    <div className="">
                      {/*Tiền ví nạp sau giao dịch*/}
                      <p className="">
                        <span style={{ color: "#a9afc3", fontSize: "12px" }}>
                          Ví Nạp:
                        </span>{" "}
                        <span style={{ fontSize: "12px" }}>
                          {formatMoney(item?.current_work_wallet)}
                        </span>
                        {item?.status_current_work_wallet === "down" ? (
                          <i
                            style={{ color: "red" }}
                            class="uil uil-arrow-down icon-deduction"
                          ></i>
                        ) : item?.status_current_work_wallet === "up" ? (
                          <i
                            style={{ color: "green" }}
                            class="uil uil-arrow-up icon-plus"
                          ></i>
                        ) : (
                          <></>
                        )}
                      </p>
                      {/*Tiền ví CTV sau giao dịch*/}
                      <p className="">
                        <span style={{ color: "#a9afc3", fontSize: "12px" }}>
                          Ví CTV:
                        </span>{" "}
                        <span style={{ fontSize: "12px" }}>
                          {formatMoney(item?.current_collaborator_wallet)}
                        </span>
                        {item?.status_current_collaborator_wallet === "down" ? (
                          <i
                            style={{ color: "red" }}
                            class="uil uil-arrow-down icon-deduction"
                          ></i>
                        ) : item?.status_current_collaborator_wallet ===
                          "up" ? (
                          <i
                            style={{ color: "green" }}
                            class="uil uil-arrow-up icon-plus"
                          ></i>
                        ) : (
                          <></>
                        )}
                      </p>
                    </div>
                  )}
                  {/* <DownOutlined color="#000" /> */}
                </div>
              </div>
              {/*Dropdown detail info*/}
              <div className="item-info_detail">
                {chooseItem?._id === item?._id && (
                  <DetailHistoryConfirmOrder detailHistoryActivity={item} />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default HistoryActivity;
