import { Button } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  editAccountBankCollaborator,
  getCollaboratorsById,
} from "../../../../../../../api/collaborator";
import CustomTextInput from "../../../../../../../components/CustomTextInput/customTextInput";
import { errorNotify } from "../../../../../../../helper/toast";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import "./index.scss";

const BankAccount = ({ id }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const dispatch = useDispatch();

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
  }, [id]);

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
  }, [id, accountNumber, bankName, accountName]);

  return (
    <div>
      <a className="title-info">Thông tin tài khoản</a>
      <CustomTextInput
        classNameForm="mt-5"
        label={"Số tài khoản"}
        placeholder="Nhập số tài khoản"
        type="number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
      />
      <CustomTextInput
        label={"Tên ngân hàng"}
        placeholder="Nhập tên ngân hàng"
        type="text"
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
      />
      <CustomTextInput
        label={"Tên chủ thẻ"}
        placeholder="Nhập tên chủ thẻ"
        type="text"
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
      />

      <Button className="btn-update mt-5" onClick={updateAccountBank}>
        Cập nhật
      </Button>
    </div>
  );
};

export default BankAccount;
