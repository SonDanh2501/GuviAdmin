import { Button, Drawer } from "antd";
import { useState } from "react";
import InputCustom from "../../../../../../components/textInputCustom";
import UploadImage from "../../../../../../components/uploadImage";
import "./styles.scss";
import {
  createBusiness,
  getListBusiness,
} from "../../../../../../api/configuration";
import { errorNotify } from "../../../../../../helper/toast";
import { useSelector } from "react-redux";
import {
  getProvince,
  getService,
} from "../../../../../../redux/selectors/service";

const CreateBusiness = (props) => {
  const { setData, data } = props;
  const [state, setState] = useState({
    open: false,
    name: "",
    tax: "",
    avatar: "",
    city: "",
    district: [],
    idService: [],
  });
  const cityOption = [];
  const districtOption = [];
  const serviceOption = [];
  const [dataDistrict, setDataDistrict] = useState([]);
  const province = useSelector(getProvince);
  const service = useSelector(getService);

  province?.map((item) => {
    cityOption?.push({
      value: item?.code,
      label: item?.name,
      district: item?.districts,
    });
  });

  dataDistrict?.map((item) => {
    districtOption.push({
      value: item?.code,
      label: item?.name,
    });
  });

  service?.map((item) => {
    serviceOption.push({
      value: item?._id,
      label: item?.title?.vi,
    });
  });

  const onCreate = () => {
    setData({ ...state, isLoading: true });

    createBusiness({
      type_permisstion: "",
      full_name: state.name,
      avatar: state.avatar,
      tax_code: state.tax,
      area_manager_lv_0: "viet_nam",
      area_manager_lv_1: state.city === "" ? [] : [state.city],
      area_manager_lv_2: state?.district.length > 0 ? state.district : [],
      id_service_manager: state.idService.length > 0 ? state.idService : [],
    })
      .then((res) => {
        getListBusiness(0, 20, "")
          .then((res) => {
            setData({ ...data, data: res?.data, isLoading: false });
            setState({ ...state, open: false });
          })
          .catch((err) => {});
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
      });
  };

  return (
    <>
      <Button type="primary" onClick={() => setState({ ...state, open: true })}>
        Tạo mới
      </Button>

      <Drawer
        title="Tạo mới đối tác"
        placement="right"
        onClose={() => setState({ ...state, open: false })}
        open={state.open}
      >
        <InputCustom
          title="Tên đối tác"
          onChange={(e) => setState({ ...state, name: e.target.value })}
        />
        <InputCustom
          title="Mã số thuế"
          onChange={(e) => setState({ ...state, tax: e.target.value })}
        />
        <InputCustom
          title="Tỉnh/Thành phố"
          onChange={(e, item) => {
            setDataDistrict(item?.district);
            setState({ ...state, city: e });
          }}
          options={cityOption}
          select={true}
          showSearch={true}
          filterOption={(input, option) =>
            (option?.label ?? "").includes(input)
          }
        />
        {districtOption.length > 0 && (
          <InputCustom
            title="Quận/Huyện"
            onChange={(e, item) => {
              setState({ ...state, district: e });
            }}
            options={districtOption}
            select={true}
            showSearch={true}
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            mode="multiple"
          />
        )}

        <InputCustom
          title="Loại dịch vụ"
          onChange={(e, item) => {
            setState({ ...state, idService: e });
          }}
          options={serviceOption}
          select={true}
          showSearch={true}
          filterOption={(input, option) =>
            (option?.label ?? "").includes(input)
          }
          mode="multiple"
        />
        <UploadImage
          title="Ảnh"
          classImg="image-avatar-business"
          classUpload="upload-image-avatar-business"
          image={state.avatar}
          setImage={(e) => setState({ ...state, avatar: e })}
        />

        <Button
          onClick={onCreate}
          type="primary"
          style={{ marginTop: 20, float: "right" }}
        >
          Tạo
        </Button>
      </Drawer>
    </>
  );
};

export default CreateBusiness;
