import { Button, DatePicker, Input, Select } from "antd";
import moment from "moment";
import React, { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGroupCustomerApi } from "../../../../../../api/configuration";
import {
  DATA_GENDER,
  DATA_KIND,
  DATA_OPERTATOR,
  DATA_OPERTATOR_GENDER,
  MONTH,
} from "../../../../../../api/fakeData";
import LoadingPagination from "../../../../../../components/paginationLoading";
import { errorNotify } from "../../../../../../helper/toast";
import "./index.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import i18n from "../../../../../../i18n";
import InputCustom from "../../../../../../components/textInputCustom";
const { TextArea } = Input;

const AddGroupCustomer = () => {
  const [nameGroup, setNameGroup] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
  let lang = useSelector(getLanguageState);

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

  const onCreateGroupCustomer = useCallback(() => {
    setIsLoading(true);
    createGroupCustomerApi({
      name: nameGroup,
      description: description,
      condition_in: conditionLevel[0],
      condition_out: conditionLevelOut[0],
    })
      .then((res) => {
        window.location.reload();
        navigate(-1);
        setIsLoading(false);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        setIsLoading(false);
      });
  }, [nameGroup, description, conditionLevel, conditionLevelOut]);

  return (
    <>
      <a className="title-condition">{`${i18n.t("add_group_customer", {
        lng: lang,
      })}`}</a>
      <div className="div-input-name">
        <InputCustom
          title={`${i18n.t("name", { lng: lang })}`}
          className="input-name-group-customer"
          type="text"
          onChange={(e) => setNameGroup(e.target.value)}
        />
        <InputCustom
          title={`${i18n.t("describe", { lng: lang })}`}
          className="input-name-group-customer"
          textArea={true}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <a className="title-condition">{`${i18n.t("entry_conditions", {
          lng: lang,
        })}`}</a>
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
                      <a className="text-tab">{`${i18n.t(i?.title, {
                        lng: lang,
                      })}`}</a>
                    </div>
                  );
                })}
              </div>
              {item?.condition_level_1?.map((condition, ix) => {
                return (
                  <>
                    <div className="div-body mb-2">
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
                                <a className="text-tab">{`${i18n.t(i?.title, {
                                  lng: lang,
                                })}`}</a>
                              </div>
                            );
                          })}
                        </div>
                        <Button
                          className="btn-add-group"
                          onClick={() => addConditionIn(ix)}
                        >
                          {`${i18n.t("add", { lng: lang })}`}
                        </Button>
                      </div>
                      <div className="ml-2">
                        <div className="div-input">
                          {condition?.condition?.map((it, idx) => {
                            return (
                              <>
                                {idx !== 0 && (
                                  <div className="condition-btn">
                                    {condition?.type_condition === "and" ? (
                                      <a className="text-btn">
                                        {" "}
                                        {`${i18n.t("and", { lng: lang })}`}
                                      </a>
                                    ) : (
                                      <a className="text-btn">
                                        {" "}
                                        {`${i18n.t("or", { lng: lang })}`}
                                      </a>
                                    )}
                                  </div>
                                )}
                                <div className="div-input-condition">
                                  <div className="div-select-kind">
                                    <a className="label-kind">
                                      {" "}
                                      {`${i18n.t("type", { lng: lang })}`}
                                    </a>
                                    <Select
                                      onChange={(value) =>
                                        onChangeKindIn(value, idx, ix)
                                      }
                                      className="select-kind"
                                      options={DATA_KIND}
                                    />
                                  </div>

                                  <div className="div-select-kind">
                                    <a className="label-kind">
                                      {" "}
                                      {`${i18n.t("method", { lng: lang })}`}
                                    </a>
                                    <Select
                                      onChange={(value) =>
                                        onChangeOperatorIn(value, idx, ix)
                                      }
                                      className="select-kind"
                                      options={
                                        condition?.condition[idx].kind ===
                                        "gender"
                                          ? DATA_OPERTATOR_GENDER
                                          : DATA_OPERTATOR
                                      }
                                    />
                                  </div>

                                  <div className="div-select-kind">
                                    <a className="label-kind">{`${i18n.t(
                                      "value",
                                      { lng: lang }
                                    )}`}</a>
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
                                        min={0}
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
                        {`${i18n.t("delete", { lng: lang })}`}
                      </Button>
                    )}
                  </>
                );
              })}

              <div>
                <Button className="mt-2" onClick={addConditionLevel}>
                  {`${i18n.t("add", { lng: lang })}`}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <a className="title-condition">{`${i18n.t("output_conditions", {
          lng: lang,
        })}`}</a>
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
                      <a className="text-tab">{`${i18n.t(i?.title, {
                        lng: lang,
                      })}`}</a>
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
                                <a className="text-tab">{`${i18n.t(i?.title, {
                                  lng: lang,
                                })}`}</a>
                              </div>
                            );
                          })}
                        </div>
                        <Button
                          className="btn-add-group"
                          onClick={() => addConditionOut(ix)}
                        >
                          {`${i18n.t("add", { lng: lang })}`}
                        </Button>
                      </div>
                      <div className="ml-2">
                        <div className="div-input">
                          {condition?.condition?.map((it, idx) => {
                            return (
                              <>
                                {idx !== 0 && (
                                  <div className="condition-btn">
                                    {condition?.type_condition === "and" ? (
                                      <a className="text-btn">{`${i18n.t(
                                        "and",
                                        { lng: lang }
                                      )}`}</a>
                                    ) : (
                                      <a className="text-btn">{`${i18n.t("or", {
                                        lng: lang,
                                      })}`}</a>
                                    )}
                                  </div>
                                )}
                                <div className="div-input-condition">
                                  <div className="div-select-kind">
                                    <a className="label-kind">{`${i18n.t(
                                      "type",
                                      { lng: lang }
                                    )}`}</a>
                                    <Select
                                      onChange={(value) =>
                                        onChangeKindOut(value, idx, ix)
                                      }
                                      className="select-kind"
                                      options={DATA_KIND}
                                    />
                                  </div>

                                  <div className="div-select-kind">
                                    <a className="label-kind">{`${i18n.t(
                                      "method",
                                      { lng: lang }
                                    )}`}</a>
                                    <Select
                                      onChange={(value) =>
                                        onChangeOperatorOut(value, idx, ix)
                                      }
                                      className="select-kind"
                                      options={
                                        condition?.condition[idx].kind ===
                                        "gender"
                                          ? DATA_OPERTATOR_GENDER
                                          : DATA_OPERTATOR
                                      }
                                    />
                                  </div>

                                  <div className="div-select-kind">
                                    <a className="label-kind">{`${i18n.t(
                                      "value",
                                      { lng: lang }
                                    )}`}</a>
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
                        {`${i18n.t("delete", { lng: lang })}`}
                      </Button>
                    )}
                  </>
                );
              })}

              <div>
                <Button className="mt-2" onClick={addConditionLevelOut}>
                  {`${i18n.t("add", { lng: lang })}`}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        className="btn-create-group-customer"
        onClick={onCreateGroupCustomer}
      >
        {`${i18n.t("create", { lng: lang })}`}
      </Button>

      {isLoading && <LoadingPagination />}
    </>
  );
};

export default memo(AddGroupCustomer);

const DATA_TAB = [
  {
    title: "and",
    value: "and",
  },
  {
    title: "or",
    value: "or",
  },
];
