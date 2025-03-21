import _debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupPromotion } from "../../../api/configuration.jsx";
import { fetchPromotionApi } from "../../../api/promotion.jsx";
import { errorNotify } from "../../../helper/toast.js";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth.js";
import { getService } from "../../../redux/selectors/service.js";
import "./styles.scss";
import "./index.scss";
import FilterData from "../../../components/filterData/index.jsx";
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
  const valueSort = -1; // Giá trị sort (lọc giá trị theo phần từ mới nhất của bảng từ trên xuống)
  const [groupPromotion, setGroupPromotion] = useState([]); // Dữ liệu nhóm khuyến mãi
  const [valueSearch, setValueSearch] = useState("");
  const [data, setData] = useState([]); // Dữ liệu của bảng
  const [total, setTotal] = useState(0); // Giá trị tổng số phần tử trong bảng (tí xóa)
  const [selectService, setSelectService] = useState(""); // Giá trị select của dịch vụ
  const [selectObject, setSelectObject] = useState(""); // Giá trị select của đối tượng
  const [selectPromotionType, setSelectPromotionType] = useState(""); // Giá trị select của loại khuyến mãi
  const [selectGroupPromotionType, setSelectGroupPromotionType] = useState(""); // Giá trị select của nhóm khuyến mãi
  const [selectStatus, setSelectStatus] = useState(""); // Giá trị select của trạng thái
  const [valueSelectTypeSort, setValueSelectTypeSort] = useState("date_create"); // Giá trị sắp xếp

  /* ~~~ List ~~~ */
  const columns = [
    {
      customTitle: <CustomHeaderDatatable title="STT" position="center" />,
      dataIndex: "",
      key: "case_numbering",
      width: 15,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Mã khuyến mãi"
          textToolTip="Mã để áp dụng khuyến mãi"
        />
      ),
      dataIndex: "",
      key: "promotion_code",
      width: 90,
    },
    {
      customTitle: <CustomHeaderDatatable title="Ngày tạo" />,
      dataIndex: "date_create",
      key: "case_date-create-time",
      width: 30,
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
      width: 30,
      position: "center",
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
      width: 30,
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
      width: 30,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Trạng thái"
          textToolTip="Trạng thái của mã khuyến mãi"
        />
      ),
      dataIndex: "status",
      key: "case_status_promotion",
      width: 35,
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
      width: 30,
      position: "center",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Hẹn bắt đầu"
          textToolTip="Ngày hẹn để bắt đầu khuyến mãi (nếu không có thì khuyến mãi sẽ kích hoạt ngay từ lúc tạo ra)"
        />
      ),
      dataIndex: "limit_start_date",
      key: "case_date-create-time",
      width: 35,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Hẹn kết thúc"
          textToolTip="Ngày hẹn để kết thúc khuyến mãi (nếu không có thì khuyến mãi sẽ kích hoạt đến khi dừng hoặc đủ số lượng sử dụng)"
        />
      ),
      dataIndex: "limit_end_date",
      key: "case_date-create-time",
      width: 35,
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

  // Danh sách các đối tượng
  const listTypeSort = [
    {
      code: "date_create",
      label: "Ngày tạo",
    },
    {
      code: "limit_start_date",
      label: "Ngày bắt đầu",
    },
    {
      code: "limit_end_date",
      label: "Ngày kết thúc",
    },
  ];

  /* ~~~ Handle function ~~~ */
  // 1. Fetch dữ liệu bảng
  const fetchData = async () => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await fetchPromotionApi(
        valueSearch,
        selectStatus,
        startPage,
        lengthPage,
        selectPromotionType,
        selectObject,
        selectService,
        "",
        valueSelectTypeSort,
        valueSort,
        selectGroupPromotionType
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
  }, [
    startPage,
    lengthPage,
    valueSort,
    selectStatus,
    selectPromotionType,
    selectObject,
    selectService,
    selectGroupPromotionType,
    valueSearch,
    valueSelectTypeSort
  ]);
  useEffect(() => {
    fetchGroupPromotion();
  }, []);
  /* ~~~ Other ~~~ */
  const filterContentLeft = () => {
    return (
      <div className="manange-promotion__filter-content">
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
  const filterContentRight = () => {
    return (
      <div className="manange-promotion__filter-content">
        {/* Sắp xếp theo loại ngày */}
        <div>
          <ButtonCustom
            label="Sắp xếp"
            options={listTypeSort}
            value={valueSelectTypeSort}
            setValueSelectedProps={setValueSelectTypeSort}
          />
        </div>
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
            label="Loại KM"
            options={promotionTypeList}
            value={selectPromotionType}
            setValueSelectedProps={setSelectPromotionType}
          />
        </div>
        {/* Lọc theo loại nhóm khuyến mãi*/}
        <div>
          <ButtonCustom
            label="Nhóm KM"
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

  const createPromotionContent = () => {
    <div className="manange-promotion__filter-searching-left">
      <div className="manange-promotion__filter-searching">
        <InputTextCustom
          type="text"
          placeHolderNormal="Tìm kiếm theo mã khuyến mãi"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>
      {checkElement?.includes("create_promotion") && (
        <ButtonCustom
          onClick={() => navigate(`/promotion/manage-setting/create-promotion`)}
          label="Thêm khuyến mãi"
        />
      )}
      <ButtonCustom
        onClick={() =>
          navigate(`/promotion/manage-setting/edit-position-promotion`)
        }
        label="Chỉnh sửa vị trí"
      />
    </div>;
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
    );
  };
  /* ~~~ Main ~~~ */
  return (
    <div className="manange-promotion">
      {/* Header */}
      <div className="manange-promotion__header">
        <span>Khuyến mãi</span>
      </div>
      {/* Filter */}
      <FilterData
        leftContent={filterContentLeft()}
        rightContent={filterContentRight()}
      />
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
          headerRightContent={
            <div className="manange-promotion__filter-searching-left">
              <div className="manange-promotion__filter-searching">
                <InputTextCustom
                  type="text"
                  placeHolderNormal="Tìm kiếm theo mã khuyến mãi"
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                />
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default ManagePromotions;
