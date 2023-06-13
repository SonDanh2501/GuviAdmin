import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const RewardCollaborator = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button
        type="primary"
        onClick={() =>
          navigate(
            "/adminManage/manage-configuration/reward_collaborator/create"
          )
        }
      >
        Thêm thưởng
      </Button>

      <div></div>
    </div>
  );
};

export default RewardCollaborator;
