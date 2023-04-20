import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import { formatMoney } from "../../../../../../helper/formatMoney";
import user from "../../../../../../assets/images/user.png";
import iconMember from "../../../../../../assets/images/iconMember.svg";
import iconSilver from "../../../../../../assets/images/iconSilver.svg";
import iconGold from "../../../../../../assets/images/iconGold.svg";
import iconPlatinum from "../../../../../../assets/images/iconPlatinum.svg";
import "./index.scss";
import {
  fetchCustomerById,
  updateCustomer,
  updatePointCustomer,
} from "../../../../../../api/customer";
import { FloatButton, Image } from "antd";
import { errorNotify } from "../../../../../../helper/toast";
import { loadingAction } from "../../../../../../redux/actions/loading";
import { QRCode } from "react-qrcode-logo";
// core components

const DetailsProfile = ({ id }) => {
  // const { state } = useLocation();
  // const { id } = state || {};
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("other");
  const [rank, setRank] = useState("");
  const [checkRank, setCheckRank] = useState("");
  const [data, setData] = useState([]);
  const [valueQr, setValueQr] = useState("");
  const [point, setPoint] = useState();
  const [rankPoint, setRankPoint] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCustomerById(id)
      .then((res) => {
        setData(res);
        setName(res?.full_name);
        setMail(res?.email);
        setBirthday(res?.birthday ? res?.birthday?.slice(0, 10) : "");
        setGender(res?.gender);
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    if (data?.rank_point < 100) {
      setRank("Thành viên");
      setCheckRank("member");
    } else if (data?.rank_point >= 100 && data?.rank_point < 300) {
      setRank("Bạc");
      setCheckRank("silver");
    } else if (data?.rank_point >= 300 && data?.rank_point < 1500) {
      setRank("Vàng");
      setCheckRank("gold");
    } else if (data?.rank_point > 1500) {
      setRank("Bạch kim");
      setCheckRank("platinum");
    }
    setPoint(data?.point);
    setRankPoint(data?.rank_point);
    setValueQr("https://guvico.github.io/qr-app-test?code=" + data?.phone);
  }, [data]);

  const updateUser = () => {
    dispatch(loadingAction.loadingRequest(true));
    const birth = moment(new Date(birthday)).toISOString();
    updateCustomer(data?._id, {
      phone: data?.phone,
      email: mail,
      full_name: name,
      gender: gender,
      birthday: birthday !== "" ? birth : "",
    })
      .then((res) => {
        fetchCustomerById(id)
          .then((res) => {
            setData(res);
            setName(res?.full_name);
            setMail(res?.email);
            setBirthday(res?.birthday ? res?.birthday?.slice(0, 10) : "");
            setGender(res?.gender);
            dispatch(loadingAction.loadingRequest(false));
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
            dispatch(loadingAction.loadingRequest(false));
          });
      })
      .catch((err) => {});

    // updatePointCustomer(data?._id, {
    //   point: point,
    //   rank_point: rankPoint,
    // })
    //   .then((res) => {

    //   })
    //   .catch((err) => {
    //     errorNotify({
    //       message: err,
    //     });
    //   });
  };

  const age = moment().diff(data?.birthday, "years");

  return (
    <>
      <div className="div-profile-customer">
        <div className="div-infomation-name">
          <div className="div-image-customer">
            <Image
              className="img-avatar"
              src={data?.avatar ? data?.avatar : user}
            />
            <div className="div-name">
              <a className="text-name">{data?.full_name}</a>
              <a className="text-invite">Mã: {data?.id_view}</a>
              {data?.birthday && <a className="text-invite">Tuổi: {age}</a>}
              <a className="text-invite">Mã giới thiệu: {data?.invite_code}</a>
            </div>
            <div className="ml-5">
              <QRCode
                value={valueQr}
                ecLevel={"H"}
                removeQrCodeBehindLogo={true}
                renderAs={"svg"}
                id="QRCode-svg"
                size={150}
              />
            </div>
          </div>
          <div className="div-rank-pay-member">
            <div className="div-member">
              <a className="text-title">G-pay</a>
              <div className="div-rank-customer">
                <a className="text-money">{formatMoney(data?.pay_point)}</a>
              </div>
            </div>
            <div className="div-member">
              <a className="text-title">Thành viên</a>
              <div className="div-rank-customer">
                <a className="text-money">{rank}</a>
                <img
                  className="icon-rank"
                  src={
                    checkRank === "silver"
                      ? iconSilver
                      : checkRank === "gold"
                      ? iconGold
                      : checkRank === "platinum"
                      ? iconPlatinum
                      : iconMember
                  }
                />
                <a className="text-money">{rankPoint} điểm</a>
              </div>
            </div>
            <div className="div-member">
              <a className="text-title">Total Price</a>
              <div className="div-rank-customer">
                <a className="text-money">{formatMoney(data?.total_price)}</a>
              </div>
            </div>
          </div>
        </div>
        <div className="div-infomation">
          <h3 className="">Thông tin</h3>
          <div className="div-detail-infomation">
            <div className="div-left">
              <div>
                <label className="form-control-label" htmlFor="input-email">
                  Họ tên
                </label>
                <Input
                  className="input"
                  id="input-email"
                  type="email"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="div-select">
                <a>Giới tính</a>
                <Input
                  className="input-select-gender"
                  type="select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <>
                    <option value={"other"}>Khác</option>
                    <option value={"male"}>Nam</option>
                    <option value={"female"}>Nữ</option>
                  </>
                </Input>
              </div>

              <div className="mt-3">
                <label className="form-control-label" htmlFor="input-last-name">
                  Số điện thoại
                </label>
                <Input
                  className="input"
                  id="input-last-name"
                  type="text"
                  value={data?.phone}
                  disabled={true}
                />
              </div>
            </div>
            <div className="div-right">
              <div>
                <label className="form-control-label" htmlFor="input-email">
                  Ngày sinh
                </label>
                <Input
                  className="input"
                  id="input-email"
                  type="date"
                  value={birthday}
                  onChange={(e) => {
                    setBirthday(e.target.value);
                  }}
                />
              </div>

              <div className="mt-3">
                <label className="form-control-label" htmlFor="input-email">
                  Email
                </label>
                <Input
                  className="input"
                  id="input-email"
                  placeholder="Nhập email"
                  type="email"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Button className="btn-update-point" onClick={updateUser}>
            Cập nhật
          </Button>
        </div>
      </div>
      <FloatButton.BackTop />
    </>
  );
};

export default DetailsProfile;
