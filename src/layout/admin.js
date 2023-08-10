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
import ReportInviteDetails from "../container/System/ManageReport/ManageReportCustomer/ReportInvite/ReportInviteDetails";
import DetailRegisterCustomer from "../container/System/ManageReport/ManageReportCustomer/ReportUser/DetailRegisterCustomer";
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
import ReportOrder from "../container/System/ManageReport/MangeReportOrder/ReportOrder";
import ReportOrderDaily from "../container/System/ManageReport/MangeReportOrder/ReportOrderDaily";
import ReportOrderCity from "../container/System/ManageReport/MangeReportOrder/ReportOrderByCity";
import ReportCustomer from "../container/System/ManageReport/MangeReportOrder/ReportCutomer";
import ReportUser from "../container/System/ManageReport/ManageReportCustomer/ReportUser";
import ReportInvite from "../container/System/ManageReport/ManageReportCustomer/ReportInvite";
import ReportCustomerArea from "../container/System/ManageReport/ManageReportCustomer/ReportCustomerArea";
import CreateRole from "../container/System/ManageConfiguration/ScreenConfiguration/RoleAccount/CreateRole";
import EditRole from "../container/System/ManageConfiguration/ScreenConfiguration/RoleAccount/EditRole";
import ReportDetailOrderDaily from "../container/System/ManageReport/MangeReportOrder/ReportOrderDaily/DetailOrderDaily";
import ReportCollaborator from "../container/System/ManageReport/ManagerReportCollaborator/ReportCollaborator";
import RewardCollaborator from "../container/System/ManageConfiguration/ScreenConfiguration/RewardCollaborator";
import AddRewardCollaborator from "../container/System/ManageConfiguration/ScreenConfiguration/RewardCollaborator/AddRewardCollaborator";
import ReportOrderCreate from "../container/System/ManageReport/MangeReportOrder/ReportOrderCreate";
import EditRewardCollaborator from "../container/System/ManageConfiguration/ScreenConfiguration/RewardCollaborator/EditRewardCollaborator";
import DetailReward from "../container/System/ManageTopup/ManageTopupCollaborator/Reward/DetailReward";
import ImageManage from "../container/System/ManageConfiguration/ScreenConfiguration/ImageManage";
import ReportOrderDayInWeek from "../container/System/ManageReport/MangeReportOrder/ReportOrderDayOfWeek";
import ReportCustomerOrderByArea from "../container/System/ManageReport/ManageReportCustomer/ReportCustomerOrderByArea";
import PromotionDrag from "../container/System/ManagePromotion/PromotionDrag";
import CreatePromotion from "../container/System/ManagePromotion/CreatePromotion";
import DetailLesson from "../container/System/ManageConfiguration/ScreenConfiguration/CreateQuizz/DetailLesson";
import OptionalService from "../container/System/ManageService/Service/OptionalService";
import EditPrice from "../container/System/ManageService/Service/EditPrice";
import ExtendOptionalService from "../container/System/ManageService/Service/ExtendOptional";
import ManagePromotions from "../container/System/ManagePromotion";
import BannerManage from "../container/System/ManageSetting/ManageBanner/BannerManage";
import NewsManage from "../container/System/ManageSetting/ManageNews/NewsManage";
import EditPromotion from "../container/System/ManagePromotion/PromotionEdit";
import SettingGroupPromotion from "../container/System/ManageConfiguration/ScreenConfiguration/SettingGroupPromotion";
import BusinessConfig from "../container/System/ManageConfiguration/ScreenConfiguration/BusinessConfig";

const Admin = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/system/deep-cleaning" element={<DeepCleaningManager />} />
      <Route path="/details-order/:id" element={<DetailsOrder />} />
      <Route
        path="/details-order/details-order-schedule/:id"
        element={<DetailsOrderSchedule />}
      />
      <Route
        path="/details-collaborator/:id"
        element={<ProfileCollaborator />}
      />
      <Route path="/system/user-manage" element={<ManageCustomer />} />
      <Route path="/profile-customer/:id" element={<Profiles />} />
      <Route
        path="/system/collaborator-manage"
        element={<ManageCollaborator />}
      />
      <Route
        path="/system/collaborator-manage/details-collaborator/details-activity"
        element={<DetailActivityCollaborator />}
      />
      <Route path="/promotion/manage-setting" element={<ManagePromotions />} />
      <Route
        path="/promotion/manage-setting/promotion"
        element={<ManagePromotions />}
      />
      <Route
        path="/promotion/manage-setting/banner"
        element={<BannerManage />}
      />
      <Route path="/promotion/manage-setting/news" element={<NewsManage />} />

      <Route
        path="/promotion/manage-setting/child-promotion"
        element={<ChildPromotion />}
      />

      <Route
        path="/promotion/manage-setting/edit-position-promotion"
        element={<PromotionDrag />}
      />
      <Route
        path="/promotion/manage-setting/create-promotion"
        element={<CreatePromotion />}
      />

      <Route
        path="/promotion/manage-setting/edit-promotion"
        element={<EditPromotion />}
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
        path="/services/manage-group-service/service/optional-service"
        element={<OptionalService />}
      />
      <Route
        path="/services/manage-group-service/service/optional-service/extend-optional"
        element={<ExtendOptionalService />}
      />
      <Route
        path="/services/manage-group-service/service/optional-service/extend-optional/edit-price"
        element={<EditPrice />}
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

      <Route path="/group-order/manage-order/all" element={<ManageOrder />} />
      <Route
        path="/group-order/manage-order/doing"
        element={<OrderDoingManage />}
      />
      <Route path="/group-order/manage-order/done" element={<OrderExpired />} />

      <Route path="/topup/manage-topup" element={<ManageTopup />} />
      <Route
        path="/topup/manage-topup/details-reward-collaborator/:id"
        element={<DetailReward />}
      />
      <Route path="/finance/manage-finance" element={<ManageFinance />} />
      <Route
        path="/adminManage/manage-configuration/manage-group-customer"
        element={<GroupCustomerManage />}
      />
      <Route path="/report/manage-report" element={<ManageReport />} />
      <Route
        path="/report/manage-report/report-collaborator"
        element={<ReportCollaborator />}
      />
      <Route
        path="/report/manage-report/report-order-work"
        element={<ReportOrder />}
      />
      <Route
        path="/report/manage-report/report-order-create"
        element={<ReportOrderCreate />}
      />
      <Route
        path="/report/manage-report/report-order-daily"
        element={<ReportOrderDaily />}
      />
      <Route
        path="/report/manage-report/report-order-day-of-week"
        element={<ReportOrderDayInWeek />}
      />
      <Route
        path="/report/manage-report/report-order-daily/details"
        element={<ReportDetailOrderDaily />}
      />
      <Route
        path="/report/manage-report/report-order-area"
        element={<ReportOrderCity />}
      />
      <Route
        path="/report/manage-report/report-order-customer"
        element={<ReportCustomer />}
      />
      <Route
        path="/report/manage-report/report-user"
        element={<ReportUser />}
      />
      <Route
        path="/report/manage-report/report-customer-invite"
        element={<ReportInvite />}
      />
      <Route
        path="/report/manage-report/report-customer-area"
        element={<ReportCustomerArea />}
      />

      <Route
        path="/report/manage-report/report-customer-order-by-area"
        element={<ReportCustomerOrderByArea />}
      />

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
        path="/adminManage/manage-configuration/lesson"
        element={<CreateQuizz />}
      />
      <Route
        path="/adminManage/manage-configuration/lesson/details-lesson/:id"
        element={<DetailLesson />}
      />
      <Route
        path="/adminManage/manage-configuration/reason_punish"
        element={<ReasonPunish />}
      />
      <Route
        path="/adminManage/manage-configuration/setting_role"
        element={<RoleAccount />}
      />
      <Route
        path="/adminManage/manage-configuration/setting_role/create_role"
        element={<CreateRole />}
      />
      <Route
        path="/adminManage/manage-configuration/setting_role/edit_role"
        element={<EditRole />}
      />
      <Route
        path="/adminManage/manage-configuration/reward_collaborator"
        element={<RewardCollaborator />}
      />
      <Route
        path="/adminManage/manage-configuration/reward_collaborator/create"
        element={<AddRewardCollaborator />}
      />
      <Route
        path="/adminManage/manage-configuration/reward_collaborator/edit"
        element={<EditRewardCollaborator />}
      />
      <Route
        path="/adminManage/manage-configuration/image_manage"
        element={<ImageManage />}
      />
      <Route
        path="/adminManage/manage-configuration/group_promotion_manage"
        element={<SettingGroupPromotion />}
      />
      <Route
        path="/adminManage/manage-configuration/business_manage"
        element={<BusinessConfig />}
      />
    </Routes>
  );
};

export default Admin;
