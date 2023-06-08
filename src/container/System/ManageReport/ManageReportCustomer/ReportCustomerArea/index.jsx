import { useEffect, useState } from "react";
import { getReportCustomerByCity } from "../../../../../api/report";
import moment from "moment";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import CustomDatePicker from "../../../../../components/customDatePicker";
import { Table } from "antd";
import "./styles.scss";

const ReportCustomerArea = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    getReportCustomerByCity(
      moment().startOf("month").toISOString(),
      moment().endOf("date").toISOString()
    )
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {});

    setStartDate(moment().startOf("month").toISOString());
    setEndDate(moment().startOf("month").toISOString());
  }, []);

  const onChangeDay = () => {
    getReportCustomerByCity(startDate, endDate)
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {});
  };

  const columns = [
    {
      title: "Khu vực",
      render: (data) => <a>{data?.city}</a>,
    },
    {
      title: "Khách hàng",
      render: (data) => <a>{data?.total}</a>,
    },
    {
      title: "Tỉ lệ",
      render: (data) => <a>{data?.percent}%</a>,
    },
  ];

  return (
    <div>
      <h3>Khách hàng theo khu vực</h3>
      <div className="div-date">
        <CustomDatePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onClick={onChangeDay}
          onCancel={() => {}}
        />
        {startDate && (
          <a className="text-date">
            {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
            {moment(endDate).utc().format("DD/MM/YYYY")}
          </a>
        )}
      </div>
      <div className="div-chart-customer-area">
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
              dataKey="city"
              tick={{ fontSize: 8 }}
              angle={-30}
              textAnchor="end"
            />

            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="total"
              fill="#4376CC"
              barSize={20}
              minPointSize={10}
              label={{ position: "centerTop", fill: "white", fontSize: 10 }}
              name="Số khách hàng"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5">
        <Table dataSource={data} columns={columns} pagination={false} />
      </div>
    </div>
  );
};

export default ReportCustomerArea;
