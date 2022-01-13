import React, { Fragment } from "react";
import { useToast } from "../../contexts/toast";
import useDebounce from "../../helpers/useDebounce";
import { Portal } from "../../helpers/usePortal";

const toastDelay = 5 // 5 sec.

const ToastCmp = ({ children, id }) => {
  const { removeToast } = useToast();
  useDebounce(removeToast(id), (toastDelay * 1000));
  return <div className="toast">{children}</div>;
};

const ToastContainer = ({ toasts=[] }) => {
  if (toasts.length === 0) {
    return null;
  }
  return <Portal params={{style: {position: 'fixed', top: 0, left: 0}}}>
    {toasts.map((toast, key)=> 
      <ToastCmp key={key} id={toast.id}>
        {toast.content}
      </ToastCmp>
    )}
    </Portal>;
};

export default ToastContainer;
