import React, { useState, useEffect, useMemo, Fragment, useRef } from "react";
import _ from "lodash";
import { getQuery, patchQuery } from "../../api/service";
import useLocalStorage from '../../helpers/useLocalStorage';
import "./organization.scss";

interface iСompany {
  phone: string;
  additionalphone: string;
  email: string;
  postalcode: string;
  address: string;
  fulladdress: string;
  organizationname: string;
  accountnumber: string;
  beneficiarybank: string;
  bik: string;
  correctionaccount: string;
  inn: string;
  psrn: string;
  checkpointnumber: string;
  yandexmap: string;
  sitetitle: string;
  sitedescription: string;
  sitekeywords: string;
  sitename: string;
  fullorganizationname: string;
}

export default function Organization() {
  const [user, setUser, deleteUser] = useLocalStorage('user', {
    id: '',
    login: '',
    email: '',
    photo: '',
    token: ''
  });

  const [company, setСompany] = useState<iСompany>();
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const getCompany = () => {
      getQuery("/company/read",  user.token).then((data:any)=>{
        if (!_.isUndefined(data)) {
          setСompany(data);
        }
      });
    }
    getCompany();
  }, []);

  const doSave = ()=> {
    patchQuery("/company/update", user.token, company).then((data:any)=>{
      if (!_.isUndefined(data)) {
        setСompany(data);
        setErrMsg("");
      }
    }).catch((err)=>{
      setErrMsg(err)
    });
  }

  const onSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div id="organization">
      <h4>Редактирование организация:</h4>
      <form action="#" onSubmit={onSubmit}>
        <div className="row user-form">
          <div className="col-6">
            <label htmlFor="user-login">Телефон:</label>
            <input type="text" name="user-login" value={company?.phone ? company.phone : ""} placeholder="Телефон"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, phone: value}))}
            />
          </div>
          <div className="col-6">
            <label htmlFor="user-email">Дополнительный телефон:</label>
            <input type="text" name="user-email" value={company?.additionalphone ? company.additionalphone : ""} placeholder="Дополнительный телефон"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, additionalphone: value}))}
            />
          </div>
        </div>
        <div className="row user-form">
          <div className="col-6">
            <label htmlFor="user-firstname">Электронная почта:</label>
            <input type="text" name="user-firstname" value={company?.email ? company.email : ""} placeholder="Электронная почта"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, email: value}))}
            />
          </div>
          <div className="col-6">
            <label htmlFor="user-middlename">Почтовый индекс:</label>
            <input type="text" name="user-middlename" value={company?.postalcode ? company.postalcode : ""} placeholder="Почтовый индекс"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, postalcode: value}))}
            />
          </div>
        </div>
        <div className="row user-form">
          <div className="col-6">
            <label htmlFor="user-firstname">Адрес:</label>
            <input type="text" name="user-firstname" value={company?.address ? company.address : ""} placeholder="Адрес"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, address: value}))}
            />
          </div>
          <div className="col-6">
            <label htmlFor="user-middlename">Полный адрес:</label>
            <input type="text" name="user-middlename" value={company?.fulladdress ? company.fulladdress : ""} placeholder="Полный адрес"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, fulladdress: value}))}
            />
          </div>
        </div>
        <div className="row user-form">
          <div className="col-6">
            <label htmlFor="user-firstname">Имя организации:</label>
            <input type="text" name="user-firstname" value={company?.organizationname ? company.organizationname : ""} placeholder="Имя организации"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, organizationname: value}))}
            />
          </div>
          <div className="col-6">
            <label htmlFor="user-middlename">Полное имя организации:</label>
            <input type="text" name="user-middlename" value={company?.fullorganizationname ? company.fullorganizationname : ""} placeholder="Полное имя организации"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, fullorganizationname: value}))}
            />
          </div>
        </div>
        <div className="row user-form">
          <div className="col-4">
            <label htmlFor="user-firstname">Номер счета:</label>
            <input type="text" name="user-firstname" value={company?.accountnumber ? company.accountnumber : ""} placeholder="Номер счета"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, accountnumber: value}))}
            />
          </div>
          <div className="col-4">
            <label htmlFor="user-middlename">Банк получателя:</label>
            <input type="text" name="user-middlename" value={company?.beneficiarybank ? company.beneficiarybank : ""} placeholder="Банк получателя"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, beneficiarybank: value}))}
            />
          </div>
          <div className="col-4">
            <label htmlFor="user-middlename">БИК:</label>
            <input type="text" name="user-middlename" value={company?.bik ? company.bik : ""} placeholder="БИК"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, bik: value}))}
            />
          </div>
        </div>
        <div className="row user-form">
          <div className="col-4">
            <label htmlFor="user-firstname" title={company?.correctionaccount}>Корреспондентский счёт:</label>
            <input type="text" name="user-firstname" value={company?.correctionaccount ? company.correctionaccount : ""} placeholder="Корреспондентский счёт"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, correctionaccount: value}))}
            />
          </div>
          <div className="col-4">
            <label htmlFor="user-firstname" title="Идентификационный номер налогоплательщика">ИНН:</label>
            <input type="text" name="user-firstname" value={company?.inn ? company.inn : ""} placeholder="ИНН"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, inn: value}))}
            />
          </div>
          <div className="col-4">
            <label htmlFor="user-middlename" title="Основной государственный регистрационный номер">ОГРН:</label>
            <input type="text" name="user-middlename" value={company?.psrn ? company.psrn : ""} placeholder="ОГРН"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, psrn: value}))}
            />
          </div>
        </div>
        <div className="row user-form">
          <div className="col-4">
            <label htmlFor="user-middlename">КПП:</label>
            <input type="text" name="user-middlename" value={company?.checkpointnumber ? company.checkpointnumber : ""} placeholder="КПП"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, checkpointnumber: value}))}
            />
          </div>
        </div>
        <div className="row user-form">
          <div className="col-6">
            <label htmlFor="user-login" title={company?.sitetitle}>Основное имя сайта <i>title</i>:</label>
            <input type="text" name="user-login" value={company?.sitetitle ? company.sitetitle : ""} placeholder="Главное имя вкладки сайта"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, sitetitle: value}))}
            />
          </div>
          <div className="col-6">
            <label htmlFor="user-email" title={company?.sitedescription}>Основное описание сайта <i>description</i>:</label>
            <input type="text" name="user-email" value={company?.sitedescription ? company.sitedescription : ""} placeholder="Главное описание вкладки сайта"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, sitedescription: value}))}
            />
          </div>
        </div>
        <div className="row user-form">
          <div className="col-6">
            <label htmlFor="user-login" title={company?.sitekeywords}>Основные ключевые слова сайта <i>keywords</i>:</label>
            <input type="text" name="user-login" value={company?.sitekeywords ? company.sitekeywords : ""} placeholder="Ключевые слова сайта"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, sitekeywords: value}))}
            />
          </div>
          <div className="col-6">
            <label htmlFor="user-email">Имя сайта:</label>
            <input type="text" name="user-email" value={company?.sitename ? company.sitename : ""} placeholder="Имя сайта"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, sitename: value}))}
            />
          </div>
        </div>
        <div className="row user-form">
          <div className="col-12">
            <label htmlFor="user-description">Яндекс Карта:</label>
            <textarea name="user-description" value={company?.yandexmap ? company.yandexmap : ""} placeholder="Яндекс Карта"
              onChange={({target: {value}})=>setСompany((prev)=>({...prev, yandexmap: value}))}
            />
          </div>
        </div>
        {!_.isEmpty(errMsg) && <div className="row user-form"><div className="col-12"><span className="label-info">{errMsg}</span></div></div>}
        <div className="row user-form">
        <div className="col-12">
          <button className="button primary icon-save" onClick={doSave}>Сохранить</button>
        </div>
      </div>
      </form>
    </div>
  );
}
