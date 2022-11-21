import { Formik } from "formik";
import React, { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, Modal } from "reactstrap";
import { createCustomer } from "../../redux/actions/customerAction";
import { validateAddCollaboratorSchema } from "../../utils/schema";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./addCollaborator.scss";

const AddCollaborator = () => {
  const [state, setState] = useState(false);
  const formikRef = useRef();
  const dispatch = useDispatch();

  const initialValues = {
    code_phone_area: "",
    phone: "",
    email: "",
    password: "",
    name: "",
    identify: "",
  };

  const addCustomer = useCallback(() => {
    dispatch(
      createCustomer.createCustomerRequest({
        code_phone_area: formikRef?.current?.values?.code_phone_area,
        phone: formikRef?.current?.values?.phone,
        email: formikRef?.current?.values?.email,
        name: formikRef?.current?.values?.name,
        password: formikRef?.current?.values?.password,
        identify: formikRef?.current?.values?.identify,
      })
    );
  }, [formikRef]);

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Thêm cộng tác viên"
        className="btn-modal"
        type="button"
        onClick={() => setState(!state)}
      />

      {/* Modal */}
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        onSubmit={addCustomer}
        validationSchema={validateAddCollaboratorSchema}
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
                  Thêm cộng tác viên
                </h3>
                <button className="btn-close" onClick={() => setState(!state)}>
                  <i className="uil uil-times-square"></i>
                </button>
              </div>
              <div className="modal-body">
                <Form>
                  <CustomTextInput
                    label="Tên cộng tác viên"
                    type="text"
                    id="className"
                    placeholder="Nhập tên cộng tác viên"
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
                    onChange={(text) =>
                      setFieldValue("code_phone_area", text.target.value)
                    }
                    body={
                      <>
                        <option value="">Chọn mã vùng</option>
                        <option value="Nam">+84</option>
                        <option value="Nữ">+1</option>
                      </>
                    }
                    errors={errors?.code_phone_area}
                  />
                  <CustomTextInput
                    label="Số điện thoại"
                    type="text"
                    id="className"
                    placeholder="Nhập số điện thoại"
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
                    onChange={(text) =>
                      setFieldValue("email", text.target.value)
                    }
                    errors={errors?.email}
                  />
                  <CustomTextInput
                    label="CCCD/CMND"
                    type="text"
                    id="className"
                    placeholder="Nhập CCCD/CMND"
                    onChange={(text) =>
                      setFieldValue("identify", text.target.value)
                    }
                    errors={errors?.identify}
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
                  <CustomButton
                    title="Thêm"
                    className="float-right btn-modal"
                    type="button"
                    onClick={handleSubmit}
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

export default AddCollaborator;
