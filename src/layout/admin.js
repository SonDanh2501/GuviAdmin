import { Route, Routes } from "react-router-dom";

import Home from "../container/System/Dashboard/DashBoard";
import DetailsOrder from "../container/System/DetailsOrder";
import DetailsOrderSchedule from "../container/System/DetailsOrder/OrderScheduleDetails";
import ManageConfiguration from "../container/System/ManageConfiguration/ManageConfiguration";
import AppCollaborator from "../container/System/ManageConfiguration/ScreenConfiguration/AppCollaborator";
import AppCustomer from "../container/System/ManageConfiguration/ScreenConfiguration/AppCustomer";
import CreateAccount from "../container/System/ManageConfiguration/ScreenConfiguration/CreateAccount";
import GroupCustomerManage from "../container/System/ManageConfiguration/ScreenConfiguration/GroupCustomer";
import SettingQrCode from "../container/System/ManageConfiguration/ScreenConfiguration/SettingQrcode";
import DeepCleaningManager from "../container/System/ManageDeepCleaning";
import ManageFeedback from "../container/System/ManageFeedback";
import ManageFinance from "../container/System/ManageFinance";
import ManageOrder from "../container/System/ManageOrder";
import AddOrder from "../container/System/ManageOrder/DrawerAddOrder";
import OrderDoingManage from "../container/System/ManageOrder/OrderDoing/OrderDoingManage";
import OrderUsePromotion from "../container/System/ManagePromotion/OrderUsePromotion";
import ManagePushNotification from "../container/System/ManagePushNotification";
import ManageReport from "../container/System/ManageReport";
import DetailReportManager from "../container/System/ManageReport/DetailsReportCollaborator";
import ReportInviteDetails from "../container/System/ManageReport/ReportInvite/ReportInviteDetails";
import DetailRegisterCustomer from "../container/System/ManageReport/ReportUser/DetailRegisterCustomer";
import GroupServiceManage from "../container/System/ManageService/ManageGroupService/GroupServiceManage";
import ServiceManage from "../container/System/ManageService/ManageService/ServiceManage";
import ManageSetting from "../container/System/ManageSetting";
import ReasonManage from "../container/System/ManageConfiguration/ScreenConfiguration/ManageReason/ReasonManage";
import ManageTopup from "../container/System/ManageTopup";
import ManageCollaborator from "../container/System/ManageUser/Collaborator";
import ProfileCollaborator from "../container/System/ManageUser/Collaborator/ProfilesCollaborator/ProfileCollaborator";
import DetailActivityCollaborator from "../container/System/ManageUser/Collaborator/ProfilesCollaborator/components/DetailActivity";
import ManageCustomer from "../container/System/ManageUser/Customer";
import Profiles from "../container/System/ManageUser/Customer/Profiles";
import ChildPromotion from "../container/System/ManagePromotion/ChildPromotion";
import PriceService from "../container/System/ManageService/PriceService";
import AddGroupCustomer from "../container/System/ManageConfiguration/ScreenConfiguration/GroupCustomer/addGroupCustomer";
import EditGroupCustomer from "../container/System/ManageConfiguration/ScreenConfiguration/GroupCustomer/editGroupCustomer";
import OrderExpired from "../container/System/ManageOrder/OrderExpired";
import CreateQuizz from "../container/System/ManageConfiguration/ScreenConfiguration/CreateQuizz";
import ManageOptionService from "../container/System/ManageService/ManageOptionalService";
import ExtendOptional from "../container/System/ManageService/ManageExtendOptional";
import ReasonPunish from "../container/System/ManageConfiguration/ScreenConfiguration/ReasonPunish";
import EditPriceService from "../container/System/ManageService/EditPriceService";
import RoleAccount from "../container/System/ManageConfiguration/ScreenConfiguration/RoleAccount";
import GroupService from "../container/System/ManageService/GroupService";
import Service from "../container/System/ManageService/Service";

const Admin = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/system/deep-cleaning" element={<DeepCleaningManager />} />
      <Route path="/details-order" element={<DetailsOrder />} />
      <Route
        path="/details-order/details-order-schedule"
        element={<DetailsOrderSchedule />}
      />
      <Route path="/details-collaborator" element={<ProfileCollaborator />} />
      <Route path="/details-customer" element={<Profiles />} />
      <Route path="/system/user-manage" element={<ManageCustomer />} />
      <Route
        path="/system/user-manage/details-customer"
        element={<Profiles />}
      />
      <Route
        path="/system/collaborator-manage"
        element={<ManageCollaborator />}
      />
      <Route
        path="/system/collaborator-manage/details-collaborator"
        element={<ProfileCollaborator />}
      />
      <Route
        path="/system/collaborator-manage/details-collaborator/details-activity"
        element={<DetailActivityCollaborator />}
      />
      <Route path="/promotion/manage-setting" element={<ManageSetting />} />
      <Route
        path="/promotion/manage-setting/child-promotion"
        element={<ChildPromotion />}
      />

      <Route
        path="/promotion/manage-setting/order-promotion"
        element={<OrderUsePromotion />}
      />
      <Route path="/services/edit-service" element={<EditPriceService />} />
      <Route
        path="/services/manage-group-service"
        element={<GroupServiceManage />}
      />
      <Route
        path="/services/manage-group-service/manage-service"
        element={<ServiceManage />}
      />
      <Route
        path="/services/manage-group-service/group-service"
        element={<GroupService />}
      />
      <Route
        path="/services/manage-group-service/service"
        element={<Service />}
      />
      <Route
        path="/services/manage-group-service/manage-service/option-service"
        element={<ManageOptionService />}
      />
      <Route
        path="/services/manage-group-service/manage-service/option-service/extend-option"
        element={<ExtendOptional />}
      />
      <Route
        path="/services/manage-group-service/manage-price-service"
        element={<PriceService />}
      />
      <Route path="/feedback/manage-feedback" element={<ManageFeedback />} />
      <Route path="/group-order/manage-order" element={<ManageOrder />} />

      <Route
        path="/group-order/manage-order/create-order"
        element={<AddOrder />}
      />
      <Route
        path="/group-order/manage-order/details-collaborator"
        element={<ProfileCollaborator />}
      />
      <Route
        path="/group-order/manage-order/details-customer"
        element={<Profiles />}
      />
      <Route path="/profile-customer" element={<Profiles />} />
      <Route path="/group-order/manage-order/all" element={<ManageOrder />} />
      <Route
        path="/group-order/manage-order/doing"
        element={<OrderDoingManage />}
      />
      <Route path="/group-order/manage-order/done" element={<OrderExpired />} />

      <Route path="/topup/manage-topup" element={<ManageTopup />} />
      <Route path="/finance/manage-finance" element={<ManageFinance />} />

      <Route
        path="/adminManage/manage-configuration/manage-group-customer"
        element={<GroupCustomerManage />}
      />
      <Route path="/report/manage-report" element={<ManageReport />} />
      <Route path="/report/manage-report/all" element={<ManageReport />} />
      <Route
        path="/report/manage-report/report-details"
        element={<DetailReportManager />}
      />
      <Route
        path="/report/manage-report/details-register-customer"
        element={<DetailRegisterCustomer />}
      />

      <Route
        path="/report/manage-report/details-customer-invite"
        element={<ReportInviteDetails />}
      />

      <Route
        path="/notification/manage-push-notification"
        element={<ManagePushNotification />}
      />

      <Route
        path="/adminManage/manage-configuration"
        element={<ManageConfiguration />}
      />
      <Route
        path="/adminManage/manage-configuration/manage-reason"
        element={<ReasonManage />}
      />
      <Route
        path="/adminManage/manage-configuration/manage-app-customer"
        element={<AppCustomer />}
      />
      <Route
        path="/adminManage/manage-configuration/manage-app-collaborator"
        element={<AppCollaborator />}
      />
      <Route
        path="/adminManage/manage-configuration/setting-qrcode"
        element={<SettingQrCode />}
      />
      <Route
        path="/adminManage/manage-configuration/create-account"
        element={<CreateAccount />}
      />
      <Route
        path="/adminManage/manage-configuration/manage-group-customer/create"
        element={<AddGroupCustomer />}
      />
      <Route
        path="/adminManage/manage-configuration/manage-group-customer/details-edit"
        element={<EditGroupCustomer />}
      />
      <Route
        path="/adminManage/manage-configuration/create_quizz"
        element={<CreateQuizz />}
      />
      <Route
        path="/adminManage/manage-configuration/reason_punish"
        element={<ReasonPunish />}
      />
      <Route
        path="/adminManage/manage-configuration/setting_role"
        element={<RoleAccount />}
      />
    </Routes>
  );
};

export default Admin;
