import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./index.scss";
const CustomTextEditor = ({ value, onChangeValue }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      [{ font: [] }],
      [{ align: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
    ],
  };
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChangeValue}
      modules={modules}
    />
  );
};

export default CustomTextEditor;
