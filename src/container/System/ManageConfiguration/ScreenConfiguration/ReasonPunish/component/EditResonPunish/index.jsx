import { Button, Drawer, Input } from "antd";
import { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import {
  createReasonPunish,
  editReasonPunish,
  getDetailsReasonPunishApi,
  getReasonPunishApi,
} from "../../../../../../../api/reasons";
import { errorNotify } from "../../../../../../../helper/toast";

const EditReasonPubnish = (props) => {
  const { id, setIsLoading, setData, setTotal } = props;
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getDetailsReasonPunishApi(id)
      .then((res) => {
        setTitleVN(res?.title?.vi);
        setTitleEN(res?.title?.en);
        setDescriptionVN(res?.description?.vi);
        setDescriptionEN(res?.description?.en);
        setNote(res?.note);
      })
      .catch((err) => {});
  }, [id]);

  const onEditPunishReason = useCallback(() => {
    setIsLoading(true);
    editReasonPunish(id, {
      title: {
        vi: titleVN,
        en: titleEN,
      },
      description: {
        vi: descriptionVN,
        en: descriptionEN,
      },
      note: note,
      apply_user: "collaborator",
    })
      .then((res) => {
        setIsLoading(false);
        setOpen(false);
        getReasonPunishApi(0, 20).then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        });
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  }, [id, titleVN, titleEN, descriptionVN, descriptionEN, note]);
  return (
    <div>
      <a onClick={showDrawer}>Chỉnh sửa</a>
      <Drawer title="Tạo lí do" placement="right" onClose={onClose} open={open}>
        <div>
          <a>Tên lí do</a>
          <Input
            placeholder="Nhập tên Tiếng Việt"
            value={titleVN}
            onChange={(e) => setTitleVN(e.target.value)}
          />
          <Input
            placeholder="Nhập tên Tiếng Anh"
            value={titleEN}
            style={{ marginTop: 5 }}
            onChange={(e) => setTitleEN(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a>Tên mô tả</a>
          <Input
            value={descriptionVN}
            placeholder="Nhập tên Tiếng Việt"
            onChange={(e) => setDescriptionVN(e.target.value)}
          />
          <Input
            value={descriptionEN}
            placeholder="Nhập tên Tiếng Anh"
            style={{ marginTop: 5 }}
            onChange={(e) => setDescriptionEN(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a>Ghi chú</a>
          <Input
            value={note}
            placeholder="Nhập ghi chú"
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <Button className="btn-add-punish-reason" onClick={onEditPunishReason}>
          Sửa
        </Button>
      </Drawer>
    </div>
  );
};

export default EditReasonPubnish;
