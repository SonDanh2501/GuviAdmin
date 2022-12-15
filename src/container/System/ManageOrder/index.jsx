import { Space, Tabs, Dropdown } from "antd";
import { ExportCSV } from "../../../helper/export";
import CustomTextInput from "../../../components/CustomTextInput/customTextInput";

import "./index.scss";
import OrderManage from "./Order/OrderManage";
import { UilEllipsisH, UilFileExport } from "@iconscout/react-unicons";
import {
  getOrderSelector,
  getOrderTotal,
} from "../../../redux/selectors/order";
import { getOrder } from "../../../redux/actions/order";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const ManageOrder = () => {
  const dispatch = useDispatch();
  const listOrder = useSelector(getOrderSelector);
  const orderTotal = useSelector(getOrderTotal);
  const [status, setStatus] = useState("all");

  useEffect(() => {
    // dispatch(loadingAction.loadingRequest(true));
    dispatch(getOrder.getOrderRequest({ start: 0, length: 10, status: "all" }));
  }, [dispatch]);

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
    console.log(active);
    if (active === "2") {
      dispatch(
        getOrder.getOrderRequest({ start: 0, length: 10, status: "pending" })
      );
    } else if (active === "3") {
      dispatch(
        getOrder.getOrderRequest({ start: 0, length: 10, status: "doing" })
      );
    } else if (active === "5") {
      dispatch(
        getOrder.getOrderRequest({ start: 0, length: 10, status: "cancel" })
      );
    } else if (active === "6") {
      dispatch(
        getOrder.getOrderRequest({ start: 0, length: 10, status: "done" })
      );
    } else if (active === "1") {
      dispatch(
        getOrder.getOrderRequest({ start: 0, length: 10, status: "all" })
      );
    }
  };
  return (
    <>
      <div className="div-header">
        <a className="title-cv">Danh sách công việc</a>
        <CustomTextInput
          placeholder="Tìm kiếm"
          type="text"
          className="field-search"
          //   onChange={(e) => handleSearch(e.target.value)}
        />
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

      <div className="div-container">
        <Tabs defaultActiveKey="1" size="large" onChange={onChangeTab}>
          <Tabs.TabPane tab="TẤT CẢ" key="1">
            <OrderManage data={listOrder} total={orderTotal} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="ĐANG CHỜ" key="2">
            <OrderManage data={listOrder} total={orderTotal} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="CHƯA HOÀN TẤT" key="3">
            <OrderManage data={listOrder} total={orderTotal} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="ĐÃ HẾT HẠN" key="4"></Tabs.TabPane>
          <Tabs.TabPane tab="VIỆC ĐÃ HUỶ" key="5">
            <OrderManage data={listOrder} total={orderTotal} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="HOÀN TẤT" key="6">
            <OrderManage data={listOrder} total={orderTotal} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default ManageOrder;
