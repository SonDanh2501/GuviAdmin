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
  getReportCustomer,
  getTotalCustomerDay,
  getTotalCustomerYear,
  getTotalReportCustomer,
} from "../../../../api/report";
import add from "../../../../assets/images/add.png";
import collaborator from "../../../../assets/images/collaborator.png";
import LoadingPagination from "../../../../components/paginationLoading";
import vi from "moment/locale/vi";
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

  useEffect(() => {
    getReportCustomer(
      moment().startOf("month").toISOString(),
      moment().endOf("month").toISOString()
    ).then((res) => console.log(res));
  });

  const timeWork = (data) => {
    const start = moment(new Date(data.date_work_schedule[0].date)).format(
      "HH:mm"
    );

    const timeEnd =
      Number(start?.slice(0, 2)) + data?.total_estimate + start?.slice(2, 5);

    return start + " - " + timeEnd;
  };

  const columns = [
    {
      title: "Mã",
      render: (data) => {
        return (
          <a
            className="text-id"
            onClick={() =>
              navigate("/details-order", {
                state: { id: data?._id },
              })
            }
          >
            {data?.id_view}
          </a>
        );
      },
    },
    {
      title: "Ngày tạo",
      render: (data) => {
        return (
          <div className="div-create">
            <a className="text-create">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </a>
            <a className="text-create">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Tên khách hàng",
      // dataIndex: ["id_customer", "full_name"],
      render: (data) => {
        return (
          <div
            onClick={() =>
              navigate("/group-order/manage-order/details-customer", {
                state: { id: data?.id_customer?._id },
              })
            }
            className="div-name"
          >
            <a>{data?.id_customer?.full_name}</a>
            <a>{data?.id_customer?.phone}</a>
          </div>
        );
      },
    },
    {
      title: "Dịch vụ",
      render: (data) => {
        return (
          <div className="div-service">
            <a className="text-service">
              {data?.type === "schedule"
                ? "Giúp việc cố định"
                : data?.type === "loop" && !data?.is_auto_order
                ? "Giúp việc theo giờ"
                : data?.type === "loop" && data?.is_auto_order
                ? "Lặp lại hàng tuần"
                : ""}
            </a>
            <a className="text-service">{timeWork(data)}</a>
          </div>
        );
      },
    },
    {
      title: "Ngày làm",
      render: (data) => {
        return (
          <div className="div-worktime">
            <a className="text-worktime">
              {" "}
              {moment(new Date(data?.date_work_schedule[0].date)).format(
                "DD/MM/YYYY"
              )}
            </a>
            <a className="text-worktime">
              {moment(new Date(data?.date_work_schedule[0].date))
                .locale("vi", vi)
                .format("dddd")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Địa điểm",
      render: (data) => <p className="text-address">{data?.address}</p>,
    },
    {
      title: "Cộng tác viên",
      render: (data) => (
        <>
          {!data?.id_collaborator ? (
            <a>Đang tìm kiếm</a>
          ) : (
            <div
              onClick={() =>
                navigate("/group-order/manage-order/details-collaborator", {
                  state: { id: data?.id_collaborator?._id },
                })
              }
              className="div-name"
            >
              <a className="text-collaborator">
                {data?.id_collaborator?.full_name}
              </a>
              <a>{data?.id_collaborator?.phone}</a>
            </div>
          )}
        </>
      ),
    },

    {
      title: "Trạng thái",
      render: (data) => (
        <a
          className={
            data?.status === "pending"
              ? "text-pending-order"
              : data?.status === "confirm"
              ? "text-confirm"
              : data?.status === "doing"
              ? "text-doing"
              : data?.status === "done"
              ? "text-done"
              : "text-cancel"
          }
        >
          {data?.status === "pending"
            ? "Đang chờ làm"
            : data?.status === "confirm"
            ? "Đã nhận"
            : data?.status === "doing"
            ? "Đang làm"
            : data?.status === "done"
            ? "Hoàn thành"
            : "Đã huỷ"}
        </a>
      ),
    },
  ];

  return (
    <div className="div-container-report-customer">
      <div className="header-report-customer">
        <div className="div-tab-header-service">
          <div className="div-img">
            <img src={collaborator} className="img" />
          </div>
          <div className="div-text-tab">
            <div className="div-t">
              <a className="text-tab-header">Khách hàng mới</a>
              <a className="text-tab-header">3</a>
            </div>
          </div>
        </div>

        <div className="div-tab-header-service">
          <div className="div-img">
            <img src={add} className="img" />
          </div>
          <div className="div-text-tab">
            <div className="div-t">
              <a className="text-tab-header">Tổng đơn KH mới</a>
              <a className="text-tab-header">3</a>
            </div>
          </div>
        </div>

        <div className="div-tab-header-service">
          <div className="div-img">
            <img src={collaborator} className="img" />
          </div>
          <div className="div-text-tab">
            <div className="div-t">
              <a className="text-tab-header">Khách hàng cũ</a>
              <a className="text-tab-header">3</a>
            </div>
          </div>
        </div>

        <div className="div-tab-header-service">
          <div className="div-img">
            <img src={add} className="img" />
          </div>
          <div className="div-text-tab">
            <div className="div-t">
              <a className="text-tab-header">Tổng đơn KH cũ</a>
              <a className="text-tab-header">3</a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 div-table">
        <a className="text-title">Dịch vụ theo khu vực</a>
        <div className="mt-4">
          <Table
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
