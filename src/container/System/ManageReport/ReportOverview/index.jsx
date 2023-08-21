import moment from "moment";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getReportOrderByCity,
  getReportOrderDaily,
  getReportServiceByArea,
} from "../../../../api/report";
import CustomDatePicker from "../../../../components/customDatePicker";

import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import LoadingPagination from "../../../../components/paginationLoading";
import { formatMoney } from "../../../../helper/formatMoney";
import { number_processing } from "../../../../helper/numberProcessing";
import "./styles.scss";
import { Image } from "antd";

const ReportOverview = () => {
  const [startDate, setStartDate] = useState(
    moment().subtract(7, "day").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().toISOString());
  const [sameStartDate, setSameStartDate] = useState(
    moment(startDate).subtract(7, "day").toISOString()
  );
  const [sameEndDate, setSameEndDate] = useState(
    moment(endDate).subtract(7, "day").toISOString()
  );
  const [data, setData] = useState([]);
  const [dataSame, setDataSame] = useState([]);
  const [dataArea, setDataArea] = useState([]);
  const [dataAreaSame, setDataAreSame] = useState([]);
  const [totalNetIncomeArea, setTotalNetIncomeArea] = useState(0);
  const [totalNetIncomeSameArea, setTotalNetIncomeSameArea] = useState(0);
  const [totalNetIncome, setTotalNetIncome] = useState(0);
  const [totalNetIncomeSame, setTotalNetIncomeSame] = useState(0);
  const [totalGrossIncome, setTotalGrossIncome] = useState(0);
  const [totalGrossIncomeSame, setTotalGrossIncomeSame] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalOrderSame, setTotalOrderSame] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dataChartNetIncomeOrder = [];
  const dataChartGrossIncomeOrder = [];
  const dataChartTotalOrder = [];
  const dataChartAreaOrder = [];
  const navigate = useNavigate();

  useEffect(() => {
    getReportOrderDaily(0, 40, startDate, endDate, "date_work")
      .then((res) => {
        setData(res?.data);
        setTotalNetIncome(res?.total[0]?.total_net_income);
        setTotalOrder(res?.total[0]?.total_item);
        setTotalGrossIncome(res?.total[0]?.total_gross_income);
      })
      .catch((err) => {});

    getReportOrderDaily(0, 40, sameStartDate, sameEndDate, "date_work")
      .then((res) => {
        setDataSame(res?.data);
        setTotalNetIncomeSame(res?.total[0]?.total_net_income);
        setTotalOrderSame(res?.total[0]?.total_item);
        setTotalGrossIncomeSame(res?.total[0]?.total_gross_income);
      })
      .catch((err) => {});

    getReportOrderByCity(0, 65, startDate, endDate, 0)
      .then((res) => {
        setDataArea(res?.data);
        setTotalNetIncomeArea(res?.total[0]?.total_net_income);
      })
      .catch((err) => {});

    getReportOrderByCity(0, 65, sameStartDate, sameEndDate, 0)
      .then((res) => {
        setDataAreSame(res?.data);
        setTotalNetIncomeSameArea(res?.total[0]?.total_net_income);
      })
      .catch((err) => {});

    // getReportServiceByArea(startDate, endDate, "")
    //   .then((res) => {})
    //   .catch((err) => {});
    // getReportServiceByArea(sameStartDate, sameEndDate, "")
    //   .then((res) => {})
    //   .catch((err) => {});
  }, []);

  const onChangeDay = () => {
    setIsLoading(true);
    getReportOrderDaily(0, 40, startDate, endDate, "date_work")
      .then((res) => {
        setData(res?.data);
        setIsLoading(false);
        setTotalNetIncome(res?.total[0]?.total_net_income);
        setTotalOrder(res?.total[0]?.total_item);
        setTotalGrossIncome(res?.total[0]?.total_gross_income);
      })
      .catch((err) => {
        setIsLoading(false);
      });

    getReportOrderDaily(0, 40, sameStartDate, sameEndDate, "date_work")
      .then((res) => {
        setDataSame(res?.data);
        setIsLoading(false);
        setTotalNetIncomeSame(res?.total[0]?.total_net_income);
        setTotalOrderSame(res?.total[0]?.total_item);
        setTotalGrossIncomeSame(res?.total[0]?.total_gross_income);
      })
      .catch((err) => {
        setIsLoading(false);
      });
    getReportOrderByCity(0, 65, startDate, endDate, 0)
      .then((res) => {
        setDataArea(res?.data);
        setTotalNetIncomeArea(res?.total[0]?.total_net_income);
      })
      .catch((err) => {});

    getReportOrderByCity(0, 65, sameStartDate, sameEndDate, 0)
      .then((res) => {
        setDataAreSame(res?.data);
        setTotalNetIncomeSameArea(res?.total[0]?.total_net_income);
      })
      .catch((err) => {});

    // getReportServiceByArea(startDate, endDate, "")
    //   .then((res) => {})
    //   .catch((err) => {});
    // getReportServiceByArea(sameStartDate, sameEndDate, "")
    //   .then((res) => {})
    //   .catch((err) => {});
  };

  for (let i = 0; i < data.length; i++) {
    dataChartNetIncomeOrder.push({
      date: data[i]?._id?.slice(0, 5),
      date_same: dataSame[i]?._id?.slice(0, 5),
      net_income: data[i]?.total_net_income,
      net_income_same: dataSame[i]?.total_net_income,
    });

    dataChartGrossIncomeOrder.push({
      date: data[i]?._id?.slice(0, 5),
      date_same: dataSame[i]?._id?.slice(0, 5),
      gross_income: data[i]?.total_gross_income,
      gross_income_same: dataSame[i]?.total_gross_income,
    });

    dataChartTotalOrder.push({
      date: data[i]?._id?.slice(0, 5),
      date_same: dataSame[i]?._id?.slice(0, 5),
      total: data[i]?.total_item,
      total_same: dataSame[i]?.total_item,
    });
  }
  for (let i = 0; i < dataArea.length; i++) {
    if (dataArea[i]?._id === dataAreaSame[i]?._id) {
      dataChartAreaOrder.push({
        city: dataArea[i]?.city,
        total_item: dataArea[i]?.total_item,
        gross_income: dataArea[i]?.total_net_income,
        percent_gross_income:
          ((dataArea[i]?.total_net_income - dataAreaSame[i]?.total_net_income) /
            dataAreaSame[i]?.total_net_income) *
          100,
      });
    } else {
      dataChartAreaOrder.push({
        city: dataArea[i]?.city,
        total_item: dataArea[i]?.total_item,
        gross_income: dataArea[i]?.total_net_income,
        percent_gross_income: 100,
      });
    }
  }

  const renderTooltipContent = (o) => {
    const { payload, label } = o;
    return (
      <div className="div-content-chart-net-income">
        {payload[0]?.payload?.date && (
          <a className="text-content">
            {payload[0]?.payload?.date}:{" "}
            {formatMoney(payload[0]?.payload?.gross_income)}
          </a>
        )}

        {payload[0]?.payload?.date_same && (
          <a className="text-content-same">
            {payload[0]?.payload?.date_same}:{" "}
            {formatMoney(payload[0]?.payload?.gross_income_same)}
          </a>
        )}
      </div>
    );
  };
  const renderTooltipContentNetIncome = (o) => {
    const { payload, label } = o;

    return (
      <div className="div-content-chart-net-income">
        {payload[0]?.payload?.date && (
          <a className="text-content">
            {payload[0]?.payload?.date}:{" "}
            {formatMoney(payload[0]?.payload?.net_income)}
          </a>
        )}

        {payload[0]?.payload?.date_same && (
          <a className="text-content-same">
            {payload[0]?.payload?.date_same}:{" "}
            {formatMoney(payload[0]?.payload?.net_income_same)}
          </a>
        )}
      </div>
    );
  };

  const netIncomePercent =
    ((totalNetIncome - totalNetIncomeSame) / totalNetIncomeSame) * 100;
  const totalOrderPercent =
    ((totalOrder - totalOrderSame) / totalOrderSame) * 100;
  const grossIncomePercent =
    ((totalGrossIncome - totalGrossIncomeSame) / totalGrossIncomeSame) * 100;

  return (
    <div className="mt-2">
      <div className="div-date-report-overview ">
        <CustomDatePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setSameStart={setSameStartDate}
          setSameEnd={setSameEndDate}
          onClick={onChangeDay}
          onCancel={() => {}}
          defaults={true}
        />
        <div className="div-same">
          <a>
            Cùng kỳ: {moment(sameStartDate).utc().format("DD/MM/YYYY")}-
            {moment(sameEndDate).format("DD/MM/YYYY")}
          </a>
        </div>
      </div>

      <div className="div-chart-firt-overview">
        <div className="div-chart-gross-income">
          <a className="title-gross">Doanh số</a>

          <div className="div-total-gross">
            <a className="text-total-gross">
              {formatMoney(!totalGrossIncome ? 0 : totalGrossIncome)}
            </a>
            {grossIncomePercent < 0 ? (
              <a className="text-number-persent-down">
                <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
                {Math.abs(
                  isNaN(grossIncomePercent) ? 0 : grossIncomePercent
                ).toFixed(2)}
                %
              </a>
            ) : (
              <a className="text-number-persent-up">
                <CaretUpOutlined style={{ marginRight: 5 }} />
                {Number(
                  isNaN(grossIncomePercent) ? 0 : grossIncomePercent
                ).toFixed(2)}
                %
              </a>
            )}
            <a className="text-same">so với cùng kỳ</a>
          </div>
          <ResponsiveContainer height={350} width="100%">
            <LineChart
              width={500}
              height={300}
              data={dataChartGrossIncomeOrder}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-20}
                textAnchor="end"
                tick={{ fontSize: 10 }}
              />
              <YAxis
                dataKey="gross_income"
                tickFormatter={(tickItem) => number_processing(tickItem)}
                // domain={[0, 10000000]}
                // allowDataOverflow={true}
              />
              <Tooltip
                content={
                  dataChartGrossIncomeOrder.length > 0
                    ? renderTooltipContent
                    : ""
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="gross_income"
                stroke="#2962ff"
                name="Hiện tại"
              />
              <Line
                type="monotone"
                dataKey="gross_income_same"
                stroke="#82ca9d"
                strokeDasharray="3 4 5 2"
                name="Cùng kỳ"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="div-chart-gross-income">
          <a className="title-gross">Lượng đơn hàng</a>
          <div className="div-total-gross">
            <a className="text-total-gross">{!totalOrder ? 0 : totalOrder}</a>
            {totalOrderPercent < 0 ? (
              <a className="text-number-persent-down">
                <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
                {Math.abs(
                  isNaN(totalOrderPercent) ? 0 : totalOrderPercent
                ).toFixed(2)}
                %
              </a>
            ) : (
              <a className="text-number-persent-up">
                <CaretUpOutlined style={{ marginRight: 5 }} />
                {Number(
                  isNaN(totalOrderPercent) ? 0 : totalOrderPercent
                ).toFixed(2)}
                %
              </a>
            )}
            <a className="text-same">so với cùng kỳ</a>
          </div>
          <ResponsiveContainer height={350} width="100%">
            <LineChart
              width={500}
              height={300}
              data={dataChartTotalOrder}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-20}
                textAnchor="end"
                tick={{ fontSize: 10 }}
              />
              <YAxis
                dataKey="total"
                tickFormatter={(tickItem) => number_processing(tickItem)}
                // domain={[0, 50]}
                // allowDataOverflow={true}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#2962ff"
                name="Hiện tại"
              />
              <Line
                type="monotone"
                dataKey="total_same"
                stroke="#82ca9d"
                strokeDasharray="3 4 5 2"
                name="Cùng kỳ"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="div-chart-firt-overview mt-3">
        <div className="div-chart-gross-income">
          <a className="title-gross">Doanh thu thuần</a>
          <div className="div-total-gross">
            <a className="text-total-gross">
              {formatMoney(!totalNetIncome ? 0 : totalNetIncome)}
            </a>
            {netIncomePercent < 0 ? (
              <a className="text-number-persent-down">
                <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
                {Math.abs(
                  isNaN(netIncomePercent) ? 0 : netIncomePercent
                ).toFixed(2)}
                %
              </a>
            ) : (
              <a className="text-number-persent-up">
                <CaretUpOutlined style={{ marginRight: 5 }} />
                {Number(isNaN(netIncomePercent) ? 0 : netIncomePercent).toFixed(
                  2
                )}
                %
              </a>
            )}
            <a className="text-same">so với cùng kỳ</a>
          </div>
          <ResponsiveContainer height={350} width="100%">
            <LineChart
              width={500}
              height={300}
              data={dataChartNetIncomeOrder}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-20}
                textAnchor="end"
                tick={{ fontSize: 10 }}
              />
              <YAxis
                dataKey="net_income"
                tickFormatter={(tickItem) => number_processing(tickItem)}
                // domain={[0, 5000000]}
                // allowDataOverflow={true}
              />
              <Tooltip
                content={
                  dataChartNetIncomeOrder.length > 0
                    ? renderTooltipContentNetIncome
                    : ""
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="net_income"
                stroke="#2962ff"
                name="Hiện tại"
              />
              <Line
                type="monotone"
                dataKey="net_income_same"
                stroke="#82ca9d"
                strokeDasharray="3 4 5 2"
                name="Cùng kỳ"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="div-chart-gross-income-area">
          <div className="div-head-chart">
            <a className="title-gross">Doanh thu thuần - Theo khu vực</a>
            <div
              className="div-see-all"
              onClick={() =>
                navigate("/report/manage-report/report-order-area")
              }
            >
              <a className="text-all">Tất cả</a>
              <i className="uil uil-create-dashboard ml-2"></i>
            </div>
          </div>
          <div className="div-list-chart">
            {dataChartAreaOrder.slice(0, 5)?.map((item, index) => {
              return (
                <div key={index} className="div-item-chart">
                  <div className="div-name-area">
                    <a className="name-area">{item?.city}</a>
                    <a>{item?.total_item} đơn</a>
                  </div>
                  <div className="div-number-area">
                    <a className="money-area">
                      {formatMoney(item?.gross_income)}
                    </a>

                    {item?.percent_gross_income < 0 ? (
                      <a className="text-number-persent-down">
                        <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
                        {Math.abs(
                          isNaN(item?.percent_gross_income)
                            ? 0
                            : item?.percent_gross_income
                        ).toFixed(2)}
                        %
                      </a>
                    ) : (
                      <a className="text-number-persent-up">
                        <CaretUpOutlined style={{ marginRight: 5 }} />
                        {Number(
                          isNaN(item?.percent_gross_income)
                            ? 0
                            : item?.percent_gross_income
                        ).toFixed(2)}
                        %
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* <div className="div-chart-firt-overview mt-3">
        <div className="div-chart-gross-income-area">
          <div className="div-head-chart">
            <a className="title-gross">Top dịch vụ</a>
          </div>
          <div className="div-list-chart">
            {dataChartAreaOrder.slice(0, 5)?.map((item, index) => {
              return (
                <div key={index} className="div-item-chart">
                  <div className="div-name-service">
                    <Image preview={false} className="image-service" />
                    <a>Giúp việc</a>
                  </div>
                  <div className="div-number-area">
                    <a className="money-area">
                      {formatMoney(item?.gross_income)}
                    </a>

                    {item?.percent_gross_income < 0 ? (
                      <a className="text-number-persent-down">
                        <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
                        {Math.abs(
                          isNaN(item?.percent_gross_income)
                            ? 0
                            : item?.percent_gross_income
                        ).toFixed(2)}
                        %
                      </a>
                    ) : (
                      <a className="text-number-persent-up">
                        <CaretUpOutlined style={{ marginRight: 5 }} />
                        {Number(
                          isNaN(item?.percent_gross_income)
                            ? 0
                            : item?.percent_gross_income
                        ).toFixed(2)}
                        %
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div> */}

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default ReportOverview;

const data_test = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
