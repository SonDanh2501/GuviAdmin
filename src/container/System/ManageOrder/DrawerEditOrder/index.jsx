import React, { useCallback, useEffect, useState } from "react";
import { Button, DatePicker, Drawer, Input, List } from "antd";
import "./index.scss";

import { searchCollaborators } from "../../../../api/collaborator";
import { errorNotify } from "../../../../helper/toast";
const EditOrder = ({ idOrder }) => {
  const [open, setOpen] = useState(false);
  const [dataFilter, setDataFilter] = useState([]);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleSearch = useCallback((value) => {
    setName(value);
    if (value) {
      searchCollaborators(value, 0, 10)
        .then((res) => {
          setDataFilter(res.data);
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
        });
    } else {
      setDataFilter([]);
    }

    setId("");
  }, []);

  return (
    <>
      <a className="text-add" onClick={showDrawer}>
        Chỉnh sửa
      </a>
      <Drawer
        title="Chỉnh sửa"
        placement="right"
        onClose={onClose}
        width={500}
        open={open}
      >
        <div>
          <div>
            <a className="label">Cộng tác viên</a>
            <Input
              placeholder="Tìm kiếm theo số điện thoại"
              value={name}
              type="text"
              onChange={(e) => handleSearch(e.target.value)}
              className="input"
            />
            {/* {errorName && <a className="error">{errorName}</a>} */}
            {dataFilter.length > 0 && (
              <List type={"unstyled"} className="list-item">
                {dataFilter?.map((item, index) => {
                  return (
                    <option
                      key={index}
                      value={item?._id}
                      onClick={(e) => {
                        setId(e.target.value);
                        setName(item?.name);
                        setDataFilter([]);
                      }}
                    >
                      {item?.name}
                    </option>
                  );
                })}
              </List>
            )}
          </div>

          <Button className="btn-add">Chỉnh sửa</Button>
        </div>
      </Drawer>
    </>
  );
};
export default EditOrder;
