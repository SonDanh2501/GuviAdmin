import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  InputNumber,
  Radio,
  Row,
} from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createRewardCollaboratorApi } from "../../../../../../api/configuration";
import { DATA_OPERTATOR } from "../../../../../../api/fakeData";
import { getDistrictApi } from "../../../../../../api/file";
import LoadingPagination from "../../../../../../components/paginationLoading";
import InputCustom from "../../../../../../components/textInputCustom";
import { errorNotify } from "../../../../../../helper/toast";
import { getService } from "../../../../../../redux/selectors/service";
import "./styles.scss";

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
  const [isCity, setIsCity] = useState(false);
  const [dataCity, setDataCity] = useState([]);
  const [codeCity, setCodeCity] = useState([]);
  const cityOptions = [];
  const serviceOptions = [];
  const [isLoading, setIsLoading] = useState(false);
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
  const navigate = useNavigate();

  useEffect(() => {
    getDistrictApi()
      .then((res) => {
        setDataCity(res?.aministrative_division);
      })
      .catch((err) => {});
  }, []);

  dataCity?.map((item) => {
    return cityOptions.push({
      value: item?.code,
      label: item?.name,
    });
  });

  service?.map((item) => {
    return serviceOptions.push({
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

  const onCreateReward = useCallback(() => {
    setIsLoading(true);
    createRewardCollaboratorApi({
      title: {
        vi: titleVN,
        en: titleEN,
      },
      description: {
        vi: descriptionVN,
        en: descriptionEN,
      },
      is_limit_date: isLimitDate,
      start_date: isLimitDate ? startDate : null,
      end_date: isLimitDate ? endDate : null,
      total_received: 0,
      is_limit_total_received: isTotalReceived,
      limit_total_received: totalReceived,
      is_type_collaborator: false,
      type_collaborator: "collaborator",
      is_city: isCity,
      city: codeCity,
      timezone: "Asia/Ho_Chi_Minh",
      condition: condition[0],
      type_wallet: "gift_wallet",
      is_service_apply: isServiceApply,
      service_apply: serviceApply,
      is_auto_verify: false,
    })
      .then((res) => {
        setIsLoading(false);
        navigate(-1);
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  }, [
    titleVN,
    titleEN,
    descriptionVN,
    descriptionEN,
    isLimitDate,
    startDate,
    endDate,
    isTotalReceived,
    totalReceived,
    isCity,
    codeCity,
    condition,
    isServiceApply,
    serviceApply,
    navigate,
  ]);

  return (
    <div>
      <p className="title-add">Thêm mới điều kiện thưởng CTV</p>
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
                  <p className="label-input-date">Ngày bắt đầu</p>
                  <DatePicker
                    style={{ width: "90%" }}
                    onChange={(date, dateString) =>
                      setStartDate(moment(dateString).toISOString())
                    }
                  />
                  <p className="label-input-date">Ngày kết thúc</p>
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
            <Checkbox
              checked={isCity}
              onChange={(e) => setIsCity(e.target.checked)}
            >
              Tỉnh/thành phố
            </Checkbox>
            {isCity && (
              <InputCustom
                style={{ width: "90%", marginTop: 5 }}
                select={true}
                options={cityOptions}
                onChange={(e) => setCodeCity(e)}
                mode="multiple"
              />
            )}
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
                        <p className="text-and-or">
                          {item?.type_condition === "and" ? "And" : "Or"}
                        </p>
                      </div>
                    )}
                    <div className="div-condition-level-one" key={indexOne}>
                      <div className="div-money">
                        <p className="label-money">Nhập số tiền</p>
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
                                  <p className="text-and-or">
                                    {conditionOne?.type_condition === "and"
                                      ? "And"
                                      : "Or"}
                                  </p>
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
                                            <p className="text-and-or">
                                              {conditionTwo?.type_condition ===
                                              "and"
                                                ? "And"
                                                : "Or"}
                                            </p>
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
                                              width: 150,
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
                                              width: 150,
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
                                              <i className="uil uil-trash"></i>
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
                                    <i className="uil uil-plus"></i>
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
                                  <i className="uil uil-trash"></i>
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
                          <p className="text-add">Thêm</p>
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
                        <p className="text-btn">Xoá</p>
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
                  <p className="text-add">Thêm</p>
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

        <Button
          className="btn-create-condition-reward"
          onClick={onCreateReward}
        >
          Tạo điều kiện thưởng
        </Button>
      </div>

      {isLoading && <LoadingPagination />}
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
  {
    value: "total_late_start",
    label: "Số lần bắt đầu ca trễ",
  },
];
