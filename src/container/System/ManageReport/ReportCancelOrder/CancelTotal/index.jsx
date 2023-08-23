import { Pagination, Select, Table } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  getReportCancelReport,
  getReportOverviewCancelReport,
} from "../../../../../api/report";
import { useSelector } from "react-redux";
import CustomDatePicker from "../../../../../components/customDatePicker";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";
import i18n from "../../../../../i18n";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import { getProvince } from "../../../../../redux/selectors/service";
import "./index.scss";

const TotalCancel = (props) => {
  const { tab, currentPage, setCurrentPage, startPage, setStartPage } = props;
  const [startDate, setStartDate] = useState(
    moment().subtract(30, "d").startOf("date").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const [codeCity, setCodeCity] = useState("");
  const [dataPie, setDataPie] = useState([]);
  const [dataTotalPie, setDataTotalPie] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const lang = useSelector(getLanguageState);
  const { width } = useWindowDimensions();
  const province = useSelector(getProvince);
  const cityData = [
    {
      value: "",
      label: "Tất cả",
    },
  ];
  useEffect(() => {
    getReportCancelReport(
      moment().subtract(30, "d").startOf("date").toISOString(),
      moment().endOf("date").toISOString(),
      "",
      ""
    )
      .then((res) => {
        setDataPie(res?.percent);
        setDataTotalPie(res);
      })
      .catch((err) => {});

    getReportOverviewCancelReport(
      0,
      20,
      moment().subtract(30, "d").startOf("date").toISOString(),
      moment().endOf("date").toISOString(),
      tab,
      ""
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [tab]);

  province?.map((item) => {
    return cityData?.push({
      value: item?.code,
      label: item?.name,
    });
  });

  const onChangeCity = useCallback(
    (value) => {
      setCodeCity(value);
      getReportCancelReport(startDate, endDate, value, "")
        .then((res) => {
          setDataPie(res?.percent);
          setDataTotalPie(res);
        })
        .catch((err) => {});

      getReportOverviewCancelReport(0, 20, startDate, endDate, tab, value)
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => {});
    },
    [startDate, endDate, tab]
  );

  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    name,
  }) => {
    const RADIAN = Math.PI / 180;
    // eslint-disable-next-line
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    // eslint-disable-next-line
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    // eslint-disable-next-line
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#000000"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {name === "system_cancel"
          ? `${i18n.t("system", { lng: lang })}`
          : name === "customer_cancel"
          ? `${i18n.t("customer", { lng: lang })}`
          : `${i18n.t("admin", { lng: lang })}`}{" "}
        ({value} {"%"})
      </text>
    );
  };

  const onChangeDay = () => {
    getReportCancelReport(startDate, endDate, codeCity, "")
      .then((res) => {
        setDataPie(res?.percent);
      })
      .catch((err) => {});

    getReportOverviewCancelReport(
      startPage,
      20,
      startDate,
      endDate,
      tab,
      codeCity
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const onChange = (page) => {
    setCurrentPage(page);
    const lengthData = data.length < 20 ? 20 : data.length;
    const start = page * lengthData - lengthData;
    setStartPage(start);

    getReportOverviewCancelReport(start, 20, startDate, endDate, tab, codeCity)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const columns = [
    {
      title: `${i18n.t("time", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-create-cancel">
            <p className="text-create-cancel m-0">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </p>
            <p className="text-create-cancel m-0">
              {moment(new Date(data?.date_create)).format("HH/mm")}
            </p>
          </div>
        );
      },
    },
    {
      title: `${i18n.t("customer", { lng: lang })}`,
      render: (data) => {
        return (
          <p className="text-user-cancel m-0">
            {data?.id_cancel_user_system
              ? data?.id_cancel_user_system?.id_user_system?.full_name
              : data?.id_cancel_system
              ? "Hệ thống"
              : data?.name_customer}
          </p>
        );
      },
    },
    {
      title: `${i18n.t("code_order", { lng: lang })}`,
      render: (data) => {
        return <p className="text-user-cancel m-0">{data?.id_view}</p>;
      },
    },
    {
      title: `${i18n.t("reason", { lng: lang })}`,
      render: (data) => {
        return (
          <p className="text-user-cancel m-0">
            {data?.id_cancel_user_system
              ? ""
              : data?.id_cancel_system
              ? data?.id_cancel_system?.id_reason_cancel?.title?.vi
              : data?.id_cancel_customer?.id_reason_cancel?.title?.vi}
          </p>
        );
      },
    },
    {
      title: `${i18n.t("address", { lng: lang })}`,
      responsive: ["xl"],
      render: (data) => {
        return <p className="text-address-cancel m-0">{data?.address}</p>;
      },
    },
  ];

  return (
    <>
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
          <p className="text-date m-0">
            {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
            {moment(endDate).utc().format("DD/MM/YYYY")}
          </p>
        )}
      </div>
      <div className="div-select-city">
        <Select
          style={{ width: 200 }}
          value={codeCity}
          onChange={onChangeCity}
          options={cityData}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
        />
      </div>
      <div className="div-chart-pie-total-cancel">
        {/* <a className="title-chart"> Thống kê đơn huỷ theo khu vực</a> */}
        <div className="div-pie-chart-cancel">
          <div className="div-total-piechart">
            <div className="item-total">
              <p className="title-total">{`${i18n.t("total_cancellations", {
                lng: lang,
              })}`}</p>
              <p className="text-colon">:</p>
              <p className="number-total">{dataTotalPie?.total_cancel_order}</p>
            </div>
            <div className="item-total">
              <p className="title-total">{`${i18n.t("customer_cancellation", {
                lng: lang,
              })}`}</p>
              <p className="text-colon">:</p>
              <p className="number-total">
                {dataTotalPie?.total_cancel_order_by_customer}
              </p>
            </div>
            <div className="item-total">
              <p className="title-total">{`${i18n.t("system_cancellation", {
                lng: lang,
              })}`}</p>
              <p className="text-colon">:</p>
              <p className="number-total">
                {dataTotalPie?.total_cancel_order_by_system}
              </p>
            </div>
            <div className="item-total">
              <p className="title-total">{`${i18n.t("admin_cancellation", {
                lng: lang,
              })}`}</p>
              <p className="text-colon">:</p>
              <p className="number-total">
                {dataTotalPie?.total_cancel_order_by_user_system}
              </p>
            </div>
          </div>
          <div className="div-pie-cancel">
            <ResponsiveContainer height={300} min-width={500}>
              <PieChart>
                <Pie
                  data={dataPie}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderLabel}
                >
                  {dataPie.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          scroll={{ x: width <= 490 ? 1200 : 0 }}
        />
      </div>
      <div className="mt-1 div-pagination p-2">
        <p>Tổng: {total}</p>
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
    </>
  );
};

export default TotalCancel;

const COLORS = ["#FCD34D", "#FBBF24", "#F59E0B", "#ff8000", "#ff1919"];
