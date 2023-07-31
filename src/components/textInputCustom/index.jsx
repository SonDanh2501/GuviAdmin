import { Input, InputNumber, Select } from "antd";

import "./styles.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../redux/selectors/auth";
import i18n from "../../i18n";
const { TextArea } = Input;

const InputCustom = (props) => {
  const {
    title,
    value,
    placeholder,
    type,
    onChange,
    style,
    className,
    textArea,
    error,
    password,
    min,
    select,
    options,
    defaultValue,
    disabled,
    prefix,
    mode,
    inputMoney,
  } = props;
  const lang = useSelector(getLanguageState);

  return (
    <div className={"div-input-custom"}>
      {title && <a className="title-input-custom">{title}</a>}
      {textArea ? (
        <TextArea
          value={value}
          placeholder={`${i18n.t("placeholder", { lng: lang })}`}
          type={type}
          onChange={onChange}
          style={style}
          className={className}
        />
      ) : password ? (
        <Input.Password
          value={value}
          placeholder={`${i18n.t("placeholder", { lng: lang })}`}
          type={type}
          onChange={onChange}
          style={style}
          className={className}
        />
      ) : select ? (
        <Select
          value={value}
          onChange={onChange}
          options={options}
          style={style}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={className}
          mode={mode}
        />
      ) : inputMoney ? (
        <InputNumber
          formatter={(value) =>
            `${value}  đ`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
          }
          min={min}
          value={value}
          onChange={onChange}
          style={style}
        />
      ) : (
        <Input
          value={value}
          placeholder={
            placeholder
              ? placeholder
              : `${i18n.t("placeholder", { lng: lang })}`
          }
          type={type}
          onChange={onChange}
          style={style}
          className={className}
          min={min}
          disabled={disabled}
          prefix={prefix}
        />
      )}
      {error && <a className="text-error">{error}</a>}
    </div>
  );
};

export default InputCustom;
