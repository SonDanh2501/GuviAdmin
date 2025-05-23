import { Drawer, Select } from "antd";
import { Formik } from "formik";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Form } from "reactstrap";
import { createCollaborator, fetchCollaborators } from "../../api/collaborator";
import { getDistrictApi } from "../../api/file";
import { errorNotify } from "../../helper/toast";
import { getElementState, getLanguageState } from "../../redux/selectors/auth";
import { getProvince, getService } from "../../redux/selectors/service";
import { validateAddCollaboratorSchema } from "../../utils/schema";
import CustomButton from "../customButton/customButton";
import InputCustom from "../textInputCustom";
import "./addCollaborator.scss";
import i18n from "../../i18n";
import useWindowDimensions from "../../helper/useWindowDimensions";
import { getDetailBusiness, getListBusiness } from "../../api/configuration";
import { set } from "lodash";

const AddCollaborator = (props) => {
  const {
    setData,
    setTotal,
    startPage,
    status,
    setIsLoading,
    valueSearch,
    city,
  } = props;
  const formikRef = useRef();
  const checkElement = useSelector(getElementState);
  const service = useSelector(getService);
  const [dataBusiness, setDataBusiness] = useState([]);
  const [codeCity, setCodeCity] = useState([]);
  const [idBusiness, setIdBusiness] = useState("");
  const serviceOption = [];
  const cityOption = [];
  const businessOption = [];
  const [open, setOpen] = useState(false);
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);
  const province = useSelector(getProvince);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  useEffect(() => {
    getListBusiness(0, 100, "")
      .then((res) => {
        setDataBusiness(res?.data);
      })
      .catch((err) => {});
  }, []);

  province?.map((item) => {
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

  dataBusiness?.map((item) => {
    businessOption?.push({
      value: item?._id,
      label: item?.full_name,
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
    idBusiness: "",
  };

  const onChangeBusiness = (e) => {
    setIdBusiness(e);
    getDetailBusiness(e)
      .then((res) => {
        setCodeCity(res?.area_manager_lv_1);
      })
      .catch((err) => {});
  };

  const addCustomer = useCallback(() => {
    setIsLoading(true);

    createCollaborator({
      code_phone_area: "+84",
      phone: formikRef?.current?.values?.phone,
      email: formikRef?.current?.values?.email,
      full_name: formikRef?.current?.values?.name,
      identity_number: formikRef?.current?.values?.identify,
      city: codeCity.length > 0 ? codeCity[0] : -1,
      id_inviter: formikRef?.current?.values?.code,
      type: formikRef?.current?.values?.type,
      service_apply: formikRef?.current?.values?.service_apply,
      id_business: idBusiness,
    })
      .then((res) => {
        setOpen(false);
        fetchCollaborators(lang, startPage, 20, status, valueSearch, city)
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
  }, [formikRef, startPage, status, codeCity, idBusiness]);

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title={`${i18n.t("create_collaborator", { lng: lang })}`}
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
              title={`${i18n.t("create_collaborator", { lng: lang })}`}
              width={width < 490 ? 390 : 500}
              onClose={onClose}
              open={open}
              bodyStyle={{
                paddingBottom: 80,
              }}
              headerStyle={{ height: 50 }}
            >
              <InputCustom
                title={`${i18n.t("full_name", { lng: lang })}`}
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
                type="email"
                placeholder={`${i18n.t("placeholder", { lng: lang })}`}
                onChange={(text) => setFieldValue("email", text.target.value)}
              />
              <InputCustom
                title="Type"
                type="text"
                placeholder={`${i18n.t("placeholder", { lng: lang })}`}
                onChange={(text) => setFieldValue("type", text.target.value)}
              />
              <InputCustom
                title="CCCD/CMND"
                type="number"
                placeholder={`${i18n.t("placeholder", { lng: lang })}`}
                onChange={(text) =>
                  setFieldValue("identify", text.target.value)
                }
                error={errors?.identify}
              />
              <div className="mb-2">
                <a>{`${i18n.t("type_service", { lng: lang })}`}</a>
                <Select
                  style={{ width: "100%" }}
                  mode="multiple"
                  allowClear
                  onChange={(e) => setFieldValue("service_apply", e)}
                  options={serviceOption}
                />
              </div>
              <div className="mb-2">
                <a>{`${i18n.t("Đối tác", { lng: lang })}`}</a>
                <Select
                  style={{ width: "100%" }}
                  allowClear
                  onChange={onChangeBusiness}
                  options={businessOption}
                />
              </div>
              <div className="mb-2">
                <a>{`${i18n.t("province_city", { lng: lang })}`}</a>
                <Select
                  style={{ width: "100%" }}
                  allowClear
                  onChange={(e) => setCodeCity(e)}
                  options={cityOption}
                  value={codeCity}
                />
              </div>
              <InputCustom
                title={`${i18n.t("code_invite", { lng: lang })}`}
                type="text"
                placeholder={`${i18n.t("placeholder", { lng: lang })}`}
                onChange={(text) => setFieldValue("code", text.target.value)}
              />

              <CustomButton
                title={`${i18n.t("add", { lng: lang })}`}
                className="float-right btn-add-ctv mt-5"
                type="button"
                onClick={handleSubmit}
              />
            </Drawer>
          );
        }}
      </Formik>
    </>
  );
};

export default memo(AddCollaborator);
