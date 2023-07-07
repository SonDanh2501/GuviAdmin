import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { errorNotify, successNotify } from "../../../../../../helper/toast";
import { loadingAction } from "../../../../../../redux/actions/loading";
import { QRCode } from "react-qrcode-logo";
import LoadingPagination from "../../../../../../components/paginationLoading";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import i18n from "../../../../../../i18n";
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
  const lang = useSelector(getLanguageState);

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
      setRank(`${i18n.t("member", { lng: lang })}`);
      setCheckRank("member");
    } else if (data?.rank_point >= 100 && data?.rank_point < 300) {
      setRank(`${i18n.t("silver", { lng: lang })}`);
      setCheckRank("silver");
    } else if (data?.rank_point >= 300 && data?.rank_point < 1500) {
      setRank(`${i18n.t("gold", { lng: lang })}`);
      setCheckRank("gold");
    } else if (data?.rank_point > 1500) {
      setRank(`${i18n.t("platinum", { lng: lang })}`);
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
        successNotify({
          message: `${i18n.t("update_success_info", { lng: lang })}`,
        });
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
              <a className="text-invite">
                {`${i18n.t("code_customer", { lng: lang })}`}: {data?.id_view}
              </a>
              {data?.birthday && (
                <a className="text-invite">
                  {`${i18n.t("age", { lng: lang })}`}: {age}
                </a>
              )}
              <a className="text-invite">
                {`${i18n.t("code_invite", { lng: lang })}`}: {data?.invite_code}
              </a>
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
              <a className="text-title">{`${i18n.t("member", {
                lng: lang,
              })}`}</a>
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
                <a className="text-money">
                  {rankPoint} {`${i18n.t("point", { lng: lang })}`}
                </a>
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
          <h3 className="">{`${i18n.t("info", { lng: lang })}`}</h3>
          <div className="div-detail-infomation">
            <div className="div-left">
              <div className="div-name">
                <a>{`${i18n.t("full_name", { lng: lang })}`}</a>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "80%" }}
                />
              </div>
              <div className="div-select">
                <a>{`${i18n.t("gender", { lng: lang })}`}</a>
                <Select
                  value={gender}
                  onChange={(e) => setGender(e)}
                  options={[
                    {
                      value: "other",
                      label: `${i18n.t("other", { lng: lang })}`,
                    },
                    {
                      value: "male",
                      label: `${i18n.t("male", { lng: lang })}`,
                    },
                    {
                      value: "female",
                      label: `${i18n.t("female", { lng: lang })}`,
                    },
                  ]}
                  style={{ width: "80%" }}
                />
              </div>
              <div className="mt-3">
                <a>{`${i18n.t("phone", { lng: lang })}`}</a>
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
                <a>{`${i18n.t("birthday", { lng: lang })}`}</a>
                <Input
                  type="date"
                  value={birthday}
                  onChange={(e) => {
                    setBirthday(e.target.value);
                  }}
                  style={{ width: "100%" }}
                />
              </div>

              <div className="mt-3 div-name">
                <a>Email</a>
                <Input
                  id="input-email"
                  type="email"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
          <Button className="btn-update-customer" onClick={updateUser}>
            {`${i18n.t("update", { lng: lang })}`}
          </Button>
        </div>
      </div>

      <div className="div-container-invite-code">
        <a className="title-invite">{`${i18n.t("recent_referrals", {
          lng: lang,
        })}`}</a>
        {dataInvite.length > 0 ? (
          <>
            <div className="div-list-invite">
              {dataInvite.map((item, index) => {
                return (
                  <div key={index} className="div-item-invite">
                    <Image src={user} className="img-customer-invite" />
                    <div className="div-invite-progress">
                      <div className="div-row-info">
                        <div>
                          <div className="div-name-invite">
                            <a className="title-name">{`${i18n.t("name", {
                              lng: lang,
                            })}`}</a>
                            <a className="title-colon">:</a>
                            <a className="text-name">{item?.full_name}</a>
                          </div>
                          <div className="div-name-invite">
                            <a className="title-name">{`${i18n.t("sdt", {
                              lng: lang,
                            })}`}</a>
                            <a className="title-colon">:</a>
                            <a className="text-name">{item?.phone}</a>
                          </div>
                          <div className="div-name-invite">
                            <a className="title-name">{`${i18n.t("code", {
                              lng: lang,
                            })}`}</a>
                            <a className="title-colon">:</a>
                            <a className="text-name">{item?.id_view}</a>
                          </div>
                        </div>
                        <a className="text-date-create">
                          {`${i18n.t("date_create", { lng: lang })}`}:{" "}
                          {moment(item?.date_create).format("DD-MM-YYYY")}
                        </a>
                      </div>

                      <Progress
                        percent={
                          item?.total_order === 0
                            ? 33
                            : item?.total_order !== 0 &&
                              item?.total_done_order === 0
                            ? 66
                            : 100
                        }
                        strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                      />
                      <a
                        className={
                          item?.total_order === 0
                            ? "text-step"
                            : item?.total_order !== 0 &&
                              item?.total_done_order === 0
                            ? "text-step"
                            : "text-step-done"
                        }
                      >
                        {item?.total_order === 0
                          ? `${i18n.t("step_three", { lng: lang })}`
                          : item?.total_order !== 0 &&
                            item?.total_done_order === 0
                          ? `${i18n.t("last_step", { lng: lang })}`
                          : `${i18n.t("successful_introduction", {
                              lng: lang,
                            })}`}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-1 div-pagination p-2">
              <a>
                {`${i18n.t("total", { lng: lang })}`}: {totalInvite}
              </a>
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
          </>
        ) : (
          <a className="text-no-invite">Chưa có người giới thiệu</a>
        )}
      </div>

      <FloatButton.BackTop />
      {isLoading && <LoadingPagination />}
    </>
  );
};

export default DetailsProfile;
