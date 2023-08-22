import { Button } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editAccountBankCollaborator,
  getCollaboratorsById,
} from "../../../../../../../api/collaborator";
import InputCustom from "../../../../../../../components/textInputCustom";
import { errorNotify } from "../../../../../../../helper/toast";
import i18n from "../../../../../../../i18n";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import "./index.scss";

const BankAccount = ({ id }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const dispatch = useDispatch();
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getCollaboratorsById(id)
      .then((res) => {
        setAccountNumber(res?.account_number);
        setBankName(res?.bank_name);
        setAccountName(res?.account_name);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id, dispatch]);

  const updateAccountBank = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    editAccountBankCollaborator(id, {
      account_number: accountNumber,
      bank_name: bankName,
      account_name: accountName,
    })
      .then((res) => {
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id, accountNumber, bankName, accountName, dispatch]);

  return (
    <div>
      <p className="title-info">{`${i18n.t("account_infomation", {
        lng: lang,
      })}`}</p>
      <InputCustom
        title={`${i18n.t("bank_account_number", {
          lng: lang,
        })}`}
        type="number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
      />

      <InputCustom
        title={`${i18n.t("bank_name", { lng: lang })}`}
        type="text"
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
      />

      <InputCustom
        title={`${i18n.t("account_name", {
          lng: lang,
        })}`}
        type="text"
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
      />

      <Button className="btn-update mt-5" onClick={updateAccountBank}>
        {`${i18n.t("update", {
          lng: lang,
        })}`}
      </Button>
    </div>
  );
};

export default BankAccount;
