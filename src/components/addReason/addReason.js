import React, { memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";

import { Drawer } from "antd";
import { createReason, fetchReasons } from "../../api/reasons";
import { errorNotify } from "../../helper/toast";
import i18n from "../../i18n";
import { getLanguageState } from "../../redux/selectors/auth";
import CustomButton from "../customButton/customButton";
import InputLanguage from "../inputLanguage";
import InputCustom from "../textInputCustom";
import "./addReason.scss";

const AddReason = (props) => {
  const { setIsLoading, setData, setTotal, startPage } = props;
  const [title, setTitle] = useState({
    vi: "",
  });
  const [description, setDescription] = useState({
    vi: "",
  });
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
      title: title,
      description: description,
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
  }, [title, description, applyUser, note, startPage]);
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
          <InputLanguage
            state={title}
            setState={setTitle}
            className="input-language"
          />
        </div>
        <div className="mt-2">
          <a className="title-reason">{`${i18n.t("describe", {
            lng: lang,
          })}`}</a>
          <InputLanguage
            state={description}
            setState={setDescription}
            className="input-language"
          />
        </div>
        <div className="mt-2">
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
