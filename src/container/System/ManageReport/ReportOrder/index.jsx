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
  getReportOrder,
  searchReportCollaborator,
} from "../../../../api/report";
import { formatMoney } from "../../../../helper/formatMoney";
import _debounce from "lodash/debounce";

import "./index.scss";
import LoadingPagination from "../../../../components/paginationLoading";
const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportOrder = () => {
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState("");
  const [dataSearch, setDataSearch] = useState([]);
  const [totalSearch, setTotalSearch] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [type, setType] = useState("day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getReportOrder(
      0,
      20,
      moment().startOf("year").toISOString(),
      moment(new Date()).toISOString()
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));
  }, []);

  const columns = [
    {
      title: "Mã đơn",
      render: (data) => (
        <a
          className="text-id "
          onClick={() =>
            navigate("/details-order", {
              state: { id: data?._id },
            })
          }
        >
          {data?.id_view}
        </a>
      ),
    },
    {
      title: "Số ca",
    },
    {
      title: "Doanh số",
      align: "center",
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
          <div className="div-title-column">
            <a style={{ textAlign: "center" }}>Phí dịch vụ</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "center",
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
          <div className="div-title-column">
            <a style={{ textAlign: "center" }}>Doanh thu</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "center",
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
          <div className="div-title-column">
            <a style={{ textAlign: "center" }}>Giảm giá</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "center",
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
          <div className="div-title-column">
            <a style={{ textAlign: "center" }}>Doanh thu thuần</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_net_income)}</a>
        );
      },
    },
    {
      title: "Phí áp dụng",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_serviceFee)}</a>
        );
      },
      align: "center",
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
          <div className="div-title-column">
            <a style={{ textAlign: "center" }}>Tổng hoá đơn</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "center",
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
          <div className="div-title-column">
            <a style={{ textAlign: "center" }}>Lợi nhuận</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "center",
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
          <div className="div-title-column">
            <a style={{ textAlign: "center" }}>% lợi nhuận</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return <a>{data?.percent_income ? data?.percent_income + "%" : ""}</a>;
      },
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
      ? getReportOrder(start, 20, startDate, endDate)
          .then((res) => {
            setIsLoading(false);
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {
            setIsLoading(false);
          })
      : getReportOrder(start > 0 ? start : 0, 20, startDate, endDate)
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
    getReportOrder(0, 20, dayStart, dayEnd)
      .then((res) => {
        setIsLoading(false);
        setData(res?.data);
        setTotal(res?.totalItem);
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
        {/* <Input
          placeholder="Tìm kiếm"
          type="text"
          className="input-search-report"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
        /> */}
      </div>
      <div className="mt-3">
        <Table
          columns={columns}
          pagination={false}
          dataSource={data}
          locale={{
            emptyText: data.length > 0 ? <Empty /> : <Skeleton active={true} />,
          }}
        />
      </div>
      <div className="mt-2 div-pagination p-2">
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
      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default ReportOrder;
