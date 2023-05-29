import { Button, Checkbox, Drawer, Input, Modal } from "antd";
import "./index.scss";
import { memo, useCallback, useEffect, useState } from "react";
import {
  createRoleApi,
  getSettingAccountApi,
} from "../../../../../../api/configuration";
import { errorNotify } from "../../../../../../helper/toast";
import LoadingPagination from "../../../../../../components/paginationLoading";
import { getListRoleAdmin } from "../../../../../../api/createAccount";

const CreateRole = (props) => {
  const { setDataList, setTotal, setIsLoading } = props;
  const [data, setData] = useState([]);
  const [keyApi, setKeyApi] = useState([]);
  const [keyCheckApi, setKeyCheckApi] = useState([]);
  const [nameRole, setNameRole] = useState("");

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getSettingAccountApi()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {});
  }, []);

  // const onChangeActive = (value, indexRole, indexPer) => {
  //   const arr = [...role];
  //   role[indexRole].dropPermission[indexPer].dependency = value;

  //   if (role[indexRole]?.dropPermission[indexPer]?.dependency === true) {
  //     role[indexRole]?.dropPermission[indexPer]?.activeLocal?.map((item) => {
  //       role[indexRole]?.dropPermission?.map((itemDrop) => {
  //         itemDrop["active"] = true;
  //       });
  //     });
  //   } else {
  //     role[indexRole]?.dropPermission[indexPer]?.activeLocal?.map((item) => {
  //       role[indexRole]?.dropPermission?.map((itemDrop) => {
  //         if (itemDrop?.value !== "get") {
  //           itemDrop["dependency"] = false;
  //           itemDrop["active"] = false;
  //         }
  //       });
  //     });
  //   }
  // };

  const onChangeRole = (check, item, role) => {
    if (check) {
      for (var i = 0; i < role?.permission?.length; i++) {
        const newArr = [...keyApi];
        if (role?.permission[i]?.key_api_parent?.includes(item?._id)) {
          keyApi.push(role.permission[i]?._id);
          setKeyApi(newArr);
        } else if (item?.key_api_parent?.includes(role?.permission[i]?._id)) {
          keyApi.push(role.permission[i]?._id);
          setKeyApi(newArr);
        }
      }

      for (var i = 0; i < data?.length; i++) {
        for (var j = 0; j < data[i]?.permission?.length; j++) {
          if (item?.key_api_parent?.includes(data[i]?.permission[j]?._id)) {
            setKeyApi([...keyApi, data[i]?.permission[j]?._id]);
          }
        }
      }
      setKeyApi([...keyApi, item?._id]);
    } else {
      for (var i = 0; i < role?.permission?.length; i++) {
        if (role?.permission[i]?.key_api_parent?.includes(item?._id)) {
        }
      }

      const arr = keyApi.filter((e) => e !== item?._id);
      setKeyApi(arr);
    }
  };

  const onCreate = useCallback(() => {
    setIsLoading(true);
    createRoleApi({
      type_role: "",
      name_role: nameRole,
      id_key_api: keyApi,
    })
      .then((res) => {
        setIsLoading(false);
        setOpen(false);
        getListRoleAdmin()
          .then((res) => {
            setDataList(res.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        setIsLoading(false);
      });
  }, [nameRole, keyApi]);

  return (
    <div>
      <Button type="primary" onClick={showDrawer}>
        Thêm quyền
      </Button>
      <Drawer
        title="Thêm quyền quản trị"
        placement="right"
        onClose={onClose}
        open={open}
        width={1000}
      >
        <div className="div-input">
          <a>Tên quyền</a>
          <Input
            placeholder="Vui lòng nhập tên quyền"
            style={{ width: "50%", marginTop: 2 }}
            onChange={(e) => setNameRole(e.target.value)}
          />
        </div>
        <div className="div-title-role">
          {data?.map((item, index) => {
            return (
              <div key={index} className="div-item-role">
                <a className="title-role">
                  {item?.permission[0]?.name_group_api}
                </a>
                {item?.permission?.map((per, i) => {
                  return (
                    <div className="div-item-per" key={i}>
                      <Checkbox
                        checked={keyApi.includes(per?._id) ? true : false}
                        onChange={(e) =>
                          onChangeRole(e.target.checked, per, item)
                        }
                      />
                      <a className="text-name-per">{per?.name_api}</a>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <Button onClick={onCreate} style={{ marginTop: 50 }}>
          Tạo quyền
        </Button>
      </Drawer>
    </div>
  );
};

export default memo(CreateRole);
