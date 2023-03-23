import { Tabs } from "antd";
import { useEffect, useState } from "react";

import "./index.scss";
import TableDeepCleaning from "./TableDeepCleaning";

const DeepCleaning = () => {
  const [status, setStatus] = useState("all");

  const onChangeTab = (active) => {
    if (active === "2") {
      setStatus("pending");
    } else if (active === "3") {
      setStatus("done");
    } else if (active === "4") {
      setStatus("cancel");
    } else {
      setStatus("all");
    }
  };
  return (
    <div>
      <Tabs defaultActiveKey="1" size="large" onChange={onChangeTab}>
        <Tabs.TabPane tab="Tất cả" key="1">
          <TableDeepCleaning status={status} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Đang chờ" key="2">
          <TableDeepCleaning status={status} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Hoàn tất" key="3">
          <TableDeepCleaning status={status} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Huỷ" key="4">
          <TableDeepCleaning status={status} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default DeepCleaning;
