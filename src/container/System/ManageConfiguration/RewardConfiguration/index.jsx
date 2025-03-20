import React, { useCallback, useEffect, useState } from "react";
import "./index.scss";
import icons from "../../../../utils/icons";
import ButtonCustom from "../../../../components/button";
import { useNavigate } from "react-router-dom";
import { errorNotify, successNotify } from "../../../../helper/toast";

import { Pagination, Tooltip } from "antd";
import { loadingAction } from "../../../../redux/actions/loading";
import { useDispatch } from "react-redux";
import FilterData from "../../../../components/filterData";
import InputTextCustom from "../../../../components/inputCustom";
import _debounce from "lodash/debounce";
import {
  getListRewardPolicyApi,
  updateRewardPolicyApi,
} from "../../../../api/rewardPolicy";

const { IoCreate, IoClose, MdDoubleArrow } = icons;

const RewardConfiguration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ~~~ Value ~~~ */
  const [startPage, setStartPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [lengthPage, setLengthPage] = useState(16);
  const [totalItem, setTotalItem] = useState(0);
  const [valueSearch, setValueSearch] = useState("");

  /* ~~~ List ~~~ */
  const [listData, setListData] = useState([]);

  /* ~~~ Handle function ~~~ */
  const fetchListPunishPolicy = async (payload) => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await getListRewardPolicyApi(
        payload.start,
        payload.length,
        payload.search
      );
      setListData(res?.data);
      setTotalItem(res?.totalItem);
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      dispatch(loadingAction.loadingRequest(false));
      errorNotify({ message: err?.message || err });
    }
  };

  const handleShowMore = () => {
    if (startPage + lengthPage < totalItem) {
      setStartPage(lengthPage + startPage);
    }
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
    }, 500),
    []
  );

  const onChangePage = (value) => {
    setStartPage(value);
  };

  const calculateCurrentPage = (event) => {
    setCurrentPage(event);
    onChangePage(event * lengthPage - lengthPage);
  };

  /* ~~~ Use effect ~~~ */
  useEffect(() => {
    fetchListPunishPolicy({
      start: startPage,
      length: lengthPage,
      search: valueSearch,
    });
  }, [startPage, valueSearch]);

  const filterContentLeft = () => {
    return (
      <ButtonCustom
        label="Tạo lệnh thưởng"
        onClick={() => navigate("/configuration/reward/create")}
      />
    );
  };
  const filterContentRight = () => {
    return (
      <div className="manage-order__filter-content">
        <InputTextCustom
          type="text"
          placeHolderNormal="Tìm kiếm"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>
    );
  };

  return (
    <div className="manage-punish-configuration">
      <FilterData
        leftContent={filterContentLeft()}
        rightContent={filterContentRight()}
      />

      <div className="manage-punish-configuration__list">
        {listData.length > 0 &&
          listData.map((el, index) => (
            <div
              key={index}
              className="manage-punish-configuration__list--child card-shadow"
            >
              <div>
                <div className="manage-punish-configuration__list--child-title">
                  <span className="manage-punish-configuration__list--child-title-label">
                    {el?.title?.vi}
                  </span>
                  <Tooltip placement={"bottom"} title={el?.description?.vi}>
                    <span className="manage-punish-configuration__list--child-title-description">
                      {el?.description?.vi || "Không có nội dung"}
                    </span>
                  </Tooltip>
                </div>

                <div className="manage-punish-configuration__list--child-numbering">
                  <span>{index + 1}</span>
                </div>
              </div>
              <div className="manage-punish-configuration__list--child-action">
                <span
                  className={`manage-punish-configuration__list--child-action-status ${
                    el?.status === "standby"
                      ? "standby"
                      : el?.status === "doing"
                      ? "doing"
                      : el?.status === "pause"
                      ? "pause"
                      : ""
                  }`}
                >
                  {el?.status === "standby"
                    ? "Đang chờ"
                    : el?.status === "doing"
                    ? "Kích hoạt"
                    : el?.status === "pause"
                    ? "Tạm dừng"
                    : ""}
                </span>
                <div className="manage-punish-configuration__list--child-action-container">
                  <div className="manage-punish-configuration__list--child-action-container-icon">
                    <Tooltip placement="top" title="Chỉnh sửa">
                      <span
                        onClick={() =>
                          navigate(`/configuration/reward/edit/${el?._id}`)
                        }
                      >
                        <IoCreate color="green" />
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="manage-punish-configuration__pagination">
        <div></div>
        <div>
          <Pagination
            current={currentPage}
            onChange={calculateCurrentPage}
            total={totalItem}
            // showSizeChanger={true}
            pageSize={lengthPage}
          />
        </div>
      </div>
    </div>
  );
};

export default RewardConfiguration;
