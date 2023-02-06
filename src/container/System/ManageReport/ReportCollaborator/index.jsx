import {
  Button,
  DatePicker,
  Dropdown,
  Empty,
  Input,
  Pagination,
  Popover,
  Select,
  Skeleton,
  Space,
  Spin,
  Table,
} from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  filterReportCollaborator,
  getReportCollaborator,
} from "../../../../api/report";
import { formatMoney } from "../../../../helper/formatMoney";
import "./index.scss";
const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportManager = () => {
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [type, setType] = useState("day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getReportCollaborator(0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));
  }, []);

  const columns = [
    {
      title: "Mã CTV",
      render: (data) => {
        return (
          <a
            onClick={() =>
              navigate("/report/manage-report/report-details", {
                state: { id: data?.code_collaborator },
              })
            }
          >
            {data?.code_collaborator}{" "}
          </a>
        );
      },
      width: "10%",
    },
    {
      title: "Tên CTV",
      // dataIndex: "full_name",
      render: (data) => {
        return (
          <a
            onClick={() =>
              navigate("/report/manage-report/report-details", {
                state: { id: data?.code_collaborator },
              })
            }
          >
            {data?.full_name}
          </a>
        );
      },
      width: "15%",
    },
    {
      title: "Số ca làm",
      dataIndex: "total_order",
      align: "center",
      width: "7%",
    },
    {
      title: "Doanh thu",
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_gross_income)}</a>
        );
      },
      width: "7%",
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">Tổng số tiền giảm giá</p>
          </div>
        );
        return (
          <div className="div-title-column">
            <a>Giảm giá</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_discount)}</a>
        );
      },
      width: "8%",
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              Số tiền thu được sau khi trừ toàn bộ các giảm giá. Doanh thu thuần
              = Doanh thu (-) Giảm giá.
            </p>
          </div>
        );
        return (
          <div className="div-title-column">
            <a>Doanh thu thuần</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_net_income)}</a>
        );
      },
      width: "12%",
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              Tổng tiền trên dịch vụ. Tổng hoá đơn = Doanh thu thuần (+) Phí Hệ
              thống.
            </p>
          </div>
        );
        return (
          <div className="div-title-column">
            <a>Tổng</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_order_fee)}</a>
        );
      },
      width: "7%",
    },
    {
      title: "Phí dịch vụ trả CTV",
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">
            {formatMoney(data?.total_collabotator_fee)}
          </a>
        );
      },
      width: "12%",
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              Tông lợi nhuận từ các dịch vụ. Tổng lợi nhuận = Doanh thu thuần
              (-) Phí CTV.
            </p>
          </div>
        );
        return (
          <div className="div-title-column">
            <a>Tổng lợi nhuận</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">
            {formatMoney(data?.total_net_income_business)}
          </a>
        );
      },
      width: "12%",
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              %lợi nhuận = Tổng lợi nhuận (/) Doanh thu thuần.
            </p>
          </div>
        );
        return (
          <div className="div-title-column">
            <a>% lợi nhuận</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "center",
      dataIndex: "percent_income",
    },
  ];

  const onChange = (page) => {
    setIsLoading(true);
    setCurrentPage(page);
    const start =
      dataFilter.length > 0
        ? page * dataFilter.length - dataFilter.length
        : page * data.length - data.length;

    dataFilter.length > 0
      ? filterReportCollaborator(start, 20, startDate, endDate)
          .then((res) => {
            setIsLoading(false);
            setDataFilter(res?.data);
            setTotalFilter(res?.totalItem);
          })
          .catch((err) => console.log(err))
      : getReportCollaborator(start > 0 ? start : 0, 20)
          .then((res) => {
            setIsLoading(false);
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => console.log(err));
  };

  const onChangeFilter = useCallback((start, end) => {
    setIsLoading(true);
    const dayStart = moment(start).toISOString();
    const dayEnd = moment(end).toISOString();
    filterReportCollaborator(0, 20, dayStart, dayEnd)
      .then((res) => {
        setIsLoading(false);
        setDataFilter(res?.data);
        setTotalFilter(res?.totalItem);
      })
      .catch((err) => console.log(err));
    setStartDate(dayStart);
    setEndDate(dayEnd);
  }, []);

  return (
    <div>
      <div>
        <div className="div-date">
          <Input.Group compact>
            <Select
              defaultValue={type}
              onChange={(e) => setType(e)}
              className="input-picker"
            >
              <Option value="day">Ngày</Option>
              <Option value="week">Tuần </Option>
              <Option value="month">Tháng</Option>
              <Option value="quarter">Quý</Option>
            </Select>
          </Input.Group>
          <div>
            <RangePicker
              picker={type}
              className="picker"
              onChange={(e) => onChangeFilter(e[0]?.$d, e[1]?.$d)}
            />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <Table
          columns={columns}
          pagination={false}
          dataSource={dataFilter.length > 0 ? dataFilter : data}
          locale={{
            emptyText: data.length > 0 ? <Empty /> : <Skeleton active={true} />,
          }}
        />
      </div>
      <div className="mt-2 div-pagination p-2">
        <a>Tổng: {totalFilter > 0 ? totalFilter : total}</a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={totalFilter > 0 ? totalFilter : total}
            showSizeChanger={false}
            pageSize={20}
          />
        </div>
      </div>
      {isLoading && <Spin className="loading" size="large" />}
    </div>
  );
};

export default ReportManager;
