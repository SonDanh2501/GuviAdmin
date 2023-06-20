import { Drawer } from "antd";
import { Formik } from "formik";
import React, { memo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "reactstrap";

import { createCustomer, fetchCustomers } from "../../api/customer";
import { errorNotify } from "../../helper/toast";
import { getElementState, getLanguageState } from "../../redux/selectors/auth";
import { validateAddCustomerSchema } from "../../utils/schema";
import CustomButton from "../customButton/customButton";
import InputCustom from "../textInputCustom";
import "./addCustomer.scss";
import i18n from "../../i18n";

const AddCustomer = (props) => {
  const { setIsLoading, setData, setTotal, startPage, status } = props;
  const formikRef = useRef();
  const dispatch = useDispatch();
  const checkElement = useSelector(getElementState);
  const width = window.innerWidth;
  const lang = useSelector(getLanguageState);

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
        fetchCustomers(startPage, 50, status)
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
        title={`${i18n.t("create_new_customer", { lng: lang })}`}
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
              title={`${i18n.t("create_new_customer", { lng: lang })}`}
              width={width > 490 ? 500 : 300}
              onClose={onClose}
              open={open}
              bodyStyle={{
                paddingBottom: 80,
              }}
            >
              <Form>
                <InputCustom
                  title={`${i18n.t("name_customer", { lng: lang })}`}
                  type="text"
                  placeholder={`${i18n.t("placeholder", { lng: lang })}`}
                  onChange={(text) => setFieldValue("name", text.target.value)}
                  error={errors?.name}
                />
                <InputCustom
                  title={`${i18n.t("phone", { lng: lang })}`}
                  type="number"
                  placeholder={`${i18n.t("placeholder", { lng: lang })}`}
                  onChange={(text) => setFieldValue("phone", text.target.value)}
                  error={errors?.phone}
                />
                <InputCustom
                  title="Email"
                  type="text"
                  placeholder={`${i18n.t("placeholder", { lng: lang })}`}
                  onChange={(text) => setFieldValue("email", text.target.value)}
                  error={errors?.email}
                />
                <InputCustom
                  title={`${i18n.t("password", { lng: lang })}`}
                  password={true}
                  placeholder={`${i18n.t("placeholder", { lng: lang })}`}
                  onChange={(text) =>
                    setFieldValue("password", text.target.value)
                  }
                  error={errors?.password}
                />
                <InputCustom
                  title={`${i18n.t("code_invite", { lng: lang })}`}
                  type="text"
                  placeholder={`${i18n.t("placeholder", { lng: lang })}`}
                  onChange={(text) => setFieldValue("code", text.target.value)}
                />

                <CustomButton
                  title={`${i18n.t("add", { lng: lang })}`}
                  className="float-right btn-add-cus mt-5"
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
