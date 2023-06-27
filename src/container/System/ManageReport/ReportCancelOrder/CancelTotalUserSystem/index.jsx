import { Pagination, Select, Table } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { getDistrictApi } from "../../../../../api/file";
import {
  getCancelReportUserSystem,
  getReportOverviewCancelReport,
} from "../../../../../api/report";

import CustomDatePicker from "../../../../../components/customDatePicker";
import "./index.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import i18n from "../../../../../i18n";

const TotalCancelUserSystem = (props) => {
  const { tab, currentPage, setCurrentPage, startPage, setStartPage } = props;

  const [startDate, setStartDate] = useState(
    moment().startOf("year").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const [titleCity, setTitleCity] = useState("");
  const [city, setCity] = useState(false);
  const [codeCity, setCodeCity] = useState(0);
  const [dataCity, setDataCity] = useState([]);
  const [codeDistrict, setCodeDistrict] = useState(-1);
  const [dataPie, setDataPie] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const cityData = [];
  const lang = useSelector(getLanguageState);
  useEffect(() => {
    getDistrictApi()
      .then((res) => {
        setDataCity(res?.aministrative_division);
        setCodeCity(res?.aministrative_division[1].code);
        setTitleCity(res?.aministrative_division[1].name);
        getCancelReportUserSystem(
          startDate,
          endDate,
          res?.aministrative_division[1].code
        )
          .then((res) => {
            setDataPie(res?.arrPercent);
            // setDataTotalPie(res);
          })
          .catch((err) => {});
      })
      .catch((err) => {});

    getReportOverviewCancelReport(0, 20, startDate, endDate, tab, codeCity)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [tab]);

  dataCity?.map((item) => {
    cityData?.push({
      value: item?.code,
      label: item?.name,
    });
  });

  const onChangeCity = useCallback(
    (value, label) => {
      setCodeCity(value);
      setTitleCity(label?.label);
      setCity(!city);
      getCancelReportUserSystem(startDate, endDate, value)
        .then((res) => {
          setDataPie(res?.arrPercent);
          // setDataTotalPie(res);
        })
        .catch((err) => {});

      getReportOverviewCancelReport(0, 20, startDate, endDate, tab, value)
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => {});
    },
    [city, startDate, endDate, codeDistrict]
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
        {name?.[lang]}({value} {"%"})
      </text>
    );
  };

  const onChangeDay = () => {
    getCancelReportUserSystem(startDate, endDate, codeCity)
      .then((res) => {
        setDataPie(res?.arrPercent);
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
            <a className="text-create-cancel">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </a>
            <a className="text-create-cancel">
              {moment(new Date(data?.date_create)).format("HH/mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: `${i18n.t("canceler", { lng: lang })}`,
      render: (data) => {
        return (
          <a className="text-user-cancel">
            {data?.id_cancel_user_system
              ? data?.id_cancel_user_system?.id_user_system?.full_name
              : data?.id_cancel_system
              ? `${i18n.t("system", { lng: lang })}`
              : data?.name_customer}
          </a>
        );
      },
    },
    {
      title: `${i18n.t("order", { lng: lang })}`,
      render: (data) => {
        return <a className="text-user-cancel">{data?.id_view}</a>;
      },
    },
    {
      title: `${i18n.t("reason", { lng: lang })}`,
      render: (data) => {
        return (
          <a className="text-user-cancel">
            {data?.id_cancel_user_system
              ? data?.id_cancel_user_system?.id_reason_cancel?.title?.[lang]
              : data?.id_cancel_system
              ? data?.id_cancel_system?.id_reason_cancel?.title?.[lang]
              : data?.id_cancel_customer?.id_reason_cancel?.title?.[lang]}
          </a>
        );
      },
    },
    {
      title: `${i18n.t("address", { lng: lang })}`,
      render: (data) => {
        return <a className="text-address-cancel">{data?.address}</a>;
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
        />
        {startDate && (
          <a className="text-date">
            {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
            {moment(endDate).utc().format("DD/MM/YYYY")}
          </a>
        )}
      </div>
      <div className="div-select-city">
        <Select
          style={{ width: 200 }}
          value={titleCity}
          onChange={onChangeCity}
          options={cityData}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
      </div>
      <div className="div-chart-pie-total-cancel">
        {/* <a className="title-chart"> Thống kê đơn huỷ theo khu vực</a> */}
        <div className="div-pie-chart-cancel">
          {/* <div className="div-total-piechart">
            <div className="item-total">
              <a className="title-total">Tổng đơn huỷ</a>
              <a className="text-colon">:</a>
              <a className="number-total">{dataTotalPie?.total_cancel_order}</a>
            </div>
            <div className="item-total">
              <a className="title-total">Đơn huỷ khách hàng</a>
              <a className="text-colon">:</a>
              <a className="number-total">
                {dataTotalPie?.total_cancel_order_by_customer}
              </a>
            </div>
            <div className="item-total">
              <a className="title-total">Đơn huỷ hệ thống</a>
              <a className="text-colon">:</a>
              <a className="number-total">
                {dataTotalPie?.total_cancel_order_by_system}
              </a>
            </div>
            <div className="item-total">
              <a className="title-total">Đơn huỷ quản trị viên</a>
              <a className="text-colon">:</a>
              <a className="number-total">
                {dataTotalPie?.total_cancel_order_by_user_system}
              </a>
            </div>
          </div> */}
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
        <Table dataSource={data} columns={columns} pagination={false} />
      </div>
      <div className="mt-1 div-pagination p-2">
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
    </>
  );
};

export default TotalCancelUserSystem;

const COLORS = ["#FCD34D", "#FBBF24", "#F59E0B", "#ff8000", "#ff1919"];
