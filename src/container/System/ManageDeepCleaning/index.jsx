import { Tabs } from "antd";
import DeepCleaning from "./DeepCleaning";
import "./index.scss";
import { useEffect } from "react";

const DeepCleaningManager = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <Tabs defaultActiveKey="1" size="large">
        <Tabs.TabPane tab="Tổng vệ sinh" key="1">
          <DeepCleaning />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default DeepCleaningManager;
