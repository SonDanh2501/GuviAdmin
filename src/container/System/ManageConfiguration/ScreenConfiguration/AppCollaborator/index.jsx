import { Button, Image } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSettingAppCollaboratorApi,
  updateSettingAppCollaboratorApi,
} from "../../../../../api/configuration";
import { postFile } from "../../../../../api/file";
import CustomTextInput from "../../../../../components/CustomTextInput/customTextInput";
import { errorNotify } from "../../../../../helper/toast";
import { loadingAction } from "../../../../../redux/actions/loading";
import resizeFile from "../../../../../helper/resizer";
import "./styles.scss";
import { getElementState } from "../../../../../redux/selectors/auth";

const AppCollaborator = () => {
  const [valueVersion, setValueVersion] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const checkElement = useSelector(getElementState);

  const dispatch = useDispatch();

  useEffect(() => {
    getSettingAppCollaboratorApi()
      .then((res) => {
        setValueVersion(res?.support_version_app);
        setMaxDistance(res?.max_distance_order);
        setImgThumbnail(res?.background_header);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onChangeBackground = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    try {
      if (e.target.files[0]) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgThumbnail(reader.result);
        });
        reader.readAsDataURL(e.target.files[0]);
      }
      const file = e.target.files[0];
      const image = await resizeFile(file);
      const formData = new FormData();
      formData.append("file", image);
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
    } catch (err) {
      console.log(err);
    }
  };

  const updateApp = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    updateSettingAppCollaboratorApi({
      support_version_app: valueVersion,
      max_distance_order: maxDistance,
      background_header: imgThumbnail,
    })
      .then((res) => {
        dispatch(loadingAction.loadingRequest(false));
        getSettingAppCollaboratorApi()
          .then((res) => {
            setValueVersion(res?.support_version_app);
            setMaxDistance(res?.max_distance_order);
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
  }, [valueVersion, maxDistance, imgThumbnail]);

  return (
    <div className="container-app-customer">
      <a className="label-kh">Cấu hình ứng dụng Cộng tác viên</a>
      <CustomTextInput
        label={"Phiên bản ứng dụng"}
        className="input-version"
        classNameForm="form-input"
        type="text"
        value={valueVersion}
        onChange={(e) => setValueVersion(e.target.value)}
      />

      <CustomTextInput
        label={"Khoảng cách công việc 'tối đa'"}
        className="input-version"
        classNameForm="form-input-distance"
        type="number"
        value={maxDistance}
        onChange={(e) => setMaxDistance(e.target.value)}
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

      {checkElement?.includes("edit_app_collaborator_setting") && (
        <Button className="btn-update" onClick={updateApp}>
          Cập nhật
        </Button>
      )}
    </div>
  );
};

export default AppCollaborator;
