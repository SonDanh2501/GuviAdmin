import { Tabs } from "antd";
import DeepCleaning from "./DeepCleaning";
import "./index.scss";

const DeepCleaningManager = () => {
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
