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

const ManagePunishConfiguration = () => {
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
  const listPunishMoneyType = [
    {
      code: "amount",
      label: `Số lượng`,
    },
    {
      code: "percent_of_initial_fee_order",
      label: `Phần trăm`,
    },
  ];
  const listActionLock = [
    // {
    //   code: "lock_create_order",
    //   label: `Khóa tạo đơn`,
    // },
    {
      code: "lock_pending_to_confirm",
      label: `Khóa nhận đơn`,
    },
    {
      code: "lock_login",
      label: `Khóa đăng nhập`,
    },
    {
      code: "unset",
      label: `Không khóa chức năng`,
    },
  ];
  const listPunishTimeType = [
    // {
    //   code: "lock_create_order",
    //   label: `Khóa tạo đơn`,
    // },
    {
      code: "minute",
      label: `Phút`,
    },
    {
      code: "hours",
      label: `Giờ`,
    },
    {
      code: "lifetime",
      label: `Vĩnh viễn`,
    },
  ];
  const listPunishPolicyType = [
    {
      code: "punish_milestone",
      label: `Mốc phạt`,
    },
    {
      code: "punish",
      label: `Phạt`,
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

  /* ~~~ Handle function ~~~ */
  const handleCreateNewPunishPolicy = async (payload) => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await createNewPunishPolicyApi(payload);
      successNotify({ message: "Tạo chính sách phạt mới thành công" });
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      dispatch(loadingAction.loadingRequest(false));
      errorNotify({ message: err?.message || err });
    }
  };
  
  const handleUpdatePunishPolicy = async (idPunishPolicy, payload) => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await updatePunishPolicyApi(idPunishPolicy, payload);
      fetchDetailPunishPolicy(idPunishPolicy);
      successNotify({ message: "Chỉnh sửa chính sách phạt thành công" });
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      dispatch(loadingAction.loadingRequest(false));
      errorNotify({ message: err?.message || err });
    }
  };

  const fetchDetailPunishPolicy = async (idPunishPolicy) => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await getDetailPunishPolicyApi(idPunishPolicy);
      setValueTitleVn(res.title?.vi);
      setValueDescriptionVn(res.description?.vi);
      setValueTitleEn(res.title?.en);
      setValueDescriptionEn(res.description?.en);
      setValueObjectApply(res?.user_apply);
      setValuePunishMoneyType(res?.punish_money_type);
      setValuePunishMoney(res?.punish_money);
      setValueActionLock(res?.action_lock);
      setValuePunishLockTimeType(res.punish_lock_time_type);
      setValuePunishLockTime(res.punish_lock_time);
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
      fetchDetailPunishPolicy(id);
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

  console.log("check valuePunishMoney ", valuePunishMoney);
  return (
    <div className="punish-configuration">
      <div className="punish-configuration__child card-shadow">
        <div className="punish-configuration__child--input">
          <span className="punish-configuration__child--input-title">
            Tiêu đề lệnh phạt
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
            Tiền phạt
          </span>
          <InputTextCustom
            type="select"
            value={valuePunishMoneyType}
            placeHolder="Loại tiền phạt"
            setValueSelectedProps={setValuePunishMoneyType}
            options={listPunishMoneyType}
          />

          <InputTextCustom
            type="text"
            value={valuePunishMoney}
            placeHolder="Số tiền"
            onChange={(e) => setValuePunishMoney(e.target.value)}
            isNumber={valuePunishMoneyType === "amount" ? true : false}
          />
        </div>
      </div>
      <div className="punish-configuration__child card-shadow">
        <div className="punish-configuration__child--input">
          <span className="punish-configuration__child--input-title">
            Khóa chức năng
          </span>
          <InputTextCustom
            type="select"
            value={valueActionLock}
            placeHolder="Khóa chức năng"
            setValueSelectedProps={setValueActionLock}
            options={listActionLock}
          />
        </div>
        <div className="punish-configuration__child--input">
          <span className="punish-configuration__child--input-title">
            Thời gian khóa
          </span>
          <InputTextCustom
            type="select"
            value={valuePunishLockTimeType}
            placeHolder="Loại thời gian khóa"
            setValueSelectedProps={setValuePunishLockTimeType}
            options={listPunishTimeType}
          />
          <InputTextCustom
            type="text"
            value={valuePunishLockTime}
            placeHolder="Thời gian khóa"
            onChange={(e) => setValuePunishLockTime(e.target.value)}
            isNumber={true}
          />
        </div>
        <div className="punish-configuration__child--input">
          <span className="punish-configuration__child--input-title">
            Chính sách phạt
          </span>
          <InputTextCustom
            type="select"
            value={valuePunishPolicyType}
            placeHolder="Loại chính sách phạt"
            setValueSelectedProps={setValuePunishPolicyType}
            options={listPunishPolicyType}
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
                handleUpdatePunishPolicy(id, {
                  title: { vi: valueTitleVn, en: valueTitleEn },
                  description: {
                    vi: valueDescriptionVn,
                    en: valueDescriptionEn,
                  },
                  user_apply: valueObjectApply,
                  status: valueStatus,
                  punish_money_type: valuePunishMoneyType,
                  // punish_money: convertToMoney(valuePunishMoney),
                  punish_money: valuePunishMoneyType === "amount" ? convertToMoney(valuePunishMoney) :valuePunishMoney ,

                  action_lock: valueActionLock,
                  punish_lock_time: valuePunishLockTime,
                  punish_lock_time_type: valuePunishLockTimeType,
                  total_time_process: 1,
                  total_order_process: 1,
                  punish_policy_type: valuePunishPolicyType,
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
                handleCreateNewPunishPolicy({
                  title: { vi: valueTitleVn, en: valueTitleEn },
                  description: {
                    vi: valueDescriptionVn,
                    en: valueDescriptionEn,
                  },
                  status: valueStatus,
                  user_apply: valueObjectApply,
                  punish_money_type: valuePunishMoneyType,
                  punish_money: convertToMoney(valuePunishMoney),
                  action_lock: valueActionLock,
                  punish_lock_time: valuePunishLockTime,
                  punish_lock_time_type: valuePunishLockTimeType,
                  total_time_process: 1,
                  total_order_process: 1,
                  punish_policy_type: valuePunishPolicyType,
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

export default ManagePunishConfiguration;
