import { Formik } from "formik";
import React, { memo, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, Modal } from "reactstrap";
import { updateCustomer } from "../../redux/actions/customerAction";
import { validateAddCollaboratorSchema } from "../../utils/schema";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./editCollaborator.scss";

const EditCollaborator = ({ state, setState, data }) => {
  const formikRef = useRef();
  const dispatch = useDispatch();

  const initialValues = {
    code_phone_area: data?.code_phone_area,
    phone: data?.phone,
    email: data?.email,
    name: data?.name,
    identify: data?.identify,
  };

  const editCollaborator = useCallback(() => {
    dispatch(
      updateCustomer.updateCustomerRequest({
        id: data?._id,
        data: {
          code_phone_area: formikRef?.current?.values?.code_phone_area,
          phone: formikRef?.current?.values?.phone,
          email: formikRef?.current?.values?.email,
          name: formikRef?.current?.values?.name,
          password: formikRef?.current?.values?.password,
          identify: formikRef?.current?.values?.identify,
        },
      })
    );
  }, [formikRef, data]);

  return (
    <>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        onSubmit={editCollaborator}
        validationSchema={validateAddCollaboratorSchema}
        enableReinitialize={true}
        validateOnChange={true}
      >
        {({ values, setFieldValue, errors, handleSubmit }) => {
          return (
            <Modal
              className="modal-dialog-centered"
              isOpen={state}
              toggle={() => setState(!state)}
            >
              <div className="modal-header">
                <h3 className="modal-title" id="exampleModalLabel">
                  Sửa cộng tác viên
                </h3>
                <Button
                  data-dismiss="modal"
                  style={{ backgroundColor: "red", border: "none" }}
                  type="button"
                  onClick={() => setState(!state)}
                >
                  <span aria-hidden={true}>×</span>
                </Button>
              </div>
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
                  <CustomTextInput
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
                  />
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
                  <CustomTextInput
                    label="CCCD/CMND"
                    type="email"
                    id="className"
                    placeholder="Nhập CCCD/CMND"
                    defaultValue={values.identify}
                    onChange={(text) =>
                      setFieldValue("identify", text.target.value)
                    }
                  />
                  <CustomButton
                    title="Sửa"
                    className="float-right btn-modal"
                    type="button"
                    onClick={editCollaborator}
                  />
                </Form>
              </div>
            </Modal>
          );
        }}
      </Formik>
    </>
  );
};

export default memo(EditCollaborator);
