import { Drawer, Select, DatePicker } from "antd";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Col, Form, Input, Label, Modal, Row } from "reactstrap";
import { getDistrictApi } from "../../api/file";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./editService.scss";
const { RangePicker } = DatePicker;

const EditService = ({ data }) => {
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [priceArea, setPriceArea] = useState("");
  const [dataDistrict, setDataDistrict] = useState([]);
  const [district, setDistrict] = useState([]);

  const options = [];
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    setTitleVN(data?.title?.vi);
    setTitleEN(data?.title?.en);
    setDescriptionVN(data?.description?.vi);
    setDescriptionEN(data?.description?.en);

    getDistrictApi()
      .then((res) => {
        setDataDistrict(res?.aministrative_division[0]?.districts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data]);

  dataDistrict.map((item, index) => {
    options.push({
      label: item?.name,
      value: item?.code,
    });
  });

  const handleChange = (value) => {
    setDistrict(value);
  };

  return (
    <>
      <a onClick={showDrawer}>Chỉnh sửa</a>
      <Drawer
        title="Chỉnh sửa Service"
        width={1000}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <div className="modal-body">
          <Form>
            <Row>
              <Col lg="6">
                <h5>Tiêu đề</h5>
                <CustomTextInput
                  label={"Tiếng Việt"}
                  id="exampleTitle"
                  name="title"
                  placeholder="Vui lòng nhập tiêu đề Tiếng Việt"
                  type="text"
                  value={titleVN}
                  onChange={(e) => setTitleVN(e.target.value)}
                />
                <CustomTextInput
                  label={"Tiếng Anh"}
                  id="exampleTitle"
                  name="title"
                  placeholder="Vui lòng nhập tiêu đề Tiếng Anh"
                  type="text"
                  value={titleEN}
                  onChange={(e) => setTitleEN(e.target.value)}
                />
              </Col>

              <Col lg="6">
                <h5>Chi tiết</h5>
                <CustomTextInput
                  label={"Tiếng Việt"}
                  id="exampleTitle"
                  name="title"
                  placeholder="Vui lòng nhập chi tiết Tiếng Việt"
                  type="text"
                  value={descriptionVN}
                  onChange={(e) => setDescriptionVN(e.target.value)}
                />
                <CustomTextInput
                  label={"Tiếng Anh"}
                  id="exampleTitle"
                  name="title"
                  placeholder="Vui lòng nhập chi tiết Tiếng Anh"
                  type="text"
                  value={descriptionEN}
                  onChange={(e) => setDescriptionEN(e.target.value)}
                />
              </Col>
            </Row>

            <Row>
              <Col lg="6">
                <h5>Theo Khu vực</h5>
                <h6 className="mt-2">Khu vực</h6>
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Vui lòng chọn quận"
                  onChange={handleChange}
                  options={options}
                />

                <CustomTextInput
                  label={"Giá tiền"}
                  id="exampleTitle"
                  name="title"
                  placeholder="Giá tiền"
                  type="text"
                  value={priceArea}
                  onChange={(e) => setPriceArea(e.target.value)}
                />
              </Col>
              <Col lg="6">
                <h5>Theo ngày lễ</h5>
                <h6 className="mt-2">Ngày</h6>
                <RangePicker showTime />
                <CustomTextInput
                  label={"Giá tiền"}
                  id="exampleTitle"
                  name="title"
                  placeholder="Giá tiền"
                  type="text"
                />
              </Col>
            </Row>
          </Form>
        </div>
      </Drawer>
    </>
  );
};

export default memo(EditService);
