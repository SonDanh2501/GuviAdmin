import { Tabs } from "antd";
import DeepCleaning from "./DeepCleaning";
import "./index.scss";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../redux/selectors/auth";
import i18n from "../../../i18n";

const DeepCleaningManager = () => {
  const lang = useSelector(getLanguageState);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="div-container-deep">
      <Tabs defaultActiveKey="1" size="small">
        <Tabs.TabPane tab={`${i18n.t("deep_cleaning", { lng: lang })}`} key="1">
          <DeepCleaning />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default DeepCleaningManager;
