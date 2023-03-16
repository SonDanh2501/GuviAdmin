import { SearchOutlined } from "@ant-design/icons";
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
  searchReportCollaborator,
} from "../../../../api/report";
import { formatMoney } from "../../../../helper/formatMoney";
import _debounce from "lodash/debounce";

import "./index.scss";
import LoadingPagination from "../../../../components/paginationLoading";
const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportManager = () => {
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState("");
  const [dataSearch, setDataSearch] = useState([]);
  const [totalSearch, setTotalSearch] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [totalColumn, setTotalColumn] = useState([]);
  const [type, setType] = useState("day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getReportCollaborator(
      0,
      20,
      moment().startOf("year").toISOString(),
      moment(new Date()).toISOString()
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setTotalColumn(res?.total);
      })
      .catch((err) => console.log(err));
  }, []);

  const onChange = (page) => {
    setIsLoading(true);
    setCurrentPage(page);
    const start =
      dataFilter.length > 0
        ? page * dataFilter.length - dataFilter.length
        : dataSearch.length > 0
        ? page * dataSearch.length - dataSearch.length
        : page * data.length - data.length;

    dataFilter.length > 0
      ? filterReportCollaborator(start, 20, startDate, endDate)
          .then((res) => {
            setIsLoading(false);
            setDataFilter(res?.data);
            setTotalFilter(res?.totalItem);
          })
          .catch((err) => {
            setIsLoading(false);
          })
      : dataSearch.length > 0
      ? searchReportCollaborator(0, 20, valueSearch)
          .then((res) => {
            setIsLoading(false);
            setDataSearch(res.data);
            setTotalSearch(res.totalItem);
          })
          .catch((err) => {
            setIsLoading(false);
          })
      : getReportCollaborator(start > 0 ? start : 0, 20)
          .then((res) => {
            setIsLoading(false);
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {
            setIsLoading(false);
          });
  };

  const onChangeFilter = useCallback((start, end) => {
    setIsLoading(true);
    const dayStart = moment(start).startOf("date").toISOString();
    const dayEnd = moment(end).endOf("date").toISOString();
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

  const handleSearch = useCallback(
    _debounce((value) => {
      setIsLoading(true);
      setValueSearch(value);
      searchReportCollaborator(0, 20, value)
        .then((res) => {
          setDataSearch(res.data);
          setTotalSearch(res.totalItem);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }, 1000),
    []
  );

  const columns = [
    {
      title: "CTV",
      render: (data) => {
        return (
          <div
            className="div-name-ctv"
            onClick={() =>
              navigate("/report/manage-report/report-details", {
                state: { id: data?.code_collaborator },
              })
            }
          >
            <a className="text-name-report"> {data?.full_name}</a>
            <a className="text-id">{data?.id_view}</a>
          </div>
        );
      },
      witdh: "10%",
    },
    {
      title: "Số ca",
      dataIndex: "total_order",
      align: "center",
    },
    {
      title: "Doanh số",
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_gross_income)}</a>
        );
      },
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">Phí dịch vụ trả Cộng tác viên.</p>
          </div>
        );
        return (
          <div className="div-title-collaborator">
            <div className="div-title">
              <a style={{ textAlign: "center" }}>Phí dịch vụ</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title">
              {totalColumn?.collabotator_fee > 0
                ? formatMoney(totalColumn?.collabotator_fee)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">
            {formatMoney(data?.total_collabotator_fee)}
          </a>
        );
      },
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              Doanh thu = Doanh số (-) Phí dịch vụ trả CTV
            </p>
          </div>
        );
        return (
          <div className="div-title-collaborator">
            <div className="div-title">
              <a style={{ textAlign: "center" }}>Doanh thu</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title">
              {totalColumn?.income > 0
                ? formatMoney(totalColumn?.income)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "right",
      render: (data) => {
        return <a className="text-money">{formatMoney(data?.total_income)}</a>;
      },
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">Tổng số tiền giảm giá</p>
          </div>
        );
        return (
          <div className="div-title-collaborator">
            <div className="div-title">
              <a style={{ textAlign: "center" }}>Giảm giá</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title">
              {totalColumn?.discount > 0
                ? formatMoney(totalColumn?.discount)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_discount)}</a>
        );
      },
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
          <div className="div-title-collaborator">
            <div className="div-title">
              <a style={{ textAlign: "center" }}>Doanh thu thuần</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title">
              {totalColumn?.net_income > 0
                ? formatMoney(totalColumn?.net_income)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_net_income)}</a>
        );
      },
    },
    {
      title: () => {
        return (
          <div className="div-title-collaborator">
            <a>Phí áp dụng</a>
            <a className="text-money-title">
              {totalColumn?.serviceFee > 0
                ? formatMoney(totalColumn?.serviceFee)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_serviceFee)}</a>
        );
      },
      align: "right",
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              Tổng tiền trên dịch vụ. Tổng hoá đơn = Doanh thu thuần (+) Phí áp
              dụng.
            </p>
          </div>
        );
        return (
          <div className="div-title-collaborator">
            <div className="div-title">
              <a style={{ textAlign: "center" }}>Tổng hoá đơn</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title">
              {totalColumn?.order_fee > 0
                ? formatMoney(totalColumn?.order_fee)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_order_fee)}</a>
        );
      },
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              Lợi nhuận = Doanh thu (+) Phí áp dụng (-) Giảm giá.
            </p>
          </div>
        );
        return (
          <div className="div-title-collaborator">
            <div className="div-title">
              <a style={{ textAlign: "center" }}>Lợi nhuận</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title">
              {totalColumn?.net_income_business > 0
                ? formatMoney(totalColumn?.net_income_business)
                : formatMoney(0)}
            </a>
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
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              % lợi nhuận = Tổng lợi nhuận (/) Doanh thu thuần.
            </p>
          </div>
        );
        return (
          <div className="div-title-collaborator">
            <div className="div-title">
              <a style={{ textAlign: "center" }}>% lợi nhuận</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return <a>{data?.percent_income ? data?.percent_income + "%" : ""}</a>;
      },
    },
  ];

  return (
    <div>
      <div className="div-header-report">
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
        <Input
          placeholder="Tìm kiếm"
          type="text"
          className="input-search-report"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div className="mt-3">
        <Table
          columns={columns}
          pagination={false}
          dataSource={
            dataFilter.length > 0
              ? dataFilter
              : dataSearch.length > 0
              ? dataSearch
              : data
          }
          locale={{
            emptyText: data.length > 0 ? <Empty /> : <Skeleton active={true} />,
          }}
        />
      </div>
      <div className="mt-2 div-pagination p-2">
        <a>
          Tổng:{" "}
          {totalFilter > 0
            ? totalFilter
            : totalSearch > 0
            ? totalSearch
            : total}
        </a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={
              totalFilter > 0
                ? totalFilter
                : totalSearch > 0
                ? totalSearch
                : total
            }
            showSizeChanger={false}
            pageSize={20}
          />
        </div>
      </div>
      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default ReportManager;
