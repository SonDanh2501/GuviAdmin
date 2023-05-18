import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomButton from "../customButton/customButton";
import "./editReason.scss";
import { Drawer, Input, Select } from "antd";
import { fetchReasons, updateReason } from "../../api/reasons";
import { errorNotify } from "../../helper/toast";

const EditReason = (props) => {
  const { data, setIsLoading, setData, setTotal, startPage } = props;
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [note, setNote] = useState("");
  const [applyUser, setApplyUser] = useState("");

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
    setApplyUser(data?.apply_user);
    setNote(data?.note);
  }, [data]);

  const editReason = useCallback(() => {
    setIsLoading(true);
    updateReason(data?._id, {
      title: {
        vi: titleVN,
        en: titleEN,
      },
      description: {
        vi: descriptionVN,
        en: descriptionEN,
      },
      apply_user: applyUser,
      note: note,
    })
      .then((res) => {
        setIsLoading(false);
        setOpen(false);
        fetchReasons(startPage, 10)
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
    applyUser,
    note,
    data,
    startPage,
  ]);

  return (
    <>
      <a onClick={showDrawer}>Chỉnh sửa</a>
      <Drawer
        title="Chỉnh sửa Group service"
        placement="right"
        onClose={onClose}
        width={400}
        open={open}
      >
        <div>
          <a className="title-reason">Tên lý do huỷ việc</a>
          <Input
            placeholder="Vui lòng nhập tên lí do Tiếng Việt"
            type="text"
            value={titleVN}
            onChange={(e) => setTitleVN(e.target.value)}
          />
          <Input
            placeholder="Vui lòng nhập tên lí do Tiếng Anh"
            type="text"
            value={titleEN}
            onChange={(e) => setTitleEN(e.target.value)}
            style={{ marginTop: 5 }}
          />
        </div>
        <div className="mt-2">
          <a className="title-reason">Mô tả</a>
          <Input
            placeholder="Vui lòng nhập tên lí do Tiếng Việt"
            type="text"
            value={descriptionVN}
            onChange={(e) => setDescriptionVN(e.target.value)}
          />
          <Input
            placeholder="Vui lòng nhập tên lí do Tiếng Anh"
            type="text"
            value={descriptionEN}
            onChange={(e) => setDescriptionEN(e.target.value)}
            style={{ marginTop: 5 }}
          />
        </div>
        <div className="mt-2">
          <a className="title-reason">Áp dụng</a>
          <Select
            value={applyUser}
            style={{ width: "100%" }}
            onChange={(e) => setApplyUser(e)}
            options={[
              { value: "customer", label: "Khách hàng" },
              { value: "collaborator", label: "Cộng tác viên" },
              { value: "admin", label: "Admin" },
              { value: "system", label: "Hệ thống" },
            ]}
          />
        </div>

        <div className="mt-2">
          <a className="title-reason">Ghi chú</a>
          <Input
            placeholder="Vui lòng nhập ghi chú"
            type="textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <CustomButton
          title="Chỉnh sửa"
          className="float-right btn-modal-add-reason"
          type="button"
          onClick={editReason}
        />
      </Drawer>
    </>
  );
};

export default memo(EditReason);
