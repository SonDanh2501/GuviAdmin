import { useEffect, useState } from "react";
import {
  getReportOrderByCity,
  getReportPercentOrderByCity,
} from "../../../../../api/report";
import moment from "moment";
import { Button, Pagination, Popover, Select, Table } from "antd";
import { formatMoney } from "../../../../../helper/formatMoney";
import CustomDatePicker from "../../../../../components/customDatePicker";
import { getDistrictApi } from "../../../../../api/file";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./styles.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import i18n from "../../../../../i18n";
import { getProvince } from "../../../../../redux/selectors/service";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";

const ReportOrderCity = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [dataTotal, setDataTotal] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const [codeCity, setCodeCity] = useState(0);
  const [nameCity, setNameCity] = useState("");
  const [dataChart, setDataChart] = useState([]);
  const [startDate, setStartDate] = useState(
    moment().subtract(30, "d").startOf("date").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);
  const province = useSelector(getProvince);
  const cityOptions = [];

  useEffect(() => {
    getReportOrderByCity(0, 20, startDate, endDate, codeCity)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setDataTotal(res?.total[0]);
      })
      .catch((err) => {});

    getReportPercentOrderByCity(startDate, endDate, codeCity)
      .then((res) => {
        setDataChart(res?.data);
      })
      .catch((err) => {});
  }, []);

  province.map((item) => {
    cityOptions?.push({
      value: item?.code,
      label: item?.name,
    });
  });

  const onChangeDay = () => {
    getReportOrderByCity(startPage, 20, startDate, endDate, codeCity)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setDataTotal(res?.total[0]);
      })
      .catch((err) => {});

    getReportPercentOrderByCity(startDate, endDate, codeCity)
      .then((res) => {
        setDataChart(res?.data);
      })
      .catch((err) => {});
  };

  const handleChangeCity = (value, label) => {
    setCodeCity(value);
    setNameCity(label?.label);
    getReportOrderByCity(startPage, 20, startDate, endDate, value)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setDataTotal(res?.total[0]);
      })
      .catch((err) => {});

    getReportPercentOrderByCity(startDate, endDate, value)
      .then((res) => {
        setDataChart(res?.data);
      })
      .catch((err) => {});
  };

  const onChange = (page) => {
    setCurrentPage(page);
    const lengthData = data.length < 20 ? 20 : data.length;
    const start = page * lengthData - lengthData;
    setStartPage(start);
    getReportOrderByCity(start, 20, startDate, endDate, codeCity)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setDataTotal(res?.total[0]);
      })
      .catch((err) => {});
  };

  const columns = [
    {
      title: () => {
        return (
          <div className="div-title-collaborator-id">
            <div className="div-title-report">
              <a className="text-title-column">{`${i18n.t("area", {
                lng: lang,
              })}`}</a>
            </div>
            <div className="div-top"></div>
          </div>
        );
      },
      render: (data) => (
        <div className="div-date-report-order">
          <a className="text-date-report-order">{data?.city}</a>
        </div>
      ),
    },
    {
      title: () => {
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">{`${i18n.t("shift", {
                lng: lang,
              })}`}</a>
            </div>
            <a className="text-money-title">
              {dataTotal?.total_item > 0 ? dataTotal?.total_item : 0}
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
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">{`${i18n.t("sales", {
                lng: lang,
              })}`}</a>
            </div>
            <a className="text-money-title">
              {dataTotal?.total_gross_income > 0
                ? formatMoney(dataTotal?.total_gross_income)
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
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">{`${i18n.t("service_fee", {
                lng: lang,
              })}`}</a>
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
            <a className="text-money-title">
              {dataTotal?.total_collabotator_fee > 0
                ? formatMoney(dataTotal?.total_collabotator_fee)
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
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column-blue">{`${i18n.t("revenue", {
                lng: lang,
              })}`}</a>
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
            <a className="text-money-title-blue">
              {dataTotal?.total_income > 0
                ? formatMoney(dataTotal?.total_income)
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
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">{`${i18n.t("discount", {
                lng: lang,
              })}`}</a>
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
            <a className="text-money-title">
              {dataTotal?.total_discount > 0
                ? formatMoney(dataTotal?.total_discount)
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
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">{`${i18n.t("net_revenue", {
                lng: lang,
              })}`}</a>
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
            <a className="text-money-title">
              {dataTotal?.total_net_income > 0
                ? formatMoney(dataTotal?.total_net_income)
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
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">{`${i18n.t("fees_apply", {
                lng: lang,
              })}`}</a>
            </div>
            <a className="text-money-title">
              {dataTotal?.total_service_fee > 0
                ? formatMoney(dataTotal?.total_service_fee)
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
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">{`${i18n.t("total_bill", {
                lng: lang,
              })}`}</a>
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
            <a className="text-money-title">
              {dataTotal?.total_order_fee > 0
                ? formatMoney(dataTotal?.total_order_fee)
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
              {`${i18n.t("note_profit", { lng: lang })}`}
            </p>
          </div>
        );
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">{`${i18n.t("profit", {
                lng: lang,
              })}`}</a>
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
            <a className="text-money-title">
              {dataTotal?.total_net_income_business > 0
                ? formatMoney(dataTotal?.total_net_income_business)
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
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">
                %{" "}
                {`${i18n.t("profit", {
                  lng: lang,
                })}`}
              </a>
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
          <a className="text-money">
            {data?.percent_income ? data?.percent_income + "%" : ""}
          </a>
        );
      },
    },
  ];

  return (
    <div className="div-container-report-area">
      <h3>{`${i18n.t("order_report_region", { lng: lang })}`}</h3>
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
      <div>
        <Select
          value={nameCity}
          style={{
            width: 220,
          }}
          onChange={handleChangeCity}
          options={cityOptions}
        />
      </div>

      <div className="div-chart-order-area">
        <ResponsiveContainer width={"100%"} height={350} min-width={350}>
          <BarChart
            width={500}
            height={400}
            data={dataChart}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="city"
              tick={{ fontSize: 8 }}
              angle={-30}
              textAnchor="end"
            />

            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="total_item"
              fill="#4376CC"
              barSize={20}
              minPointSize={10}
              label={{ position: "centerTop", fill: "white", fontSize: 10 }}
              name={`${i18n.t("number_shift", { lng: lang })}`}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          scroll={{
            x: width <= 490 ? 1200 : 0,
          }}
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
            pageSize={20}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportOrderCity;
