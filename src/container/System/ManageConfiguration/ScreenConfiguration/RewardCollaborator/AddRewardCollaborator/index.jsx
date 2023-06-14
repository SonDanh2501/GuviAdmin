import { useEffect, useState } from "react";
import "./styles.scss";
import { Button, Col, Input, InputNumber, Radio, Row, Select } from "antd";
import { DATA_OPERTATOR } from "../../../../../../api/fakeData";
import { CloseCircleOutlined } from "@ant-design/icons";
import InputCustom from "../../../../../../components/textInputCustom";
import { getDistrictApi } from "../../../../../../api/file";

const AddRewardCollaborator = () => {
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [dataCity, setDataCity] = useState([]);

  const cityOptions = [];

  useEffect(() => {
    getDistrictApi()
      .then((res) => {
        setDataCity(res?.aministrative_division);
      })
      .catch((err) => {});
  }, []);

  dataCity?.map((item) => {
    cityOptions.push({
      value: item?.code,
      label: item?.name,
    });
  });

  return (
    <div>
      <a className="title-add">Thêm mới điều kiện thưởng CTV</a>

      <div>
        <Row>
          <Col span={8}>
            <InputCustom
              title="Tiêu đề"
              placeholder="Vui lòng nhập nội dung Tiếng Việt"
              style={{ width: "90%" }}
              onChange={(e) => setTitleVN(e.target.value)}
            />
            <InputCustom
              placeholder="Vui lòng nhập nội dung Tiếng Anh"
              style={{ width: "90%", marginTop: 5 }}
              onChange={(e) => setTitleEN(e.target.value)}
            />
          </Col>
          <Col span={8}>
            <InputCustom
              title="Mô tả"
              placeholder="Vui lòng nhập nội dung Tiếng Việt"
              style={{ width: "90%" }}
              textArea={true}
              onChange={(e) => setDescriptionVN(e.target.value)}
            />
            <InputCustom
              placeholder="Vui lòng nhập nội dung Tiếng Anh"
              style={{ width: "90%", marginTop: 5 }}
              textArea={true}
              onChange={(e) => setDescriptionEN(e.target.value)}
            />
          </Col>
          <Col span={8}>
            <InputCustom
              title="Tỉnh/thành phố"
              style={{ width: "90%", marginTop: 5 }}
              select={true}
              options={cityOptions}
              onChange={(e) => console.log(e)}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AddRewardCollaborator;

const DATA_KIND = [
  {
    value: "total_order",
    label: "Số ca",
  },
  {
    value: "total_hours",
    label: "Số giờ",
  },
];
