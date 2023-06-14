import { useEffect, useState } from "react";
import "./styles.scss";
import { Button, Col, Input, InputNumber, Radio, Row, Select } from "antd";
import { DATA_OPERTATOR } from "../../../../../../api/fakeData";
import { CloseCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import InputCustom from "../../../../../../components/textInputCustom";
import { getDistrictApi } from "../../../../../../api/file";

const AddRewardCollaborator = () => {
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [dataCity, setDataCity] = useState([]);
  const cityOptions = [];
  const [condition, setCondition] = useState([
    {
      type_condition: "and",
      condition_level_1: [
        {
          type_condition: "and",
          money: 0,
          condition_level_2: [
            {
              type_condition: "and",
              condition: [
                {
                  kind: "",
                  operator: "",
                  value: "",
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

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

  const changeTypeCondition = (value) => {
    const newArr = [...condition];
    condition[0].type_condition = value;
    setCondition(newArr);
  };
  //level 1
  const onAddConditionLevelOne = () => {
    const newArr = [...condition];
    condition[0].condition_level_1.push({
      type_condition: "and",
      money: 0,
      condition_level_2: [
        {
          type_condition: "and",
          condition: [
            {
              kind: "",
              operator: "",
              value: "",
            },
          ],
        },
      ],
    });
    setCondition(newArr);
  };

  const onDeleteConditionLevelOne = (index) => {
    condition[0].condition_level_1.splice(index, 1);
    setCondition([...condition]);
  };

  const changeTypeConditionLevelOne = (value, index) => {
    const newArr = [...condition];
    condition[0].condition_level_1[index].type_condition = value;
    setCondition(newArr);
  };
  const onChangeMoneyConditionLevelOne = (value, index) => {
    const newArr = [...condition];
    condition[0].condition_level_1[index].money = value;
    setCondition(newArr);
  };

  //level 2
  const changeTypeConditionLevelTwo = (value, index, indexTwo) => {
    const newArr = [...condition];
    condition[0].condition_level_1[index].condition_level_2[
      indexTwo
    ].type_condition = value;
    setCondition(newArr);
  };

  const onAddCondition = (index, indexTwo) => {
    const newArr = [...condition];
    condition[0].condition_level_1[index].condition_level_2[
      indexTwo
    ].condition.push({
      kind: "",
      operator: "",
      value: "",
    });
    setCondition(newArr);
  };
  const onDeleteCondition = (index, indexTwo, indexCon) => {
    condition[0].condition_level_1[index].condition_level_2[
      indexTwo
    ].condition.splice(indexCon, 1);
    setCondition([...condition]);
  };

  return (
    <div>
      <a className="title-add">Thêm mới điều kiện thưởng CTV</a>
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
      <div>
        {condition?.map((item, index) => {
          return (
            <div className="div-body-condition" key={index}>
              <Radio.Group
                defaultValue={item?.type_condition}
                buttonStyle="solid"
                onChange={(e) => changeTypeCondition(e.target.value)}
              >
                <Radio.Button value="and">And</Radio.Button>
                <Radio.Button value="or">Or</Radio.Button>
              </Radio.Group>
              {item?.condition_level_1?.map((conditionOne, indexOne) => {
                return (
                  <>
                    <div className="div-condition-level-one" key={indexOne}>
                      <Radio.Group
                        defaultValue={conditionOne?.type_condition}
                        buttonStyle="solid"
                        size="small"
                        onChange={(e) =>
                          changeTypeConditionLevelOne(e.target.value, indexOne)
                        }
                      >
                        <Radio.Button value="and">And</Radio.Button>
                        <Radio.Button value="or">Or</Radio.Button>
                      </Radio.Group>
                      <div className="div-money">
                        <a className="label-money">Nhập số tiền</a>
                        <InputNumber
                          formatter={(value) =>
                            `${value}  đ`.replace(
                              /(\d)(?=(\d\d\d)+(?!\d))/g,
                              "$1,"
                            )
                          }
                          min={0}
                          value={conditionOne?.money}
                          onChange={(e) =>
                            onChangeMoneyConditionLevelOne(e, indexOne)
                          }
                          style={{ width: "20%" }}
                        />
                      </div>
                      {conditionOne?.condition_level_2?.map(
                        (conditionTwo, indexTwo) => {
                          return (
                            <div
                              className="div-condition-level-two"
                              key={indexTwo}
                            >
                              <Radio.Group
                                defaultValue={conditionTwo?.type_condition}
                                buttonStyle="solid"
                                size="small"
                                onChange={(e) =>
                                  changeTypeConditionLevelTwo(
                                    e.target.value,
                                    indexOne,
                                    indexTwo
                                  )
                                }
                              >
                                <Radio.Button value="and">And</Radio.Button>
                                <Radio.Button value="or">Or</Radio.Button>
                              </Radio.Group>
                              {conditionTwo?.condition?.map(
                                (condition, indexCon) => {
                                  return (
                                    <>
                                      {indexCon !== 0 && (
                                        <div>
                                          <a>
                                            {conditionTwo?.type_condition ===
                                            "and"
                                              ? "Và"
                                              : "Hoặc"}
                                          </a>
                                        </div>
                                      )}
                                      <div
                                        key={indexCon}
                                        className="div-codition"
                                      >
                                        <InputCustom
                                          title="Loại"
                                          select={true}
                                          style={{ width: 100 }}
                                          options={DATA_KIND}
                                        />
                                        <InputCustom
                                          title="So sánh"
                                          select={true}
                                          style={{ width: 100, marginLeft: 5 }}
                                          options={DATA_OPERTATOR}
                                        />
                                        <InputCustom
                                          title="Giá trị"
                                          style={{ width: 100, marginLeft: 5 }}
                                          type="number"
                                        />

                                        {indexCon !== 0 && (
                                          <div
                                            onClick={() =>
                                              onDeleteCondition(
                                                indexOne,
                                                indexTwo,
                                                indexCon
                                              )
                                            }
                                            className="delete-codition"
                                          >
                                            <DeleteOutlined />
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  );
                                }
                              )}
                              <Button
                                onClick={() =>
                                  onAddCondition(indexOne, indexTwo)
                                }
                                className="btn-add-condition"
                              >
                                <a className="text-btn">Thêm</a>
                              </Button>
                            </div>
                          );
                        }
                      )}
                    </div>
                    {indexOne !== 0 && (
                      <Button
                        className="btn-delete-condition-level-one"
                        onClick={() => onDeleteConditionLevelOne(indexOne)}
                      >
                        <a className="text-btn ">Xoá</a>
                      </Button>
                    )}
                  </>
                );
              })}

              <Button
                onClick={onAddConditionLevelOne}
                className="btn-add-condition-level-one"
              >
                <a className="text-add">Thêm</a>
              </Button>
            </div>
          );
        })}
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
