import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./index.scss";

const CustomTextEditor = ({ value, onChangeValue }) => {
  const modules = {
    toolbar: [
      // [{ header: [1, 2, false] }],

      // [{ align: [] }],
      // ["bold", "italic", "underline", "strike"],
      // [{ list: "ordered" }, { list: "bullet" }],

      // [{ size: [], font: [] }],
      // ["bold", "italic", "underline", "strike", "blockquote"],
      // [{ color: [] }, { background: [] }],
      // [
      //   { list: "ordered" },
      //   { list: "bullet" },
      //   { indent: "-1" },
      //   { indent: "+1" },
      // ],
      // ["link", "image", "video"],
      // ["clean"],
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

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
