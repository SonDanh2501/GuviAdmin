import { Checkbox, Drawer } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  editLessonApi,
  getDetailsTrainningLessonApi,
  getListTrainningLessonApi,
} from "../../../../../../api/configuration";
import TextEditor from "../../../../../../components/TextEditor";
import CustomButton from "../../../../../../components/customButton/customButton";
import InputCustom from "../../../../../../components/textInputCustom";
import { errorNotify } from "../../../../../../helper/toast";
import "./styles.scss";

const EditLesson = ({ setData, setTotal, setIsLoading, data, tab }) => {
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
  const reactQuillRef = useRef();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getDetailsTrainningLessonApi(data?._id)
      .then((res) => {
        setState({
          ...state,
          lesson: res?.lesson,
          titleVN: res?.title?.vi,
          titleEN: res?.title?.en,
          descriptionVN: res?.description?.vi,
          descriptionEN: res?.description?.en,
          link: res?.link_video,
          type: res?.type_training_lesson,
          theory: res?.theory,
          timeSubmit: res?.times_submit,
          totalCorrect: res?.total_correct_exam_pass,
          totalExam: res?.total_exam,
          isShowApp: res?.is_show_in_app,
        });
      })
      .catch((err) => {});
  }, []);

  const editLesson = useCallback(() => {
    setIsLoading(true);
    editLessonApi(data?._id, {
      lesson: state?.lesson,
      title: {
        vi: state?.titleVN,
        en: state?.titleEN,
      },
      description: {
        vi: state?.descriptionVN,
        en: state?.descriptionEN,
      },
      link_video: state?.link,
      type_training_lesson: state?.type,
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
          message: err,
        });
      });
  }, [data, state]);

  return (
    <div>
      <a onClick={showDrawer}>Chỉnh sửa</a>

      <Drawer
        title="Chỉnh sửa bài học"
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
        <InputCustom
          title="Tiêu đề Tiếng Việt"
          value={state?.titleVN}
          onChange={(e) => setState({ ...state, titleVN: e.target.value })}
        />
        <InputCustom
          title="Tiêu đề Tiếng Anh"
          value={state?.titleEN}
          onChange={(e) => setState({ ...state, titleEN: e.target.value })}
        />
        <InputCustom
          title="Mô tả Tiếng Việt"
          value={state?.descriptionVN}
          onChange={(e) =>
            setState({ ...state, descriptionVN: e.target.value })
          }
        />
        <InputCustom
          title="Mô tả Tiếng Anh"
          value={state?.descriptionEN}
          onChange={(e) =>
            setState({ ...state, descriptionEN: e.target.value })
          }
        />
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
          title="Chỉnh sửa"
          onClick={editLesson}
        />
      </Drawer>
    </div>
  );
};

export default EditLesson;
