import { Drawer } from "antd";
import { Formik } from "formik";
import React, { memo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Modal } from "reactstrap";
import { createCustomer } from "../../redux/actions/customerAction";
import { loadingAction } from "../../redux/actions/loading";
import { validateAddCustomerSchema } from "../../utils/schema";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./addCustomer.scss";

const AddCustomer = () => {
  const [state, setState] = useState(false);
  const formikRef = useRef();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  const initialValues = {
    code_phone_area: "",
    phone: "",
    email: "",
    password: "",
    name: "",
    code: "",
  };

  const addCustomer = () => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(
      createCustomer.createCustomerRequest({
        code_phone_area: "+84",
        phone: formikRef?.current?.values?.phone,
        email: formikRef?.current?.values?.email,
        full_name: formikRef?.current?.values?.name,
        password: formikRef?.current?.values?.password,
      })
    );
  };

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Tạo khách hàng"
        className="btn-add-customer-show"
        type="button"
        // onClick={() => setState(!state)}
        onClick={showDrawer}
      />

      {/* Modal */}
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        onSubmit={addCustomer}
        validationSchema={validateAddCustomerSchema}
        validateOnChange={true}
      >
        {({ values, setFieldValue, errors, handleSubmit }) => {
          return (
            <Drawer
              title="Tạo khách hàng"
              width={500}
              onClose={onClose}
              open={open}
              bodyStyle={{
                paddingBottom: 80,
              }}
            >
              <Form>
                <CustomTextInput
                  label="Tên khách hàng"
                  type="text"
                  id="className"
                  placeholder="Nhập tên khách hàng"
                  onChange={(text) => setFieldValue("name", text.target.value)}
                  errors={errors?.name}
                />
                {/* <CustomTextInput
                  label="Mã vùng"
                  type="select"
                  id="codeArea"
                  className="textInput"
                  onChange={(text) =>
                    setFieldValue("code_phone_area", text.target.value)
                  }
                  body={
                    <>
                      <option value="">Chọn mã vùng</option>
                      <option value="Nam">+84</option>
                    </>
                  }
                  errors={errors?.code_phone_area}
                /> */}
                <CustomTextInput
                  label="Số điện thoại"
                  type="text"
                  id="className"
                  placeholder="Nhập số điện thoại"
                  onChange={(text) => setFieldValue("phone", text.target.value)}
                  errors={errors?.phone}
                />
                <CustomTextInput
                  label="Email"
                  type="email"
                  id="className"
                  placeholder="Nhập email"
                  onChange={(text) => setFieldValue("email", text.target.value)}
                  errors={errors?.email}
                />

                <CustomTextInput
                  label="Mật khẩu"
                  type="password"
                  name="password"
                  id="examplePassword"
                  placeholder="Nhập mật khẩu"
                  onChange={(text) =>
                    setFieldValue("password", text.target.value)
                  }
                  errors={errors?.password}
                />

                <CustomTextInput
                  label="Mã giới thiệu"
                  type="text"
                  name="password"
                  id="examplePassword"
                  placeholder="Vui lòng nhập mã giới thiệu"
                  onChange={(text) => setFieldValue("code", text.target.value)}
                />
                <CustomButton
                  title="Thêm"
                  className="float-right btn-add-cus"
                  type="button"
                  onClick={handleSubmit}
                />
              </Form>
            </Drawer>
          );
        }}
      </Formik>
    </>
  );
};

export default memo(AddCustomer);
