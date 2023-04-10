import { Navigate, Route, Routes } from "react-router-dom";

import ManagePushNotification from "../container/System/ManagePushNotification";
import FeedbackManage from "../container/System/ManageFeedback/FeedbackManage";
import ManageSetting from "../container/System/ManageSetting";

const Marketing = () => {
  return (
    <Routes>
      <Route path="/promotion/manage-setting" element={<ManageSetting />} />
      <Route
        path="/notification/manage-push-notification"
        element={<ManagePushNotification />}
      />
      <Route path="/feedback/manage-feedback" element={<FeedbackManage />} />
    </Routes>
  );
};

export default Marketing;
