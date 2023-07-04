import { Button, Checkbox, Col, Drawer, Form, Input, Row } from "antd";
import {
  addQuestionApi,
  editQuestionApi,
  getDetailsQuestionApi,
  getListQuestionApi,
} from "../../../../../../api/configuration";
import { useCallback, useEffect, useState } from "react";
import { errorNotify } from "../../../../../../helper/toast";
import "./styles.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import i18n from "../../../../../../i18n";
import InputCustom from "../../../../../../components/textInputCustom";

const EditQuizz = ({
  id,
  setIsLoading,
  setData,
  setTotal,
  startPage,
  tab,
  type,
}) => {
  const [dataQuestion, setDataQuestion] = useState([
    {
      title: "",
      description: "",
      question: "",
      type_exam: "",
      choose: [
        {
          answer: "",
          isCorrect: false,
        },
        {
          answer: "",
          isCorrect: false,
        },
        {
          answer: "",
          isCorrect: false,
        },
        {
          answer: "",
          isCorrect: false,
        },
      ],
    },
  ]);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getDetailsQuestionApi(id)
      .then((res) => {
        const arr = [...dataQuestion];
        dataQuestion[0].title = res?.title;
        dataQuestion[0].description = res?.description;
        dataQuestion[0].question = res?.question;
        dataQuestion[0].choose = res?.choose;
        dataQuestion[0].type_exam = res?.type_exam;
        setDataQuestion(arr);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, [id]);

  const addAnswer = () => {
    const arr = [...dataQuestion];
    dataQuestion[0].choose = [
      ...dataQuestion[0].choose,
      {
        answer: "",
        isCorrect: false,
      },
    ];
    setDataQuestion(arr);
  };

  const deleteAnswer = (index) => {
    const arr = [...dataQuestion];
    dataQuestion[0].choose.splice(index, 1);
    setDataQuestion(arr);
  };

  const onChaggeTitleQuestion = useCallback(
    (value, index) => {
      const arr = [...dataQuestion];
      dataQuestion[index].title = value;
      setDataQuestion(arr);
    },
    [dataQuestion]
  );

  const onChaggeDescriptionQuestion = useCallback(
    (value, index) => {
      const arr = [...dataQuestion];
      dataQuestion[index].description = value;
      setDataQuestion(arr);
    },
    [dataQuestion]
  );

  const onChaggeTitleAnswer = useCallback(
    (value, index, id) => {
      const arr = [...dataQuestion];
      dataQuestion[index].choose[id].answer = value;
      setDataQuestion(arr);
    },
    [dataQuestion]
  );

  const onChaggeQuestion = useCallback(
    (value, index) => {
      const arr = [...dataQuestion];
      dataQuestion[index].question = value;
      setDataQuestion(arr);
    },
    [dataQuestion]
  );

  const onChangeCorrect = useCallback(
    (value, index, id) => {
      const arr = [...dataQuestion];
      dataQuestion[index].choose[id].isCorrect = value;
      setDataQuestion(arr);
    },
    [dataQuestion]
  );

  const addQuestion = useCallback(() => {
    setIsLoading(true);
    editQuestionApi(id, dataQuestion[0])
      .then((res) => {
        setOpen(false);
        getListQuestionApi(startPage, 20, tab, type)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
          });
      })
      .catch((err) => {
        setIsLoading(false);

        errorNotify({
          message: err,
        });
      });
  }, [dataQuestion, startPage, tab, id, type]);

  return (
    <div>
      <a onClick={showDrawer}>{`${i18n.t("edit", { lng: lang })}`}</a>

      <Drawer
        title={`${i18n.t("edit", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        open={open}
        headerStyle={{ height: 50 }}
      >
        <Form layout="vertical">
          {dataQuestion?.map((item, index) => {
            return (
              <Col>
                <InputCustom
                  title={`${i18n.t("number_sentences", { lng: lang })}`}
                  type="number"
                  min={0}
                  value={item?.question}
                  onChange={(e) => onChaggeQuestion(e.target.value, index)}
                />
                <InputCustom
                  title={`${i18n.t("question", { lng: lang })}`}
                  value={item?.title}
                  onChange={(e) => onChaggeTitleQuestion(e.target.value, index)}
                  textArea={true}
                />

                <InputCustom
                  title={`${i18n.t("describe", { lng: lang })}`}
                  value={item?.description}
                  onChange={(e) =>
                    onChaggeDescriptionQuestion(e.target.value, index)
                  }
                  textArea={true}
                />

                <a
                  style={{
                    fontSize: 18,
                    fontFamily: "sans-serif",
                    marginTop: 20,
                  }}
                >
                  {`${i18n.t("answer", { lng: lang })}`}
                </a>

                {item?.choose?.map((answer, id) => {
                  return (
                    <Row
                      gutter={16}
                      style={{ marginTop: 10, alignItems: "center" }}
                    >
                      <Col span={18}>
                        <Input.TextArea
                          placeholder={
                            `${i18n.t("enter_answer", { lng: lang })}` +
                            " " +
                            (id + 1)
                          }
                          autoSize
                          value={answer?.answer}
                          onChange={(e) =>
                            onChaggeTitleAnswer(e.target.value, index, id)
                          }
                        />
                      </Col>
                      <Col span={3}>
                        <Checkbox
                          checked={answer?.isCorrect}
                          onChange={(e) =>
                            onChangeCorrect(e.target.checked, index, id)
                          }
                        />
                      </Col>
                      {id !== 0 && (
                        <Col span={3}>
                          <div onClick={() => deleteAnswer(id)}>
                            <i class="uil uil-trash-alt"></i>
                          </div>
                        </Col>
                      )}
                    </Row>
                  );
                })}

                <Button
                  style={{ fontSize: 14, marginTop: 20, width: "auto" }}
                  onClick={addAnswer}
                >
                  {`${i18n.t("edit", { lng: lang })}`}
                </Button>
              </Col>
            );
          })}

          <Button
            type="primary"
            style={{ float: "right", marginTop: 20, width: "auto" }}
            onClick={addQuestion}
          >
            {`${i18n.t("edit", { lng: lang })}`}
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default EditQuizz;
