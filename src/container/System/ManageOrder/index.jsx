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
import { ExportCSV } from "../../../helper/export";
import i18n from "../../../i18n";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import { getProvince, getService } from "../../../redux/selectors/service";
import OrderManage from "./Order/OrderManage";
import "./index.scss";
import LoadingPagination from "../../../components/paginationLoading";
import { useCookies } from "../../../helper/useCookies";
import useWindowDimensions from "../../../helper/useWindowDimensions";
const { RangePicker } = DatePicker;

const ManageOrder = () => {
  const [tab, setTab] = useState("all");
  const [kind, setKind] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState("date_create");
  const [city, setCity] = useState("");
  const [checkCondition, setCheckCondition] = useState(false);
  const [condition, setCondition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    moment("1-1-2023").startOf("date").toISOString()
  );
  const [endDate, setEndDate] = useState(
    moment().endOf("date").add(7, "hours").toISOString()
  );
  const [keyActive, setKeyActive] = useState(0);
  const [itemTab, setItemTab] = useState([
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
  ]);
  const [saveToCookie, readCookie] = useCookies();
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const service = useSelector(getService);
  const province = useSelector(getProvince);

  useEffect(() => {
    window.scroll(0, Number(readCookie("order_scrolly")));

    setKeyActive(
      readCookie("tab-order") === "" ? 0 : Number(readCookie("tab-order"))
    );
    setCurrentPage(
      readCookie("page_order") === "" ? 1 : Number(readCookie("page_order"))
    );
    setStartPage(
      readCookie("start_order") === "" ? 0 : Number(readCookie("start_order"))
    );
  }, []);

  useEffect(() => {
    getOrderApi(valueSearch, 0, 20, tab, kind, type, startDate, endDate, city)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [tab]);

  const cityOptions = [];
  const optionsService = [
    {
      value: "",
      label: `${i18n.t("all", { lng: lang })}`,
    },
  ];

  service.map((item) => {
    optionsService.push({
      value: item?._id,
      label: item?.title?.[lang],
    });
  });

  province?.map((item) => {
    cityOptions.push({
      value: item?.code,
      label: item?.name,
    });
  });

  const handleSearch = useCallback(
    _debounce((value) => {
      getOrderApi(value, 0, 20, tab, kind, type, startDate, endDate, city)
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => {});
    }, 1000),
    [tab, kind, city]
  );

  const handleFilterByCondition = () => {
    setIsLoading(true);
    setCheckCondition(false);
    getOrderApi(valueSearch, 0, 20, tab, kind, type, startDate, endDate, city)
      .then((res) => {
        setIsLoading(false);
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {
        setIsLoading(false);
      });
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
        <a className="title-cv">{`${i18n.t("work_list", { lng: lang })}`}</a>
        <div className="div-add-order">
          <div className="div-add-export">
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
              className="dropdown-export"
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <UilEllipsisH className="icon-menu" />
                </Space>
              </a>
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
                    setTab(item?.value);
                    setKind("");
                    setCity("");
                    setType("date_create");
                    setCheckCondition(false);
                    setCurrentPage(1);
                    setStartPage(0);
                    setKeyActive(item?.key);
                    saveToCookie("tab-order", item?.key);
                    saveToCookie("order_scrolly", 0);
                    saveToCookie("start_order", 0);
                    saveToCookie("page_order", 1);
                  }}
                >
                  <a className="text-title">{item?.label}</a>
                </div>
              );
            })}
          </div>
        ) : (
          <Select
            options={itemTab}
            value={tab}
            onChange={(e, item) => {
              setTab(e);
              setKind("");
              setCity("");
              setType("date_create");
              setCheckCondition(false);
              setCurrentPage(1);
              setStartPage(0);
              setKeyActive(item?.key);
              saveToCookie("tab-order", item?.key);
              saveToCookie("order_scrolly", 0);
              saveToCookie("start_order", 0);
              saveToCookie("page_order", 1);
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
              <a className="text-condition">Điều kiện lọc</a>
            </div>

            {checkCondition && (
              <div className="div-condition-body">
                <a className="text-display-job">
                  Hiện thị tất cả đơn hàng theo:
                </a>
                <Select
                  onChange={(e) => {
                    setCondition(e);
                    if (e === "date_create") {
                      setType("date_create");
                      setCity("");
                      setKind("");
                    } else if (e === "date_work") {
                      setType("date_work");
                      setCity("");
                      setKind("");
                    } else if (e === "id_service") {
                      setCity("");
                      setStartDate(
                        moment("1-1-2023").startOf("date").toISOString()
                      );
                      setEndDate(
                        moment().endOf("date").add(7, "hours").toISOString()
                      );
                    } else {
                      setKind("");
                      setStartDate(
                        moment("1-1-2023").startOf("date").toISOString()
                      );
                      setEndDate(
                        moment().endOf("date").add(7, "hours").toISOString()
                      );
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
                      onChange={(e) => setKind(e)}
                    />
                  ) : condition === "city" ? (
                    <Select
                      style={{ width: "100%", marginRight: 10 }}
                      options={cityOptions}
                      onChange={(e) => setCity(e)}
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
