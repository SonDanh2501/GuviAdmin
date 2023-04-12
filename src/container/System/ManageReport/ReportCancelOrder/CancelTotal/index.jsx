import { Select } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { getDistrictApi } from "../../../../../api/file";
import {
  getReportCancelReport,
  getReportOverviewCancelReport,
} from "../../../../../api/report";

import "./index.scss";
import CustomDatePicker from "../../../../../components/customDatePicker";

const TotalCancel = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [titleCity, setTitleCity] = useState("Chọn thành phố");
  const [city, setCity] = useState(false);
  const [codeCity, setCodeCity] = useState();
  const [dataCity, setDataCity] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [codeDistrict, setCodeDistrict] = useState(-1);
  const [district, setDistrict] = useState(false);
  const [titleDistrict, setTitleDistrict] = useState("Chọn quận");
  const [dataPie, setDataPie] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const districtData = [];
  const cityData = [];

  useEffect(() => {
    getDistrictApi()
      .then((res) => {
        setDataCity(res?.aministrative_division);
        setCodeCity(res?.aministrative_division[0]?.code);
        setTitleCity(res?.aministrative_division[0]?.name);
        setDataDistrict(res?.aministrative_division[0]?.districts);
        getReportCancelReport(
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
            setDataPie(res?.percent);
          })
          .catch((err) => {});
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
      setCodeCity(value);
      setDataDistrict(label?.district);
      setCity(!city);
      getReportCancelReport(startDate, endDate, value, codeDistrict)
        .then((res) => {
          setDataPie(res?.percent);
        })
        .catch((err) => {});
    },
    [city, startDate, endDate, codeDistrict]
  );

  const onChangeDistrict = useCallback(
    (value, label) => {
      setCodeDistrict(label?.value);
      setDistrict(!district);
      getReportCancelReport(startDate, endDate, codeCity, value)
        .then((res) => {
          setDataPie(res?.percent);
        })
        .catch((err) => {});
    },
    [district, startDate, endDate, codeCity]
  );

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
        {name === "system_cancel"
          ? "Hệ thống"
          : name === "customer_cancel"
          ? "Khách hàng"
          : "Quản trị viên"}{" "}
        ({value} {"%"})
      </text>
    );
  };

  const onChangeDay = () => {
    getReportCancelReport(startDate, endDate, codeCity, codeDistrict)
      .then((res) => {
        setDataPie(res?.percent);
      })
      .catch((err) => {});
  };

  return (
    <>
      <div className="div-chart-pie-total-cancel">
        <a className="title-chart"> Thống kê đơn huỷ theo khu vực</a>
        <div className="div-select-city">
          <Select
            style={{ width: 200 }}
            defaultValue={"Thành phố Hồ Chí Minh"}
            onChange={onChangeCity}
            options={cityData}
          />
          <Select
            style={{ width: 180, marginLeft: 20, marginRight: 20 }}
            placeholder="Chọn quận"
            onChange={onChangeDistrict}
            options={districtData}
          />
          <CustomDatePicker
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onClick={onChangeDay}
            onCancel={() => {}}
          />
        </div>
        <div className="div-pie-chart">
          <ResponsiveContainer height={300} min-width={500}>
            <PieChart>
              <Pie
                data={dataPie}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={renderLabel}
              >
                {dataPie.map((entry, index) => (
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

export default TotalCancel;

const COLORS = ["#ffad2a", "#ff8000", "#ff1919"];
