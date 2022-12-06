import { useEffect, useState } from "react";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import CustomTextInput from "../../../../../../../components/CustomTextInput/customTextInput";
import "./index.scss";

const Information = ({ data }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("other");
  const [birthday, setBirthday] = useState("");
  const [resident, setResident] = useState("");
  const [staying, setStaying] = useState("");
  const [ethnic, setEthnic] = useState("");
  const [religion, setReligion] = useState("");
  const [level, setLevel] = useState("");
  const [number, setNumber] = useState("");
  const [issued, setIssued] = useState("");
  const [issuedDay, setIssuedDay] = useState("");

  useEffect(() => {
    setName(data?.name);
    setGender(data?.gender);
  }, [data]);

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
                placeholder="Nhập thông tin"
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
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
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
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
                onChange={(e) => setIssued(e.target.value)}
              />
            </Col>
          </Row>
        </div>
        <Button className="btn-update">Cập nhật</Button>
      </Form>
    </>
  );
};

export default Information;
