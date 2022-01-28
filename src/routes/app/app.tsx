import _ from "lodash";
import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
import { StoreProvider } from '../../contexts/store';
import { ToastProvider } from '../../contexts/toast';
import { TextEditorProvider } from "../../contexts/textEditor";
import useLocalStorage from "../../helpers/useLocalStorage";
import useGetSizeName from "../../helpers/useGetSizeName";
import { Navbar, If } from "../../components";
import Login from "../../routes/login";

const App: React.FC = () => {
  const [user, setUser, deleteUser] = useLocalStorage("user", {
    id: "",
    login: "",
    email: "",
    token: ""
  });
  const [ sizeName ] = useGetSizeName();

  return (
    <StoreProvider>
      <ToastProvider>
        <TextEditorProvider>
          <If condition={user?.token}>
            <div className={`app-list ${sizeName}`}>
              <Navbar/>
              <main className="app-content">
                <Outlet/>
              </main>
            </div>
          </If>
          <If condition={!user?.token}>
            <Login/>
          </If>
        </TextEditorProvider>
      </ToastProvider>
    </StoreProvider>
  );
};

export default App;
