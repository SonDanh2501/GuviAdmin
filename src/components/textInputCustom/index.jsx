import { Input, Select } from "antd";

import "./styles.scss";
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
  } = props;

  return (
    <div className="div-input-custom">
      {title && <a className="title-input ">{title}</a>}
      {textArea ? (
        <TextArea
          value={value}
          placeholder={placeholder}
          type={type}
          onChange={onChange}
          style={style}
          className={className}
        />
      ) : password ? (
        <Input.Password
          value={value}
          placeholder={placeholder}
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
        />
      ) : (
        <Input
          value={value}
          placeholder={placeholder}
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
