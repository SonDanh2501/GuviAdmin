import React, { memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Drawer, Input, Select } from "antd";
import CustomButton from "../customButton/customButton";
import "./addReason.scss";
import {
  createReason,
  fetchReasons,
  getListReasonCancel,
} from "../../api/reasons";
import { errorNotify } from "../../helper/toast";
import { getLanguageState } from "../../redux/selectors/auth";
import i18n from "../../i18n";
import InputCustom from "../textInputCustom";

const AddReason = (props) => {
  const { setIsLoading, setData, setTotal, startPage } = props;
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [note, setNote] = useState("");
  const [applyUser, setApplyUser] = useState("customer");
  const [open, setOpen] = useState(false);
  const lang = useSelector(getLanguageState);
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
        title={`${i18n.t("create_reason", { lng: lang })}`}
        className="btn-modal-add-reason"
        type="button"
        onClick={showDrawer}
      />
      <Drawer
        title={`${i18n.t("create_reason", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        width={400}
        open={open}
        headerStyle={{ height: 50 }}
      >
        <div>
          <a className="title-reason">{`${i18n.t("name_reason", {
            lng: lang,
          })}`}</a>
          <InputCustom
            title={`${i18n.t("vietnamese", { lng: lang })}`}
            type="text"
            value={titleVN}
            onChange={(e) => setTitleVN(e.target.value)}
          />

          <InputCustom
            title={`${i18n.t("english", { lng: lang })}`}
            type="text"
            value={titleEN}
            onChange={(e) => setTitleEN(e.target.value)}
            style={{ marginTop: 5 }}
          />
        </div>
        <div className="mt-2">
          <a className="title-reason">{`${i18n.t("describe", {
            lng: lang,
          })}`}</a>
          <InputCustom
            title={`${i18n.t("vietnamese", { lng: lang })}`}
            type="text"
            value={descriptionVN}
            onChange={(e) => setDescriptionVN(e.target.value)}
          />
          <InputCustom
            title={`${i18n.t("english", { lng: lang })}`}
            type="text"
            value={descriptionEN}
            onChange={(e) => setDescriptionEN(e.target.value)}
            style={{ marginTop: 5 }}
          />
        </div>
        <div className="mt-2">
          {/* <a className="title-reason">Áp dụng</a>
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
          /> */}
          <InputCustom
            title={`${i18n.t("apply", { lng: lang })}`}
            value={applyUser}
            style={{ width: "100%" }}
            onChange={(e) => setApplyUser(e)}
            options={[
              {
                value: "customer",
                label: `${i18n.t("customer", { lng: lang })}`,
              },
              {
                value: "collaborator",
                label: `${i18n.t("collaborator", { lng: lang })}`,
              },
              { value: "admin", label: "Admin" },
              { value: "system", label: `${i18n.t("system", { lng: lang })}` },
            ]}
            select={true}
          />
        </div>

        <div className="mt-2">
          <InputCustom
            title={`${i18n.t("note", { lng: lang })}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            textArea={true}
          />
        </div>

        <CustomButton
          title={`${i18n.t("create", { lng: lang })}`}
          className="float-right btn-modal-add-reason-right"
          type="button"
          onClick={addReason}
        />
      </Drawer>
    </>
  );
};

export default memo(AddReason);
