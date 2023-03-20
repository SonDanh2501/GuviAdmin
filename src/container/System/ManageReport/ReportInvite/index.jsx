import { DatePicker, Pagination, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getReportCustomerInviteDay,
  getTopCustomerInvite,
} from "../../../../api/report";
import "./index.scss";
const { RangePicker } = DatePicker;

const ReportInvite = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [dataTop, setDataTop] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getReportCustomerInviteDay(
      0,
      20,
      moment("2022-08-30").startOf("year").toISOString(),
      moment(new Date()).toISOString()
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));

    getTopCustomerInvite(
      moment("2022-08-30").startOf("year").toISOString(),
      moment(new Date()).toISOString()
    )
      .then((res) => {
        setDataTop(res);
      })
      .catch((err) => {});
  }, []);

  const onChange = (page) => {
    setCurrentPage(page);
    const start = page * data.length - data.length;
    getReportCustomerInviteDay(start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));
  };

  const columns = [
    {
      title: "Mã",
      render: (data) => <a>{data?.id_view}</a>,
    },
    {
      title: "Tên khách hàng",
      render: (data) => <a>{data?.full_name}</a>,
    },
    {
      title: "Số điện thoại ",
      render: (data) => <a>{data?.phone}</a>,
    },
    {
      title: "Lượt giới thiệu",
      render: (data) => <a>{data?.totalInvite}</a>,
      align: "center",
    },
    {
      key: "action",
      render: (data) => {
        return (
          <>
            <div
              className="btn-detail"
              onClick={() =>
                navigate("/report/manage-report/details-customer-invite", {
                  state: { id: data?._id },
                })
              }
            >
              <a className="text-btn-detail">Chi tiết</a>
            </div>
          </>
        );
      },
    },
  ];

  const onChangeDayTop = (start, end) => {
    const dayStart = moment(start).toISOString();
    const dayEnd = moment(end).toISOString();
    getTopCustomerInvite(dayStart, dayEnd)
      .then((res) => {
        setDataTop(res);
      })
      .catch((err) => {});
  };

  const onChangeDay = (start, end) => {
    const dayStart = moment(start).toISOString();
    const dayEnd = moment(end).toISOString();
    getReportCustomerInviteDay(0, 20, dayStart, dayEnd)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <a className="title">Tổng lượt giới thiệu</a>
      <div className="div-chart">
        <a className="title-chart">Top 10 người giới thiệu nhiều nhất</a>
        <div>
          <RangePicker
            picker="day"
            onChange={(e) => onChangeDayTop(e[0]?.$d, e[1]?.$d)}
          />
        </div>
        <ResponsiveContainer width={"100%"} height={350} min-width={350}>
          <ComposedChart
            layout="vertical"
            width={500}
            height={400}
            data={dataTop}
            margin={{
              top: 20,
              right: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis type="number" />
            <YAxis dataKey="customer" type="category" scale="band" />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="total_inviter"
              barSize={20}
              fill="#413ea0"
              minPointSize={5}
              label={{ position: "centerTop", fill: "white" }}
              name="total_inviter"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <a className="title">Bảng thống kê</a>
      <div className="mt-3">
        <RangePicker
          picker="day"
          onChange={(e) => onChangeDay(e[0]?.$d, e[1]?.$d)}
        />
      </div>
      <div className="mt-2">
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
      <div className="mt-1 div-pagination p-2">
        <a>Tổng: {total}</a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={total}
            showSizeChanger={false}
            pageSize={20}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportInvite;

const data_test = [
  {
    name: "Page A",
    uv: 590,
    pv: 800,
    amt: 1400,
  },
  {
    name: "Page B",
    uv: 868,
    pv: 967,
    amt: 1506,
  },
  {
    name: "Page C",
    uv: 1397,
    pv: 1098,
    amt: 989,
  },
  {
    name: "Page D",
    uv: 1480,
    pv: 1200,
    amt: 1228,
  },
  {
    name: "Page E",
    uv: 1520,
    pv: 1108,
    amt: 1100,
  },
  {
    name: "Page F",
    uv: 1400,
    pv: 680,
    amt: 1700,
  },
];
