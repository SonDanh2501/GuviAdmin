import { Button, Checkbox, Drawer } from "antd";
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
      title: {
        vi: state?.titleVN,
        en: state?.titleEN,
      },
      description: {
        vi: state?.descriptionVN,
        en: state?.descriptionEN,
      },
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
          message: err,
        });
      });
  }, [state, tab]);

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
          title="Thêm"
          onClick={createLesson}
        />
      </Drawer>
    </div>
  );
};

export default AddLesson;
