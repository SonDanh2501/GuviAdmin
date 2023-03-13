import { Row } from "antd";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";

import "./ManageConfiguration.scss";

const ManageConfiguration = () => {
  const navigate = useNavigate();
  return (
    <div className="container-configuration">
      <Row>
        <Button
          className="btn"
          onClick={() => {
            navigate("/adminManage/manage-configuration/manage-reason");
          }}
        >
          Nguyên nhân huỷ
        </Button>
        <Button
          className="btn ml-5"
          onClick={() => {
            navigate("/adminManage/manage-configuration/manage-group-customer");
          }}
        >
          Nhóm khách hàng
        </Button>

        <Button
          className="btn ml-5"
          onClick={() => {
            navigate("/adminManage/manage-configuration/manage-app-customer");
          }}
        >
          Cấu hình app Khách hàng
        </Button>
        <Button
          className="btn ml-5"
          onClick={() => {
            navigate(
              "/adminManage/manage-configuration/manage-app-collaborator"
            );
          }}
        >
          Cấu hình app CTV
        </Button>
      </Row>
      <Row className="mt-5">
        <Button
          className="btn"
          onClick={() => {
            navigate("/adminManage/manage-configuration/setting-qrcode");
          }}
        >
          Cấu hình QrCode
        </Button>
      </Row>
    </div>
  );
};

export default ManageConfiguration;
