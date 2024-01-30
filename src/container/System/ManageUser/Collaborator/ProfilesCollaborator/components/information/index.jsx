import { DatePicker, List } from "antd";
import dayjs from "dayjs";
import _debounce from "lodash/debounce";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Form, Row } from "reactstrap";
import {
  fetchCollaborators,
  getCollaboratorsById,
  updateInformationCollaboratorApi,
} from "../../../../../../../api/collaborator";
import {
  getDetailBusiness,
  getListBusiness,
} from "../../../../../../../api/configuration";
import InputCustom from "../../../../../../../components/textInputCustom";
import { errorNotify, successNotify } from "../../../../../../../helper/toast";
import i18n from "../../../../../../../i18n";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import {
  getProvince,
  getService,
} from "../../../../../../../redux/selectors/service";
import "./index.scss";

const Information = ({ data, image, idCTV, setData }) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("other");
  const [birthday, setBirthday] = useState("2022-01-20T00:00:00.000Z");
  const [resident, setResident] = useState("");
  const [staying, setStaying] = useState("");
  const [ethnic, setEthnic] = useState("");
  const [religion, setReligion] = useState("");
  const [level, setLevel] = useState("");
  const [number, setNumber] = useState("");
  const [issued, setIssued] = useState("");
  const [issuedDay, setIssuedDay] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [codeInvite, setCodeInvite] = useState("");
  const [type, setType] = useState("");
  const [serviceApply, setServiceApply] = useState([]);
  const [dataCollaborator, setDataCollaborator] = useState([]);
  const [nameCollaborator, setNameCollaborator] = useState("");
  const [idCollaborator, setIdCollaborator] = useState("");
  const [dataBusiness, setDataBusiness] = useState([]);
  const [idBusiness, setIdBusiness] = useState("");
  const [codeCity, setCodeCity] = useState("");
  const [dataDistrict, setDataDistrict] = useState([]);
  const [codeDistrict, setCodeDistrict] = useState([]);
  const dispatch = useDispatch();
  const service = useSelector(getService);
  const province = useSelector(getProvince);
  const serviceOption = [];
  const cityOption = [];
  const districtsOption = [];
  const businessOption = [];
  const dateFormat = "YYYY-MM-DD";
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    province.forEach((item) => {
      if (item?.code === data?.city) {
        setDataDistrict(item?.districts);
        return;
      }
    });
    getListBusiness(0, 100, "")
      .then((res) => {
        setDataBusiness(res?.data);
      })
      .catch((err) => {});
    setName(data?.full_name);
    setGender(data?.gender);
    setBirthday(data?.birthday);
    setResident(data?.permanent_address);
    setStaying(data?.temporary_address);
    setEthnic(data?.folk);
    setReligion(data?.religion);
    setLevel(data?.edu_level);
    setNumber(data?.identity_number);
    setIssued(data?.identity_place);
    setIssuedDay(data?.identity_date);
    setImgUrl(data?.avatar);
    setPhone(data?.phone);
    setCodeInvite(data?.invite_code);
    setType(data?.type);
    data?.service_apply?.map((item) => {
      return serviceApply.push(item?._id);
    });
    setIdBusiness(data?.id_business);
    setCodeCity(data?.city);
    setCodeDistrict(data?.district);
  }, [data]);

  useEffect(() => {
    if (idBusiness) {
      getDetailBusiness(idBusiness)
        .then((res) => {
          setCodeCity(res?.area_manager_lv_1[0]);
          setCodeDistrict(res?.area_manager_lv_2);
          province?.forEach((item) => {
            res?.area_manager_lv_1?.forEach((i) => {
              if (item?.code === i) {
                setDataDistrict(item?.districts);
                return;
              }
            });
          });
        })
        .catch((err) => {});
    }
  }, [idBusiness]);

  service.map((item) => {
    return serviceOption.push({
      label: item?.title?.[lang],
      value: item?._id,
    });
  });

  province?.map((item) => {
    return cityOption.push({
      label: item?.name,
      value: item?.code,
      district: item?.districts,
    });
  });

  dataDistrict?.map((item) => {
    return districtsOption.push({
      label: item?.name,
      value: item?.code,
    });
  });

  dataBusiness?.map((item) => {
    return businessOption.push({
      value: item?._id,
      label: item?.full_name,
    });
  });

  const onChangeCity = (value, label) => {
    setCodeCity(value);
    setDataDistrict(label?.district);
  };

  const onChangeDistrict = (value) => {
    setCodeDistrict(value);
  };

  const onChangeNumberIndentity = (value) => {
    if (value.target.value <= 999999999990) {
      setNumber(value.target.value);
    }
  };

  const searchValue = (value) => {
    setNameCollaborator(value);
  };

  const searchCollaborator = _debounce((value) => {
    setNameCollaborator(value);
    if (value) {
      fetchCollaborators(lang, 0, 100, "", value, "")
        .then((res) => {
          if (value === "") {
            setDataCollaborator([]);
          } else {
            setDataCollaborator(res.data);
          }
        })
        .catch((err) => console.log(err));
    } else if (idCollaborator) {
      setDataCollaborator([]);
    } else {
      setDataCollaborator([]);
    }
    setIdCollaborator("");
  }, 500);

  const updateInformation = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    const day = moment(new Date(birthday)).toISOString();
    const indentityDay = moment(new Date(issuedDay)).toISOString();

    updateInformationCollaboratorApi(data?._id, {
      gender: gender,
      full_name: name,
      birthday: day,
      permanent_address: resident,
      temporary_address: staying,
      folk: ethnic,
      religion: religion,
      edu_level: level,
      identity_number: number,
      identity_place: issued,
      identity_date: indentityDay,
      avatar: image ? image : imgUrl,
      id_inviter: idCollaborator,
      type: type,
      service_apply: serviceApply,
      district: codeDistrict,
      city: !codeCity ? -1 : codeCity,
      id_business: idBusiness,
    })
      .then((res) => {
        dispatch(loadingAction.loadingRequest(false));
        setServiceApply([]);
        successNotify({
          message: `${i18n.t("update_success_info", { lng: lang })}`,
        });
        getCollaboratorsById(idCTV)
          .then((res) => {
            setData(res);
          })
          .catch((err) => {});
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [
    gender,
    name,
    resident,
    staying,
    ethnic,
    religion,
    level,
    number,
    issued,
    issuedDay,
    data,
    birthday,
    image,
    imgUrl,
    idCollaborator,
    type,
    idCTV,
    serviceApply,
    codeDistrict,
    codeCity,
    idBusiness,
    dispatch,
    lang,
  ]);

  return (
    <>
      <Form>
        <div className="pl-lg-4">
          <h5>{`${i18n.t("info", { lng: lang })}`}</h5>
          <Row>
            <Col lg="6">
              <InputCustom
                title={`${i18n.t("full_name", { lng: lang })}`}
                placeholder={`${i18n.t("placeholder", { lng: lang })}`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Col>
            <Col lg="6" className="gender">
              <InputCustom
                title={`${i18n.t("gender", { lng: lang })}`}
                value={gender}
                onChange={(e) => setGender(e)}
                select={true}
                options={[
                  {
                    value: "other",
                    label: `${i18n.t("other", { lng: lang })}`,
                  },
                  {
                    value: "male",
                    label: `${i18n.t("male", { lng: lang })}`,
                  },
                  {
                    value: "female",
                    label: `${i18n.t("female", { lng: lang })}`,
                  },
                ]}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg="6">
              <div>
                <p className="label-birthday-info">{`${i18n.t("birthday", {
                  lng: lang,
                })}`}</p>
                <DatePicker
                  onChange={(date, dateString) => setBirthday(dateString)}
                  style={{ width: "100%" }}
                  format={dateFormat}
                  value={
                    birthday ? dayjs(birthday.slice(0, 11), dateFormat) : ""
                  }
                />
              </div>
            </Col>
            <Col lg="6">
              <InputCustom
                title={`${i18n.t("phone", { lng: lang })}`}
                type="number"
                value={phone}
                disabled={true}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg="6">
              <InputCustom
                title={`${i18n.t("permanent_address", { lng: lang })}`}
                type="text"
                value={resident}
                onChange={(e) => setResident(e.target.value)}
              />
            </Col>
            <Col lg="6">
              <InputCustom
                title={`${i18n.t("Đối tác", { lng: lang })}`}
                value={idBusiness}
                options={businessOption}
                select={true}
                onChange={(e) => setIdBusiness(e)}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg="6">
              <InputCustom
                title={`${i18n.t("temporary_address", { lng: lang })}`}
                type="text"
                value={staying}
                onChange={(e) => setStaying(e.target.value)}
              />
            </Col>
            <Col lg="6">
              <InputCustom
                title={`${i18n.t("type_service", { lng: lang })}`}
                style={{ width: "100%" }}
                mode="multiple"
                allowClear
                value={serviceApply}
                onChange={(e) => setServiceApply(e)}
                options={serviceOption}
                select={true}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg="6">
              <InputCustom
                title={`${i18n.t("nation", { lng: lang })}`}
                type="text"
                value={ethnic}
                onChange={(e) => setEthnic(e.target.value)}
              />
            </Col>
            <Col lg="6">
              <InputCustom
                title={`${i18n.t("religion", { lng: lang })}`}
                type="text"
                value={religion}
                onChange={(e) => setReligion(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg="6">
              <InputCustom
                title={`${i18n.t("cultural_level", { lng: lang })}`}
                style={{ width: "100%" }}
                value={level}
                onChange={(e) => setLevel(e)}
                options={[
                  { value: "5/12", label: "5/12" },
                  { value: "9/12", label: "9/12" },
                  { value: "12/12", label: "12/12" },
                  {
                    value: "Cao đẳng",
                    label: `${i18n.t("college", { lng: lang })}`,
                  },
                  {
                    value: "Đại học",
                    label: `${i18n.t("university", { lng: lang })}`,
                  },
                  {
                    value: "Thạc sĩ",
                    label: `${i18n.t("master", { lng: lang })}`,
                  },
                  {
                    value: "Tiến sĩ",
                    label: `${i18n.t("doctor_philosophy", { lng: lang })}`,
                  },
                ]}
                select={true}
              />
            </Col>
            <Col lg="6">
              <InputCustom
                title={`${i18n.t("code_invite", { lng: lang })}`}
                type="text"
                value={codeInvite}
                disabled={true}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg="6">
              <InputCustom
                title={`${i18n.t("Tỉnh/Thành phố làm việc", { lng: lang })}`}
                value={codeCity}
                select={true}
                options={cityOption}
                style={{ width: "100%" }}
                onChange={onChangeCity}
              />
            </Col>
            <Col lg="6">
              <InputCustom
                title={`${i18n.t("Quận/huyện làm việc", { lng: lang })}`}
                value={codeDistrict}
                options={districtsOption}
                style={{ width: "100%" }}
                onChange={onChangeDistrict}
                mode="multiple"
                allowClear
                select={true}
              />
            </Col>
          </Row>
          <hr />
          <h5>{`${i18n.t("citizen_ID", { lng: lang })}`}</h5>
          <Row>
            <Col lg="6">
              <InputCustom
                title={`${i18n.t("citizen_ID", { lng: lang })}`}
                type="number"
                value={number}
                min={0}
                onChange={(e) => onChangeNumberIndentity(e)}
              />
            </Col>
          </Row>
          <Row>
            <Col lg="6">
              <InputCustom
                title={`${i18n.t("issued_by", { lng: lang })}`}
                type="text"
                value={issued}
                onChange={(e) => setIssued(e.target.value)}
              />
            </Col>
            <Col lg="6">
              <div>
                <p className="label-birthday-info">{`${i18n.t("issue_date", {
                  lng: lang,
                })}`}</p>
                <DatePicker
                  onChange={(date, dateString) => setIssuedDay(dateString)}
                  style={{ width: "100%" }}
                  format={dateFormat}
                  value={
                    issuedDay ? dayjs(issuedDay.slice(0, 11), dateFormat) : ""
                  }
                />
              </div>
            </Col>
          </Row>
          <hr />
          <h5>{`${i18n.t("introduce", { lng: lang })}`}</h5>
          <Row>
            <Col lg="12">
              <div>
                <InputCustom
                  title={`${i18n.t("code_invite", { lng: lang })}`}
                  value={nameCollaborator}
                  disabled={data?.is_verify ? true : false}
                  className="input-seach-collaborator"
                  onChange={(e) => {
                    searchCollaborator(e.target.value);
                    searchValue(e.target.value);
                  }}
                />

                {dataCollaborator.length > 0 && (
                  <List type={"unstyled"} className="list-item">
                    {dataCollaborator?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          onClick={(e) => {
                            setIdCollaborator(item?._id);
                            setCodeInvite(item?.invite_code);
                            setNameCollaborator(item?.full_name);
                            setDataCollaborator([]);
                          }}
                        >
                          <p className="text-name">
                            {item?.full_name} - {item?.phone} - {item?.id_view}{" "}
                            - {item?.invite_code}
                          </p>
                        </div>
                      );
                    })}
                  </List>
                )}
              </div>
            </Col>
          </Row>
        </div>
        <Button className="btn-update mt-3" onClick={updateInformation}>
          {`${i18n.t("update", { lng: lang })}`}
        </Button>
      </Form>
    </>
  );
};

export default Information;
