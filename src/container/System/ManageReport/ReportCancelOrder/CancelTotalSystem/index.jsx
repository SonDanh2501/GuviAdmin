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
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import i18n from "../../../../../i18n";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";

const TotalCancelSystem = (props) => {
  const { tab, currentPage, setCurrentPage, startPage, setStartPage } = props;

  const [startDate, setStartDate] = useState(
    moment().subtract(30, "d").startOf("date").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const [isLoading, setIsLoading] = useState(false);
  const [titleCity, setTitleCity] = useState("");
  const [city, setCity] = useState(false);
  const [codeCity, setCodeCity] = useState(0);
  const [dataCity, setDataCity] = useState([]);
  const [codeDistrict, setCodeDistrict] = useState(-1);
  const [dataPie, setDataPie] = useState([]);
  const [dataTotalPie, setDataTotalPie] = useState([]);
  const { width } = useWindowDimensions();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const lang = useSelector(getLanguageState);

  const cityData = [];
  useEffect(() => {
    getDistrictApi()
      .then((res) => {
        setDataCity(res?.aministrative_division);
        setCodeCity(res?.aministrative_division[1].code);
        setTitleCity(res?.aministrative_division[1].name);
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
      getReportCancelReport(startDate, endDate, value, codeDistrict)
        .then((res) => {
          setDataPie(res?.percent);
          setDataTotalPie(res);
        })
        .catch((err) => {});
    },
    [city, startDate, endDate, codeDistrict]
  );

  const onChangeDay = () => {
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
              ? ""
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

      <div className="mt-3">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          scroll={{ x: width <= 490 ? 1200 : 0 }}
        />
      </div>
      <div className="mt-1 div-pagination p-2">
        <a>
          {`${i18n.t("address", { lng: lang })}`}: {total}
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

export default TotalCancelSystem;

const COLORS = ["#FCD34D", "#FBBF24", "#F59E0B", "#ff8000", "#ff1919"];
