import React, { useCallback, useEffect, useState } from "react";
import "./cancelCustomerOrder.scss";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { getDistrictApi } from "../../../../../api/file";
import moment from "moment";
import {
  getReportCancelReport,
  getReportOverviewCancelReport,
  getReportTypeService,
} from "../../../../../api/report";
import { List, Pagination, Select, Table } from "antd";

const CancelOrderCustomer = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [titleCity, setTitleCity] = useState("Chọn thành phố");
  const [city, setCity] = useState(false);
  const [codeCity, setCodeCity] = useState();
  const [dataCity, setDataCity] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [codeDistrict, setCodeDistrict] = useState(-1);
  const [district, setDistrict] = useState(false);
  const [titleDistrict, setTitleDistrict] = useState("Chọn quận");
  const [dataPie, setDataPie] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const districtData = [];
  const cityData = [];

  useEffect(() => {
    getDistrictApi()
      .then((res) => {
        setDataCity(res?.aministrative_division);
        setCodeCity(res?.aministrative_division[0]?.code);
        setTitleCity(res?.aministrative_division[0]?.name);
        setDataDistrict(res?.aministrative_division[0]?.districts);
        getReportCancelReport(
          moment(moment().startOf("year").toISOString())
            .add(7, "hours")
            .toISOString(),
          moment(moment(new Date()).toISOString())
            .add(7, "hours")
            .toISOString(),
          res?.aministrative_division[0]?.code,
          codeDistrict
        )
          .then((res) => {
            setDataPie(res?.percent);
          })
          .catch((err) => {});
      })
      .catch((err) => {});

    getReportOverviewCancelReport(
      0,
      20,
      moment(moment().startOf("year").toISOString())
        .add(7, "hours")
        .toISOString(),
      moment(moment(new Date()).toISOString()).add(7, "hours").toISOString()
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});

    setStartDate(
      moment(moment().startOf("year").toISOString())
        .add(7, "hours")
        .toISOString()
    );
    setEndDate(
      moment(moment(new Date()).toISOString()).add(7, "hours").toISOString()
    );
  }, []);

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
      setCity(!city);
      getReportCancelReport(startDate, endDate, value, codeDistrict)
        .then((res) => {
          setDataPie(res?.percent);
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
        })
        .catch((err) => {});
    },
    [district, startDate, endDate, codeCity]
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const start = page * data.length - data.length;
    getReportOverviewCancelReport(start, 20, startDate, endDate)
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
      <div className="div-chart-pie-total-cancel">
        <a className="title-chart"> Thống kê đơn huỷ theo khu vực</a>
        <div className="div-select-city">
          <Select
            style={{ width: 200 }}
            defaultValue={"Thành phố Hồ Chí Minh"}
            onChange={onChangeCity}
            options={cityData}
          />
          <Select
            style={{ width: 180, marginLeft: 20 }}
            placeholder="Chọn quận"
            onChange={onChangeDistrict}
            options={districtData}
          />
        </div>
        <div className="div-pie-chart">
          <div className="div-title-note">
            <div className="div-square-ser">
              <div className="square-two" />
              <a>
                Hệ thống{" "}
                {dataPie[0]?.value ? "- " + dataPie[0]?.value + "%" : ""}
              </a>
            </div>
            <div className="div-square-ser">
              <div className="square-three" />
              <a>
                Khách hàng{" "}
                {dataPie[1]?.value ? "- " + dataPie[1]?.value + "%" : ""}
              </a>
            </div>
          </div>
          <ResponsiveContainer height={200} min-width={500}>
            <PieChart>
              <Pie
                data={dataPie}
                cx={100}
                cy={100}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
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
        <Table pagination={false} columns={columns} dataSource={data} />
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

export default CancelOrderCustomer;

const COLORS = ["#ff8000", "#ff1919"];
