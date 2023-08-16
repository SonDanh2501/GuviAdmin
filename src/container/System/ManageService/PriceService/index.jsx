import { Pagination, Select, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import "./index.scss";
import { useLocation } from "react-router-dom";
import { getDistrictApi } from "../../../../api/file";
import {
  getExtendOptionalByOptionalServiceApi,
  getOptionalServiceByServiceApi,
  getPriceServiceApi,
  getServiceApi,
  getServiceByIdApi,
} from "../../../../api/service";
import CustomDatePicker from "../../../../components/customDatePicker";
import moment from "moment";
import { formatMoney } from "../../../../helper/formatMoney";
import LoadingPagination from "../../../../components/paginationLoading";

const PriceService = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);
  const [tab, setTab] = useState("morning");
  const [codeCity, setCodeCity] = useState();
  const [nameCity, setNameCity] = useState("");
  const [dataCity, setDataCity] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [codeDistrict, setCodeDistrict] = useState(-1);
  const [nameDistrict, setNameDistrict] = useState(-1);
  const [extend, setExtend] = useState([]);
  const [idExtend, setIdExtend] = useState("");
  const [valueExtend, setValueExtend] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const districtData = [];
  const cityData = [];
  const extendOption = [];

  useEffect(() => {
    setIsLoading(true);
    getDistrictApi()
      .then((res) => {
        setDataCity(res?.aministrative_division);
        setCodeCity(res?.aministrative_division[1]?.code);
        setNameCity(res?.aministrative_division[1]?.name);
        setDataDistrict(res?.aministrative_division[1]?.districts);
        setCodeDistrict(res?.aministrative_division[1]?.districts[0]?.code);
        setNameDistrict(res?.aministrative_division[1]?.districts[0]?.name);
      })
      .catch((err) => {});
    setStartDate(moment().toISOString());
    setEndDate(moment().add(3, "days").toISOString());
  }, []);

  useEffect(() => {
    getServiceApi(id)
      .then((res) => {
        getOptionalServiceByServiceApi(res?.data[0]?._id)
          .then((res) => {
            res?.data?.map(
              (item) =>
                item?.type === "select_horizontal_no_thumbnail" &&
                getExtendOptionalByOptionalServiceApi(item?._id)
                  .then((res) => {
                    setExtend(res?.data);
                    setIdExtend(res?.data[0]?._id);
                    setValueExtend(res?.data[0]?.title?.vi);
                  })
                  .catch((err) => {})
            );
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    getPriceServiceApi(
      idExtend,
      codeCity,
      codeDistrict,
      moment().toISOString(),
      moment().add(3, "days").toISOString(),
      tab == "morning" ? 7 : tab == "afternoon" ? 13 : 17,
      tab == "morning" ? 12 : tab == "afternoon" ? 16 : 20
    )
      .then((res) => {
        setData(res?.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, [idExtend, codeCity, codeDistrict, tab]);

  dataDistrict?.map((item) => {
    districtData?.push({
      value: item?.code,
      label: item?.name,
    });
  });

  extend?.map((item) => {
    extendOption?.push({
      value: item?._id,
      label: item?.title?.vi,
    });
  });

  dataCity?.map((item) => {
    cityData?.push({
      value: item?.code,
      label: item?.name,
      district: item?.districts,
    });
  });

  const onChangeCity = useCallback((value, label) => {
    setNameCity(label?.label);
    setCodeCity(value);
    setDataDistrict(label?.district);
  }, []);

  const onChangeDistrict = useCallback((value, label) => {
    setCodeDistrict(value);
    setNameDistrict(label?.label);
  }, []);

  const onChangeExtend = useCallback((value, label) => {
    setIdExtend(value);
    setValueExtend(label?.label);
  }, []);

  const onChangeDay = () => {
    setIsLoading(true);
    getPriceServiceApi(
      idExtend,
      codeCity,
      codeDistrict,
      startDate,
      endDate,
      tab == "morning" ? 7 : tab == "afternoon" ? 13 : 17,
      tab == "morning" ? 12 : tab == "afternoon" ? 16 : 20
    )
      .then((res) => {
        setData(res?.data);
        setIsLoading(false);
      })

      .catch((err) => {
        setIsLoading(false);
      });
  };

  const onChangeTab = useCallback(
    (value) => {
      setTab(value);
      setIsLoading(true);

      getPriceServiceApi(
        idExtend,
        codeCity,
        codeDistrict,
        startDate,
        endDate,
        value == "morning" ? 7 : value == "afternoon" ? 13 : 17,
        value == "morning" ? 12 : value == "afternoon" ? 16 : 20
      )
        .then((res) => {
          setData(res?.data);
          setIsLoading(false);
        })

        .catch((err) => {
          setIsLoading(false);
        });
    },
    [idExtend, codeCity, codeDistrict, startDate, endDate]
  );

  const columns = [
    {
      title: "Ngày",
      render: (data) => {
        return (
          <a className="text-date-price">
            {" "}
            {moment(new Date(data?.date)).utc().format("DD/MM/YYYY")}
          </a>
        );
      },
    },
    {
      title: " Giờ/Tiền",
      render: (data) => {
        return (
          <div className="div-time-date-price">
            {data?.arr_time?.map((item, key) => {
              return (
                <div className="div-item">
                  <a className="text-item">
                    {moment(new Date(item?.time)).format("HH:mm")}
                  </a>
                  <a className="text-item">{formatMoney(item?.price?.price)}</a>
                </div>
              );
            })}
          </div>
        );
      },
      align: "center",
    },
  ];

  return (
    <>
      <div>
        <Select
          style={{ width: 200 }}
          value={nameCity}
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
          value={nameDistrict}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />

        <Select
          style={{ width: 180, marginLeft: 20, marginRight: 20 }}
          placeholder="Chọn thời lượng"
          options={extendOption}
          onChange={onChangeExtend}
          value={valueExtend}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
      </div>
      <div className="mt-2 div-picker">
        <CustomDatePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onClick={onChangeDay}
          onCancel={() => {}}
          setSameStart={() => {}}
          setSameEnd={() => {}}
        />
        {startDate && (
          <a className="text-date">
            {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
            {moment(endDate).utc().format("DD/MM/YYYY")}
          </a>
        )}
      </div>
      <div className="div-tab-service mt-2">
        {TAB_DATA?.map((item, index) => {
          return (
            <div
              onClick={() => onChangeTab(item?.value)}
              className={
                item?.value === tab ? "div-item-tab-selected" : "div-item-tab"
              }
            >
              <a className="text-tab">{item?.title}</a>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>

      {isLoading && <LoadingPagination />}
    </>
  );
};

export default PriceService;

const TAB_DATA = [
  {
    title: "Sáng",
    value: "morning",
  },
  {
    title: "Chiều",
    value: "afternoon",
  },
  {
    title: "Tối",
    value: "evening",
  },
];
