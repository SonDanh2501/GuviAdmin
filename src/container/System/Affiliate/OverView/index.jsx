import React, { useState } from "react";
import icons from "../../../../utils/icons";
import "./index.scss";
import ButtonCustom from "../../../../components/button";
import { errorNotify, infoNotify } from "../../../../helper/toast";

import appleStoreImage from "../../../../assets/images/apple_store.svg";
import chStoreImage from "../../../../assets/images/google_play.svg";
import appScreenImage from "../../../../assets/images/app_screen.png";
import copyRightImage from "../../../../assets/images/copy_right.png";
import logoGuvi from "../../../../assets/images/LogoS.svg";
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
  const [isSelectCard, setIsSelectCard] = useState(0);

  const handleCopyLink = () => {
    infoNotify({
      message: "Copy đường link chia sẻ thành công",
    });
  };
  return (
    // <div className="affiliate-overview">
    //   {/* Card steps */}
    //   <div className="affiliate-overview__cards-step">
    //     {/* Card 1 */}
    //     <div
    //       onMouseOver={() => {
    //         setIsSelectCard(0);
    //       }}
    //       className={`affiliate-overview__cards-step-card card-shadow ${
    //         isSelectCard === 0 && "select-card"
    //       } `}
    //     >
    //       {/* Icon */}
    //       <div className="affiliate-overview__cards-step-card--icon">
    //         <IoLink size={24} />
    //       </div>
    //       {/* Label */}
    //       <span className="affiliate-overview__cards-step-card--label">
    //         Chia sẽ đường link
    //       </span>
    //       <span className="affiliate-overview__cards-step-card--sub-label">
    //         Nhanh chóng và dễ dàng chia sẻ, copy và gửi người muốn giới thiệu
    //       </span>
    //     </div>
    //     {/* Card 2 */}
    //     <div
    //       onMouseOver={() => {
    //         setIsSelectCard(1);
    //       }}
    //       className={`affiliate-overview__cards-step-card card-shadow ${
    //         isSelectCard === 1 && "select-card"
    //       } `}
    //     >
    //       {/* Icon */}
    //       <div className="affiliate-overview__cards-step-card--icon">
    //         <IoPeople size={24} />
    //       </div>
    //       {/* Label */}
    //       <span className="affiliate-overview__cards-step-card--label">
    //         Giới thiệu thành công
    //       </span>
    //       <span className="affiliate-overview__cards-step-card--sub-label">
    //         Người được giới thiệu theo đường dẫn được chia sẽ và tải ứng dụng và
    //         đăng ký
    //       </span>
    //     </div>
    //     {/* Card 3 */}
    //     <div
    //       onMouseOver={() => {
    //         setIsSelectCard(2);
    //       }}
    //       className={`affiliate-overview__cards-step-card card-shadow ${
    //         isSelectCard === 2 && "select-card"
    //       } `}
    //     >
    //       {/* Icon */}
    //       <div className="affiliate-overview__cards-step-card--icon">
    //         <IoBagAdd size={24} />
    //       </div>
    //       {/* Label */}
    //       <span className="affiliate-overview__cards-step-card--label">
    //         Nhận chiết khấu
    //       </span>
    //       <span className="affiliate-overview__cards-step-card--sub-label">
    //         Nhận ngay 5% chiết khấu khi người được giới thiệu hoàn thành đơn
    //         hàng
    //       </span>
    //     </div>
    //   </div>
    //   {/* Thẻ giới thiệu tổng */}
    //   <div className="affiliate-overview__image-wrapper card-shadow">
    //     <img
    //       className="affiliate-overview__image-wrapper--image"
    //       src={Banner}
    //       alt="Mô tả hình ảnh"
    //     />
    //     <div className="affiliate-overview__image-wrapper--overlay"></div>
    //   </div>
    //   {/* Các đường link chia sẻ khác */}
    //   <div className="affiliate-overview__links card-shadow">
    //     <span className="affiliate-overview__links--label">
    //       Các đường link chia sẻ
    //     </span>
    //     <div className="affiliate-overview__links-wrapper">
    //       {/* Link 1 */}
    //       <div className="affiliate-overview__links--link">
    //         <span className="affiliate-overview__links--link-header">
    //           Nhận ngay chiết khấu
    //         </span>
    //         <div className="affiliate-overview__links--link-body">
    //           <span className="affiliate-overview__links--link-body-text">
    //             Giới thiệu và nhận ngay <span className="high-light">5%</span>{" "}
    //             cho các đơn thành công của người được giới thiệu. Nếu là đơn đầu
    //             tiên sẽ được thưởng thêm{" "}
    //             <span className="high-light">50.000 VNĐ</span>
    //           </span>
    //           <div
    //             onClick={() => handleCopyLink()}
    //             className="affiliate-overview__links--link-body-navigate-link"
    //           >
    //             <span>Link:</span>
    //             <a>https://play.google.com/store</a>
    //             <IoCopyOutline color="orange" />
    //           </div>
    //         </div>
    //       </div>
    //       {/* Line */}
    //       <div className="affiliate-overview__links--link-line">
    //         <div className="affiliate-overview__links--link-line-icon">
    //           <IoSwapHorizontal size="20px" color="orange" />
    //         </div>
    //       </div>
    //       {/* Link 2 */}
    //       <div className="affiliate-overview__links--link">
    //         <span className="affiliate-overview__links--link-header">
    //           Gửi voucher cho người được giới thiệu
    //         </span>
    //         <div className="affiliate-overview__links--link-body">
    //           <span className="affiliate-overview__links--link-body-text">
    //             Gửi voucher đến người được giới thiệu và nhận{" "}
    //             <span className="high-light">5%</span> bắt đầu từ đơn thứ 2
    //             thành công của người được giới thiệu. Nếu là đơn đầu tiên sẽ
    //             được thưởng thêm <span className="high-light">50.000đ</span>
    //           </span>
    //           <div
    //             onClick={() => handleCopyLink()}
    //             className="affiliate-overview__links--link-body-navigate-link"
    //           >
    //             <span>Link:</span>
    //             <a>https://play.google.com/store</a>
    //             <IoCopyOutline color="orange" />
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="affiliate-overview">
      {/* Landing Page */}
      <div className="affiliate-overview__landing-page">
        <div className="affiliate-overview__landing-page--content">
          <div className="affiliate-overview__landing-page--content-left">
            <span className="affiliate-overview__landing-page--content-left-header">
              <span className="affiliate-overview__landing-page--content-left-header-orange">
                Gu
              </span>
              <span className="affiliate-overview__landing-page--content-left-header-purple">
                vi
              </span>{" "}
              {/* <img
                className="affiliate-overview__landing-page--content-left-header-logo"
                src={logoGuvi}
              ></img> */}
              ứng dụng giúp việc tiện lợi
            </span>
            <span className="affiliate-overview__landing-page--content-left-description">
              Đặt lịch giúp việc theo giờ tại GUVI thật dễ dàng, nhanh chóng,
              tiết kiệm và chuyên nghiệp.
            </span>
            {/* <div className="affiliate-overview__landing-page--content-left-line"></div> */}
            <div className="affiliate-overview__landing-page--content-left-download">
              <img src={chStoreImage}></img>
              <img src={appleStoreImage}></img>
            </div>
          </div>
          <div className="affiliate-overview__landing-page--content-right">
            <div className="affiliate-overview__landing-page--content-right-circle">
              <img
                className="affiliate-overview__landing-page--content-right-circle-image"
                src={appScreenImage}
              ></img>
              <div className="affiliate-overview__landing-page--content-right-circle-icon circle bottom-left"></div>
              <div className="affiliate-overview__landing-page--content-right-circle-icon line_1 top-right"></div>
              <div className="affiliate-overview__landing-page--content-right-circle-icon line_2 top-right"></div>
            </div>
          </div>
        </div>
      </div>
      {/* Service of GUVI */}
      <div className="affiliate-overview__service">
        <div className="affiliate-overview__service--content">
          <div className="affiliate-overview__service--content-steps">
            <div className="affiliate-overview__service--content-steps-step">
              {/* Icon */}
              <div className="affiliate-overview__service--content-steps-step-icon">
                <IoLink size="48px" color="#f97316" />
              </div>
              {/* Header */}
              <span className="affiliate-overview__service--content-steps-step-header">
                Chia sẻ đường link
              </span>
              <span className="affiliate-overview__service--content-steps-step-description">
                Copy và chia sẻ đường link đến những người muốn giới thiệu
              </span>
              {/* Description */}
            </div>
            <div className="affiliate-overview__service--content-steps-icon">
              <MdDoubleArrow size="44px" color="#f97316" />
            </div>
            <div className="affiliate-overview__service--content-steps-step">
              {/* Icon */}
              <div className="affiliate-overview__service--content-steps-step-icon">
                <IoPeopleOutline size="48px" color="#f97316" />
              </div>
              {/* Header */}
              <span className="affiliate-overview__service--content-steps-step-header">
                Giới thiệu thành công
              </span>
              <span className="affiliate-overview__service--content-steps-step-description">
                Người được giới thiệu hoàn thành đơn hàng đầu tiên
              </span>
              {/* Description */}
            </div>
            <div className="affiliate-overview__service--content-steps-icon">
              <MdDoubleArrow size="44px" color="#f97316" />
            </div>
            <div className="affiliate-overview__service--content-steps-step">
              {/* Icon */}
              <div className="affiliate-overview__service--content-steps-step-icon">
                <IoBagOutline size="48px" color="#f97316" />
              </div>
              {/* Header */}
              <span className="affiliate-overview__service--content-steps-step-header">
                Nhận chiết khấu
              </span>
              <span className="affiliate-overview__service--content-steps-step-description">
                Nhận ngay 5% chiết khấu khi người được giới thiệu hoàn thành đơn
                hàng
              </span>
              {/* Description */}
            </div>
          </div>
        </div>
      </div>
      {/* Affieliate Guide */}
      <div className="affiliate-overview__affieliate-guide">
        <div className="affiliate-overview__affieliate-guide--content">
          <div className="affiliate-overview__affieliate-guide--content-left">
            <span className="affiliate-overview__affieliate-guide--content-left-header">
              Nhận ngay chiết khấu
            </span>
            <span className="affiliate-overview__affieliate-guide--content-left-description">
              Giới thiệu và nhận ngay <span className="high-light">5%</span> cho
              các đơn thành công của người được giới thiệu. Nếu là đơn đầu tiên
              sẽ được thưởng thêm <span className="high-light">50.000đ</span>
            </span>
            <span className="affiliate-overview__affieliate-guide--content-left-link-title">
              Đường dẫn:
            </span>
            <span className="affiliate-overview__affieliate-guide--content-left-link">
              https://apps.apple.com/us/app/guvi <IoCopy color="#f97316" />
            </span>
          </div>
          <div className="affiliate-overview__affieliate-guide--content-line">
            <div className="affiliate-overview__affieliate-guide--content-line-icon">
              <IoSwapHorizontal size="40px" color="#9ca3af" />
            </div>
          </div>
          <div className="affiliate-overview__affieliate-guide--content-left">
            <span className="affiliate-overview__affieliate-guide--content-left-header">
              Nhận ngày voucher giảm giá
            </span>
            <span className="affiliate-overview__affieliate-guide--content-left-description">
              Gửi voucher đến người được giới thiệu và nhận{" "}
              <span className="high-light">5%</span> bắt đầu từ đơn thứ 2 thành
              công của người được giới thiệu. Nếu là đơn đầu tiên sẽ được thưởng
              thêm <span className="high-light">50.000đ</span>
            </span>
            <span className="affiliate-overview__affieliate-guide--content-left-link-title">
              Đường dẫn:
            </span>
            <span className="affiliate-overview__affieliate-guide--content-left-link">
              https://apps.apple.com/us/app/guvi <IoCopy color="#f97316" />
            </span>
          </div>
        </div>
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
            <img
              className="affiliate-overview__footer--content-information-image"
              src={chStoreImage}
            ></img>
            <img
              className="affiliate-overview__footer--content-information-image"
              src={appleStoreImage}
            ></img>
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
            <IoLogoFacebook size="40px" color="white" />
            <IoLogoTiktok size="40px" color="white" />
            <IoLogoYoutube size="40px" color="white" />
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
