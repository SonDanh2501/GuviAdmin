import { FloatButton, Tabs } from "antd";
import "./index.scss";
import { useDispatch } from "react-redux";
import CollaboratorManage from "./TableCollaborator/CollaboratorManage";
import AddCollaborator from "../../../../components/addCollaborator/addCollaborator";

const ManageCollaborator = () => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="div-header-collaborator">
        <a className="title-cv">Danh sách Cộng tác viên</a>
        <AddCollaborator />
      </div>

      <div className="div-container-collaborator">
        <Tabs defaultActiveKey="1" size="large">
          <Tabs.TabPane tab="Tất cả Cộng Tác Viên" key="1">
            <CollaboratorManage />
          </Tabs.TabPane>
          <Tabs.TabPane tab="CTV Đang Hoạt Động" key="2"></Tabs.TabPane>
          <Tabs.TabPane tab="CTV Đã Khoá" key="3"></Tabs.TabPane>
          <Tabs.TabPane tab="CTV Đã Xác Thực" key="4"></Tabs.TabPane>
          <Tabs.TabPane tab="CTV Chưa Xác Thực" key="5"></Tabs.TabPane>
          <Tabs.TabPane tab="Sinh Nhật Trong Tháng" key="6"></Tabs.TabPane>
        </Tabs>
      </div>
      <FloatButton.BackTop />
    </>
  );
};

export default ManageCollaborator;
