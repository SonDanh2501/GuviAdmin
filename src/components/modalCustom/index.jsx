import { Button, Modal } from "antd";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../redux/selectors/auth";
import i18n from "../../i18n";

const ModalCustom = (props) => {
  const lang = useSelector(getLanguageState);
  const { title, isOpen, textOk, handleOk, handleCancel, body } = props;

  return (
    <div>
      <Modal
        title={title}
        open={isOpen}
        onCancel={handleCancel}
        footer={[
          <Button
            style={{ alignItems: "center", width: "auto" }}
            onClick={handleCancel}
          >{`${i18n.t("cancel_modal", {
            lng: lang,
          })}`}</Button>,
          <Button
            type="primary"
            style={{ alignItems: "center", width: "auto" }}
            onClick={handleOk}
          >
            {textOk}
          </Button>,
        ]}
      >
        {body}
      </Modal>
    </div>
  );
};

export default ModalCustom;
