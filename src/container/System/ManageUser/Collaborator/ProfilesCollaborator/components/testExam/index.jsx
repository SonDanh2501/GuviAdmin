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
import "./index.scss";
import { Image } from "antd";
import icons from "../../../../../../../utils/icons";
// import { } from "react-icons/io5";

const {IoCheckmark, IoLockClosed   } = icons
const TestExam = (props) => {
  const { id, collaboratorData } = props;
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
          message: err?.message,
        });
      });
  };

  return (
    <div className="collaborator-exam">
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
      <div className="collaborator-exam__lesson">
        {dataLesson?.map((item, index) => {
          return (
            <div className="collaborator-exam__lesson--child">
              {/* Container 1 */}
              <div className="collaborator-exam__lesson--child-header">
                {/* Tên bài kiểm tra */}
                <span className="collaborator-exam__lesson--child-header-name">
                  {item?.title[lang]}
                </span>
                <div
                  onClick={() =>
                    onPassLesson(item?._id, item?.type_training_lesson)
                  }
                  className={`collaborator-exam__lesson--child-header-status ${
                    item?.is_pass ? "& done" : "& not-done"
                  }`}
                >
                  {/* {item} */}
                  {item?.is_pass ? (
                    <IoCheckmark color="green" />
                  ) : (
                    <IoLockClosed color="gray" />
                  )}
                </div>
              </div>
              {/* Container 2 */}
              <div className="collaborator-exam__lesson--child-subcontent">
                <span>{item?.description[lang]}</span>
              </div>
              {/* Container 3 */}
              <div className="collaborator-exam__lesson--child-owner">
                {/* Avatar */}
                <img
                  className="collaborator-exam__lesson--child-owner-avatar"
                  src={collaboratorData?.avatar}
                ></img>
                {/* Tên và thời gian thực hiện, nút xem chi tiết */}
                <div className="collaborator-exam__lesson--child-owner-body">
                  <div className="collaborator-exam__lesson--child-owner-body-info">
                    <span className="collaborator-exam__lesson--child-owner-body-info-name">
                      {collaboratorData?.full_name}
                    </span>
                    <span className="collaborator-exam__lesson--child-owner-body-info-time">
                      Thời gian kết thúc:{" "}
                      {moment(data[0]?.time_end).format("HH:mm - DD MMMM YYYY")}
                    </span>
                  </div>
                  <div className="collaborator-exam__lesson--child-owner-body-more-detail">
                    <span
                      onClick={() =>
                        handleSeeInfoLesson(item?._id, item?.title[lang])
                      }
                    >
                      Chi tiết <i class="uil uil-angle-right"></i>
                    </span>
                  </div>
                </div>
              </div>
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
    </div>
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
