import { Drawer } from "antd";
import { Formik } from "formik";
import React, { memo, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "reactstrap";
import { fetchCustomers, updateCustomer } from "../../api/customer";
import { errorNotify } from "../../helper/toast";
import { validateAddCustomerSchema } from "../../utils/schema";
import CustomTextInput from "../CustomTextInput/customTextInput";
import CustomButton from "../customButton/customButton";
import "./editCustomer.scss";
import { getElementState } from "../../redux/selectors/auth";

const EditCustomer = (props) => {
  const { data, setIsLoading, setData, setTotal, startPage, status } = props;
  const formikRef = useRef();
  const checkElement = useSelector(getElementState);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  const initialValues = {
    code_phone_area: data?.code_phone_area,
    phone: data?.phone,
    email: data?.email,
    name: data?.full_name,
  };

  const editCustomer = useCallback(() => {
    setIsLoading(true);
    // dispatch(
    //   updateCustomer.updateCustomerRequest({
    //     id: data?._id,
    //     data: {
    //       code_phone_area: "+84",
    //       phone: formikRef?.current?.values?.phone,
    //       email: formikRef?.current?.values?.email,
    //       full_name: formikRef?.current?.values?.name,
    //       password: formikRef?.current?.values?.password,
    //     },
    //   })
    // );
    updateCustomer(data?._id, {
      code_phone_area: "+84",
      phone: formikRef?.current?.values?.phone,
      email: formikRef?.current?.values?.email,
      full_name: formikRef?.current?.values?.name,
      password: formikRef?.current?.values?.password,
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
  }, [formikRef, data, startPage, status]);

  return (
    <>
      <a
        onClick={showDrawer}
        className={
          checkElement?.includes("edit_customer")
            ? "text-edit"
            : "text-edit-hide"
        }
      >
        Chỉnh sửa
      </a>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        onSubmit={editCustomer}
        validationSchema={validateAddCustomerSchema}
        enableReinitialize={true}
        validateOnChange={true}
      >
        {({ values, setFieldValue, errors, handleSubmit }) => {
          return (
            <Drawer
              title="Sửa khách hàng"
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
                    label="Tên khách hàng"
                    type="text"
                    id="className"
                    placeholder="Nhập tên khách hàng"
                    defaultValue={values.name}
                    onChange={(text) =>
                      setFieldValue("name", text.target.value)
                    }
                    errors={errors?.name}
                  />
                  {/* <CustomTextInput
                    label="Mã vùng"
                    type="select"
                    id="codeArea"
                    className="textInput"
                    defaultValue={values.code_phone_area}
                    onChange={(text) =>
                      setFieldValue("code_phone_area", text.target.value)
                    }
                    body={
                      <>
                        <option value="">Chọn mã vùng</option>
                        <option value="+84">+84</option>
                        <option value="+1">+1</option>
                      </>
                    }
                    errors={errors?.code_phone_area}
                  /> */}
                  <CustomTextInput
                    label="Số điện thoại"
                    type="text"
                    id="className"
                    placeholder="Nhập số điện thoại"
                    defaultValue={values.phone}
                    onChange={(text) =>
                      setFieldValue("phone", text.target.value)
                    }
                    errors={errors?.phone}
                  />
                  <CustomTextInput
                    label="Email"
                    type="email"
                    id="className"
                    placeholder="Nhập email"
                    defaultValue={values.email}
                    onChange={(text) =>
                      setFieldValue("email", text.target.value)
                    }
                  />
                  <CustomButton
                    title="Sửa"
                    className="float-right btn-modal-customer"
                    type="button"
                    onClick={editCustomer}
                  />
                </Form>
              </div>
            </Drawer>
          );
        }}
      </Formik>
    </>
  );
};

export default memo(EditCustomer);
