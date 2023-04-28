import { useCallback, useState } from "react";
import "./index.scss";
import { Button, Checkbox, Col, Drawer, Form, Input, Row, Select } from "antd";
import CustomTextEditor from "../../../../../components/customTextEdittor";
const { TextArea } = Input;

const CreateQuizz = () => {
  // const [dataQuestion, setDataQuestion] = useState([
  //   {
  //     title: "",
  //     description: "",
  //     question: [
  //       {
  //         title: "",
  //         isCorrect: false,
  //       },
  //       {
  //         title: "",
  //         isCorrect: false,
  //       },
  //       {
  //         title: "",
  //         isCorrect: false,
  //       },
  //       {
  //         title: "",
  //         isCorrect: false,
  //       },
  //     ],
  //   },
  // ]);

  const [dataQuestion, setDataQuestion] = useState([
    {
      title: "",
      description: "",
      question: [
        {
          A: "",
        },
        {
          B: "",
        },
        {
          C: "",
        },
        {
          D: "",
        },
      ],
      answers: "",
    },
  ]);

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // const addAnswer = () => {
  //   const arr = [...dataQuestion];
  //   dataQuestion[0].question = [
  //     ...dataQuestion[0].question,
  //     {
  //       title: "",
  //       isCorrect: false,
  //     },
  //   ];
  //   setDataQuestion(arr);
  // };

  // const deleteAnswer = (index) => {
  //   const arr = [...dataQuestion];
  //   dataQuestion[0].question.splice(index, 1);
  //   setDataQuestion(arr);
  // };

  // const onChaggeTitleQuestion = useCallback((value, index) => {
  //   const arr = [...dataQuestion];
  //   dataQuestion[index].title = value;
  //   setDataQuestion(arr);
  // }, []);

  // const onChaggeDescriptionQuestion = useCallback((value, index) => {
  //   const arr = [...dataQuestion];
  //   dataQuestion[index].description = value;
  //   setDataQuestion(arr);
  // }, []);

  // const onChaggeTitleAnswer = useCallback((value, index, id) => {
  //   const arr = [...dataQuestion];
  //   dataQuestion[index].question[id].title = value;
  //   setDataQuestion(arr);
  // }, []);

  // const onChangeCorrect = useCallback((value, index, id) => {
  //   const arr = [...dataQuestion];
  //   dataQuestion[index].question[id].isCorrect = value;
  //   setDataQuestion(arr);
  // }, []);

  console.log(dataQuestion);

  return (
    <div className="div-container-question">
      <a className="title-quizz">Tạo câu hỏi</a>

      <Button className="btn-add-question" onClick={showDrawer}>
        Thêm câu hỏi
      </Button>

      {/* <div>
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
      </div> */}

      <div>
        <Drawer
          title="Tạo câu hỏi"
          placement="right"
          onClose={onClose}
          open={open}
          width={500}
        >
          <Form layout="vertical">
            <Col>
              <a style={{ fontSize: 18, fontFamily: "sans-serif" }}>Câu hỏi</a>
              <CustomTextEditor
                value={dataQuestion[0].title}
                onChangeValue={(e) => {
                  const arr = [...dataQuestion];
                  dataQuestion[0].title = e;
                  setDataQuestion(arr);
                }}
              />
              <a style={{ fontSize: 18, fontFamily: "sans-serif" }}>Mô tả</a>
              <CustomTextEditor
                value={dataQuestion[0].description}
                onChangeValue={(e) => {
                  const arr = [...dataQuestion];
                  dataQuestion[0].description = e;
                  setDataQuestion(arr);
                }}
              />
              <a style={{ fontSize: 18, fontFamily: "sans-serif" }}>
                Câu trả lời
              </a>
              <Row>
                <Col span={2}>
                  <a>A</a>
                </Col>
                <Col span={22}>
                  <TextArea
                    placeholder={"Nhập câu trả lời"}
                    autoSize
                    onChange={(e) => {
                      const arr = [...dataQuestion];
                      dataQuestion[0].question[0].A = e.target.value;
                      setDataQuestion(arr);
                    }}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col span={2}>
                  <a>B</a>
                </Col>
                <Col span={22}>
                  <TextArea
                    placeholder={"Nhập câu trả lời"}
                    autoSize
                    onChange={(e) => {
                      const arr = [...dataQuestion];
                      dataQuestion[0].question[1].B = e.target.value;
                      setDataQuestion(arr);
                    }}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col span={2}>
                  <a>C</a>
                </Col>
                <Col span={22}>
                  <TextArea
                    placeholder={"Nhập câu trả lời"}
                    autoSize
                    onChange={(e) => {
                      const arr = [...dataQuestion];
                      dataQuestion[0].question[2].C = e.target.value;
                      setDataQuestion(arr);
                    }}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col span={2}>
                  <a>D</a>
                </Col>
                <Col span={22}>
                  <TextArea
                    placeholder={"Nhập câu trả lời"}
                    autoSize
                    onChange={(e) => {
                      const arr = [...dataQuestion];
                      dataQuestion[0].question[3].D = e.target.value;
                      setDataQuestion(arr);
                    }}
                  />
                </Col>
              </Row>

              <div className="mt-3">
                <a style={{ fontSize: 18, fontFamily: "sans-serif" }}>
                  Đáp án đúng
                </a>
                <Select
                  style={{ width: 120, marginLeft: 10 }}
                  onChange={(e) => {
                    const arr = [...dataQuestion];
                    dataQuestion[0].answers = e;
                    setDataQuestion(arr);
                  }}
                  options={[
                    { value: "A", label: "A" },
                    { value: "B", label: "B" },
                    { value: "C", label: "C" },
                    { value: "D", label: "D" },
                  ]}
                />
              </div>
            </Col>

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
