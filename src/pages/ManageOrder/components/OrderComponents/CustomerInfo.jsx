import { Image } from "antd";
import { useEffect, useState } from "react";
import { default_avatar } from "../../../../constants";
import { Link } from "react-router-dom";

const CustomerInfo = ({ full_name, phone, email, rank_point, avatar, id }) => {
  const [rank, setRank] = useState("Thành viên");
  useEffect(() => {
    if (rank_point > 1499) {
      setRank("Bạch kim");
    } else if (rank_point > 299) {
      setRank("Bạc");
    } else if (rank_point > 99) {
      setRank("Vàng");
    }
  }, []);

  return (
    <div className="customer-info_container">
      <h6 className="customer-info_title">Thông tin khách hàng</h6>
      <div className="customer-info_detail">
        <p className="customer-info_detail-p-name">
          <span className="customer-info_detail-p">Tên: </span>
          {full_name}
        </p>
        <p className="customer-info_detail-p-name">
          <span className="customer-info_detail-p">SĐT: </span>
          {phone}
        </p>
        <p className="customer-info_detail-p-name">
          <span className="customer-info_detail-p">Email: </span>
          {email}
        </p>
      </div>
      <div className="customer-info_avatar">
        <Image
          style={{ height: 50, width: 50 }}
          className="customer-info_avatar-img"
          src={avatar || default_avatar}
        />
        <p>{rank}</p>
      </div>
      <div className="customer-info_footer">
        <p>
          <Link to={`/profile-customer/${id}`}>xem chi tiết</Link>
        </p>
      </div>
    </div>
  );
};
export default CustomerInfo;
