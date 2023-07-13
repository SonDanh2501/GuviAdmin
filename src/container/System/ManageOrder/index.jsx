import { UilEllipsisH, UilFileExport } from "@iconscout/react-unicons";
import {
  Button,
  Dropdown,
  FloatButton,
  Input,
  Select,
  Space,
  Tabs,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DATA, DATA_STATUS } from "../../../api/fakeData";
import { getOrderApi } from "../../../api/order";
import { ExportCSV } from "../../../helper/export";
import { getOrder } from "../../../redux/actions/order";
import {
  getElementState,
  getLanguageState,
  getUser,
} from "../../../redux/selectors/auth";
import _debounce from "lodash/debounce";
import OrderManage from "./Order/OrderManage";
import "./index.scss";
import i18n from "../../../i18n";
import { getService } from "../../../redux/selectors/service";
import InputCustom from "../../../components/textInputCustom";
import CustomDatePicker from "../../../components/customDatePicker";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";

const ManageOrder = () => {
  const [tab, setTab] = useState("all");
  const [kind, setKind] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState("date_create");
  const [startDate, setStartDate] = useState(
    moment("1-1-2023").startOf("date").toISOString()
  );
  const [endDate, setEndDate] = useState(
    moment().endOf("date").add(7, "hours").toISOString()
  );
  const [keyActive, setKeyActive] = useState(0);
  const [itemTab, setItemTab] = useState([
    {
      title: "Tất cả đơn hàng",
      status: "all",
      key: 0,
    },
    {
      title: "Đang chờ làm",
      status: "pending",
      key: 1,
    },
    {
      title: "Đã nhận",
      status: "confirm",
      key: 2,
    },
    {
      title: "Đang làm",
      status: "doing",
      key: 3,
    },
    {
      title: "Đã huỷ",
      status: "cancel",
      key: 4,
    },
    {
      title: "Hoàn thành",
      status: "done",
      key: 5,
    },
  ]);
  const navigate = useNavigate();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const service = useSelector(getService);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    getOrderApi(valueSearch, 0, 20, tab, kind, type, startDate, endDate)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [tab, kind, type, startDate, endDate]);

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

  const handleSearch = useCallback(
    _debounce((value) => {
      getOrderApi(value, 0, 20, tab, kind, type, startDate, endDate).then(
        (res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        }
      );
    }, 1000),
    [tab, kind]
  );

  const onChangeDay = () => {
    getOrderApi(valueSearch, 0, 20, tab, kind, type, startDate, endDate)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const onChangeService = (e) => {
    setKind(e);
    getOrderApi(valueSearch, 0, 20, tab, e, type, startDate, endDate)
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
        <div className="div-tab">
          {itemTab.map((item, index) => {
            return (
              <div
                key={index}
                className={
                  item?.key === keyActive ? "item-tab-select" : "item-tab"
                }
                onClick={() => {
                  setTab(item?.status);
                  setKind("");

                  setCurrentPage(1);
                  setStartPage(0);
                  setKeyActive(item?.key);
                }}
              >
                <a className="text-title">{item?.title}</a>
              </div>
            );
          })}
        </div>
        <div className="div-search-filter">
          <Select
            value={kind}
            style={{ width: "20%", marginRight: 10 }}
            options={optionsService}
            onChange={onChangeService}
          />
          <Input
            placeholder={`${i18n.t("search", { lng: lang })}`}
            type="text"
            className="input-search-order"
            value={valueSearch}
            prefix={<SearchOutlined />}
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
          />
        </div>
      </div>

      {/* <div className="div-select-status">
        <InputCustom
          title="Trạng thái"
          style={{ width: 150 }}
          value={tab}
          onChange={(e) => {
            setTab(e);
            setKind("");
            setValueTab("");
            setCurrentPage(1);
            setStartPage(0);
          }}
          select={true}
          options={[
            {
              value: "all",
              label: `${i18n.t("all", { lng: lang })}`,
            },
            {
              value: "pending",
              label: `${i18n.t("pending", { lng: lang })}`,
            },
            {
              value: "confirm",
              label: `${i18n.t("confirm", { lng: lang })}`,
            },
            {
              value: "doing",
              label: `${i18n.t("doing", { lng: lang })}`,
            },
            {
              value: "cancel",
              label: `${i18n.t("cancel", { lng: lang })}`,
            },
            {
              value: "done",
              label: `${i18n.t("complete", { lng: lang })}`,
            },
          ]}
        />
        <InputCustom
          title="Dịch vụ"
          style={{ width: 200 }}
          value={valueTab}
          onChange={(e) => {
            setKind(e);
            setValueTab(e);
            setCurrentPage(1);
            setStartPage(0);
          }}
          select={true}
          options={optionsService}
        />
        <InputCustom
          title="Theo ngày"
          style={{ width: 100 }}
          value={type}
          onChange={(e) => {
            setType(e);
          }}
          select={true}
          options={[
            { value: "all", label: "Tất cả" },
            { value: "date_create", label: "Ngày tạo" },
          ]}
        />

        <div className="div-date">
          <CustomDatePicker
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onClick={onChangeDay}
            onCancel={() => {}}
          />
          {startDate && (
            <a className="text-date">
              {moment(startDate).format("DD/MM/YYYY")} -{" "}
              {moment(endDate).utc().format("DD/MM/YYYY")}
            </a>
          )}
        </div>
      </div> */}

      <FloatButton.BackTop />
    </div>
  );
};

export default ManageOrder;
