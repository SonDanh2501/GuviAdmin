import { Drawer, Input, InputNumber, List } from "antd";
import _debounce from "lodash/debounce";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCollaborators } from "../../api/collaborator";
import { editMoneyPunishApi, getListPunishApi } from "../../api/topup";
import { errorNotify } from "../../helper/toast";
import CustomButton from "../customButton/customButton";
import "./editPunish.scss";
import { getLanguageState } from "../../redux/selectors/auth";
import i18n from "../../i18n";
import InputCustom from "../textInputCustom";

const EditPunish = ({ item, setDataT, setTotal, setIsLoading, iconEdit }) => {
  const [money, setMoney] = useState("");
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const lang = useSelector(getLanguageState);

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
        title={`${i18n.t("edit", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        open={open}
      >
        <div className="modal-body">
          <div>
            <InputCustom
              title={`${i18n.t("collaborator", { lng: lang })}`}
              placeholder={`${i18n.t("search", { lng: lang })}`}
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
            <InputCustom
              title={`${i18n.t("money", { lng: lang })}`}
              min={0}
              value={money}
              onChange={(e) => setMoney(e)}
              style={{ width: "100%" }}
            />
          </div>
          <div className="mt-2">
            <InputCustom
              title={`${i18n.t("content", { lng: lang })}`}
              min={0}
              value={money}
              onChange={(e) => setMoney(e)}
              style={{ width: "100%" }}
              textArea={true}
            />
          </div>

          <CustomButton
            title={`${i18n.t("edit", { lng: lang })}`}
            className="float-right btn-modal-edit-topup-drawer"
            type="button"
            onClick={editMoney}
          />
        </div>
      </Drawer>
    </>
  );
};

export default memo(EditPunish);
