import React, { useEffect, useState } from "react";
import DataTable from "../../../../../components/tables/dataTable";
import FilterData from "../../../../../components/filterData";
import CustomHeaderDatatable from "../../../../../components/tables/tableHeader";
import moment from "moment";
import icons from "../../../../../utils/icons";
import { formatMoney } from "../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../helper/toast";
import { getDetailReportCashBookApi, getReportDetailOrderActivityApi } from "../../../../../api/report";
import { useLocation } from "react-router-dom";

const { IoReceipt, IoCash, IoTrendingUp, IoHappy } = icons;

const ReportDetailOrderActivity = () =>  {
    const { state } = useLocation();
    const date = state?.date;
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
          customTitle: <CustomHeaderDatatable title="Ngày tạo" />,
          dataIndex: "_id",
          key: "id_date_work",
          width: 100,
          position: "center",
          navigate: "/report/manage-report/report-detail-revenue",
        },
        {
          customTitle: (
            <CustomHeaderDatatable
              title="Số đơn hàng"
              subValue={listTotalStatistic?.total_item}
              typeSubValue="number"
            />
          ),
          dataIndex: "total_orders_created",
          key: "number",
          width: 130,
          position: "center",
        },
        {
          customTitle: (
            <CustomHeaderDatatable
              title="Tổng giá trị giao dịch dự kiến"
              typeSubValue="money"
              textToolTip="GMV - Gross Merchandise Volume"
              subValue={listTotalStatistic?.total_fee}
            />
          ),
          dataIndex: "total_gmv_done",
          key: "money",
          width: 210,
        },
        {
          customTitle: (
            <CustomHeaderDatatable
              title="Thu hộ dịch vụ dự kiến"
              subValue={listTotalStatistic?.total_net_income_new}
              typeSubValue="money"
              textToolTip="Bao gồm phí dịch vụ trả đối tác: tiền tip từ khách,..."
            />
          ),
          dataIndex: "total_service_collection_amount_done",
          key: "money",
          width: 200,
        },
        {
          customTitle: (
            <CustomHeaderDatatable
              title="Tiền hoàn lại"
              subValue={listTotalStatistic?.total_net_income_new}
              typeSubValue="money"
              textToolTip="Chưa có"
            />
          ),
          dataIndex: "total_net_income_new",
          key: "money",
          width: 150,
        },
        // {
        //   customTitle: (
        //     <CustomHeaderDatatable
        //       title="Doanh thu dự kiến"
        //       subValue={
        //         listTotalStatistic?.total_fee -
        //           listTotalStatistic?.total_net_income_new || null
        //       }
        //       typeSubValue="money"
        //       textToolTip="Doanh thu = Tổng giá trị giao dịch (-) Thu hộ dịch vụ"
        //     />
        //   ),
        //   dataIndex: "total_revenue_done",
        //   key: "money",
        //   width: 120,
        // },
        {
          customTitle: (
            <CustomHeaderDatatable
              title="Giảm giá"
              subValue={listTotalStatistic?.total_discount_new || null}
              typeSubValue="money"
              textToolTip="Tổng số tiền giảm giá từ: giảm giá dịch vụ, giảm giá đơn hàng, đồng giá, ctkm,…"
            />
          ),
          dataIndex: "total_discount_done",
          key: "money",
          width: 100,
        },
        {
          customTitle: (
            <CustomHeaderDatatable
              title="Doanh thu thuần dự kiến"
              subValue={
                listTotalStatistic?.total_fee -
                  listTotalStatistic?.total_net_income_new -
                  listTotalStatistic?.total_discount_new || null
              }
              typeSubValue="money"
              textToolTip="Số tiền thu được sau khi trừ toàn bộ các giảm giá. Doanh thu thuần = Doanh thu (-) Giảm giá."
            />
          ),
          dataIndex: "net_revenue",
          key: "money",
          width: 200,
        },
        {
          customTitle: (
            <CustomHeaderDatatable
              title="Tổng hóa đơn dự kiến"
              subValue={
                listTotalStatistic?.total_fee -
                  listTotalStatistic?.total_discount_new || null
              }
              typeSubValue="money"
              textToolTip="Tổng số tiền ghi nhận trên hoá đơn dịch vụ. Tổng hoá đơn = Tổng tiền - giảm giá."
            />
          ),
          dataIndex: "invoice",
          key: "money",
          width: 170,
        },
        {
          customTitle: (
            <CustomHeaderDatatable
              title="Giá vốn"
              // subValue={0}
              typeSubValue="number"
            />
          ),
          dataIndex: "punishss",
          key: "money",
          width: 100,
        },
        {
          customTitle: (
            <CustomHeaderDatatable
              title="Phí áp dụng"
              subValue={listTotalStatistic?.total_service_fee}
              typeSubValue="money"
            />
          ),
          dataIndex: "total_service_fee",
          key: "money",
          width: 100,
        },
        {
          customTitle: (
            <CustomHeaderDatatable
              title="Thuế"
              subValue={listTotalStatistic?.total_tax}
              typeSubValue="money"
            />
          ),
          dataIndex: "total_tax",
          key: "money",
          width: 100,
        },
        {
          customTitle: (
            <CustomHeaderDatatable
              title="Tổng lợi nhuận"
              subValue={
                listTotalStatistic?.total_fee -
                  listTotalStatistic?.total_net_income_new -
                  listTotalStatistic?.total_discount_new || null
              }
              typeSubValue="money"
              textToolTip="Tổng lợi nhuận = Doanh thu thuần (+) thu nhập khác"
            />
          ),
          dataIndex: "net_revenue",
          key: "money",
          width: 150,
        },
    
        {
          customTitle: (
            <CustomHeaderDatatable
              title="Lợi nhuận sau thuế"
              subValue={
                listTotalStatistic?.total_fee -
                  listTotalStatistic?.total_net_income_new -
                  listTotalStatistic?.total_discount_new -
                  listTotalStatistic?.total_tax || null
              }
              typeSubValue="money"
              textToolTip="Lợi nhuận sau thuế = Tổng lợi nhuận (-) Thuế"
            />
          ),
          dataIndex: "profit_after_tax",
          key: "money",
          width: 170,
        },
        {
          customTitle: (
            <CustomHeaderDatatable
              title="% Lợi nhuận"
              typeSubValue="percent"
              textToolTip="% Lợi nhuận = Lời nhuận sau thuế (/) Tổng lời nhuận"
            />
          ),
          dataIndex: "percent_income_envenue",
          key: "percent",
          width: 120,
          position: "center",
        },
      ];
    /* ~~~ Handle function ~~~ */
    const fetchDataReportDetailOrderActivity = async (payload) => {
      try {
        setIsLoading(true);
        const res = await getReportDetailOrderActivityApi(
          payload.start,
          payload.lengthPage,
          payload.startDate,
          payload.endDate
        );
        console.log("check res >>>", res);
        // setListData(res?.data);
        // setTotal(res?.total);
        // setListTotalStatistic(res?.totalItem[0]);
        setIsLoading(false);
      } catch (err) {
        errorNotify({
          message: err?.message || err,
        });
      }
    };
    /* ~~~ Use effect ~~~ */
    // 1. Fetch giá trị bảng
    useEffect(() => {
      fetchDataReportDetailOrderActivity({ start, lengthPage, startDate, endDate });
    }, [start, lengthPage, start, endDate]);
    // 2. Tính toán thời gian của kỳ trước dựa trên kỳ hiện tại
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
    // 3. Gán giá trị date cho startDate và endDate
    useEffect(() => {
      if (date) {
        const timer = setTimeout(() => {
          setStartDate(moment(date, "DD-MM-YYYY").startOf("date").toISOString());
          setEndDate(moment(date, "DD-MM-YYYY").endOf("date").toISOString());
        }, 300);
        return () => clearTimeout(timer);
      }
    }, []);
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
            Báo cáo chi tiết hoạt động đơn hàng
          </span>
          {/* <div className="report-order-daily-revenue__header--total-statistic">
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
                  {listTotalStatistic?.total_expenses_transactions}&nbsp;giao
                  dịch
                </span>
              </div>
            </div>
          </div> */}
          <div>
            <FilterData
              isTimeFilter={true}
              startDate={startDate}
              endDate={endDate}
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
  
export default ReportDetailOrderActivity