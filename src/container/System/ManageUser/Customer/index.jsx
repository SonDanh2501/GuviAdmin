import { FloatButton, Tabs } from "antd";

import "./index.scss";

import { useEffect, useState } from "react";
import UserManage from "./TableCustomer/UserManage";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";
import { getGroupCustomer } from "../../../../redux/selectors/customer";
import { getGroupCustomerApi } from "../../../../api/promotion";

const ManageCustomer = () => {
  const [status, setStatus] = useState("");
  const lang = useSelector(getLanguageState);
  const [dataGroup, setDataGroup] = useState([]);
  const [idGroup, setIdGroup] = useState("all");
  const dataTab = [{ value: "all", label: "Tất cả" }];

  useEffect(() => {
    getGroupCustomerApi(0, 20)
      .then((res) => {
        setDataGroup(res?.data);
      })
      .catch((err) => {});
  }, []);

  dataGroup?.map((item) => {
    dataTab.push({
      value: item?._id,
      label: item?.name,
    });
  });

  const onChangeTab = (active) => {
    if (active === "2") {
      setStatus("member");
    } else if (active === "3") {
      setStatus("silver");
    } else if (active === "4") {
      setStatus("gold");
    } else if (active === "5") {
      setStatus("platinum");
    } else if (active === "6") {
      setStatus("birthday");
    } else if (active === "7") {
      setStatus("block");
    } else {
      setStatus("");
    }
  };

  return (
    <>
      <div className="div-header-customer">
        <a className="title-cv">{`${i18n.t("list_customer", {
          lng: lang,
        })}`}</a>
      </div>

      <div className="div-container-customer">
        {/* <Tabs defaultActiveKey="1" size="large" onChange={onChangeTab}>
        
          <Tabs.TabPane tab={`${i18n.t("all", { lng: lang })}`} key="1">
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${i18n.t("member_customer", { lng: lang })}`}
            key="2"
          >
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${i18n.t("silver_customer", { lng: lang })}`}
            key="3"
          >
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${i18n.t("gold_customer", { lng: lang })}`}
            key="4"
          >
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${i18n.t("platinum_customer", { lng: lang })}`}
            key="5"
          >
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${i18n.t("month_birthday", { lng: lang })}`}
            key="6"
          >
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${i18n.t("customer_block", { lng: lang })}`}
            key="7"
          >
            <UserManage status={status} />
          </Tabs.TabPane>
        </Tabs> */}
        <div className="div-tab-customer">
          {dataTab?.map((item, index) => {
            return (
              <div
                key={index}
                className={
                  idGroup === item?.value
                    ? "div-item-tab-select"
                    : "div-item-tab"
                }
                onClick={() => setIdGroup(item?.value)}
              >
                <a className="text-tab">{item?.label}</a>
              </div>
            );
          })}
        </div>

        <div className="mt-3">
          <UserManage status={status} idGroup={idGroup} />
        </div>
      </div>
      <FloatButton.BackTop />
    </>
  );
};

export default ManageCustomer;
