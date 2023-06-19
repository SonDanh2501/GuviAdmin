import { FloatButton, Tabs } from "antd";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import CollaboratorManage from "./TableCollaborator/CollaboratorManage";
import AddCollaborator from "../../../../components/addCollaborator/addCollaborator";
import { useEffect, useState } from "react";
import { getCollaborators } from "../../../../redux/actions/collaborator";
import {
  getCollaborator,
  getCollaboratorTotal,
} from "../../../../redux/selectors/collaborator";

const ManageCollaborator = () => {
  const [status, setStatus] = useState("");

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
        <a className="title-cv">Danh sách Cộng tác viên</a>
      </div>

      <div className="div-container-collaborator">
        <Tabs defaultActiveKey="1" size="large" onChange={onChangeTab}>
          <Tabs.TabPane tab="Tất cả" key="1">
            <CollaboratorManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="CTV Đang Online" key="2">
            <CollaboratorManage status={status} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="CTV Đang Offline" key="3"></Tabs.TabPane> */}
          <Tabs.TabPane tab="CTV Đã Khoá" key="4">
            <CollaboratorManage status={status} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="CTV Đã Xác Thực" key="5">
            <CollaboratorManage status={status} />
          </Tabs.TabPane> */}
          <Tabs.TabPane tab="CTV Chưa Xác Thực" key="6">
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
