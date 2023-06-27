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

const EditReason = (props) => {
  const { data, setIsLoading, setData, setTotal, startPage } = props;
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
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
    setTitleVN(data?.title?.vi);
    setTitleEN(data?.title?.en);
    setDescriptionVN(data?.description?.vi);
    setDescriptionEN(data?.description?.en);
    setApplyUser(data?.apply_user);
    setNote(data?.note);
  }, [data]);

  const editReason = useCallback(() => {
    setIsLoading(true);
    updateReason(data?._id, {
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
        setIsLoading(false);
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
    data,
    startPage,
  ]);

  return (
    <>
      <a onClick={showDrawer}>{`${i18n.t("edit", { lng: lang })}`}</a>
      <Drawer
        title={`${i18n.t("edit", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        width={400}
        open={open}
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
