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
}) => {
  return (
    <FormGroup>
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
      >
        {body}{" "}
      </Input>
    </FormGroup>
  );
};

export default CustomTextInput;
