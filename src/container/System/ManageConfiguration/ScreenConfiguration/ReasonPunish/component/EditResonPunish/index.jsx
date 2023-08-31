import { Button, Drawer } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  editReasonPunish,
  getDetailsReasonPunishApi,
  getReasonPunishApi,
} from "../../../../../../../api/reasons";
import InputLanguage from "../../../../../../../components/inputLanguage";
import InputCustom from "../../../../../../../components/textInputCustom";
import { errorNotify } from "../../../../../../../helper/toast";
import i18n from "../../../../../../../i18n";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import "./styles.scss";

const EditReasonPubnish = (props) => {
  const { id, setIsLoading, setData } = props;
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
      <p className="m-0" onClick={showDrawer}>{`${i18n.t("edit", {
        lng: lang,
      })}`}</p>
      <Drawer
        title="Tạo lí do"
        placement="right"
        onClose={onClose}
        open={open}
        headerStyle={{ height: 50 }}
      >
        <div>
          <p className="m-0">{`${i18n.t("name", { lng: lang })}`}</p>
          <InputLanguage
            state={title}
            setState={setTitle}
            className="input-language"
          />
        </div>
        <div className="mt-2">
          <p className="m-0">{`${i18n.t("describe", { lng: lang })}`}</p>

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
