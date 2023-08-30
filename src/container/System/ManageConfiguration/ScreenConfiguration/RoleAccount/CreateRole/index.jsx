import { Button, Checkbox } from "antd";
import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createRoleApi,
  getSettingAccountApi,
} from "../../../../../../api/configuration";
import LoadingPagination from "../../../../../../components/paginationLoading";
import InputCustom from "../../../../../../components/textInputCustom";
import { errorNotify } from "../../../../../../helper/toast";
import { getProvince } from "../../../../../../redux/selectors/service";
import "./index.scss";

const CreateRole = (props) => {
  const [data, setData] = useState([]);
  const [keyApi, setKeyApi] = useState([]);
  const [nameRole, setNameRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
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
  }, []);

  const onChangeRole = (check, item, role) => {
    if (check) {
      for (let i = 0; i < role?.permission?.length; i++) {
        const newArr = [...keyApi];
        if (item?.key_api_parent?.includes(role?.permission[i]?._id)) {
          keyApi.push(role.permission[i]?._id);
          setKeyApi(newArr);
        }
      }

      for (let i = 0; i < data?.length; i++) {
        for (let j = 0; j < data[i]?.permission?.length; j++) {
          if (item?.key_api_parent?.includes(data[i]?.permission[j]?._id)) {
            setKeyApi([...keyApi, data[i]?.permission[j]?._id]);
          }
        }
      }
      setKeyApi([...keyApi, item?._id]);
    } else {
      for (let i = 0; i < role?.permission?.length; i++) {
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
        navigate(-1);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        setIsLoading(false);
      });
  }, [nameRole, keyApi, navigate]);

  return (
    <div>
      <InputCustom
        title="Tên quyền"
        placeholder="Vui lòng nhập tên quyền"
        style={{ width: "50%" }}
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
                      checked={keyApi.includes(per?._id) ? true : false}
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
      <Button onClick={onCreate} style={{ marginTop: 50 }}>
        Tạo quyền
      </Button>
      {/* </Drawer> */}

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default memo(CreateRole);
