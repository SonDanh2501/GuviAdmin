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
} from "../../../../../api/report";
import { formatMoney } from "../../../../../helper/formatMoney";
import _debounce from "lodash/debounce";
import "./index.scss";
import CustomDatePicker from "../../../../../components/customDatePicker";
import LoadingPagination from "../../../../../components/paginationLoading";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import i18n from "../../../../../i18n";
const width = window.innerWidth;

const ReportCollaborator = () => {
  const [dataFilter, setDataFilter] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [valueSearch, setValueSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [totalColumn, setTotalColumn] = useState([]);
  const [type, setType] = useState("day");
  const [startDate, setStartDate] = useState(
    moment().startOf("month").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getReportCollaborator(0, 40, startDate, endDate)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setTotalColumn(res?.total[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  const onChange = (page) => {
    setIsLoading(true);
    setCurrentPage(page);
    const lengthData = data.length < 40 ? 40 : data.length;
    const lengthFilter = dataFilter.length < 40 ? 40 : dataFilter.length;
    const lengthSearch = dataSearch.length < 40 ? 40 : dataSearch.length;
    const start =
      dataFilter.length > 0
        ? page * lengthFilter - lengthFilter
        : dataSearch.length > 0
        ? page * lengthSearch - lengthSearch
        : page * lengthData - lengthData;

    dataFilter.length > 0
      ? filterReportCollaborator(start, 40, startDate, endDate)
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
      ? searchReportCollaborator(0, 40, valueSearch)
          .then((res) => {
            setIsLoading(false);
            setData(res?.data);
            setTotal(res?.totalItem);
            setTotalColumn(res?.total[0]);
          })
          .catch((err) => {
            setIsLoading(false);
          })
      : getReportCollaborator(start, 40, startDate, endDate)
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
    filterReportCollaborator(0, 40, startDate, endDate)
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
      searchReportCollaborator(0, 40, value)
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
              <a className="text-title-column">{`${i18n.t("collaborator", {
                lng: lang,
              })}`}</a>
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
              <a className="text-title-column">{`${i18n.t("shift", {
                lng: lang,
              })}`}</a>
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
              <a className="text-title-column">{`${i18n.t("sales", {
                lng: lang,
              })}`}</a>
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
            <p className="text-content">{`${i18n.t(
              "service_fee_pay_collaborator",
              {
                lng: lang,
              }
            )}`}</p>
          </div>
        );
        return (
          <div className="div-title-collaborator">
            <div className="div-title-report">
              <a className="text-title-column">{`${i18n.t("service_fee", {
                lng: lang,
              })}`}</a>
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
              {`${i18n.t("revenue_sales", { lng: lang })}`}
            </p>
          </div>
        );
        return (
          <div className="div-title-collaborator">
            <div className="div-title-report">
              <a className="text-title-column-blue">{`${i18n.t("revenue", {
                lng: lang,
              })}`}</a>
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
            <p className="text-content">{`${i18n.t("total_discount", {
              lng: lang,
            })}`}</p>
          </div>
        );
        return (
          <div className="div-title-collaborator">
            <div className="div-title-report">
              <a className="text-title-column">{`${i18n.t("discount", {
                lng: lang,
              })}`}</a>
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
              {`${i18n.t("note_net_revenue", { lng: lang })}`}
            </p>
          </div>
        );
        return (
          <div className="div-title-collaborator">
            <div className="div-title-report">
              <a className="text-title-column">{`${i18n.t("net_revenue", {
                lng: lang,
              })}`}</a>
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
            <a>{`${i18n.t("fees_apply", {
              lng: lang,
            })}`}</a>
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
              {`${i18n.t("note_total_bill", {
                lng: lang,
              })}`}
            </p>
          </div>
        );
        return (
          <div className="div-title-collaborator">
            <div className="div-title-report">
              <a className="text-title-column">{`${i18n.t("total_bill", {
                lng: lang,
              })}`}</a>
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
              {`${(i18n.t("note_profit"), { lng: lang })}`}
            </p>
          </div>
        );
        return (
          <div className="div-title-collaborator">
            <div className="div-title-report">
              <a className="text-title-column">{`${i18n.t("profit", {
                lng: lang,
              })}`}</a>
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
              %{" "}
              {`${i18n.t("percent_profit", {
                lng: lang,
              })}`}
            </p>
          </div>
        );
        return (
          <div className="div-title-collaborator">
            <div className="div-title-report">
              <a className="text-title-column">
                %{" "}
                {`${i18n.t("profit", {
                  lng: lang,
                })}`}
              </a>
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
      <h5>{`${i18n.t("collaborator_report", { lng: lang })}`}</h5>
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
          placeholder={`${i18n.t("search", { lng: lang })}`}
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
        <a>
          {`${i18n.t("total", { lng: lang })}`}: {total}
        </a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={total}
            showSizeChanger={false}
            pageSize={40}
          />
        </div>
      </div>
      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default ReportCollaborator;
