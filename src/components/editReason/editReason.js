import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Modal } from "reactstrap";
import { loadingAction } from "../../redux/actions/loading";
import { createReason, updateReason } from "../../redux/actions/reason";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./editReason.scss";
import { Drawer, Input, Select } from "antd";

const EditReason = ({ data }) => {
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [type, setType] = useState("cash");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [moneyReason, setMoneyReason] = useState();
  const [timeReason, setTimeReason] = useState();
  const [note, setNote] = useState("");
  const [applyUser, setApplyUser] = useState("customer");
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setTitleVN(data?.title?.vi);
    setTitleEN(data?.title?.en);
    setType(data?.punish_type);
    setDescriptionVN(data?.description?.vi);
    setDescriptionEN(data?.description?.en);
    setApplyUser(data?.apply_user);
    setNote(data?.note);
    setMoneyReason(data?.punish_type === "cash" ? data?.punish : 0);
    setTimeReason(
      data?.punish_type === "lock_time" ? data?.punish / (60 * 1000) : 0
    );
  }, [data]);

  const editReason = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(
      updateReason.updateReasonRequest({
        id: data?._id,
        data: {
          title: {
            vi: titleVN,
            en: titleEN,
          },
          description: {
            vi: descriptionVN,
            en: descriptionEN,
          },
          punish_type: type,
          punish: type === "cash" ? moneyReason : timeReason * 60 * 1000,
          apply_user: applyUser,
          note: note,
        },
      })
    );
  }, [
    titleVN,
    titleEN,
    descriptionVN,
    descriptionEN,
    type,
    applyUser,
    note,
    moneyReason,
    timeReason,
    data,
  ]);

  return (
    <>
      <a onClick={showDrawer}>Chỉnh sửa</a>
      <Drawer
        title="Chỉnh sửa Group service"
        placement="right"
        onClose={onClose}
        width={400}
        open={open}
      >
        <div>
          <a className="title-reason">Tên lý do huỷ việc</a>
          <Input
            placeholder="Vui lòng nhập tên lí do Tiếng Việt"
            type="text"
            value={titleVN}
            onChange={(e) => setTitleVN(e.target.value)}
          />
          <Input
            placeholder="Vui lòng nhập tên lí do Tiếng Anh"
            type="text"
            value={titleEN}
            onChange={(e) => setTitleEN(e.target.value)}
            style={{ marginTop: 5 }}
          />
        </div>
        <div className="mt-2">
          <a className="title-reason">Mô tả</a>
          <Input
            placeholder="Vui lòng nhập tên lí do Tiếng Việt"
            type="text"
            value={descriptionVN}
            onChange={(e) => setDescriptionVN(e.target.value)}
          />
          <Input
            placeholder="Vui lòng nhập tên lí do Tiếng Anh"
            type="text"
            value={descriptionEN}
            onChange={(e) => setDescriptionEN(e.target.value)}
            style={{ marginTop: 5 }}
          />
        </div>
        <div className="mt-2">
          <a className="title-reason">Áp dụng</a>
          <Select
            value={applyUser}
            style={{ width: "100%" }}
            onChange={(e) => setApplyUser(e)}
            options={[
              { value: "customer", label: "Khách hàng" },
              { value: "collaborator", label: "Cộng tác viên" },
              { value: "admin", label: "Admin" },
              { value: "system", label: "Hệ thống" },
            ]}
          />
        </div>

        <div className="mt-2">
          <a className="title-reason">Ghi chú</a>
          <Input
            placeholder="Vui lòng nhập ghi chú"
            type="textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <CustomButton
          title="Tạo"
          className="float-right btn-modal-add-reason"
          type="button"
          onClick={editReason}
        />
      </Drawer>
    </>
  );
};

export default memo(EditReason);
