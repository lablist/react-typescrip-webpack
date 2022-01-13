import React, { useState, useContext, useCallback } from "react";
import { ToastContainer } from "../components";

export const ToastContext = React.createContext(null);

let id = 1;
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((content) => {
    setToasts(toasts => [...toasts, { id: id++, content}]);
  }, [setToasts]);

  const removeToast = useCallback((id) => {
      setToasts(toasts => toasts.filter(t => t.id !== id));
  }, [setToasts]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      <ToastContainer toasts={toasts}/>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const contexted = useContext(ToastContext);
  return contexted;
};
