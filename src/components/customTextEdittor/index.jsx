import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./index.scss";
const CustomTextEditor = ({ value, onChangeValue }) => {
  const modules = {
    toolbar: [
      // [{ header: [1, 2, false] }],
      // [{ font: [] }],
      // [{ align: [] }],
      // ["bold", "italic", "underline", "strike"],
      // [{ list: "ordered" }, { list: "bullet" }],
      // [{ color: [] }, { background: [] }],
      [{ header: [1, 2, false] }, { font: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
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
