import { useEffect, useState } from "react";
import { getListTestByCollabotatorApi } from "../../../../../../../api/configuration";
import "./styles.scss";

const TestExam = (props) => {
  const { id } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    getListTestByCollabotatorApi(id)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {});
  }, []);

  return (
    <div>
      <a className="title-test-exam">Bài kiểm tra Cộng tác viên</a>
      <div className="note-answers">
        <a className="text-false">* Màu đỏ đáp án sai</a>
        <a className="text-true">* Màu xanh đáp án đúng</a>
      </div>
      {data?.map((item, index) => {
        return (
          <div key={index}>
            <div className="div-head-test">
              <a className="title-score">Đúng: {item?.score} câu</a>
              {/* <div className="div-time-test">
                <a>
                  Bắt đầu:{" "}
                  {moment(new Date(item?.time_start)).format(
                    "DD/MM/YYYY - HH:mm"
                  )}
                </a>
                <a>
                  Kết thúc:{" "}
                  {moment(new Date(item?.time_end)).format(
                    "DD/MM/YYYY - HH:mm"
                  )}
                </a>
              </div> */}
            </div>
            <div className="mt-3">
              {item?.answers?.map((iAnswers, idAnswers) => {
                return (
                  <div key={idAnswers} className="div-question-test">
                    <a className="title-question">
                      Câu {iAnswers?.info_question?.question}:{" "}
                      {iAnswers?.info_question?.title}
                    </a>
                    {iAnswers?.info_question?.choose?.map(
                      (choose, idChoose) => {
                        return (
                          <div key={idChoose} className="ml-3">
                            <a
                              className={
                                choose?.isCorrect
                                  ? "text-answer-true"
                                  : iAnswers?.selected_answer === choose?._id &&
                                    !choose?.isCorrect
                                  ? "text-answer-false"
                                  : "text-answer-default"
                              }
                            >
                              {choose?.answer}
                            </a>
                          </div>
                        );
                      }
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TestExam;
