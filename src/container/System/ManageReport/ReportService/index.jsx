import { Select } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getReportServiceByArea,
  getReportServiceDetails,
} from "../../../../api/report";
import CustomDatePicker from "../../../../components/customDatePicker";
import i18n from "../../../../i18n";
import { getLanguageState } from "../../../../redux/selectors/auth";
import { getProvince } from "../../../../redux/selectors/service";
import "./styles.scss";

const ReportService = () => {
  const [startDate, setStartDate] = useState(
    moment().subtract(30, "d").startOf("date").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const [codeCity, setCodeCity] = useState("");
  const [dataChartService, setDataChartService] = useState([]);
  const [totalService, setTotalService] = useState(0);
  const [dataChartServiceDetails, setDataChartServiceDetails] = useState([]);
  const lang = useSelector(getLanguageState);
  const cityData = [
    {
      value: "",
      label: "Tất cả",
    },
  ];
  const dataChartDetail = [];
  const province = useSelector(getProvince);

  useEffect(() => {
    getReportServiceByArea(
      moment().subtract(30, "d").startOf("date").toISOString(),
      moment().endOf("date").toISOString(),
      ""
    )
      .then((res) => {
        setDataChartService(res?.data);
        setTotalService(res?.totalOrder);
      })
      .catch((err) => {});

    getReportServiceDetails(
      moment().subtract(30, "d").startOf("date").toISOString(),
      moment().endOf("date").toISOString(),
      ""
    )
      .then((res) => {
        setDataChartServiceDetails(res?.detailData);
      })
      .catch((err) => {});
  }, []);

  province?.map((item) => {
    return cityData?.push({
      value: item?.code,
      label: item?.name,
    });
  });

  dataChartServiceDetails?.map((item) => {
    return dataChartDetail?.push({
      title: item?.title[0]?.[lang],
      percent_2_hour: item?.total_2_hour,
      percent_3_hour: item?.total_3_hour,
      percent_4_hour: item?.total_4_hour,
    });
  });

  const onChangeCity = useCallback(
    (value, label) => {
      setCodeCity(value);
      getReportServiceDetails(startDate, endDate, value)
        .then((res) => {
          setDataChartServiceDetails(res?.detailData);
        })
        .catch((err) => {});

      getReportServiceByArea(startDate, endDate, value)
        .then((res) => {
          setDataChartService(res?.data);
          setTotalService(res?.totalOrder);
        })
        .catch((err) => {});
    },
    [startDate, endDate]
  );

  const onChangeDay = () => {
    getReportServiceDetails(startDate, endDate, codeCity)
      .then((res) => {
        setDataChartServiceDetails(res?.detailData);
      })
      .catch((err) => {});

    getReportServiceByArea(startDate, endDate, codeCity)
      .then((res) => {
        setDataChartService(res?.data);
        setTotalService(res?.totalOrder);
      })
      .catch((err) => {});
  };
  const renderLabelService = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    title,
  }) => {
    const RADIAN = Math.PI / 180;
    // eslint-disable-next-line
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    // eslint-disable-next-line
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    // eslint-disable-next-line
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#000000"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {title?.[lang]} ({percent} {"%"})
      </text>
    );
  };

  console.log(codeCity);

  return (
    <div className="mt-4">
      <div className="div-select-city">
        <Select
          style={{ width: 200, marginRight: 10 }}
          value={codeCity}
          onChange={onChangeCity}
          options={cityData}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />

        <CustomDatePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onClick={onChangeDay}
          onCancel={() => {}}
          setSameStart={() => {}}
          setSameEnd={() => {}}
        />
        {startDate && (
          <div className="ml-2">
            <p className="text-date mt-2 m-0">
              {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
              {moment(endDate).utc().format("DD/MM/YYYY")}
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 div-chart-bar-service">
        <p className="m-0">{`${i18n.t("order_statistics", { lng: lang })}`}</p>
        <ResponsiveContainer width={"100%"} height={350} min-width={350}>
          <BarChart
            width={500}
            height={300}
            data={dataChartDetail}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="percent_2_hour"
              fill="#8884d8"
              barSize={40}
              minPointSize={10}
              name={`2 ${i18n.t("hour", { lng: lang })}`}
              label={{ position: "top", fill: "black", fontSize: 14 }}
            />
            <Bar
              dataKey="percent_3_hour"
              fill="#82ca9d"
              barSize={40}
              minPointSize={10}
              name={`3 ${i18n.t("hour", { lng: lang })}`}
              label={{ position: "top", fill: "black", fontSize: 14 }}
            />
            <Bar
              dataKey="percent_4_hour"
              fill="#0088FE"
              barSize={40}
              minPointSize={10}
              name={`4 ${i18n.t("hour", { lng: lang })}`}
              label={{ position: "top", fill: "black", fontSize: 14 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="div-chart-pie-total">
        <p className="title-chart-area m-0">{`${i18n.t(
          "order_statistics_service",
          {
            lng: lang,
          }
        )}`}</p>
        <div className="div-pie-chart">
          <div className="div-total-piechart">
            <div className="item-total">
              <p className="title-total">{`${i18n.t("total_order", {
                lng: lang,
              })}`}</p>
              <p className="text-colon">:</p>
              <p className="number-total">{totalService}</p>
            </div>
            {dataChartService?.map((item, index) => {
              return (
                <div className="item-total">
                  <p className="title-total">{item?.title?.[lang]}</p>
                  <p className="text-colon">:</p>
                  <p className="number-total">{item?.total}</p>
                </div>
              );
            })}
          </div>

          <div className="div-pie">
            <ResponsiveContainer height={300} min-width={500}>
              <PieChart height={250}>
                <Pie
                  data={dataChartService}
                  cx="50%"
                  cy="140"
                  outerRadius={80}
                  dataKey="percent"
                  label={renderLabelService}
                >
                  {dataChartService?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportService;

const COLORS = [
  "#38BDF8",
  "#0EA5E9",
  "#0088FE",
  "#6EE7B7",
  "#34D399",
  "#00CF3A",
];
