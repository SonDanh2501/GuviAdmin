
import _debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupPromotion } from "../../../api/configuration.jsx";
import {
  fetchPromotion,
} from "../../../api/promotion.jsx";
import { errorNotify } from "../../../helper/toast.js";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth.js";
import { getService } from "../../../redux/selectors/service.js";
import "./styles.scss";
import "./index.scss";
import FilterData from "../../../components/filterData/filterData.jsx";
import ButtonCustom from "../../../components/button/index.jsx";
import InputTextCustom from "../../../components/inputCustom/index.jsx";
import DataTable from "../../../components/tables/dataTable/index.jsx";
import CustomHeaderDatatable from "../../../components/tables/tableHeader/index.jsx";
import { loadingAction } from "../../../redux/actions/loading.js";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const ManagePromotions = () => {
  const dispatch = useDispatch();
  const [startPage, setStartPage] = useState(0);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const lang = useSelector(getLanguageState);
  const service = useSelector(getService);
  const checkElement = useSelector(getElementState);
  const navigate = useNavigate();
  /* ~~~ Value ~~~ */
  const typeSort = -1; // Giá trị sort (lọc giá trị theo phần từ mới nhất của bảng từ trên xuống)
  const [groupPromotion, setGroupPromotion] = useState([]); // Dữ liệu nhóm khuyến mãi
  const [valueSearch, setValueSearch] = useState("");
  const [data, setData] = useState([]); // Dữ liệu của bảng
  const [total, setTotal] = useState(0); // Giá trị tổng số phần tử trong bảng (tí xóa)
  const [selectService, setSelectService] = useState(""); // Giá trị select của dịch vụ
  const [selectObject, setSelectObject] = useState(""); // Giá trị select của đối tượng
  const [selectPromotionType, setSelectPromotionType] = useState(""); // Giá trị select của loại khuyến mãi
  const [selectGroupPromotionType, setSelectGroupPromotionType] = useState(""); // Giá trị select của nhóm khuyến mãi
  const [selectStatus, setSelectStatus] = useState(""); // Giá trị select của trạng thái
  /* ~~~ List ~~~ */
  const columns = [ 
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Mã khuyến mãi"
          textToolTip="Mã để áp dụng khuyến mãi"
        />
      ),
      dataIndex: "",
      key: "promotion_code",
      width: 60,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Hình thức"
          textToolTip="Hình thức của khuyến mãi (mã hay chương trình)"
        />
      ),
      dataIndex: "",
      key: "type_promotion",
      width: 20,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Hình ảnh"
          textToolTip="Hình ảnh thumbnail của khuyến mãi"
        />
      ),
      dataIndex: "",
      key: "img_promotion",
      width: 20,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Khu vực"
          textToolTip="Khu vực mà được áp dụng mã khuyến mãi"
        />
      ),
      dataIndex: "",
      key: "area_promotion",
      width: 20,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Trạng thái"
          textToolTip="Trạng thái của mã khuyến mãi"
        />
      ),
      dataIndex: "",
      key: "status_promotion",
      width: 30,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Sử dụng"
          textToolTip="Số lượng mã khuyến mãi đã được sử dụng"
        />
      ),
      dataIndex: "",
      key: "time_using_promotion",
      width: 20,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Ngày bắt đầu"
          textToolTip="Ngày bắt đầu"
        />
      ),
      dataIndex: "",
      key: "start_date_promotion",
      width: 25,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Ngày kết thúc"
          textToolTip="Ngày kết thúc"
        />
      ),
      dataIndex: "",
      key: "end_date_promotion",
      width: 25,
    },
  ];
  // Danh sách các dịch vụ
  const serviceList = [
    {
      code: "",
      label: "Tất cả",
    },
  ];
  service.map((item) => {
    return serviceList.push({
      code: item?._id,
      label: item?.title?.[lang],
    });
  });
  // Danh sách các đối tượng
  const objectList = [
    {
      code: "",
      label: "Tất cả",
    },
    {
      code: "guvi",
      label: "GUVI",
    },
    {
      code: "other",
      label: "Khác",
    },
  ];
  // Danh sách các loại khuyến mãi
  const promotionTypeList = [
    {
      code: "",
      label: "Tất cả",
    },
    {
      code: "code",
      label: "Mã KH",
    },
    {
      code: "event",
      label: "Chương trình KH",
    },
  ];
  // Danh sách các nhóm khuyến mãi
  const groupPromotionList = [
    {
      code: "",
      label: "Tất cả",
    },
  ];
  groupPromotion?.map((item) => {
    return groupPromotionList.push({
      code: item?._id,
      label: item.name[lang],
    });
  });
  // Danh sách các trạng thái
  const statusList = [
    {
      code: "",
      label: "Tất cả",
    },
    {
      code: "upcoming",
      label: "Chưa kích hoạt",
    },
    {
      code: "doing",
      label: "Đang kích hoạt",
    },
    {
      code: "done",
      label: "Kết thúc",
    },
    {
      code: "out_of_date",
      label: "Hết hạn",
    },
    {
      code: "out_of_stock",
      label: "Hết lượt sử dụng",
    },
  ];
  /* ~~~ Handle function ~~~ */
  // 1. Fetch dữ liệu bảng
  const fetchData = async () => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await fetchPromotion(
        valueSearch,
        selectStatus,
        startPage,
        lengthPage,
        selectPromotionType,
        selectObject,
        selectService,
        "",
        typeSort,
        selectGroupPromotionType,
      );
      setData(res?.data);
      setTotal(res?.totalItem);
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      errorNotify({
        message: err?.message,
      });
    }
  };
  // 2. Fetch dữ liệu nhóm khuyễn mãi
  const fetchGroupPromotion = async () => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await getGroupPromotion(0, 20, "");
      setGroupPromotion(res?.data);
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      errorNotify({
        message: err?.message,
      });
    }
  };
  const onChangePage = (value) => {
    setStartPage(value);
  };
  const handleSearch = _debounce((value) => {
    setValueSearch(value);
  }, 500);
  /* ~~~ Use effect ~~~ */
  // 1. Fetch dữ liệu bảng
  useEffect(() => {
    fetchData();
    fetchGroupPromotion();
  }, [
    startPage,
    lengthPage,
    typeSort,
    selectStatus,
    selectPromotionType,
    selectObject,
    selectService,
    selectGroupPromotionType,
    valueSearch
  ]);
  /* ~~~ Other ~~~ */
  const filterContent = () => {
    return (
      <div className="manange-promotion__filter-content">
        {/* Lọc theo loại dịch vụ */}
        <div>
          <ButtonCustom
            label="Dịch vụ"
            options={serviceList}
            value={selectService}
            setValueSelectedProps={setSelectService}
          />
        </div>
        {/* Lọc theo loại đối tượng*/}
        <div>
          <ButtonCustom
            label="Đối tượng"
            options={objectList}
            value={selectObject}
            setValueSelectedProps={setSelectObject}
          />
        </div>
        {/* Lọc theo loại khuyến mãi*/}
        <div>
          <ButtonCustom
            label="Loại khuyến mãi"
            options={promotionTypeList}
            value={selectPromotionType}
            setValueSelectedProps={setSelectPromotionType}
          />
        </div>
        {/* Lọc theo loại nhóm khuyến mãi*/}
        <div>
          <ButtonCustom
            label="Nhóm khuyến mãi"
            options={groupPromotionList}
            value={selectGroupPromotionType}
            setValueSelectedProps={setSelectGroupPromotionType}
          />
        </div>
        {/* Lọc theo loại trạng thái */}
        <div>
          <ButtonCustom
            label="Trạng thái"
            options={statusList}
            value={selectStatus}
            setValueSelectedProps={setSelectStatus}
          />
        </div>
      </div>
    );
  };
  const searchContentLeft = () => {
    return (
      <div className="manange-promotion__filter-searching-left">
        {checkElement?.includes("create_promotion") && (
          <ButtonCustom
            onClick={() =>
              navigate(`/promotion/manage-setting/create-promotion`)
            }
            label="Thêm khuyến mãi"
          />
        )}
        <ButtonCustom
          onClick={() =>
            navigate(`/promotion/manage-setting/edit-position-promotion`)
          }
          label="Chỉnh sửa vị trí"
        />
      </div>
    );
  };
  const searchContentRight = () => {
    return (
      <div className="manange-promotion__filter-searching">
      <InputTextCustom
        type="text"
        placeHolderNormal="Tìm kiếm theo mã khuyến mãi"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
    </div>
    )
  }
  /* ~~~ Main ~~~ */
  return (
    <div className="manange-promotion">
      {/* Header */}
      <div className="manange-promotion__header">
        <span>Khuyến mãi</span>
      </div>
      <FilterData leftContent={searchContentLeft()} rightContent={searchContentRight()} />
      {/* Filter */}
      <FilterData leftContent={filterContent()} />
      {/* Table */}
      <div>
        <DataTable
          columns={columns}
          data={data}
          start={startPage}
          pageSize={lengthPage}
          setLengthPage={setLengthPage}
          totalItem={total}
          onCurrentPageChange={onChangePage}
        />
      </div>
    </div>
  );
};

export default ManagePromotions;
