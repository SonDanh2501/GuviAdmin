import { Button, Checkbox, Col, Drawer, Form, Input, Row } from "antd";
import {
  addQuestionApi,
  getListQuestionApi,
} from "../../../../../../api/configuration";
import { useCallback, useState } from "react";
import { errorNotify } from "../../../../../../helper/toast";
import "./styles.scss";

const AddQuizz = ({ setIsLoading, setData, setTotal, startPage, tab }) => {
  const [dataQuestion, setDataQuestion] = useState([
    {
      title: "",
      description: "",
      question: "",
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
    addQuestionApi(dataQuestion[0])
      .then((res) => {
        setOpen(false);
        setDataQuestion([
          {
            title: "",
            description: "",
            question: "",
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
        getListQuestionApi(startPage, 20, tab)
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
  }, [dataQuestion, startPage, tab]);

  return (
    <div>
      <Button className="btn-add-question" onClick={showDrawer}>
        Thêm câu hỏi
      </Button>

      <Drawer
        title="Tạo câu hỏi"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <Form layout="vertical">
          {dataQuestion?.map((item, index) => {
            return (
              <Col>
                <a style={{ fontSize: 18, fontFamily: "sans-serif" }}>Số câu</a>
                <Input
                  type="number"
                  min={0}
                  value={item?.question}
                  onChange={(e) => onChaggeQuestion(e.target.value, index)}
                />
                <a style={{ fontSize: 18, fontFamily: "sans-serif" }}>
                  Câu hỏi
                </a>

                <Input.TextArea
                  autoSize
                  value={item?.title}
                  onChange={(e) => onChaggeTitleQuestion(e.target.value, index)}
                />
                <a style={{ fontSize: 18, fontFamily: "sans-serif" }}>Mô tả</a>

                <Input.TextArea
                  autoSize
                  value={item?.description}
                  onChange={(e) =>
                    onChaggeDescriptionQuestion(e.target.value, index)
                  }
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

                {item?.choose?.map((answer, id) => {
                  return (
                    <Row
                      gutter={16}
                      style={{ marginTop: 10, alignItems: "center" }}
                    >
                      <Col span={18}>
                        <Input.TextArea
                          placeholder={"Nhập câu trả lời" + " " + (id + 1)}
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
                  style={{ fontSize: 14, marginTop: 20 }}
                  onClick={addAnswer}
                >
                  Thêm câu trả lời
                </Button>
              </Col>
            );
          })}

          <Button
            type="primary"
            style={{ float: "right", marginTop: 20 }}
            onClick={addQuestion}
          >
            Tạo
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default AddQuizz;
