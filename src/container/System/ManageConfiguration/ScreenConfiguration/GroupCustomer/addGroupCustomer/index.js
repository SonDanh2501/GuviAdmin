import { Button, DatePicker, Drawer, Input, Radio, Select } from "antd";
import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import CustomButton from "../../../../../../components/customButton/customButton";
import CustomTextInput from "../../../../../../components/CustomTextInput/customTextInput";
import "./index.scss";
import { set } from "lodash";
import {
  DATA_GENDER,
  DATA_KIND,
  DATA_OPERTATOR,
  MONTH,
} from "../../../../../../api/fakeData";
import moment from "moment";

const AddGroupCustomer = () => {
  const [conditionLevel, setConditionLevel] = useState([
    {
      valueIn: "and",
      condition: [
        {
          compareIn: "and",
          condition: [{ kind: "", operator: "", value: "" }],
        },
      ],
    },
  ]);

  const [conditionLevelOut, setConditionLevelOut] = useState([
    {
      valueOut: "and",
      condition: [
        {
          compareOut: "and",
          condition: [{ kind: "", operator: "", value: "" }],
        },
      ],
    },
  ]);

  const addConditionLevel = () => {
    const newArray = [...conditionLevel];

    conditionLevel[0].condition.push({
      compareIn: "and",
      condition: [{ kind: "", operator: "", value: "" }],
    });
    setConditionLevel(newArray);
  };

  const addConditionLevelOut = () => {
    setConditionLevelOut((conditionLevelOut) => [
      ...conditionLevelOut,
      {
        valueOut: "and",
        compareOut: "and",
        condition: [
          {
            kind: "",
            operator: "",
            value: "",
          },
        ],
      },
    ]);
  };

  const deleteConditionLevelIn = (index) => {
    const arr = conditionLevel[0].condition.splice(index, 1);
    setConditionLevel([...conditionLevel]);
  };

  const deleteConditionLevelOut = (index) => {
    const arr = conditionLevelOut.splice(index, 1);
    setConditionLevelOut([...conditionLevelOut]);
  };

  const onChangeTabValueIn = useCallback(
    (index, value) => {
      const newArray = [...conditionLevel];
      conditionLevel[index].valueIn = value;
      setConditionLevel(newArray);
    },
    [conditionLevel]
  );

  const onChangeTabValueOut = useCallback(
    (index, value) => {
      const newArray = [...conditionLevelOut];
      conditionLevelOut[index].valueOut = value;
      setConditionLevelOut(newArray);
    },
    [conditionLevelOut]
  );

  const onChangeTabCompareIn = useCallback(
    (index, value) => {
      const newArray = [...conditionLevel];
      conditionLevel[0].condition[index].compareIn = value;
      setConditionLevel(newArray);
    },
    [conditionLevel]
  );

  const onChangeTabCompareOut = useCallback(
    (index, value) => {
      const newArray = [...conditionLevelOut];
      conditionLevelOut[0].condition[index].compareOut = value;
      setConditionLevelOut(newArray);
    },
    [conditionLevelOut]
  );

  const addConditionIn = (index) => {
    const newArray = [...conditionLevel];
    conditionLevel[0].condition[index].condition = [
      ...conditionLevel[0].condition[index].condition,
      { kind: "", operator: "", value: "" },
    ];
    setConditionLevel(newArray);
  };

  const addConditionOut = (index) => {
    const newArray = [...conditionLevelOut];
    conditionLevelOut[0].condition[index].condition = [
      ...conditionLevelOut[0].condition[index].condition,
      { kind: "", operator: "", value: "" },
    ];
    setConditionLevelOut(newArray);
  };

  const deleteConditionIn = (ind, index) => {
    const newArray = [...conditionLevel];
    conditionLevel[0].condition[index].condition.splice(ind, 1);
    setConditionLevel(newArray);
  };

  const deleteConditionOut = (ind, index) => {
    const newArray = [...conditionLevelOut];
    conditionLevelOut[index].condition.splice(ind, 1);
    setConditionLevelOut(newArray);
  };

  const onChangeKindIn = (value, ind, index) => {
    const newArray = [...conditionLevel];
    conditionLevel[0].condition[index].condition[ind].kind = value;
    setConditionLevel(newArray);
  };

  const onChangeKindOut = (value, ind, index) => {
    const newArray = [...conditionLevelOut];
    conditionLevelOut[0].condition[index].condition[ind].kind = value;
    setConditionLevelOut(newArray);
  };

  const onChangeOperatorIn = (value, ind, index) => {
    const newArray = [...conditionLevel];
    conditionLevel[0].condition[index].condition[ind].operator = value;
    setConditionLevel(newArray);
  };

  const onChangeOperatorOut = (value, ind, index) => {
    const newArray = [...conditionLevelOut];
    conditionLevelOut[0].condition[index].condition[ind].operator = value;
    setConditionLevelOut(newArray);
  };

  const onChangeValueIn = (value, ind, index) => {
    const newArray = [...conditionLevel];
    conditionLevel[0].condition[index].condition[ind].value = value;
    setConditionLevel(newArray);
  };

  const onChangeValueOut = (value, ind, index) => {
    const newArray = [...conditionLevelOut];
    conditionLevelOut[0].condition[index].condition[ind].value = value;
    setConditionLevelOut(newArray);
  };

  return (
    <>
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
                        i?.value === item?.valueIn
                          ? "div-tab-selected"
                          : "div-tab"
                      }
                    >
                      <a className="text-tab">{i?.title}</a>
                    </div>
                  );
                })}
              </div>
              {item?.condition?.map((condition, ix) => {
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
                                  i?.value === condition?.compareIn
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
                          Thêm điều kiện
                        </Button>
                      </div>
                      <div className="ml-5 p-2">
                        <div className="div-input">
                          {condition?.condition?.map((it, idx) => {
                            return (
                              <div className="div-input-condition">
                                <div className="div-select-kind">
                                  <a className="label-kind">Loại</a>
                                  <Select
                                    onChange={(value) =>
                                      onChangeKindIn(value, idx, ix)
                                    }
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
                                    options={DATA_OPERTATOR}
                                  />
                                </div>

                                <div className="div-select-kind">
                                  <a className="label-kind">Giá trị</a>
                                  {condition?.condition[idx].kind ===
                                  "gender" ? (
                                    <Select
                                      className="select-kind"
                                      options={DATA_GENDER}
                                      onChange={(value) =>
                                        onChangeValueIn(value, idx, ix)
                                      }
                                    />
                                  ) : condition?.condition[idx].kind ===
                                    "month_birthday" ? (
                                    <Select
                                      className="select-kind"
                                      options={MONTH}
                                      onChange={(value) =>
                                        onChangeValueIn(value, idx, ix)
                                      }
                                    />
                                  ) : condition?.condition[idx].kind ===
                                    "date_create" ? (
                                    <DatePicker
                                      className="select-date"
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
                                      onChange={(e) =>
                                        onChangeValueIn(e.target.value, idx, ix)
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
                        i?.value === item?.valueOut
                          ? "div-tab-selected"
                          : "div-tab"
                      }
                    >
                      <a className="text-tab">{i?.title}</a>
                    </div>
                  );
                })}
              </div>
              {item?.condition?.map((condition, ix) => {
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
                                  i?.value === condition?.compareOut
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
                          Thêm điều kiện
                        </Button>
                      </div>
                      <div className="ml-5 p-2">
                        <div className="div-input">
                          {condition?.condition?.map((it, idx) => {
                            return (
                              <div className="div-input-condition">
                                <div className="div-select-kind">
                                  <a className="label-kind">Loại</a>
                                  <Select
                                    onChange={(value) =>
                                      onChangeKindOut(value, idx, ix)
                                    }
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
                                    options={DATA_OPERTATOR}
                                  />
                                </div>

                                <div className="div-select-kind">
                                  <a className="label-kind">Giá trị</a>
                                  {condition?.condition[idx].kind ===
                                  "gender" ? (
                                    <Select
                                      className="select-kind"
                                      options={DATA_GENDER}
                                      onChange={(value) =>
                                        onChangeValueOut(value, idx, ix)
                                      }
                                    />
                                  ) : condition?.condition[idx].kind ===
                                    "month_birthday" ? (
                                    <Select
                                      className="select-kind"
                                      options={MONTH}
                                      onChange={(value) =>
                                        onChangeValueOut(value, idx, ix)
                                      }
                                    />
                                  ) : condition?.condition[idx].kind ===
                                    "date_create" ? (
                                    <DatePicker
                                      className="select-date"
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
                                    onClick={() => deleteConditionIn(idx, ix)}
                                  ></i>
                                )}
                              </div>
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
    </>
  );
};

export default memo(AddGroupCustomer);

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
