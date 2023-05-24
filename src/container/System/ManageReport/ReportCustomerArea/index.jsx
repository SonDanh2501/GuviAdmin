import { useEffect, useState } from "react";
import { getReportCustomerByCity } from "../../../../api/report";
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

const ReportCustomerArea = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    getReportCustomerByCity(
      moment(moment().startOf("month").toISOString())
        .add(7, "hours")
        .toISOString(),
      moment(moment(new Date()).toISOString()).add(7, "hours").toISOString()
    )
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {});

    setStartDate(
      moment(moment().startOf("month").toISOString())
        .add(7, "hours")
        .toISOString()
    );
    setEndDate(
      moment(moment().startOf("month").toISOString())
        .add(7, "hours")
        .toISOString()
    );
  }, []);

  console.log(data);

  return (
    <div>
      <div>
        <ResponsiveContainer width={"100%"} height={350} min-width={350}>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="city" />

            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="total"
              fill="#00CF3A"
              barSize={15}
              minPointSize={10}
              label={{ position: "centerTop", fill: "black" }}
              name="Số khách hàng"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportCustomerArea;
