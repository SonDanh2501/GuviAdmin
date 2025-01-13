import React, { useState } from "react";
import icons from "../../../../utils/icons";
import "./index.scss";
import ButtonCustom from "../../../../components/button";
import {
  errorNotify,
  infoNotify,
  successNotify,
} from "../../../../helper/toast";

import appleStoreImage from "../../../../assets/images/apple_store.svg";
import chStoreImage from "../../../../assets/images/google_play.svg";
import copyRightImage from "../../../../assets/images/copy_right.png";
import logoGuvi from "../../../../assets/images/LogoS.svg";
import guideStepImage from "../../../../assets/images/guideStep.png";
import aboutGuviAffiliateImage from "../../../../assets/images/aboutGuvi.png";
import logoGuviImage from "../../../../assets/images/LogoS.svg";
import giupViecTheoGioImage from "../../../../assets/images/giupviectheogio.png";
import donDepCoDinhImage from "../../../../assets/images/dondepcodinh.png";
import tongVeSinhImage from "../../../../assets/images/tongvesinh.png";
import veSinhRemThamImage from "../../../../assets/images/vesinhrt.png";
import veSinhMayLanh from "../../../../assets/images/vesinhmaylanh.png";
import guideStepVerticalImage from "../../../../assets/images/guideStepVertical.png";
import headerAffiliateImage from "../../../../assets/images/headerAffiliate.png";
import fivePercentageImage from "../../../../assets/images/fivePercentage.png";
import tenPercentageImage from "../../../../assets/images/tenPercentage.png";

import { useSelector } from "react-redux";
import { getUser } from "../../../../redux/selectors/auth";
import { Modal } from "antd";
import useWindowDimensions from "../../../../helper/useWindowDimensions";
import { useNavigate } from "react-router-dom";
const {
  IoLink,
  IoPersonAdd,
  IoPeople,
  IoBagAdd,
  IoChevronForward,
  MdDoubleArrow,
  IoCopyOutline,
  IoSwapHorizontal,
  IoColorWandOutline,
  IoPeopleOutline,
  IoBagOutline,
  IoLogoFacebook,
  IoLogoYoutube,
  IoLogoTiktok,
  IoCopy,
} = icons;

const OverView = () => {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const user = useSelector(getUser);
  const [modalPopup, setModalPopup] = useState(true);
  /* ~~~ Other ~~~ */
  const copyToClipBoard = (text) => {
    if (text && text.length > 0) {
      navigator.clipboard.writeText(text);
      successNotify({
        message: `Sao chép thành công`,
      });
    }
  };
  return (
    <div className="affiliate-overview">
      {width < 480 && (
        <>
          <div className="affiliate-overview__header">
            <img src={headerAffiliateImage}></img>
          </div>
          {/* <div className="affiliate-overview__tab">
            <div
              onClick={() => navigate("/")}
              className="affiliate-overview__tab--button activated"
            >
              <span>Affiliate</span>
            </div>
            <div
              onClick={() => navigate("/referend-list")}
              className="affiliate-overview__tab--button"
            >
              <span>Danh sách</span>
            </div>
          </div> */}
        </>
      )}
      {/* Link share*/}
      <div className="affiliate-overview__guide">
        <div className="affiliate-overview__guide--content">
          <div className="affiliate-overview__guide--content-child">
            <div className="affiliate-overview__guide--content-child-share-link">
              <div className="affiliate-overview__guide--content-child-share-link-left">
                <div className="affiliate-overview__guide--content-child-share-link-left-header">
                  <div className="affiliate-overview__guide--content-child-share-link-left-header-number">
                    <img
                      className="affiliate-overview__guide--content-child-share-link-left-header-number-discount"
                      src={fivePercentageImage}
                    ></img>
                  </div>
                  <div className="affiliate-overview__guide--content-child-share-link-left-header-describe">
                    <span className="affiliate-overview__guide--content-child-share-link-left-header-describe-label">
                      Chiết khấu
                    </span>
                    <span className="affiliate-overview__guide--content-child-share-link-left-header-describe-child">
                      Từ đơn đầu tiên
                    </span>
                  </div>
                </div>
                <div
                  onClick={() => copyToClipBoard(user?.referral_link)}
                  className="affiliate-overview__guide--content-child-share-link-left-copy"
                >
                  <div className="affiliate-overview__guide--content-child-share-link-left-copy-icon">
                    <IoCopyOutline />
                  </div>
                  <span className="affiliate-overview__guide--content-child-share-link-left-copy-label">
                    COPY
                  </span>
                </div>
              </div>
              <div className="affiliate-overview__guide--content-child-share-link-right">
                <span className="affiliate-overview__guide--content-child-share-link-right-header">
                  Chiết khấu ngay
                </span>
                <span className="affiliate-overview__guide--content-child-share-link-right-describe">
                  Giới thiệu và nhận ngay{" "}
                  <span className="high-light">5% hoa hồng</span> từ các đơn
                  thành công của người được giới thiệu
                </span>
                <span className="affiliate-overview__guide--content-child-share-link-right-describe">
                  Thưởng thêm <span className="high-light">50.000đ</span> vào ví
                  G-pay khi người được giới thiệu hoàn thành{" "}
                  <span className="high-light">đơn đầu tiên.</span>
                </span>
              </div>
            </div>
          </div>
          <div className="affiliate-overview__guide--content-line">
            <div className="affiliate-overview__guide--content-line-icon">
              <IoSwapHorizontal color="#9ca3af" />
            </div>
          </div>
          <div className="affiliate-overview__guide--content-child">
            <div className="affiliate-overview__guide--content-child-share-link">
              <div className="affiliate-overview__guide--content-child-share-link-right">
                <span className="affiliate-overview__guide--content-child-share-link-right-header">
                  Tặng voucher
                </span>
                <span className="affiliate-overview__guide--content-child-share-link-right-describe">
                  <span className="high-light">Gửi voucher</span> đến người được
                  giới thiệu và <span className="high-light">nhận 5%</span> hoa
                  hồng bắt đầu <span className="high-light">từ đơn</span> thành
                  công <span className="high-light">thứ 2</span> của người đó.
                </span>
                <span className="affiliate-overview__guide--content-child-share-link-right-describe">
                  Thưởng thêm <span className="high-light">50.000đ</span> vào ví
                  G-pay khi người được giới thiệu hoàn thành{" "}
                  <span className="high-light">đơn đầu tiên.</span>
                </span>
              </div>
              <div className="affiliate-overview__guide--content-child-share-link-left">
                <div className="affiliate-overview__guide--content-child-share-link-left-header">
                  <div className="affiliate-overview__guide--content-child-share-link-left-header-number">
                    <img
                      className="affiliate-overview__guide--content-child-share-link-left-header-number-voucher"
                      src={tenPercentageImage}
                    ></img>
                  </div>
                  <div className="affiliate-overview__guide--content-child-share-link-left-header-describe">
                    <span className="affiliate-overview__guide--content-child-share-link-left-header-describe-label">
                      Gửi tặng
                    </span>
                    <span className="affiliate-overview__guide--content-child-share-link-left-header-describe-label">
                      voucher
                    </span>
                    <span className="affiliate-overview__guide--content-child-share-link-left-header-describe-child">
                      Cho đơn đầu tiên
                    </span>
                  </div>
                </div>
                <div
                  onClick={() =>
                    copyToClipBoard(user?.promotional_referral_link)
                  }
                  className="affiliate-overview__guide--content-child-share-link-left-copy"
                >
                  <div className="affiliate-overview__guide--content-child-share-link-left-copy-icon">
                    <IoCopyOutline />
                  </div>
                  <span className="affiliate-overview__guide--content-child-share-link-left-copy-label">
                    COPY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Guide join event */}
      <div className="affiliate-overview__service">
        {width > 1024 ? (
          <img
            className="affiliate-overview__service--step"
            src={guideStepImage}
          ></img>
        ) : (
          <img
            className="affiliate-overview__service--step"
            src={guideStepVerticalImage}
          ></img>
        )}
      </div>
      {/* Introduce about guvi */}
      <div className="affiliate-overview__landing-page">
        {/* Header */}
        <div className="affiliate-overview__landing-page--header">
          <div>
            <img
              className="affiliate-overview__landing-page--header-logo"
              src={logoGuviImage}
            ></img>
          </div>
          <div className="affiliate-overview__landing-page--header-label">
            <span className="affiliate-overview__landing-page--header-label">
              Ứng dụng giúp việc tiện lợi - linh hoạt
            </span>
          </div>
        </div>
        <div className="affiliate-overview__landing-page--about">
          <img src={aboutGuviAffiliateImage}></img>
        </div>
        {width > 768 ? (
          <div className="affiliate-overview__landing-page--line-icon">
            <div className="affiliate-overview__landing-page--line-icon-child">
              <img src={giupViecTheoGioImage}></img>
            </div>
            <div className="affiliate-overview__landing-page--line-icon-child">
              <img src={donDepCoDinhImage}></img>
            </div>
            <div className="affiliate-overview__landing-page--line-icon-child">
              <img src={tongVeSinhImage}></img>
            </div>
            <div className="affiliate-overview__landing-page--line-icon-child">
              <img src={veSinhRemThamImage}></img>
            </div>
            <div className="affiliate-overview__landing-page--line-icon-child">
              <img src={veSinhMayLanh}></img>
            </div>
          </div>
        ) : (
          <>
            <div className="affiliate-overview__landing-page--line-icon">
              <div className="affiliate-overview__landing-page--line-icon-child">
                <img src={giupViecTheoGioImage}></img>
              </div>
              <div className="affiliate-overview__landing-page--line-icon-child">
                <img src={donDepCoDinhImage}></img>
              </div>
              <div className="affiliate-overview__landing-page--line-icon-child">
                <img src={tongVeSinhImage}></img>
              </div>
            </div>
            <div className="affiliate-overview__landing-page--line-icon">
              <div className="affiliate-overview__landing-page--line-icon-child">
                <img src={veSinhRemThamImage}></img>
              </div>
              <div className="affiliate-overview__landing-page--line-icon-child">
                <img src={veSinhMayLanh}></img>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Footer */}
      <div className="affiliate-overview__footer">
        <div className="affiliate-overview__footer--content">
          {/* Address */}
          <div className="affiliate-overview__footer--content-information">
            <span className="affiliate-overview__footer--content-information-header">
              CÔNG TY TNHH GIẢI PHÁP CÔNG NGHỆ GUVI
            </span>
            <span className="affiliate-overview__footer--content-information-description">
              Văn phòng: 137D đường số 11, Phường Trường Thọ, TP. Thủ Đức, TP.
              Hồ Chí Minh{" "}
            </span>
            <span className="affiliate-overview__footer--content-information-description">
              Hotline: 1900 0027
            </span>
            <span className="affiliate-overview__footer--content-information-description">
              Email: cskh@guvico.com - marketing@guvico.com
            </span>
          </div>
          {/* Download app */}
          <div className="affiliate-overview__footer--content-information">
            <span className="affiliate-overview__footer--content-information-header">
              Tải ứng dụng
            </span>
            <div className="affiliate-overview__footer--content-information-image-container">
              <img
                onClick={() =>
                  window.open(
                    "https://play.google.com/store/apps/details?id=com.guvico_customer",
                    "_blank"
                  )
                }
                className="refferend-list-affiliate__footer--content-information-image"
                src={chStoreImage}
              ></img>
              <img
                onClick={() =>
                  window.open(
                    "https://apps.apple.com/us/app/guvi-gi%C3%BAp-vi%E1%BB%87c-theo-gi%E1%BB%9D/id6443966297",
                    "_blank"
                  )
                }
                className="refferend-list-affiliate__footer--content-information-image"
                src={appleStoreImage}
              ></img>
            </div>
            <img
              className="affiliate-overview__footer--content-information-image"
              src={copyRightImage}
            ></img>
          </div>
          {/* Contact */}
          <div className="affiliate-overview__footer--content-information">
            <span className="affiliate-overview__footer--content-information-header">
              Liên hệ với GUVI
            </span>
            <div className="affiliate-overview__footer--content-information-image-container">
              <IoLogoFacebook size="40px" color="white" />
              <IoLogoTiktok size="40px" color="white" />
              <IoLogoYoutube size="40px" color="white" />
            </div>
          </div>
        </div>
        {/* Copy right */}
        <div className="affiliate-overview__footer--content-copy-right">
          <span className="affiliate-overview__footer--content-copy-right-label">
            @ 2024 Công ty TNHH Giải pháp Công nghệ Guvi sở hữu bản quyền.
          </span>
        </div>
      </div>
    </div>
  );
};

export default OverView;
