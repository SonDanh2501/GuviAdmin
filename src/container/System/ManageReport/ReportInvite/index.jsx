import { DatePicker, Input, Pagination, Select, Table } from "antd";
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
  getTopCustomerInviteTime,
} from "../../../../api/report";
import "./index.scss";
const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportInvite = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [dataTop, setDataTop] = useState([]);
  const [dataTimeInvite, setDataTimeInvite] = useState([]);
  const [type, setType] = useState("daily");
  const [typeTime, setTypeTime] = useState("day");
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

    getTopCustomerInviteTime(
      moment().startOf("month").toISOString(),
      moment(new Date()).toISOString(),
      "daily"
    )
      .then((res) => {
        setDataTimeInvite(res);
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

    getTopCustomerInviteTime(dayStart, dayEnd, "daily")
      .then((res) => {
        setDataTimeInvite(res);
      })
      .catch((err) => {});
  };

  const onChangeYearInvite = (start, end) => {
    const dayStart = moment(start).startOf("year").toISOString();
    const dayEnd = moment(end).endOf("year").toISOString();
    getTopCustomerInvite(dayStart, dayEnd)
      .then((res) => {
        setDataTop(res);
      })
      .catch((err) => {});

    getTopCustomerInviteTime(dayStart, dayEnd, "year")
      .then((res) => {
        setDataTimeInvite(res);
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

      <div className="mt-3 div-date-invite">
        <Input.Group compact>
          <Select
            defaultValue={typeTime}
            onChange={(e) => setTypeTime(e)}
            className="input-picker"
          >
            <Option value="day">Ngày</Option>
            {/* <Option value="week">Tuần </Option>
              <Option value="month">Tháng</Option> */}
            <Option value="year">Năm</Option>
          </Select>
        </Input.Group>
        <div>
          {typeTime === "day" && (
            <RangePicker
              picker="day"
              className="select-range-picker"
              onChange={(e) => onChangeDayTop(e[0]?.$d, e[1]?.$d)}
            />
          )}
          {typeTime === "year" && (
            <DatePicker
              picker="year"
              onChange={(e) => onChangeYearInvite(e[0]?.$d, e[1]?.$d)}
            />
          )}
        </div>
      </div>

      <div className="div-chart">
        <div className="div-chart-left">
          <ResponsiveContainer width={"100%"} height={350} min-width={350}>
            <BarChart
              width={500}
              height={300}
              data={
                typeTime === "year"
                  ? dataTimeInvite.slice(1, dataTimeInvite.length)
                  : dataTimeInvite
              }
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              {typeTime === "day" ? (
                <XAxis
                  dataKey="day"
                  tickFormatter={(tickItem) => moment(tickItem).format("DD/MM")}
                />
              ) : (
                <XAxis
                  dataKey="day"
                  tickFormatter={(tickItem) =>
                    "Tháng" + " " + moment(tickItem).format("MM")
                  }
                />
              )}
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="total"
                fill="#4376CC"
                barSize={15}
                minPointSize={5}
                label={{ position: "centerTop", fill: "white" }}
                name="Tổng lượt giới thiệu"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="div-chart-right">
          <a className="title-top">Top 5 người giới thiệu</a>
          <div className="div-right">
            {dataTop.length > 4 && (
              <div className="div-item-top">
                <a>{dataTop[4].total_inviter}</a>
                <div className={"column-top-5"} />
                <a className="text-name-column">{dataTop[4].customer}</a>
              </div>
            )}
            {dataTop.length > 3 && (
              <div className="div-item-top">
                <a>{dataTop[3].total_inviter}</a>
                <div className={"column-top-4"} />
                <a className="text-name-column">{dataTop[3].customer}</a>
              </div>
            )}
            {dataTop.length > 2 && (
              <div className="div-item-top">
                <a>{dataTop[2].total_inviter}</a>
                <div className={"column-top-3"} />
                <a className="text-name-column">{dataTop[2].customer}</a>
              </div>
            )}
            {dataTop.length > 1 && (
              <div className="div-item-top">
                <a>{dataTop[1].total_inviter}</a>
                <div className={"column-top-2"} />
                <a className="text-name-column">{dataTop[1].customer}</a>
              </div>
            )}
            {dataTop.length > 0 && (
              <div className="div-item-top">
                <a>{dataTop[0].total_inviter}</a>
                <div className={"column-top-1"} />
                <a className="text-name-column">{dataTop[0].customer}</a>
              </div>
            )}
          </div>
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
