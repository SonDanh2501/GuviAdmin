import { DatePicker, Pagination, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
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
    const dayStart = moment(start).startOf("date").toISOString();
    const dayEnd = moment(end).endOf("date").toISOString();
    getTopCustomerInvite(dayStart, dayEnd)
      .then((res) => {
        setDataTop(res);
      })
      .catch((err) => {});
  };

  const onChangeDay = (start, end) => {
    const dayStart = moment(start).startOf("date").toISOString();
    const dayEnd = moment(end).endOf("date").toISOString();
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

      <div className="mt-3">
        <RangePicker
          picker="day"
          onChange={(e) => onChangeDayTop(e[0]?.$d, e[1]?.$d)}
        />
      </div>

      <div className="div-chart">
        <div className="div-chart-left">
          <ResponsiveContainer width={"100%"} height={350} min-width={350}>
            <BarChart width={500} height={400} data={dataTop}>
              <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="customer" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="total_inviter"
                barSize={20}
                fill="#413ea0"
                // minPointSize={5}
                // label={{ position: "centerTop", fill: "white" }}
                // name="total_inviter"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="div-chart-right">
          {data_test.length > 4 && (
            <div className="div-item-top">
              <a>{data_test[4].invite}</a>
              <div className={"column-top-5"} />
              <a className="text-name-column">{data_test[4].name}</a>
            </div>
          )}
          {data_test.length > 3 && (
            <div className="div-item-top">
              <a>{data_test[3].invite}</a>
              <div className={"column-top-4"} />
              <a className="text-name-column">{data_test[3].name}</a>
            </div>
          )}
          {data_test.length > 2 && (
            <div className="div-item-top">
              <a>{data_test[2].invite}</a>
              <div className={"column-top-3"} />
              <a className="text-name-column">{data_test[2].name}</a>
            </div>
          )}
          {data_test.length > 1 && (
            <div className="div-item-top">
              <a>{data_test[1].invite}</a>
              <div className={"column-top-2"} />
              <a className="text-name-column">{data_test[1].name}</a>
            </div>
          )}
          {data_test.length > 0 && (
            <div className="div-item-top">
              <a>{data_test[0].invite}</a>
              <div className={"column-top-1"} />
              <a className="text-name-column">{data_test[0].name}</a>
            </div>
          )}
        </div>
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
    name: "LE MINH DANG",
    invite: 50,
  },
  {
    name: "LE MINH DANG",
    invite: 40,
  },
  {
    name: "LE MINH DANG",
    invite: 30,
  },
  {
    name: "LE MINH DANG",
    invite: 20,
  },
  {
    name: "LE MINH DANG",
    invite: 10,
  },
];
