import React, { memo } from 'react';
import { Select, Tag, Space } from 'antd';
const { Option } = Select;
const SelectDefault = (props) => {
    const {
        selectOptions, // []
        value,
        className
    } = props;


    const onChange = (value: string) => {
        props.onChange(value)
    };




    return (
        <>
            <Select
            disabled={value === "done"}
                defaultValue={value}
                style={{ width: '100%', fontSize: "12%" }}
                options={selectOptions}
                size={"small"}
                onChange={onChange}
            >
                {selectOptions.map((item) => (
                    <Option key={item.key} value={item.key} label={item.label}>
                        <span className={`${className}`}>{item.label}</span>
                    </Option>
                ))}

            </Select>
        </>
    )


}

export default memo(SelectDefault);