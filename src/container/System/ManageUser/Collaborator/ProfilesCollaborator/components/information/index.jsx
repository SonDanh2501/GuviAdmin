import { DatePicker, List, Select } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import {
  getCollaboratorsById,
  searchCollaborators,
  updateInformationCollaboratorApi,
} from "../../../../../../../api/collaborator";
import CustomTextInput from "../../../../../../../components/CustomTextInput/customTextInput";
import { errorNotify } from "../../../../../../../helper/toast";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import dayjs from "dayjs";
import _debounce from "lodash/debounce";
import "./index.scss";

const Information = ({ data, image }) => {
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
  const [dataCollaborator, setDataCollaborator] = useState([]);
  const [nameCollaborator, setNameCollaborator] = useState("");
  const [idCollaborator, setIdCollaborator] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const birthdayD = !data?.birthday
      ? ""
      : data?.birthday.slice(0, data?.birthday.indexOf("T"));
    const identityD = !data?.identity_date
      ? ""
      : data?.identity_date.slice(0, data?.identity_date.indexOf("T"));
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
  }, [data]);

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
    })
      .then((res) => {
        window.location.reload();
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
  ]);

  return (
    <>
      <Form>
        <div className="pl-lg-4">
          <h5>Thông tin</h5>
          <Row>
            <Col lg="6">
              <CustomTextInput
                label={"Họ và tên"}
                placeholder="Nhập họ tên"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
              <CustomTextInput
                label={"Ngày sinh"}
                placeholder="Chọn ngày sinh"
                type="date"
                value={moment(birthday).format("YYYY-MM-DD")}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </Col>
            <Col lg="6">
              <CustomTextInput
                label={"SĐT liên hệ"}
                type="number"
                value={phone}
                disabled={true}
                // onChange={(e) => setBirthday(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <CustomTextInput
                label={"Địa chỉ thường trú"}
                placeholder="Nhập địa chỉ thường trú"
                type="text"
                value={resident}
                onChange={(e) => setResident(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <CustomTextInput
                label={"Địa chỉ tạm trú"}
                placeholder="Nhập địa chỉ tạm trú"
                type="text"
                value={staying}
                onChange={(e) => setStaying(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col lg="6">
              <CustomTextInput
                label={"Dân tộc"}
                placeholder="Nhập dân tộc"
                type="text"
                value={ethnic}
                onChange={(e) => setEthnic(e.target.value)}
              />
            </Col>
            <Col lg="6">
              <CustomTextInput
                label={"Tôn giáo"}
                placeholder="Nhập tôn giáo"
                type="text"
                value={religion}
                onChange={(e) => setReligion(e.target.value)}
              />
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
              <CustomTextInput
                label={"Mã giới thiệu"}
                type="text"
                value={codeInvite}
                disabled={true}
              />
            </Col>
          </Row>
          <hr />
          <h5>CMND/CCCD</h5>
          <Row>
            <Col lg="6">
              <CustomTextInput
                label={"Số CCCD/CMND"}
                placeholder="Nhập thông tin"
                type="number"
                value={number}
                min={0}
                onChange={(e) => onChangeNumberIndentity(e)}
              />
            </Col>
          </Row>
          <Row>
            <Col lg="6">
              <CustomTextInput
                label={"Nơi cấp"}
                placeholder="Nhập thông tin"
                type="text"
                value={issued}
                onChange={(e) => setIssued(e.target.value)}
              />
            </Col>
            <Col lg="6">
              <CustomTextInput
                label={"Ngày cấp"}
                placeholder="Nhập thông tin"
                type="date"
                value={moment(issuedDay).format("YYYY-MM-DD")}
                onChange={(e) => setIssuedDay(e.target.value)}
              />
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
