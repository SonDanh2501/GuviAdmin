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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingPagination from "../../../../components/paginationLoading";
import { formatMoney } from "../../../../helper/formatMoney";
import { number_processing } from "../../../../helper/numberProcessing";
import { getLanguageState } from "../../../../redux/selectors/auth";
import "./styles.scss";
import { Image, Select } from "antd";

const ReportOverview = () => {
  const lang = useSelector(getLanguageState);
  const [startDate, setStartDate] = useState(
    moment().subtract(1, "week").toISOString()
  );
  const [endDate, setEndDate] = useState(
    moment().subtract(1, "day").toISOString()
  );
  const [sameStartDate, setSameStartDate] = useState(
    moment(startDate).subtract(1, "week").toISOString()
  );
  const [sameEndDate, setSameEndDate] = useState(
    moment(endDate).subtract(1, "week").toISOString()
  );
  const [data, setData] = useState([]);
  const [dataSame, setDataSame] = useState([]);
  const [dataArea, setDataArea] = useState([]);
  const [dataAreaSame, setDataAreSame] = useState([]);
  const [dataService, setDataService] = useState([]);
  const [dataServiceSame, setDataServiceSame] = useState([]);
  const [typePriceService, setTypePriceService] = useState("income");
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
  const dataChartSerive = [];
  const navigate = useNavigate();

  useEffect(() => {
    getReportOrderDaily(
      0,
      40,
      moment().subtract(1, "week").toISOString(),
      moment().subtract(1, "day").toISOString(),
      "date_work"
    )
      .then((res) => {
        setData(res?.data);
        setTotalNetIncome(res?.total[0]?.total_net_income);
        setTotalOrder(res?.total[0]?.total_item);
        setTotalGrossIncome(res?.total[0]?.total_gross_income);
      })
      .catch((err) => {});

    getReportOrderDaily(
      0,
      40,
      moment(moment().subtract(1, "week").toISOString())
        .subtract(1, "week")
        .toISOString(),
      moment(moment().subtract(1, "day").toISOString())
        .subtract(1, "week")
        .toISOString(),
      "date_work"
    )
      .then((res) => {
        setDataSame(res?.data);
        setTotalNetIncomeSame(res?.total[0]?.total_net_income);
        setTotalOrderSame(res?.total[0]?.total_item);
        setTotalGrossIncomeSame(res?.total[0]?.total_gross_income);
      })
      .catch((err) => {});

    getReportOrderByCity(
      0,
      20,
      moment().subtract(1, "week").toISOString(),
      moment().subtract(1, "day").toISOString(),
      0
    )
      .then((res) => {
        setDataArea(res?.data);
      })
      .catch((err) => {});

    getReportOrderByCity(
      0,
      20,
      moment(moment().subtract(1, "week").toISOString())
        .subtract(1, "week")
        .toISOString(),
      moment(moment().subtract(1, "day").toISOString())
        .subtract(1, "week")
        .toISOString(),
      0
    )
      .then((res) => {
        setDataAreSame(res?.data);
      })
      .catch((err) => {});

    getReportServiceByArea(
      moment().subtract(1, "week").toISOString(),
      moment().subtract(1, "day").toISOString(),
      ""
    )
      .then((res) => {
        setDataService(res?.data);
      })
      .catch((err) => {});
    getReportServiceByArea(
      moment(moment().subtract(1, "week").toISOString())
        .subtract(1, "week")
        .toISOString(),
      moment(moment().subtract(1, "day").toISOString())
        .subtract(1, "week")
        .toISOString(),
      ""
    )
      .then((res) => {
        setDataServiceSame(res?.data);
      })
      .catch((err) => {});
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
    getReportOrderByCity(0, 20, startDate, endDate, 0)
      .then((res) => {
        setDataArea(res?.data);
      })
      .catch((err) => {});

    getReportOrderByCity(0, 20, sameStartDate, sameEndDate, 0)
      .then((res) => {
        setDataAreSame(res?.data);
      })
      .catch((err) => {});

    getReportServiceByArea(startDate, endDate, "")
      .then((res) => {
        setDataService(res?.data);
      })
      .catch((err) => {});
    getReportServiceByArea(sameStartDate, sameEndDate, "")
      .then((res) => {
        setDataServiceSame(res?.data);
      })
      .catch((err) => {});
  };

  const percentSame = (a, b) => {
    return ((a - b) / b) * 100;
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

  if (dataArea.length === dataAreaSame.length) {
    for (const element of dataArea) {
      for (const element2 of dataAreaSame) {
        if (element2?._id === element?._id) {
          dataChartAreaOrder.push({
            city: element?.city,
            total_item: element?.total_item,
            net_income: element?.total_net_income,
            percent_net_income: percentSame(
              element?.total_net_income,
              element2?.total_net_income
            ),
          });
        }
      }
    }
  } else {
    const objectsAreEqual = (obj1, obj2) => {
      return obj1?._id === obj2?._id;
    };

    const filteredArray = dataArea.filter((obj1) => {
      const objInArray2 = dataAreaSame.some((obj2) =>
        objectsAreEqual(obj1, obj2)
      );
      return !objInArray2;
    });

    filteredArray?.map((item) => {
      return dataChartAreaOrder.push({
        city: item?.city,
        total_item: item?.total_item,
        net_income: item?.total_net_income,
        percent_net_income: 100,
      });
    });

    for (const element of dataArea) {
      for (const element2 of dataAreaSame) {
        if (element2?._id === element?._id) {
          dataChartAreaOrder.push({
            city: element?.city,
            total_item: element?.total_item,
            net_income: element?.total_net_income,
            percent_net_income: percentSame(
              element?.total_net_income,
              element2?.total_net_income
            ),
          });
        }
      }
    }
  }

  for (let i = 0; i < dataService.length; i++) {
    if (dataService[i]?._id === dataServiceSame[i]?._id) {
      dataChartSerive.push({
        name: dataService[i]?.title,
        income: dataService[i]?.total_income,
        percent_income:
          ((dataService[i]?.total_income - dataServiceSame[i]?.total_income) /
            dataServiceSame[i]?.total_income) *
          100,
        net_income: dataService[i]?.total_net_income,
        percent_net_income:
          ((dataService[i]?.total_net_income -
            dataServiceSame[i]?.total_net_income) /
            dataServiceSame[i]?.total_net_income) *
          100,
        thumbnail: dataService[i]?.thumbnail,
      });
    } else {
      dataChartSerive.push({
        name: dataService[i]?.title,
        income: dataService[i]?.total_income,
        percent_income: 100,
        net_income: dataService[i]?.total_net_income,
        percent_net_income: 100,
        thumbnail: dataService[i]?.thumbnail,
      });
    }
  }

  // const renderTooltipContent = (o) => {
  //   const { payload } = o;
  //   return (
  //     <div className="div-content-chart-net-income">
  //       {payload[0]?.payload?.date && (
  //         <p className="text-content">
  //           {payload[0]?.payload?.date}:{" "}
  //           {formatMoney(payload[0]?.payload?.gross_income)}
  //         </p>
  //       )}

  //       {payload[0]?.payload?.date_same && (
  //         <p className="text-content-same">
  //           {payload[0]?.payload?.date_same}:{" "}
  //           {formatMoney(payload[0]?.payload?.gross_income_same)}
  //         </p>
  //       )}
  //     </div>
  //   );
  // };
  // const renderTooltipContentNetIncome = (o) => {
  //   const { payload } = o;

  //   return (
  //     <div className="div-content-chart-net-income">
  //       {payload[0]?.payload?.date && (
  //         <p className="text-content">
  //           {payload[0]?.payload?.date}:{" "}
  //           {formatMoney(payload[0]?.payload?.net_income)}
  //         </p>
  //       )}

  //       {payload[0]?.payload?.date_same && (
  //         <p className="text-content-same">
  //           {payload[0]?.payload?.date_same}:{" "}
  //           {formatMoney(payload[0]?.payload?.net_income_same)}
  //         </p>
  //       )}
  //     </div>
  //   );
  // };

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
          <p className="m-0">
            Cùng kỳ: {moment(sameStartDate).utc().format("DD/MM/YYYY")}-
            {moment(sameEndDate).format("DD/MM/YYYY")}
          </p>
        </div>
      </div>

      <div className="div-chart-firt-overview">
        <div className="div-chart-gross-income">
          <p className="title-gross">Doanh số</p>

          <div className="div-total-gross">
            <p className="text-total-gross">
              {formatMoney(!totalGrossIncome ? 0 : totalGrossIncome)}
            </p>
            {grossIncomePercent < 0 ? (
              <p className="text-number-persent-down">
                <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
                {Math.abs(
                  isNaN(grossIncomePercent) ? 0 : grossIncomePercent
                ).toFixed(2)}
                %
              </p>
            ) : (
              <p className="text-number-persent-up">
                <CaretUpOutlined style={{ marginRight: 5 }} />
                {Number(
                  isNaN(grossIncomePercent) ? 0 : grossIncomePercent
                ).toFixed(2)}
                %
              </p>
            )}
            <p className="text-same">so với cùng kỳ</p>
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
              // content={
              //   dataChartGrossIncomeOrder?.length > 0
              //     ? renderTooltipContent
              //     : ""
              // }
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
          <p className="title-gross">Lượng đơn hàng</p>
          <div className="div-total-gross">
            <p className="text-total-gross">{!totalOrder ? 0 : totalOrder}</p>
            {totalOrderPercent < 0 ? (
              <p className="text-number-persent-down">
                <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
                {Math.abs(
                  isNaN(totalOrderPercent) ? 0 : totalOrderPercent
                ).toFixed(2)}
                %
              </p>
            ) : (
              <p className="text-number-persent-up">
                <CaretUpOutlined style={{ marginRight: 5 }} />
                {Number(
                  isNaN(totalOrderPercent) ? 0 : totalOrderPercent
                ).toFixed(2)}
                %
              </p>
            )}
            <p className="text-same">so với cùng kỳ</p>
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
          <p className="title-gross">Doanh thu thuần</p>
          <div className="div-total-gross">
            <p className="text-total-gross">
              {formatMoney(!totalNetIncome ? 0 : totalNetIncome)}
            </p>
            {netIncomePercent < 0 ? (
              <p className="text-number-persent-down">
                <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
                {Math.abs(
                  isNaN(netIncomePercent) ? 0 : netIncomePercent
                ).toFixed(2)}
                %
              </p>
            ) : (
              <p className="text-number-persent-up">
                <CaretUpOutlined style={{ marginRight: 5 }} />
                {Number(isNaN(netIncomePercent) ? 0 : netIncomePercent).toFixed(
                  2
                )}
                %
              </p>
            )}
            <p className="text-same">so với cùng kỳ</p>
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
              // content={
              //   dataChartNetIncomeOrder?.length > 0
              //     ? renderTooltipContentNetIncome
              //     : ""
              // }
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
            <p className="title-gross">Doanh thu thuần - Theo khu vực</p>
            <div
              className="div-see-all"
              onClick={() =>
                navigate("/report/manage-report/report-order-area")
              }
            >
              <p className="text-all">Tất cả</p>
              <i className="uil uil-create-dashboard ml-2"></i>
            </div>
          </div>
          <div className="div-list-chart">
            {dataChartAreaOrder?.slice(0, 5)?.map((item, index) => {
              return (
                <div key={index} className="div-item-chart">
                  <div className="div-name-area">
                    <p className="name-area">{item?.city}</p>
                    <p className="m-0">{item?.total_item} đơn</p>
                  </div>
                  <div className="div-number-area">
                    <p className="money-area">
                      {formatMoney(item?.net_income)}
                    </p>

                    {item?.percent_net_income < 0 ? (
                      <p className="text-number-persent-down">
                        <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
                        {Math.abs(
                          isNaN(item?.percent_net_income)
                            ? 0
                            : item?.percent_net_income
                        ).toFixed(2)}
                        %
                      </p>
                    ) : (
                      <p className="text-number-persent-up">
                        <CaretUpOutlined style={{ marginRight: 5 }} />
                        {Number(
                          isNaN(item?.percent_net_income)
                            ? 0
                            : item?.percent_net_income
                        ).toFixed(2)}
                        %
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="div-chart-firt-overview mt-3">
        <div className="div-chart-gross-income-area">
          <div className="div-head-chart">
            <p className="title-gross">Top dịch vụ</p>
            <div>
              <Select
                value={typePriceService}
                style={{ width: 150 }}
                bordered={false}
                onChange={(e) => setTypePriceService(e)}
                options={[
                  { value: "income", label: "Doanh thu" },
                  { value: "net_income", label: "Doanh thu thuần" },
                ]}
              />
            </div>
          </div>
          <div className="div-list-chart">
            {dataChartSerive.slice(0, 5)?.map((item, index) => {
              return (
                <div key={index} className="div-item-chart">
                  <div className="div-name-service">
                    <Image
                      preview={false}
                      className="image-service"
                      src={item?.thumbnail}
                    />
                    <p className="name-service">{item?.name[lang]}</p>
                  </div>
                  <div className="div-number-area">
                    <p className="money-area">
                      {typePriceService === "income"
                        ? formatMoney(item?.income)
                        : formatMoney(item?.net_income)}
                    </p>
                    {typePriceService === "income" ? (
                      <>
                        {item?.percent_income < 0 ? (
                          <p className="text-number-persent-down">
                            <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
                            {Math.abs(
                              isNaN(item?.percent_income)
                                ? 0
                                : item?.percent_income
                            ).toFixed(2)}
                            %
                          </p>
                        ) : (
                          <p className="text-number-persent-up">
                            <CaretUpOutlined style={{ marginRight: 5 }} />
                            {Number(
                              isNaN(item?.percent_income)
                                ? 0
                                : item?.percent_income
                            ).toFixed(2)}
                            %
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        {item?.percent_net_income < 0 ? (
                          <p className="text-number-persent-down">
                            <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
                            {Math.abs(
                              isNaN(item?.percent_net_income)
                                ? 0
                                : item?.percent_net_income
                            ).toFixed(2)}
                            %
                          </p>
                        ) : (
                          <p className="text-number-persent-up">
                            <CaretUpOutlined style={{ marginRight: 5 }} />
                            {Number(
                              isNaN(item?.percent_net_income)
                                ? 0
                                : item?.percent_net_income
                            ).toFixed(2)}
                            %
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default ReportOverview;
