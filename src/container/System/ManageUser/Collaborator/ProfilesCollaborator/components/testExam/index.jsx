import { useEffect, useState } from "react";
import { getListTestByCollabotatorApi } from "../../../../../../../api/configuration";
import "./styles.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import i18n from "../../../../../../../i18n";
import { Pagination } from "antd";

const TestExam = (props) => {
  const { id } = props;
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getListTestByCollabotatorApi(id, 0, 1)
      .then((res) => {
        setCurrentPage(1);
        setData(res.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const onChange = (page) => {
    setCurrentPage(page);
    const start = page * data.length - data.length;
    getListTestByCollabotatorApi(id, start, 1)
      .then((res) => {
        setData(res.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  return (
    <div>
      <a className="title-test-exam">{`${i18n.t("contributor_exam", {
        lng: lang,
      })}`}</a>
      <div className="note-answers">
        <a className="text-false">
          *{" "}
          {`${i18n.t("wrong_answer", {
            lng: lang,
          })}`}
        </a>
        <a className="text-true">
          *{" "}
          {`${i18n.t("correct_answer", {
            lng: lang,
          })}`}
        </a>
        <a className="text-warning">
          *{" "}
          {`${i18n.t("warning_answer", {
            lng: lang,
          })}`}
        </a>
      </div>
      <div className="div-exam-test">
        {data?.map((item, index) => {
          return (
            <div key={index}>
              <div className="div-head-test">
                <a className="title-score">Đúng: {item?.score} câu</a>
                <a className="title-score">
                  {item?.type_exam === "input"
                    ? "Bài kiểm tra đầu vào"
                    : "Bài kiểm tra định kì"}
                </a>
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
                                  !iAnswers?.selected_answer &&
                                  iAnswers?.isCorrect === false &&
                                  choose?.isCorrect
                                    ? "text-answer-warning"
                                    : choose?.isCorrect
                                    ? "text-answer-true"
                                    : iAnswers?.selected_answer ===
                                        choose?._id && !choose?.isCorrect
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
      <div className="div-pagination p-2 mt-3">
        <a>
          {`${i18n.t("total", { lng: lang })}`}: {total}
        </a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={total}
            showSizeChanger={false}
            pageSize={1}
          />
        </div>
      </div>
    </div>
  );
};

export default TestExam;
