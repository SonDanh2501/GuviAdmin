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
  const collaborator = useSelector(getCollaborator);
  const collaboratorTotal = useSelector(getCollaboratorTotal);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   // dispatch(loadingAction.loadingRequest(true));
  //   dispatch(
  //     getCollaborators.getCollaboratorsRequest({
  //       start: 0,
  //       length: 20,
  //       type: "",
  //     })
  //   );
  // }, [dispatch]);

  const onChangeTab = (active) => {
    if (active === "2") {
      setStatus("online");
    } else if (active === "3") {
      setStatus("offline");
    } else if (active === "4") {
      setStatus("locked");
      // dispatch(
      //   getCollaborators.getCollaboratorsRequest({
      //     start: 0,
      //     length: 20,
      //     type: "locked",
      //   })
      // );
    } else if (active === "5") {
      setStatus("verify");
      // dispatch(
      //   getCollaborators.getCollaboratorsRequest({
      //     start: 0,
      //     length: 20,
      //     type: "verify",
      //   })
      // );
    } else if (active === "6") {
      setStatus("not_verify");
      // dispatch(
      //   getCollaborators.getCollaboratorsRequest({
      //     start: 0,
      //     length: 20,
      //     type: "not_verify",
      //   })
      // );
    } else {
      setStatus("");
      // dispatch(
      //   getCollaborators.getCollaboratorsRequest({
      //     start: 0,
      //     length: 20,
      //     type: "",
      //   })
      // );
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
          <Tabs.TabPane tab="CTV Đang Online" key="2"></Tabs.TabPane>
          <Tabs.TabPane tab="CTV Đang Offline" key="3"></Tabs.TabPane>
          <Tabs.TabPane tab="CTV Đã Khoá" key="4">
            <CollaboratorManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="CTV Đã Xác Thực" key="5">
            <CollaboratorManage status={status} />
          </Tabs.TabPane>
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
