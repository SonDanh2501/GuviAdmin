import { Select } from "antd";
import InputCustom from "../textInputCustom";
import "./styles.scss";

const InputLanguage = (props) => {
  const { state, setState, textArea, className, disabled } = props;

  return (
    <div>
      {Object.entries(state).map(([key, value]) => {
        return (
          <div key={key} className="div-item-list-lang-input">
            <InputCustom
              title={`Tiếng ${
                key === "vi" ? "Việt" : key === "en" ? "Anh" : "Nhật"
              }`}
              placeholder={`Nhập nội dung mô tả Tiếng ${
                key === "vi" ? "Việt" : key === "en" ? "Anh" : "Nhật"
              }`}
              textArea={textArea}
              value={value}
              onChange={(e) => setState({ ...state, [key]: e.target.value })}
              className={className}
              disabled={disabled}
            />
            {key !== "vi" && (
              <i
                className="uil uil-times-circle"
                onClick={() => {
                  delete state[key];
                  setState({ ...state });
                }}
              ></i>
            )}
          </div>
        );
      })}
      <Select
        size="small"
        style={{ width: "45%", marginTop: 10 }}
        placeholder="Thêm ngôn ngữ"
        options={language_muti}
        onChange={(e) => {
          const language = (state[e] = "");
          setState({ ...state, language });
          delete state[language];
          setState({ ...state });
        }}
      />
    </div>
  );
};
export default InputLanguage;

const language_muti = [
  { value: "en", label: "Tiếng Anh" },
  { value: "jp", label: "Tiếng Nhật" },
];
