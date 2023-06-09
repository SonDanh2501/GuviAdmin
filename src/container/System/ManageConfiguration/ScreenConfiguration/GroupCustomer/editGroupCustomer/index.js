import { Button, DatePicker, Drawer, Input, Radio, Select } from "antd";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomButton from "../../../../../../components/customButton/customButton";
import CustomTextInput from "../../../../../../components/CustomTextInput/customTextInput";
import "./index.scss";
import { set } from "lodash";
import dayjs from "dayjs";
import {
  DATA_GENDER,
  DATA_KIND,
  DATA_OPERTATOR,
  DATA_OPERTATOR_GENDER,
  MONTH,
} from "../../../../../../api/fakeData";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import {
  EditGroupCustomerApi,
  createGroupCustomerApi,
  editGroupCustomerApi,
  getDetailsGroupCustomerApi,
} from "../../../../../../api/configuration";
import { errorNotify } from "../../../../../../helper/toast";
import LoadingPagination from "../../../../../../components/paginationLoading";
const { TextArea } = Input;

const EditGroupCustomer = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [nameGroup, setNameGroup] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dateFormat = "YYYY-MM-DD";
  const [conditionLevel, setConditionLevel] = useState([
    {
      type_condition: "and",
      condition_level_1: [
        {
          type_condition: "and",
          condition: [{ kind: "", operator: "", value: "" }],
        },
      ],
    },
  ]);

  const [conditionLevelOut, setConditionLevelOut] = useState([
    {
      type_condition: "and",
      condition_level_1: [
        {
          type_condition: "and",
          condition: [{ kind: "", operator: "", value: "" }],
        },
      ],
    },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    getDetailsGroupCustomerApi(id)
      .then((res) => {
        const newArray = [...conditionLevel];
        const newOutArray = [...conditionLevelOut];
        setNameGroup(res?.name);
        setDescription(res?.description);
        conditionLevel[0].type_condition = res?.condition_in?.type_condition;
        conditionLevel[0].condition_level_1 =
          res?.condition_in?.condition_level_1;
        conditionLevelOut[0].type_condition =
          res?.condition_out?.type_condition;
        conditionLevelOut[0].condition_level_1 =
          res?.condition_out?.condition_level_1?.length > 0
            ? res?.condition_out?.condition_level_1
            : [
                {
                  type_condition: "and",
                  condition: [{ kind: "", operator: "", value: "" }],
                },
              ];
        setConditionLevel(newArray);
        setConditionLevelOut(newOutArray);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, [id]);

  const addConditionLevel = () => {
    const newArray = [...conditionLevel];

    conditionLevel[0].condition_level_1.push({
      type_condition: "and",
      condition: [{ kind: "", operator: "", value: "" }],
    });
    setConditionLevel(newArray);
  };

  const addConditionLevelOut = () => {
    const newArray = [...conditionLevelOut];

    conditionLevelOut[0].condition_level_1.push({
      type_condition: "and",
      condition: [{ kind: "", operator: "", value: "" }],
    });
    setConditionLevelOut(newArray);
  };

  const deleteConditionLevelIn = (index) => {
    const arr = conditionLevel[0].condition_level_1.splice(index, 1);
    setConditionLevel([...conditionLevel]);
  };

  const deleteConditionLevelOut = (index) => {
    const arr = conditionLevelOut[0].condition_level_1.splice(index, 1);
    setConditionLevelOut([...conditionLevelOut]);
  };

  const onChangeTabValueIn = useCallback(
    (index, value) => {
      const newArray = [...conditionLevel];
      conditionLevel[index].type_condition = value;
      setConditionLevel(newArray);
    },
    [conditionLevel]
  );

  const onChangeTabValueOut = useCallback(
    (index, value) => {
      const newArray = [...conditionLevelOut];
      conditionLevelOut[index].type_condition = value;
      setConditionLevelOut(newArray);
    },
    [conditionLevelOut]
  );

  const onChangeTabCompareIn = useCallback(
    (index, value) => {
      const newArray = [...conditionLevel];
      conditionLevel[0].condition_level_1[index].type_condition = value;
      setConditionLevel(newArray);
    },
    [conditionLevel]
  );

  const onChangeTabCompareOut = useCallback(
    (index, value) => {
      const newArray = [...conditionLevelOut];
      conditionLevelOut[0].condition_level_1[index].type_condition = value;
      setConditionLevelOut(newArray);
    },
    [conditionLevelOut]
  );

  const addConditionIn = (index) => {
    const newArray = [...conditionLevel];
    conditionLevel[0].condition_level_1[index].condition = [
      ...conditionLevel[0].condition_level_1[index].condition,
      { kind: "", operator: "", value: "" },
    ];
    setConditionLevel(newArray);
  };

  const addConditionOut = (index) => {
    const newArray = [...conditionLevelOut];
    conditionLevelOut[0].condition_level_1[index].condition = [
      ...conditionLevelOut[0].condition_level_1[index].condition,
      { kind: "", operator: "", value: "" },
    ];
    setConditionLevelOut(newArray);
  };

  const deleteConditionIn = (ind, index) => {
    const newArray = [...conditionLevel];
    conditionLevel[0].condition_level_1[index].condition.splice(ind, 1);
    setConditionLevel(newArray);
  };

  const deleteConditionOut = (ind, index) => {
    const newArray = [...conditionLevelOut];
    conditionLevelOut[0].condition_level_1[index].condition.splice(ind, 1);
    setConditionLevelOut(newArray);
  };

  const onChangeKindIn = (value, ind, index) => {
    const newArray = [...conditionLevel];
    conditionLevel[0].condition_level_1[index].condition[ind].kind = value;
    setConditionLevel(newArray);
  };

  const onChangeKindOut = (value, ind, index) => {
    const newArray = [...conditionLevelOut];
    conditionLevelOut[0].condition_level_1[index].condition[ind].kind = value;
    setConditionLevelOut(newArray);
  };

  const onChangeOperatorIn = (value, ind, index) => {
    const newArray = [...conditionLevel];
    conditionLevel[0].condition_level_1[index].condition[ind].operator = value;
    setConditionLevel(newArray);
  };

  const onChangeOperatorOut = (value, ind, index) => {
    const newArray = [...conditionLevelOut];
    conditionLevelOut[0].condition_level_1[index].condition[ind].operator =
      value;
    setConditionLevelOut(newArray);
  };

  const onChangeValueIn = (value, ind, index) => {
    const newArray = [...conditionLevel];
    conditionLevel[0].condition_level_1[index].condition[ind].value = value;
    setConditionLevel(newArray);
  };

  const onChangeValueOut = (value, ind, index) => {
    const newArray = [...conditionLevelOut];
    conditionLevelOut[0].condition_level_1[index].condition[ind].value = value;
    setConditionLevelOut(newArray);
  };

  const onEditGroupCustomer = useCallback(() => {
    setIsLoading(true);
    editGroupCustomerApi(id, {
      name: nameGroup,
      description: description,
      condition_in: conditionLevel[0],
      condition_out: conditionLevelOut[0],
    })
      .then((res) => {
        // window.location.reload();
        // navigate(-1);
        setIsLoading(false);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        setIsLoading(false);
      });
  }, [nameGroup, description, conditionLevel, conditionLevelOut, id]);

  return (
    <>
      <a className="title-condition">Thêm nhóm khách hàng</a>
      <div className="div-input-name">
        <a className="label-input">Nhập tên nhóm</a>
        <Input
          className="input-name-group-customer"
          type="text"
          value={nameGroup}
          onChange={(e) => setNameGroup(e.target.value)}
        />
        <a className="label-input">Mô tả</a>

        <TextArea
          rows={2}
          value={description}
          className="input-name-group-customer"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <a className="title-condition">Điều kiện vào</a>
        {conditionLevel?.map((item, index) => {
          return (
            <div className="condition-level mb-2" key={index}>
              <div className="div-tab-condition">
                {DATA_TAB.map((i, ind) => {
                  return (
                    <div
                      key={ind}
                      onClick={() => onChangeTabValueIn(index, i?.value)}
                      className={
                        i?.value === item?.type_condition
                          ? "div-tab-selected"
                          : "div-tab"
                      }
                    >
                      <a className="text-tab">{i?.title}</a>
                    </div>
                  );
                })}
              </div>
              {item?.condition_level_1?.map((condition, ix) => {
                return (
                  <>
                    <div className="div-body">
                      <div className="div-footer-body">
                        <div className="div-tab-condition">
                          {DATA_TAB.map((i, ind) => {
                            return (
                              <div
                                key={ind}
                                onClick={() =>
                                  onChangeTabCompareIn(ix, i?.value)
                                }
                                className={
                                  i?.value === condition?.type_condition
                                    ? "div-tab-selected"
                                    : "div-tab"
                                }
                              >
                                <a className="text-tab">{i?.title}</a>
                              </div>
                            );
                          })}
                        </div>
                        <Button
                          className="btn-add-group"
                          onClick={() => addConditionIn(ix)}
                        >
                          Thêm
                        </Button>
                      </div>
                      <div className="ml-3">
                        <div className="div-input">
                          {condition?.condition?.map((it, idx) => {
                            return (
                              <>
                                {idx !== 0 && (
                                  <div className="condition-btn">
                                    {condition?.type_condition === "and" ? (
                                      <a className="text-btn">Và</a>
                                    ) : (
                                      <a className="text-btn">Hoặc</a>
                                    )}
                                  </div>
                                )}
                                <div className="div-input-condition">
                                  <div className="div-select-kind">
                                    <a className="label-kind">Loại</a>
                                    <Select
                                      onChange={(value) =>
                                        onChangeKindIn(value, idx, ix)
                                      }
                                      value={it?.kind}
                                      className="select-kind"
                                      options={DATA_KIND}
                                    />
                                  </div>

                                  <div className="div-select-kind">
                                    <a className="label-kind">Phương thức</a>
                                    <Select
                                      onChange={(value) =>
                                        onChangeOperatorIn(value, idx, ix)
                                      }
                                      className="select-kind"
                                      value={it?.operator}
                                      options={
                                        condition?.condition[idx].kind ===
                                        "gender"
                                          ? DATA_OPERTATOR_GENDER
                                          : DATA_OPERTATOR
                                      }
                                    />
                                  </div>

                                  <div className="div-select-kind">
                                    <a className="label-kind">Giá trị</a>
                                    {condition?.condition[idx].kind ===
                                    "gender" ? (
                                      <Select
                                        className="select-kind"
                                        options={DATA_GENDER}
                                        value={it?.value}
                                        onChange={(value) =>
                                          onChangeValueIn(value, idx, ix)
                                        }
                                      />
                                    ) : condition?.condition[idx].kind ===
                                      "month_birthday" ? (
                                      <Select
                                        className="select-kind"
                                        options={MONTH}
                                        value={it?.value}
                                        onChange={(value) =>
                                          onChangeValueIn(value, idx, ix)
                                        }
                                      />
                                    ) : condition?.condition[idx].kind ===
                                      "date_create" ? (
                                      <DatePicker
                                        className="select-date"
                                        format={dateFormat}
                                        value={dayjs(
                                          it.value.slice(0, 11),
                                          dateFormat
                                        )}
                                        onChange={(date, dateString) =>
                                          onChangeValueIn(
                                            moment(
                                              moment(dateString).toISOString()
                                            )
                                              .add(7, "hours")
                                              .toISOString(),
                                            idx,
                                            ix
                                          )
                                        }
                                      />
                                    ) : (
                                      <Input
                                        className="input-value"
                                        type={"number"}
                                        value={it?.value}
                                        onChange={(e) =>
                                          onChangeValueIn(
                                            e.target.value,
                                            idx,
                                            ix
                                          )
                                        }
                                      />
                                    )}
                                  </div>

                                  {idx === 0 ? (
                                    <></>
                                  ) : (
                                    <i
                                      class="uil uil-times-circle"
                                      onClick={() => deleteConditionIn(idx, ix)}
                                    ></i>
                                  )}
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    {ix === 0 ? (
                      <></>
                    ) : (
                      <Button
                        className="mt-1 mb-2"
                        onClick={() => deleteConditionLevelIn(ix)}
                      >
                        Xoá
                      </Button>
                    )}
                  </>
                );
              })}

              <div>
                <Button className="mt-2" onClick={addConditionLevel}>
                  Thêm
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <a className="title-condition">Điều kiện ra</a>
        {conditionLevelOut?.map((item, index) => {
          return (
            <div className="condition-level mb-2" key={index}>
              <div className="div-tab-condition">
                {DATA_TAB.map((i, ind) => {
                  return (
                    <div
                      key={ind}
                      onClick={() => onChangeTabValueOut(index, i?.value)}
                      className={
                        i?.value === item?.type_condition
                          ? "div-tab-selected"
                          : "div-tab"
                      }
                    >
                      <a className="text-tab">{i?.title}</a>
                    </div>
                  );
                })}
              </div>
              {item?.condition_level_1?.map((condition, ix) => {
                return (
                  <>
                    <div className="div-body">
                      <div className="div-footer-body">
                        <div className="div-tab-condition">
                          {DATA_TAB.map((i, ind) => {
                            return (
                              <div
                                key={ind}
                                onClick={() =>
                                  onChangeTabCompareOut(ix, i?.value)
                                }
                                className={
                                  i?.value === condition?.type_condition
                                    ? "div-tab-selected"
                                    : "div-tab"
                                }
                              >
                                <a className="text-tab">{i?.title}</a>
                              </div>
                            );
                          })}
                        </div>
                        <Button
                          className="btn-add-group"
                          onClick={() => addConditionOut(ix)}
                        >
                          Thêm
                        </Button>
                      </div>
                      <div className="ml-3">
                        <div className="div-input">
                          {condition?.condition?.map((it, idx) => {
                            return (
                              <>
                                {idx !== 0 && (
                                  <div className="condition-btn">
                                    {condition?.type_condition === "and" ? (
                                      <a className="text-btn">Và</a>
                                    ) : (
                                      <a className="text-btn">Hoặc</a>
                                    )}
                                  </div>
                                )}
                                <div className="div-input-condition">
                                  <div className="div-select-kind">
                                    <a className="label-kind">Loại</a>
                                    <Select
                                      onChange={(value) =>
                                        onChangeKindOut(value, idx, ix)
                                      }
                                      value={it?.kind}
                                      className="select-kind"
                                      options={DATA_KIND}
                                    />
                                  </div>

                                  <div className="div-select-kind">
                                    <a className="label-kind">Phương thức</a>
                                    <Select
                                      onChange={(value) =>
                                        onChangeOperatorOut(value, idx, ix)
                                      }
                                      className="select-kind"
                                      value={it?.operator}
                                      options={
                                        condition?.condition[idx].kind ===
                                        "gender"
                                          ? DATA_OPERTATOR_GENDER
                                          : DATA_OPERTATOR
                                      }
                                    />
                                  </div>

                                  <div className="div-select-kind">
                                    <a className="label-kind">Giá trị</a>
                                    {condition?.condition[idx].kind ===
                                    "gender" ? (
                                      <Select
                                        className="select-kind"
                                        options={DATA_GENDER}
                                        value={it?.value}
                                        onChange={(value) =>
                                          onChangeValueOut(value, idx, ix)
                                        }
                                      />
                                    ) : condition?.condition[idx].kind ===
                                      "month_birthday" ? (
                                      <Select
                                        className="select-kind"
                                        options={MONTH}
                                        value={it?.value}
                                        onChange={(value) =>
                                          onChangeValueOut(value, idx, ix)
                                        }
                                      />
                                    ) : condition?.condition[idx].kind ===
                                      "date_create" ? (
                                      <DatePicker
                                        className="select-date"
                                        format={dateFormat}
                                        value={dayjs(
                                          it.value.slice(0, 11),
                                          dateFormat
                                        )}
                                        onChange={(date, dateString) =>
                                          onChangeValueOut(
                                            moment(
                                              moment(dateString).toISOString()
                                            )
                                              .add(7, "hours")
                                              .toISOString(),
                                            idx,
                                            ix
                                          )
                                        }
                                      />
                                    ) : (
                                      <Input
                                        className="input-value"
                                        type={"number"}
                                        value={it?.value}
                                        onChange={(e) =>
                                          onChangeValueOut(
                                            e.target.value,
                                            idx,
                                            ix
                                          )
                                        }
                                      />
                                    )}
                                  </div>

                                  {idx === 0 ? (
                                    <></>
                                  ) : (
                                    <i
                                      class="uil uil-times-circle"
                                      onClick={() =>
                                        deleteConditionOut(idx, ix)
                                      }
                                    ></i>
                                  )}
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    {ix === 0 ? (
                      <></>
                    ) : (
                      <Button
                        className="mt-1 mb-2"
                        onClick={() => deleteConditionLevelOut(ix)}
                      >
                        Xoá
                      </Button>
                    )}
                  </>
                );
              })}

              <div>
                <Button className="mt-2" onClick={addConditionLevelOut}>
                  Thêm
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        className="btn-create-group-customer"
        onClick={onEditGroupCustomer}
      >
        Sửa nhóm khách hàng
      </Button>

      {isLoading && <LoadingPagination />}
    </>
  );
};

export default memo(EditGroupCustomer);

const DATA_TAB = [
  {
    title: "Và",
    value: "and",
  },
  {
    title: "Hoặc",
    value: "or",
  },
];
