import { Tabs } from "antd";
import Feedback from "./Feedback/Feedback";
import ReviewCollaborator from "./ReviewCollaborator";

import "./index.scss";
import { useEffect, useState } from "react";
import ExamTest from "./ExamTest";

const ManageFeedback = () => {
  const [tab, setTab] = useState("review");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="div-contai-feedback">
        {/* <Tabs>
        <Tabs.TabPane tab="Đánh giá CTV" key="1">
          <ReviewCollaborator />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Phản hồi" key="2">
          <Feedback />
        </Tabs.TabPane>
      </Tabs> */}
        {DATA_TAB.map((item) => {
          return (
            <div
              key={item?.id}
              onClick={() => setTab(item?.value)}
              className={
                tab === item?.value
                  ? "div-tab-feedback-selected"
                  : "div-tab-feedback"
              }
            >
              <a
                className={
                  tab == item?.value ? "text-tab-selected" : "text-tab"
                }
              >
                {item?.title}
              </a>
            </div>
          );
        })}
      </div>
      <div className="mt-3">
        {tab === "review" ? (
          <ReviewCollaborator />
        ) : tab === "feedback" ? (
          <Feedback />
        ) : (
          <ExamTest />
          // <></>
        )}
      </div>
    </>
  );
};

export default ManageFeedback;

const DATA_TAB = [
  {
    id: 1,
    title: "Đánh giá CTV",
    value: "review",
  },
  {
    id: 2,
    title: "Phản hồi",
    value: "feedback",
  },
  {
    id: 3,
    title: "Bài kiểm tra",
    value: "examTest",
  },
];
