import { Button, Drawer, Input } from "antd";
import { useCallback, useState } from "react";
import "./styles.scss";
import {
  createReasonPunish,
  getReasonPunishApi,
} from "../../../../../../../api/reasons";
import { errorNotify } from "../../../../../../../helper/toast";

const CreateReasonPubnish = (props) => {
  const { setIsLoading, setData, setTotal } = props;
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

  const onCreatePunishReason = useCallback(() => {
    setIsLoading(true);
    createReasonPunish({
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
  }, [titleVN, titleEN, descriptionVN, descriptionEN, note]);
  return (
    <div>
      <Button type="primary" onClick={showDrawer} className="btn-create-punish">
        Tạo lí do
      </Button>
      <Drawer title="Tạo lí do" placement="right" onClose={onClose} open={open}>
        <div>
          <a>Tên lí do</a>
          <Input
            placeholder="Nhập tên Tiếng Việt"
            onChange={(e) => setTitleVN(e.target.value)}
          />
          <Input
            placeholder="Nhập tên Tiếng Anh"
            style={{ marginTop: 5 }}
            onChange={(e) => setTitleEN(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a>Tên mô tả</a>
          <Input
            placeholder="Nhập tên Tiếng Việt"
            onChange={(e) => setDescriptionVN(e.target.value)}
          />
          <Input
            placeholder="Nhập tên Tiếng Anh"
            style={{ marginTop: 5 }}
            onChange={(e) => setDescriptionEN(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a>Ghi chú</a>
          <Input
            placeholder="Nhập ghi chú"
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <Button
          className="btn-add-punish-reason"
          onClick={onCreatePunishReason}
        >
          Tạo
        </Button>
      </Drawer>
    </div>
  );
};

export default CreateReasonPubnish;
