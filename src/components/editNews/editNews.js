import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, FormGroup, Input, Label, Modal } from "reactstrap";
import { postFile } from "../../api/file";
import resizeFile from "../../helper/resizer";
import { errorNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import { updateNew } from "../../redux/actions/news";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./editNews.scss";

const EditNews = ({ state, setState, data }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("news");
  const [url, setUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    setTitle(data?.title);
    setShortDescription(data?.short_description);
    setImgThumbnail(data?.thumbnail);
    setUrl(data?.url);
    setType(data?.type);
  }, [data]);

  const onChangeThumbnail = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    try {
      if (e.target.files[0]) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgThumbnail(reader.result);
        });
        reader.readAsDataURL(e.target.files[0]);
      }
      const file = e.target.files[0];
      const image = await resizeFile(file);
      const formData = new FormData();
      formData.append("file", image);
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
    } catch (err) {
      console.log(err);
    }
  };
  const onEditNews = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(
      updateNew.updateNewRequest({
        id: data?._id,
        data: {
          title: title,
          short_description: shortDescription,
          thumbnail: imgThumbnail,
          url: url,
          type: type,
        },
      })
    );
  }, [data, title, shortDescription, imgThumbnail, url, type]);

  return (
    <>
      {/* Button trigger modal */}
      {/* Modal */}
      <Modal
        className="modal-dialog-centered"
        isOpen={state}
        toggle={() => setState(!state)}
      >
        <div className="modal-header">
          <h3 className="modal-title" id="exampleModalLabel">
            Sửa bài viết
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
              title="Sửa"
              className="float-right btn-modal"
              type="button"
              onClick={onEditNews}
            />
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default memo(EditNews);
