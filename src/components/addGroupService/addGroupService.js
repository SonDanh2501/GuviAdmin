import { Drawer, Input, Select } from "antd";
import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { postFile } from "../../api/file";
import { createGroupServiceApi, getGroupServiceApi } from "../../api/service";
import { errorNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import CustomButton from "../customButton/customButton";
import "./addGroupService.scss";

const AddGroupService = ({ setIsLoading, setData, setTotal }) => {
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [type, setType] = useState("single");
  const [kind, setKind] = useState("");
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

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
    formData.append("multi-files", e.target.files[0]);
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setImgUrl(res[0]);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const createGroupSerive = useCallback(() => {
    setIsLoading(true);
    createGroupServiceApi({
      title: {
        vi: titleVN,
        en: titleEN,
      },
      description: {
        vi: descriptionVN,
        en: descriptionEN,
      },
      thumbnail: imgUrl,
      type: type,
      kind: kind,
    })
      .then((res) => {
        setIsLoading(false);
        getGroupServiceApi(0, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        setIsLoading(false);
      });
  }, [titleVN, titleEN, descriptionVN, descriptionEN, imgUrl, type, kind]);

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Thêm group-service"
        className="btn-group-service"
        type="button"
        onClick={showDrawer}
      />

      <Drawer
        title="Tạo group service"
        placement="right"
        onClose={onClose}
        open={open}
        headerStyle={{ height: 50 }}
      >
        <div>
          <a className="text-input-group-service">Tiêu đề</a>
          <Input
            placeholder="Vui lòng nhập tiêu đề Tiếng Việt"
            type="text"
            value={titleVN}
            onChange={(e) => setTitleVN(e.target.value)}
          />

          <Input
            style={{ marginTop: 5 }}
            placeholder="Vui lòng nhập tiêu đề Tiếng Anh"
            type="text"
            value={titleEN}
            onChange={(e) => setTitleEN(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a className="text-input-group-service">Mô tả</a>
          <Input
            placeholder="Vui lòng nhập chi tiết Tiếng Việt"
            type="text"
            value={descriptionVN}
            onChange={(e) => setDescriptionVN(e.target.value)}
          />

          <Input
            style={{ marginTop: 5 }}
            placeholder="Vui lòng nhập chi tiết Tiếng Anh"
            type="text"
            value={descriptionEN}
            onChange={(e) => setDescriptionEN(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a className="text-input-group-service">Kind</a>
          <Input
            placeholder="Vui lòng nhập vd: 'giup_viec_theo_gio'"
            type="text"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          />
        </div>

        <div className="mt-2">
          <a className="text-input-group-service">Loại dịch vụ</a>
          <Select
            style={{ width: "100%", marginTop: 5 }}
            value={type}
            onChange={(e) => setType(e)}
            options={[
              { value: "single", label: "Single" },
              { value: "multi_tab", label: "MultipleTab" },
            ]}
          />
        </div>

        <div className="mt-2">
          <a className="text-input-group-service">Hình ảnh</a>
          <Input
            id="exampleImage"
            name="image"
            type="file"
            accept={".jpg,.png,.jpeg"}
            className="input-group"
            onChange={onChangeThumbnail}
          />
          {imgThumbnail && <img src={imgThumbnail} className="img-thumbnail" />}
        </div>

        <CustomButton
          title="Thêm"
          className="float-right btn-add-group-service"
          type="button"
          onClick={createGroupSerive}
        />
      </Drawer>
    </>
  );
};

export default memo(AddGroupService);
