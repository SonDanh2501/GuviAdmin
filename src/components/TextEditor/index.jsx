import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TextEditor = ({ value, onChange, height, disabled }) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(
    '<p><span class="ql-size-18px">- Khi có nhu cầu, Khách hàng sẽ đăng việc lên hệ thống. Bao gồm: địa chỉ, ngày, giờ bắt đầu làm việc và những yêu cầu khác...</span></p><p><strong class="ql-size-18px">Bước 1</strong><span class="ql-size-18px">: Đăng nhập vào ứng dụng bằng chính số điện thoại liên hệ của mình. Toàn bộ danh sách công việc sẽ hiển thị tại mục TRANG CHỦ.</span></p><p><strong class="ql-size-18px">Bước 2</strong><span class="ql-size-18px">: Chọn công việc muốn nhận và bấm "Chi tiết”.Lưu ý: Đọc thật kỹ thông tin chi tiết công việc, thời gian và địa chỉ làm việc trước khi quyết định chọn nhận việc.</span></p><p><strong class="ql-size-18px">Bước 3</strong><span class="ql-size-18px">: Bấm dấu ✓ chọn vào ô xác nhận “Tôi đã đọc kỹ và đồng ý nhận việc".&nbsp;</span></p><p><strong class="ql-size-18px">Bước 4</strong><span class="ql-size-18px">:</span><strong class="ql-size-18px"> </strong><span class="ql-size-18px">Chọn “Nhận việc”. Ứng dụng sẽ thông báo “Chúc mừng bạn đã nhận việc thành công”.Lưu ý: Phải xác nhận với khách hàng khi đã nhận việc. Gọi cho khách hàng, nếu không liên hệ được khách hàng các chị nhắn tin đơn giản cho khách rằng mình đã nhận việc và sẽ đến làm việc đúng giờ.</span></p>'
  );

  const [text, setText] = useState();

  const onEditorChange = function (a, editor) {
    // console.log(a);
    setContent(a);
    setText(editor.getContent({ format: "text" }));
    //console.log(editor);
  };
  return (
    <>
      <Editor
        apiKey="9mg1ru5n8187ozgs4retsbua5cmsueonulkbd871k46md1r6"
        onEditorChange={onChange}
        value={value}
        disabled={disabled}
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          height: height,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          statusbar: false,
        }}
      />
    </>
  );
};

export default TextEditor;
