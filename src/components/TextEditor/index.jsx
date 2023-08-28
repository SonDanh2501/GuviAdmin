import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TextEditor = ({ value, onChange, height, disabled }) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState("");

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
        apiKey="6mu1mwz1zbe4ggfxkdyes9fsswtosxuef0ws7r59gnk9n4y3"
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
