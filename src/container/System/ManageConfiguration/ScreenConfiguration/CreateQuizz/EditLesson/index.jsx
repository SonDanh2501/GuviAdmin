import { Button, Checkbox, Drawer } from "antd";
import CustomButton from "../../../../../../components/customButton/customButton";
import { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import InputCustom from "../../../../../../components/textInputCustom";
import {
  createLessonApi,
  editLessonApi,
  getListTrainningLessonApi,
} from "../../../../../../api/configuration";
import { errorNotify } from "../../../../../../helper/toast";
import CustomTextEditor from "../../../../../../components/customTextEdittor";

const EditLesson = ({ setData, setTotal, setIsLoading, data, tab }) => {
  const [lesson, setLesson] = useState();
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("");
  const [timeSubmit, setTimeSubmit] = useState("");
  const [isShowApp, setIsShowApp] = useState(false);
  const [theory, setTheory] = useState("");
  const [totalCorrect, setTotalCorrect] = useState("");
  const [totalExam, setTotalExam] = useState("");
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setLesson(data?.lesson);
    setTitleVN(data?.title?.vi);
    setTitleEN(data?.title?.en);
    setDescriptionVN(data?.description?.vi);
    setDescriptionEN(data?.description?.en);
    setLink(data?.link_video);
    setType(data?.type_training_lesson);
    setIsShowApp(data?.is_show_in_app);
    setTimeSubmit(data?.times_submit);
    setTheory(data?.theory);
    setTotalCorrect(data?.total_correct_exam_pass);
    setTotalExam(data?.total_exam);
  }, [data]);

  const editLesson = useCallback(() => {
    setIsLoading(true);
    editLessonApi(data?._id, {
      lesson: lesson,
      title: {
        vi: titleVN,
        en: titleEN,
      },
      description: {
        vi: descriptionVN,
        en: descriptionEN,
      },
      link_video: link,
      type_training_lesson: type,
      is_show_in_app: isShowApp,
      times_submit: timeSubmit,
      theory: theory,
      total_correct_exam_pass: totalCorrect,
      total_exam: totalExam,
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
  }, [
    lesson,
    titleVN,
    titleEN,
    descriptionVN,
    descriptionEN,
    link,
    type,
    isShowApp,
    timeSubmit,
    data,
    theory,
    totalCorrect,
    totalExam,
  ]);

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
          value={lesson}
          onChange={(e) => setLesson(e.target.value)}
        />
        <InputCustom
          title="Tiêu đề Tiếng Việt"
          value={titleVN}
          onChange={(e) => setTitleVN(e.target.value)}
        />
        <InputCustom
          title="Tiêu đề Tiếng Anh"
          value={titleEN}
          onChange={(e) => setTitleEN(e.target.value)}
        />
        <InputCustom
          title="Mô tả Tiếng Việt"
          value={descriptionVN}
          onChange={(e) => setDescriptionVN(e.target.value)}
        />
        <InputCustom
          title="Mô tả Tiếng Anh"
          value={descriptionEN}
          onChange={(e) => setDescriptionEN(e.target.value)}
        />
        <InputCustom
          title="Link video"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <InputCustom
          title="Số đáp án đúng"
          type="number"
          value={totalCorrect}
          onChange={(e) => setTotalCorrect(e.target.value)}
        />
        <InputCustom
          title="Số câu hỏi của bài"
          type="number"
          value={totalExam}
          onChange={(e) => setTotalExam(e.target.value)}
        />
        {tab === "" && (
          <InputCustom
            select={true}
            title="Loại bài"
            value={type}
            onChange={(e) => setType(e)}
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
          value={timeSubmit}
          type="number"
          onChange={(e) => setTimeSubmit(e.target.value)}
        />
        <div className="mt-2">
          <a>Lý thuyết</a>
          <CustomTextEditor value={theory} onChangeValue={setTheory} />
        </div>
        <Checkbox
          checked={isShowApp}
          style={{ marginTop: 10 }}
          onChange={(e) => setIsShowApp(e.target.checked)}
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
