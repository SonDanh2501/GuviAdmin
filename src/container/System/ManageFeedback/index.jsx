import { Tabs } from "antd";
import ReviewCollaborator from "./ReviewCollaborator";
import "./index.scss";
import { useEffect, useState } from "react";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import Feedback from "./Feedback/Feedback";
import i18n from "../../../i18n";
import { useCookies } from "../../../helper/useCookies";

const ManageFeedback = () => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const [keyActive, setActiveKey] = useState("1");
  const [saveToCookie, readCookie] = useCookies();
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveKey(
      readCookie("tab_feedback") === "" ? "1" : readCookie("tab_feedback")
    );
  }, []);

  const onChangeTab = (key) => {
    setActiveKey(key);
    saveToCookie("tab_feedback", key);
  };

  return (
    <div className="div-container-feedback">
      <Tabs activeKey={keyActive} onChange={onChangeTab}>
        {checkElement?.includes("list_review_support_customer") && (
          <Tabs.TabPane
            tab={`${i18n.t("review_collaborator", { lng: lang })}`}
            key="1"
          >
            <ReviewCollaborator />
          </Tabs.TabPane>
        )}
        {checkElement?.includes("list_feedback_support_customer") && (
          <Tabs.TabPane tab={`${i18n.t("feedback", { lng: lang })}`} key="2">
            <Feedback />
          </Tabs.TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default ManageFeedback;
