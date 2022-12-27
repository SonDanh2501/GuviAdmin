import React, { useState } from "react";
import { Button, Drawer } from "antd";
import "./index.scss";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
const AddOrder = () => {
  const [address, setAddress] = useState("");
  const [time, setTime] = useState("");
  const [extraService, setExtraService] = useState("");
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button className="btn-add" onClick={showDrawer}>
        Thêm đơn
      </Button>
      <Drawer
        title="Thêm order"
        placement="right"
        onClose={onClose}
        width={500}
        open={open}
      >
        <div>
          <CustomTextInput
            label="Nhập địa chỉ"
            type="text"
            placeholder="Vui lòng nhập địa chỉ"
            onChange={(e) => setAddress(e.target.value)}
          />

          <CustomTextInput
            label="Thời lượng"
            type="select"
            onChange={(e) => setTime(e.target.value)}
            className="select-input"
            body={
              <>
                <option>2 giờ/ 55m / 2 phòng </option>
                <option>3 giờ/ 85m / 3 phòng </option>
                <option>4 giờ/ 105m / 4 phòng </option>
              </>
            }
          />

          <CustomTextInput
            label="Dịch vụ thêm"
            type="select"
            onChange={(e) => setExtraService(e.target.value)}
            className="select-input"
            body={
              <>
                <option>Ủi đồ</option>
                <option>Nấu ăn</option>
                <option>Mang theo dụng cụ</option>
              </>
            }
          />
        </div>
      </Drawer>
    </>
  );
};
export default AddOrder;
