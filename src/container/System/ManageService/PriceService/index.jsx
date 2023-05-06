import { Pagination, Select, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import "./index.scss";
import { useLocation } from "react-router-dom";
import { getDistrictApi } from "../../../../api/file";
import {
  getExtendOptionalByOptionalServiceApi,
  getOptionalServiceByServiceApi,
  getServiceByIdApi,
} from "../../../../api/service";

const PriceService = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [tab, setTab] = useState("morning");
  const [codeCity, setCodeCity] = useState();
  const [nameCity, setNameCity] = useState("");
  const [dataCity, setDataCity] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [codeDistrict, setCodeDistrict] = useState(-1);
  const [extend, setExtend] = useState([]);
  const [idExtend, setIdExtend] = useState("");
  const districtData = [];
  const cityData = [];
  const extendOption = [];

  useEffect(() => {
    getDistrictApi()
      .then((res) => {
        setDataCity(res?.aministrative_division);
        setCodeCity(res?.aministrative_division[1]?.code);
        setNameCity(res?.aministrative_division[1]?.name);
        setDataDistrict(res?.aministrative_division[1]?.districts);
      })
      .catch((err) => {});

    getServiceByIdApi(id)
      .then((res) => {
        getOptionalServiceByServiceApi(res?.data[0]?._id)
          .then((res) => {
            res?.data?.map((item) => {
              item?.type === "select_horizontal_no_thumbnail" &&
                getExtendOptionalByOptionalServiceApi(item?._id)
                  .then((res) => {
                    setExtend(res?.data);
                  })
                  .catch((err) => {});
            });
          })
          .catch((err) => {});
      })
      .catch((err) => {});
  }, [id]);

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
    setCodeDistrict(label?.value);
  }, []);

  const columns =
    tab === "morning"
      ? [
          {
            title: "Ngày",
          },
          {
            title: "7:00",
            align: "center",
          },
          {
            title: "7:30",
            align: "center",
          },
          {
            title: "8:00",
            align: "center",
          },
          {
            title: "8:30",
            align: "center",
          },
          {
            title: "9:00",
            align: "center",
          },
          {
            title: "9:30",
            align: "center",
          },
          {
            title: "10:00",
            align: "center",
          },
          {
            title: "10:30",
            align: "center",
          },
          {
            title: "11:00",
            align: "center",
          },
          {
            title: "11:30",
            align: "center",
          },
          {
            title: "12:00",
            align: "center",
          },
          {
            title: "12:30",
            align: "center",
          },
        ]
      : tab === "afternoon"
      ? [
          {
            title: "Ngày",
          },
          {
            title: "13:00",
            align: "center",
          },
          {
            title: "13:30",
            align: "center",
          },
          {
            title: "14:00",
            align: "center",
          },
          {
            title: "14:30",
            align: "center",
          },
          {
            title: "15:00",
            align: "center",
          },
          {
            title: "15:30",
            align: "center",
          },
          {
            title: "16:00",
            align: "center",
          },
          {
            title: "16:30",
            align: "center",
          },
        ]
      : [
          {
            title: "Ngày",
          },
          {
            title: "17:00",
            align: "center",
          },
          {
            title: "17:30",
            align: "center",
          },
          {
            title: "18:00",
            align: "center",
          },
          {
            title: "18:30",
            align: "center",
          },
          {
            title: "19:00",
            align: "center",
          },
          {
            title: "19:30",
            align: "center",
          },
          {
            title: "20:00",
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
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />

        <Select
          style={{ width: 180, marginLeft: 20, marginRight: 20 }}
          placeholder="Chọn thời lượng"
          options={extendOption}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
      </div>
      <div className="div-tab-service mt-2">
        {TAB_DATA?.map((item, index) => {
          return (
            <div
              onClick={() => setTab(item?.value)}
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
      <div className="div-pagination p-2">
        <a>Tổng: {total}</a>
        <div>
          <Pagination
            current={currentPage}
            // onChange={onChange}
            total={total}
            showSizeChanger={false}
          />
        </div>
      </div>
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
