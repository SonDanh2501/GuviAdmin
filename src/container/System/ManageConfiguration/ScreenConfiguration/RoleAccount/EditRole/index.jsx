import { Button, Checkbox } from "antd";
import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  editRoleApi,
  getSettingAccountApi,
} from "../../../../../../api/configuration";
import LoadingPagination from "../../../../../../components/paginationLoading";
import InputCustom from "../../../../../../components/textInputCustom";
import { errorNotify } from "../../../../../../helper/toast";
import { getProvince } from "../../../../../../redux/selectors/service";
import "./index.scss";

const EditRole = (props) => {
  const { state } = useLocation();
  const { item } = state || {};
  const [stateRole, setStateRole] = useState({
    address: [],
    isAreaManager: false,
    ratioCheckArea: 1,
  });
  const [data, setData] = useState([]);
  const [keyApi, setKeyApi] = useState([]);
  const [nameRole, setNameRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const naivigate = useNavigate();
  const cityOptions = [];
  const province = useSelector(getProvince);

  province?.map((item) => {
    return cityOptions?.push({
      value: item?.code,
      label: item?.name,
    });
  });

  useEffect(() => {
    getSettingAccountApi()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {});

    setNameRole(item?.name_role);
    setKeyApi(item?.id_key_api);
    setStateRole({
      ...stateRole,
      ratioCheckArea: item?.is_area_manager ? 2 : 1,
      address: item?.area_manager_level_1,
    });
  }, []);

  const onChangeRole = (check, item, role) => {
    if (check) {
      for (let i = 0; i < role.permission.length; i++) {
        const newArr = [...keyApi];
        // if (role?.permission[i]?.key_api_parent?.includes(item?._id)) {
        //   keyApi.push(role.permission[i]?._id);
        //   setKeyApi(newArr);
        // }
        if (item?.key_api_parent?.includes(role?.permission[i]?._id)) {
          keyApi.push(role.permission[i]?._id);
          setKeyApi(newArr);
        }
      }

      for (let i = 0; i < data?.length; i++) {
        for (let j = 0; j < data[i]?.permission?.length; j++) {
          const newArr = [...keyApi];
          if (item?.key_api_parent?.includes(data[i]?.permission[j]?._id)) {
            keyApi.push(data[i]?.permission[j]?._id);
            setKeyApi(newArr);
          }
        }
      }

      setKeyApi([...keyApi, item?._id]);
    } else {
      const arr = keyApi.filter((e) => e !== item?._id);
      setKeyApi(arr);
    }
  };

  const onEdit = useCallback(() => {
    setIsLoading(true);
    editRoleApi(item?._id, {
      name_role: nameRole,
      id_key_api: keyApi,
      // is_area_manager: stateRole.ratioCheckArea === 2 ? true : false,
      // area_manager_level_1:
      //   stateRole.ratioCheckArea === 2 ? stateRole.address : [],
    })
      .then((res) => {
        setIsLoading(false);
        naivigate(-1);
        // window.location.reload();
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        setIsLoading(false);
      });
  }, [nameRole, keyApi, data, stateRole, item, naivigate]);

  return (
    <div>
      <InputCustom
        title="Tên quyền"
        placeholder="Vui lòng nhập tên quyền"
        style={{ width: "50%" }}
        value={nameRole}
        onChange={(e) => setNameRole(e.target.value)}
      />
      <div className="div-title-role">
        {data?.map((item, index) => {
          return (
            <div key={index} className="div-item-role">
              <p className="title-role">
                {item?.permission[0]?.name_group_api}
              </p>
              {item?.permission?.map((per, i) => {
                return (
                  <div className="div-item-per" key={i}>
                    <Checkbox
                      checked={keyApi?.includes(per?._id) ? true : false}
                      onChange={(e) =>
                        onChangeRole(e.target.checked, per, item)
                      }
                    />
                    <p className="text-name-per">{per?.name_api}</p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <Button onClick={onEdit} style={{ marginTop: 50 }}>
        Sửa quyền
      </Button>
      {/* </Drawer> */}

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default memo(EditRole);
