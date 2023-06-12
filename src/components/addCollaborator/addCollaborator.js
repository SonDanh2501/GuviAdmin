import { Drawer, Select } from "antd";
import { Formik } from "formik";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Modal } from "reactstrap";
import { loadingAction } from "../../redux/actions/loading";
import { validateAddCollaboratorSchema } from "../../utils/schema";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./addCollaborator.scss";
import { createCollaborator, fetchCollaborators } from "../../api/collaborator";
import { errorNotify } from "../../helper/toast";
import { getService } from "../../redux/selectors/service";
import { getElementState } from "../../redux/selectors/auth";
import { getDistrictApi } from "../../api/file";

const AddCollaborator = (props) => {
  const { setData, setTotal, startPage, status, setIsLoading } = props;
  const formikRef = useRef();
  const checkElement = useSelector(getElementState);
  const service = useSelector(getService);
  const [dataCity, setDataCity] = useState([]);
  const serviceOption = [];
  const cityOption = [];
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  useEffect(() => {
    getDistrictApi()
      .then((res) => {
        setDataCity(res?.aministrative_division);
      })
      .catch((err) => {});
  }, []);

  dataCity?.map((item) => {
    cityOption.push({
      value: item?.code,
      label: item?.name,
    });
  });

  service.map((item, index) => {
    serviceOption.push({
      label: item?.title?.vi,
      value: item?._id,
    });
  });

  const initialValues = {
    code_phone_area: "",
    phone: "",
    email: "",
    name: "",
    identify: "",
    code: "",
    type: "",
    service_apply: [],
    city: "",
  };

  const addCustomer = useCallback(() => {
    setIsLoading(true);

    createCollaborator({
      code_phone_area: "+84",
      phone: formikRef?.current?.values?.phone,
      email: formikRef?.current?.values?.email,
      full_name: formikRef?.current?.values?.name,
      identity_number: formikRef?.current?.values?.identify,
      city: formikRef?.current?.values?.city,
      id_inviter: formikRef?.current?.values?.code,
      type: formikRef?.current?.values?.type,
      service_apply: formikRef?.current?.values?.service_apply,
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
        className={
          checkElement?.includes("create_collaborator")
            ? "btn-add-collaborator"
            : "btn-add-collaborator-hide"
        }
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
                  label="Tên cộng tác viên"
                  type="text"
                  id="className"
                  placeholder="Nhập tên cộng tác viên"
                  onChange={(text) => setFieldValue("name", text.target.value)}
                  errors={errors?.name}
                />

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
                <div className="mb-2">
                  <a>Loại dịch vụ</a>
                  <Select
                    style={{ width: "100%" }}
                    mode="multiple"
                    allowClear
                    onChange={(e) => setFieldValue("service_apply", e)}
                    options={serviceOption}
                  />
                </div>
                <div className="mb-2">
                  <a>Tỉnh / thành phố</a>
                  <Select
                    style={{ width: "100%" }}
                    defaultValue={"Chọn tỉnh/ thành phố"}
                    allowClear
                    onChange={(e) => setFieldValue("city", e)}
                    options={cityOption}
                  />
                </div>
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
