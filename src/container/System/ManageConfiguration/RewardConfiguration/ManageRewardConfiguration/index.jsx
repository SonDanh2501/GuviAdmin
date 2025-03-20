import React, { useEffect, useState } from "react";
import "./index.scss";
import InputTextCustom from "../../../../../components/inputCustom";
import { errorNotify, successNotify } from "../../../../../helper/toast";
import { createNewPunishPolicyApi, getDetailPunishPolicyApi, updatePunishPolicyApi } from "../../../../../api/punishPolicy";
import { useDispatch } from "react-redux";
import { loadingAction } from "../../../../../redux/actions/loading";
import ButtonCustom from "../../../../../components/button";
import { useLocation, useParams } from "react-router-dom";
import dayjs from "dayjs";
import moment from "moment";
import { isNumber } from "lodash";
import { Switch } from "antd";
import { createNewRewardPolicyApi, getDetailRewardPolicyApi, updateRewardPolicyApi } from "../../../../../api/rewardPolicy";

const ManageRewardConfiguration = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const id = params?.id;

  const dateFormat = "YYYY-MM-DD";

  /* ~~~ Value ~~~ */
  const [valueTitleVn, setValueTitleVn] = useState(""); // Tiêu đề tiếng Việt
  const [valueTitleEn, setValueTitleEn] = useState(""); // Tiêu đề tiếng Anh
  const [valueDescriptionVn, setValueDescriptionVn] = useState(""); // Nội dung giải thích tiếng Việt
  const [valueDescriptionEn, setValueDescriptionEn] = useState(""); // Nội dung giải thích tiếng Anh
  const [valueObjectApply, setValueObjectApply] = useState(""); // Đối tượng áp dụng
  const [valuePunishMoneyType, setValuePunishMoneyType] = useState(""); // Phạt tiền theo số cố định hay phần trăm
  const [valuePunishMoney, setValuePunishMoney] = useState(""); // Số lượng tiền phạt (có nếu valuePunishMoneyType = amount)
  const [valueActionLock, setValueActionLock] = useState(""); // Chức năng khóa
  const [valuePunishLockTimeType, setValuePunishLockTimeType] = useState(""); // Loại thời gian khóa
  const [valuePunishLockTime, setValuePunishLockTime] = useState(""); // Số lượng thời gian khóa
  const [valuePunishPolicyType, setValuePunishPolicyType] = useState("punish"); // Loại chính sách phạt
  const [valueCycleTimeType, setValueCycleTimeType] = useState(""); // Loại chu kì thời gian
  const [valueCycleStartTime, setValueCycleStartTime] = useState(""); // Thời gian bắt đầu chu kì
  const [valueStatus, setValueStatus] = useState(""); // Trạng thái
  const [valueCountLimit, setValueCountLimit] = useState(""); // Số lượt giới hạn
  const [valueCountPersonLimit, setValueCountPersonLimit] = useState(""); // Số lượt giới hạn trên người
  const [valueRewardPolicyType, setValueRewardPolicyType] = useState("reward"); // Loại chính sách thưởng
  const [valueRewardWalletType, setValueRewardWalletType] = useState("none"); // Loại ví nhận
  const [valueRewardPoint, setValueRewardPoint] = useState(""); // Số điểm

  /* ~~~ Flag ~~~ */
  const [isCountLimit, setIsCountLimit] = useState(false); // Giới hạn lượt thưởng
  const [isCountPersonLimit, setIsCountPersonLimit] = useState(false); // Giới hạn lượt thưởng theo từng người
  /* ~~~ List ~~~ */
  const listObject = [
    {
      code: "collaborator",
      label: `Đối tác`,
    },
    {
      code: "customer",
      label: `Khách hàng`,
    },
  ];
  const listCycleTimeType = [
    {
      code: "hour",
      label: `Giờ`,
    },
    {
      code: "day",
      label: `Ngày`,
    },
    {
      code: "week",
      label: `Tuần`,
    },
    {
      code: "month",
      label: `Tháng`,
    },
    {
      code: "year",
      label: `Năm`,
    },
  ];
  const listStatus = [
    {
      code: "doing",
      label: `Kích hoạt`,
    },
    {
      code: "standby",
      label: `Đang chờ`,
    },
    {
      code: "pause",
      label: `Tạm dừng`,
    },
  ];
  const listRewardPolicyType = [
    {
      code: "reward",
      label: `Thưởng`,
    },
    {
      code: "reward_milestone",
      label: `Chương trình thưởng`,
    },
  ];
  const listRewardWalletType = [
    {
      code: "collaborator_wallet",
      label: `Ví đối tác`,
    },
    {
      code: "work_wallet",
      label: `Ví làm`,
    },
    {
      code: "reward_point",
      label: `Ví thưởng`,
    },
    {
      code: "none",
      label: `Không có`,
    },
  ];

  /* ~~~ Handle function ~~~ */
  const handleCreateNewRewardPolicy = async (payload) => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await createNewRewardPolicyApi(payload);
      successNotify({ message: "Tạo chính sách thưởng mới thành công" });
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      dispatch(loadingAction.loadingRequest(false));
      errorNotify({ message: err?.message || err });
    }
  };

  const handleUpdateRewardPolicy = async (idRewardPolicy, payload) => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await updateRewardPolicyApi(idRewardPolicy, payload);
      fetchDetailRewardPolicy(idRewardPolicy);
      successNotify({ message: "Chỉnh sửa chính sách thưởng thành công" });
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      dispatch(loadingAction.loadingRequest(false));
      errorNotify({ message: err?.message || err });
    }
  };

  const fetchDetailRewardPolicy = async (idRewardPolicy) => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await getDetailRewardPolicyApi(idRewardPolicy);
      setValueTitleVn(res.title?.vi);
      setValueDescriptionVn(res.description?.vi);
      setValueTitleEn(res.title?.en);
      setValueDescriptionEn(res.description?.en);
      setValueObjectApply(res?.user_apply);
      setIsCountLimit(res?.is_count_limit)
      setValueCountLimit(res?.count_limit)
      setIsCountPersonLimit(res?.is_count_per_user_limit)
      setValueCountPersonLimit(res?.count_per_user_limit);
      setValueRewardPolicyType(res?.reward_policy_type);
      setValueRewardWalletType(res?.reward_wallet_type);
      setValueRewardPoint(res?.score)
      setValueCycleTimeType(res?.cycle_time_type);
      setValueCycleStartTime(res?.start_time_cycle);
      setValueStatus(res?.status);
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      dispatch(loadingAction.loadingRequest(false));
      errorNotify({ message: err?.message || err });
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetailRewardPolicy(id);
    }
  }, []);
  /* ~~~ Other ~~~ */
  const convertToMoney = (value) => {
    if (isNumber(value)) {
      return value;
    }
    const tempMoney = value?.replace(/\./g, "");
    return Number(tempMoney);
  };

  return (
    <div className="punish-configuration">
      <div className="punish-configuration__child card-shadow">
        <div className="punish-configuration__child--input">
          <span className="punish-configuration__child--input-title">
            Tiêu đề lệnh thưởng
          </span>
          <InputTextCustom
            type="text"
            value={valueTitleVn}
            placeHolder="Tiêu đề tiếng Việt"
            onChange={(e) => setValueTitleVn(e.target.value)}
          />
          <InputTextCustom
            type="textArea"
            value={valueDescriptionVn}
            placeHolder="Nội dung lệnh phạt tiếng Việt"
            onChange={(e) => setValueDescriptionVn(e.target.value)}
          />
          <InputTextCustom
            type="text"
            value={valueTitleEn}
            placeHolder="Tiêu đề tiếng Anh"
            onChange={(e) => setValueTitleEn(e.target.value)}
          />
          <InputTextCustom
            type="textArea"
            value={valueDescriptionEn}
            placeHolder="Nội dung lệnh phạt tiếng Anh"
            onChange={(e) => setValueDescriptionEn(e.target.value)}
          />
        </div>
        <div className="punish-configuration__child--input">
          <span className="punish-configuration__child--input-title">
            Trạng thái
          </span>
          <InputTextCustom
            type="select"
            value={valueStatus}
            placeHolder="Trạng thái lệnh phạt"
            setValueSelectedProps={setValueStatus}
            options={listStatus}
          />
        </div>
        <div className="punish-configuration__child--input">
          <span className="punish-configuration__child--input-title">
            Đối tượng áp dụng
          </span>
          <InputTextCustom
            type="select"
            value={valueObjectApply}
            placeHolder="Đối tượng"
            setValueSelectedProps={setValueObjectApply}
            options={listObject}
          />
        </div>
        <div className="punish-configuration__child--input">
          <span className="punish-configuration__child--input-title">
            Loại chính sách thưởng
          </span>
          <InputTextCustom
            type="select"
            value={valueRewardPolicyType}
            placeHolder="Loại chính sách"
            setValueSelectedProps={setValueRewardPolicyType}
            options={listRewardPolicyType}
          />
          <InputTextCustom
            type="select"
            value={valueRewardWalletType}
            placeHolder="Loại ví nhận thưởng"
            setValueSelectedProps={setValueRewardWalletType}
            options={listRewardWalletType}
          />
        </div>
        {/* <div className="punish-configuration__child--input">
          <div className="punish-configuration__child--input-title-toggle">
            <span>Giới hạn lượt thưởng</span>
            <Switch
              size="small"
              checked={isCountLimit}
              onChange={() => setIsCountLimit(!isCountLimit)}
            />
          </div>
          <InputTextCustom
            type="text"
            disable={!isCountLimit}
            value={valueCountLimit}
            placeHolder="Số lần giới hạn"
            isNumber={true}
            onChange={(e) => setValueCountLimit(e.target.value)}
          />
        </div>
        <div className="punish-configuration__child--input">
          <div className="punish-configuration__child--input-title-toggle">
            <span>Giới hạn trên từng người</span>
            <Switch
              size="small"
              checked={isCountPersonLimit}
              onChange={() => setIsCountPersonLimit(!isCountPersonLimit)}
            />
          </div>
          <InputTextCustom
            type="text"
            disable={!isCountPersonLimit}
            value={valueCountPersonLimit}
            placeHolder="Số lần giới hạn của từng người"
            isNumber={true}
            onChange={(e) => setValueCountPersonLimit(e.target.value)}
          />
        </div> */}
      </div>
      <div className="punish-configuration__child card-shadow">
   
        <div className="punish-configuration__child--input">
          <span className="punish-configuration__child--input-title">
            Số điểm
          </span>
          <InputTextCustom
            type="text"
            value={valueRewardPoint}
            placeHolder="Số điểm"
            isNumber={true}
            onChange={(e) => setValueRewardPoint(e.target.value)}
          />
        </div>
        <div className="punish-configuration__child--input">
          <span className="punish-configuration__child--input-title">
            Chu kì
          </span>
          <InputTextCustom
            type="select"
            value={valueCycleTimeType}
            placeHolder="Loại chu kì thời gian"
            setValueSelectedProps={setValueCycleTimeType}
            options={listCycleTimeType}
          />
          <InputTextCustom
            type="date"
            value={valueCycleStartTime}
            placeHolder="Thời gian bắt đầu chu kì"
            birthday={
              valueCycleStartTime
                ? dayjs(valueCycleStartTime.slice(0, 1), dateFormat)
                : ""
            }
            setValueSelectedProps={setValueCycleStartTime}
          />
        </div>
        <div className="punish-configuration__child--input">
          {id ? (
            <ButtonCustom
              label="Chỉnh sửa"
              onClick={() =>
                handleUpdateRewardPolicy(id, {
                  title: { vi: valueTitleVn, en: valueTitleEn },
                  description: {
                    vi: valueDescriptionVn,
                    en: valueDescriptionEn,
                  },
                  user_apply: valueObjectApply,
                  total_time_process: 1,
                  total_order_process: 1,
                  status: valueStatus,
                  reward_policy_type: valueRewardPolicyType,
                  reward_wallet_type: valueRewardWalletType,
                  score: valueRewardPoint,
                  cycle_time_type: valueCycleTimeType,
                  start_time_cycle: moment(
                    new Date(valueCycleStartTime)
                  ).toISOString(),
                })
              }
            />
          ) : (
            <ButtonCustom
              label="Hoàn tất"
              onClick={() =>
                handleCreateNewRewardPolicy({
                  title: { vi: valueTitleVn, en: valueTitleEn },
                  description: {
                    vi: valueDescriptionVn,
                    en: valueDescriptionEn,
                  },
                  user_apply: valueObjectApply,
                  total_time_process: 1,
                  total_order_process: 1,
                  status: valueStatus,
                  reward_policy_type: valueRewardPolicyType,
                  reward_wallet_type: valueRewardWalletType,
                  score: valueRewardPoint,
                  cycle_time_type: valueCycleTimeType,
                  start_time_cycle: moment(
                    new Date(valueCycleStartTime)
                  ).toISOString(),
                })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageRewardConfiguration;
