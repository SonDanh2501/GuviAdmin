import React, { useEffect, useState } from "react";
import DataTable from "../../../../../components/tables/dataTable";
import FilterData from "../../../../../components/filterData";
import CustomHeaderDatatable from "../../../../../components/tables/tableHeader";
import moment from "moment";
import icons from "../../../../../utils/icons";
import { formatMoney } from "../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../helper/toast";
import { getReportCashBookApi } from "../../../../../api/report";

const { IoReceipt, IoCash, IoTrendingUp, IoHappy } = icons;

const ReportCashBook = () => {
  /* ~~~ Value ~~~ */
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [start, setStart] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [previousStartDate, setPreviousStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [previousEndDate, setPreviousEndDate] = useState("");
  /* ~~~ List ~~~ */
  const [listData, setListData] = useState([]);
  const [listTotalStatistic, setListTotalStatistic] = useState([]);
  const columns = [
    {
      customTitle: <CustomHeaderDatatable title="STT" />,
      dataIndex: "",
      key: "ordinal",
      width: 50,
    },
    {
      customTitle: <CustomHeaderDatatable title="Ngày bắt đầu" />,
      dataIndex: "time_start_report",
      key: "date_create",
      width: 100,
      position: "center",
    },
    {
      customTitle: <CustomHeaderDatatable title="Ngày kết thúc" />,
      dataIndex: "time_end_report",
      key: "date_create",
      width: 100,
      position: "center",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng thu"
          subValue={listTotalStatistic?.total_income}
          typeSubValue="money"
        />
      ),
      dataIndex: "total_income",
      key: "money",
      width: 130,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng chi"
          subValue={listTotalStatistic?.total_expenses}
          typeSubValue="money"
        />
      ),
      dataIndex: "total_expenses",
      key: "money",
      width: 170,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng số giao dịch thu"
          subValue={listTotalStatistic?.total_income_transactions}
          typeSubValue="number"
        />
      ),
      dataIndex: "total_income_transactions",
      key: "number",
      width: 120,
      position: "center",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng số giao dịch chi"
          subValue={listTotalStatistic?.total_expenses_transactions}
          typeSubValue="number"
        />
      ),
      dataIndex: "total_expenses_transactions",
      key: "number",
      width: 150,
      position: "center",
    },
  ];
  /* ~~~ Handle function ~~~ */
  const fetchDataReportCashBook = async (payload) => {
    try {
      setIsLoading(true);
      const res = await getReportCashBookApi(
        payload.start,
        payload.lengthPage,
        payload.startDate,
        payload.endDate
      );
      setListData(res?.data);
      setTotal(res?.total);
      setListTotalStatistic(res?.totalItem[0]);
      setIsLoading(false);
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
    }
  };
  /* ~~~ Use effect ~~~ */
  useEffect(() => {
    fetchDataReportCashBook({ start, lengthPage, startDate, endDate });
  }, [start, lengthPage, start, endDate]);
  // 3. Tính toán thời gian của kỳ trước dựa trên kỳ hiện tại
  useEffect(() => {
    if (startDate !== "") {
      const timeStartDate = new Date(startDate).getTime();
      const timeEndDate = new Date(endDate).getTime();
      const rangeDate = timeEndDate - timeStartDate;
      const tempSameEndDate = timeStartDate - 1;
      const tempSameStartDate = tempSameEndDate - rangeDate;
      setPreviousStartDate(new Date(tempSameStartDate).toISOString());
      setPreviousEndDate(new Date(tempSameEndDate).toISOString());
    }
  }, [startDate, endDate]);
  /* ~~~ Other ~~~ */
  const rightContent = (
    startDate,
    endDate,
    previousStartDate,
    previousEndDate
  ) => {
    return (
      <div className="report-order-daily-revenue__previous-period">
        <div className="report-order-daily-revenue__previous-period-child">
          <span>Kỳ này&nbsp;</span>
          <div className="line"></div>
          <span className="report-order-daily-revenue__previous-period-child-value">
            {startDate}&nbsp;-&nbsp;{endDate}
          </span>
        </div>
        <div className="report-order-daily-revenue__previous-period-child">
          <span>Kỳ trước&nbsp;</span>
          <div className="line"></div>
          <span className="report-order-daily-revenue__previous-period-child-value">
            {previousStartDate}&nbsp;-&nbsp;{previousEndDate}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="report-order-daily-revenue">
      <div className="report-order-daily-revenue__header">
        <span className="report-order-daily-revenue__header--title">
          Báo cáo tổng thu chi
        </span>
        <div className="report-order-daily-revenue__header--total-statistic">
          <div className="report-order-daily-revenue__header--total-statistic-child card-shadow blue">
            <div className="line"></div>
            <div className="report-order-daily-revenue__header--total-statistic-child-icon">
              <span>
                <IoReceipt />
              </span>
            </div>
            <div className="report-order-daily-revenue__header--total-statistic-child-value">
              <span className="report-order-daily-revenue__header--total-statistic-child-value-title">
                Tổng thu
              </span>
              <span className="report-order-daily-revenue__header--total-statistic-child-value-numer">
                {formatMoney(listTotalStatistic?.total_income)}
              </span>
            </div>
          </div>
          <div className="report-order-daily-revenue__header--total-statistic-child card-shadow green">
            <div className="line"></div>
            <div className="report-order-daily-revenue__header--total-statistic-child-icon">
              <span>
                <IoTrendingUp />
              </span>
            </div>
            <div className="report-order-daily-revenue__header--total-statistic-child-value">
              <span className="report-order-daily-revenue__header--total-statistic-child-value-title">
                Tổng chi
              </span>
              <span className="report-order-daily-revenue__header--total-statistic-child-value-numer">
                {formatMoney(listTotalStatistic?.total_expenses)}
              </span>
            </div>
          </div>
          <div className="report-order-daily-revenue__header--total-statistic-child card-shadow yellow">
            <div className="line"></div>
            <div className="report-order-daily-revenue__header--total-statistic-child-icon">
              <span>
                <IoCash />
              </span>
            </div>
            <div className="report-order-daily-revenue__header--total-statistic-child-value">
              <span className="report-order-daily-revenue__header--total-statistic-child-value-title">
                Tổng số giao dịch thu
              </span>
              <span className="report-order-daily-revenue__header--total-statistic-child-value-numer">
                {listTotalStatistic?.total_income_transactions}&nbsp;giao dịch
              </span>
            </div>
          </div>
          <div className="report-order-daily-revenue__header--total-statistic-child card-shadow red">
            <div className="line"></div>
            <div className="report-order-daily-revenue__header--total-statistic-child-icon">
              <span>
                <IoHappy />
              </span>
            </div>
            <div className="report-order-daily-revenue__header--total-statistic-child-value">
              <span className="report-order-daily-revenue__header--total-statistic-child-value-title">
                Tổng số giao dịch chi
              </span>
              <span className="report-order-daily-revenue__header--total-statistic-child-value-numer">
                {listTotalStatistic?.total_expenses_transactions}&nbsp;giao dịch
              </span>
            </div>
          </div>
        </div>
        <div>
          <FilterData
            isTimeFilter={true}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            rightContent={rightContent(
              moment(startDate).format("DD/MM/YYYY"),
              moment(endDate).format("DD/MM/YYYY"),
              moment(previousStartDate).format("DD/MM/YYYY"),
              moment(previousEndDate).format("DD/MM/YYYY")
            )}
          />
        </div>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={listData}
          start={start}
          pageSize={lengthPage}
          setLengthPage={setLengthPage}
          totalItem={total}
          onCurrentPageChange={setStart}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default ReportCashBook;
