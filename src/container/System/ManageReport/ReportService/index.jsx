import { DatePicker, Select, Table, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
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

const ReportService = () => {
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

  const navigate = useNavigate();

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

  return (
    <div className="div-container-report-customer">
      <div className="header-report-customer">
        <div className="div-tab-header">
          <div className="div-img">
            <img src={collaborator} className="img" />
          </div>
          <div className="div-text-tab">
            <a className="text-tab-header">Tổng user cũ</a>
            <a className="text-tab-header">{total}</a>
          </div>
        </div>
        <div className="div-tab-header">
          <div className="div-img">
            <img src={collaborator} className="img" />
          </div>
          <div className="div-text-tab">
            <a className="text-tab-header">Tổng user mới</a>
            <a className="text-tab-header">{totalMonth}</a>
          </div>
        </div>
      </div>

      <div className="mt-5 div-table">
        <a className="text-title">Dịch vụ đã hoàn thành</a>
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
export default ReportService;
