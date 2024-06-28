import { useEffect, useState } from "react";
import { getHistoryOrderApi } from "../../../api/order";
import { loadingAction } from "../../../redux/actions/loading";
import i18n from "../../../i18n";
import { useDispatch, useSelector } from "react-redux";
import { getLanguageState } from "../../../redux/selectors/auth";
import { formatMoney } from "../../../helper/formatMoney";
import moment from "moment";
import { Pagination } from "antd";
import LoadingPagination from "../../../components/paginationLoading";
import useWindowDimensions from "../../../helper/useWindowDimensions";
import { DownOutlined } from "@ant-design/icons";

const ActivityOrder = (props) => {
  const { width } = useWindowDimensions();
  const { id } = props;
  const lang = useSelector(getLanguageState);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [dataHistory, setDataHistory] = useState([]);
  const [totalHistory, setTotalHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getData();
  }, []);
  const getData = (_start = 0, _length = 20) => {
    setIsLoading(true);
    getHistoryOrderApi(id, _start, _length)
      .then((res) => {
        setDataHistory(res?.data);
        setTotalHistory(res?.totalItem);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = dataHistory?.length < 20 ? 20 : dataHistory.length;
    const start = page * dataLength - dataLength;
    getData(start, dataLength);
  };
  return (
    <div className="activity-order_container">
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
            ? subject.replace(item?.id_punish?._id, item?.id_punish?.note_admin)
            : item?.id_reason_punish
            ? subject.replace(
                item?.id_reason_punish?._id,
                item?.id_reason_punish?.title?.vi
              )
            : item?.id_order
            ? subject.replace(item?.id_order?._id, item?.id_order?.id_view)
            : item?.id_reward
            ? subject.replace(item?.id_reward?._id, item?.id_reward?.title?.vi)
            : item?.id_info_reward_collaborator
            ? subject.replace(
                item?.id_info_reward_collaborator?._id,
                item?.id_info_reward_collaborator?.id_reward_collaborator?.title
                  ?.vi
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
            ? predicate.replace(item?.id_order?._id, item?.id_order?.id_view)
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
            // <div key={index} className="div-item-activity-detail-order">
            //   <div className="div-name">
            //     {/*Title */}
            //     <a className="text-title">{object}</a>
            //     {/*Money */}
            //     {item?.type !== "customer_collect_points_order" && (
            //       <a
            //         className={
            //           money.slice(0, 1) === "-"
            //             ? "text-money-deduction"
            //             : "text-money-plus"
            //         }
            //       >
            //         {item?.value === 0
            //           ? ""
            //           : money.slice(0, 1) === "-"
            //           ? formatMoney(item?.value)
            //           : "+" + formatMoney(item?.value)}
            //       </a>
            //     )}
            //   </div>
            //   {/*Date, time*/}
            //   <a className="text-date">
            //     {moment(new Date(item?.date_create)).format(
            //       "DD/MM/yyy - HH:mm"
            //     )}
            //   </a>
            // </div>
            <div className="history-activity_item-container">
              {/* Line Horizontal*/}
              {width < 490 && (
                <div className="item-vertical-line">
                  <div
                    className={index === 0 ? `circle` : "circle-black"}
                  ></div>
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
                  {moment(new Date(item?.date_create)).format(
                    "DD/MM/yyy - HH:mm"
                  )}
                </p>
              </div>
              {/* Line Vertical*/}
              {width > 490 && (
                <div className="item-vertical-line">
                  <div
                    className={index === 0 ? `circle` : "circle-black"}
                  ></div>
                  {/* {index !== data.length - 1 && <div className="line"></div>} */}
                  <div className="line"></div>
                </div>
              )}
              {/*Item Info*/}
              <div className="item-info">
                <div
                  className="item-info_title "
                  // onClick={() => onChooseItem(item)}
                >
                  <div className="title_admin">
                    {/*Đang lấy 75 nếu màn hình lớn và 65 cho màn hình nhỏ */}
                    <div style={{ width: "100%" }}>
                      {/*Lấy full của 75% của toàn bộ component*/}
                      {/*Header mỗi giao dịch */}
                      <p style={{ fontSize: "14px" }}>{object}</p>
                    </div>
                  </div>
                  {/*Số tiền giao dịch và dropdown icon*/}
                  <div className="container-drop-down">
                    <p
                      className={item?.value > 0 ? "plus-money" : "minus-money"}
                    >
                      {item?.value === 0
                        ? ""
                        : money.slice(0, 1) === "-"
                        ? formatMoney(item?.value)
                        : "+" + formatMoney(item?.value)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/*Pagination*/}
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
      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default ActivityOrder;
