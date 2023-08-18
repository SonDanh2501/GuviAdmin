import { Button, Drawer, Input } from "antd";
import { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import {
  createReasonPunish,
  editReasonPunish,
  getDetailsReasonPunishApi,
  getReasonPunishApi,
} from "../../../../../../../api/reasons";
import { errorNotify } from "../../../../../../../helper/toast";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import i18n from "../../../../../../../i18n";
import InputCustom from "../../../../../../../components/textInputCustom";
import InputLanguage from "../../../../../../../components/inputLanguage";

const EditReasonPubnish = (props) => {
  const { id, setIsLoading, setData, setTotal } = props;
  const [title, setTitle] = useState({
    vi: "",
  });
  const [description, setDescription] = useState({
    vi: "",
  });
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const lang = useSelector(getLanguageState);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getDetailsReasonPunishApi(id)
      .then((res) => {
        delete res?.title["_id"];
        setTitle(res?.title);
        delete res?.description["_id"];
        setDescription(res?.description);
        setNote(res?.note);
      })
      .catch((err) => {});
  }, [id]);

  const onEditPunishReason = useCallback(() => {
    setIsLoading(true);
    editReasonPunish(id, {
      title: title,
      description: description,
      note: note,
      apply_user: "collaborator",
    })
      .then((res) => {
        setIsLoading(false);
        setOpen(false);
        getReasonPunishApi(0, 20).then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        });
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  }, [id, title, description, note]);
  return (
    <div>
      <a onClick={showDrawer}>{`${i18n.t("edit", { lng: lang })}`}</a>
      <Drawer
        title="Tạo lí do"
        placement="right"
        onClose={onClose}
        open={open}
        headerStyle={{ height: 50 }}
      >
        <div>
          <a>{`${i18n.t("name", { lng: lang })}`}</a>
          <InputLanguage
            state={title}
            setState={setTitle}
            className="input-language"
          />
        </div>
        <div className="mt-2">
          <a>{`${i18n.t("describe", { lng: lang })}`}</a>

          <InputLanguage
            state={description}
            setState={setDescription}
            className="input-language"
          />
        </div>
        <div className="mt-2">
          <InputCustom
            title={`${i18n.t("note", { lng: lang })}`}
            onChange={(e) => setNote(e.target.value)}
            value={note}
            testArea={true}
          />
        </div>

        <Button className="btn-add-punish-reason" onClick={onEditPunishReason}>
          {`${i18n.t("edit", { lng: lang })}`}
        </Button>
      </Drawer>
    </div>
  );
};

export default EditReasonPubnish;
