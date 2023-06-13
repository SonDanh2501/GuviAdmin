import { Button } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSettingAppCustomerApi,
  updateSettingAppCustomerApi,
} from "../../../../../api/configuration";
import { errorNotify } from "../../../../../helper/toast";
import { loadingAction } from "../../../../../redux/actions/loading";

import InputCustom from "../../../../../components/textInputCustom";
import UploadImage from "../../../../../components/uploadImage";
import { getElementState } from "../../../../../redux/selectors/auth";
import "./styles.scss";

const AppCustomer = () => {
  const [valueVersion, setValueVersion] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [maxMember, setMaxMember] = useState();
  const [minSilver, setMinSilver] = useState();
  const [maxSilver, setMaxSilver] = useState();
  const [minGold, setMinGold] = useState();
  const [maxGold, setMaxGold] = useState();
  const [minPlatimun, setMinPlatinum] = useState();
  const [maxPlatinum, setMaxPlatinum] = useState();
  const [ratioMember, setRatioMember] = useState();
  const [ratioSilver, setRatioSilver] = useState();
  const [ratioGold, setRatioGold] = useState();
  const [ratioPlatinum, setRatioPlatinum] = useState();
  const checkElement = useSelector(getElementState);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getSettingAppCustomerApi()
      .then((res) => {
        setValueVersion(res?.support_version_app);
        setImgThumbnail(res?.background_header);
        setMaxMember(res?.rank_member_max_point);
        setMinSilver(res?.rank_silver_minium_point);
        setMaxSilver(res?.rank_silver_max_point);
        setMinGold(res?.rank_gold_minium_point);
        setMaxGold(res?.rank_gold_max_point);
        setMinPlatinum(res?.rank_platinum_minium_point);
        setMaxPlatinum(res?.rank_platinum_max_point);
        setRatioMember(res?.ratio_of_price_to_point_member);
        setRatioSilver(res?.ratio_of_price_to_point_silver);
        setRatioGold(res?.ratio_of_price_to_point_gold);
        setRatioPlatinum(res?.ratio_of_price_to_point_platium);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
      });
  }, []);

  const updateApp = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    updateSettingAppCustomerApi({
      support_version_app: valueVersion,
      background_header: imgThumbnail,
      rank_member_max_point: maxMember,
      rank_gold_minium_point: minGold,
      rank_gold_max_point: maxGold,
      rank_silver_minium_point: minSilver,
      rank_silver_max_point: maxSilver,
      rank_platinum_minium_point: minPlatimun,
      rank_platinum_max_point: maxPlatinum,
      ratio_of_price_to_point_member: ratioMember,
      ratio_of_price_to_point_silver: ratioSilver,
      ratio_of_price_to_point_gold: ratioGold,
      ratio_of_price_to_point_platium: ratioPlatinum,
    })
      .then((res) => {
        dispatch(loadingAction.loadingRequest(false));

        getSettingAppCustomerApi()
          .then((res) => {
            setValueVersion(res?.support_version_app);
            setImgThumbnail(res?.background_header);
            setMaxMember(res?.rank_member_max_point);
            setMinSilver(res?.rank_silver_minium_point);
            setMaxSilver(res?.rank_silver_max_point);
            setMinGold(res?.rank_gold_minium_point);
            setMaxGold(res?.rank_gold_max_point);
            setMinPlatinum(res?.rank_platimun_minium_point);
            setMaxPlatinum(res?.rank_platinum_max_point);
            setRatioMember(res?.ratio_of_price_to_point_member);
            setRatioSilver(res?.ratio_of_price_to_point_silver);
            setRatioGold(res?.ratio_of_price_to_point_gold);
            setRatioPlatinum(res?.ratio_of_price_to_point_platium);
          })
          .catch((err) => {
            dispatch(loadingAction.loadingRequest(false));

            errorNotify({
              message: err,
            });
          });
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
        errorNotify({
          message: err,
        });
      });
  }, [
    valueVersion,
    imgThumbnail,
    maxMember,
    minSilver,
    maxSilver,
    minGold,
    maxGold,
    minPlatimun,
    maxPlatinum,
    ratioMember,
    ratioSilver,
    ratioGold,
    ratioPlatinum,
  ]);

  return (
    <div className="container-app-customer">
      <a className="label-kh">Cấu hình ứng dụng Khách hàng</a>
      <div className="div-body-app-customer">
        <div>
          <InputCustom
            title="Phiên bản ứng dụng"
            type="text"
            value={valueVersion}
            onChange={(e) => setValueVersion(e.target.value)}
          />
          <UploadImage
            title={"Header"}
            image={imgThumbnail}
            setImage={setImgThumbnail}
            classImg={"img-background-header"}
          />
        </div>

        <div className="div-col-right">
          <InputCustom
            title="Điểm tối thiểu thành Member"
            type="number"
            disabled={true}
            value={0}
          />
          <InputCustom
            title="Điểm tối thiểu thành Silver"
            type="number"
            value={minSilver}
            onChange={(e) => setMinSilver(e.target.value)}
          />
          <InputCustom
            title="Điểm tối thiểu thành Gold"
            type="number"
            value={minGold}
            onChange={(e) => setMinGold(e.target.value)}
          />
          <InputCustom
            title="Điểm tối thiểu thành Platinum"
            type="number"
            value={minPlatimun}
            onChange={(e) => setMinPlatinum(e.target.value)}
          />
        </div>

        <div className="div-col-right">
          <InputCustom
            title="Điểm tối đa thành Member"
            type="number"
            value={maxMember}
            onChange={(e) => setMaxMember(e.target.value)}
          />
          <InputCustom
            title="Điểm tối đa thành Silver"
            type="number"
            value={maxSilver}
            onChange={(e) => setMaxSilver(e.target.value)}
          />
          <InputCustom
            title="Điểm tối đa thành Gold"
            type="number"
            value={maxGold}
            onChange={(e) => setMaxGold(e.target.value)}
          />
          <InputCustom
            title="Điểm tối đa thành Platinum"
            type="number"
            value={maxPlatinum}
            onChange={(e) => setMaxPlatinum(e.target.value)}
          />
        </div>

        <div className="div-col-right">
          <InputCustom
            title="Tỉ lệ quy đổi thành viên (10,000 VNĐ)"
            type="number"
            value={ratioMember}
            onChange={(e) => setRatioMember(e.target.value)}
          />
          <InputCustom
            title="Tỉ lệ quy đổi thành viên Silver (10,000 VNĐ)"
            type="number"
            value={ratioSilver}
            onChange={(e) => setRatioSilver(e.target.value)}
          />
          <InputCustom
            title="Tỉ lệ quy đổi thành viên Gold (10,000 VNĐ)"
            type="number"
            value={ratioGold}
            onChange={(e) => setRatioGold(e.target.value)}
          />
          <InputCustom
            title="Tỉ lệ quy đổi thành viên Platinum (10,000 VNĐ)"
            type="number"
            value={ratioPlatinum}
            onChange={(e) => setRatioPlatinum(e.target.value)}
          />
        </div>
      </div>
      {checkElement?.includes("edit_app_customer_setting") && (
        <Button className="btn-update" onClick={updateApp}>
          Cập nhật
        </Button>
      )}
    </div>
  );
};

export default AppCustomer;
