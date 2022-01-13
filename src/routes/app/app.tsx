import _ from 'lodash';
import React, {useEffect, Fragment} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useLocalStorage from '../../helpers/useLocalStorage';
import useGetSizeName from '../../helpers/useGetSizeName';
import {Navbar, If} from '../../components';
import Login from "../../routes/login";

const App: React.FC = () => {
  const [user, setUser, deleteUser] = useLocalStorage('user', {
    id: '',
    login: '',
    email: '',
    token: ''
  });
  const [ sizeName ] = useGetSizeName();

  return (
    <Fragment>
      <If condition={user?.token}>
        <div className={`app-list ${sizeName}`}>
          <Navbar/>
          <main className="app-content">
            <Outlet/>
          </main>
        </div>
      </If>
      {!user?.token && <Login/>}
    </Fragment>
  );
};

export default App;
