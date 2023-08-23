import { DatePicker, Image, Table } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getTotalCustomerDay,
  getTotalCustomerYear,
  getTotalReportCustomer,
} from "../../../../../api/report";
import caculator from "../../../../../assets/images/caculator.png";
import collaborator from "../../../../../assets/images/collaborator.png";
import CustomDatePicker from "../../../../../components/customDatePicker";
import LoadingPagination from "../../../../../components/paginationLoading";
import i18n from "../../../../../i18n";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import "./index.scss";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";
dayjs.extend(customParseFormat);

const ReportUser = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalMonth, setTotalMonth] = useState(0);
  const [totalDay, setTotalDay] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalYear, setTotalYear] = useState(0);
  const [year, setYear] = useState(0);
  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);

  const dataChart = [];

  const navigate = useNavigate();
  const yearFormat = "YYYY";

  useEffect(() => {
    getTotalReportCustomer(
      moment().startOf("month").toISOString(),
      moment().endOf("month").toISOString()
    )
      .then((res) => {
        setTotalMonth(res?.totalCustomer);
      })
      .catch((err) => {});
    getTotalReportCustomer(
      moment().startOf("date").toISOString(),
      moment().endOf("date").toISOString()
    )
      .then((res) => {
        setTotalDay(res?.totalCustomer);
      })
      .catch((err) => {});
    getTotalReportCustomer(
      moment(new Date("2020-01-01")).toISOString(),
      moment().endOf("date").toISOString()
    )
      .then((res) => {
        setTotal(res?.totalCustomer);
      })
      .catch((err) => {});

    getTotalCustomerYear(moment().year())
      .then((res) => {
        setData(res);
      })
      .catch((err) => {});

    setYear(moment().year());

    getTotalCustomerDay(
      moment().startOf("month").toISOString(),
      moment().endOf("date").toISOString()
    )
      .then((res) => {
        setDataTable(res);
      })
      .catch((err) => {
        console.log(err);
      });

    setStartDate(moment().startOf("month").toISOString());

    setEndDate(moment().toISOString());
  }, []);

  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      setTotalYear((sum += data[i].totalNew));
    }
  }, [data]);

  data.map((item, index) => {
    return dataChart.push({
      totalNew: item?.totalNew,
      totalOld: item?.totalOld,
      total: item?.totalAll,
      month: index + 1,
    });
  });

  const onChange = (date, dateString) => {
    setIsLoading(true);
    setYear(dateString);
    getTotalCustomerYear(dateString)
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const onChangeDay = () => {
    setIsLoading(true);
    getTotalCustomerDay(startDate, endDate)
      .then((res) => {
        setDataTable(res);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const setMonth = (month) => {
    let thg;
    switch (month) {
      case 1:
        thg = `${i18n.t("January", { lng: lang })}`;
        break;
      case 2:
        thg = `${i18n.t("February", { lng: lang })}`;
        break;
      case 3:
        thg = `${i18n.t("March", { lng: lang })}`;
        break;
      case 4:
        thg = `${i18n.t("April", { lng: lang })}`;
        break;
      case 5:
        thg = `${i18n.t("May", { lng: lang })}`;
        break;
      case 6:
        thg = `${i18n.t("June", { lng: lang })}`;
        break;
      case 7:
        thg = `${i18n.t("July", { lng: lang })}`;
        break;
      case 8:
        thg = `${i18n.t("August", { lng: lang })}`;
        break;
      case 9:
        thg = `${i18n.t("September", { lng: lang })}`;
        break;
      case 10:
        thg = `${i18n.t("October", { lng: lang })}`;
        break;
      case 11:
        thg = `${i18n.t("November", { lng: lang })}`;
        break;
      case 12:
        thg = `${i18n.t("December", { lng: lang })}`;
        break;
      default:
        break;
    }

    return thg;
  };

  const columns = [
    {
      title: `${i18n.t("TIME", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-create">
            <p className="text-create m-0">
              {moment(new Date(data?.day)).format("DD/MM/YYYY")}
            </p>
            {/* <a className="text-create">
              {moment(new Date(data?.day)).format("HH:mm")}
            </a> */}
          </div>
        );
      },
    },
    {
      title: `${i18n.t("NUMBER_REGISTER", { lng: lang })}`,
      dataIndex: ["total"],
      align: "center",
    },
    {
      title: `${i18n.t("NUMBER_CLICK_PAGE", { lng: lang })}`,
    },
    {
      title: `${i18n.t("NUMBER_DOWN_APPSTORE", { lng: lang })}`,
    },
    {
      title: `${i18n.t("NUMBER_DOWN_CHPLAY", { lng: lang })}`,
    },
    {
      key: "action",
      render: (data) => {
        return (
          <div
            className="btn-details"
            onClick={() =>
              navigate("/report/manage-report/details-register-customer", {
                state: { date: data?.day },
              })
            }
          >
            <p className="text-details m-0">{`${i18n.t("detail", {
              lng: lang,
            })}`}</p>
          </div>
        );
      },
    },
  ];

  const renderTooltipContent = (o) => {
    const { payload, label } = o;

    return (
      <div className="div-content-tool-chart">
        <p className="date-text">{setMonth(label)}</p>
        <p className="money-text">
          {`${i18n.t("total", { lng: lang })}`}:{" "}
          {payload?.length > 0
            ? payload[0]?.payload?.totalNew + payload[0]?.payload?.totalOld
            : 0}
        </p>
        <p className="money-text-new">
          {`${i18n.t("customer_new_sub", { lng: lang })}`}:{" "}
          {payload?.length > 0 ? payload[0]?.payload?.totalNew : 0}
        </p>
        <p className="money-text-old">
          {`${i18n.t("customer_old_sub", { lng: lang })}`}:{" "}
          {payload?.length > 0 ? payload[0]?.payload?.totalOld : 0}
        </p>
      </div>
    );
  };

  return (
    <div className="div-container-report-customer">
      <p className="text-title">{`${i18n.t("report_number_customer", {
        lng: lang,
      })}`}</p>
      <div className="header-report-customer">
        <div className="div-tab-header">
          <div className="div-img">
            <Image preview={false} src={collaborator} className="img" />
          </div>
          <div className="div-text-tab">
            <p className="text-tab-header">{`${i18n.t("total", {
              lng: lang,
            })}`}</p>
            <p className="text-tab-header">{total}</p>
          </div>
        </div>
        <div className="div-tab-header">
          <div className="div-img">
            <Image preview={false} src={caculator} className="img" />
            <p className="text-month">
              {moment()
                .locale("en")
                .localeData()
                .monthsShort(moment().locale("en"))}
            </p>
          </div>
          <div className="div-text-tab">
            <p className="text-tab-header">{`${i18n.t("in_month", {
              lng: lang,
            })}`}</p>
            <p className="text-tab-header">{totalMonth}</p>
          </div>
        </div>
        <div className="div-tab-header">
          <div className="div-img">
            <Image preview={false} src={caculator} className="img" />
            <p className="text-day">{moment().date()}</p>
          </div>
          <div className="div-text-tab">
            <p className="text-tab-header">{`${i18n.t("date", {
              lng: lang,
            })}`}</p>
            <p className="text-tab-header">{totalDay}</p>
          </div>
        </div>
      </div>
      <div className="div-chart-user">
        <div className="div-time-area">
          <div>
            <p className="text-time">{`${i18n.t("time", { lng: lang })}`}</p>
            <DatePicker
              picker="year"
              onChange={onChange}
              defaultValue={dayjs("2023", yearFormat)}
              format={yearFormat}
            />
          </div>
        </div>
        <div className="mt-3 divl-total">
          <p className="text-total-user">
            {`${i18n.t("total", { lng: lang })}`} user
          </p>
          <div className="div-total">
            <p className="text-number-total">{totalYear}</p>
          </div>
        </div>
        <div className="mt-3 ">
          <ResponsiveContainer width={"100%"} height={350}>
            <ComposedChart
              width={500}
              height={300}
              data={
                year === moment().year()
                  ? dataChart.slice(0, moment().utc().month() + 1)
                  : dataChart
              }
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barSize={50}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(tickItem) => setMonth(tickItem)}
              />
              <YAxis />
              <Tooltip content={renderTooltipContent} />
              <Legend />

              <Bar
                dataKey="totalOld"
                fill="#82ca9d"
                minPointSize={20}
                barSize={40}
                name={`${i18n.t("customer_old", { lng: lang })}`}
                stackId="a"
              />

              <Bar
                dataKey="totalNew"
                fill="#4376CC"
                minPointSize={20}
                barSize={40}
                name={`${i18n.t("customer_new", { lng: lang })}`}
                stackId="a"
                label={{ position: "top", fill: "black", fontSize: 14 }}
              />
              <Line
                type="monotone"
                dataKey="totalNew"
                stroke="#ff7300"
                name={`${i18n.t("customer_new", { lng: lang })}`}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p className="text-title">{`${i18n.t("NUMBER_REGISTER_TIME", {
        lng: lang,
      })}`}</p>
      <div className="mt-3 div-table">
        <div className="div-header-table">
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
                  {moment(new Date(endDate)).format("DD/MM/YYYY")}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <Table
            dataSource={dataTable.reverse()}
            columns={columns}
            pagination={false}
            rowKey={(record) => record._id}
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRowKeys(selectedRowKeys);
              },
            }}
            scroll={{
              x: width <= 490 ? 1600 : 0,
            }}
          />
        </div>
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};
export default ReportUser;
