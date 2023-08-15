import { useEffect, useState } from "react";
import CustomDatePicker from "../../../../components/customDatePicker";
import moment from "moment";
import { getReportOrder, getReportOrderDaily } from "../../../../api/report";
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

import "./styles.scss";
import { number_processing } from "../../../../helper/numberProcessing";
import { formatMoney } from "../../../../helper/formatMoney";

const ReportOverview = () => {
  const [startDate, setStartDate] = useState(
    moment().startOf("day").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("day").toISOString());
  const [sameStartDate, setSameStartDate] = useState(
    moment().subtract(1, "day").startOf("day").toISOString()
  );
  const [sameEndDate, setSameEndDate] = useState(
    moment().subtract(1, "day").endOf("day").toISOString()
  );
  const [data, setData] = useState([]);
  const [dataSame, setDataSame] = useState([]);
  const [totalGrossIncome, setTotalGrossIncome] = useState(0);
  const [totalGrossIncomeSame, setTotalGrossIncomeSame] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalOrderSame, setTotalOrderSame] = useState(0);
  const [netIncomePercents, setNetIncomePercents] = useState(0);
  const dataChartGrossOrder = [];
  const dataChartTotalOrder = [];

  useEffect(() => {
    getReportOrderDaily(0, 40, startDate, endDate, "date_work")
      .then((res) => {
        setData(res?.data);
        var gross = 0;
        var total = 0;
        for (var i = 0; i < res?.data?.length; i++) {
          gross += res?.data[i].total_net_income;
          total += res?.data[i].total_item;
          setTotalGrossIncome(gross);
          setTotalOrder(total);
        }
      })
      .catch((err) => {});

    getReportOrderDaily(0, 40, sameStartDate, sameEndDate, "date_work")
      .then((res) => {
        setDataSame(res?.data);
        var gross = 0;
        var total = 0;
        for (var i = 0; i < res?.data?.length; i++) {
          gross += res?.data[i].total_net_income;
          total += res?.data[i].total_item;
          setTotalGrossIncomeSame(gross);
          setTotalOrderSame(total);
        }
      })
      .catch((err) => {});
  }, [startDate, endDate]);

  for (let i = 0; i < data.length; i++) {
    dataChartGrossOrder.push({
      date: data[i]?._id?.slice(0, 5),
      date_same: dataSame[i]?._id?.slice(0, 5),
      gross_income: data[i]?.total_net_income,
      gross_income_same: dataSame[i]?.total_net_income,
    });

    dataChartTotalOrder.push({
      date: data[i]?._id?.slice(0, 5),
      date_same: dataSame[i]?._id?.slice(0, 5),
      total: data[i]?.total_item,
      total_same: dataSame[i]?.total_item,
    });
  }

  const renderTooltipContent = (o) => {
    const { payload, label } = o;

    return (
      <div className="div-content-chart-net-income">
        <a className="text-content">
          {payload[0]?.payload?.date}:{" "}
          {formatMoney(payload[0]?.payload?.gross_income)}
        </a>
        <a className="text-content-same">
          {payload[0]?.payload?.date_same}:{" "}
          {formatMoney(payload[0]?.payload?.gross_income_same)}
        </a>
      </div>
    );
  };

  return (
    <div className="mt-2">
      <div className="div-date-report-overview ">
        <CustomDatePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setSameStart={setSameStartDate}
          setSameEnd={setSameEndDate}
          onClick={() => {}}
          onCancel={() => {}}
        />
        <div className="div-same">
          <a>
            Cùng kỳ: {moment(sameStartDate).utc().format("DD/MM/YYYY")}-
            {moment(sameEndDate).format("DD/MM/YYYY")}
          </a>
        </div>
      </div>

      <div className="div-chart-firt-overview">
        <div className="div-chart-gross-income">
          <a className="title-gross">Doanh thu thuần</a>

          <div className="div-total-gross">
            <a className="text-total-gross">{formatMoney(totalGrossIncome)}</a>
          </div>
          <ResponsiveContainer height={350} width="100%">
            <LineChart
              width={500}
              height={300}
              data={dataChartGrossOrder}
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
              />
              <Tooltip content={renderTooltipContent} />
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
          <a className="title-gross">Lượng đơn hàng</a>
          <div className="div-total-gross">
            <a className="text-total-gross">{totalOrder}</a>
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
    </div>
  );
};

export default ReportOverview;

const data_test = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
