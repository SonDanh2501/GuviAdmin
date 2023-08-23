import { Pagination, Select, Table } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  getCancelReportCustomer,
  getReportOverviewCancelReport,
} from "../../../../../api/report";
import CustomDatePicker from "../../../../../components/customDatePicker";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";
import i18n from "../../../../../i18n";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import { getProvince } from "../../../../../redux/selectors/service";
import "./cancelCustomerOrder.scss";

const CancelOrderCustomer = (props) => {
  const { tab, currentPage, setCurrentPage, startPage, setStartPage } = props;
  const [startDate, setStartDate] = useState(
    moment().subtract(30, "d").startOf("date").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const [codeCity, setCodeCity] = useState("");
  const [dataPie, setDataPie] = useState([]);
  const [dataTotalPie, setDataTotalPie] = useState([]);
  const [totalCancerOrder, setTotalCancerOrder] = useState(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const lang = useSelector(getLanguageState);
  const province = useSelector(getProvince);
  const { width } = useWindowDimensions();
  const cityData = [
    {
      value: "",
      label: "Tất cả",
    },
  ];

  useEffect(() => {
    getCancelReportCustomer(
      moment().subtract(30, "d").startOf("date").toISOString(),
      moment().endOf("date").toISOString(),
      "",
      ""
    )
      .then((res) => {
        setDataPie(res?.arrPercent);
        setDataTotalPie(res?.total);
        setTotalCancerOrder(res?.total_cancel_order_by_customer);
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
      district: item?.districts,
    });
  });

  const onChangeCity = useCallback(
    (value, label) => {
      setCodeCity(value);
      getCancelReportCustomer(startDate, endDate, value, "")
        .then((res) => {
          setDataPie(res?.arrPercent);
          setDataTotalPie(res?.total === 0 ? [] : res?.total);
          setTotalCancerOrder(res?.total_cancel_order_by_customer);
        })
        .catch((err) => {});
      getReportOverviewCancelReport(
        startPage,
        20,
        startDate,
        endDate,
        tab,
        value
      )
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => {});
    },
    [startDate, endDate, tab, startPage]
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data.length < 20 ? 20 : data.length;
    const start = page * dataLength - dataLength;
    setStartPage(start);
    getReportOverviewCancelReport(start, 20, startDate, endDate, tab, codeCity)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const onChangeDay = () => {
    getReportOverviewCancelReport(
      startPage,
      20,
      startDate,
      endDate,
      tab,
      codeCity
    ).then((res) => {
      setData(res?.data);
      setTotal(res?.totalItem);
    });

    getCancelReportCustomer(startDate, endDate, codeCity, "")
      .then((res) => {
        setDataPie(res?.arrPercent);
        setDataTotalPie(res?.total === 0 ? [] : res?.total);
        setTotalCancerOrder(res?.total_cancel_order_by_customer);
      })
      .catch((err) => {});
  };

  const columns = [
    {
      title: `${i18n.t("time", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-create-cancel">
            <p className="text-create-cancel">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </p>
            <p className="text-create-cancel">
              {moment(new Date(data?.date_create)).format("HH/mm")}
            </p>
          </div>
        );
      },
    },
    {
      title: `${i18n.t("canceler", { lng: lang })}`,
      render: (data) => {
        return (
          <p className="text-user-cancel">
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
      title: `${i18n.t("order", { lng: lang })}`,
      render: (data) => {
        return <p className="text-user-cancel">{data?.id_view}</p>;
      },
    },
    {
      title: `${i18n.t("reason", { lng: lang })}`,
      render: (data) => {
        return (
          <p className="text-user-cancel">
            {data?.id_cancel_user_system
              ? ""
              : data?.id_cancel_system
              ? data?.id_cancel_system?.id_reason_cancel?.title?.[lang]
              : data?.id_cancel_customer?.id_reason_cancel?.title?.[lang]}
          </p>
        );
      },
    },
    {
      title: `${i18n.t("address", { lng: lang })}`,
      render: (data) => {
        return <p className="text-address-cancel">{data?.address}</p>;
      },
    },
  ];

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
        fontSize={10}
        fill="#000000"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {name?.[lang]} ({value} {"%"})
      </text>
    );
  };

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
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
      </div>
      <div className="div-chart-pie-total-cancel-customer">
        <div className="div-total-cancel-order">
          <p className="m-0">
            {`${i18n.t("total", { lng: lang })}`}: {totalCancerOrder}
          </p>
          {dataTotalPie?.map((item, index) => {
            return (
              <div key={index} className="div-total-customer">
                <p className="title-total-cancel-customer">
                  {item?.reason_cancel[0]?.title?.[lang]}
                </p>
                <p className="text-colon">:</p>
                <p className="text-number">{item?.total}</p>
              </div>
            );
          })}
        </div>
        <div className="div-pie-chart ml-4">
          <ResponsiveContainer width="100%" height={250}>
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
      <div className="mt-5">
        <Table
          pagination={false}
          columns={columns}
          dataSource={data}
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

export default CancelOrderCustomer;

const COLORS = ["#FCD34D", "#FBBF24", "#F59E0B", "#ff8000", "#ff1919"];
