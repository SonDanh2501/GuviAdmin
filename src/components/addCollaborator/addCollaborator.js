import { Drawer } from "antd";
import { Formik } from "formik";
import React, { memo, useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, Modal } from "reactstrap";
import { loadingAction } from "../../redux/actions/loading";
import { validateAddCollaboratorSchema } from "../../utils/schema";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./addCollaborator.scss";
import { createCollaborator, fetchCollaborators } from "../../api/collaborator";
import { errorNotify } from "../../helper/toast";

const AddCollaborator = (props) => {
  const { setData, setTotal, startPage, status, setIsLoading } = props;
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
    name: "",
    identify: "",
    code: "",
    type: "",
  };

  const addCustomer = useCallback(() => {
    setIsLoading(true);
    // dispatch(
    //   createCollaborator.createCollaboratorRequest({
    //     code_phone_area: "+84",
    //     phone: formikRef?.current?.values?.phone,
    //     email: formikRef?.current?.values?.email,
    //     full_name: formikRef?.current?.values?.name,
    //     identity_number: formikRef?.current?.values?.identify,
    //     city: 79,
    //     id_inviter: formikRef?.current?.values?.code,
    //   })
    // );
    createCollaborator({
      code_phone_area: "+84",
      phone: formikRef?.current?.values?.phone,
      email: formikRef?.current?.values?.email,
      full_name: formikRef?.current?.values?.name,
      identity_number: formikRef?.current?.values?.identify,
      city: 79,
      id_inviter: formikRef?.current?.values?.code,
      type: formikRef?.current?.values?.type,
    })
      .then((res) => {
        setOpen(false);
        fetchCollaborators(startPage, 20, status)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItems);
          })
          .catch((err) => {});
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  }, [formikRef, startPage, status]);

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Tạo cộng tác viên"
        className="btn-add-collaborator"
        type="button"
        onClick={showDrawer}
        // onClick={() => setState(!state)}
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
            <Drawer
              title="Thêm cộng tác viên"
              width={500}
              onClose={onClose}
              open={open}
              bodyStyle={{
                paddingBottom: 80,
              }}
            >
              <Form>
                <CustomTextInput
                  label="Tạo cộng tác viên"
                  type="text"
                  id="className"
                  placeholder="Nhập tên cộng tác viên"
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
                      <option value="+84">+84</option>
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
                />
                <CustomTextInput
                  label="Type"
                  type="text"
                  id="className"
                  placeholder="Nhập đối tượng CTV"
                  onChange={(text) => setFieldValue("type", text.target.value)}
                />
                <CustomTextInput
                  label="CCCD/CMND"
                  type="number"
                  id="className"
                  placeholder="Nhập CCCD/CMND"
                  onChange={(text) =>
                    setFieldValue("identify", text.target.value)
                  }
                  errors={errors?.identify}
                />
                <CustomTextInput
                  label="Mã giới thiệu"
                  type="text"
                  id="className"
                  placeholder="Nhập mã giới thiệu"
                  onChange={(text) => setFieldValue("code", text.target.value)}
                />
                <CustomButton
                  title="Thêm"
                  className="float-right btn-add-ctv"
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

export default memo(AddCollaborator);
