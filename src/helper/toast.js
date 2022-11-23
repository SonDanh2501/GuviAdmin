import { toast } from "react-toastify";

export const errorNotify = (notify) => {
  toast.error(notify.message, {
    position: toast.POSITION.TOP_RIGHT,
    ...notify,
  });
};

export const successNotify = (notify) => {
  toast.success(notify.message, {
    position: toast.POSITION.TOP_RIGHT,
    ...notify,
  });
};

export const warnNotify = (notify) => {
  toast.warn(notify.message, {
    position: toast.POSITION.TOP_RIGHT,
    ...notify,
  });
};

export const infoNotify = (notify) => {
  toast.info(notify.message, {
    position: toast.POSITION.TOP_RIGHT,
    ...notify,
  });
};

export default {
  errorNotify,
  successNotify,
  warnNotify,
  infoNotify,
};
