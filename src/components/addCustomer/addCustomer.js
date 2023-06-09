import { Drawer } from "antd";
import { Formik } from "formik";
import React, { memo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "reactstrap";

import { createCustomer, fetchCustomers } from "../../api/customer";
import { errorNotify } from "../../helper/toast";
import { validateAddCustomerSchema } from "../../utils/schema";
import CustomTextInput from "../CustomTextInput/customTextInput";
import CustomButton from "../customButton/customButton";
import "./addCustomer.scss";
import { getElementState } from "../../redux/selectors/auth";

const AddCustomer = (props) => {
  const { setIsLoading, setData, setTotal, startPage, status } = props;
  const formikRef = useRef();
  const dispatch = useDispatch();
  const checkElement = useSelector(getElementState);
  const width = window.innerWidth;

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
    setIsLoading(true);
    // dispatch(
    //   createCustomer.createCustomerRequest({
    //     code_phone_area: "+84",
    //     phone: formikRef?.current?.values?.phone,
    //     email: formikRef?.current?.values?.email,
    //     full_name: formikRef?.current?.values?.name,
    //     password: formikRef?.current?.values?.password,
    //     code_inviter: formikRef?.current?.values?.code,
    //   })
    // );
    createCustomer({
      code_phone_area: "+84",
      phone: formikRef?.current?.values?.phone,
      email: formikRef?.current?.values?.email,
      full_name: formikRef?.current?.values?.name,
      password: formikRef?.current?.values?.password,
      code_inviter: formikRef?.current?.values?.code,
    })
      .then((res) => {
        setOpen(false);
        setIsLoading(false);
        fetchCustomers(startPage, 20, status)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItems);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        setIsLoading(false);
      });
  };

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Tạo mới"
        className={
          checkElement?.includes("create_customer")
            ? "btn-add-customer"
            : "btn-add-customer-hide"
        }
        type="button"
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
              width={width > 490 ? 500 : 300}
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
