import React, {memo} from 'react';
import { Select, Tag } from 'antd';
const SelectCustomTagRender = (props) => {
    const {
        mode, // [multiple, tags]
        selectOptions, // []
        value, 
        defaultValue
    } = props;


    const tagRender = (props: CustomTagProps) => {
        const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
          event.preventDefault();
          event.stopPropagation();
        };
        return (
          <Tag
            color={"#2db7f5"}
            onMouseDown={onPreventMouseDown}
            // closable={closable}
            // onClose={onClose}
            // style={{ marginRight: 3 }}
          >
            {"sss"}
          </Tag>
        );
      };

      
    return (
        <>
                <Select
        defaultValue={value}
        style={{ width: '100%' }}
        options={selectOptions}
        
      />
      </>
    )

    
}

export default memo(SelectCustomTagRender);