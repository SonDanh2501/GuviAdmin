import { Drawer } from "antd";
import { Formik } from "formik";
import React, { memo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "reactstrap";

import { createCustomer, fetchCustomers } from "../../../../api/customer";
import { errorNotify } from "../../../../helper/toast";
import {
  getElementState,
  getLanguageState,
} from "../../../../redux/selectors/auth";
import { validateAddCustomerSchema } from "../../../../utils/schema";
import CustomButton from "../../../../components/customButton/customButton";
import InputCustom from "../../../../components/textInputCustom";
import "./addCustomer.scss";
import i18n from "../../../../i18n";
import useWindowDimensions from "../../../../helper/useWindowDimensions";
import { Button } from "antd";
import LoadingPagination from "../../../../components/paginationLoading";

const AddCustomer = (props) => {
  const {
    returnValueIsLoading,
    setData,
    setTotal,
    startPage,
    status,
    idGroup,
  } = props;
  const formikRef = useRef();
  const dispatch = useDispatch();
  const checkElement = useSelector(getElementState);
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);
  const [isLoading, setIsLoading] = useState(false);

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
    returnValueIsLoading(true);
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
        returnValueIsLoading(false);
        setIsLoading(false);
        fetchCustomers(lang, startPage, 50, status, idGroup, "")
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItems);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        returnValueIsLoading(false);
        setIsLoading(false);
      });
  };

  return (
    <>
      {/* Button trigger modal */}
      {/* <CustomButton
        title={`${i18n.t("create_new_customer", { lng: lang })}`}
        // className={"btn-add-customer"}
        style={{ width: "auto" }}
        onClick={showDrawer}
      /> */}
      <Button className="btn-add" onClick={showDrawer}>
        <i class="uil uil-plus-circle"></i>
        {`${i18n.t("create_new_customer", { lng: lang })}`}
      </Button>

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
              headerStyle={{ height: 50 }}
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
                  style={{ width: "auto" }}
                />
              </Form>
            </Drawer>
          );
        }}
      </Formik>
      {isLoading && <LoadingPagination />}
    </>
  );
};

export default memo(AddCustomer);
