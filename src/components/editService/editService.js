import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { postFile } from "../../api/file";
import {
  createServiceApi,
  editServiceApi,
  getServiceApi,
} from "../../api/service";
import { loadingAction } from "../../redux/actions/loading";
import { createGroupServiceAction } from "../../redux/actions/service";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./editService.scss";
import { Drawer, Input, Select } from "antd";
import { errorNotify } from "../../helper/toast";

const EditService = (props) => {
  const { id, setData, setTotal, data, setIsLoading } = props;
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [position, setPosition] = useState("");
  const [type, setType] = useState("single");
  const [kind, setKind] = useState("");
  const [typeLoop, setTypeLoop] = useState("none");
  const [typePage, setTypePage] = useState("one_page");

  const [timeMin, setTimeMin] = useState("");
  const [timeMax, setTimeMax] = useState("");

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
    setPosition(data?.position);
    setType(data?.type);
    setKind(data?.kind);
    setTypeLoop(data?.type_loop_or_schedule);
    setTypePage(data?.type_page);
    setTimeMax(data?.max_estimate);
    setTimeMin(data?.minimum_time_order);
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
    formData.append("file", e.target.files[0]);
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        dispatch(loadingAction.loadingRequest(false));
        setImgThumbnail(res);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
      });
  };

  const editSerive = useCallback(() => {
    setIsLoading(true);
    editServiceApi(data?._id, {
      title: {
        vi: titleVN,
        en: titleEN,
      },
      description: {
        vi: descriptionVN,
        en: descriptionEN,
      },
      thumbnail: imgThumbnail,
      position: position,
      type: type,
      kind: kind,
      type_loop_or_schedule: typeLoop,
      is_auto_order: false,
      time_repeat: 1,
      time_schedule: [],
      note: "",
      type_page: typePage,
      max_estimate: timeMax,
      minimum_time_order: timeMin,
      type_partner: "collaborator",
    })
      .then((res) => {
        setIsLoading(false);
        setOpen(false);
        getServiceApi(id)
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
    titleVN,
    titleEN,
    descriptionVN,
    descriptionEN,
    imgThumbnail,
    position,
    kind,
    type,
    id,
    typeLoop,
    typePage,
    timeMax,
    timeMin,
    data,
  ]);

  return (
    <>
      {/* Button trigger modal */}
      {/* <CustomButton
        title="Thêm dịch vụ"
        className="btn-add-service"
        type="button"
        onClick={showDrawer}
      /> */}
      <a onClick={showDrawer}>Chỉnh sửa</a>
      <Drawer
        title="Thêm dịch vụ"
        width={500}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <div>
          <a className="title-service">Tiêu đề</a>
          <Input
            placeholder="Nhập tiêu đề tiếng Việt"
            value={titleVN}
            onChange={(e) => setTitleVN(e.target.value)}
          />
          <Input
            className="input-enlish"
            value={titleEN}
            placeholder="Nhập tiêu đề tiếng Anh"
            onChange={(e) => setTitleEN(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a className="title-service">Mô tả</a>
          <Input
            placeholder="Nhập mô tả tiếng Việt"
            value={descriptionVN}
            onChange={(e) => setDescriptionVN(e.target.value)}
          />
          <Input
            className="input-enlish"
            placeholder="Nhập mô tả tiếng Anh"
            value={descriptionEN}
            onChange={(e) => setDescriptionEN(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a className="title-service">Vị trí</a>
          <Input
            placeholder="Nhập vị trí"
            type="number"
            min={0}
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a className="title-service">Loại</a>
          <Select
            style={{ width: "100%" }}
            value={type}
            onChange={(e) => setType(e)}
            options={[
              { value: "single", label: "Single" },
              { value: "loop", label: "Loop" },
              { value: "schedule", label: "Schedule" },
            ]}
          />
        </div>
        <div className="mt-2">
          <a className="title-service">Kind</a>
          <Input
            placeholder="Nhập nội dung"
            type="text"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a className="title-service">Lặp lại theo</a>
          <Select
            style={{ width: "100%" }}
            value={typeLoop}
            onChange={(e) => setTypeLoop(e)}
            options={[
              { value: "none", label: "Không có" },
              { value: "week", label: "Tuần" },
              { value: "month", label: "Tháng" },
            ]}
          />
        </div>
        <div className="mt-2">
          <a className="title-service">Số trang</a>
          <Select
            style={{ width: "100%" }}
            value={typePage}
            onChange={(e) => setTypePage(e)}
            options={[
              { value: "one_page", label: "Một trang" },
              { value: "two_page", label: "Hai trang" },
            ]}
          />
        </div>
        <div className="mt-2">
          <a className="title-service">Thời gian làm tối đa</a>
          <Input
            placeholder="Nhập thời gian làm tối đa"
            type="number"
            min={0}
            value={timeMax}
            onChange={(e) => setTimeMax(e.target.value)}
          />
          <a className="title-service mt-2">Thời gian làm tối thiểu</a>
          <Input
            placeholder="Nhập thời gian làm tối thiểu"
            type="number"
            min={0}
            value={timeMin}
            onChange={(e) => setTimeMin(e.target.value)}
          />
        </div>
        {/* <div className="mt-2">
          <a className="title-service">Người cộng tác</a>
          <Select
            style={{ width: "100%" }}
            options={[
              { value: "collaborator", label: "Cộng tác viên" },
              { value: "group_collaborator", label: "Nhóm cộng tác viên" },
              { value: "partner", label: "Phục vụ" },
            ]}
          />
        </div> */}
        <div className="mt-2">
          <a className="title-service">Thumbnail</a>
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
          title="Sửa"
          className="float-right btn-add-service-drawer"
          type="button"
          onClick={editSerive}
        />
      </Drawer>
    </>
  );
};

export default EditService;
