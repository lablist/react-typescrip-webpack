import React, { useState, useEffect, useMemo, Fragment } from "react";
import _ from "lodash";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { getQuery, patchQueryFormData } from "../../api/service";
import useLocalStorage from '../../helpers/useLocalStorage';
import rights from "../../helpers/rights";
import UploadButton from "../../components/uploadButton";

interface iUser 
{
  id: string;
  active?: boolean;
  firstname?: string;
  lastname?: string;
  middlename?: string;
  description?: string;
  login?: string;
  email?: string;
  fio?: string;
  oldPassword?: string;
  newPassword?: string;
  token?: string;
  photo?: string;
  rights?: string[];
}

export default function User() {
  const [user, setUser, deleteUser] = useLocalStorage('user', {
    id: '',
    login: '',
    email: '',
    token: ''
  });

  let params = useParams();
  const userId = parseInt(params.userId, 10);

  const [curUser, setCurUser] = useState<iUser>();
  const [newUser, setNewUser] = useState<iUser>();
  const [newPhoto, setNewPhoto] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const getUsers = () => {
      getQuery("/users/read",  user.token, {id: userId}).then((data:any)=>{
        if (!_.isUndefined(data)) {
          setCurUser(data);
          setNewUser(data);
        }
      });
    }
    getUsers();
  }, []);

  const [isAdmin, isGuest] = useMemo(() => ([_.includes(newUser?.rights, "1"), _.includes(newUser?.rights, "2")]), [newUser?.rights])
  const photoSrc = useMemo(() => _.isEmpty(newPhoto) ? `../${curUser.photo}` : newPhoto, [newPhoto, curUser.photo])

  const doSave = ()=> {
    patchQueryFormData("/users/update", user.token, newUser).then((data:any)=>{
      if (!_.isUndefined(data)) {
        setCurUser(data);
        setNewUser(data);
        setNewPhoto("");
        setErrMsg("");
      }
      if (user.id === curUser.id) {
        setUser(data);
      }
    }).catch((err)=>{
      setErrMsg(err)
    });
  }

  return (
    <Fragment>
      <h4>Редактирование пользователя:</h4>
      <div className="row user-form">
        <div className="col-2">
          <span className="image fit">
            {photoSrc === "../" ? <span className="icon-user-circle user-photo"/> : <img src={photoSrc} alt=""/>}
          </span>
        </div>
        <div className="col-10">
          <div className="row user-form">
            <div className="col-5">
              <label>ФИО: {curUser.fio}</label>
            </div>
            <div className="col-5">
              <label>Идентификатор: {curUser.id}</label>
            </div>
          </div>
          <div className="row user-form">
            { user.id === curUser.id && <div className="col-5"><label htmlFor="user-oldPassword">Прежний пароль:</label> <input
                type="password" name="user-oldPassword" value={newUser?.oldPassword} placeholder="Прежний пароль"
                onChange={({target: {value}})=>setNewUser((prev)=>({...prev, oldPassword: value}))}
              /></div>
            }
            <div className="col-5">
              <label htmlFor="user-newPassword">Новый пароль:</label>
              <input type="password" name="user-newPassword" value={newUser.newPassword} placeholder="Новый пароль"
                onChange={({target: {value}})=>setNewUser((prev)=>({...prev, newPassword: value}))}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row user-form">
        <div className="col-12">
          <UploadButton icon="icon-file-image" name="photo" getFiles={(files)=>{
            setNewUser((prev)=>({...prev, photo: _.first(files)}))
          }} getSrc={(imgs)=>{
            setNewPhoto(_.first(imgs))
          }}>Выберите файл</UploadButton>
        </div>
      </div>
      <div className="row user-form">
        <div className="col-6">
          <label htmlFor="user-login">Логин:</label>
          <input type="text" name="user-login" value={newUser.login} placeholder="Логин"
            onChange={({target: {value}})=>setNewUser((prev)=>({...prev, login: value}))}
          />
        </div>
        <div className="col-6">
          <label htmlFor="user-email">Адрес электронной почты:</label>
          <input type="text" name="user-email" value={newUser.email} placeholder="Адрес электронной почты"
            onChange={({target: {value}})=>setNewUser((prev)=>({...prev, email: value}))}
          />
        </div>
      </div>
      <div className="row user-form">
        <div className="col-4">
          <label htmlFor="user-firstname">Имя:</label>
          <input type="text" name="user-firstname" value={newUser.firstname} placeholder="Имя"
            onChange={({target: {value}})=>setNewUser((prev)=>({...prev, firstname: value}))}
          />
        </div>
        <div className="col-4">
          <label htmlFor="user-lastname">Фамилия:</label>
          <input type="text" name="user-lastname" value={newUser.lastname} placeholder="Фамилия"
            onChange={({target: {value}})=>setNewUser((prev)=>({...prev, lastname: value}))}
          />
        </div>
        <div className="col-4">
          <label htmlFor="user-middlename">Отчество:</label>
          <input type="text" name="user-middlename" value={newUser.middlename} placeholder="Отчество"
            onChange={({target: {value}})=>setNewUser((prev)=>({...prev, middlename: value}))}
          />
        </div>
      </div>
      <div className="row user-form">
        <div className="col-12">
          <label htmlFor="user-description">Описание:</label>
          <textarea name="user-description" value={newUser.description} placeholder="Описание"
            onChange={({target: {value}})=>setNewUser((prev)=>({...prev, description: value}))}
          />
        </div>
      </div>
      <div className="row user-form">
        <div className="col-3">
          <input type="checkbox" name="user-admin" checked={isAdmin}/>
          <label htmlFor="user-admin" onClick={()=>{
              setNewUser((prev)=>({...prev, rights: _.includes(prev.rights, "1") ? _.filter(newUser.rights, (i)=>(i!=="1")) : _.uniq([...newUser.rights, "1"])}))
            }}>{rights["1"]}</label>
        </div>
        <div className="col-3">
          <input type="checkbox" name="user-guest" checked={isGuest}/>
          <label htmlFor="user-admin" onClick={()=>{
              setNewUser((prev)=>({...prev, rights: _.includes(prev.rights, "2") ? _.filter(newUser.rights, (i)=>(i!=="2"))  : _.uniq([...newUser.rights, "2"])}))
            }}>{rights["2"]}</label>
        </div>
      </div>
      <div className="row user-form">
        <div className="col-3">
          <input type="checkbox" name="user-active" checked={newUser.active}/>
          <label htmlFor="user-active" onClick={()=>{
            setNewUser((prev)=>({...prev, active: !prev.active}))
          }}>Активный</label>
        </div>
      </div>
      {!_.isEmpty(errMsg) && <div className="row user-form"><div className="col-12">
        <span className="label-info">{errMsg}</span>
        </div></div>}
      <div className="row user-form">
        <div className="col-12">
          <button className="button primary icon-save" onClick={doSave}>Сохранить</button>
        </div>
      </div>
    </Fragment>
  );
}
