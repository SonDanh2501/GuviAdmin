import { toast } from "react-toastify";

export const errorNotify = (notify) => {
  toast.error(notify.message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000, 
    ...notify,
  });
};

export const successNotify = (notify) => {
  toast.success(notify.message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
    ...notify,
  });
};

export const warnNotify = (notify) => {
  toast.warn(notify.message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
    ...notify,
  });
};

export const infoNotify = (notify) => {
  toast.info(notify.message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
    ...notify,
  });
};

export default {
  errorNotify,
  successNotify,
  warnNotify,
  infoNotify,
};
