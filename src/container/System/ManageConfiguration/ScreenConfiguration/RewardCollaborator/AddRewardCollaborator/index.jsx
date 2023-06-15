import { useEffect, useState } from "react";
import "./styles.scss";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
} from "antd";
import { DATA_OPERTATOR } from "../../../../../../api/fakeData";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import InputCustom from "../../../../../../components/textInputCustom";
import { getDistrictApi } from "../../../../../../api/file";
import moment from "moment";
import { useSelector } from "react-redux";
import { getService } from "../../../../../../redux/selectors/service";

const AddRewardCollaborator = () => {
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [isLimitDate, setIsLimitDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isServiceApply, setIsServiceApply] = useState(false);
  const [serviceApply, setServiceApply] = useState([]);
  const [isTotalReceived, setIsTotalReceived] = useState(false);
  const [totalReceived, setTotalReceived] = useState(0);
  const [dataCity, setDataCity] = useState([]);
  const [codeCity, setCodeCity] = useState([]);
  const cityOptions = [];
  const serviceOptions = [];
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
  const service = useSelector(getService);

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

  service?.map((item) => {
    serviceOptions.push({
      value: item?._id,
      label: item?.title?.vi,
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

  const onAddConditionLevelTwo = (index) => {
    const newArr = [...condition];
    condition[0].condition_level_1[index].condition_level_2.push({
      type_condition: "and",
      condition: [
        {
          kind: "",
          operator: "",
          value: "",
        },
      ],
    });
    setCondition(newArr);
  };

  const onDeleteConditionLevelTwo = (index, indexTwo) => {
    condition[0].condition_level_1[index].condition_level_2.splice(indexTwo, 1);
    setCondition([...condition]);
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

  const onChangeConditionKind = (value, index, indexTwo, indexCon) => {
    const newArr = [...condition];
    condition[0].condition_level_1[index].condition_level_2[indexTwo].condition[
      indexCon
    ].kind = value;
    setCondition(newArr);
  };

  const onChangeConditionOperator = (value, index, indexTwo, indexCon) => {
    const newArr = [...condition];
    condition[0].condition_level_1[index].condition_level_2[indexTwo].condition[
      indexCon
    ].operator = value;
    setCondition(newArr);
  };

  const onChangeConditionValue = (value, index, indexTwo, indexCon) => {
    const newArr = [...condition];
    condition[0].condition_level_1[index].condition_level_2[indexTwo].condition[
      indexCon
    ].value = value;
    setCondition(newArr);
  };

  return (
    <div>
      <a className="title-add">Thêm mới điều kiện thưởng CTV</a>
      <div className="mt-3">
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
            <div className="div-check-date">
              <Checkbox
                checked={isLimitDate}
                onChange={(e) => setIsLimitDate(e.target.checked)}
              >
                Giới hạn ngày thưởng
              </Checkbox>
              {isLimitDate && (
                <>
                  <a className="label-input-date">Ngày bắt đầu</a>
                  <DatePicker
                    style={{ width: "90%" }}
                    onChange={(date, dateString) =>
                      setStartDate(moment(dateString).toISOString())
                    }
                  />
                  <a className="label-input-date">Ngày kết thúc</a>
                  <DatePicker
                    style={{ width: "90%" }}
                    onChange={(date, dateString) =>
                      setEndDate(moment(dateString).toISOString())
                    }
                  />
                </>
              )}
            </div>
          </Col>
          <Col span={8}>
            <InputCustom
              title="Tỉnh/thành phố"
              style={{ width: "90%", marginTop: 5 }}
              select={true}
              options={cityOptions}
              onChange={(e) => setCodeCity(e)}
              mode="multiple"
            />
          </Col>
        </Row>
        <Row className="mt-3">
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
            <div className="div-service-total">
              <Checkbox
                checked={isServiceApply}
                onChange={(e) => setIsServiceApply(e.target.checked)}
              >
                Dịch vụ áp dụng
              </Checkbox>
              {isServiceApply && (
                <InputCustom
                  title="Loại dịch vụ"
                  select={true}
                  options={serviceOptions}
                  mode="multiple"
                  style={{ width: "90%" }}
                  onChange={(e) => setServiceApply(e)}
                />
              )}
              <Checkbox
                style={{ marginTop: 20 }}
                checked={isTotalReceived}
                onChange={(e) => setIsTotalReceived(e.target.checked)}
              >
                Số lượng phần thưởng
              </Checkbox>
              {isTotalReceived && (
                <InputCustom
                  placeholder="Nhập số lượng thưởng"
                  type="number"
                  value={totalReceived}
                  style={{ width: "90%" }}
                  onChange={(e) => setTotalReceived(e.target.value)}
                />
              )}
            </div>
          </Col>
        </Row>
      </div>
      <div>
        {condition?.map((item, index) => {
          return (
            <div className="div-body-condition" key={index}>
              {item?.condition_level_1?.map((conditionOne, indexOne) => {
                return (
                  <>
                    {indexOne !== 0 && (
                      <div className="div-or-and-one">
                        <a className="text-and-or">
                          {item?.type_condition === "and" ? "And" : "Or"}
                        </a>
                      </div>
                    )}
                    <div className="div-condition-level-one" key={indexOne}>
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
                            <>
                              {indexTwo !== 0 && (
                                <div className="div-or-and-two">
                                  <a className="text-and-or">
                                    {conditionOne?.type_condition === "and"
                                      ? "And"
                                      : "Or"}
                                  </a>
                                </div>
                              )}
                              <div
                                className="div-condition-level-two"
                                key={indexTwo}
                              >
                                {conditionTwo?.condition?.map(
                                  (condition, indexCon) => {
                                    return (
                                      <>
                                        {indexCon !== 0 && (
                                          <div className="div-or-and-con">
                                            <a className="text-and-or">
                                              {conditionTwo?.type_condition ===
                                              "and"
                                                ? "And"
                                                : "Or"}
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
                                            style={{ width: 225 }}
                                            options={DATA_KIND}
                                            value={condition?.kind}
                                            onChange={(e) =>
                                              onChangeConditionKind(
                                                e,
                                                indexOne,
                                                indexTwo,
                                                indexCon
                                              )
                                            }
                                          />
                                          <InputCustom
                                            title="So sánh"
                                            select={true}
                                            style={{
                                              width: 50,
                                              marginLeft: 5,
                                            }}
                                            options={DATA_OPERTATOR}
                                            value={condition?.operator}
                                            onChange={(e) =>
                                              onChangeConditionOperator(
                                                e,
                                                indexOne,
                                                indexTwo,
                                                indexCon
                                              )
                                            }
                                          />
                                          <InputCustom
                                            title="Giá trị"
                                            style={{
                                              width: 100,
                                              marginLeft: 5,
                                            }}
                                            type="number"
                                            value={condition?.value}
                                            onChange={(e) =>
                                              onChangeConditionValue(
                                                e.target.value,
                                                indexOne,
                                                indexTwo,
                                                indexCon
                                              )
                                            }
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
                                              <i class="uil uil-trash"></i>
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    );
                                  }
                                )}
                                <div className="div-add">
                                  <Button
                                    onClick={() =>
                                      onAddCondition(indexOne, indexTwo)
                                    }
                                    className="btn-add-condition"
                                  >
                                    <i class="uil uil-plus"></i>
                                  </Button>
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
                                </div>
                              </div>
                              {indexTwo !== 0 && (
                                <Button
                                  onClick={() =>
                                    onDeleteConditionLevelTwo(
                                      indexOne,
                                      indexTwo
                                    )
                                  }
                                  className="btn-delete-codition-level-two"
                                >
                                  <i class="uil uil-trash"></i>
                                </Button>
                              )}
                            </>
                          );
                        }
                      )}
                      <div className="div-add">
                        <Button
                          className="btn-add-codition-level-two"
                          onClick={() => onAddConditionLevelTwo(indexOne)}
                        >
                          <a className="text-add">Thêm</a>
                        </Button>
                        <Radio.Group
                          defaultValue={conditionOne?.type_condition}
                          buttonStyle="solid"
                          size="small"
                          onChange={(e) =>
                            changeTypeConditionLevelOne(
                              e.target.value,
                              indexOne
                            )
                          }
                        >
                          <Radio.Button value="and">And</Radio.Button>
                          <Radio.Button value="or">Or</Radio.Button>
                        </Radio.Group>
                      </div>
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

              <div className="div-add">
                <Button
                  onClick={onAddConditionLevelOne}
                  className="btn-add-condition-level-one"
                >
                  <a className="text-add">Thêm</a>
                </Button>
                <Radio.Group
                  defaultValue={item?.type_condition}
                  buttonStyle="solid"
                  size="small"
                  onChange={(e) => changeTypeCondition(e.target.value)}
                >
                  <Radio.Button value="and">And</Radio.Button>
                  <Radio.Button value="or">Or</Radio.Button>
                </Radio.Group>
              </div>
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
    label: "Tổng số ca làm",
  },
  {
    value: "total_hours",
    label: "Tổng số giờ làm",
  },
  {
    value: "avg_order_star",
    label: "Số sao trung bình đơn hàng",
  },
  {
    value: "avg_collaborator_star",
    label: "Số sao trung bình CTV",
  },
  {
    value: "order_star",
    label: "Số sao đơn hàng",
  },
];
