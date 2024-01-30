import { Button } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSettingAppCollaboratorApi,
  updateSettingAppCollaboratorApi,
} from "../../../../../api/configuration";
import InputCustom from "../../../../../components/textInputCustom";
import UploadImage from "../../../../../components/uploadImage";
import { errorNotify } from "../../../../../helper/toast";
import { loadingAction } from "../../../../../redux/actions/loading";
import { getElementState } from "../../../../../redux/selectors/auth";
import "./styles.scss";

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
              message: err?.message,
            });
          });
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
        errorNotify({
          message: err?.message,
        });
      });
  }, [valueVersion, maxDistance, imgThumbnail]);

  return (
    <div className="container-app-customer">
      <a className="label-kh">Cấu hình ứng dụng Cộng tác viên</a>
      <InputCustom
        title="Phiên bản ứng dụng"
        type="text"
        value={valueVersion}
        onChange={(e) => setValueVersion(e.target.value)}
        style={{ width: 300 }}
      />
      <InputCustom
        title="Khoảng cách công việc 'tối đa'"
        type="number"
        value={maxDistance}
        onChange={(e) => setMaxDistance(e.target.value)}
        style={{ width: 300 }}
      />
      <UploadImage
        title={"Header"}
        image={imgThumbnail}
        setImage={setImgThumbnail}
        classImg={"img-background-header"}
      />

      {checkElement?.includes("edit_app_collaborator_setting") && (
        <Button className="btn-update" onClick={updateApp}>
          Cập nhật
        </Button>
      )}
    </div>
  );
};

export default AppCollaborator;
