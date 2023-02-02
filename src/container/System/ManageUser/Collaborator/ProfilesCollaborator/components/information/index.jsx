import { DatePicker } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import {
  getCollaboratorsById,
  updateInformationCollaboratorApi,
} from "../../../../../../../api/collaborator";
import CustomTextInput from "../../../../../../../components/CustomTextInput/customTextInput";
import { errorNotify } from "../../../../../../../helper/toast";
import { loadingAction } from "../../../../../../../redux/actions/loading";
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
    setBirthday(birthdayD);
    setResident(data?.permanent_address);
    setStaying(data?.temporary_address);
    setEthnic(data?.folk);
    setReligion(data?.religion);
    setLevel(data?.edu_level);
    setNumber(data?.identity_number);
    setIssued(data?.identity_place);
    setIssuedDay(identityD);
    setImgUrl(data?.avatar);
    setPhone(data?.phone);
  }, [data]);

  const onChangeNumberIndentity = (value) => {
    if (value.target.value <= 999999999990) {
      setNumber(value.target.value);
    }
  };

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
    })
      .then((res) => {
        window.location.reload();
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
              <Label>Giới tính</Label>
              <Input
                className="select-gender"
                placeholder="Chọn giới tính"
                type="select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <>
                  <option value={"other"}>Khác</option>
                  <option value={"male"}>Nam</option>
                  <option value={"female"}>Nữ</option>
                </>
              </Input>
            </Col>
          </Row>
          <Row>
            <Col lg="6">
              <CustomTextInput
                label={"Ngày, tháng, năm sinh"}
                placeholder="Chọn ngày tháng sinh"
                type="date"
                value={birthday}
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
              <CustomTextInput
                label={"Trình độ văn hoá"}
                className="select"
                type="select"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                body={
                  <>
                    <option>Chọn trình độ văn hoá</option>
                    <option value={"5/12"}>5/12</option>
                    <option value={"9/12"}>9/12</option>
                    <option value={"12/12"}>12/12</option>
                    <option value={"Cao đẳng"}>Cao đẳng</option>
                    <option value={"Đại học"}>Đại học</option>
                    <option value={"Thạc sĩ"}>Thạc sĩ</option>
                    <option value={"Tiến sĩ"}>Tiến sĩ</option>
                  </>
                }
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
                value={issuedDay}
                onChange={(e) => setIssuedDay(e.target.value)}
              />
            </Col>
          </Row>
        </div>
        <Button className="btn-update" onClick={updateInformation}>
          Cập nhật
        </Button>
      </Form>
    </>
  );
};

export default Information;
