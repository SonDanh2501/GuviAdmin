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
  errors,
  min,
  maxLength,
  max,
  title,
  disabled,
  onClick,
}) => {
  return (
    <FormGroup className={classNameForm}>
      {label && (
        <Label for="exampleAddress" style={{ fontSize: 20 }}>
          {label}
        </Label>
      )}
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
        min={min}
        maxLength={maxLength}
        max={max}
        title={title}
        disabled={disabled}
        onClick={onClick}
      >
        {body}{" "}
      </Input>
      {errors && (
        <p style={{ color: "red", fontSize: 12, marginLeft: 5, marginTop: 5 }}>
          {errors}
        </p>
      )}
    </FormGroup>
  );
};

export default CustomTextInput;
