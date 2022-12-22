import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
} from "antd";
import "./index.scss";
import { getOrderDetailApi } from "../../../../api/order";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../../../../redux/actions/loading";
import { errorNotify } from "../../../../helper/toast";

const DrawerDetails = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const showDrawer = () => {
    dispatch(loadingAction.loadingRequest(true));
    setOpen(true);
    getOrderDetailApi(id)
      .then((res) => {
        dispatch(loadingAction.loadingRequest(false));
        setData(res);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  console.log(data);
  const onClose = ({ data }) => {
    setOpen(false);
  };
  return (
    <>
      <button className="btn-details" onClick={showDrawer}>
        Chi tiết
      </button>
      <Drawer
        title="Chi tiết công việc"
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <a>{data?.name}</a>
      </Drawer>
    </>
  );
};
export default DrawerDetails;
