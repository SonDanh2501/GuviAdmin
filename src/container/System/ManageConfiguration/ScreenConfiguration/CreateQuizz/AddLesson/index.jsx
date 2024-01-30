import { Button, Checkbox, Drawer, Select } from "antd";
import CustomButton from "../../../../../../components/customButton/customButton";
import { useCallback, useState } from "react";
import "./styles.scss";
import InputCustom from "../../../../../../components/textInputCustom";
import {
  createLessonApi,
  getListTrainningLessonApi,
} from "../../../../../../api/configuration";
import { errorNotify } from "../../../../../../helper/toast";
import TextEditor from "../../../../../../components/TextEditor";

const AddLesson = ({ setData, setTotal, setIsLoading, tab }) => {
  const [state, setState] = useState({
    lesson: 0,
    titleVN: "",
    titleEN: "",
    descriptionVN: "",
    descriptionEN: "",
    theory: "",
    link: "",
    type: "",
    totalCorrect: 0,
    totalExam: 0,
    timeSubmit: 0,
    isShowApp: false,
  });
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState({
    vi: "",
  });
  const [description, setDescription] = useState({
    vi: "",
  });
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const createLesson = useCallback(() => {
    setIsLoading(true);
    createLessonApi({
      lesson: state?.lesson,
      title: title,
      description: description,
      link_video: state?.link,
      type_training_lesson: tab === "" ? state?.type : tab,
      is_show_in_app: state?.isShowApp,
      times_submit: state?.timeSubmit,
      theory: state?.theory,
      total_correct_exam_pass: state?.totalCorrect,
      total_exam: state?.totalExam,
    })
      .then((res) => {
        setOpen(false);
        setIsLoading(false);
        getListTrainningLessonApi(0, 20, tab)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err?.message,
        });
      });
  }, [state, tab, title, description]);

  return (
    <div>
      <CustomButton title="Thêm bài học" onClick={showDrawer} />

      <Drawer
        title="Thêm bài học"
        placement="right"
        onClose={onClose}
        open={open}
        headerStyle={{ height: 40, padding: 0 }}
        width={420}
      >
        <InputCustom
          title="Thứ tự bài học"
          type="number"
          value={state?.lesson}
          onChange={(e) => setState({ ...state, lesson: e.target.value })}
        />
        <div className="div-input-title-quizz">
          <a className="title-input">Tiêu đề</a>
          {Object.entries(title).map(([key, value]) => {
            return (
              <div className="div-item-title-list">
                <InputCustom
                  placeholder={`Nhập nội dung tiêu đề Tiếng ${
                    key === "vi" ? "Việt" : key === "en" ? "Anh" : "Nhật"
                  }`}
                  onChange={(e) =>
                    setTitle({ ...title, [key]: e.target.value })
                  }
                  className="input-language"
                />
                {key !== "vi" && (
                  <i
                    className="uil uil-times-circle"
                    onClick={() => {
                      delete title[key];
                      setTitle({ ...title });
                    }}
                  ></i>
                )}
              </div>
            );
          })}
          <Select
            size="small"
            style={{ width: "40%", marginTop: 10 }}
            placeholder="Thêm ngôn ngữ"
            options={language_muti}
            onChange={(e) => {
              const language = (title[e] = "");
              setTitle({ ...title, language });
              delete title[language];
              setTitle({ ...title });
            }}
          />
        </div>
        <div className="div-input-title-quizz">
          <a className="title-input">Mô tả</a>
          {Object.entries(description).map(([key, value]) => {
            return (
              <div className="div-item-title-list">
                <InputCustom
                  placeholder={`Nhập nội dung mô tả Tiếng ${
                    key === "vi" ? "Việt" : key === "en" ? "Anh" : "Nhật"
                  }`}
                  onChange={(e) =>
                    setDescription({ ...description, [key]: e.target.value })
                  }
                  className="input-language"
                />
                {key !== "vi" && (
                  <i
                    className="uil uil-times-circle"
                    onClick={() => {
                      delete description[key];
                      setDescription({ ...description });
                    }}
                  ></i>
                )}
              </div>
            );
          })}
          <Select
            size="small"
            style={{ width: "40%", marginTop: 10 }}
            placeholder="Thêm ngôn ngữ"
            options={language_muti}
            onChange={(e) => {
              const language = (description[e] = "");
              setDescription({ ...description, language });
              delete description[language];
              setDescription({ ...description });
            }}
          />
        </div>
        <InputCustom
          title="Link video"
          value={state?.link}
          onChange={(e) => setState({ ...state, link: e.target.value })}
        />
        <InputCustom
          title="Số đáp án đúng"
          type="number"
          value={state?.totalCorrect}
          onChange={(e) => setState({ ...state, totalCorrect: e.target.value })}
        />
        <InputCustom
          title="Số câu hỏi của bài"
          type="number"
          value={state?.totalExam}
          onChange={(e) => setState({ ...state, totalExam: e.target.value })}
        />
        {tab === "" && (
          <InputCustom
            select={true}
            title="Loại bài"
            value={state?.type}
            onChange={(e) => setState({ ...state, type: e })}
            options={[
              { value: "input", label: "Đầu vào" },
              { value: "theory_input", label: "Lý thuyết" },
              { value: "periodic", label: "Định kì" },
              { value: "training", label: "Đào tạo" },
              { value: "premium", label: "Nâng cao" },
            ]}
          />
        )}
        <InputCustom
          title="Số lần nộp bài"
          value={state?.timeSubmit}
          type="number"
          onChange={(e) => setState({ ...state, timeSubmit: e.target.value })}
        />
        <div className="mt-2">
          <a>Lý thuyết</a>
          <TextEditor
            value={state?.theory}
            onChange={(e) => setState({ ...state, theory: e })}
          />
        </div>
        <Checkbox
          checked={state?.isShowApp}
          style={{ marginTop: 10 }}
          onChange={(e) => setState({ ...state, isShowApp: e.target.checked })}
        >
          Hiện thị trên ứng dụng
        </Checkbox>

        <CustomButton
          style={{ marginTop: 50, float: "right" }}
          title="Thêm"
          onClick={createLesson}
        />
      </Drawer>
    </div>
  );
};

export default AddLesson;

const language_muti = [
  { value: "en", label: "Tiếng Anh" },
  { value: "jp", label: "Tiếng Nhật" },
];
