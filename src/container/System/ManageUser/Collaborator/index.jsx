import { FloatButton, Tabs } from "antd";
import { useState } from "react";
import CollaboratorManage from "./TableCollaborator/CollaboratorManage";
import "./index.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";

const ManageCollaborator = () => {
  const [status, setStatus] = useState("");
  const lang = useSelector(getLanguageState);

  const onChangeTab = (active) => {
    if (active === "2") {
      setStatus("online");
    } else if (active === "3") {
      setStatus("offline");
    } else if (active === "4") {
      setStatus("locked");
    } else if (active === "5") {
      setStatus("verify");
    } else if (active === "6") {
      setStatus("not_verify");
    } else {
      setStatus("");
    }
  };

  return (
    <>
      <div className="div-header-collaborator">
        <a className="title-cv">{`${i18n.t("collaborator_list", {
          lng: lang,
        })}`}</a>
      </div>

      <div className="div-container-collaborator">
        <Tabs defaultActiveKey="1" size="large" onChange={onChangeTab}>
          <Tabs.TabPane tab={`${i18n.t("all", { lng: lang })}`} key="1">
            <CollaboratorManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`${i18n.t("active", { lng: lang })}`} key="2">
            <CollaboratorManage status={status} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="CTV Đang Offline" key="3"></Tabs.TabPane> */}
          <Tabs.TabPane tab={`${i18n.t("locked", { lng: lang })}`} key="4">
            <CollaboratorManage status={status} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="CTV Đã Xác Thực" key="5">
            <CollaboratorManage status={status} />
          </Tabs.TabPane> */}
          <Tabs.TabPane tab={`${i18n.t("unconfirmed", { lng: lang })}`} key="6">
            <CollaboratorManage
              // data={collaborator}
              // total={collaboratorTotal}
              status={status}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <FloatButton.BackTop />
    </>
  );
};

export default ManageCollaborator;
