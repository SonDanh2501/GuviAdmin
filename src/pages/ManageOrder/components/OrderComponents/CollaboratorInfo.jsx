import { useEffect, useState } from "react";
import { default_avatar } from "../../../../constants";
import { Button, Image } from "antd";
import { formatDistanceToNowStrict } from "date-fns";
import { CloseCircleFilled, HeartFilled } from "@ant-design/icons";

const CollaboratorInfo = ({
  full_name,
  birthday,
  phone,
  isFavourite,
  isLock,
  avatar,
  star,
  handleFavourite,
  handleLock,
}) => {
  const [age, setAge] = useState(0);
  useEffect(() => {
    if (birthday) {
      const result = formatDistanceToNowStrict(new Date(birthday), {
        unit: "year",
      });
      setAge(result.split(" ")[0]);
    }
  }, [birthday]);

  return (
    <div className="collaborator-info_container">
      <h6 className="collaborator-info_title">Thông tin CTV</h6>
      <div className="collaborator-info_detail">
        <p>
          Tên: <span>{full_name}</span>
        </p>
        <p>
          Tuổi: <span>{age} Tuổi</span>
        </p>
        <p>
          SĐT: <span>{phone}</span>
        </p>
      </div>
      <div className="collaborator-info_avatar">
        <Image
          style={{ height: 50, width: 50 }}
          className="collaborator-info_avatar-img"
          src={avatar || default_avatar}
        />
        <p>
          {star} <i class="uil uil-star icon-star"></i>
        </p>
        <div className="collaborator-info_container-favourite">
          <p onClick={handleFavourite}>
            <HeartFilled
              style={{
                fontSize: "22px",
                color: isFavourite ? "#dc2828" : "#8d8d8d",
              }}
            />
          </p>
          <p onClick={handleLock}>
            <CloseCircleFilled
              style={{
                fontSize: "22px",
                color: isLock ? "#dc2828" : "#8d8d8d",
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
};
export default CollaboratorInfo;
