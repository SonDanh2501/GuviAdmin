import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  FloatButton,
  Image,
  message,
  Pagination,
  Progress,
  Switch,
} from "antd";
import {
  fetchCustomerById,
  getInviteCustomerById,
  setIsStaffCustomerApi,
  updateCustomer,
} from "../../../../../api/customer";
import iconGold from "../../../../../assets/images/iconGold.svg";
import iconMember from "../../../../../assets/images/iconMember.svg";
import iconPlatinum from "../../../../../assets/images/iconPlatinum.svg";
import iconSilver from "../../../../../assets/images/iconSilver.svg";
import user from "../../../../../assets/images/user.png";
import LoadingPagination from "../../../../../components/paginationLoading";
import InputCustom from "../../../../../components/textInputCustom";
import { formatMoney } from "../../../../../helper/formatMoney";
import { errorNotify, successNotify } from "../../../../../helper/toast";
import i18n from "../../../../../i18n";
import { loadingAction } from "../../../../../redux/actions/loading";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import "./index.scss";
import { update } from "lodash";
import ButtonCustom from "../../../../../components/button";
import {
  getListReferralPersonAdminApi,
  getListReferralPersonApi,
} from "../../../../../api/affeliate";
import icons from "../../../../../utils/icons";
// core components

const { IoCall, IoCreate } = icons;
const DetailsProfile = ({ id }) => {
  const lang = useSelector(getLanguageState);
  const dispatch = useDispatch();
  /* ~~~ Value ~~~ */
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("other");
  const [rank, setRank] = useState("");
  const [checkRank, setCheckRank] = useState("");
  const [data, setData] = useState([]);
  const [rankPoint, setRankPoint] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [dataInvite, setDataInvite] = useState([]); // Giá trị danh sách những người giới thiệu của khách hàng (cũ)
  const [totalInvite, setTotalInvite] = useState([]); // Giá trị tổng những người giới thiệu của khách hàng (cũ)
  const [currentPage, setCurrentPage] = useState(1);
  const [isStaff, setIsStaff] = useState(false);
  const [bankName, setBankName] = useState(""); // Giá trị tên ngân hàng
  const [bankNumber, setBankNumber] = useState(""); // Giá trị số tài khoản ngân hàng
  const [bankHolderName, setBankHolderName] = useState(""); // Giá trị tên của chủ thẻ
  const [valueListInviter, setValueListInviter] = useState(""); // Giá trị danh sách những người giới thiệu của khách hàng

  /* ~~~ Handle function ~~~ */
  // 1. Hàm fetch thông tin của khách hàng
  const fetchCustomerInfo = async (id) => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await fetchCustomerById(id);
      setData(res);
      setName(res?.full_name);
      setMail(res?.email);
      setBirthday(res?.birthday ? res?.birthday?.slice(0, 10) : "");
      setGender(res?.gender);
      setIsStaff(res?.is_staff);
      setBankName(res?.bank_account ? res?.bank_account?.bank_name : "");
      setBankNumber(res?.bank_account ? res?.bank_account?.account_number : "");
      setBankHolderName(
        res?.bank_account ? res?.bank_account?.account_holder : ""
      );
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      errorNotify({
        message: err?.message,
      });
    }
  };
  // 2. Hàm fetch danh sách những người giới thiệu của khách hàng (hàm cũ)
  const fetchInvitedListOfCustomer = async () => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await getInviteCustomerById(id, 0, 20);
      setDataInvite(res?.data);
      setTotalInvite(res?.totalItem);
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      errorNotify({
        message: err?.message,
      });
    }
  };
  // Hàm fetch danh sách những người giới thiệu của khách hàng (hàm mới)
  const fetchListInviterOfCustomer = async (id) => {
    try {
      const res = await getListReferralPersonAdminApi(id);
      setValueListInviter(res);
    } catch (err) {
      errorNotify({
        message: message?.err || err,
      });
    }
  };
  // 2. Hàm cập nhật thông tin của khách hàng
  const handleUpdateUser = async () => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const birth = moment(new Date(birthday)).toISOString();
      const res = await updateCustomer(data?._id, {
        phone: data?.phone,
        email: mail,
        full_name: name,
        gender: gender,
        birthday: birthday !== "" ? birth : "",
        bank_name: bankName,
        account_number: bankNumber,
        account_holder: bankHolderName,
      });
      successNotify({
        message: `${i18n.t("update_success_info", { lng: lang })}`,
      });
      fetchCustomerInfo(id);
    } catch (err) {
      errorNotify({
        message: err?.message,
      });
    }
  };
  // 3. Hàm bật/tắt là nhân viên
  const onIsStaff = useCallback(() => {
    setIsLoading(true);
    setIsStaffCustomerApi(id, { is_staff: isStaff ? false : true })
      .then((res) => {
        fetchCustomerById(id)
          .then((res) => {
            setData(res);
            setName(res?.full_name);
            setMail(res?.email);
            setBirthday(res?.birthday ? res?.birthday?.slice(0, 10) : "");
            setGender(res?.gender);
            setIsStaff(res?.is_staff);
            setIsLoading(false);
          })
          .catch((err) => setIsLoading(false));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        setIsLoading(false);
      });
  }, [isStaff, id]);
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

  /* ~~~ Use effect ~~~ */
  // 1. Fetch thông tin khách hàng
  useEffect(() => {
    fetchCustomerInfo(id);
    fetchInvitedListOfCustomer();
    fetchListInviterOfCustomer(id);
  }, [id, dispatch]);
  // 2. Kiểm tra mức rank hiện tại của khách hàng
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
    setRankPoint(data?.rank_point);
  }, [data, lang]);

  /* ~~~ Other ~~~ */
  const age = moment().diff(data?.birthday, "years");

  console.log("check valueListInviter", valueListInviter);
  /* ~~~ Main ~~~ */
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
              <p className="text-name">{data?.full_name}</p>
              <p className="text-invite">
                {`${i18n.t("code_customer", { lng: lang })}`}: {data?.id_view}
              </p>
              {data?.birthday && (
                <p className="text-invite">
                  {`${i18n.t("age", { lng: lang })}`}: {age}
                </p>
              )}
              <p className="text-invite">
                {`${i18n.t("code_invite", { lng: lang })}`}: {data?.invite_code}
              </p>
            </div>
          </div>
          <div className="div-rank-pay-member">
            <div className="div-member">
              <p className="text-title">G-pay</p>
              <div className="div-rank-customer">
                <p className="text-money">{formatMoney(data?.pay_point)}</p>
              </div>
            </div>
            <div className="div-member">
              <p className="text-title">{`${i18n.t("member", {
                lng: lang,
              })}`}</p>
              <div className="div-rank-customer">
                <p className="text-money">{rank}</p>
                <Image
                  preview={false}
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
                <p className="text-money">
                  {rankPoint} {`${i18n.t("point", { lng: lang })}`}
                </p>
              </div>
            </div>
            <div className="div-member">
              <p className="text-title">Total Price</p>
              <div className="div-rank-customer">
                <p className="text-money">{formatMoney(data?.total_price)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="div-infomation">
          <h3 className="">{`${i18n.t("info", { lng: lang })}`}</h3>
          <div className="div-detail-infomation">
            <div className="div-left">
              <InputCustom
                title={`${i18n.t("full_name", { lng: lang })}`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%" }}
              />
              <InputCustom
                title={`${i18n.t("gender", { lng: lang })}`}
                select={true}
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
                style={{ width: "100%" }}
              />
              <InputCustom
                title={`${i18n.t("phone", { lng: lang })}`}
                value={data?.phone}
                disabled={true}
                style={{ width: "100%" }}
              />
              <InputCustom
                title={`${i18n.t("birthday", { lng: lang })}`}
                type="date"
                value={birthday}
                onChange={(e) => {
                  setBirthday(e.target.value);
                }}
                style={{ width: "100%" }}
              />
              <InputCustom
                title={`${i18n.t("Email", { lng: lang })}`}
                type="email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div className="div-right">
              <InputCustom
                title="Tên chủ thẻ"
                type="text"
                value={bankHolderName}
                onChange={(e) => setBankHolderName(e.target.value)}
                style={{ width: "100%" }}
              />
              <InputCustom
                title={"Tên ngân hàng"}
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                style={{ width: "100%" }}
              />
              <InputCustom
                title="Số tài khoản thẻ ngân hàng"
                type="email"
                value={bankNumber}
                onChange={(e) => setBankNumber(e.target.value)}
                style={{ width: "100%" }}
              />
              <div className="mt-3 div-staff">
                <p className="label-staff">Nhân viên</p>
                <Switch
                  style={{
                    width: 50,
                    backgroundColor: isStaff ? "#00cf3a" : "",
                  }}
                  checked={isStaff}
                  onClick={onIsStaff}
                />
              </div>
            </div>
          </div>
          {/* <Button className="btn-update-customer" onClick={updateUser}>
            {`${i18n.t("update", { lng: lang })}`}
          </Button> */}
          <ButtonCustom
            label="Cập nhật"
            onClick={() => handleUpdateUser()}
          ></ButtonCustom>
        </div>
      </div>
      <span>Danh sách người giới thiệu</span>
      {/* Danh sách người giới thiệu */}
      <div className="detail-profile__list-inviter">
        {valueListInviter?.data?.map((person, index) => (
          <div key={index} className="detail-profile__list-inviter--child">
            <div
              className={`detail-profile__list-inviter--child-avatar ${
                person?.rank === "silver"
                  ? "rank-silver"
                  : person?.rank === "gold"
                  ? "rank-gold"
                  : person?.rank === "platinum"
                  ? "rank-platinum"
                  : "rank-member"
              }`}
            >
              {person?.avatar ? (
                <img
                  className="detail-profile__list-inviter--child-avatar-image"
                  src={person?.avatar}
                  alt=""
                ></img>
              ) : (
                <img
                  className="detail-profile__list-inviter--child-avatar-image"
                  src={user}
                  alt=""
                ></img>
              )}
              <div
                className={`detail-profile__list-inviter--child-avatar-rank ${
                  person?.rank === "silver"
                    ? "rank-silver"
                    : person?.rank === "gold"
                    ? "rank-gold"
                    : person?.rank === "platinum"
                    ? "rank-platinum"
                    : "rank-member"
                }`}
              >
                <span>
                  {person?.rank === "silver"
                    ? "Bạc"
                    : person?.rank === "gold"
                    ? "Vàng"
                    : person?.rank === "platinum"
                    ? "Bạch kim"
                    : "Thành viên"}
                </span>
              </div>
            </div>
            <div className="detail-profile__list-inviter--child-name">
              <span>{person?.full_name}</span>
            </div>
            <div className="detail-profile__list-inviter--child-email">
              <span>
                @
                {person?.email.split("@")[0].trim() !== ""
                  ? person?.email.split("@")[0]
                  : "chuadangky"}
              </span>
            </div>
            <div className="detail-profile__list-inviter--child-statistic">
              <div className="detail-profile__list-inviter--child-statistic-value">
                <span>Tổng đơn:</span>
                <span>{person?.total_done_order}</span>
              </div>
              <div className="detail-profile__list-inviter--child-statistic-line"></div>
              <div className="detail-profile__list-inviter--child-statistic-value">
                <span>Tổng tiền:</span>
                <span>{formatMoney(person?.total_money || 0)}</span>
              </div>
            </div>
            <div className="detail-profile__list-inviter--child-extra">
              <div className="detail-profile__list-inviter--child-extra-element">
                <span>
                  <IoCall />
                </span>
                <span>{person?.phone}</span>
              </div>
              <div className="detail-profile__list-inviter--child-extra-element">
                <span>
                  <IoCreate />
                </span>
                {/* moment(new Date(activity[dateIndex])).format("DD MMM, YYYY") */}
                <span>{moment(person?.date_create).format("DD MMM YYYY")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="div-container-invite-code">
        <p className="title-invite">{`${i18n.t("recent_referrals", {
          lng: lang,
        })}`}</p>
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
                            <p className="title-name">{`${i18n.t("name", {
                              lng: lang,
                            })}`}</p>
                            <p className="title-colon">: </p>
                            <p className="text-name ml-2">{item?.full_name}</p>
                          </div>
                          <div className="div-name-invite">
                            <p className="title-name">{`${i18n.t("sdt", {
                              lng: lang,
                            })}`}</p>
                            <p className="title-colon">: </p>
                            <p className="text-name ml-2">{item?.phone}</p>
                          </div>
                          <div className="div-name-invite">
                            <p className="title-name">{`${i18n.t("code", {
                              lng: lang,
                            })}`}</p>
                            <p className="title-colon">: </p>
                            <p className="text-name ml-2">{item?.id_view}</p>
                          </div>
                        </div>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <p className="text-date-create">
                            {`${i18n.t("date_create", { lng: lang })}`}:{" "}
                            {moment(item?.date_create).format("DD-MM-YYYY")}
                          </p>
                          <p className="text-date-create">
                            {`${i18n.t("Số đơn", { lng: lang })}`}:{" "}
                            {item?.total_done_order}
                          </p>
                          <p className="text-date-create">
                            {`${i18n.t("Tổng tiền", { lng: lang })}`}:{" "}
                            {formatMoney(item?.total_price)}
                          </p>
                        </div>
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
                      <p
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
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-1 div-pagination p-2">
              <p>
                {`${i18n.t("total", { lng: lang })}`}: {totalInvite}
              </p>
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
          <p className="text-no-invite">Chưa có người giới thiệu</p>
        )}
      </div>

      <FloatButton.BackTop />
      {isLoading && <LoadingPagination />}
    </>
  );
};

export default DetailsProfile;
