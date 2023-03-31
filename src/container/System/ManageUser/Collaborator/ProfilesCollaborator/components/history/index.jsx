import { List, Pagination } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getCollaboratorRemainder,
  getHistoryActivityCollaborator,
  getHistoryCollaborator,
  getHistoryCollaboratorRemainder,
} from "../../../../../../../api/collaborator";
import { formatMoney } from "../../../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../../../helper/toast";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import "./index.scss";

const History = ({ id }) => {
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [remainder, setRemainder] = useState(0);
  const [giftRemainder, setGiftRemainder] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getHistoryCollaboratorRemainder(id, 0, 10)
      .then((res) => {
        setData(res.data);
        setTotalData(res.totalItem);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });

    getCollaboratorRemainder(id)
      .then((res) => {
        setRemainder(res?.remainder);
        setGiftRemainder(res?.gift_remainder);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id]);

  const onChange = (page) => {
    setCurrentPage(page);
    const start = page * data.length - data.length;
    getHistoryCollaboratorRemainder(id, start, 10)
      .then((res) => {
        setData(res.data);
        setTotalData(res.totalItem);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="div-monney">
        <div>
          <a className="text-title-monney">Ví CTV:</a>
          <a className="text-monney"> {formatMoney(remainder)}</a>
        </div>
        <div>
          <a className="text-title-monney">Ví thưởng: </a>
          <a className="text-monney">{formatMoney(giftRemainder)}</a>
        </div>
      </div>
      <div className="div-list-collaborator mt-3">
        {data?.map((item, index) => {
          const money = item?.value?.toString();
          return (
            <div className="div-item-list" key={index}>
              <div className="div-column-1">
                <a className="text-title">
                  {item?.title?.vi}{" "}
                  <a>{item?.id_order && item?.id_order?.id_view}</a>
                </a>
                <a
                  className={
                    money?.slice(0, 1) === "-"
                      ? "text-money-deduction"
                      : "text-money-plus"
                  }
                >
                  {money?.slice(0, 1) === "-"
                    ? formatMoney(item?.value)
                    : "+" + formatMoney(item?.value)}
                </a>
              </div>
              <a className="text-date">
                {moment(new Date(item?.date_create)).format(
                  "DD/MM/yyy - HH:mm"
                )}
              </a>
              <div>
                <a className="text-title-surplus">
                  Ví CTV:{" "}
                  {item?.current_remainder
                    ? formatMoney(item?.current_remainder)
                    : formatMoney(0)}
                </a>
                <a className="text-surplus"></a>
                {item?.status_current_remainder === "down" ? (
                  <i class="uil uil-arrow-down icon-deduction"></i>
                ) : item?.status_current_remainder === "up" ? (
                  <i class="uil uil-arrow-up icon-plus"></i>
                ) : (
                  <></>
                )}
              </div>
              <div>
                <a className="text-title-surplus">
                  Ví thưởng:{" "}
                  {item?.current_gift_remainder
                    ? formatMoney(item?.current_gift_remainder)
                    : formatMoney(0)}
                </a>
                <a className="text-surplus"></a>
                {item?.status_current_gift_remainder === "down" ? (
                  <i class="uil uil-arrow-down icon-deduction"></i>
                ) : item?.status_current_remainder === "up" ? (
                  <i class="uil uil-arrow-up icon-plus"></i>
                ) : (
                  <></>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="div-pagination p-2">
        <a>Tổng: {totalData}</a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={totalData}
            showSizeChanger={false}
            pageSize={10}
          />
        </div>
      </div>
    </>
  );
};

export default memo(History);
