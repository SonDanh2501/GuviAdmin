import { Drawer, List } from "antd";
import _debounce from "lodash/debounce";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollaborators } from "../../api/collaborator";
import { getReasonPunishApi } from "../../api/reasons";
import { getListPunishApi, punishMoneyCollaboratorApi } from "../../api/topup";
import { errorNotify, successNotify } from "../../helper/toast";
import i18n from "../../i18n";
import { loadingAction } from "../../redux/actions/loading";
import { getLanguageState } from "../../redux/selectors/auth";
import CustomButton from "../customButton/customButton";
import InputCustom from "../textInputCustom";
import "./index.scss";

const PunishMoneyCollaborator = ({ type, setDataT, setTotal }) => {
  const [money, setMoney] = useState(0);
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorMoney, setErrorMoney] = useState("");
  const [reason, setReason] = useState([]);
  const [idReason, setIdReason] = useState([]);
  const [id, setId] = useState("");
  const dispatch = useDispatch();
  const reasonOption = [];
  const lang = useSelector(getLanguageState);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  useEffect(() => {
    getReasonPunishApi(0, 20)
      .then((res) => {
        setReason(res?.data);
        setIdReason(res?.data[0]?._id);
        setNote(res?.data[0]?.note);
      })
      .catch((err) => {});
  }, []);

  reason?.map((item) => {
    reasonOption.push({
      value: item?._id,
      label: item?.title?.vi,
      note: item?.note,
    });
  });

  const searchCollaborator = useCallback(
    _debounce((value) => {
      setName(value);
      if (value) {
        fetchCollaborators(lang, 0, 100, "", value, "")
          .then((res) => {
            if (value === "") {
              setData([]);
            } else {
              setData(res.data);
            }
          })
          .catch((err) => {});
      } else if (id) {
        setData([]);
      } else {
        setData([]);
      }
      setId("");
    }, 500),
    []
  );

  const handleChangeReason = (value, label) => {
    setIdReason(value);
    setNote(label?.note);
  };

  const punishMoney = useCallback(() => {
    if (name === "" || money === "") {
      !name
        ? setErrorName("Vui lòng nhập thông tin")
        : setErrorMoney("Vui lòng nhập số tiền phạt");
    } else {
      dispatch(loadingAction.loadingRequest(true));
      punishMoneyCollaboratorApi(id, {
        money: money,
        punish_note: note,
        id_punish: idReason,
      })
        .then((res) => {
          setOpen(false);
          getListPunishApi(0, 20).then((res) => {
            setDataT(res?.data);
            setTotal(res?.totalItem);
          });
          successNotify({
            message: "Hoàn tất phạt tiền",
          });
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    }
  }, [id, money, note, name, idReason]);

  const onChangeMoney = (value) => {
    const deleteComma = value.replace(/,/g, "");
    console.log(deleteComma.toString());
    // setMoney(
    //   deleteComma.toString()?.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    // );
  };

  return (
    <>
      <CustomButton
        title={`${i18n.t("monetary_fine", { lng: lang })}`}
        className="btn-add-topup"
        type="button"
        onClick={showDrawer}
      />
      <Drawer
        title={`${i18n.t("monetary_fine", { lng: lang })}`}
        width={500}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
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
            {errorName && <a className="error">{errorName}</a>}
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
                        {" "}
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
              value={money}
              min={0}
              onChange={(e) => setMoney(e)}
              style={{ width: "100%" }}
              inputMoney={true}
            />
          </div>

          <div className="div-money">
            <InputCustom
              title={`${i18n.t("reason", { lng: lang })}`}
              style={{ width: "100%" }}
              value={idReason}
              onChange={handleChangeReason}
              options={reasonOption}
              select={true}
            />
          </div>

          <div className="mt-2">
            <InputCustom
              title={`${i18n.t("content", { lng: lang })}`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <CustomButton
            title={`${i18n.t("monetary_fine", { lng: lang })}`}
            className="float-left btn-add-monetary"
            type="button"
            onClick={punishMoney}
          />
        </div>
      </Drawer>
    </>
  );
};

export default memo(PunishMoneyCollaborator);
