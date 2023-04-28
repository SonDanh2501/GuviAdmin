import { useCallback, useState } from "react";
import "./index.scss";
import { Button, Checkbox, Col, Drawer, Form, Input, Row } from "antd";
import CustomTextEditor from "../../../../../components/customTextEdittor";
const { TextArea } = Input;

const CreateQuizz = () => {
  const [dataQuestion, setDataQuestion] = useState([
    {
      title: "",
      description: "",
      question: [
        {
          title: "",
          isCorrect: false,
        },
        {
          title: "",
          isCorrect: false,
        },
        {
          title: "",
          isCorrect: false,
        },
        {
          title: "",
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

  const addAnswer = () => {
    const arr = [...dataQuestion];
    dataQuestion[0].question = [
      ...dataQuestion[0].question,
      {
        title: "",
        isCorrect: false,
      },
    ];
    setDataQuestion(arr);
  };

  const deleteAnswer = (index) => {
    const arr = [...dataQuestion];
    dataQuestion[0].question.splice(index, 1);
    setDataQuestion(arr);
  };

  const onChaggeTitleQuestion = useCallback((value, index) => {
    const arr = [...dataQuestion];
    dataQuestion[index].title = value;
    setDataQuestion(arr);
  }, []);

  const onChaggeDescriptionQuestion = useCallback((value, index) => {
    const arr = [...dataQuestion];
    dataQuestion[index].description = value;
    setDataQuestion(arr);
  }, []);

  const onChaggeTitleAnswer = useCallback((value, index, id) => {
    const arr = [...dataQuestion];
    dataQuestion[index].question[id].title = value;
    setDataQuestion(arr);
  }, []);

  const onChangeCorrect = useCallback((value, index, id) => {
    const arr = [...dataQuestion];
    dataQuestion[index].question[id].isCorrect = value;
    setDataQuestion(arr);
  }, []);

  return (
    <div className="div-container-question">
      <a className="title-quizz">Tạo câu hỏi</a>

      <Button className="btn-add-question" onClick={showDrawer}>
        Thêm câu hỏi
      </Button>

      <div>
        <Drawer
          title="Tạo câu hỏi"
          placement="right"
          onClose={onClose}
          open={open}
          width={500}
        >
          <Form layout="vertical">
            {dataQuestion?.map((item, index) => {
              return (
                <Col>
                  <a style={{ fontSize: 18, fontFamily: "sans-serif" }}>
                    Câu hỏi
                  </a>
                  <CustomTextEditor
                    value={item?.title}
                    onChangeValue={(e) => onChaggeTitleQuestion(e, index)}
                  />
                  <a style={{ fontSize: 18, fontFamily: "sans-serif" }}>
                    Mô tả
                  </a>
                  <CustomTextEditor
                    value={item?.description}
                    onChangeValue={(e) => onChaggeDescriptionQuestion(e, index)}
                  />
                  <a
                    style={{
                      fontSize: 18,
                      fontFamily: "sans-serif",
                      marginTop: 20,
                    }}
                  >
                    Câu trả lời
                  </a>

                  {item?.question?.map((answer, id) => {
                    return (
                      <Row
                        gutter={16}
                        style={{ marginTop: 10, alignItems: "center" }}
                      >
                        <Col span={18}>
                          <TextArea
                            placeholder={"Nhập câu trả lời" + " " + (id + 1)}
                            autoSize
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
                    style={{ fontSize: 14, marginTop: 20 }}
                    onClick={addAnswer}
                  >
                    Thêm câu trả lời
                  </Button>
                </Col>
              );
            })}

            <Button type="primary" style={{ float: "right", marginTop: 20 }}>
              Tạo
            </Button>
          </Form>
        </Drawer>
      </div>
    </div>
  );
};

export default CreateQuizz;
