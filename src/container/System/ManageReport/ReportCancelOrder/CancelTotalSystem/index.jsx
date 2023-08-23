import { Pagination, Select, Table } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { getReportOverviewCancelReport } from "../../../../../api/report";
import { useSelector } from "react-redux";
import CustomDatePicker from "../../../../../components/customDatePicker";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";
import i18n from "../../../../../i18n";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import { getProvince } from "../../../../../redux/selectors/service";
import "./index.scss";

const TotalCancelSystem = (props) => {
  const { tab, currentPage, setCurrentPage, startPage, setStartPage } = props;
  const [startDate, setStartDate] = useState(
    moment().subtract(30, "days").startOf("date").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const [codeCity, setCodeCity] = useState("");
  const { width } = useWindowDimensions();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const lang = useSelector(getLanguageState);
  const province = useSelector(getProvince);

  const cityData = [
    {
      value: "",
      label: "Tất cả",
    },
  ];

  useEffect(() => {
    getReportOverviewCancelReport(
      0,
      20,
      moment().subtract(30, "days").startOf("date").toISOString(),
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
    (value, label) => {
      setCodeCity(value);
      getReportOverviewCancelReport(0, 20, startDate, endDate, tab, value)
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => {});
    },
    [startDate, endDate, tab]
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
      title: `${i18n.t("canceler", { lng: lang })}`,
      render: (data) => {
        return (
          <p className="text-user-cancel m-0">
            {data?.id_cancel_user_system
              ? data?.id_cancel_user_system?.id_user_system?.full_name
              : data?.id_cancel_system
              ? `${i18n.t("system", { lng: lang })}`
              : data?.name_customer}
          </p>
        );
      },
    },
    {
      title: `${i18n.t("order", { lng: lang })}`,
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
              ? data?.id_cancel_system?.id_reason_cancel?.title?.[lang]
              : data?.id_cancel_customer?.id_reason_cancel?.title?.[lang]}
          </p>
        );
      },
    },
    {
      title: `${i18n.t("address", { lng: lang })}`,
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
        <p>
          {`${i18n.t("total", { lng: lang })}`}: {total}
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
    </>
  );
};

export default TotalCancelSystem;
