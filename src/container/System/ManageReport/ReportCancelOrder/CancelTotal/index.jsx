import { Pagination, Select, Table } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { getDistrictApi } from "../../../../../api/file";
import {
  getReportCancelReport,
  getReportOverviewCancelReport,
} from "../../../../../api/report";

import "./index.scss";
import CustomDatePicker from "../../../../../components/customDatePicker";

const TotalCancel = (props) => {
  const { tab, currentPage, setCurrentPage, startPage, setStartPage } = props;

  const [startDate, setStartDate] = useState(
    moment(moment().startOf("year").toISOString()).add(7, "hours").toISOString()
  );
  const [endDate, setEndDate] = useState(
    moment(moment(new Date()).toISOString()).add(7, "hours").toISOString()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [titleCity, setTitleCity] = useState("");
  const [city, setCity] = useState(false);
  const [codeCity, setCodeCity] = useState(0);
  const [dataCity, setDataCity] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [codeDistrict, setCodeDistrict] = useState(-1);
  const [district, setDistrict] = useState(false);
  const [titleDistrict, setTitleDistrict] = useState("Chọn quận");
  const [dataPie, setDataPie] = useState([]);
  const [dataTotalPie, setDataTotalPie] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const districtData = [];
  const cityData = [];
  useEffect(() => {
    // getDistrictApi()
    //   .then((res) => {
    //     setDataCity(res?.aministrative_division);
    //     setCodeCity(res?.aministrative_division[1]?.code);
    //     setTitleCity(res?.aministrative_division[1]?.name);
    //     setDataDistrict(res?.aministrative_division[1]?.districts);
    //     getReportCancelReport(
    //       startDate,
    //       endDate,
    //       res?.aministrative_division[1]?.code,
    //       codeDistrict
    //     )
    //       .then((res) => {
    //         setDataPie(res?.percent);
    //         setDataTotalPie(res);
    //       })
    //       .catch((err) => {});
    //   })
    //   .catch((err) => {});

    getReportOverviewCancelReport(0, 20, startDate, endDate, tab, codeCity)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [tab]);

  dataDistrict?.map((item) => {
    districtData?.push({
      value: item?.code,
      label: item?.name,
    });
  });

  dataCity?.map((item) => {
    cityData?.push({
      value: item?.code,
      label: item?.name,
      district: item?.districts,
    });
  });

  const onChangeCity = useCallback(
    (value, label) => {
      setCodeCity(value);
      setDataDistrict(label?.district);
      setTitleCity(label?.label);
      setCity(!city);
      getReportCancelReport(startDate, endDate, value, codeDistrict)
        .then((res) => {
          setDataPie(res?.percent);
          setDataTotalPie(res);
        })
        .catch((err) => {});
    },
    [city, startDate, endDate, codeDistrict]
  );

  const onChangeDistrict = useCallback(
    (value, label) => {
      setCodeDistrict(label?.value);
      setDistrict(!district);
      getReportCancelReport(startDate, endDate, codeCity, value)
        .then((res) => {
          setDataPie(res?.percent);
          setDataTotalPie(res);
        })
        .catch((err) => {});
    },
    [district, startDate, endDate, codeCity]
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
          ? "Hệ thống"
          : name === "customer_cancel"
          ? "Khách hàng"
          : "Quản trị viên"}{" "}
        ({value} {"%"})
      </text>
    );
  };

  const onChangeDay = () => {
    getReportCancelReport(startDate, endDate, codeCity, codeDistrict)
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
      title: "Thời gian",
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
      title: "Người huỷ",
      render: (data) => {
        return (
          <a className="text-user-cancel">
            {data?.id_cancel_user_system
              ? data?.id_cancel_user_system?.id_user_system?.full_name
              : data?.id_cancel_system
              ? "Hệ thống"
              : data?.name_customer}
          </a>
        );
      },
    },
    {
      title: "Đơn hàng",
      render: (data) => {
        return <a className="text-user-cancel">{data?.id_view}</a>;
      },
    },
    {
      title: "Lí do",
      render: (data) => {
        return (
          <a className="text-user-cancel">
            {data?.id_cancel_user_system
              ? ""
              : data?.id_cancel_system
              ? data?.id_cancel_system?.id_reason_cancel?.title?.vi
              : data?.id_cancel_customer?.id_reason_cancel?.title?.vi}
          </a>
        );
      },
    },
    {
      title: "Địa chỉ",
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
      {/* <div className="div-chart-pie-total-cancel">
        <a className="title-chart"> Thống kê đơn huỷ theo khu vực</a>
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
          <Select
            style={{ width: 180, marginLeft: 20, marginRight: 20 }}
            placeholder="Chọn quận"
            onChange={onChangeDistrict}
            options={districtData}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
          <CustomDatePicker
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onClick={onChangeDay}
            onCancel={() => {}}
          />
        </div>

        <div className="div-pie-chart-cancel">
          <div className="div-total-piechart">
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
      </div> */}

      <div className="mt-3">
        <Table dataSource={data} columns={columns} pagination={false} />
      </div>
      <div className="mt-1 div-pagination p-2">
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
    </>
  );
};

export default TotalCancel;

const COLORS = ["#FCD34D", "#FBBF24", "#F59E0B", "#ff8000", "#ff1919"];
