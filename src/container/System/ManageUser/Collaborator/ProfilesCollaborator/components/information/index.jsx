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
import InputTextCustom from "../../../../../../../components/inputCustom";

const Information = ({ data, image, idCTV, setData }) => {
  const [resident, setResident] = useState("");
  const [staying, setStaying] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [type, setType] = useState("");
  const [serviceApply, setServiceApply] = useState([]);
  const [dataCollaborator, setDataCollaborator] = useState([]);
  const [nameCollaborator, setNameCollaborator] = useState("");
  const [idCollaborator, setIdCollaborator] = useState("");
  const [dataBusiness, setDataBusiness] = useState([]);
  const [idBusiness, setIdBusiness] = useState("");
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

  const [name, setName] = useState(""); // Giá trị tên
  const [gender, setGender] = useState("other"); // Giá trị giới tính lựa chọn
  const [birthday, setBirthday] = useState("2022-01-20T00:00:00.000Z"); // Giá trị ngày sinh
  const [phone, setPhone] = useState(""); // Giá trị số điện thoại
  const [ethnic, setEthnic] = useState(""); // Giá trị dân tộc
  const [religion, setReligion] = useState(""); // Giá trị tôn giáo
  const [level, setLevel] = useState(""); // Giá trị trình độ
  const [codeInvite, setCodeInvite] = useState(""); // Giá trị mã giới thiệu
  const [number, setNumber] = useState(""); // Giá trị CCCD
  const [issued, setIssued] = useState(""); // Giá trị nơi cấp CCCD/CMND
  const [issuedDay, setIssuedDay] = useState(""); // Giá trị ngày cấp CCCD/CMND

  const [selectProvinceLive, setSelectProvinceLive] = useState(""); // Giá trị province (tỉnh/thành phố) thường trú lựa chọn
  const [selectDistrictLive, setSelectDistrictLive] = useState(""); // Giá trị district (quận/huyện) thường trú lựa chọn
  const [districtArrayLive, setDistrictArrayLive] = useState([]); // Giá trị mảng gồm các district (quận/huyện) của province (tỉnh/thành phố) đã chọn (thường trú)
  const [addressResidentLive, setAddressResidentLive] = useState(""); // Giá trị địa chỉ thường trú cụ thể

  const [selectProvinceTemp, setSelectProvinceTemp] = useState(""); // Giá trị province (tỉnh/thành phố) thường trú lựa chọn
  const [selectDistrictTemp, setSelectDistrictTemp] = useState(""); // Giá trị district (quận/huyện) thường trú lựa chọn
  const [districtArrayTemp, setDistrictArrayTemp] = useState([]); // Giá trị mảng gồm các district (quận/huyện) của province (tỉnh/thành phố) đã chọn (thường trú)
  const [addressTemp, setAddressTemp] = useState(""); // Giá trị địa chỉ thường trú cụ thể

  const [codeCity, setCodeCity] = useState(""); // Giá trị tỉnh, thành phố làm việc
  const [selectProvinceWork, setSelectProvinceWork] = useState(""); // Giá trị province (tỉnh/thành phố) làm việc lựa chọn
  const [selectDistrictWork, setSelectDistrictWork] = useState([]); // Giá trị district (quận/huyện) làm việc lựa chọn
  const [districtArrayWork, setDistrictArrayWork] = useState([]); // Giá trị mảng gồm các district (quận/huyện) của province (tỉnh/thành phố) đã chọn (làm việc)
  const [addressWork, setAddressWork] = useState(""); // Giá trị địa chỉ làm việc cụ thể

  const [selectService, setSelectService] = useState([]); // Giá trị service lựa chọn
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
    setEthnic(data?.folk); // Dân tộc
    setReligion(data?.religion); // Tôn giáo
    setLevel(data?.edu_level); // Trình độ
    setNumber(data?.identity_number);
    setIssued(data?.identity_place);
    setIssuedDay(data?.identity_date);
    setImgUrl(data?.avatar);
    setPhone(data?.phone);
    setCodeInvite(data?.invite_code);
    setType(data?.type);

    // Giá trị default (nếu có) của service
    setServiceApply(data?.service_apply); // setServiceApply // Giá trị cũ (xóa sau này)
    setSelectService(data?.service_apply ? data?.service_apply : [""]);

    setIdBusiness(data?.id_business);

    // Giá trị default (nếu có) của province làm việc
    setCodeCity(data?.city); // Giá trị cũ (xóa sau này)
    // setSelectProvinceWork(data?.city);

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

  // console.log("selectDistrictWork", selectDistrictWork);
  return (
    <>
      <div className="pb-4">
        <div className="flex gap-6">
          <div
            style={{ borderRadius: "6px" }}
            className="w-3/5 bg-white card-shadow"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b-2 border-gray-200 p-3.5">
              <div className="flex items-center gap-1">
                <span className="font-medium text-sm">
                  Thông tin cộng tác viên
                </span>
              </div>
            </div>
            {/* Content */}
            <div style={{ gap: "2.5px" }} className="flex flex-col p-3.5">
              {/* Họ và tên */}
              <div className="flex gap-4">
                <div className="w-full">
                  <InputTextCustom
                    type="text"
                    value={name}
                    placeHolder="Họ và tên"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              {/* Ngày sinh, số điện thoại, giới tính */}
              <div className="flex gap-4">
                <div className="w-1/3">
                  <InputTextCustom
                    type="select"
                    value={gender}
                    placeHolder="Giới tính"
                    setValueSelectedProps={setGender}
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
                </div>
                <div className="w-1/3">
                  <InputTextCustom
                    type="date"
                    value={birthday}
                    placeHolder="Ngày sinh"
                    birthday={
                      birthday ? dayjs(birthday.slice(0, 1), dateFormat) : ""
                    }
                    setValueSelectedProps={setBirthday}
                  />
                </div>
                <div className="w-1/3">
                  <InputTextCustom
                    type="text"
                    disable={true}
                    value={phone}
                    placeHolder="Số điện thoại"
                  />
                </div>
              </div>
              {/* Tỉnh/Thành phố thường trú, Quận/Huyện thường trú*/}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <InputTextCustom
                    type="province"
                    value={selectProvinceLive}
                    placeHolder="Tỉnh/Thành phố (thường trú)"
                    province={province}
                    setValueSelectedProps={setSelectProvinceLive}
                    setValueSelectedPropsSupport={setSelectDistrictLive}
                    setValueArrayProps={setDistrictArrayLive}
                  />
                </div>
                <div className="w-1/2">
                  <InputTextCustom
                    type="district"
                    disable={selectProvinceLive ? false : true}
                    value={selectDistrictLive}
                    placeHolder="Quận/Huyện (thường trú)"
                    district={districtArrayLive}
                    setValueSelectedProps={setSelectDistrictLive}
                  />
                </div>
              </div>
              {/* Địa chỉ cụ thể thường trú */}
              <div className="flex gap-4">
                <div className="w-full">
                  <InputTextCustom
                    type="text"
                    disable={selectDistrictLive ? false : true}
                    value={addressResidentLive}
                    placeHolder="Số nhà, Tên đường (thường trú)"
                    onChange={(e) => setAddressResidentLive(e.target.value)}
                  />
                </div>
              </div>
              {/* Tỉnh/Thành phố tạm trú, Quận/Huyện tạm trú*/}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <InputTextCustom
                    type="province"
                    value={selectProvinceTemp}
                    placeHolder="Tỉnh/Thành phố (tạm trú)"
                    province={province}
                    setValueSelectedProps={setSelectProvinceTemp}
                    setValueSelectedPropsSupport={setSelectDistrictTemp}
                    setValueArrayProps={setDistrictArrayTemp}
                  />
                </div>
                <div className="w-1/2">
                  <InputTextCustom
                    type="district"
                    disable={selectProvinceTemp ? false : true}
                    value={selectDistrictTemp}
                    placeHolder="Quận/Huyện (tạm trú)"
                    district={districtArrayTemp}
                    setValueSelectedProps={setSelectDistrictTemp}
                  />
                </div>
              </div>
              {/* Địa chỉ cụ thể tạm trú */}
              <div className="flex gap-4">
                <div className="w-full">
                  <InputTextCustom
                    type="text"
                    disable={selectDistrictTemp ? false : true}
                    value={addressTemp}
                    placeHolder="Số nhà, Tên đường (tạm trú)"
                    onChange={(e) => setAddressTemp(e.target.value)}
                  />
                </div>
              </div>
              {/* Loại dịch vụ */}
              <div className="flex gap-4">
                <div className="w-full">
                  <InputTextCustom
                    type="service"
                    value={selectService}
                    multiSelectOptions={service}
                    placeHolder="Loại dịch vụ"
                    setValueSelectedProps={setSelectService}
                  />
                </div>
              </div>
              {/* Dân tộc, Tôn giáo, Trình độ văn hóa */}
              <div className="flex gap-4">
                <div className="w-1/3">
                  <InputTextCustom
                    type="text"
                    value={ethnic}
                    placeHolder="Dân tộc"
                    onChange={(e) => setEthnic(e.target.value)}
                  />
                </div>
                <div className="w-1/3">
                  <InputTextCustom
                    type="text"
                    value={religion}
                    placeHolder="Tôn giáo"
                    onChange={(e) => setReligion(e.target.value)}
                  />
                </div>
                <div className="w-1/3">
                  <InputTextCustom
                    type="select"
                    value={level}
                    placeHolder="Trình độ"
                    setValueSelectedProps={setLevel}
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
                        label: `${i18n.t("doctor_philosophy", {
                          lng: lang,
                        })}`,
                      },
                    ]}
                  />
                </div>
              </div>
              {/* Mã giới thiệu */}
              <div className="flex gap-4">
                <div className="w-full">
                  <InputTextCustom
                    type="text"
                    disable={true}
                    value={codeInvite}
                    // multiSelectOptions={service}
                    placeHolder="Mã giới thiệu"
                    // setValueSelectedProps={setSelectService}
                  />
                </div>
              </div>
              {/* Tỉnh/Thành phố làm việc, Quận/Huyện làm việc*/}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <InputTextCustom
                    type="province"
                    value={selectProvinceWork}
                    placeHolder="Tỉnh/Thành phố làm việc"
                    province={province}
                    setValueSelectedProps={setSelectProvinceWork}
                    setValueSelectedPropsSupport={setSelectDistrictWork}
                    setValueArrayProps={setDistrictArrayWork}
                  />
                </div>
                <div className="w-1/2">
                  <InputTextCustom
                    type="multiDistrict"
                    disable={selectProvinceWork ? false : true}
                    value={selectDistrictWork}
                    multiSelectOptions={districtArrayWork}
                    placeHolder="Quận/Huyện làm việc"
                    // district={districtArrayWork}
                    setValueSelectedProps={setSelectDistrictWork}
                  />
                </div>
              </div>
              {/* CCCD, Nơi cấp, Ngày cấp */}
              <div className="flex gap-4">
                <div className="w-1/3">
                  <InputTextCustom
                    type="text"
                    // disable={true}
                    value={number}
                    placeHolder="CCCD"
                  />
                </div>
                <div className="w-1/3">
                  <InputTextCustom
                    type="text"
                    // disable={true}
                    value={issued}
                    placeHolder="Nơi cấp"
                  />
                </div>
                <div className="w-1/3">
                  <InputTextCustom
                    type="date"
                    value={birthday}
                    placeHolder="Ngày cấp"
                    birthday={
                      issuedDay ? dayjs(issuedDay.slice(0, 11), dateFormat) : ""
                    }
                    setValueSelectedProps={setBirthday}
                  />
                </div>
              </div>
            </div>
            {/* Button submit */}
            <div className="flex items-center justify-between p-3.5">
              <div className="w-0 h-0"></div>
              <button
                style={{ borderRadius: "6px" }}
                className="bg-violet-500 px-3 py-2 text-white font-medium hover:bg-violet-400 duration-300"
              >
                Cập nhật
              </button>
            </div>
          </div>
          <div
            style={{ borderRadius: "6px" }}
            className="w-2/5 bg-white card-shadow"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b-2 border-gray-200 p-3">
              <div className="flex items-center gap-1">
                <span className="font-medium text-sm">Tài liệu</span>
              </div>
            </div>
            {/* Content */}
            <div style={{ gap: "2.5px" }} className="flex flex-col p-3.5"></div>
          </div>
        </div>
      </div>

      {/* <>
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
                  onChange={(e) => {
                    setServiceApply(e);
                  }}
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
                              {item?.full_name} - {item?.phone} -{" "}
                              {item?.id_view} - {item?.invite_code}
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
      </> */}
    </>
  );
};

export default Information;
