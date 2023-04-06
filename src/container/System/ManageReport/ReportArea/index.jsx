import React, { useCallback, useEffect, useState } from "react";
import "./areaReport.scss";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { getDistrictApi } from "../../../../api/file";
import moment from "moment";
import { getReportTypeService } from "../../../../api/report";
import { List, Select } from "antd";
import CustomDatePicker from "../../../../components/customDatePicker";

const ReportArea = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState(false);
  const [codeCity, setCodeCity] = useState();
  const [dataCity, setDataCity] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [codeDistrict, setCodeDistrict] = useState(-1);
  const [district, setDistrict] = useState(false);
  const [dataChartPie, setDataChartPie] = useState([]);

  const districtData = [];
  const cityData = [];

  useEffect(() => {
    getDistrictApi()
      .then((res) => {
        setDataCity(res?.aministrative_division);
        setCodeCity(res?.aministrative_division[0]?.code);
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

  return (
    <>
      <div className="div-chart-pie-total">
        <a className="title-chart-area"> Thống kê đơn hàng theo khu vực</a>
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
            onCancel={onCancelPicker}
          />
        </div>
        <div className="div-pie-chart">
          <div className="div-title-note">
            <div className="div-square-ser">
              <div className="square-two" />
              <a>
                2 giờ{" "}
                {dataChartPie[0]?.value
                  ? "- " + dataChartPie[0]?.value + "%"
                  : ""}
              </a>
            </div>
            <div className="div-square-ser">
              <div className="square-three" />
              <a>
                3 giờ{" "}
                {dataChartPie[1]?.value
                  ? "- " + dataChartPie[1]?.value + "%"
                  : ""}
              </a>
            </div>
            <div className="div-square-ser">
              <div className="square-four" />
              <a>
                4 giờ{" "}
                {dataChartPie[2]?.value
                  ? "- " + dataChartPie[2]?.value + "%"
                  : ""}
              </a>
            </div>
          </div>

          <ResponsiveContainer height={200} min-width={500}>
            <PieChart>
              <Pie
                data={dataChartPie}
                cx={100}
                cy={100}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
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
    </>
  );
};

export default ReportArea;

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const COLORS = ["#0088FE", "#48cae4", "#00CF3A"];
