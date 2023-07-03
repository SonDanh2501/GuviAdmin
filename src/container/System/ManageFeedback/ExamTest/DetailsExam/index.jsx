import { Drawer } from "antd";
import { useEffect, useState } from "react";
import { getDetailsTestCollaboratorApi } from "../../../../../api/feedback";
import "./styles.scss";

const DetailsExam = ({ id }) => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getDetailsTestCollaboratorApi(id)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {});
  }, [id]);

  return (
    <div>
      <a onClick={showDrawer}>Chi tiết</a>

      <Drawer
        title="Chi tiết kiểm tra"
        placement="right"
        onClose={onClose}
        open={open}
        width={500}
        headerStyle={{ height: 50 }}
      >
        <div className="div-info-ctv">
          <div>
            <a className="title-info">Tên CTV</a>
            <a className="text-colon">:</a>
            <a className="name-info">{data?.id_collaborator?.name}</a>
          </div>
          <div>
            <a className="title-info">SĐT</a>
            <a className="text-colon">:</a>
            <a className="name-info">{data?.id_collaborator?.phone}</a>
          </div>
        </div>
        <div className="div-total-question">
          <a className="text-score">
            Đúng : {data?.correct_answers}/{data?.total_answers} câu
          </a>
          <a className="text-score">Điểm : {data?.score}</a>
        </div>

        <div className="mt-3">
          {data?.answers?.map((item, index) => {
            return (
              <div className="div-list-item-answers" key={index}>
                <a className="text-answers">
                  Câu {item?.info_question?.question}:{" "}
                  {item?.info_question?.title}
                </a>
                <a
                  className={
                    item?.isCorrect
                      ? "text-question-true"
                      : "text-question-false"
                  }
                >
                  {item?.selected_answer}
                </a>
              </div>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
};

export default DetailsExam;
