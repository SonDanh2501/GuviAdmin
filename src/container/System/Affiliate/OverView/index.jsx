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
import veSinhMayLanhImage from "../../../../assets/images/vesinhmaylanh.png";
import guideStepVerticalImage from "../../../../assets/images/guideStepVertical.png";
import headerAffiliateImage from "../../../../assets/images/headerAffiliate.png";
// import fivePercentageImage from "../../../../assets/images/fivePercentage.png";
import fivePercentageImage from "../../../../assets/images/fivePercentage.svg";
// import tenPercentageImage from "../../../../assets/images/tenPercentage.png";
import tenPercentageImage from "../../../../assets/images/tenPercentage.svg";
import copyButtonImage from "../../../../assets/images/copy_button.svg";

import phoneAffiliateImage from "../../../../assets/images/phone_affiliate.svg";
import starManyImage from "../../../../assets/images/star_many.svg";
import wireDecorationImage from "../../../../assets/images/wire_decoration.svg";
import labelTagImage from "../../../../assets/images/labelTag.svg";
import peopleManageImage from "../../../../assets/images/people_manage.svg";
import blinkStickerImage from "../../../../assets/images/blink_sticker.svg";
import downloadAppImage from "../../../../assets/images/download_app.svg";
import notificationMoneyImage from "../../../../assets/images/notification_money.svg";
import assistantImage from "../../../../assets/images/assistant.svg";
import handUpImage from "../../../../assets/images/hand-up.svg";
import giftImage from "../../../../assets/images/gift.svg";
import checkListAffiliateImage from "../../../../assets/images/checkListAffiliate.svg";
import settingAffiliateImage from "../../../../assets/images/settingAffiliate.svg";
import chartAffiliateImage from "../../../../assets/images/chartAffiliate.svg";
import assistantAffiliateImage from "../../../../assets/images/assistantAffiliate.svg";
import stepAffiliateImage from "../../../../assets/images/stepAffiliate.svg";

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
  IoCheckmarkCircle,
  IoCheckboxOutline,
  IoArrowDownCircle,
  IoGlobeOutline,
} = icons;

const OverView = () => {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const user = useSelector(getUser);
  const [modalPopup, setModalPopup] = useState(true);

  const [isShowIntroductionPage, setIsShowIntroductionPage] = useState(true);
  const [isShowCodeRefference, setIsShowCodeRefference] = useState(false);
  const [isShowServiceOfGuvi, setIsShowServiceOfGuvi] = useState(false);
  const [isShowBenefit, setIsShowBenefit] = useState(false);
  const [isShowFooter, setIsShowFooter] = useState(false);
  const [isSelectAffiliate, setIsSelectAffiliate] = useState(true);
  const [isSelectManageRefferend, setIsSelectManageRefferend] = useState(false);

  /* ~~~ List ~~~ */
  const listBenefit = [
    {
      title: "Thu nhập không giới hạn",
      content: [
        "Không giới hạn số lượt giới thiệu. Chia sẻ càng nhiều, thu nhập càng tăng",
      ],
      image: handUpImage,
    },
    {
      title: "Phần thưởng hời dành cho đối tác",
      content: [
        "Nhận ngay 50.000 VNĐ vào ví G-Pay khi mỗi đơn hàng đầu tiên được hoàn thành",
      ],
      image: giftImage,
    },
    {
      title: "Quản lý dễ dàng",
      content: [
        "Hệ thống có danh sách người đã giới thiệu.",
        "Dễ dàng kiểm soát thu nhập hoa hồng chính xác.",
      ],
      image: settingAffiliateImage,
    },
    {
      title: "Tăng chất lượng sống cho cộng đồng",
      content: [
        "Giúp cộng đồng tiếp cận các dịch vụ tiện ích, cải thiện chất lượng cuộc sống.",
      ],
      image: chartAffiliateImage,
    },
    {
      title: "Minh bạch, rõ ràng",
      content: [
        "Thu nhập từ mỗi người được hiển thị rõ ràng.",
        "Báo cáo doanh thu theo tháng minh bạch.",
      ],
      image: checkListAffiliateImage,
    },
    {
      title: "Hỗ trợ tận tình",
      content: [
        "Đội ngũ Guvi luôn đồng hành, cung cấp hướng dẫn và giải đáp thắc mắc kịp thời.",
      ],
      image: assistantAffiliateImage,
    },
    {
      title: "Thao tác đơn giản",
      content: [
        "Quy trình đăng ký nhanh chóng, dễ dàng.",
        "Giao diện thân thiện, dễ sử dụng.",
      ],
      image: stepAffiliateImage,
    },
  ];
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
      <div
        className={`affiliate-overview__introduction ${
          !isShowIntroductionPage && "hide"
        }`}
      >
        <div className="affiliate-overview__introduction--header">
          <div className="affiliate-overview__introduction--header-navigation">
            <div
              onClick={() => {
                setIsSelectAffiliate(true);
                setIsSelectManageRefferend(false);
                setIsShowIntroductionPage(true);
                setIsShowCodeRefference(false);
                setIsShowServiceOfGuvi(false);
                setIsShowBenefit(false);
                setIsShowFooter(false);
              }}
              className={`affiliate-overview__introduction--header-navigation-button left-side ${
                isSelectAffiliate ? "activated" : "disable"
              }`}
            >
              <span>Affiliate</span>
            </div>
            <div
              onClick={() => {
                setIsSelectAffiliate(false);
                setIsSelectManageRefferend(true);
              }}
              className={`affiliate-overview__introduction--header-navigation-button right-side ${
                isSelectManageRefferend ? "activated" : "disable"
              }`}
            >
              <span>Quản lý</span>
            </div>
          </div>
          {!isShowBenefit && (
            <div className="affiliate-overview__introduction--header-information">
              <div className="affiliate-overview__introduction--header-information-personal">
                <span className="affiliate-overview__introduction--header-information-personal-label">
                  Xin chào, Trường Sơn !
                </span>
                <span className="affiliate-overview__introduction--header-information-personal-sub-label">
                  Hãy cừng chia sẻ và nhận thêm thu nhập không giới hạn!
                </span>
              </div>
              <div className="affiliate-overview__introduction--header-information-assistant">
                <img src={assistantImage} alt=""></img>
              </div>
            </div>
          )}
        </div>
        <div className="affiliate-overview__introduction--line">
          <img src={wireDecorationImage} alt=""></img>
        </div>
        <div className="affiliate-overview__introduction--star">
          <img src={starManyImage} alt=""></img>
        </div>
        <div className="affiliate-overview__introduction--phone">
          <img src={phoneAffiliateImage} alt=""></img>
        </div>
        <div className="affiliate-overview__introduction--wave"></div>
        {!isShowBenefit && !isShowServiceOfGuvi && (
          <div className="affiliate-overview__introduction--blank">
            {!isShowCodeRefference ? (
              <>
                <div className="affiliate-overview__introduction--blank-label">
                  <span>Chương trình liên kết tiếp thị cùa GUVI</span>
                  <span>Tham gia ngay !</span>
                </div>
                <div
                  onClick={() => {
                    setIsShowIntroductionPage(false);
                    setIsShowCodeRefference(true);
                  }}
                  className="affiliate-overview__introduction--blank-button"
                >
                  <span>THỂ LỆ CHƯƠNG TRÌNH</span>
                </div>
              </>
            ) : (
              <>
                <div className="affiliate-overview__introduction--blank-header">
                  <span className="affiliate-overview__introduction--blank-header-text-border">
                    Cách giới thiệu
                  </span>
                  <span className="affiliate-overview__introduction--blank-header-text-neon">
                    Đơn giản
                  </span>
                </div>
                <div className="affiliate-overview__introduction--blank-child">
                  {/* Nhận chiết khấu */}
                  <div className="affiliate-overview__introduction--blank-child-container">
                    <div className="affiliate-overview__introduction--blank-child-promotion">
                      <div className="affiliate-overview__introduction--blank-child-promotion-tag-name">
                        <span>NHẬN HOA HỒNG</span>
                      </div>
                      <div className="affiliate-overview__introduction--blank-child-promotion-tag">
                        <img src={labelTagImage} alt=""></img>
                      </div>
                      <img
                        className="affiliate-overview__introduction--blank-child-promotion-image"
                        src={fivePercentageImage}
                        alt=""
                      ></img>
                      <div className="affiliate-overview__introduction--blank-child-promotion-benefit">
                        <span className="affiliate-overview__introduction--blank-child-promotion-benefit-icon">
                          <IoCheckmarkCircle />
                        </span>
                        <span className="affiliate-overview__introduction--blank-child-promotion-benefit-label">
                          Ngay từ đơn đầu tiên
                        </span>
                      </div>
                      <div className="affiliate-overview__introduction--blank-child-promotion-benefit">
                        <span className="affiliate-overview__introduction--blank-child-promotion-benefit-icon">
                          <IoCheckmarkCircle />
                        </span>
                        <span className="affiliate-overview__introduction--blank-child-promotion-benefit-label">
                          Nhận tiền thưởng cho đơn hoàn thành đầu tiên
                        </span>
                      </div>
                      <div className="affiliate-overview__introduction--blank-child-promotion-share">
                        <img src={copyButtonImage} alt=""></img>
                        <span>CHIA SẺ</span>
                      </div>
                    </div>
                  </div>
                  {/* Gửi voucher */}
                  <div className="affiliate-overview__introduction--blank-child-container">
                    <div className="affiliate-overview__introduction--blank-child-promotion">
                      <div className="affiliate-overview__introduction--blank-child-promotion-tag-name">
                        <span>TẶNG VOUCHER</span>
                      </div>
                      <div className="affiliate-overview__introduction--blank-child-promotion-tag">
                        <img src={labelTagImage} alt=""></img>
                      </div>
                      <img
                        className="affiliate-overview__introduction--blank-child-promotion-image"
                        src={tenPercentageImage}
                        alt=""
                      ></img>
                      <div className="affiliate-overview__introduction--blank-child-promotion-benefit">
                        <span className="affiliate-overview__introduction--blank-child-promotion-benefit-icon">
                          <IoCheckmarkCircle />
                        </span>
                        <span className="affiliate-overview__introduction--blank-child-promotion-benefit-label">
                          Cho bạn bè giới thiệu
                        </span>
                      </div>
                      <div className="affiliate-overview__introduction--blank-child-promotion-benefit">
                        <span className="affiliate-overview__introduction--blank-child-promotion-benefit-icon">
                          <IoCheckmarkCircle />
                        </span>
                        <span className="affiliate-overview__introduction--blank-child-promotion-benefit-label">
                          Nhận chiết khấu từ đơn thứ hai
                        </span>
                      </div>
                      <div className="affiliate-overview__introduction--blank-child-promotion-share">
                        <img src={copyButtonImage} alt=""></img>
                        <span>CHIA SẺ</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="affiliate-overview__introduction--blank-header">
                  <span className="affiliate-overview__introduction--blank-header-text-border">
                    Các bước giới thiệu
                  </span>
                </div>
                {/* Hướng dẫn bước 1 */}
                <div className="affiliate-overview__introduction--blank-guide">
                  <div className="affiliate-overview__introduction--blank-guide-container">
                    <div className="affiliate-overview__introduction--blank-guide-container-tag-label one-line">
                      <span>Chia sẻ chương trình</span>
                    </div>
                    <div className="affiliate-overview__introduction--blank-guide-container-tag">
                      <img src={labelTagImage} alt=""></img>
                    </div>
                    <div className="affiliate-overview__introduction--blank-guide-container-child">
                      <div className="affiliate-overview__introduction--blank-guide-container-child-left">
                        <div className="affiliate-overview__introduction--blank-guide-container-child-left-content">
                          <div className="affiliate-overview__introduction--blank-guide-container-child-left-content-bullet-points">
                            <img src={blinkStickerImage} alt=""></img>
                          </div>
                          <div className="affiliate-overview__introduction--blank-guide-container-child-left-content-label">
                            <span>
                              <span className="high-light">
                                Chọn một trong hai&nbsp;
                              </span>
                              chương trình giới thiệu và bấm nút
                              <span className="high-light">&nbsp;CHIA SẺ</span>
                            </span>
                          </div>
                        </div>
                        <div className="affiliate-overview__introduction--blank-guide-container-child-left-content">
                          <div className="affiliate-overview__introduction--blank-guide-container-child-left-content-bullet-points">
                            <img src={blinkStickerImage} alt=""></img>
                          </div>
                          <div className="affiliate-overview__introduction--blank-guide-container-child-left-content-label">
                            <span>
                              <span className="high-light">
                                Gửi link cho người bạn muốn giới thiệu&nbsp;
                              </span>
                              bằng cách dán link vào khung tin nhắn và bấm gửi
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="affiliate-overview__introduction--blank-guide-container-child-right">
                        <div className="affiliate-overview__introduction--blank-guide-container-child-right-container">
                          <div className="affiliate-overview__introduction--blank-guide-container-child-right-container-promotion">
                            <div className="affiliate-overview__introduction--blank-guide-container-child-right-container-promotion-tag-name">
                              <span>TẶNG VOUCHER</span>
                            </div>
                            <div className="affiliate-overview__introduction--blank-guide-container-child-right-container-promotion-tag">
                              <img src={labelTagImage} alt=""></img>
                            </div>
                            <img
                              className="affiliate-overview__introduction--blank-guide-container-child-right-container-promotion-image"
                              src={tenPercentageImage}
                              alt=""
                            ></img>
                            <div className="affiliate-overview__introduction--blank-guide-container-child-right-container-promotion-benefit">
                              <span className="affiliate-overview__introduction--blank-guide-container-child-right-container-promotion-benefit-icon">
                                <IoCheckmarkCircle />
                              </span>
                              <span className="affiliate-overview__introduction--blank-guide-container-child-right-container-promotion-benefit-label">
                                Cho bạn bè giới thiệu
                              </span>
                            </div>
                            <div className="affiliate-overview__introduction--blank-guide-container-child-right-container-promotion-share">
                              <img src={copyButtonImage} alt=""></img>
                              <span>CHIA SẺ</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Hướng dẫn bước 2 */}
                <div className="affiliate-overview__introduction--blank-guide">
                  <div className="affiliate-overview__introduction--blank-guide-container">
                    <div className="affiliate-overview__introduction--blank-guide-container-tag-label two-line">
                      <span>Tải App & Trài Nghiệm Dịch Vụ</span>
                    </div>
                    <div className="affiliate-overview__introduction--blank-guide-container-tag">
                      <img src={labelTagImage} alt=""></img>
                    </div>
                    <div className="affiliate-overview__introduction--blank-guide-container-child">
                      <div className="affiliate-overview__introduction--blank-guide-container-child-left">
                        <div className="affiliate-overview__introduction--blank-guide-container-child-left-content">
                          <div className="affiliate-overview__introduction--blank-guide-container-child-left-content-bullet-points">
                            <img src={blinkStickerImage} alt=""></img>
                          </div>
                          <div className="affiliate-overview__introduction--blank-guide-container-child-left-content-label">
                            <span>
                              Người được giới thiệu
                              <span className="high-light">
                                &nbsp;bấm vào link&nbsp;
                              </span>
                              mà bạn vừa gửi để
                              <span className="high-light">
                                &nbsp;tải app GUVI và đăng ký tài khoản
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="affiliate-overview__introduction--blank-guide-container-child-left-content">
                          <div className="affiliate-overview__introduction--blank-guide-container-child-left-content-bullet-points">
                            <img src={blinkStickerImage} alt=""></img>
                          </div>
                          <div className="affiliate-overview__introduction--blank-guide-container-child-left-content-label">
                            <span>
                              Người được giới thiệu&nbsp;
                              <span className="high-light">
                                lựa chọn và trải nghiệm thành công
                              </span>
                              &nbsp;một trong các dịch vụ của GUVI
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="affiliate-overview__introduction--blank-guide-container-child-right">
                        <div className="affiliate-overview__introduction--blank-guide-container-child-right-img">
                          <img src={downloadAppImage} alt=""></img>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Hướng dẫn bước 3 */}
                <div className="affiliate-overview__introduction--blank-guide">
                  <div className="affiliate-overview__introduction--blank-guide-container">
                    <div className="affiliate-overview__introduction--blank-guide-container-tag-label two-line">
                      <span>Nhận thưởng từ đơn hàng thành công</span>
                    </div>
                    <div className="affiliate-overview__introduction--blank-guide-container-tag">
                      <img src={labelTagImage} alt=""></img>
                    </div>
                    <div className="affiliate-overview__introduction--blank-guide-container-child">
                      <div className="affiliate-overview__introduction--blank-guide-container-child-left">
                        <div className="affiliate-overview__introduction--blank-guide-container-child-left-content">
                          <div className="affiliate-overview__introduction--blank-guide-container-child-left-content-bullet-points">
                            <img src={blinkStickerImage} alt=""></img>
                          </div>
                          <div className="affiliate-overview__introduction--blank-guide-container-child-left-content-label">
                            <span>
                              Người giới thiệu nhận ngay&nbsp;
                              <span className="high-light">50.000đ</span> vào ví
                              G-pay cho{" "}
                              <span className="high-light">đơn đầu tiên</span>{" "}
                              và&nbsp;
                              <span className="high-light">5%</span> chiếu khấu
                              từ đơn hàng tùy vào mã đã gửi. Thông báo sẽ được
                              gửi qua&nbsp;
                              <span className="high-light">ứng dụng GUVI</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="affiliate-overview__introduction--blank-guide-container-child-right">
                        <div className="affiliate-overview__introduction--blank-guide-container-child-right-img">
                          <img src={notificationMoneyImage} alt=""></img>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setIsShowBenefit(true)}
                  className="affiliate-overview__introduction--blank-button"
                >
                  <span>Lợi ích sử dụng GUVI</span>
                </div>
              </>
            )}
          </div>
        )}
        {/* Cac loi ich khi tham gia GUVI */}
        <div
          className={`affiliate-overview__introduction--benefit ${
            !(isShowBenefit && !isShowServiceOfGuvi) && "hide"
          }`}
        >
          <div className="affiliate-overview__introduction--benefit-header">
            <span className="affiliate-overview__introduction--benefit-header-text-border">
              Quản lý thông tin
            </span>
            <span className="affiliate-overview__introduction--benefit-header-text-neon">
              Dễ dàng
            </span>
          </div>
          <div className="affiliate-overview__introduction--benefit-header-list">
            <div className="affiliate-overview__introduction--benefit-header-list-container">
              {listBenefit.map((item, index) => (
                <div
                  key={index}
                  className="affiliate-overview__introduction--benefit-header-list-content"
                >
                  <div className="affiliate-overview__introduction--benefit-header-list-content-child">
                    <div className="affiliate-overview__introduction--benefit-header-list-content-child-header">
                      <span className="affiliate-overview__introduction--benefit-header-list-content-child-header-icon">
                        <IoCheckboxOutline />
                      </span>
                      <span className="affiliate-overview__introduction--benefit-header-list-content-child-header-text">
                        {item.title}
                      </span>
                    </div>
                    {item.content.map((content, indexContent) => (
                      <div
                        key={indexContent}
                        className="affiliate-overview__introduction--benefit-header-list-content-child-content"
                      >
                        <div className="affiliate-overview__introduction--benefit-header-list-content-child-content-dot"></div>
                        <span>{content}</span>
                      </div>
                    ))}
                  </div>
                  <div className="affiliate-overview__introduction--benefit-header-list-content-icon">
                    <img src={item.image} alt=""></img>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            setIsShowServiceOfGuvi(true);
          }}
          className={`affiliate-overview__introduction--arrow ${
            !(isShowBenefit && !isShowServiceOfGuvi) && "hide"
          }`}
        >
          <div className="affiliate-overview__introduction--arrow-icon">
            <span>
              <MdDoubleArrow />
            </span>
          </div>
        </div>
        {/* Bước cuối cùng */}
        {isShowServiceOfGuvi && (
          <div className="affiliate-overview__introduction--footer">
            <div className="affiliate-overview__introduction--footer-header">
              <span className="affiliate-overview__introduction--footer-header-label">
                <span className="high-light">Ứng dụng</span>&nbsp;giúp việc tiện
                ích
              </span>
            </div>
            <div className="affiliate-overview__introduction--footer-content">
              <div className="affiliate-overview__introduction--footer-content-image">
                <img src={aboutGuviAffiliateImage} alt=""></img>
              </div>
              <div className="affiliate-overview__introduction--footer-content-list-service">
                <div className="affiliate-overview__introduction--footer-content-list-service-child">
                  <img src={giupViecTheoGioImage} alt=""></img>
                </div>
                <div className="affiliate-overview__introduction--footer-content-list-service-child">
                  <img src={donDepCoDinhImage} alt=""></img>
                </div>
                <div className="affiliate-overview__introduction--footer-content-list-service-child">
                  <img src={tongVeSinhImage} alt=""></img>
                </div>
                <div className="affiliate-overview__introduction--footer-content-list-service-child">
                  <img src={veSinhRemThamImage} alt=""></img>
                </div>
                <div className="affiliate-overview__introduction--footer-content-list-service-child">
                  <img src={veSinhMayLanhImage} alt=""></img>
                </div>
              </div>
            </div>
            <div className="affiliate-overview__introduction--footer-bottom">
              {!isShowFooter && (
                <div
                  onClick={() => setIsShowFooter(true)}
                  className="affiliate-overview__introduction--footer-bottom-button"
                >
                  <MdDoubleArrow />
                </div>
              )}
              <div
                onClick={() => setIsShowFooter(false)}
                className={`affiliate-overview__introduction--footer-bottom-modal ${
                  !isShowFooter && "hide"
                }`}
              >
                <div className="affiliate-overview__introduction--footer-bottom-modal-information">
                  <span className="affiliate-overview__introduction--footer-bottom-modal-information-title">
                    CÔNG TY TNHH GIẢI PHÁP CÔNG NGHỆ GUVI
                  </span>
                  <span className="affiliate-overview__introduction--footer-bottom-modal-information-bullets-point">
                    <span className="high-light">Văn phòng:</span>
                    &nbsp;137D đường số 11, phường Trường Thọ, TP.Thủ Đức, TP.
                    Hồ Chí Minh
                  </span>
                  <span className="affiliate-overview__introduction--footer-bottom-modal-information-bullets-point">
                    <span className="high-light">Hotline:</span>
                    &nbsp;1900&nbsp;0027
                  </span>
                  <span className="affiliate-overview__introduction--footer-bottom-modal-information-bullets-point">
                    <span className="high-light">Email:</span>
                    &nbsp;cskh@guvico.com - marketing@guvico.com
                  </span>
                  <div className="affiliate-overview__introduction--footer-bottom-modal-information-social">
                    <div className="affiliate-overview__introduction--footer-bottom-modal-information-social-media facebook">
                      <IoLogoFacebook size="28px" />
                    </div>
                    <div className="affiliate-overview__introduction--footer-bottom-modal-information-social-media youtube">
                      <IoLogoYoutube size="28px" />
                    </div>
                    <div className="affiliate-overview__introduction--footer-bottom-modal-information-social-media fanpage">
                      <IoGlobeOutline size="28px" />
                    </div>
                  </div>
                  <div className="affiliate-overview__introduction--footer-bottom-modal-information-copyright">
                    <span>@ Bản quyền thuộc sở hữu của GUVI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverView;
