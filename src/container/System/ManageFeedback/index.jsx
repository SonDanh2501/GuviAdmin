import { Tabs } from "antd";
import Feedback from "./Feedback/Feedback";
import ReviewCollaborator from "./ReviewCollaborator";

import "./index.scss";
import { useEffect, useState } from "react";
import ExamTest from "./ExamTest";
import { getElementState } from "../../../redux/selectors/auth";
import { useSelector } from "react-redux";

const ManageFeedback = () => {
  const checkElement = useSelector(getElementState);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="div-contai-feedback">
        <Tabs>
          {checkElement?.includes("list_review") && (
            <Tabs.TabPane tab="Đánh giá CTV" key="1">
              <ReviewCollaborator />
            </Tabs.TabPane>
          )}
          {checkElement?.includes("list_feedback") && (
            <Tabs.TabPane tab="Phản hồi" key="2">
              <Feedback />
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default ManageFeedback;
