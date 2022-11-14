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
      />
    </FormGroup>
  );
};

export default CustomTextInput;
