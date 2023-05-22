import { Drawer, Input, InputNumber } from "antd";
import _debounce from "lodash/debounce";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, List } from "reactstrap";
import { searchCollaborators } from "../../api/collaborator";
import { editMoneyPunishApi, getListPunishApi } from "../../api/topup";
import { errorNotify } from "../../helper/toast";
import CustomButton from "../customButton/customButton";
import "./editPunish.scss";
const { TextArea } = Input;

const EditPunish = ({ item, setDataT, setTotal, setIsLoading, iconEdit }) => {
  const [money, setMoney] = useState("");
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setName(item?.id_collaborator?.full_name);
    setId(item?._id);
    setMoney(item?.money);
    setNote(item?.note_admin);
  }, [item]);

  const searchCollaborator = useCallback(
    _debounce((value) => {
      setName(value);
      if (value) {
        searchCollaborators(value)
          .then((res) => setData(res.data))
          .catch((err) => console.log(err));
      } else if (id) {
        setData([]);
      } else {
        setData([]);
      }
      setId("");
    }, 500),
    []
  );

  const editMoney = useCallback(() => {
    setIsLoading(true);
    editMoneyPunishApi(id, {
      money: money,
      punish_note: note,
    })
      .then((res) => {
        setOpen(false);
        getListPunishApi(0, 20)
          .then((res) => {
            setDataT(res?.data);
            setTotal(res?.totalItem);
            setIsLoading(false);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  }, [id, money, note, setDataT, setTotal]);

  return (
    <>
      <a onClick={showDrawer}>{iconEdit}</a>

      <Drawer
        title="Chỉnh sửa lệnh phạt tiền"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <div className="modal-body">
          <Form>
            <div>
              <a>Cộng tác viên</a>
              <Input
                placeholder="Tìm kiếm theo số điện thoại"
                value={name}
                onChange={(e) => {
                  searchCollaborator(e.target.value);
                  setName(e.target.value);
                }}
              />
              {data.length > 0 && (
                <List type={"unstyled"} className="list-item">
                  {data?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        onClick={(e) => {
                          setId(item?._id);
                          setName(item?.full_name);
                          setData([]);
                        }}
                      >
                        <a>
                          {item?.full_name} - {item?.phone} - {item?.id_view}
                        </a>
                      </div>
                    );
                  })}
                </List>
              )}
            </div>

            <div className="div-money">
              <a>(*) Nhập số tiền</a>
              <InputNumber
                formatter={(value) =>
                  `${value}  đ`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
                }
                min={0}
                value={money}
                onChange={(e) => setMoney(e)}
                style={{ width: "100%" }}
              />
            </div>
            <div className="mt-2">
              <a>Nội dung</a>
              <TextArea
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <CustomButton
              title="Sửa"
              className="float-right btn-modal-edit-topup"
              type="button"
              onClick={editMoney}
            />
          </Form>
        </div>
      </Drawer>
    </>
  );
};

export default memo(EditPunish);
