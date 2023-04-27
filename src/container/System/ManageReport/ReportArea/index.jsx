import React, { useCallback, useEffect, useState } from "react";
import "./areaReport.scss";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { getDistrictApi } from "../../../../api/file";
import moment from "moment";
import {
  getReportCustomerByCity,
  getReportTypeService,
} from "../../../../api/report";
import { List, Select } from "antd";
import CustomDatePicker from "../../../../components/customDatePicker";

const ReportArea = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDateCity, setStartDateCity] = useState("");
  const [endDateCity, setEndDateCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState(false);
  const [codeCity, setCodeCity] = useState();
  const [nameCity, setNameCity] = useState("");
  const [dataCity, setDataCity] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [codeDistrict, setCodeDistrict] = useState(-1);
  const [district, setDistrict] = useState(false);
  const [dataChartPie, setDataChartPie] = useState([]);
  const [dataChartCustomerCity, setDataChartCustomerCity] = useState([]);

  const districtData = [];
  const cityData = [];

  useEffect(() => {
    getDistrictApi()
      .then((res) => {
        setDataCity(res?.aministrative_division);
        setCodeCity(res?.aministrative_division[0]?.code);
        setNameCity(res?.aministrative_division[0]?.name);
        setDataDistrict(res?.aministrative_division[0]?.districts);
        getReportTypeService(
          moment(moment().startOf("year").toISOString())
            .add(7, "hours")
            .toISOString(),
          moment(moment(new Date()).toISOString())
            .add(7, "hours")
            .toISOString(),
          res?.aministrative_division[0]?.code,
          codeDistrict
        )
          .then((res) => {
            setDataChartPie(res?.percent);
          })
          .catch((err) => {});
      })
      .catch((err) => {});

    getReportCustomerByCity(
      moment(moment().startOf("year").toISOString())
        .add(7, "hours")
        .toISOString(),
      moment(moment(new Date()).toISOString()).add(7, "hours").toISOString()
    )
      .then((res) => {
        setDataChartCustomerCity(res?.data);
      })
      .catch((err) => {});

    setStartDate(
      moment(moment().startOf("year").toISOString())
        .add(7, "hours")
        .toISOString()
    );
    setStartDateCity(
      moment(moment().startOf("year").toISOString())
        .add(7, "hours")
        .toISOString()
    );

    setEndDate(
      moment(moment(new Date()).toISOString()).add(7, "hours").toISOString()
    );
    setEndDateCity(
      moment(moment(new Date()).toISOString()).add(7, "hours").toISOString()
    );
  }, []);

  dataDistrict?.map((item) => {
    districtData?.push({
      value: item?.code,
      label: item?.name,
    });
  });

  dataCity?.map((item) => {
    cityData?.push({
      value: item?.code,
      label: item?.name,
      district: item?.districts,
    });
  });

  const onChangeCity = useCallback(
    (value, label) => {
      setNameCity(label?.label);
      setCodeCity(value);
      setDataDistrict(label?.district);
      setCity(!city);
      getReportTypeService(startDate, endDate, value, codeDistrict)
        .then((res) => {
          setDataChartPie(res?.percent);
        })
        .catch((err) => {});
    },
    [city, startDate, endDate, codeDistrict]
  );

  const onChangeDistrict = useCallback(
    (value, label) => {
      setCodeDistrict(label?.value);
      setDistrict(!district);
      getReportTypeService(startDate, endDate, codeCity, value)
        .then((res) => {
          setDataChartPie(res?.percent);
        })
        .catch((err) => {});
    },
    [district, startDate, endDate, codeCity]
  );

  const onChangeDay = () => {
    getReportTypeService(startDate, endDate, codeCity, codeDistrict)
      .then((res) => {
        setDataChartPie(res?.percent);
      })
      .catch((err) => {});
  };

  const onChangeDayCustomer = () => {
    getReportCustomerByCity(startDateCity, endDateCity)
      .then((res) => {
        setDataChartCustomerCity(res?.data);
      })
      .catch((err) => {});
  };

  const onCancelPicker = () => {
    getReportTypeService(
      moment(moment().startOf("year").toISOString())
        .add(7, "hours")
        .toISOString(),
      moment(moment(new Date()).toISOString()).add(7, "hours").toISOString(),
      codeCity,
      codeDistrict
    )
      .then((res) => {
        setDataChartPie(res?.percent);
      })
      .catch((err) => {});
    setStartDate(
      moment(moment().startOf("year").toISOString())
        .add(7, "hours")
        .toISOString()
    );
    setEndDate(
      moment(moment(new Date()).toISOString()).add(7, "hours").toISOString()
    );
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

  const renderLabelCity = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    city,
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
        {percent > 1 ? city + " " + percent + " %" : ""}
        {/* {city} ({percent} {"%"}) */}
      </text>
    );
  };

  return (
    <>
      <div className="div-chart-pie-total">
        <a className="title-chart-area"> Thống kê đơn hàng theo khu vực</a>
        <div className="div-select-city">
          <Select
            style={{ width: 200 }}
            value={nameCity}
            onChange={onChangeCity}
            options={cityData}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
          <Select
            style={{ width: 180, marginLeft: 20, marginRight: 20 }}
            placeholder="Chọn quận"
            onChange={onChangeDistrict}
            options={districtData}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
          <CustomDatePicker
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onClick={onChangeDay}
            onCancel={onCancelPicker}
          />
        </div>
        <div className="div-pie-chart">
          <ResponsiveContainer height={300} min-width={500}>
            <PieChart height={250}>
              <Pie
                data={dataChartPie}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={renderLabel}
              >
                {dataChartPie.map((entry, index) => (
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

      <div className="div-chart-pie-total mt-3">
        <a className="title-chart-area"> Thống kê khách hàng theo khu vực</a>
        <div className="div-select-city">
          <CustomDatePicker
            setStartDate={setStartDateCity}
            setEndDate={setEndDateCity}
            onClick={onChangeDayCustomer}
            onCancel={onCancelPicker}
          />
        </div>
        <div className="div-pie-chart">
          <ResponsiveContainer height={300} min-width={500}>
            <PieChart height={250}>
              <Pie
                data={dataChartCustomerCity}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="percent"
                label={renderLabelCity}
              >
                {dataChartCustomerCity.map((entry, index) => (
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
    </>
  );
};

export default ReportArea;

const COLORS = ["#0088FE", "#48cae4", "#00CF3A"];
