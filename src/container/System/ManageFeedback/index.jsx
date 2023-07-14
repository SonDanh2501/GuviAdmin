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

const ManageFeedback = () => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="div-container-feedback">
      <Tabs>
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
