import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../../helpers/useLocalStorage';
import { useToast } from '../../contexts/toast';
import _ from "lodash";
import { postQuery } from "../../api/service";
import "./login.scss";

export default function Login() {
  const [user, setUser, deleteUser] = useLocalStorage('user', {
    id: '',
    login: '',
    email: '',
    token: ''
  });
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const { addToast } = useToast();

  const onSubmit = (event) => {
    event.preventDefault();
    console.log("submission prevented");
  };

  const doLogin = () => {
    postQuery("/users/login", "", {
      "login": login,
      "password": password
    }).then((data)=>{
      setUser(data);
   //   navigate("/");
    }).catch((errMsg)=>{
      //addToast(errMsg)
    });
  }

  return (
    <div id="login-page">
      <div className="content">
        <div className="login-container">
          <form className="login-form" onSubmit={onSubmit}>
            <h5>Управление контентом</h5>
            <div className="inputs">
              <div className="input-container">
                <div className="label">Email</div>
                <div className="input-content">
                  <span className="icon-person"></span>
                  <input type="text" placeholder="Логин" onChange={({target}) => setLogin(target.value)} required/>
                </div>
              </div>
              <div className="input-container">
                <div className="label">Пароль</div>
                <div className="input-content">
                <span className="icon-vpn_key"></span>
                <input type="password" placeholder="Пароль" onChange={({target}) => setPassword(target.value)} required/>
                </div>
              </div>
            </div>
            <a href="#" className="button primary" onClick={doLogin}>Войти</a>
          </form>
        </div>
        <div className="logo-container">
          <span className="icon-logo">
            <span className="path1"></span>
            <span className="path2"></span>
          </span>
        </div>
      </div>
    </div>
  );
}
