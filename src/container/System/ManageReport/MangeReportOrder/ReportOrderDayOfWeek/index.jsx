import { useEffect, useState } from "react";
import { getReportOrderDay } from "../../../../../api/report";
import moment from "moment";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import i18n from "../../../../../i18n";
import CustomDatePicker from "../../../../../components/customDatePicker";
import InputCustom from "../../../../../components/textInputCustom";
import "./styles.scss";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LoadingPagination from "../../../../../components/paginationLoading";

const ReportOrderDayOfWeek = () => {
  const [data, setData] = useState([]);
  const [type, setType] = useState("date_create");
  const [startDate, setStartDate] = useState(
    moment().subtract(7, "d").startOf("date").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("day").toISOString());
  const [isLoading, setIsLoading] = useState(false);
  const lang = useSelector(getLanguageState);
  useEffect(() => {
    setIsLoading(true);
    getReportOrderDay(
      moment().subtract(7, "d").startOf("date").toISOString(),
      moment().endOf("day").toISOString(),
      "date_create"
    )
      .then((res) => {
        setIsLoading(false);
        setData(res);
      })
      .catch((err) => {});
  }, []);

  data.push(data.shift());

  const onChangeDay = () => {
    setIsLoading(true);
    getReportOrderDay(startDate, endDate, type)
      .then((res) => {
        setIsLoading(false);
        setData(res);
      })
      .catch((err) => {});
  };

  const onChangeType = (type) => {
    setType(type);
    getReportOrderDay(startDate, endDate, type)
      .then((res) => {
        setIsLoading(false);
        setData(res);
      })
      .catch((err) => {});
  };

  const CustomYAxisTick = (value) => {
    if (value === 0) return `${i18n.t("sunday", { lng: lang })}`;
    else if (value === 1) return `${i18n.t("monday", { lng: lang })}`;
    else if (value === 2) return `${i18n.t("tuesday", { lng: lang })}`;
    else if (value === 3) return `${i18n.t("wednesday", { lng: lang })}`;
    else if (value === 4) return `${i18n.t("thusday", { lng: lang })}`;
    else if (value === 5) return `${i18n.t("friday", { lng: lang })}`;
    else if (value === 6) return `${i18n.t("saturday", { lng: lang })}`;
  };

  const renderTooltipContent = (o) => {
    const { payload, label } = o;
    return (
      <div className="div-tooltip-content-week">
        <p className="m-0">
          {label === 0
            ? `${i18n.t("sunday", { lng: lang })}`
            : label === 1
            ? `${i18n.t("monday", { lng: lang })}`
            : label === 2
            ? `${i18n.t("tuesday", { lng: lang })}`
            : label === 3
            ? `${i18n.t("wednesday", { lng: lang })}`
            : label === 4
            ? `${i18n.t("thusday", { lng: lang })}`
            : label === 5
            ? `${i18n.t("friday", { lng: lang })}`
            : `${i18n.t("saturday", { lng: lang })}`}
        </p>
        <p className="m-0">Số ca: {payload[0]?.payload?.total_item}</p>
      </div>
    );
  };

  return (
    <div>
      <h5>{`${i18n.t("report_order_day_of_week", { lng: lang })}`}</h5>
      <div className="div-select-time-and-type">
        <div className="div-date">
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
              <p className="text-date m-0">
                {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
                {moment(endDate).utc().format("DD/MM/YYYY")}
              </p>
            </div>
          )}
        </div>

        <InputCustom
          select={true}
          value={type}
          onChange={(e) => onChangeType(e)}
          options={[
            { value: "date_create", label: "Ngày tạo" },
            { value: "date_work", label: "Ngày làm" },
          ]}
          style={{ marginLeft: 20 }}
        />
      </div>
      <div className="div-chart-day-in-week">
        <ResponsiveContainer width={"100%"} height={350} min-width={350}>
          <BarChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="_id"
              fontSize={12}
              tickFormatter={CustomYAxisTick}
            />

            <YAxis />
            <Tooltip content={renderTooltipContent} />
            <Legend />
            <Bar
              dataKey="total_item"
              fill="#4376CC"
              barSize={20}
              minPointSize={10}
              label={{ position: "centerTop", fill: "white", fontSize: 10 }}
              name={`${i18n.t("number_shift", { lng: lang })}`}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default ReportOrderDayOfWeek;
