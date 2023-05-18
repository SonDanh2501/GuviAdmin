import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { Drawer, Input, Select } from "antd";
import CustomButton from "../customButton/customButton";
import "./addReason.scss";
import {
  createReason,
  fetchReasons,
  getListReasonCancel,
} from "../../api/reasons";
import { errorNotify } from "../../helper/toast";

const AddReason = (props) => {
  const { setIsLoading, setData, setTotal, startPage } = props;
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [type, setType] = useState("cash");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [note, setNote] = useState("");
  const [applyUser, setApplyUser] = useState("customer");
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const addReason = useCallback(() => {
    setIsLoading(true);
    createReason({
      title: {
        vi: titleVN,
        en: titleEN,
      },
      description: {
        vi: descriptionVN,
        en: descriptionEN,
      },
      apply_user: applyUser,
      note: note,
    })
      .then((res) => {
        setIsLoading(false);
        setOpen(false);
        fetchReasons(startPage, 10)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
      });
  }, [
    titleVN,
    titleEN,
    descriptionVN,
    descriptionEN,
    applyUser,
    note,
    startPage,
  ]);

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Thêm lí do "
        className="btn-modal-add-reason"
        type="button"
        onClick={showDrawer}
      />
      <Drawer
        title="Tạo lí do huỷ việc"
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
          onClick={addReason}
        />
      </Drawer>
    </>
  );
};

export default memo(AddReason);
