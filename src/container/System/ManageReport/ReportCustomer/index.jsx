import { DatePicker, Select, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import {
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
} from "recharts";
import {
  getTotalCustomerDay,
  getTotalCustomerYear,
  getTotalReportCustomer,
} from "../../../../api/report";
import caculator from "../../../../assets/images/caculator.png";
import collaborator from "../../../../assets/images/collaborator.png";
import CustomDatePicker from "../../../../components/customDatePicker";
import LoadingPagination from "../../../../components/paginationLoading";
import "./index.scss";

const { RangePicker } = DatePicker;

const ReportCustomer = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rowIndex, setRowIndex] = useState();
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

  const dataChart = [];

  const navigate = useNavigate();

  useEffect(() => {
    getTotalReportCustomer(
      moment(moment().startOf("month").toISOString())
        .add(7, "hours")
        .toISOString(),
      moment(moment().endOf("month").toISOString())
        .add(7, "hours")
        .toISOString()
    )
      .then((res) => {
        setTotalMonth(res?.totalCustomer);
      })
      .catch((err) => {});
    getTotalReportCustomer(
      moment(moment().startOf("date").toISOString())
        .add(7, "hours")
        .toISOString(),
      moment(moment().endOf("date").toISOString()).add(7, "hours").toISOString()
    )
      .then((res) => {
        setTotalDay(res?.totalCustomer);
      })
      .catch((err) => {});
    getTotalReportCustomer(
      moment(new Date("2020-01-01")).toISOString(),
      moment(new Date()).toISOString()
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

    getTotalCustomerDay(
      moment(moment().startOf("month").toISOString())
        .add(7, "hours")
        .toISOString(),
      moment(new Date()).toISOString()
    )
      .then((res) => {
        setDataTable(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      setTotalYear((sum += data[i].total));
    }
  }, [data]);

  data.map((item, index) => {
    dataChart.push({
      total: item?.total,
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

  const columns = [
    {
      title: "THỜI GIAN",
      render: (data) => {
        return (
          <div className="div-create">
            <a className="text-create">
              {moment(new Date(data?.day)).format("DD/MM/YYYY")}
            </a>
            <a className="text-create">
              {moment(new Date(data?.day)).format("HH:mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: "SỐ LƯỢT ĐĂNG KÝ",
      dataIndex: ["total"],
      align: "center",
    },
    {
      title: "SỐ LƯỢT CLICK TRANG",
    },
    {
      title: "SỐ LƯỢT TẢI APPSTORE",
    },
    {
      title: "SỐ LƯỢT TẢI GOOGLE PLAY",
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
            <a className="text-details">Chi tiết</a>
          </div>
        );
      },
    },
  ];

  const renderTooltipContent = (o) => {
    const { payload, label } = o;

    return (
      <div className="div-content-tool-chart">
        <a className="date-text">Tháng {label}</a>

        <a className="money-text">
          Số người đăng kí:{" "}
          {payload?.length > 0 ? payload[0]?.payload?.total : 0}
        </a>
      </div>
    );
  };

  return (
    <div className="div-container-report-customer">
      <a className="text-title">BÁO CÁO SỐ LƯỢNG USER</a>
      <div className="header-report-customer">
        <div className="div-tab-header">
          <div className="div-img">
            <img src={collaborator} className="img" />
          </div>
          <div className="div-text-tab">
            <a className="text-tab-header">Tổng</a>
            <a className="text-tab-header">{total}</a>
          </div>
        </div>
        <div className="div-tab-header">
          <div className="div-img">
            <img src={caculator} className="img" />
            <a className="text-month">
              {moment()
                .locale("en")
                .localeData()
                .monthsShort(moment().locale("en"))}
            </a>
          </div>
          <div className="div-text-tab">
            <a className="text-tab-header">Trong tháng</a>
            <a className="text-tab-header">{totalMonth}</a>
          </div>
        </div>
        <div className="div-tab-header">
          <div className="div-img">
            <img src={caculator} className="img" />
            <a className="text-day">{moment().date()}</a>
          </div>
          <div className="div-text-tab">
            <a className="text-tab-header">Ngày</a>
            <a className="text-tab-header">{totalDay}</a>
          </div>
        </div>
      </div>
      <div className="div-chart-user">
        <div className="div-time-area">
          <div>
            <a className="text-time">Thời gian</a>
            <DatePicker picker="year" onChange={onChange} />
          </div>
          <div>
            <a className="text-area">Khu vực</a>
            <Select
              defaultValue="Hồ Chí Minh"
              style={{ width: 150 }}
              //   onChange={handleChange}
              options={[{ value: "78", label: "Hồ Chí Minh" }]}
            />
          </div>
        </div>
        <div className="mt-3 divl-total">
          <a className="text-total-user">Tổng user</a>
          <div className="div-total">
            <a className="text-number-total">{totalYear}</a>
          </div>
        </div>
        <div className="mt-3">
          <ResponsiveContainer width={"100%"} height={350} min-width={350}>
            <BarChart
              width={500}
              height={300}
              data={dataChart}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barSize={50}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(tickItem) => "Tháng " + tickItem}
              />
              <YAxis />
              <Tooltip content={renderTooltipContent} />
              <Legend />
              <Bar
                dataKey="total"
                fill="#4376CC"
                minPointSize={5}
                barSize={50}
                label={{ position: "centerTop", fill: "white" }}
                name="Khách hàng"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <a className="text-title">SỐ LƯỢT ĐĂNG KÝ USER THEO THỜI GIAN</a>
      <div className="mt-3 div-table">
        <div className="div-header-table">
          <div className="div-date">
            <CustomDatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onClick={onChangeDay}
            />
            {startDate && (
              <a className="text-date">
                {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
                {moment(new Date(endDate)).format("DD/MM/YYYY")}
              </a>
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
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  //   setItemEdit(record);
                  setRowIndex(rowIndex);
                },
              };
            }}
          />
        </div>
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};
export default ReportCustomer;
