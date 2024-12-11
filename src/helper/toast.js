import { toast } from "react-toastify";

export const errorNotify = (notify) => {
  toast.error(notify.message, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: notify.duration || 2500, // Sử dụng duration nếu có, ngược lại sử dụng 2500ms
    ...notify,
  });
};

export const successNotify = (notify) => {
  toast.success(notify.message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2500,
    icon: toast.success,
    ...notify,
  });
};

export const warnNotify = (notify) => {
  toast.warn(notify.message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2500,
    ...notify,
  });
};

export const infoNotify = (notify) => {
  toast.info(notify.message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2500,
    ...notify,
  });
};

export default {
  errorNotify,
  successNotify,
  warnNotify,
  infoNotify,
};
