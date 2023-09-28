import { Input, InputNumber, Select } from "antd";
import "./index.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../redux/selectors/auth";
import i18n from "../../i18n";
import React from "react";
const { TextArea } = Input;





const InputCustomize = (props) => {
    const {
        dataInput,
        type,
        placeholder,
        disabled,
        title
    } = props
    const lang = useSelector(getLanguageState);

    const getValueChange = (value) => {
        if (props.getValueChange) props.getValueChange(value)
    }

    const onChange = (index, item) => {
        console.log(index, 'index');
        console.log(item, 'item');
    }

    const onChangeSearch = (value) => {
        console.log(value, 'value');
        console.log(props.getValueSearch, 'props.getValueSearch');
        if (props.getValueSearch) props.getValueSearch(value)
    }
    console.log(dataInput, 'dataInput');


    return (
        <React.Fragment>
        <div className="div-input-customize">
        {title && <p className="title-input-custom">{title}</p>}
{type === "select" ? (
        <Select className="input-select"
        options={dataInput}
        onChange={onChange}
        placeholder={placeholder}
        onSearch={onChangeSearch}
        // filterOption={filterOption}
        // filterSort={filterSort}
        disabled={disabled || false}
        showSearch="true"
    />
      ) : (
        <Input
          disabled={disabled}
        />
      )}
        </div>
        </React.Fragment>
    )
}


export default InputCustomize;