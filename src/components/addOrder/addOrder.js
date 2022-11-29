import React, { memo, useCallback, useEffect, useState } from "react";
import { Modal } from "reactstrap";
import {
  getGroupServiceApi,
  getOptionalServiceByIdApi,
  getServiceByIdApi,
} from "../../api/service";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./addOrder.scss";

const AddOrder = () => {
  const [state, setState] = useState(false);
  const [groupService, setGroupService] = useState([]);
  useEffect(() => {
    getGroupServiceApi()
      .then((res) => setGroupService(res.data))
      .catch((err) => console.log(err));
  }, []);

  const onChangeService = useCallback((id) => {
    getServiceByIdApi(id)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Thêm đơn hàng"
        className="btn-modal"
        type="button"
        onClick={() => setState(!state)}
      />

      {/* Modal */}
      <Modal fullscreen={true} fade={true} isOpen={state} size="lg">
        <div className="modal-header">
          <h3 className="modal-title" id="exampleModalLabel">
            Thêm đơn hàng
          </h3>
          <button className="btn-close" onClick={() => setState(!state)}>
            <i className="uil uil-times-square"></i>
          </button>
        </div>
        <div className="modal-body">
          <CustomTextInput
            label={"Loại dịch vụ"}
            id="exampleType"
            name="Type"
            className="select-code-phone"
            type="select"
            // value={type}
            onChange={(e) => onChangeService(e.target.value)}
            body={
              <>
                <option value={""}>Vui lòng chọn</option>
                {groupService.map((item, index) => {
                  return <option value={item?._id}>{item?.title?.vi}</option>;
                })}
              </>
            }
          />
        </div>
      </Modal>
    </>
  );
};

export default memo(AddOrder);
