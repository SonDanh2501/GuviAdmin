import { Pagination } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getHistoryTransitionByCustomers } from "../../../../../api/customer";
import LoadingPagination from "../../../../../components/paginationLoading";
import { formatMoney } from "../../../../../helper/formatMoney";
import i18n from "../../../../../i18n";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import "./index.scss";

const HistoryTransition = ({ id }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getHistoryTransitionByCustomers(id, 0, 10)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [id]);

  const onChange = (page) => {
    setCurrentPage(page);
    setIsLoading(true);
    const dataLength = data.length < 20 ? 20 : data.length;
    const start = page * dataLength - dataLength;
    getHistoryTransitionByCustomers(id, start, 10)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <div className="div-list">
        {data?.map((item, index) => {
          const money = item?.value?.toString();

          return (
            <div className="div-item-list" key={index}>
              <div className="div-column-1">
                <p className="text-title">{item?.title?.[lang]}</p>
                <p
                  className={
                    money.slice(0, 1) === "-"
                      ? "text-money-deduction"
                      : "text-money-plus"
                  }
                >
                  {money.slice(0, 1) === "-"
                    ? formatMoney(item?.value)
                    : "+" + formatMoney(item?.value)}
                </p>
              </div>
              <p className="text-date-t">
                {moment(new Date(item?.date_create)).format(
                  "DD/MM/yyy - HH:mm"
                )}
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <p className="text-title-surplus">
                  {`${i18n.t("surplus", { lng: lang })}`}:{" "}
                  {item?.current_pay_point
                    ? formatMoney(item?.current_pay_point)
                    : formatMoney(0)}
                </p>
                <p className="text-surplus"></p>
                {item?.status_current_pay_point === "down" ? (
                  <i class="uil uil-arrow-down icon-deduction"></i>
                ) : item?.status_current_pay_point === "up" ? (
                  <i class="uil uil-arrow-up icon-plus"></i>
                ) : (
                  <></>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {data.length > 0 && (
        <div className="div-pagination-customer-history p-2">
          <p>
            {`${i18n.t("total", { lng: lang })}`}: {total}
          </p>
          <div>
            <Pagination
              current={currentPage}
              onChange={onChange}
              total={total}
              showSizeChanger={false}
              pageSize={10}
            />
          </div>
        </div>
      )}

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default HistoryTransition;
