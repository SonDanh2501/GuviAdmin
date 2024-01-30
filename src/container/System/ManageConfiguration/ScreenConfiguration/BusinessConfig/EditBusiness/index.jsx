import { Button, Drawer } from "antd";
import { useEffect, useState } from "react";
import InputCustom from "../../../../../../components/textInputCustom";
import UploadImage from "../../../../../../components/uploadImage";
import "./styles.scss";
import {
  createBusiness,
  editBusiness,
  getDetailBusiness,
  getListBusiness,
} from "../../../../../../api/configuration";
import { errorNotify } from "../../../../../../helper/toast";
import {
  getProvince,
  getService,
} from "../../../../../../redux/selectors/service";
import { useSelector } from "react-redux";

const EditBusiness = (props) => {
  const { setData, data, id } = props;
  const [state, setState] = useState({
    open: false,
    name: "",
    tax: "",
    avatar: "",
    id,
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

  useEffect(() => {
    getDetailBusiness(id)
      .then((res) => {
        setState({
          ...state,
          name: res?.full_name,
          avatar: res?.avatar,
          tax: res?.tax_code,
          city: res.area_manager_lv_1,
          district: res?.area_manager_lv_2,
          idService: res?.id_service_manager,
        });
      })
      .catch((err) => {});
  }, []);

  province?.map((item) => {
    cityOption?.push({
      value: item?.code,
      label: item?.name,
      district: item?.districts,
    });
  });

  province?.map((item) => {
    if (state?.city == item?.code) {
      item?.districts?.map((district) => {
        districtOption.push({
          value: district?.code,
          label: district?.name,
        });
      });
    }
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

  const onEdit = () => {
    setData({ ...state, isLoading: true });
    editBusiness(id, {
      type_permisstion: "",
      full_name: state.name,
      avatar: state.avatar,
      tax_code: state.tax,
      area_manager_lv_0: "viet_nam",
      area_manager_lv_1: state?.city === "" ? [] : [state.city],
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
          message: err?.message,
        });
      });
  };

  return (
    <>
      <a onClick={() => setState({ ...state, open: true })}>Chỉnh sửa</a>

      <Drawer
        title="Tạo mới đối tác"
        placement="right"
        onClose={() => setState({ ...state, open: false })}
        open={state.open}
      >
        <InputCustom
          title="Tên đối tác"
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
        />
        <InputCustom
          title="Mã số thuế"
          value={state.tax}
          onChange={(e) => setState({ ...state, tax: e.target.value })}
        />
        <InputCustom
          title="Tỉnh/Thành phố"
          onChange={(e, item) => {
            setDataDistrict(item?.district);
            setState({ ...state, city: e });
          }}
          options={cityOption}
          value={state?.city}
          select={true}
          showSearch={true}
          filterOption={(input, option) =>
            (option?.label ?? "").includes(input)
          }
        />

        <InputCustom
          title="Quận/Huyện"
          onChange={(e, item) => {
            setState({ ...state, district: e });
          }}
          options={districtOption}
          select={true}
          value={state?.district}
          showSearch={true}
          filterOption={(input, option) =>
            (option?.label ?? "").includes(input)
          }
          mode="multiple"
        />

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
          value={state.idService}
        />
        <UploadImage
          title="Ảnh"
          classImg="image-avatar-business"
          image={state.avatar}
          setImage={(e) => setState({ ...state, avatar: e })}
        />

        <Button
          onClick={onEdit}
          type="primary"
          style={{ marginTop: 20, float: "right" }}
        >
          Sửa
        </Button>
      </Drawer>
    </>
  );
};

export default EditBusiness;
