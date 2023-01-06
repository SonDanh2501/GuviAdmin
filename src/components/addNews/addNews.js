import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, FormGroup, Input, Label, Modal } from "reactstrap";
import { postFile } from "../../api/file";
import { loadingAction } from "../../redux/actions/loading";
import { createNew } from "../../redux/actions/news";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import { errorNotify } from "../../helper/toast";
import "./addNews.scss";

const AddNews = () => {
  const [state, setState] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("news");
  const [url, setUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");

  const dispatch = useDispatch();

  const onChangeThumbnail = (e) => {
    dispatch(loadingAction.loadingRequest(true));
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgThumbnail(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setImgThumbnail(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const addNews = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(
      createNew.createNewRequest({
        title: title,
        short_description: shortDescription,
        thumbnail: imgThumbnail,
        url: url,
        type: type,
      })
    );
  }, [dispatch, title, shortDescription, imgThumbnail, url, type]);

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Thêm bài viết"
        className="btn-add-new"
        type="button"
        onClick={() => setState(!state)}
      />
      {/* Modal */}
      <Modal
        className="modal-dialog-centered"
        isOpen={state}
        toggle={() => setState(!state)}
      >
        <div className="modal-header">
          <h3 className="modal-title" id="exampleModalLabel">
            Thêm bài viết
          </h3>
          <button className="btn-close" onClick={() => setState(!state)}>
            <i className="uil uil-times-square"></i>
          </button>
        </div>
        <div className="modal-body">
          <Form>
            <CustomTextInput
              label={"Tiêu đề"}
              id="exampleTitle"
              name="title"
              placeholder="Vui lòng nhập tiêu đề"
              type="textarea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              nChange={(e) => setTitle(e.target.value)}
            />
            <CustomTextInput
              label={"Mô tả ngắn"}
              id="exampleShort_description"
              name="short_description"
              placeholder="Vui lòng nhập mô tả ngắn"
              type="textarea"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
            <CustomTextInput
              label={"URL"}
              id="exampleURL"
              name="URL"
              placeholder="Vui lòng nhập url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <CustomTextInput
              label={"Type"}
              id="exampleType"
              name="Type"
              className="select-code-phone"
              type="select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              body={
                <>
                  <option value={"news"}>News</option>
                  <option value={"guvilover"}>GUVILove</option>
                </>
              }
            />
            <FormGroup>
              <Label for="exampleThumbnail">Thumbnail</Label>
              <Input
                id="exampleThumbnail"
                type="file"
                accept={".jpg,.png,.jpeg"}
                name="thumbnail"
                onChange={onChangeThumbnail}
              />
              {imgThumbnail && (
                <img src={imgThumbnail} className="img-thumbnail" />
              )}
            </FormGroup>

            <CustomButton
              title="Thêm"
              className="float-right btn-add-new"
              type="button"
              onClick={addNews}
            />
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default memo(AddNews);
