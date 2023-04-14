import { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import CustomTextInput from "../../../../../components/CustomTextInput/customTextInput";
import Logo from "../../../../../assets/images/LogoS.png";
import "./styles.scss";

const SettingQrCode = () => {
  const [value, setValue] = useState("");
  return (
    <div>
      <CustomTextInput
        label={"Link"}
        className="input-link"
        onChange={(e) => setValue(e.target.value)}
      />
      <QRCode
        value={value}
        // logoImage={Logo}
        // logoWidth={50}
        // logoHeight={20}
        ecLevel={"H"}
        removeQrCodeBehindLogo={true}
        renderAs={"svg"}
        id="QRCode-svg"
      />
    </div>
  );
};

export default SettingQrCode;
