import { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import InputCustom from "../../../../../components/textInputCustom";
import "./styles.scss";

const SettingQrCode = () => {
  const [value, setValue] = useState("");
  return (
    <div>
      <InputCustom title="Link" onChange={(e) => setValue(e.target.value)} />
      <QRCode
        value={value}
        ecLevel={"L"}
        removeQrCodeBehindLogo={true}
        renderAs={"svg"}
        id="QRCode-svg"
      />
    </div>
  );
};

export default SettingQrCode;
