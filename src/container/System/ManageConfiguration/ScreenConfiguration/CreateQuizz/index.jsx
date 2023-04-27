import { useState } from "react";
import "./index.scss";
import { Button, Input, Modal } from "antd";

const CreateQuizz = () => {
  const [dataQuestion, setDataQuestion] = useState([
    {
      title: "",
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="div-container-question">
      <a className="title-quizz">Tạo câu hỏi</a>

      <Button className="btn-add-question" onClick={showModal}>
        Thêm câu hỏi
      </Button>

      <div>
        <Modal
          title="Tạo câu hỏi"
          open={isModalOpen}
          onOk={handleOk}
          okText={"Thêm"}
          onCancel={handleCancel}
          cancelText={"Huỷ"}
          width={800}
        >
          {dataQuestion?.map((item, index) => {
            return (
              <div className="div-map" key={index}>
                <div className="div-question">
                  <a>Câu hỏi</a>
                  <Input />
                </div>
                <a>Câu trả lời</a>
                <div>
                  {item?.question?.map((i, id) => {
                    return <div></div>;
                  })}
                </div>
              </div>
            );
          })}
        </Modal>
      </div>
    </div>
  );
};

export default CreateQuizz;
