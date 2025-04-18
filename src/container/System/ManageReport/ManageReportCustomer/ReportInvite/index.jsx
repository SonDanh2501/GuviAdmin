import { DatePicker, Input, Pagination, Select, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import {
  getReportCustomerInviteDay,
  getTopCustomerInvite,
  getTopCustomerInviteTime,
} from "../../../../../api/report";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";
import i18n from "../../../../../i18n";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import "./index.scss";
const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportInvite = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [dataTop, setDataTop] = useState([]);
  const [dataTimeInvite, setDataTimeInvite] = useState([]);
  const [typeTime, setTypeTime] = useState("day");
  const [currentPage, setCurrentPage] = useState(1);
  const lang = useSelector(getLanguageState);
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  useEffect(() => {
    getReportCustomerInviteDay(
      0,
      20,
      moment(new Date("01-01-2022")).toISOString(),
      moment().endOf("date").toISOString()
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));

    getTopCustomerInvite(
      moment(new Date("01-01-2022")).toISOString(),
      moment().endOf("date").toISOString()
    )
      .then((res) => {
        setDataTop(res);
      })
      .catch((err) => {});

    getTopCustomerInviteTime(
      moment().startOf("month").toISOString(),
      moment().endOf("date").toISOString(),
      "daily"
    )
      .then((res) => {
        setDataTimeInvite(res);
      })
      .catch((err) => {});
  }, []);

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data.length < 20 ? 20 : data.length;
    const start = page * dataLength - dataLength;
    getReportCustomerInviteDay(
      start,
      20,
      moment(new Date("01-01-2022")).toISOString(),
      moment().endOf("date").toISOString()
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));
  };

  const columns = [
    {
      title: `${i18n.t("code", { lng: lang })}`,
      render: (data) => <p className="text-name-invite">{data?.id_view}</p>,
    },
    {
      title: `${i18n.t("customer", { lng: lang })}`,
      render: (data) => <p className="text-name-invite">{data?.full_name}</p>,
    },
    {
      title: `${i18n.t("phone", { lng: lang })}`,
      render: (data) => <p className="text-name-invite">{data?.phone}</p>,
    },
    {
      title: `${i18n.t("referrals", { lng: lang })}`,
      render: (data) => <p className="text-name-invite">{data?.totalInvite}</p>,
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
              <p className="text-btn-detail">{`${i18n.t("detail", {
                lng: lang,
              })}`}</p>
            </div>
          </>
        );
      },
      align: "center",
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

  const renderTooltipContent = (o) => {
    const { payload, label } = o;

    return (
      <div className="div-content-tool-chart">
        <p className="date-text">
          {`${i18n.t("date", { lng: lang })}`}:{" "}
          {moment(new Date(label)).format("DD/MM/YYYY")}
        </p>

        <p className="money-text">
          {`${i18n.t("referrals", { lng: lang })}`}:{" "}
          {payload?.length > 0 ? payload[0]?.payload?.total : 0}
        </p>
      </div>
    );
  };

  const setMonth = (month) => {
    let thg;
    switch (month) {
      case "01":
        thg = `${i18n.t("January", { lng: lang })}`;
        break;
      case "02":
        thg = `${i18n.t("February", { lng: lang })}`;
        break;
      case "03":
        thg = `${i18n.t("March", { lng: lang })}`;
        break;
      case "04":
        thg = `${i18n.t("April", { lng: lang })}`;
        break;
      case "05":
        thg = `${i18n.t("May", { lng: lang })}`;
        break;
      case "06":
        thg = `${i18n.t("June", { lng: lang })}`;
        break;
      case "07":
        thg = `${i18n.t("July", { lng: lang })}`;
        break;
      case "08":
        thg = `${i18n.t("August", { lng: lang })}`;
        break;
      case "09":
        thg = `${i18n.t("September", { lng: lang })}`;
        break;
      case "10":
        thg = `${i18n.t("October", { lng: lang })}`;
        break;
      case "11":
        thg = `${i18n.t("November", { lng: lang })}`;
        break;
      case "12":
        thg = `${i18n.t("December", { lng: lang })}`;
        break;
      default:
        break;
    }

    return thg;
  };

  return (
    <div>
      <p className="title"> {`${i18n.t("total_referrals", { lng: lang })}`}</p>

      <div className="mt-3 div-date-invite">
        <Input.Group compact>
          <Select
            defaultValue={typeTime}
            onChange={(e) => setTypeTime(e)}
            className="input-picker"
          >
            <Option value="day"> {`${i18n.t("date", { lng: lang })}`}</Option>
            {/* <Option value="week">Tuần </Option>
              <Option value="month">Tháng</Option> */}
            <Option value="year">{`${i18n.t("year", { lng: lang })}`}</Option>
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
                right: 0,
                left: 0,
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
                    setMonth(moment(tickItem).format("MM"))
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
                name={`${i18n.t("total_referrals", { lng: lang })}`}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="div-chart-right">
          <p className="title-top">{`${i18n.t("top_recommenders", {
            lng: lang,
          })}`}</p>
          <div className="div-right">
            {dataTop.length > 4 && (
              <div className="div-item-top">
                <p>{dataTop[4].total_inviter}</p>
                <div className={"column-top-5"} />
                <p className="text-name-column">
                  {dataTop[4]?.customer
                    ? dataTop[4]?.customer
                    : dataTop[4]?.collaborator}
                </p>
              </div>
            )}
            {dataTop.length > 3 && (
              <div className="div-item-top">
                <p>{dataTop[3].total_inviter}</p>
                <div className={"column-top-4"} />
                <p className="text-name-column">
                  {dataTop[3]?.customer
                    ? dataTop[3]?.customer
                    : dataTop[3]?.collaborator}
                </p>
              </div>
            )}
            {dataTop.length > 2 && (
              <div className="div-item-top">
                <p>{dataTop[2].total_inviter}</p>
                <div className={"column-top-3"} />
                <p className="text-name-column">
                  {dataTop[2]?.customer
                    ? dataTop[2]?.customer
                    : dataTop[2]?.collaborator}
                </p>
              </div>
            )}
            {dataTop.length > 1 && (
              <div className="div-item-top">
                <p>{dataTop[1].total_inviter}</p>
                <div className={"column-top-2"} />
                <p className="text-name-column">
                  {dataTop[1]?.customer
                    ? dataTop[1]?.customer
                    : dataTop[1]?.collaborator}
                </p>
              </div>
            )}
            {dataTop.length > 0 && (
              <div className="div-item-top">
                <p>{dataTop[0].total_inviter}</p>
                <div className={"column-top-1"} />
                <p className="text-name-column">
                  {dataTop[0]?.customer
                    ? dataTop[0]?.customer
                    : dataTop[0]?.collaborator}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="title">{`${i18n.t("statistical_tables", {
        lng: lang,
      })}`}</p>
      <div className="mt-2">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: width <= 490 ? 1600 : 0 }}
        />
      </div>
      <div className="mt-1 div-pagination p-2">
        <p>
          {`${i18n.t("total", { lng: lang })}`}: {total}
        </p>
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
