import { useEffect, useState } from "react";
import { getReportCustomerOrderByAreaApi } from "../../../../../api/report";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import i18n from "../../../../../i18n";
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

import "./styles.scss";

const ReportCustomerOrderByArea = () => {
  const [data, setData] = useState([]);

  const lang = useSelector(getLanguageState);
  useEffect(() => {
    getReportCustomerOrderByAreaApi()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {});
  }, []);

  return (
    <div>
      <h5>{`${i18n.t("report_customer_order_by_area", { lng: lang })}`}</h5>

      <div className="div-chart-customer-order_by_area">
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

            <XAxis dataKey="city" tick={{ fontSize: 10 }} />

            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="total"
              fill="#4376CC"
              barSize={20}
              minPointSize={10}
              label={{ position: "top", fill: "black", fontSize: 14 }}
              name={`${i18n.t("province_city", { lng: lang })}`}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportCustomerOrderByArea;
