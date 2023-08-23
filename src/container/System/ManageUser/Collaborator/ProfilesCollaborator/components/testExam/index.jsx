import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getInfoTestTrainingLessonByCollaboratorApi,
  getListTrainingLessonByCollaboratorApi,
  passInfoTestApi,
} from "../../../../../../../api/collaborator";
import qualified from "../../../../../../../assets/images/qualified.png";
import unqualified from "../../../../../../../assets/images/unqualifed.png";
import ModalCustom from "../../../../../../../components/modalCustom";
import LoadingPagination from "../../../../../../../components/paginationLoading";
import { errorNotify } from "../../../../../../../helper/toast";
import i18n from "../../../../../../../i18n";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import "./styles.scss";
import { Image } from "antd";

const TestExam = (props) => {
  const { id } = props;
  const [dataLesson, setDataLesson] = useState([]);
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [modalInfo, setModalInfo] = useState(false);
  const [tab, setTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getListTrainingLessonByCollaboratorApi(id, 0, 20, tab)
      .then((res) => {
        setDataLesson(res?.data);
      })
      .catch((err) => {});
  }, [id, tab]);

  const handleSeeInfoLesson = (_id, title) => {
    setTitle(title);
    getInfoTestTrainingLessonByCollaboratorApi(_id, id)
      .then((res) => {
        setData(res?.data);
        setModalInfo(true);
      })
      .catch((err) => {});
  };

  const onChangeTab = (value) => {
    setTab(value);
    getListTrainingLessonByCollaboratorApi(id, 0, 20, value)
      .then((res) => {
        setDataLesson(res?.data);
      })
      .catch((err) => {});
  };

  const onPassLesson = (idLesson, type) => {
    setIsLoading(true);
    passInfoTestApi({
      id_collaborator: id,
      answers: [],
      id_training_lesson: idLesson,
      type_exam: type,
    })
      .then((res) => {
        setIsLoading(false);
        getListTrainingLessonByCollaboratorApi(id, 0, 20, tab)
          .then((res) => {
            setDataLesson(res?.data);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);

        errorNotify({
          message: err,
        });
      });
  };

  return (
    <>
      <div className="div-tab-exam">
        {TAB_EXAM?.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => onChangeTab(item?.value)}
              className={
                tab === item?.value ? "item-tab-exam-select" : "item-tab-exam"
              }
            >
              <p className="text-tab">{`${i18n.t(item?.value, {
                lng: lang,
              })}`}</p>
            </div>
          );
        })}
      </div>
      <div className="div-list-lesson-collaborator mt-5">
        {dataLesson?.map((item, index) => {
          return (
            <div
              key={index}
              className={
                item?.is_pass
                  ? "div-item-lesson-collaborator"
                  : "div-item-lesson-collaborator-hide"
              }
            >
              <div className="div-title-lesson">
                <p className="text-title">{item?.title[lang]}</p>
                {item?.is_pass ? (
                  <Image src={qualified} className="img" preview={false} />
                ) : !item?.is_pass &&
                  item?.collaborator_times_submit === item?.times_submit ? (
                  <Image src={unqualified} className="img" preview={false} />
                ) : !item?.is_pass ? (
                  <i class="uil uil-padlock"></i>
                ) : null}
              </div>
              <p className="text-description">{item?.description[lang]}</p>

              {(item?.is_pass ||
                (!item?.is_pass &&
                  item?.collaborator_times_submit === item?.times_submit)) && (
                <p
                  className="see-answer"
                  onClick={() =>
                    handleSeeInfoLesson(item?._id, item?.title[lang])
                  }
                >
                  Xem câu trả lời <i class="uil uil-angle-right"></i>
                </p>
              )}
              {!item?.is_pass && (
                <p
                  className="see-answer"
                  onClick={() =>
                    onPassLesson(item?._id, item?.type_training_lesson)
                  }
                >
                  Pass
                </p>
              )}
            </div>
          );
        })}

        <div>
          <ModalCustom
            title={`Chi tiết bài kiểm tra "${title}"`}
            isOpen={modalInfo}
            handleCancel={() => setModalInfo(false)}
            handleOk={() => setModalInfo(false)}
            textOk={"Ok"}
            width={900}
            body={
              <>
                <div className="note-answers">
                  <p className="text-false">
                    *{" "}
                    {`${i18n.t("wrong_answer", {
                      lng: lang,
                    })}`}
                  </p>
                  <p className="text-true">
                    *{" "}
                    {`${i18n.t("correct_answer", {
                      lng: lang,
                    })}`}
                  </p>
                  <p className="text-warning">
                    *{" "}
                    {`${i18n.t("warning_answer", {
                      lng: lang,
                    })}`}
                  </p>
                </div>
                <div className="div-exam-test">
                  <div className="div-test">
                    <div className="div-head-test">
                      <div className="div-score">
                        <p className="title-score">
                          Đúng: {data[0]?.score} câu
                        </p>
                      </div>
                      <div className="div-time-test">
                        <p className="title-time">
                          Thời gian bắt đầu:{" "}
                          {moment(data[0]?.time_start).format(
                            "DD/MM/YYYY - HH:mm"
                          )}
                        </p>
                        <p className="title-time">
                          Thời gian kết thúc:{" "}
                          {moment(data[0]?.time_end).format(
                            "DD/MM/YYYY - HH:mm"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      {data[0]?.answers?.map((iAnswers, idAnswers) => {
                        return (
                          <div key={idAnswers} className="div-question-test">
                            <p className="title-question">
                              Câu {idAnswers + 1}:{" "}
                              {iAnswers?.info_question?.title}
                            </p>
                            {iAnswers?.info_question?.choose?.map(
                              (choose, idChoose) => {
                                return (
                                  <div key={idChoose} className="ml-3">
                                    <p
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
                                    </p>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            }
          />
        </div>
      </div>
      {isLoading && <LoadingPagination />}
    </>
  );
};

export default TestExam;

const TAB_EXAM = [
  {
    id: 1,
    value: "all",
  },
  {
    id: 2,
    value: "input",
  },
  {
    id: 3,
    value: "training",
  },
  {
    id: 4,
    value: "periodic",
  },
];
