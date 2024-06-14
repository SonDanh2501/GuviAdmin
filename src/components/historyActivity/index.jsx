import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import { formatMoney } from "../../helper/formatMoney";
import { Link } from "react-router-dom";

const HistoryActivity = (props) => {
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
        <div className="item-left">
          {id_order?.id_view && (
            <div className="content-container">
              <p>Đơn hàng: </p>
              <Link
                to={`/details-order/${id_order?.id_group_order}`}
                target="_blank"
              >
                <p className="link-to">{id_order?.id_view}</p>
              </Link>
            </div>
          )}
          {id_customer && (
            <div className="content-container">
              <p>Khách hàng: </p>
              <Link to={`/profile-customer/${id_customer?._id}`}>
                <p className="link-to">{id_customer?.id_view}</p>
              </Link>
            </div>
          )}
          {id_collaborator && (
            <div className="content-container">
              <p>CTV: </p>
              <Link
                to={`/details-collaborator/${id_collaborator?._id}`}
                target="_balance"
              >
                <p className="link-to">{id_collaborator?.full_name}</p>
              </Link>
            </div>
          )}
        </div>
        <div className="item-right">
          {id_transaction && (
            <div className="content-container">
              <p>Mã giao dịch: </p>
              {/* <Link
                to={`transaction/manage-transaction`} // link to page manager transaction
                target="_blank"
              > */}
              <p className="link-to">{id_transaction?.id_view}</p>
              {/* </Link> */}
            </div>
          )}
          {id_punish_ticket && (
            <div className="content-container">
              <p>Mã lệnh phạt: </p>
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
            <div className="item-left">
              <p>{format(new Date(date_create), "dd/MM/yyyy - HH:mm")}</p>
              <p className="link-to">{id_admin_action?.full_name}</p>
            </div>
            <div className="item-vertical-line">
              <div className={index === 0 ? `circle` : "circle-black"}></div>
              {index !== data.length - 1 && <div className="line"></div>}
            </div>

            <div className="item-info">
              <div
                className="item-info_title"
                onClick={() => onChooseItem(item)}
              >
                <div className="title_admin">
                  <div>
                    <p className="">{title?.vi}</p>
                    <div className="container-wallet">
                      <p className="">
                        <span className="title-wallet">Ví Nạp:</span>{" "}
                        <span>{formatMoney(item?.current_work_wallet)}</span>
                      </p>
                      <p className="">
                        <span className="title-wallet"> Ví CTV: </span>{" "}
                        <span>
                          {formatMoney(item?.current_collaborator_wallet)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="container-drop-down">
                  <p className={item?.value > 0 ? "plus-money" : "minus-money"}>
                    {`${item?.value > 0 ? "+" : ""}` + formatMoney(item?.value)}
                  </p>
                  <DownOutlined color="#000" />
                </div>
              </div>
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
