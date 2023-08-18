import { Button, Drawer, Input } from "antd";
import { useCallback, useState } from "react";
import "./styles.scss";
import {
  createReasonPunish,
  getReasonPunishApi,
} from "../../../../../../../api/reasons";
import { errorNotify } from "../../../../../../../helper/toast";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import i18n from "../../../../../../../i18n";
import InputCustom from "../../../../../../../components/textInputCustom";
import InputLanguage from "../../../../../../../components/inputLanguage";

const CreateReasonPubnish = (props) => {
  const { setIsLoading, setData, setTotal } = props;
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
          setTotal(res?.totalItem);
        });
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
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

export default CreateReasonPubnish;
