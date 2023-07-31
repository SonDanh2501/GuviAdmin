import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.scss";

const CustomTextEditor = ({
  value,
  onChangeValue,
  style,
  ref,
  defaultValue,
  bounds,
}) => {
  var Size = Quill.import("formats/size");
  Size.whitelist = [
    "9px",
    "10px",
    "11px",
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "22px",
  ];
  Quill.register(Size, true);
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

      [{ size: Size.whitelist }], // custom dropdown
      // [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
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
      style={style}
      ref={ref}
      defaultValue={defaultValue}
      bounds={bounds}
    />
  );
};

export default CustomTextEditor;
