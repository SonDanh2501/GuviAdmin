import { Tabs } from "antd";
import ReviewCollaborator from "./ReviewCollaborator";
import "./index.scss";
import { useEffect, useState } from "react";
import { getElementState } from "../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import Feedback from "./Feedback/Feedback";

const ManageFeedback = () => {
  const checkElement = useSelector(getElementState);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Tabs>
        {checkElement?.includes("list_review_support_customer") && (
          <Tabs.TabPane tab="Đánh giá CTV" key="1">
            <ReviewCollaborator />
          </Tabs.TabPane>
        )}
        {checkElement?.includes("list_feedback_support_customer") && (
          <Tabs.TabPane tab="Phản hồi" key="2">
            <Feedback />
          </Tabs.TabPane>
        )}
      </Tabs>
    </>
  );
};

export default ManageFeedback;
