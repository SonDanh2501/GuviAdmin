import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { Drawer, Input, Select } from "antd";
import { postFile } from "../../api/file";
import { createServiceApi, getServiceApi } from "../../api/service";
import { errorNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import CustomButton from "../customButton/customButton";
import "./addService.scss";

const AddService = (props) => {
  const { id, setData, setTotal, setIsLoading } = props;
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [imgUrl, setImgUrl] = useState("");
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
        setImgUrl(res);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
      });
  };

  const createSerive = useCallback(() => {
    setIsLoading(true);
    createServiceApi({
      title: {
        vi: titleVN,
        en: titleEN,
      },
      description: {
        vi: descriptionVN,
        en: descriptionEN,
      },
      thumbnail: imgUrl,
      id_group_service: id,
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
    imgUrl,
    position,
    kind,
    type,
    id,
    typeLoop,
    typePage,
    timeMax,
    timeMin,
  ]);

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Thêm dịch vụ"
        className="btn-add-service"
        type="button"
        onClick={showDrawer}
      />
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
            onChange={(e) => setTitleVN(e.target.value)}
          />
          <Input
            className="input-enlish"
            placeholder="Nhập tiêu đề tiếng Anh"
            onChange={(e) => setTitleEN(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a className="title-service">Mô tả</a>
          <Input
            placeholder="Nhập mô tả tiếng Việt"
            onChange={(e) => setDescriptionVN(e.target.value)}
          />
          <Input
            className="input-enlish"
            placeholder="Nhập mô tả tiếng Anh"
            onChange={(e) => setDescriptionEN(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a className="title-service">Vị trí</a>
          <Input
            placeholder="Nhập vị trí"
            type="number"
            min={0}
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
            onChange={(e) => setTimeMax(e.target.value)}
          />
          <a className="title-service mt-2">Thời gian làm tối thiểu</a>
          <Input
            placeholder="Nhập thời gian làm tối thiểu"
            type="number"
            min={0}
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
          title="Thêm"
          className="float-right btn-add-service-drawer"
          type="button"
          onClick={createSerive}
        />
      </Drawer>
    </>
  );
};

export default AddService;
