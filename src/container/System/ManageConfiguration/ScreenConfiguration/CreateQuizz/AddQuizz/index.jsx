import { Button, Checkbox, Col, Drawer, Form, Input, Row } from "antd";
import {
  addQuestionApi,
  getExamByLessonApi,
  getListQuestionApi,
} from "../../../../../../api/configuration";
import { useCallback, useEffect, useState } from "react";
import { errorNotify } from "../../../../../../helper/toast";
import "./styles.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import i18n from "../../../../../../i18n";
import InputCustom from "../../../../../../components/textInputCustom";

const AddQuizz = ({ setIsLoading, setData, setTotal, startPage, tab, id }) => {
  const [dataQuestion, setDataQuestion] = useState([
    {
      title: "",
      description: "",
      question: "",
      id_training_lesson: id,
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
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    const arr = [...dataQuestion];
    dataQuestion[0].id_training_lesson = id;
    setDataQuestion(arr);
  }, [id]);

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

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

  const onChangeTitleQuestion = useCallback(
    (value, index) => {
      const arr = [...dataQuestion];
      dataQuestion[index].title = value;
      setDataQuestion(arr);
    },
    [dataQuestion]
  );

  const onChangeDescriptionQuestion = useCallback(
    (value, index) => {
      const arr = [...dataQuestion];
      dataQuestion[index].description = value;
      setDataQuestion(arr);
    },
    [dataQuestion]
  );

  const onChangeTitleAnswer = useCallback(
    (value, index, id) => {
      const arr = [...dataQuestion];
      dataQuestion[index].choose[id].answer = value;
      setDataQuestion(arr);
    },
    [dataQuestion]
  );

  const onChangeQuestion = useCallback(
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
    addQuestionApi(dataQuestion[0])
      .then((res) => {
        setOpen(false);
        setIsLoading(false);
        setDataQuestion([
          {
            title: "",
            description: "",
            question: "",
            id_training_lesson: id,
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
        getExamByLessonApi(id, 0, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);

        errorNotify({
          message: err,
        });
      });
  }, [dataQuestion, startPage, tab, id]);

  return (
    <div>
      <Button className="btn-add-question" onClick={showDrawer}>
        {`${i18n.t("add_question", { lng: lang })}`}
      </Button>

      <Drawer
        title={`${i18n.t("add_question", { lng: lang })}`}
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
                  onChange={(e) => onChangeQuestion(e.target.value, index)}
                />

                <InputCustom
                  title={`${i18n.t("question", { lng: lang })}`}
                  value={item?.title}
                  onChange={(e) => onChangeTitleQuestion(e.target.value, index)}
                  textArea={true}
                />

                <InputCustom
                  title={`${i18n.t("describe", { lng: lang })}`}
                  value={item?.description}
                  onChange={(e) =>
                    onChangeDescriptionQuestion(e.target.value, index)
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
                            onChangeTitleAnswer(e.target.value, index, id)
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
                  {`${i18n.t("add_answer", { lng: lang })}`}
                </Button>
              </Col>
            );
          })}

          <Button
            type="primary"
            style={{ float: "right", marginTop: 20, width: "auto" }}
            onClick={addQuestion}
          >
            {`${i18n.t("create", { lng: lang })}`}
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default AddQuizz;
