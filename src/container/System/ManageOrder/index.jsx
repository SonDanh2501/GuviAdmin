import { Space, Tabs, Dropdown, Input, FloatButton } from "antd";
import { ExportCSV } from "../../../helper/export";
import CustomTextInput from "../../../components/CustomTextInput/customTextInput";
import _debounce from "lodash/debounce";
import "./index.scss";
import OrderManage from "./Order/OrderManage";
import { UilEllipsisH, UilFileExport } from "@iconscout/react-unicons";
import {
  getOrderSelector,
  getOrderTotal,
  searchOrderSelector,
  searchOrderTotal,
} from "../../../redux/selectors/order";
import { getOrder, searchOrder } from "../../../redux/actions/order";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { searchOrderApi } from "../../../api/order";
import AddOrder from "./DrawerAddOrder";
import { SearchOutlined } from "@ant-design/icons";

const ManageOrder = () => {
  const [status, setStatus] = useState("all");
  const [dataSearch, setDataSearch] = useState([]);
  const [totalSearch, setTotalSearch] = useState(0);
  const [valueSearch, setValueSearch] = useState("");
  const [tab, setTab] = useState("theo_gio");

  const dispatch = useDispatch();
  const listOrder = useSelector(getOrderSelector);
  const orderTotal = useSelector(getOrderTotal);
  const listOrderSearch = useSelector(searchOrderSelector);
  const totalOrderSearch = useSelector(searchOrderTotal);

  useEffect(() => {
    dispatch(
      getOrder.getOrderRequest({
        start: 0,
        length: 20,
        status: "all",
        kind: "",
      })
    );
  }, [dispatch]);

  const handleSearch = useCallback(
    _debounce((value) => {
      dispatch(
        searchOrder.searchOrderRequest({
          start: 0,
          length: 20,
          status: status,
          value: value,
        })
      );
    }, 1000),
    [status]
  );

  const items = [
    {
      label: (
        <div>
          <UilFileExport />
          <ExportCSV csvData={listOrder} fileName={"order"} />
        </div>
      ),
      key: "0",
    },
  ];

  const onChangeTab = (active) => {
    if (active === "2") {
      setStatus("pending");
      setTab("theo_gio");
      dispatch(
        searchOrder.searchOrderRequest({
          start: 0,
          length: 20,
          status: "pending",
          value: "",
        })
      );
      dispatch(
        getOrder.getOrderRequest({
          start: 0,
          length: 20,
          status: "pending",
          kind: "",
        })
      );
    } else if (active === "3") {
      setStatus("doing");
      dispatch(
        searchOrder.searchOrderRequest({
          start: 0,
          length: 20,
          status: "doing",
          value: "",
        })
      );
      dispatch(
        getOrder.getOrderRequest({
          start: 0,
          length: 20,
          status: "doing",
          kind: "",
        })
      );
    } else if (active === "5") {
      setStatus("cancel");
      dispatch(
        searchOrder.searchOrderRequest({
          start: 0,
          length: 20,
          status: "cancel",
          value: "",
        })
      );
      dispatch(
        getOrder.getOrderRequest({
          start: 0,
          length: 20,
          status: "cancel",
          kind: "",
        })
      );
    } else if (active === "6") {
      setStatus("done");
      dispatch(
        searchOrder.searchOrderRequest({
          start: 0,
          length: 20,
          status: "done",
          value: "",
        })
      );
      dispatch(
        getOrder.getOrderRequest({
          start: 0,
          length: 20,
          status: "done",
          kind: "",
        })
      );
    } else if (active === "1") {
      setStatus("all");
      setTab("theo_gio");
      dispatch(
        searchOrder.searchOrderRequest({
          start: 0,
          length: 20,
          status: "all",
          value: "",
        })
      );
      dispatch(
        getOrder.getOrderRequest({
          start: 0,
          length: 20,
          status: "all",
          kind: "",
        })
      );
    }
  };
  return (
    <>
      <div className="div-header">
        <a className="title-cv">Danh sách công việc</a>
        <Input
          placeholder="Tìm kiếm"
          type="text"
          className="field-search"
          prefix={<SearchOutlined />}
          onChange={(e) => {
            handleSearch(e.target.value);
            setValueSearch(e.target.value);
          }}
        />
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
          <AddOrder />
        </div>
      </div>

      <div className="div-container">
        <Tabs defaultActiveKey="1" size="large" onChange={onChangeTab}>
          <Tabs.TabPane tab="TẤT CẢ" key="1">
            {/* <div className="div-tab">
              {DATA.map((item, index) => {
                return (
                  <div
                    className="div-tab-item"
                    key={index}
                    onClick={() => {
                      setTab(item?.value);
                      dispatch(
                        getOrder.getOrderRequest({
                          start: 0,
                          length: 20,
                          status: "all",
                          kind: item?.value,
                        })
                      );
                    }}
                  >
                    <a
                      className={
                        tab === item?.value
                          ? "text-title-tab"
                          : "text-title-tab-default"
                      }
                    >
                      {item?.title}
                    </a>
                    <div
                      className={tab === item?.value ? "tab-line" : ""}
                    ></div>
                  </div>
                );
              })}
            </div> */}
            <OrderManage
              data={listOrderSearch.length > 0 ? listOrderSearch : listOrder}
              total={totalOrderSearch > 0 ? totalOrderSearch : orderTotal}
              dataSearch={listOrderSearch}
              value={valueSearch}
              status={status}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="ĐANG CHỜ" key="2">
            {/* <div className="div-tab">
              {DATA.map((item, index) => {
                return (
                  <div
                    className="div-tab-item"
                    key={index}
                    onClick={() => {
                      setTab(item?.value);
                      dispatch(
                        getOrder.getOrderRequest({
                          start: 0,
                          length: 20,
                          status: "pending",
                          kind: item?.value,
                        })
                      );
                    }}
                  >
                    <a
                      className={
                        tab === item?.value
                          ? "text-title-tab"
                          : "text-title-tab-default"
                      }
                    >
                      {item?.title}
                    </a>
                    <div
                      className={tab === item?.value ? "tab-line" : ""}
                    ></div>
                  </div>
                );
              })}
            </div> */}
            <OrderManage
              data={listOrderSearch.length > 0 ? listOrderSearch : listOrder}
              total={totalOrderSearch > 0 ? totalOrderSearch : orderTotal}
              value={valueSearch}
              dataSearch={listOrderSearch}
              status={status}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="CHƯA HOÀN TẤT" key="3">
            <OrderManage
              data={listOrderSearch.length > 0 ? listOrderSearch : listOrder}
              total={totalOrderSearch > 0 ? totalOrderSearch : orderTotal}
              dataSearch={listOrderSearch}
              value={valueSearch}
              status={status}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="ĐÃ HẾT HẠN" key="4"></Tabs.TabPane>
          <Tabs.TabPane tab="VIỆC ĐÃ HUỶ" key="5">
            <OrderManage
              data={listOrderSearch.length > 0 ? listOrderSearch : listOrder}
              total={totalOrderSearch > 0 ? totalOrderSearch : orderTotal}
              dataSearch={listOrderSearch}
              value={valueSearch}
              status={status}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="HOÀN TẤT" key="6">
            <OrderManage
              data={listOrderSearch.length > 0 ? listOrderSearch : listOrder}
              total={totalOrderSearch > 0 ? totalOrderSearch : orderTotal}
              dataSearch={listOrderSearch}
              value={valueSearch}
              status={status}
            />
          </Tabs.TabPane>
        </Tabs>
        <FloatButton.BackTop />
      </div>
    </>
  );
};

export default ManageOrder;

const DATA = [
  {
    id: 1,
    title: "Giúp việc theo giờ",
    value: "theo_gio",
  },
  {
    id: 1,
    title: "Giúp việc cố định",
    value: "co_dinh",
  },
  {
    id: 1,
    title: "Lặp lại hằng tuần",
    value: "lap_lai",
  },
];
