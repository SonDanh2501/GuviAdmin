import { Button, Image } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getSettingAppCustomerApi,
  updateSettingAppCustomerApi,
} from "../../../../../api/configuration";
import { postFile } from "../../../../../api/file";
import CustomTextInput from "../../../../../components/CustomTextInput/customTextInput";
import { errorNotify } from "../../../../../helper/toast";
import { loadingAction } from "../../../../../redux/actions/loading";
import "./styles.scss";

const AppCustomer = () => {
  const [valueVersion, setValueVersion] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    getSettingAppCustomerApi()
      .then((res) => {
        setValueVersion(res?.support_version_app);
        setImgThumbnail(res?.background_header);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onChangeBackground = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgThumbnail(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    dispatch(loadingAction.loadingRequest(true));

    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setImgThumbnail(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const updateApp = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    updateSettingAppCustomerApi({
      support_version_app: valueVersion,
      background_header: imgThumbnail,
    })
      .then((res) => {
        dispatch(loadingAction.loadingRequest(false));

        getSettingAppCustomerApi()
          .then((res) => {
            setValueVersion(res?.support_version_app);
            setImgThumbnail(res?.background_header);
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
  }, [valueVersion, imgThumbnail]);

  return (
    <div className="container-app-customer">
      <a className="label-kh">Cấu hình ứng dụng Khách hàng</a>
      <CustomTextInput
        label={"Phiên bản ứng dụng"}
        className="input-version"
        classNameForm="form-input"
        type="text"
        value={valueVersion}
        onChange={(e) => setValueVersion(e.target.value)}
      />
      <CustomTextInput
        label={"Phiên bản ứng dụng"}
        className="input-image"
        type="file"
        accept={".jpg,.png,.jpeg"}
        onChange={onChangeBackground}
      />
      {imgThumbnail && (
        <Image
          src={imgThumbnail}
          className="img-background-header"
          style={{
            with: 500,
            height: 150,
            backgroundColor: "transparent",
          }}
        />
      )}

      <Button className="btn-update" onClick={updateApp}>
        Cập nhật
      </Button>
    </div>
  );
};

export default AppCustomer;
