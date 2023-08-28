import { SearchOutlined } from "@ant-design/icons";
import { UilEllipsisH, UilFileExport } from "@iconscout/react-unicons";
import {
  Button,
  DatePicker,
  Dropdown,
  FloatButton,
  Input,
  Select,
  Space,
} from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getOrderApi } from "../../../api/order";
import LoadingPagination from "../../../components/paginationLoading";
import { ExportCSV } from "../../../helper/export";
import { errorNotify } from "../../../helper/toast";
import { useCookies } from "../../../helper/useCookies";
import useWindowDimensions from "../../../helper/useWindowDimensions";
import i18n from "../../../i18n";
import {
  getElementState,
  getLanguageState,
  getUser,
} from "../../../redux/selectors/auth";
import { getProvince, getService } from "../../../redux/selectors/service";
import OrderManage from "./Order/OrderManage";
import "./index.scss";
const { RangePicker } = DatePicker;

const ManageOrder = () => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const service = useSelector(getService);
  const province = useSelector(getProvince);
  const user = useSelector(getUser);
  const [name, setName] = useState("");
  const [tab, setTab] = useState("all");
  const [kind, setKind] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState("date_create");
  const [city, setCity] = useState("");
  const [dataDistrict, setDataDistrict] = useState([]);
  const [district, setDistrict] = useState([]);
  const [checkCondition, setCheckCondition] = useState(false);
  const [condition, setCondition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date("2022-12-31").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const [keyActive, setKeyActive] = useState(0);
  const itemTab = [
    {
      label: "Tất cả đơn hàng",
      value: "all",
      key: 0,
    },
    {
      label: "Đang chờ làm",
      value: "pending",
      key: 1,
    },
    {
      label: "Đã nhận",
      value: "confirm",
      key: 2,
    },
    {
      label: "Đang làm",
      value: "doing",
      key: 3,
    },
    {
      label: "Đã huỷ",
      value: "cancel",
      key: 4,
    },
    {
      label: "Hoàn thành",
      value: "done",
      key: 5,
    },
  ];
  const [saveToCookie, readCookie] = useCookies();
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const tabCookie = readCookie("tab-order");
  const statusCookie = readCookie("status-order");
  const pageOrder = readCookie("page_order");
  const startCookie = readCookie("start_order");
  const kindCookie = readCookie("kind_order");
  const cityCookie = readCookie("city_order");
  const districtCookie = readCookie("district_order");
  const startDateCookie = readCookie("start_date_order");
  const endDateCookie = readCookie("end_date_order");

  useEffect(() => {
    window.scroll(0, Number(readCookie("order_scrolly")));
    setKeyActive(tabCookie === "" ? 0 : Number(tabCookie));
    setTab(statusCookie !== "" ? statusCookie : "all");
    setCurrentPage(pageOrder === "" ? 1 : Number(pageOrder));
    setStartPage(startCookie === "" ? 0 : Number(startCookie));
    setKind(kindCookie !== "" ? kindCookie : "");
    setCity(cityCookie !== "" ? cityCookie : "");
    setStartDate(
      startDateCookie !== ""
        ? startDateCookie
        : new Date("2022-12-31").toISOString()
    );
    setEndDate(
      endDateCookie !== ""
        ? endDateCookie
        : moment().endOf("date").toISOString()
    );
    setDistrict(districtCookie === "" ? [] : districtCookie.split(","));
    if (user?.area_manager_lv_1?.length === 0) {
      setCity(cityCookie !== "" ? cityCookie : []);
    } else {
      setCity(cityCookie === "" ? user?.area_manager_lv_1 : cityCookie);
    }

    getOrderApi(
      "",
      0,
      20,
      statusCookie !== "" ? statusCookie : "all",
      kindCookie !== "" ? kindCookie : "",
      type,
      startDateCookie !== ""
        ? startDateCookie
        : new Date("2022-12-31").toISOString(),
      endDateCookie !== ""
        ? endDateCookie
        : moment().endOf("date").toISOString(),
      user?.area_manager_lv_1?.length === 0
        ? cityCookie !== ""
          ? cityCookie
          : []
        : cityCookie === ""
        ? user?.area_manager_lv_1
        : cityCookie,
      districtCookie.split(",")
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
      });
  }, []);

  const cityOptions = [];
  const districtOption = [];
  const optionsService = [];

  service.forEach((item) => {
    if (user?.id_service_manager?.length === 0) {
      optionsService.push({
        value: item?._id,
        label: item?.title?.[lang],
      });
      return;
    } else {
      user?.id_service_manager?.forEach((i) => {
        if (item?._id === i?._id) {
          optionsService.push({
            value: item?._id,
            label: item?.title?.[lang],
          });
          return;
        }
      });
    }
  });

  province?.forEach((item) => {
    if (user?.area_manager_lv_1?.length === 0) {
      cityOptions.push({
        value: item?.code,
        label: item?.name,
        district: item?.districts,
      });
      return;
    } else if (user?.area_manager_lv_1?.includes(item?.code)) {
      cityOptions.push({
        value: item?.code,
        label: item?.name,
        district: item?.districts,
      });
      return;
    }
  });

  dataDistrict?.forEach((item) => {
    if (user?.area_manager_lv_2?.length === 0) {
      districtOption.push({
        value: item?.code,
        label: item?.name,
      });
      return;
    } else if (user?.area_manager_lv_2?.includes(item?.code)) {
      districtOption.push({
        value: item?.code,
        label: item?.name,
      });
      return;
    }
  });

  const handleSearch = useCallback(
    _debounce((value) => {
      getOrderApi(
        value,
        0,
        20,
        tab,
        kind,
        type,
        startDate,
        endDate,
        city,
        district
      )
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => {});
    }, 1000),
    [tab, kind, type, startDate, endDate, city, district]
  );

  const handleFilterByCondition = () => {
    setIsLoading(true);
    setCheckCondition(false);
    saveToCookie("district_order", district);
    saveToCookie(
      "start_date_order",
      condition === "date_create" || condition === "date_work" ? startDate : ""
    );
    saveToCookie(
      "end_date_order",
      condition === "date_create" || condition === "date_work" ? endDate : ""
    );
    saveToCookie("name_filter", name);
    saveToCookie("kind_order", kind);
    saveToCookie("city_order", city);

    getOrderApi(
      valueSearch,
      startPage,
      20,
      tab,
      kind,
      type,
      startDate,
      endDate,
      city,
      district
    )
      .then((res) => {
        setIsLoading(false);
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  };
  const onChangeTab = (value, item) => {
    setTab(value);
    setCheckCondition(false);
    setCurrentPage(1);
    setStartPage(0);
    setKeyActive(item?.key);
    saveToCookie("tab-order", item?.key);
    saveToCookie("status-order", item?.value);
    saveToCookie("order_scrolly", 0);
    saveToCookie("start_order", 0);
    saveToCookie("page_order", 1);
    getOrderApi(
      valueSearch,
      startPage,
      20,
      value,
      kind,
      type,
      startDate,
      endDate,
      city,
      district
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const onClearFilter = () => {
    setCity("");
    setKind("");
    setType("date_create");
    setStartDate("");
    setEndDate(new Date("2022-12-31").toISOString());
    saveToCookie("kind_order", "");
    saveToCookie("city_order", "");
    saveToCookie("district_order", "");
    saveToCookie("name_filter", "");
    saveToCookie("type_order", "");
    saveToCookie("start_date_order", "");
    saveToCookie("end_date_order", "");
    getOrderApi(
      valueSearch,
      startPage,
      20,
      tab,
      "",
      type,
      new Date("2022-12-31").toISOString(),
      moment().endOf("date").toISOString(),
      "",
      ""
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const items = [
    {
      label: (
        <div>
          <UilFileExport />
          <ExportCSV csvData={data} fileName={"order"} />
        </div>
      ),
      key: "0",
    },
  ];

  return (
    <div className="div-container-order">
      <div className="div-header">
        <p className="title-cv">{`${i18n.t("work_list", { lng: lang })}`}</p>
        <div className="div-add-order">
          <div className="div-add-export">
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
              className="dropdown-export"
            >
              <p className="m-0" onClick={(e) => e.preventDefault()}>
                <Space>
                  <UilEllipsisH className="icon-menu" />
                </Space>
              </p>
            </Dropdown>
          </div>
          {checkElement?.includes("create_guvi_job") ? (
            <Button
              className="btn-create-order"
              onClick={() => navigate("/group-order/manage-order/create-order")}
            >
              <i class="uil uil-plus-circle"></i>
              {`${i18n.t("create_order", { lng: lang })}`}
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="div-body-order">
        {width > 900 ? (
          <div className="div-tab">
            {itemTab.map((item, index) => {
              return (
                <div
                  key={index}
                  className={
                    item?.key === keyActive ? "item-tab-select" : "item-tab"
                  }
                  onClick={() => {
                    onChangeTab(item?.value, item);
                  }}
                >
                  <p className="text-title">{item?.label}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <Select
            options={itemTab}
            value={tab}
            onChange={(e, item) => {
              onChangeTab(item?.value, item);
            }}
            style={{ width: "100%" }}
          />
        )}
        <div className="div-search-filter-job">
          <div className="div-condition">
            <div
              className="div-codition-filter-job"
              onClick={() => setCheckCondition(!checkCondition)}
            >
              <i class="uil uil-filter"></i>
              <p className="text-condition">Điều kiện lọc</p>
            </div>

            {checkCondition && (
              <div className="div-condition-body">
                <p className="text-display-job">
                  Hiện thị tất cả đơn hàng theo:
                </p>
                <Select
                  onChange={(e) => {
                    setCondition(e);
                    if (e === "date_create") {
                      setType("date_create");
                      setCity("");
                      setKind("");
                      saveToCookie("type_order", "date_create");
                      // saveToCookie("kind_order", "");
                      // saveToCookie("city_order", "");
                    } else if (e === "date_work") {
                      setType("date_work");
                      setCity("");
                      setKind("");
                      saveToCookie("type_order", "date_work");
                      // saveToCookie("kind_order", "");
                      // saveToCookie("city_order", "");
                    } else if (e === "id_service") {
                      setCity("");
                      setStartDate(
                        moment("1-1-2023").startOf("date").toISOString()
                      );
                      setEndDate(
                        moment().endOf("date").add(7, "hours").toISOString()
                      );
                      // saveToCookie("city_order", "");
                    } else {
                      setKind("");
                      setStartDate(
                        moment("1-1-2023").startOf("date").toISOString()
                      );
                      setEndDate(
                        moment().endOf("date").add(7, "hours").toISOString()
                      );
                      // saveToCookie("kind_order", "");
                    }
                  }}
                  options={[
                    { value: "id_service", label: "Dịch vụ" },
                    { value: "city", label: "Tỉnh/Thành phố" },
                    { value: "date_create", label: "Ngày tạo" },
                    { value: "date_work", label: "Ngày làm" },
                  ]}
                />
                <div className="mt-2">
                  {condition === "id_service" ? (
                    <Select
                      style={{ width: "100%", marginRight: 10 }}
                      options={optionsService}
                      value={kind}
                      onChange={(e, item) => {
                        setKind(e);

                        setName(item?.label);
                      }}
                    />
                  ) : condition === "city" ? (
                    <Select
                      style={{ width: "100%", marginRight: 10 }}
                      options={cityOptions}
                      value={city}
                      onChange={(e, item) => {
                        setCity(e);
                        setDataDistrict(item?.district);
                        setName(item?.label);
                      }}
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
                  ) : condition === "date_create" ||
                    condition === "date_work" ? (
                    <RangePicker
                      onChange={(date, dateString) => {
                        setStartDate(moment(dateString[0]).toISOString());
                        setEndDate(moment(dateString[1]).toISOString());
                      }}
                    />
                  ) : (
                    ""
                  )}
                  {dataDistrict.length > 0 && (
                    <Select
                      placeholde="Chọn quận/huyện"
                      style={{ width: "100%", marginRight: 10, marginTop: 10 }}
                      mode="multiple"
                      options={districtOption}
                      value={district}
                      onChange={(e, item) => {
                        setDistrict(e);
                      }}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "").includes(input)
                      }
                    />
                  )}
                </div>
                <div className="footer-condition-filter">
                  <Button
                    type="primary"
                    style={{
                      width: "20%",
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                    }}
                    onClick={handleFilterByCondition}
                  >
                    Lọc
                  </Button>
                </div>
              </div>
            )}
          </div>
          <Input
            placeholder={`${i18n.t("search", { lng: lang })}`}
            value={valueSearch}
            prefix={<SearchOutlined />}
            className="input-filter-job"
            onChange={(e) => {
              handleSearch(e.target.value);
              setValueSearch(e.target.value);
            }}
          />
        </div>
        {readCookie("name_filter") !== "" && (
          <div className="div-name-filter">
            <p className="m-0">{readCookie("name_filter")}</p>
            <i
              class="uil uil-times-circle icon-close"
              onClick={onClearFilter}
            ></i>
          </div>
        )}

        {readCookie("start_date_order") !== "" && (
          <div className="div-date-filter">
            <div className="div-column-filter">
              <p className="m-0">
                {readCookie("type_order") === "date_work"
                  ? "Theo ngày làm"
                  : "Theo ngày tạo"}
              </p>
              <p className="m-0">
                {moment(readCookie("start_date_order"))
                  .add(7, "hours")
                  .format("DD/MM/YYYY")}
                -
                {moment(readCookie("end_date_order"))
                  .add(7, "hours")
                  .format("DD/MM/YYYY")}
              </p>
            </div>

            <i
              class="uil uil-times-circle icon-close"
              onClick={onClearFilter}
            ></i>
          </div>
        )}

        <div className="mt-3">
          <OrderManage
            data={data}
            total={total}
            status={tab}
            kind={kind}
            setData={setData}
            setTotal={setTotal}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setStartPage={setStartPage}
            startPage={startPage}
            type={type}
            startDate={startDate}
            endDate={endDate}
            valueSearch={valueSearch}
            city={city}
          />
        </div>
      </div>

      {isLoading && <LoadingPagination />}

      <FloatButton.BackTop />
    </div>
  );
};

export default ManageOrder;
