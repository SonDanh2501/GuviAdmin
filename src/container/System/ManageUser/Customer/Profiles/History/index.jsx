import { List, Pagination } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { getHistoryTransitionByCustomers } from "../../../../../../api/customer";
import LoadingPagination from "../../../../../../components/paginationLoading";
import { formatMoney } from "../../../../../../helper/formatMoney";
import "./index.scss";

const HistoryTransition = ({ id }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

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
    const start = page * data.length - data.length;
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
                <a className="text-title">{item?.title?.vi}</a>
                <a
                  className={
                    money.slice(0, 1) === "-"
                      ? "text-money-deduction"
                      : "text-money-plus"
                  }
                >
                  {formatMoney(item?.value)}
                </a>
              </div>
              <a className="text-date">
                {moment(new Date(item?.date_create)).format(
                  "DD/MM/yyy - HH:mm"
                )}
              </a>
              <div>
                <a className="text-title-surplus">Số dư:</a>
                <a className="text-surplus"></a>
                {money.slice(0, 1) === "-" ? (
                  <i class="uil uil-arrow-down icon-deduction"></i>
                ) : (
                  <i class="uil uil-arrow-up icon-plus"></i>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {data.length > 0 && (
        <div className="div-pagination-customer-history p-2">
          <a>Tổng: {total}</a>
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
