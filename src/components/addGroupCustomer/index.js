import { Button, Drawer, Input, Radio } from "antd";
import React, { memo, useState } from "react";
import { useDispatch } from "react-redux";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./index.scss";

const AddGroupCustomer = () => {
  const [value, setValue] = useState("and");
  const [conditionLevel, setConditionLevel] = useState([
    {
      condition: [
        {
          kind: "",
          value: "",
          operator: "",
        },
      ],
    },
  ]);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <CustomButton
        title="Thêm nhóm khách hàng"
        className="btn-add-group-ctm"
        type="button"
        // onClick={() => setState(!state)}
        onClick={showDrawer}
      />
      <Drawer
        title="Thêm nhóm khách hàng"
        width={600}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <div className="modal-body">
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={"and"}>And</Radio>
            <Radio value={"or"}>Or</Radio>
          </Radio.Group>

          <div>
            {conditionLevel.map((item) => {
              return (
                <>
                  {item?.condition.map((i) => {
                    return (
                      <>
                        <CustomTextInput
                          label="Kind"
                          body={
                            <>
                              <option value={"total_order"}>
                                Tổng đơn đặt
                              </option>
                              <option value={"gender"}>Giới tính</option>
                              <option value={"rank_point"}>Hạng điểm</option>
                            </>
                          }
                        />
                        <CustomTextInput label="Value" />
                        <CustomTextInput label="Operater" />
                      </>
                    );
                  })}
                </>
              );
            })}
          </div>

          <Button>Add New Condition</Button>
        </div>
      </Drawer>
    </>
  );
};

export default memo(AddGroupCustomer);
