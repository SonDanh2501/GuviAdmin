import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Drawer, Input, Select } from "antd";
import { postFile } from "../../api/file";
import { getGroupServiceApi, updateGroupServiceApi } from "../../api/service";
import { errorNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import CustomButton from "../customButton/customButton";
import "./editGroupService.scss";

const EditGroupService = (props) => {
  const { data, setData, setTotal, setIsLoading } = props;
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

  useEffect(() => {
    setTitleVN(data?.title?.vi);
    setTitleEN(data?.title?.en);
    setDescriptionVN(data?.description?.vi);
    setDescriptionEN(data?.description?.en);
    setImgThumbnail(data?.thumbnail);
    setType(data?.type);
    setKind(data?.kind);
  }, [data]);
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
        dispatch(loadingAction.loadingRequest(false));
        setImgUrl(res[0]);
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
        errorNotify({
          message: err,
        });
      });
  };

  const editGroupSerive = useCallback(() => {
    setIsLoading(true);
    updateGroupServiceApi(data?._id, {
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
    })
      .then((res) => {
        setOpen(false);
        setIsLoading(false);
        getGroupServiceApi(0, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  }, [
    dispatch,
    titleVN,
    titleEN,
    descriptionVN,
    descriptionEN,
    imgUrl,
    type,
    data,
    kind,
  ]);

  return (
    <>
      <a onClick={showDrawer}>Chỉnh sửa</a>
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
          className="float-right btn-edit-service"
          type="button"
          onClick={editGroupSerive}
        />
      </Drawer>
    </>
  );
};

export default memo(EditGroupService);
