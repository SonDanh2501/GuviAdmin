import { Tabs } from "antd";
import Feedback from "./Feedback/Feedback";
import ReviewCollaborator from "./ReviewCollaborator";

const ManageFeedback = () => {
  return (
    <>
      <Tabs>
        <Tabs.TabPane tab="Phản hồi" key="1">
          <Feedback />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Đánh giá" key="2">
          <ReviewCollaborator />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default ManageFeedback;
