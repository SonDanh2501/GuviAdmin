import React, { useCallback, useEffect, useState } from "react";
import "./styles.scss";
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
import { getDistrictApi } from "../../../../api/file";
import moment from "moment";
import {
  getReportServiceByArea,
  getReportServiceDetails,
  getReportTypeService,
} from "../../../../api/report";
import { List, Select } from "antd";
import CustomDatePicker from "../../../../components/customDatePicker";
import LoadingPagination from "../../../../components/paginationLoading";

const ReportService = () => {
  const [startDate, setStartDate] = useState(
    moment().startOf("month").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState(false);
  const [codeCity, setCodeCity] = useState();
  const [nameCity, setNameCity] = useState("");
  const [dataCity, setDataCity] = useState([]);
  const [codeDistrict, setCodeDistrict] = useState(-1);
  const [dataChartPie, setDataChartPie] = useState([]);
  const [dataChartService, setDataChartService] = useState([]);
  const [totalService, setTotalService] = useState(0);
  const [dataChartServiceDetails, setDataChartServiceDetails] = useState([]);

  const cityData = [];
  const dataChartDetail = [];

  useEffect(() => {
    getDistrictApi()
      .then((res) => {
        setDataCity(res?.aministrative_division);
        setCodeCity(res?.aministrative_division[1]?.code);
        setNameCity(res?.aministrative_division[1]?.name);
        // getReportTypeService(
        //   startDate,
        //   endDate,
        //   res?.aministrative_division[1]?.code,
        //   codeDistrict
        // )
        //   .then((res) => {
        //     setDataChartPie(res);
        //     setIsLoading(false);
        //   })
        //   .catch((err) => {});

        getReportServiceByArea(
          startDate,
          endDate,
          res?.aministrative_division[1]?.code
        )
          .then((res) => {
            setDataChartService(res?.data);
            setTotalService(res?.totalOrder);
          })
          .catch((err) => {});

        getReportServiceDetails(
          startDate,
          endDate,
          res?.aministrative_division[1]?.code
        )
          .then((res) => {
            setDataChartServiceDetails(res?.detailData);
          })
          .catch((err) => {});
      })
      .catch((err) => {});
  }, []);

  dataCity?.map((item) => {
    cityData?.push({
      value: item?.code,
      label: item?.name,
    });
  });

  dataChartServiceDetails?.map((item) => {
    dataChartDetail?.push({
      title: item?.title[0]?.vi,
      percent_2_hour: item?.total_2_hour,
      percent_3_hour: item?.total_3_hour,
      percent_4_hour: item?.total_4_hour,
    });
  });

  const onChangeCity = useCallback(
    (value, label) => {
      setNameCity(label?.label);
      setCodeCity(value);
      // getReportTypeService(startDate, endDate, value, codeDistrict)
      //   .then((res) => {
      //     setDataChartPie(res);
      //   })
      //   .catch((err) => {});
      getReportServiceByArea(startDate, endDate, value)
        .then((res) => {
          setDataChartService(res?.data);
          setTotalService(res?.totalOrder);
        })
        .catch((err) => {});
    },
    [city, startDate, endDate, codeDistrict]
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

  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    name,
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
        {name === "2_hour" ? "2 Giờ" : name === "3_hour" ? "3 Giờ" : "4 Giờ"} (
        {value} {"%"})
      </text>
    );
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
        {title?.vi} ({percent} {"%"})
      </text>
    );
  };

  return (
    <>
      <div className="div-select-city">
        <Select
          style={{ width: 200, marginRight: 10 }}
          value={nameCity}
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
        />
        {startDate && (
          <a className="text-date mt-2">
            {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
            {moment(endDate).utc().format("DD/MM/YYYY")}
          </a>
        )}
      </div>

      <div className="mt-3 div-chart-bar-service">
        <a>Thống kê đơn hàng</a>
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
              name="2 Giờ"
              label={{ position: "top", fill: "black", fontSize: 14 }}
            />
            <Bar
              dataKey="percent_3_hour"
              fill="#82ca9d"
              barSize={40}
              minPointSize={10}
              name="3 Giờ"
              label={{ position: "top", fill: "black", fontSize: 14 }}
            />
            <Bar
              dataKey="percent_4_hour"
              fill="#0088FE"
              barSize={40}
              minPointSize={10}
              name="4 Giờ"
              label={{ position: "top", fill: "black", fontSize: 14 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="div-chart-pie-total">
        <a className="title-chart-area"> Thống kê đơn hàng theo dịch vụ</a>
        <div className="div-pie-chart">
          <div className="div-total-piechart">
            <div className="item-total">
              <a className="title-total">Tổng đơn</a>
              <a className="text-colon">:</a>
              <a className="number-total">{totalService}</a>
            </div>
            {dataChartService?.map((item, index) => {
              return (
                <div className="item-total">
                  <a className="title-total">{item?.title?.vi}</a>
                  <a className="text-colon">:</a>
                  <a className="number-total">{item?.total}</a>
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

      {isLoading && <LoadingPagination />}
    </>
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
