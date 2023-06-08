import { Button, DatePicker, Pagination, Popover, Progress, Table } from "antd";
import moment from "moment";
import vi from "moment/locale/vi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReportConnectionCustomer,
  getReportCustomer,
  getReportCustomerNewOld,
} from "../../../../../api/report";
import add from "../../../../../assets/images/add.png";
import collaborator from "../../../../../assets/images/collaborator.png";
import LoadingPagination from "../../../../../components/paginationLoading";
import "./index.scss";
import { formatMoney } from "../../../../../helper/formatMoney";
import CustomDatePicker from "../../../../../components/customDatePicker";
const width = window.innerWidth;

const ReportCustomer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rowIndex, setRowIndex] = useState();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [totalColumn, setTotalColumn] = useState([]);
  const [customerNew, setCustomerNew] = useState(0);
  const [customerOld, setCustomerOld] = useState(0);
  const [moneyNew, setMoneyNew] = useState(0);
  const [moneyOld, setMoneyOld] = useState(0);
  const [totalOrderNew, setTotalOrderNew] = useState([]);
  const [totalOrderOld, setTotalOrderOld] = useState([]);
  const [type, setType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    moment().startOf("month").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());

  const navigate = useNavigate();

  useEffect(() => {
    getReportCustomer(0, 20, startDate, endDate, type)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setTotalColumn(res?.total[0]);
      })
      .catch((err) => {});

    getReportCustomer(0, 20, startDate, endDate, "new")
      .then((res) => {
        setCustomerNew(res?.totalItem);
        setTotalOrderNew(res?.total[0]?.total_item);
        setMoneyNew(res?.total[0]?.total_net_income_business);
      })
      .catch((err) => {});

    getReportCustomer(0, 20, startDate, endDate, "old")
      .then((res) => {
        setCustomerOld(res?.totalItem);
        setTotalOrderOld(res?.total[0]?.total_item);
        setMoneyOld(res?.total[0]?.total_net_income_business);
      })
      .catch((err) => {});
  }, []);

  const onChangeDay = () => {
    setIsLoading(true);
    setCurrentPage(1);
    getReportCustomer(0, 20, startDate, endDate, type)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setTotalColumn(res?.total[0]);
        setIsLoading(false);
      })

      .catch((err) => {
        setIsLoading(false);
      });

    getReportCustomer(0, 20, startDate, endDate, "new")
      .then((res) => {
        setCustomerNew(res?.totalItem);
        setTotalOrderNew(res?.total[0]?.total_item);
        setMoneyNew(res?.total[0]?.total_net_income_business);
      })
      .catch((err) => {});

    getReportCustomer(0, 20, startDate, endDate, "old")
      .then((res) => {
        setCustomerOld(res?.totalItem);
        setTotalOrderOld(res?.total[0]?.total_item);
        setMoneyOld(res?.total[0]?.total_net_income_business);
      })
      .catch((err) => {});
  };

  const onChange = (page) => {
    setCurrentPage(page);
    const lengthData = data.length < 20 ? 20 : data.length;
    const start = page * lengthData - lengthData;
    setStartPage(start);
    getReportCustomer(start, 20, startDate, endDate, type)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setTotalColumn(res?.total[0]);
      })
      .catch((err) => {});
  };

  const onChangeTab = (value) => {
    setType(value);
    setCurrentPage(1);
    getReportCustomer(0, 20, startDate, endDate, value)
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

  const columns = [
    {
      title: () => {
        return (
          <div className="div-title-collaborator-id">
            <div className="div-title-report">
              <a className="text-title-column">Khách hàng</a>
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
                state: { id: data?.id_customer?._id },
              })
            }
          >
            <a className="text-name-report"> {data?.id_customer?.full_name}</a>
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
              Tổng tiền trên dịch vụ. Tổng hoá đơn = Doanh số - Giảm giá + Phi
              áp dụng
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
    <div className="div-container-report-customer">
      <h3>Báo cáo đơn hàng theo khách hàng</h3>
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
      <div className="header-report-customer">
        <div className="div-tab-header-service">
          <div className="div-img">
            <img src={collaborator} className="img" />
          </div>
          <div className="div-text-tab">
            <div className="div-t">
              <a className="text-tab-header">Khách hàng mới / Đơn</a>
              <a className="text-tab-header">{customerNew}</a>
            </div>
          </div>
        </div>

        <div className="div-tab-header-service">
          <div className="div-img">
            <img src={add} className="img" />
          </div>
          <div className="div-text-tab">
            <div className="div-t">
              <a className="text-tab-header">Tổng ca</a>
              <a className="text-tab-header">
                {totalOrderNew ? totalOrderNew : 0}
              </a>
            </div>
          </div>
          <div className="div-text-tab">
            <div className="div-t">
              <a className="text-tab-header">Tổng tiền</a>
              <a className="text-tab-header">
                {formatMoney(moneyNew ? moneyNew : 0)}
              </a>
            </div>
          </div>
        </div>

        <div className="div-tab-header-service">
          <div className="div-img">
            <img src={collaborator} className="img" />
          </div>
          <div className="div-text-tab">
            <div className="div-t">
              <a className="text-tab-header">Khách hàng cũ / Đơn</a>
              <a className="text-tab-header">{customerOld}</a>
            </div>
          </div>
        </div>

        <div className="div-tab-header-service">
          <div className="div-img">
            <img src={add} className="img" />
          </div>
          <div className="div-text-tab">
            <div className="div-t">
              <a className="text-tab-header">Tổng ca</a>
              <a className="text-tab-header">
                {totalOrderOld ? totalOrderOld : 0}
              </a>
            </div>
          </div>
          <div className="div-text-tab">
            <div className="div-t">
              <a className="text-tab-header">Tổng tiền</a>
              <a className="text-tab-header">{formatMoney(moneyOld)}</a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 div-table">
        <div className="div-tab-customer-report">
          {TAB?.map((item, index) => {
            return (
              <div
                key={index}
                className={item?.value === type ? "div-tab-select" : "div-tab"}
                onClick={() => onChangeTab(item?.value)}
              >
                <a className="title-tab">{item?.title}</a>
              </div>
            );
          })}
        </div>
        <div className="mt-4">
          <Table
            columns={columns}
            pagination={false}
            rowKey={(record) => record._id}
            dataSource={data}
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
            scroll={
              width <= 490
                ? {
                    x: 1600,
                  }
                : null
            }
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
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};
export default ReportCustomer;

const TAB = [
  {
    title: "Tất cả",
    value: "all",
  },
  {
    title: "Khách hàng mới",
    value: "new",
  },
  {
    title: "Khách hàng cũ",
    value: "old",
  },
];
