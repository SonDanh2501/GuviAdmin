import { DatePicker, Input, List, Select } from "antd";
import dayjs from "dayjs";
import _debounce from "lodash/debounce";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Form, Row } from "reactstrap";
import {
  getCollaboratorsById,
  searchCollaborators,
  updateInformationCollaboratorApi,
} from "../../../../../../../api/collaborator";
import { getDistrictApi } from "../../../../../../../api/file";
import { errorNotify } from "../../../../../../../helper/toast";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import { getService } from "../../../../../../../redux/selectors/service";
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
  const [dataCity, setDataCity] = useState([]);
  const [codeCity, setCodeCity] = useState();
  const [dataDistrict, setDataDistrict] = useState([]);
  const [codeDistrict, setCodeDistrict] = useState([]);
  const dispatch = useDispatch();
  const service = useSelector(getService);
  const serviceOption = [];
  const cityOption = [];
  const districtsOption = [];
  const dateFormat = "YYYY-MM-DD";

  useEffect(() => {
    getDistrictApi()
      .then((res) => {
        setDataCity(res?.aministrative_division);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
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
      serviceApply.push(item?._id);
    });
    // setServiceApply(data?.serviceApply);
    setCodeCity(data?.city);
    setCodeDistrict(data?.district);

    dataCity?.map((item) => {
      if (item?.code === data?.city) {
        setDataDistrict(item?.districts);
      }
    });
  }, [data]);

  service.map((item, index) => {
    serviceOption.push({
      label: item?.title?.vi,
      value: item?._id,
    });
  });

  dataCity?.map((item) => {
    cityOption.push({
      label: item?.name,
      value: item?.code,
      district: item?.districts,
    });
  });

  dataDistrict?.map((item) => {
    districtsOption.push({
      label: item?.name,
      value: item?.code,
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

  const searchCollaborator = useCallback(
    _debounce((value) => {
      setNameCollaborator(value);
      if (value) {
        searchCollaborators(0, 100, "", value)
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
    }, 500),
    []
  );

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
      city: codeCity,
    })
      .then((res) => {
        dispatch(loadingAction.loadingRequest(false));
        setServiceApply([]);
        getCollaboratorsById(idCTV)
          .then((res) => {
            setData(res);
          })
          .catch((err) => {});
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
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
  ]);

  return (
    <>
      <Form>
        <div className="pl-lg-4">
          <h5>Thông tin</h5>
          <Row>
            <Col lg="6">
              <div>
                <a>Họ và tên</a>
                <Input
                  placeholder="Nhập họ tên"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </Col>
            <Col lg="6" className="gender">
              <div>
                <a>Giới tính</a>
                <Select
                  style={{ width: "100%" }}
                  value={gender}
                  onChange={(e) => setGender(e)}
                  options={[
                    { value: "other", label: "Khác" },
                    { value: "male", label: "Nam" },
                    { value: "female", label: "Nữ" },
                  ]}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="6">
              <div>
                <a>Ngày sinh</a>
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
              <div>
                <a>SĐT liên hệ</a>
                <Input type="number" value={phone} disabled={true} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="6">
              <div>
                <a>Địa chỉ thường trú</a>
                <Input
                  placeholder="Nhập địa chỉ thường trú"
                  type="text"
                  value={resident}
                  onChange={(e) => setResident(e.target.value)}
                />
              </div>
            </Col>
            <Col lg="6">
              <div>
                <a>Đối tượng CTV</a>
                <Input
                  placeholder="Nhập đối tượng"
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="6">
              <div>
                <a>Địa chỉ tạm trú</a>
                <Input
                  placeholder="Nhập địa chỉ tạm trú"
                  type="text"
                  value={staying}
                  onChange={(e) => setStaying(e.target.value)}
                />
              </div>
            </Col>
            <Col lg="6">
              <div>
                <a>Loại dịch vụ</a>
                <Select
                  style={{ width: "100%" }}
                  mode="multiple"
                  allowClear
                  value={serviceApply}
                  onChange={(e) => setServiceApply(e)}
                  options={serviceOption}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="6">
              <div>
                <a>Dân tộc</a>
                <Input
                  placeholder="Nhập dân tộc"
                  type="text"
                  value={ethnic}
                  onChange={(e) => setEthnic(e.target.value)}
                />
              </div>
            </Col>
            <Col lg="6">
              <div>
                <a>Tôn giáo</a>
                <Input
                  placeholder="Nhập tôn giáo"
                  type="text"
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="6">
              <div>
                <a>Trình độ văn hoá</a>
                <Select
                  style={{ width: "100%" }}
                  value={level}
                  onChange={(e) => setLevel(e)}
                  options={[
                    { value: "5/12", label: "5/12" },
                    { value: "9/12", label: "9/12" },
                    { value: "12/12", label: "12/12" },
                    { value: "Cao đẳng", label: "Cao đẳng" },
                    { value: "Đại học", label: "Đại học" },
                    { value: "Thạc sĩ", label: "Thạc sĩ" },
                    { value: "Tiến sĩ", label: "Tiến sĩ" },
                  ]}
                />
              </div>
            </Col>
            <Col lg="6">
              <div>
                <a>Mã giới thiệu</a>
                <Input
                  label={"Mã giới thiệu"}
                  type="text"
                  value={codeInvite}
                  disabled={true}
                />
              </div>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg="6">
              <div>
                <a>Tỉnh/thành phố </a>
                <Select
                  value={codeCity}
                  defaultValue={"Chọn tỉnh/thành phố làm việc"}
                  options={cityOption}
                  style={{ width: "100%" }}
                  onChange={onChangeCity}
                />
              </div>
            </Col>
            <Col lg="6">
              <div>
                <a>Quận/huyện</a>
                <Select
                  value={codeDistrict}
                  options={districtsOption}
                  style={{ width: "100%" }}
                  onChange={onChangeDistrict}
                  mode="multiple"
                  allowClear
                />
              </div>
            </Col>
          </Row>
          <hr />
          <h5>CMND/CCCD</h5>
          <Row>
            <Col lg="6">
              <div>
                <a>Số CCCD/CMND</a>
                <Input
                  placeholder="Nhập thông tin"
                  type="number"
                  value={number}
                  min={0}
                  onChange={(e) => onChangeNumberIndentity(e)}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="6">
              <div>
                <a>Nơi cấp</a>
                <Input
                  placeholder="Nhập thông tin"
                  type="text"
                  value={issued}
                  onChange={(e) => setIssued(e.target.value)}
                />
              </div>
            </Col>
            <Col lg="6">
              <div>
                <a>Ngày cấp</a>
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
          <h5>Giới thiệu</h5>
          <Row>
            <Col lg="12">
              <div>
                <h6>Mã giới thiệu</h6>
                <div>
                  <Input
                    placeholder="Tìm kiếm theo số điện thoại"
                    value={nameCollaborator}
                    disabled={data?.is_verify ? true : false}
                    className="input-seach-collaborator"
                    onChange={(e) => {
                      searchCollaborator(e.target.value);
                      searchValue(e.target.value);
                    }}
                  />
                </div>

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
                          <a>
                            {item?.full_name} - {item?.phone} - {item?.id_view}{" "}
                            - {item?.invite_code}
                          </a>
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
          Cập nhật
        </Button>
      </Form>
    </>
  );
};

export default Information;
