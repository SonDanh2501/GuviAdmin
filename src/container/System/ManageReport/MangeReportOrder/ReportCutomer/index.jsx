import { Image, Pagination, Popover, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getReportCustomer } from "../../../../../api/report";
import add from "../../../../../assets/images/add.png";
import collaborator from "../../../../../assets/images/collaborator.png";
import CustomDatePicker from "../../../../../components/customDatePicker";
import LoadingPagination from "../../../../../components/paginationLoading";
import { formatMoney } from "../../../../../helper/formatMoney";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";
import i18n from "../../../../../i18n";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import "./index.scss";

const ReportCustomer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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
    moment().subtract(30, "d").startOf("date").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getReportCustomer(
      0,
      20,
      moment().subtract(30, "d").startOf("date").toISOString(),
      moment().endOf("date").toISOString(),
      "all"
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setTotalColumn(res?.total[0]);
      })
      .catch((err) => {});

    getReportCustomer(
      0,
      20,
      moment().subtract(30, "d").startOf("date").toISOString(),
      moment().endOf("date").toISOString(),
      "new"
    )
      .then((res) => {
        setCustomerNew(res?.totalItem);
        setTotalOrderNew(res?.total[0]?.total_item);
        setMoneyNew(res?.total[0]?.total_net_income_business);
      })
      .catch((err) => {});

    getReportCustomer(
      0,
      20,
      moment().subtract(30, "d").startOf("date").toISOString(),
      moment().endOf("date").toISOString(),
      "old"
    )
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
          <div className="div-title-customer-id">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("customer", {
                lng: lang,
              })}`}</p>
            </div>
            <div className="div-top"></div>
          </div>
        );
      },
      align: "left",
      render: (data) => {
        return (
          <Link
            to={`/profile-customer/${data?.id_customer?._id}`}
            className="div-name-kh-report"
          >
            <p className="text-name-report"> {data?.id_customer?.full_name}</p>
          </Link>
        );
      },
    },
    {
      title: () => {
        return (
          <div className="div-title-customer">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("shift", {
                lng: lang,
              })}`}</p>
            </div>
            <p className="text-money-title">
              {totalColumn?.total_item > 0 ? totalColumn?.total_item : 0}
            </p>
          </div>
        );
      },
      render: (data) => {
        return <p className="text-money">{data?.total_item}</p>;
      },
      align: "center",
      sorter: (a, b) => a.total_item - b.total_item,
    },
    {
      title: () => {
        return (
          <div className="div-title-customer">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("sales", {
                lng: lang,
              })}`}</p>
            </div>
            <p className="text-money-title">
              {totalColumn?.total_gross_income > 0
                ? formatMoney(totalColumn?.total_gross_income)
                : formatMoney(0)}
            </p>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">{formatMoney(data?.total_gross_income)}</p>
        );
      },
      sorter: (a, b) => a.total_gross_income - b.total_gross_income,
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">{`${i18n.t(
              "service_fee_pay_collaborator",
              {
                lng: lang,
              }
            )}`}</p>
          </div>
        );
        return (
          <div className="div-title-customer">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("service_fee", {
                lng: lang,
              })}`}</p>
              <Popover
                content={content}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                  width: 200,
                }}
              >
                <div>
                  <i class="uil uil-question-circle icon-question"></i>
                </div>
              </Popover>
            </div>
            <p className="text-money-title">
              {totalColumn?.total_collabotator_fee > 0
                ? formatMoney(totalColumn?.total_collabotator_fee)
                : formatMoney(0)}
            </p>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">
            {formatMoney(data?.total_collabotator_fee)}
          </p>
        );
      },
      sorter: (a, b) => a.total_collabotator_fee - b.total_collabotator_fee,
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              {`${i18n.t("revenue_sales", { lng: lang })}`}
            </p>
          </div>
        );
        return (
          <div className="div-title-customer">
            <div className="div-title-report">
              <p className="text-title-column-blue">{`${i18n.t("revenue", {
                lng: lang,
              })}`}</p>
              <Popover
                content={content}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                  width: 300,
                }}
              >
                <div>
                  <i class="uil uil-question-circle icon-question"></i>
                </div>
              </Popover>
            </div>
            <p className="text-money-title-blue">
              {totalColumn?.total_income > 0
                ? formatMoney(totalColumn?.total_income)
                : formatMoney(0)}
            </p>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money-blue">{formatMoney(data?.total_income)}</p>
        );
      },
      sorter: (a, b) => a.total_income - b.total_income,
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">{`${i18n.t("total_discount", {
              lng: lang,
            })}`}</p>
          </div>
        );
        return (
          <div className="div-title-customer">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("discount", {
                lng: lang,
              })}`}</p>
              <Popover
                content={content}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                  width: 200,
                }}
              >
                <div>
                  <i class="uil uil-question-circle icon-question"></i>
                </div>
              </Popover>
            </div>
            <p className="text-money-title">
              {totalColumn?.total_discount > 0
                ? formatMoney(totalColumn?.total_discount)
                : formatMoney(0)}
            </p>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">{formatMoney(data?.total_discount)}</p>
        );
      },
      sorter: (a, b) => a.total_discount - b.total_discount,
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              {`${i18n.t("note_net_revenue", { lng: lang })}`}
            </p>
          </div>
        );
        return (
          <div className="div-title-customer">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("net_revenue", {
                lng: lang,
              })}`}</p>
              <Popover
                content={content}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                  width: 300,
                }}
              >
                <div>
                  <i class="uil uil-question-circle icon-question"></i>
                </div>
              </Popover>
            </div>
            <p className="text-money-title">
              {totalColumn?.total_net_income > 0
                ? formatMoney(totalColumn?.total_net_income)
                : formatMoney(0)}
            </p>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">{formatMoney(data?.total_net_income)}</p>
        );
      },
      sorter: (a, b) => a.total_net_income - b.total_net_income,
    },
    {
      title: () => {
        return (
          <div className="div-title-customer">
            <p className="text-title-column m-0">{`${i18n.t("fees_apply", {
              lng: lang,
            })}`}</p>
            <p className="text-money-title">
              {totalColumn?.total_service_fee > 0
                ? formatMoney(totalColumn?.total_service_fee)
                : formatMoney(0)}
            </p>
          </div>
        );
      },
      render: (data) => {
        return (
          <p className="text-money">{formatMoney(data?.total_service_fee)}</p>
        );
      },
      align: "center",
      sorter: (a, b) => a.total_net_income - b.total_net_income,
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              {`${i18n.t("note_total_bill", {
                lng: lang,
              })}`}
            </p>
          </div>
        );
        return (
          <div className="div-title-customer">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("total_bill", {
                lng: lang,
              })}`}</p>
              <Popover
                content={content}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                  width: 300,
                }}
              >
                <div>
                  <i class="uil uil-question-circle icon-question"></i>
                </div>
              </Popover>
            </div>
            <p className="text-money-title">
              {totalColumn?.total_order_fee > 0
                ? formatMoney(totalColumn?.total_order_fee)
                : formatMoney(0)}
            </p>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">{formatMoney(data?.total_order_fee)}</p>
        );
      },
      sorter: (a, b) => a.total_order_fee - b.total_order_fee,
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              {`${i18n.t("note_profit", { lng: lang })}`}
            </p>
          </div>
        );
        return (
          <div className="div-title-customer">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("profit", {
                lng: lang,
              })}`}</p>
              <Popover
                content={content}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                  width: 300,
                }}
              >
                <div>
                  <i class="uil uil-question-circle icon-question"></i>
                </div>
              </Popover>
            </div>
            <p className="text-money-title">
              {totalColumn?.total_net_income_business > 0
                ? formatMoney(totalColumn?.total_net_income_business)
                : formatMoney(0)}
            </p>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">
            {formatMoney(data?.total_net_income_business)}
          </p>
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
              %{" "}
              {`${i18n.t("percent_profit", {
                lng: lang,
              })}`}
            </p>
          </div>
        );
        return (
          <div className="div-title-customer">
            <div className="div-title-report">
              <p className="text-title-column">
                %{" "}
                {`${i18n.t("profit", {
                  lng: lang,
                })}`}
              </p>
              <Popover
                content={content}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                  width: 300,
                }}
              >
                <div>
                  <i class="uil uil-question-circle icon-question"></i>
                </div>
              </Popover>
            </div>
            <div className="div-top"></div>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">
            {data?.percent_income ? data?.percent_income + "%" : ""}
          </p>
        );
      },
    },
  ];

  return (
    <div className="div-container-report-customer">
      <h3>{`${i18n.t("order_report_customer", { lng: lang })}`}</h3>
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
              {moment(endDate).utc().format("DD/MM/YYYY")}
            </p>
          </div>
        )}
      </div>
      <div className="header-report-customer">
        <div className="div-tab-header-service">
          <div className="div-img">
            <Image preview={false} src={collaborator} className="img" />
          </div>
          <div className="div-text-tab">
            <div className="div-t">
              <p className="text-tab-header">{`${i18n.t("customer_order_new", {
                lng: lang,
              })}`}</p>
              <p className="text-tab-header">{customerNew}</p>
            </div>
          </div>
        </div>

        <div className="div-tab-header-service">
          <div className="div-img">
            <Image preview={false} src={add} className="img" />
          </div>
          <div className="div-text-tab">
            <div className="div-t">
              <p className="text-tab-header">{`${i18n.t("total_shift", {
                lng: lang,
              })}`}</p>
              <p className="text-tab-header">
                {totalOrderNew ? totalOrderNew : 0}
              </p>
            </div>
          </div>
          <div className="div-text-tab">
            <div className="div-t">
              <p className="text-tab-header">{`${i18n.t("total_money", {
                lng: lang,
              })}`}</p>
              <p className="text-tab-header">
                {formatMoney(moneyNew ? moneyNew : 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="div-tab-header-service">
          <div className="div-img">
            <Image preview={false} src={collaborator} className="img" />
          </div>
          <div className="div-text-tab">
            <div className="div-t">
              <p className="text-tab-header">{`${i18n.t("customer_order_old", {
                lng: lang,
              })}`}</p>
              <p className="text-tab-header">{customerOld}</p>
            </div>
          </div>
        </div>

        <div className="div-tab-header-service">
          <div className="div-img">
            <Image preview={false} src={add} className="img" />
          </div>
          <div className="div-text-tab">
            <div className="div-t">
              <p className="text-tab-header">{`${i18n.t("total_shift", {
                lng: lang,
              })}`}</p>
              <p className="text-tab-header">
                {totalOrderOld ? totalOrderOld : 0}
              </p>
            </div>
          </div>
          <div className="div-text-tab">
            <div className="div-t">
              <p className="text-tab-header">{`${i18n.t("total_money", {
                lng: lang,
              })}`}</p>
              <p className="text-tab-header">{formatMoney(moneyOld)}</p>
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
                <p className="title-tab">{`${i18n.t(item?.title, {
                  lng: lang,
                })}`}</p>
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
            scroll={{
              x: width <= 490 ? 1200 : 0,
            }}
          />
        </div>
        <div className="mt-2 div-pagination p-2">
          <p>
            {`${i18n.t("total", {
              lng: lang,
            })}`}
            : {total}
          </p>
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
    title: "all",
    value: "all",
  },
  {
    title: "new_customer",
    value: "new",
  },
  {
    title: "old_customer",
    value: "old",
  },
];
