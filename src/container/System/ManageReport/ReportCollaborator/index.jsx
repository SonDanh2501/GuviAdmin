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
import CustomDatePicker from "../../../../components/customDatePicker";
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
      moment(moment().startOf("month").toISOString())
        .add(7, "hours")
        .toISOString(),
      moment(moment(new Date()).toISOString()).add(7, "hours").toISOString()
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setTotalColumn(res?.total[0]);
      })
      .catch((err) => console.log(err));

    setStartDate(
      moment(moment().startOf("month").toISOString())
        .add(7, "hours")
        .toISOString()
    );
    setEndDate(
      moment(moment(new Date()).toISOString()).add(7, "hours").toISOString()
    );
  }, []);

  console.log(totalColumn);

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
            setData(res?.data);
            setTotal(res?.totalItem);
            setTotalColumn(res?.total[0]);
          })
          .catch((err) => {
            setIsLoading(false);
          })
      : dataSearch.length > 0
      ? searchReportCollaborator(0, 20, valueSearch)
          .then((res) => {
            setIsLoading(false);
            setData(res?.data);
            setTotal(res?.totalItem);
            setTotalColumn(res?.total[0]);
          })
          .catch((err) => {
            setIsLoading(false);
          })
      : getReportCollaborator(start > 0 ? start : 0, 20, startDate, endDate)
          .then((res) => {
            setIsLoading(false);
            setData(res?.data);
            setTotal(res?.totalItem);
            setTotalColumn(res?.total[0]);
          })
          .catch((err) => {
            setIsLoading(false);
          });
  };

  const onChangeDay = () => {
    setIsLoading(true);
    filterReportCollaborator(0, 20, startDate, endDate)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setTotalColumn(res?.total[0]);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      setIsLoading(true);
      setValueSearch(value);
      searchReportCollaborator(0, 20, value)
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
          setTotalColumn(res?.total[0]);
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
      title: () => {
        return (
          <div className="div-title-collaborator-id">
            <div className="div-title-report">
              <a className="text-title-column">Cộng tác viên</a>
            </div>
            <div className="div-top"></div>
          </div>
        );
      },
      align: "left",
      render: (data) => {
        return (
          <div
            className="div-name-ctv-report"
            onClick={() =>
              navigate("/report/manage-report/report-details", {
                state: {
                  id: data?.id_collaborator?._id,
                  dateStart: startDate,
                  dateEnd: endDate,
                },
              })
            }
          >
            <a className="text-name-report">
              {data?.id_collaborator?.full_name}
            </a>
            {/* <a className="text-id">{data?.id_view}</a> */}
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <div className="div-title-collaborator">
            <div className="div-title-report">
              <a className="text-title-column">Số ca</a>
            </div>
            <a className="text-money-title">
              {totalColumn?.total_item > 0 ? totalColumn?.total_item : 0}
            </a>
          </div>
        );
      },
      render: (data) => {
        return <a className="text-money">{data?.total_item}</a>;
      },
      align: "center",
      sorter: (a, b) => a.total_item - b.total_item,
    },
    {
      title: () => {
        return (
          <div className="div-title-collaborator">
            <div className="div-title-report">
              <a className="text-title-column">Doanh số</a>
            </div>
            <a className="text-money-title">
              {totalColumn?.total_gross_income > 0
                ? formatMoney(totalColumn?.total_gross_income)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_gross_income)}</a>
        );
      },
      sorter: (a, b) => a.total_gross_income - b.total_gross_income,
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
            <div className="div-title-report">
              <a className="text-title-column">Phí dịch vụ</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title">
              {totalColumn?.total_collabotator_fee > 0
                ? formatMoney(totalColumn?.total_collabotator_fee)
                : formatMoney(0)}
            </a>
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
      sorter: (a, b) => a.total_collabotator_fee - b.total_collabotator_fee,
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
            <div className="div-title-report">
              <a className="text-title-column-blue">Doanh thu</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title-blue">
              {totalColumn?.total_income > 0
                ? formatMoney(totalColumn?.total_income)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="text-money-blue">{formatMoney(data?.total_income)}</a>
        );
      },
      sorter: (a, b) => a.total_income - b.total_income,
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
            <div className="div-title-report">
              <a className="text-title-column">Giảm giá</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title">
              {totalColumn?.total_discount > 0
                ? formatMoney(totalColumn?.total_discount)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_discount)}</a>
        );
      },
      sorter: (a, b) => a.total_discount - b.total_discount,
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
            <div className="div-title-report">
              <a className="text-title-column">Doanh thu thuần</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title">
              {totalColumn?.total_net_income > 0
                ? formatMoney(totalColumn?.total_net_income)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_net_income)}</a>
        );
      },
      sorter: (a, b) => a.total_net_income - b.total_net_income,
    },
    {
      title: () => {
        return (
          <div className="div-title-collaborator">
            <a>Phí áp dụng</a>
            <a className="text-money-title">
              {totalColumn?.total_service_fee > 0
                ? formatMoney(totalColumn?.total_service_fee)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_service_fee)}</a>
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
          <div className="div-title-collaborator">
            <div className="div-title-report">
              <a className="text-title-column">Tổng hoá đơn</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title">
              {totalColumn?.total_order_fee > 0
                ? formatMoney(totalColumn?.total_order_fee)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_order_fee)}</a>
        );
      },
      sorter: (a, b) => a.total_order_fee - b.total_order_fee,
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
            <div className="div-title-report">
              <a className="text-title-column">Lợi nhuận</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title">
              {totalColumn?.total_net_income_business > 0
                ? formatMoney(totalColumn?.total_net_income_business)
                : formatMoney(0)}
            </a>
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
      sorter: (a, b) =>
        a.total_net_income_business - b.total_net_income_business,
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
            <div className="div-title-report">
              <a className="text-title-column">% lợi nhuận</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <div className="div-top"></div>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="text-money">
            {data?.percent_income ? data?.percent_income + "%" : ""}
          </a>
        );
      },
    },
  ];

  return (
    <div>
      <div className="div-header-report">
        <div className="div-date">
          <CustomDatePicker
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onClick={onChangeDay}
            onCancel={() => {}}
          />
          {startDate && (
            <a className="text-date">
              {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
              {moment(endDate).utc().format("DD/MM/YYYY")}
            </a>
          )}
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
          dataSource={data}
          // locale={{
          //   emptyText: data.length > 0 ? <Empty /> : <Skeleton active={true} />,
          // }}
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

export default ReportManager;
