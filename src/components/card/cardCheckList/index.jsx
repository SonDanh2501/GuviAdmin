import React from 'react'
import "./index.scss";
import icons from '../../../utils/icons';

const { IoCheckmark } = icons;

const CardCheckList = (props) => {
  const { data } = props;
  return (
    <div className="card__check-list">
      <div className="card__check-list--child">
        <div className="card__check-list--child-left">
          <div
            className={`p-1 ${
              data?.is_document_code
                ? "status-done"
                : "status-not-process"
            } rounded-full`}
          >
            {data?.is_document_code ? (
              <IoCheckmark color="green" />
            ) : (
              <IoCheckmark style={{ visibility: "hidden" }} color="gray" />
            )}
          </div>
          <span
            className={`card__check-list--child-left-label ${
              !data?.is_document_code && "not-upload"
            } `}
          >
            Thỏa thuận hợp tác
          </span>
        </div>
      </div>
      <div className="card__check-list--child">
        <div className="card__check-list--child-left">
          <div
            className={`p-1 ${
              data?.is_identity
                ? "status-done"
                : "status-not-process"
            } rounded-full`}
          >
            {data?.is_identity ? (
              <IoCheckmark color="green" />
            ) : (
              <IoCheckmark style={{ visibility: "hidden" }} color="gray" />
            )}
          </div>
          <span
            className={`card__check-list--child-left-label ${
              !data?.is_identity && "not-upload"
            } `}
          >
            CCCD/CMND
          </span>
        </div>
      </div>
      <div className="card__check-list--child">
        <div className="card__check-list--child-left">
          <div
            className={`p-1 ${
              data?.is_personal_infor
                ? "status-done"
                : "status-not-process"
            } rounded-full`}
          >
            {data?.is_personal_infor ? (
              <IoCheckmark color="green" />
            ) : (
              <IoCheckmark style={{ visibility: "hidden" }} color="gray" />
            )}
          </div>
          <span
            className={`card__check-list--child-left-label ${
              !data?.is_personal_infor && "not-upload"
            } `}
          >
            Sơ yếu lí lịch
          </span>
        </div>
      </div>
      <div className="card__check-list--child">
        <div className="card__check-list--child-left">
          <div
            className={`p-1 ${
              data?.is_household_book
                ? "status-done"
                : "status-not-process"
            } rounded-full`}
          >
            {data?.is_household_book ? (
              <IoCheckmark color="green" />
            ) : (
              <IoCheckmark style={{ visibility: "hidden" }} color="gray" />
            )}
          </div>
          <span
            className={`card__check-list--child-left-label ${
              !data?.is_household_book && "not-upload"
            } `}
          >
            Sổ hộ khẩu{" "}
          </span>
        </div>
      </div>
      <div className="card__check-list--child">
        <div className="card__check-list--child-left">
          <div
            className={`p-1 ${
              data?.is_behaviour
                ? "status-done"
                : "status-not-process"
            } rounded-full`}
          >
            {data?.is_behaviour ? (
              <IoCheckmark color="green" />
            ) : (
              <IoCheckmark style={{ visibility: "hidden" }} color="gray" />
            )}
          </div>
          <span
            className={`card__check-list--child-left-label ${
              !data?.is_behaviour && "not-upload"
            } `}
          >
            Giấy xác nhận hạnh kiểm
          </span>
        </div>
      </div>
    </div>
  );
}

export default CardCheckList