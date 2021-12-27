import _ from 'lodash';
import React, {useEffect} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useLocalStorage from '../../helpers/useLocalStorage';
import useGetSizeName from '../../helpers/useGetSizeName';
import Navbar from '../../components/navbar';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser, deleteUser] = useLocalStorage('user', {
    id: '',
    login: '',
    email: '',
    token: ''
  });
  const [ sizeName ] = useGetSizeName();

  useEffect(() => {
    if (!user?.token) {
      navigate("/login");
    }
  }, []);

  return (
    <div className={`app-list ${sizeName}`}>
      <Navbar/>
      <main className="app-content">
        <Outlet/>
      </main>
    </div>
  );
};

export default App;
