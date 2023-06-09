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
} from "../../../../../api/report";
import CustomDatePicker from "../../../../../components/customDatePicker";
import LoadingPage from "../../../../../components/LoadingPage";
import "./index.scss";
const { RangePicker } = DatePicker;
const { Option } = Select;
const width = window.innerWidth;

const ReportInvite = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [dataTop, setDataTop] = useState([]);
  const [dataTimeInvite, setDataTimeInvite] = useState([]);
  const [type, setType] = useState("daily");
  const [typeTime, setTypeTime] = useState("day");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(
    moment().startOf("month").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getReportCustomerInviteDay(
      0,
      20,
      moment(new Date("01-01-2022")).toISOString(),
      endDate
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));

    getTopCustomerInvite(startDate, endDate)
      .then((res) => {
        setDataTop(res);
      })
      .catch((err) => {});

    getTopCustomerInviteTime(startDate, endDate, "daily")
      .then((res) => {
        setDataTimeInvite(res);
      })
      .catch((err) => {});
  }, []);

  const onChange = (page) => {
    setCurrentPage(page);
    const start = page * data.length - data.length;
    getReportCustomerInviteDay(
      start,
      20,
      moment(new Date("01-01-2022")).toISOString(),
      endDate
    )
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
      sorter: (a, b) => a.totalInvite - b.totalInvite,
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

  const onChangeDay = () => {
    getReportCustomerInviteDay(0, 20, startDate, endDate)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));
  };

  const renderTooltipContent = (o) => {
    const { payload, label } = o;

    return (
      <div className="div-content-tool-chart">
        <a className="date-text">
          Ngày: {moment(new Date(label)).format("DD/MM/YYYY")}
        </a>

        <a className="money-text">
          Lượt giới thiệu:{" "}
          {payload?.length > 0 ? payload[0]?.payload?.total : 0}
        </a>
      </div>
    );
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
              <Tooltip content={renderTooltipContent} />
              <Legend />
              <Bar
                dataKey="total"
                fill="#4376CC"
                barSize={15}
                minPointSize={10}
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
                <a className="text-name-column">
                  {dataTop[4]?.customer
                    ? dataTop[4]?.customer
                    : dataTop[4]?.collaborator}
                </a>
              </div>
            )}
            {dataTop.length > 3 && (
              <div className="div-item-top">
                <a>{dataTop[3].total_inviter}</a>
                <div className={"column-top-4"} />
                <a className="text-name-column">
                  {dataTop[3]?.customer
                    ? dataTop[3]?.customer
                    : dataTop[3]?.collaborator}
                </a>
              </div>
            )}
            {dataTop.length > 2 && (
              <div className="div-item-top">
                <a>{dataTop[2].total_inviter}</a>
                <div className={"column-top-3"} />
                <a className="text-name-column">
                  {dataTop[2]?.customer
                    ? dataTop[2]?.customer
                    : dataTop[2]?.collaborator}
                </a>
              </div>
            )}
            {dataTop.length > 1 && (
              <div className="div-item-top">
                <a>{dataTop[1].total_inviter}</a>
                <div className={"column-top-2"} />
                <a className="text-name-column">
                  {dataTop[1]?.customer
                    ? dataTop[1]?.customer
                    : dataTop[1]?.collaborator}
                </a>
              </div>
            )}
            {dataTop.length > 0 && (
              <div className="div-item-top">
                <a>{dataTop[0].total_inviter}</a>
                <div className={"column-top-1"} />
                <a className="text-name-column">
                  {dataTop[0]?.customer
                    ? dataTop[0]?.customer
                    : dataTop[0]?.collaborator}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <a className="title">Bảng thống kê</a>
      {/* <div className="mt-3">
        <div className="div-date">
          <CustomDatePicker
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onClick={onChangeDay}
          />
          {startDate && (
            <a className="text-date">
              {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
              {moment(endDate).utc().format("DD/MM/YYYY")}
            </a>
          )}
        </div>
      </div> */}
      <div className="mt-2">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={
            width <= 490
              ? {
                  x: 1600,
                }
              : null
          }
        />
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
      {isLoading && <LoadingPage />}
    </div>
  );
};

export default ReportInvite;
