import { Drawer } from "antd";
import React, { memo, useCallback, useState } from "react";
import IntlCurrencyInput from "react-intl-currency-input";
import { useDispatch } from "react-redux";
import { Form, Input, Label, List, Modal } from "reactstrap";
import { searchCollaborators } from "../../api/collaborator";
import { TopupMoneyCollaboratorApi } from "../../api/topup";
import { loadingAction } from "../../redux/actions/loading";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./index.scss";

const AddGroupCustomer = () => {
  const [name, setName] = useState("");
  const [decription, setDecription] = useState("");
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  return (
    <>
      <CustomButton
        title="Thêm nhóm khách hàng"
        className="btn-add"
        type="button"
        // onClick={() => setState(!state)}
        onClick={showDrawer}
      />
      <Drawer
        title="Thêm nhóm khách hàng"
        width={500}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <div className="modal-body">
          <Form>
            <CustomTextInput
              label="Tên nhóm khách hàng"
              placeholder="Vui lòng nhập thông tin"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
            <CustomTextInput
              label="Chi tiết"
              placeholder="Vui lòng nhập thông tin"
              type="text"
              onChange={(e) => setDecription(e.target.value)}
            />
            <CustomButton
              title="Thêm"
              className="float-left btn-add"
              type="button"
            />
          </Form>
        </div>
      </Drawer>
    </>
  );
};

export default memo(AddGroupCustomer);
