import { Image } from "antd";
import { Link } from "react-router-dom";
const InfoCustomer = (props) => {
  const { full_name, avatar, phone, _id, birthday } = props?.info;
  return (
    <>
      <section className="info-customer">
        <h5>Thông tin khách hàng</h5>
        <div className="info-customer_container">
          <Image className="avatar" src={avatar} />
          <ul>
            <li>
              <Link to={`/profile-customer/${_id}`}>Tên: {full_name}</Link>
            </li>
            <li>SĐT: {phone}</li>
            <li>Tuổi: Chưa cập nhật</li>
          </ul>
        </div>
      </section>
    </>
  );
};
export default InfoCustomer;
