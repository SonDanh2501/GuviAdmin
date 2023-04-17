import { Route, Routes } from "react-router-dom";

import ManageFeedback from "../container/System/ManageFeedback";
import ManagePushNotification from "../container/System/ManagePushNotification";
import ManageSetting from "../container/System/ManageSetting";

const Marketing = () => {
  return (
    <Routes>
      <Route path="/promotion/manage-setting" element={<ManageSetting />} />
      <Route
        path="/notification/manage-push-notification"
        element={<ManagePushNotification />}
      />
      <Route path="/feedback/manage-feedback" element={<ManageFeedback />} />
    </Routes>
  );
};

export default Marketing;
