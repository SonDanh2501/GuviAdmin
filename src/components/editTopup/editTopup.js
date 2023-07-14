import { Drawer, Input, List } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollaborators } from "../../api/collaborator";
import {
  getTopupCollaboratorApi,
  updateMoneyCollaboratorApi,
} from "../../api/topup";
import { errorNotify } from "../../helper/toast";
import i18n from "../../i18n";
import { loadingAction } from "../../redux/actions/loading";
import { getRevenueCollaborator } from "../../redux/actions/topup";
import { getLanguageState } from "../../redux/selectors/auth";
import CustomButton from "../customButton/customButton";
import InputCustom from "../textInputCustom";
import "./editTopup.scss";
const { TextArea } = Input;

const EditTopup = ({ iconEdit, item, type, setDataT, setTotal }) => {
  const [money, setMoney] = useState("");
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const dispatch = useDispatch();
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
    setNote(item?.transfer_note);
  }, [item]);

  const searchCollaborator = useCallback(
    _debounce((value) => {
      setName(value);
      if (value) {
        fetchCollaborators(lang, 0, 20, "", value)
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
    dispatch(loadingAction.loadingRequest(true));
    updateMoneyCollaboratorApi(id, {
      money: money,
      transfer_note: note,
    })
      .then((res) => {
        setOpen(false);
        getTopupCollaboratorApi(0, 20, type)
          .then((res) => {
            setDataT(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
        dispatch(
          getRevenueCollaborator.getRevenueCollaboratorRequest({
            startDate: moment().startOf("year").toISOString(),
            endDate: moment(new Date()).toISOString(),
          })
        );

        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id, money, note, type, setDataT, setTotal]);

  return (
    <>
      <div className={"btn-edit-topup"} onClick={showDrawer}>
        {iconEdit}
      </div>

      <Drawer
        title={`${i18n.t("edit", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        open={open}
        headerStyle={{ height: 50 }}
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
              inputMoney={true}
            />
          </div>

          <div className="mt-2">
            <InputCustom
              title={`${i18n.t("content", { lng: lang })}`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
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

export default memo(EditTopup);
