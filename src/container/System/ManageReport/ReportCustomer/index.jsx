import { DatePicker, Select, Table, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  getTotalCustomerDay,
  getTotalCustomerYear,
  getTotalReportCustomer,
} from "../../../../api/report";
import caculator from "../../../../assets/images/caculator.png";
import collaborator from "../../../../assets/images/collaborator.png";
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
  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dataChart = [];

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
      moment().startOf("month").toISOString(),
      moment().endOf("month").toISOString()
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
      title: "SỐ LƯỢT TẢI APPSTORE",
    },
    {
      title: "SỐ LƯỢT TẢI GOOGLE PLAY",
    },
    {
      key: "action",
    },
  ];

  data.map((item, index) => {
    dataChart.push({
      total: item?.total,
      month: index + 1,
    });
  });

  const onChange = (date, dateString) => {
    setIsLoading(true);
    getTotalCustomerYear(dateString)
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const onChangeMonth = (date, dateString) => {
    setIsLoading(true);

    getTotalCustomerDay(
      moment(dateString).startOf("month").toISOString(),
      moment(dateString).endOf("month").toISOString()
    )
      .then((res) => {
        setDataTable(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
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
      <div className="div-chart">
        <div className="div-time-area">
          <div>
            <a className="text-time">Thời gian</a>
            <DatePicker
              picker="year"
              defaultValue={moment()}
              onChange={onChange}
            />
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
        <div className="mt-5">
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
              <YAxis dataKey="total" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="total"
                fill="#4376CC"
                minPointSize={10}
                label={{ position: "centerTop", fill: "white" }}
                name="total"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <a className="text-title">SỐ LƯỢT ĐĂNG KÝ USER THEO THỜI GIAN</a>
      <div className="mt-3 div-table">
        <div>
          <a className="text-time">Thời gian</a>
          <DatePicker picker="month" onChange={onChangeMonth} />
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
