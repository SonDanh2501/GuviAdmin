import { useEffect, useState } from "react";
import { getListTestByCollabotatorApi } from "../../../../../../../api/configuration";
import {
  getInfoTestTrainingLessonByCollaboratorApi,
  getListTrainingLessonByCollaboratorApi,
} from "../../../../../../../api/collaborator";
import "./styles.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import qualified from "../../../../../../../assets/images/qualified.png";
import unqualified from "../../../../../../../assets/images/unqualifed.png";
import i18n from "../../../../../../../i18n";
import { Pagination } from "antd";
import moment from "moment";
import ModalCustom from "../../../../../../../components/modalCustom";

const TestExam = (props) => {
  const { id } = props;
  const [dataLesson, setDataLesson] = useState([]);
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [modalInfo, setModalInfo] = useState(false);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getListTrainingLessonByCollaboratorApi(id, 0, 20)
      .then((res) => {
        setDataLesson(res?.data);
      })
      .catch((err) => {});
  }, []);

  const handleSeeInfoLesson = (_id, title) => {
    setTitle(title);
    getInfoTestTrainingLessonByCollaboratorApi(_id, id)
      .then((res) => {
        setData(res?.data);
        setModalInfo(true);
      })
      .catch((err) => {});
  };

  return (
    // <div>
    //   <a className="title-test-exam">{`${i18n.t("contributor_exam", {
    //     lng: lang,
    //   })}`}</a>
    //   <div className="note-answers">
    //     <a className="text-false">
    //       *{" "}
    //       {`${i18n.t("wrong_answer", {
    //         lng: lang,
    //       })}`}
    //     </a>
    //     <a className="text-true">
    //       *{" "}
    //       {`${i18n.t("correct_answer", {
    //         lng: lang,
    //       })}`}
    //     </a>
    //     <a className="text-warning">
    //       *{" "}
    //       {`${i18n.t("warning_answer", {
    //         lng: lang,
    //       })}`}
    //     </a>
    //   </div>
    //   <div className="div-tab-exam">
    //     {TAB_EXAM?.map((item, index) => {
    //       return (
    //         <div
    //           key={index}
    //           className={
    //             item?.value === tab ? "item-tab-exam-select" : "item-tab-exam"
    //           }
    //           onClick={() => {
    //             setTab(item?.value);
    //           }}
    //         >
    //           <a className="text-tab">{`${i18n.t(item?.value, {
    //             lng: lang,
    //           })}`}</a>
    //         </div>
    //       );
    //     })}
    //   </div>
    //   <div className="div-exam-test">
    //     {data?.map((item, index) => {
    //       return (
    //         <div key={index} className="div-test">
    //           <div className="div-head-test">
    //             <div className="div-score">
    //               <a className="title-score">Đúng: {item?.score} câu</a>

    //               <a className="title-score">
    //                 {item?.type_exam === "input"
    //                   ? "Bài kiểm tra đầu vào"
    //                   : item?.type_exam === "theory_input"
    //                   ? "Bài kiểm tra đầu vào lý thuyết"
    //                   : item?.type_exam === "training"
    //                   ? "Bài kiểm tra đào tạo"
    //                   : "Bài kiểm tra định kì"}
    //               </a>
    //             </div>
    //             <div className="div-time-test">
    //               <a className="title-time">
    //                 Thời gian bắt đầu:{" "}
    //                 {moment(item?.time_start).format("DD/MM/YYYY - HH:mm")}
    //               </a>
    //               <a className="title-time">
    //                 Thời gian kết thúc:{" "}
    //                 {moment(item?.time_end).format("DD/MM/YYYY - HH:mm")}
    //               </a>
    //             </div>
    //           </div>
    //           <div className="mt-3">
    //             {item?.answers?.map((iAnswers, idAnswers) => {
    //               return (
    //                 <div key={idAnswers} className="div-question-test">
    //                   <a className="title-question">
    //                     Câu {idAnswers + 1}: {iAnswers?.info_question?.title}
    //                   </a>
    //                   {iAnswers?.info_question?.choose?.map(
    //                     (choose, idChoose) => {
    //                       return (
    //                         <div key={idChoose} className="ml-3">
    //                           <a
    //                             className={
    //                               !iAnswers?.selected_answer &&
    //                               iAnswers?.isCorrect === false &&
    //                               choose?.isCorrect
    //                                 ? "text-answer-warning"
    //                                 : choose?.isCorrect
    //                                 ? "text-answer-true"
    //                                 : iAnswers?.selected_answer ===
    //                                     choose?._id && !choose?.isCorrect
    //                                 ? "text-answer-false"
    //                                 : "text-answer-default"
    //                             }
    //                           >
    //                             {choose?.answer}
    //                           </a>
    //                         </div>
    //                       );
    //                     }
    //                   )}
    //                 </div>
    //               );
    //             })}
    //           </div>
    //         </div>
    //       );
    //     })}
    //   </div>
    //   <div className="div-pagination p-2 mt-3">
    //     <a>
    //       {`${i18n.t("total", { lng: lang })}`}: {total}
    //     </a>
    //     <div>
    //       <Pagination
    //         current={currentPage}
    //         onChange={onChange}
    //         total={total}
    //         showSizeChanger={false}
    //         pageSize={1}
    //       />
    //     </div>
    //   </div>
    // </div>
    <>
      <div className="div-list-lesson-collaborator">
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
                <a className="text-title">{item?.title[lang]}</a>
                {item?.is_pass ? (
                  <img src={qualified} className="img" />
                ) : !item?.is_pass &&
                  item?.collaborator_times_submit == item?.times_submit ? (
                  <img src={unqualified} className="img" />
                ) : !item?.is_pass ? (
                  <i class="uil uil-padlock"></i>
                ) : null}
              </div>
              <a className="text-description">{item?.description[lang]}</a>

              {item?.is_pass && (
                <a
                  className="see-answer"
                  onClick={() =>
                    item?.is_pass
                      ? handleSeeInfoLesson(item?._id, item?.title[lang])
                      : null
                  }
                >
                  Xem câu trả lời <i class="uil uil-angle-right"></i>
                </a>
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
                  <div className="div-test">
                    <div className="div-head-test">
                      <div className="div-score">
                        <a className="title-score">
                          Đúng: {data[0]?.score} câu
                        </a>
                      </div>
                      <div className="div-time-test">
                        <a className="title-time">
                          Thời gian bắt đầu:{" "}
                          {moment(data[0]?.time_start).format(
                            "DD/MM/YYYY - HH:mm"
                          )}
                        </a>
                        <a className="title-time">
                          Thời gian kết thúc:{" "}
                          {moment(data[0]?.time_end).format(
                            "DD/MM/YYYY - HH:mm"
                          )}
                        </a>
                      </div>
                    </div>
                    <div className="mt-3">
                      {data[0]?.answers?.map((iAnswers, idAnswers) => {
                        return (
                          <div key={idAnswers} className="div-question-test">
                            <a className="title-question">
                              Câu {idAnswers + 1}:{" "}
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
                </div>
              </>
            }
          />
        </div>
      </div>
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
    value: "theory_input",
  },
  {
    id: 4,
    value: "periodic",
  },
  {
    id: 5,
    value: "training",
  },
];
