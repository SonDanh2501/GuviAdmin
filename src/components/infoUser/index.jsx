import { Button } from "antd";
import "./index.scss";
const InfoUser = (props) => {
  const { info } = props;
  console.log("info ", info);
  const { full_name, pay_point, work_wallet, phone, birthday, star, avatar } =
    info;
  const avatar_user =
    avatar && avatar !== ""
      ? avatar
      : "https://admin.guvico.com/static/media/user.724b79cd.png";
  return (
    <div className="info-user">
      <div className="info-user_header">
        {star ? (
          <div className="info-user_box">
            <p className="info-user_title">Cộng tác viên</p>
            <Button className="choose">Yêu thích</Button>
            <Button className="choose">Hạn chế</Button>
          </div>
        ) : (
          <p className="info-user_title">Khách hàng</p>
        )}
      </div>
      <div className="info-user_header-name">
        <div className="info-user_header-name_avatar">
          <img src={avatar_user} />
        </div>
        <div className="info-user_header-name_infomation">
          <p>Tên: {full_name}</p>
          <p>Số điện thoại: {phone}</p>
          <p>Tuổi: </p>
          {star && (
            <p>
              Số sao: {star} <i class="uil uil-star icon-star"></i>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoUser;
