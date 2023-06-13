import { useEffect, useState } from "react";
import "./styles.scss";
import { Button, Input, InputNumber, Radio, Select } from "antd";
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
  const [condition, setCondition] = useState([
    {
      type_condition: "and",
      condition_child: [
        {
          type_condition: "and",
          money: 0,
          condition: [{ kind: "", operator: "", value: "" }],
        },
      ],
    },
  ]);
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

  const onChangeType = (value) => {
    const newArr = [...condition];
    condition[0].type_condition = value;
    setCondition(newArr);
  };

  const addCondition = () => {
    const newArr = [...condition];

    condition[0].condition_child?.push({
      type_condition: "and",
      money: 0,
      condition: [{ kind: "", operator: "", value: "" }],
    });
    setCondition(newArr);
  };

  const deleteCondition = (index) => {
    const arr = condition[0].condition_child.splice(index, 1);
    setCondition([...condition]);
  };

  const onChangeTypeChild = (value, index) => {
    const newArr = [...condition];
    condition[0].condition_child[index].type_condition = value;
    setCondition(newArr);
  };

  const addConditionChild = (index) => {
    const newArr = [...condition];
    condition[0].condition_child[index].condition.push({
      kind: "",
      operator: "",
      value: "",
    });
    setCondition(newArr);
  };

  const deleteConditionChild = (index, indexchild) => {
    const newArr = [...condition];
    condition[0].condition_child[index].condition.splice(indexchild, 1);
    setCondition(newArr);
  };

  const onChangeKind = (value, index, indexchild) => {
    const newArr = [...condition];
    condition[0].condition_child[index].condition[indexchild].kind = value;
    setCondition(newArr);
  };
  const onChangeOperator = (value, index, indexchild) => {
    const newArr = [...condition];
    condition[0].condition_child[index].condition[indexchild].operator = value;
    setCondition(newArr);
  };

  const onChangeVaule = (value, index, indexchild) => {
    const newArr = [...condition];
    condition[0].condition_child[index].condition[indexchild].value = value;
    setCondition(newArr);
  };

  const onChangeMoney = (value, index) => {
    const newArr = [...condition];
    condition[0].condition_child[index].money = value;
    setCondition(newArr);
  };

  return (
    <div>
      <a className="title-add">Thêm mới điều kiện thưởng CTV</a>

      <div>
        <InputCustom
          title="Tiêu đề"
          placeholder="Vui lòng nhập nội dung Tiếng Việt"
          style={{ width: 300 }}
          onChange={(e) => setTitleVN(e.target.value)}
        />
        <InputCustom
          placeholder="Vui lòng nhập nội dung Tiếng Anh"
          style={{ width: 300, marginTop: 5 }}
          onChange={(e) => setTitleEN(e.target.value)}
        />
        <InputCustom
          title="Mô tả"
          placeholder="Vui lòng nhập nội dung Tiếng Việt"
          style={{ width: 300 }}
          textArea={true}
          onChange={(e) => setDescriptionVN(e.target.value)}
        />
        <InputCustom
          placeholder="Vui lòng nhập nội dung Tiếng Anh"
          style={{ width: 300, marginTop: 5 }}
          textArea={true}
          onChange={(e) => setDescriptionEN(e.target.value)}
        />
        <InputCustom
          title="Tỉnh/thành phố"
          style={{ width: 300, marginTop: 5 }}
          select={true}
          options={cityOptions}
          onChange={(e) => console.log(e)}
        />

        {condition?.map((item, index) => {
          return (
            <div className="div-condition-container" key={index}>
              <Radio.Group
                defaultValue={item?.type_condition}
                onChange={(e) => onChangeType(e.target.value)}
              >
                <Radio value={"and"}>Và</Radio>
                <Radio value={"or"}>Hoặc</Radio>
              </Radio.Group>
              {item?.condition_child?.map((itemCon, indCon) => {
                return (
                  <>
                    <div className="div-condition-child" key={indCon}>
                      <div className="div-operator">
                        <Radio.Group
                          defaultValue={itemCon?.type_condition}
                          onChange={(e) =>
                            onChangeTypeChild(e.target.value, indCon)
                          }
                        >
                          <Radio value={"and"}>Và</Radio>
                          <Radio value={"or"}>Hoặc</Radio>
                        </Radio.Group>

                        <Button
                          className="btn-add-child"
                          onClick={() => addConditionChild(indCon)}
                        >
                          Thêm
                        </Button>
                      </div>
                      <div className="div-value">
                        <div className="div-money">
                          <a className="label-money">Tiền thưởng</a>
                          <InputNumber
                            formatter={(value) =>
                              `${value}  đ`.replace(
                                /(\d)(?=(\d\d\d)+(?!\d))/g,
                                "$1,"
                              )
                            }
                            style={{ width: "30%" }}
                            value={itemCon?.money}
                            onChange={(e) => onChangeMoney(e, indCon)}
                          />
                        </div>
                        {itemCon?.condition?.map((condition, ind) => {
                          return (
                            <>
                              {ind !== 0 && (
                                <div className="div-and-or">
                                  <a className="text-and-or">
                                    {itemCon?.type_condition === "and"
                                      ? "Và"
                                      : "Hoặc"}
                                  </a>
                                </div>
                              )}
                              <div className="div-value-conditon" key={ind}>
                                <div className="div-select-kind">
                                  <a className="label-kind">Loại</a>
                                  <Select
                                    onChange={(value) =>
                                      onChangeKind(value, indCon, ind)
                                    }
                                    className="select-kind"
                                    options={DATA_KIND}
                                  />
                                </div>
                                <div className="div-select-operator">
                                  <a className="label-kind">Phương thức</a>
                                  <Select
                                    onChange={(value) =>
                                      onChangeOperator(value, indCon, ind)
                                    }
                                    className="select-kind"
                                    options={DATA_OPERTATOR}
                                  />
                                </div>

                                <InputCustom
                                  title="Giá trị"
                                  placeholder="Nhập giá trị so sánh"
                                  onChange={(e) =>
                                    onChangeVaule(e.target.value, indCon, ind)
                                  }
                                />

                                {ind !== 0 && (
                                  <div
                                    onClick={() =>
                                      deleteConditionChild(indCon, ind)
                                    }
                                  >
                                    <CloseCircleOutlined />
                                  </div>
                                )}
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>

                    {indCon === 0 ? (
                      <></>
                    ) : (
                      <Button
                        className="btn-delete-condition-child"
                        onClick={() => deleteCondition(indCon)}
                      >
                        Xoá
                      </Button>
                    )}
                  </>
                );
              })}
              <Button className="btn-add-condition" onClick={addCondition}>
                Thêm
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
