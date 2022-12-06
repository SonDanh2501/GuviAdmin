import { useNavigate } from "react-router-dom";
import { Alert, Button, Row, Toast, ToastBody, ToastHeader } from "reactstrap";
import "./ManageConfiguration.scss";

const ManageConfiguration = () => {
  const navigate = useNavigate();
  return (
    <div className="container-configuration">
      <div>
        <Button
          className="btn"
          onClick={() => {
            navigate("/adminManage/manage-configuration/manage-reason");
          }}
        >
          Nguyên nhân huỷ
        </Button>
      </div>
    </div>
  );
};

export default ManageConfiguration;
