import React, { Component } from "react";
import { FormGroup, Label, Input } from "reactstrap";

const CustomTextInput = ({
  label,
  value,
  id,
  name,
  placeholder,
  type,
  onChange,
  className,
  accept,
  body,
  classNameForm,
  multiple = false,
  defaultValue,
  defaultChecked,
}) => {
  return (
    <FormGroup className={classNameForm}>
      {label && <Label for="exampleAddress">{label}</Label>}
      <Input
        id={id}
        name={name}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        className={className}
        accept={accept}
        multiple={multiple}
        defaultChecked={defaultChecked}
        defaultValue={defaultValue}
      >
        {body}{" "}
      </Input>
    </FormGroup>
  );
};

export default CustomTextInput;
