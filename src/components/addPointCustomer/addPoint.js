import { Drawer, List } from "antd";
import _debounce from "lodash/debounce";
import React, { memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { searchCustomersApi } from "../../api/customer";
import {
  getTopupPointCustomerApi,
  topupPointCustomerApi,
} from "../../api/topup";
import { errorNotify, successNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import CustomButton from "../customButton/customButton";
import InputCustom from "../textInputCustom";
import "./addPoint.scss";
import { getLanguageState } from "../../redux/selectors/auth";
import i18n from "../../i18n";

const AddPoint = ({ start, setDataL, setTotal }) => {
  const [state, setState] = useState(false);
  const [point, setPoint] = useState("");
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorPoint, setErrorPoint] = useState("");
  const [wallet, setWallet] = useState("");
  const [id, setId] = useState("");
  const dispatch = useDispatch();
  const lang = useSelector(getLanguageState);

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  const searchCustomer = useCallback(
    _debounce((value) => {
      setName(value);
      if (value) {
        searchCustomersApi(value)
          .then((res) => {
            if (value === "") {
              setData([]);
            } else {
              setData(res.data);
            }
          })
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

  const addMoney = useCallback(() => {
    if (name === "" || point === "") {
      !name
        ? setErrorName("Vui lòng nhập thông tin")
        : setErrorPoint("Vui lòng nhập số điểm cần nạp");
    } else {
      dispatch(loadingAction.loadingRequest(true));
      topupPointCustomerApi(id, {
        value: point,
        note: note,
        type_point: wallet,
      })
        .then((res) => {
          getTopupPointCustomerApi(start, 20)
            .then((res) => {
              setDataL(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
          setNote("");
          setPoint(0);
          setWallet("");
          setId("");
          setName("");
          setOpen(false);
          successNotify({
            message: `${i18n.t("recharge_point_successfully", { lng: lang })}`,
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
  }, [id, point, note, name, wallet, start, setDataL, setTotal, lang]);

  return (
    <>
      <CustomButton
        title={`${i18n.t("topup_point", { lng: lang })}`}
        className="btn-add-topup"
        type="button"
        // onClick={() => setState(!state)}
        onClick={showDrawer}
      />
      <Drawer
        title={`${i18n.t("topup_point", { lng: lang })}`}
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
              title={`${i18n.t("customer", { lng: lang })}`}
              placeholder={`${i18n.t("search", { lng: lang })}`}
              type="text"
              value={name}
              onChange={(e) => {
                searchCustomer(e.target.value);
                setName(e.target.value);
              }}
              error={errorName}
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
                        {" "}
                        {item?.full_name} - {item?.phone} - {item?.id_view}
                      </a>
                    </div>
                  );
                })}
              </List>
            )}
          </div>

          <InputCustom
            title={`${i18n.t("score", { lng: lang })}`}
            type="number"
            min={0}
            value={point}
            onChange={(e) => setPoint(e.target.value)}
          />

          <InputCustom
            title={`${i18n.t("content", { lng: lang })}`}
            type="textarea"
            min={0}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            textArea={true}
          />

          <InputCustom
            title={`${i18n.t("point_type", { lng: lang })}`}
            style={{ width: "100%" }}
            value={wallet}
            onChange={(e) => setWallet(e)}
            select={true}
            options={[
              {
                value: "point",
                label: `${i18n.t("point_type", { lng: lang })}`,
              },
              {
                value: "rank_point",
                label: `${i18n.t("membership_points", { lng: lang })}`,
              },
            ]}
          />

          <CustomButton
            title={`${i18n.t("topup_point", { lng: lang })}`}
            className="float-right btn-add-t"
            type="button"
            onClick={addMoney}
          />
        </div>
      </Drawer>
    </>
  );
};

export default memo(AddPoint);
