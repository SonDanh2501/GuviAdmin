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

  const dispatch = useDispatch();
  const listOrder = useSelector(getOrderSelector);
  const orderTotal = useSelector(getOrderTotal);
  const listOrderSearch = useSelector(searchOrderSelector);
  const totalOrderSearch = useSelector(searchOrderTotal);

  useEffect(() => {
    dispatch(getOrder.getOrderRequest({ start: 0, length: 20, status: "all" }));
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
      dispatch(
        searchOrder.searchOrderRequest({
          start: 0,
          length: 20,
          status: "pending",
          value: "",
        })
      );
      dispatch(
        getOrder.getOrderRequest({ start: 0, length: 20, status: "pending" })
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
        getOrder.getOrderRequest({ start: 0, length: 20, status: "doing" })
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
        getOrder.getOrderRequest({ start: 0, length: 20, status: "cancel" })
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
        getOrder.getOrderRequest({ start: 0, length: 20, status: "done" })
      );
    } else if (active === "1") {
      setStatus("all");
      dispatch(
        searchOrder.searchOrderRequest({
          start: 0,
          length: 20,
          status: "all",
          value: "",
        })
      );
      dispatch(
        getOrder.getOrderRequest({ start: 0, length: 20, status: "all" })
      );
    }
  };
  return (
    <>
      <div className="div-header">
        <a className="title-cv">Danh sách công việc</a>
        {/* <CustomTextInput
          placeholder="Tìm kiếm"
          type="text"
          className="field-search"
          onChange={(e) => {
            handleSearch(e.target.value);
            setValueSearch(e.target.value);
          }}
        /> */}
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
            <OrderManage
              data={listOrderSearch.length > 0 ? listOrderSearch : listOrder}
              total={totalOrderSearch > 0 ? totalOrderSearch : orderTotal}
              dataSearch={listOrderSearch}
              value={valueSearch}
              status={status}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="ĐANG CHỜ" key="2">
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
