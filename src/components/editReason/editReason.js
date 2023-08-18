import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../customButton/customButton";
import "./editReason.scss";
import { Drawer, Input, Select } from "antd";
import { fetchReasons, updateReason } from "../../api/reasons";
import { errorNotify } from "../../helper/toast";
import { getLanguageState } from "../../redux/selectors/auth";
import i18n from "../../i18n";
import InputCustom from "../textInputCustom";
import InputLanguage from "../inputLanguage";

const EditReason = (props) => {
  const { data, setIsLoading, setData, setTotal, startPage } = props;
  const [title, setTitle] = useState({
    vi: "",
  });
  const [description, setDescription] = useState({
    vi: "",
  });
  const [note, setNote] = useState("");
  const [applyUser, setApplyUser] = useState("");
  const lang = useSelector(getLanguageState);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    delete data?.title["_id"];
    setTitle(data?.title);
    delete data?.description["_id"];
    setDescription(data?.description);
    setApplyUser(data?.apply_user);
    setNote(data?.note);
  }, [data]);

  const editReason = useCallback(() => {
    setIsLoading(true);
    updateReason(data?._id, {
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
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  }, [applyUser, note, data, startPage]);

  return (
    <>
      <a onClick={showDrawer}>{`${i18n.t("edit", { lng: lang })}`}</a>
      <Drawer
        title={`${i18n.t("edit", { lng: lang })}`}
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
          title={`${i18n.t("edit", { lng: lang })}`}
          className="float-right btn-modal-edit-reason"
          type="button"
          onClick={editReason}
        />
      </Drawer>
    </>
  );
};

export default memo(EditReason);
