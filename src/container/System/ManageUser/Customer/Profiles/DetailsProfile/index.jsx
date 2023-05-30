import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import { formatMoney } from "../../../../../../helper/formatMoney";
import user from "../../../../../../assets/images/user.png";
import iconMember from "../../../../../../assets/images/iconMember.svg";
import iconSilver from "../../../../../../assets/images/iconSilver.svg";
import iconGold from "../../../../../../assets/images/iconGold.svg";
import iconPlatinum from "../../../../../../assets/images/iconPlatinum.svg";
import "./index.scss";
import {
  fetchCustomerById,
  getInviteCustomerById,
  updateCustomer,
  updatePointCustomer,
} from "../../../../../../api/customer";
import {
  Button,
  FloatButton,
  Image,
  Input,
  Pagination,
  Progress,
  Select,
  Tooltip,
} from "antd";
import { errorNotify } from "../../../../../../helper/toast";
import { loadingAction } from "../../../../../../redux/actions/loading";
import { QRCode } from "react-qrcode-logo";
import LoadingPagination from "../../../../../../components/paginationLoading";
// core components

const DetailsProfile = ({ id }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [dataInvite, setDataInvite] = useState([]);
  const [totalInvite, setTotalInvite] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    fetchCustomerById(id)
      .then((res) => {
        setData(res);
        setName(res?.full_name);
        setMail(res?.email);
        setBirthday(res?.birthday ? res?.birthday?.slice(0, 10) : "");
        setGender(res?.gender);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => dispatch(loadingAction.loadingRequest(false)));

    getInviteCustomerById(id, 0, 20)
      .then((res) => {
        setDataInvite(res?.data);
        setTotalInvite(res?.totalItem);
      })
      .catch((err) => {});
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
  };

  const age = moment().diff(data?.birthday, "years");

  const onChange = (page) => {
    setCurrentPage(page);
    const lengthData = dataInvite.length < 20 ? 20 : dataInvite.length;
    const start = page * lengthData - lengthData;
    getInviteCustomerById(id, start, 20)
      .then((res) => {
        setDataInvite(res?.data);
        setTotalInvite(res?.totalItem);
      })
      .catch((err) => {});
  };

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
            {/* <div className="ml-5">
              <QRCode
                value={valueQr}
                ecLevel={"H"}
                removeQrCodeBehindLogo={true}
                renderAs={"svg"}
                id="QRCode-svg"
                size={150}
              />
            </div> */}
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
              <div className="div-name">
                <a>Họ tên</a>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "80%" }}
                />
              </div>
              <div className="div-select">
                <a>Giới tính</a>
                <Select
                  value={gender}
                  onChange={(e) => setGender(e)}
                  options={[
                    { value: "other", label: "khác" },
                    { value: "male", label: "Nam" },
                    { value: "female", label: "Nữ" },
                  ]}
                  style={{ width: "80%" }}
                />
              </div>
              <div className="mt-3">
                <a>Số điện thoại</a>
                <Input
                  type="text"
                  value={data?.phone}
                  disabled={true}
                  style={{ width: "80%" }}
                />
              </div>
            </div>
            <div className="div-right">
              <div>
                <a>Ngày sinh</a>
                <Input
                  type="date"
                  value={birthday}
                  onChange={(e) => {
                    setBirthday(e.target.value);
                  }}
                  style={{ width: "80%" }}
                />
              </div>

              <div className="mt-3 div-name">
                <a>Email</a>
                <Input
                  id="input-email"
                  placeholder="Nhập email"
                  type="email"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  style={{ width: "80%" }}
                />
              </div>
            </div>
          </div>
          <Button className="btn-update-customer" onClick={updateUser}>
            Cập nhật
          </Button>
        </div>
      </div>

      {dataInvite.length > 0 && (
        <div className="div-container-invite-code">
          <a className="title-invite">Người giới thiệu gần đây</a>
          <div className="div-list-invite">
            {dataInvite.map((item, index) => {
              return (
                <div key={index} className="div-item-invite">
                  <Image src={user} className="img-customer-invite" />
                  <div className="div-invite-progress">
                    <div className="div-row-info">
                      <div>
                        <div className="div-name">
                          <a className="title-name">Tên</a>
                          <a className="title-colon">:</a>
                          <a className="text-name">{item?.full_name}</a>
                        </div>
                        <div className="div-name">
                          <a className="title-name">SĐT</a>
                          <a className="title-colon">:</a>
                          <a className="text-name">{item?.phone}</a>
                        </div>
                        <div className="div-name">
                          <a className="title-name">Mã</a>
                          <a className="title-colon">:</a>
                          <a className="text-name">{item?.id_view}</a>
                        </div>
                      </div>
                      <a className="text-date-create">
                        Ngày tạo:{" "}
                        {moment(item?.date_create).format("DD-MM-YYYY")}
                      </a>
                    </div>
                    <Progress percent={item?.total_price > 0 ? 100 : 70} />
                    <a className="text-step">
                      {item?.total_price > 0
                        ? "Đã hoàn thành"
                        : "Bước cuối: Hoàn thành đơn hàng đầu tiên"}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-1 div-pagination p-2">
            <a>Tổng: {totalInvite}</a>
            <div>
              <Pagination
                current={currentPage}
                onChange={onChange}
                total={totalInvite}
                showSizeChanger={false}
                pageSize={20}
              />
            </div>
          </div>
        </div>
      )}

      <FloatButton.BackTop />
      {isLoading && <LoadingPagination />}
    </>
  );
};

export default DetailsProfile;
