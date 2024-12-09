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
import HistoryActivity from "../../../../../components/historyActivity";

const HistoryTransition = ({ id }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getHistoryTransitionByCustomers(id, 0, 10)
      .then((res) => {
        console.log("check res", res);
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
    const dataLength = data.length < 10 ? 10 : data.length;
    const start = page * dataLength - dataLength;
    // const dataLength = 20;
    // const start = page * dataLength - dataLength;
    console.log("check start", start);
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
        <HistoryActivity data={data} />
      </div>
      {/*Pagination */}
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
