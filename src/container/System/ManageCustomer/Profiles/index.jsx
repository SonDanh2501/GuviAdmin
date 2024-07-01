import { FloatButton, Image, Tabs } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useCookies } from "../../../../helper/useCookies";
import i18n from "../../../../i18n";
import user from "../../../../assets/images/user.png";
import { getLanguageState } from "../../../../redux/selectors/auth";
import FavouriteBlock from "./CollaboratorFavoriteBlock";
import DetailsProfile from "./DetailsProfile";
import HistoryTransition from "./History";
import OrderCustomer from "./OrderCustomer";
import CustomerReview from "./Review";
import UsedPromotion from "./UsedPromotion";
import { errorNotify } from "../../../../helper/toast";
import { fetchCustomerById } from "../../../../api/customer";
import { loadingAction } from "../../../../redux/actions/loading";
import "./index.scss";
import useWindowDimensions from "../../../../helper/useWindowDimensions";

const Profiles = () => {
  const { width } = useWindowDimensions();
  const [data, setData] = useState({
    avatar: "",
    birthday: "2000-06-07T00:00:00.000Z",
    identity_date: "2020-11-12T00:00:00.000Z",
  });
  const dispatch = useDispatch();
  const params = useParams();
  const id = params?.id;
  const [saveToCookie, readCookie] = useCookies();
  const [isShowPhone, setIsShowPhone] = useState(false);
  const [activeKey, setActiceKey] = useState("1");
  const lang = useSelector(getLanguageState);
  const [isShowMore, setIsShowMore] = useState(false);

  // useEffect(() => {
  //   setActiceKey(
  //     readCookie("tab-detail-kh") === "" ? "1" : readCookie("tab-detail-kh")
  //   );
  // }, [readCookie]);

  const onChangeTab = (key) => {
    // saveToCookie("tab-detail-kh", key);
    setActiceKey(key);
  };
  // Without Dispatch
  // useEffect(() => {
  //   fetchCustomerById(id)
  //     .then((res) => {
  //       setData(res);
  //     })
  //     .catch((err) => {
  //       errorNotify({
  //         message: err?.message,
  //       });
  //     });
  // }, [id]);
  // With Dispatch
  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    fetchCustomerById(id)
      .then((res) => {
        setData(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id, dispatch]);
  const hidePhoneNumber = (phone) => {
    if (phone) {
      let hidePhone = phone.toString().substring(0, 3);
      hidePhone = hidePhone + "*******";
      return hidePhone;
    }
  };
  console.log("CHECK ID CUSTOMER", id);
  console.log("CHECK CUSTOMER INFORMATION", data);
  return (
    <div className="div-container-customer">
      <div className="div-tab-customer">
        <Tabs activeKey={activeKey} size="small" onChange={onChangeTab}>
          <Tabs.TabPane tab={`${i18n.t("detail", { lng: lang })}`} key="1">
            <DetailsProfile id={id} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`${i18n.t("order", { lng: lang })}`} key="2">
            <OrderCustomer id={id} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${i18n.t("account_history", { lng: lang })}`}
            key="3"
          >
            <HistoryTransition id={id} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${i18n.t("favourite_block", { lng: lang })}`}
            key="4"
          >
            <FavouriteBlock id={id} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={"Khuyến mãi đã sử dụng"} key="5">
            <UsedPromotion id={id} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đánh giá" key="6">
            <CustomerReview id={id} />
          </Tabs.TabPane>
        </Tabs>
      </div>
      {/*Card Profile*/}
      <div className="div-card-profile-customer">
        <div className="headerCard-customer">
          <Image
            style={{
              width: 100,
              height: 100,
              backgroundColor: "transparent",
              borderRadius: 10,
            }}
            src={data?.avatar ? data?.avatar : user}
          />
        </div>
        <div className="mt-2">
          <div className="text-body-customer">
            {data?.password_default && (
              <p style={{ margin: 0 }}>
                {`${i18n.t("default_password", { lng: lang })}`}:{" "}
                {data?.password_default}
              </p>
            )}
            {/*Họ và tên*/}
            <p className="text-name-customer">{data?.full_name}</p>
            {/*Số điện thoại*/}
            <p className="text-phone-customer">
              SĐT:{" "}
              {isShowPhone
                ? `${data?.phone}`
                : `${hidePhoneNumber(data?.phone)}`}
              <i
                style={{ cursor: "pointer", color: "darkgray"}}
                onClick={() => setIsShowPhone(!isShowPhone)}
                className={`${isShowPhone ? "uil-eye-slash" : "uil-eye"}`}
              ></i>
            </p>
            {/*Mã giới thiệu*/}
            {data?.invite_code && (
              <p className="text-sub-customer">
                {`${i18n.t("code_invite", { lng: lang })}`}: {data?.invite_code}
              </p>
            )}
            {/*Tuổi*/}
            {/* {isShowMore ? (
              <p className="text-sub-customer">
                {!data?.birthday
                  ? ""
                  : `${i18n.t("age", { lng: lang })}` +
                    ": " +
                    moment().diff(data?.birthday, "years")}
              </p>
            ) : (
              width > 900 && (
                <p className="text-sub-customer">
                  {!data?.birthday
                    ? ""
                    : `${i18n.t("age", { lng: lang })}` +
                      ": " +
                      moment().diff(data?.birthday, "years")}
                </p>
              )
            )} */}
            {(width > 900 || isShowMore) && (
              <p className="text-sub-customer">
                {!data?.birthday
                  ? ""
                  : `${i18n.t("age", { lng: lang })}` +
                    ": " +
                    moment().diff(data?.birthday, "years")}
              </p>
            )}
            {/*Show More*/}
            {width < 900 && (
              <p
                className="text-showmore-customer"
                onClick={() => setIsShowMore(!isShowMore)}
              >
                {isShowMore ? "Thu gọn" : "Xem thêm"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
