import { Button, Drawer } from "antd";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import {
  createReasonPunish,
  getReasonPunishApi,
} from "../../../../../../../api/reasons";
import InputLanguage from "../../../../../../../components/inputLanguage";
import InputCustom from "../../../../../../../components/textInputCustom";
import { errorNotify } from "../../../../../../../helper/toast";
import i18n from "../../../../../../../i18n";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import "./styles.scss";

const CreateReasonPunish = (props) => {
  const { setIsLoading, setData } = props;
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

  const onCreatePunishReason = useCallback(() => {
    setIsLoading(true);
    createReasonPunish({
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
          message: err?.message,
        });
      });
  }, [title, description, note]);
  return (
    <div>
      <Button type="primary" onClick={showDrawer} className="btn-create-punish">
        {`${i18n.t("add_reason", { lng: lang })}`}
      </Button>
      <Drawer
        title={`${i18n.t("add_reason", { lng: lang })}`}
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
            testArea={true}
          />
        </div>

        <Button
          className="btn-add-punish-reason"
          onClick={onCreatePunishReason}
        >
          {`${i18n.t("create", { lng: lang })}`}
        </Button>
      </Drawer>
    </div>
  );
};

export default CreateReasonPunish;
