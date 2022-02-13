import React, { useState, useEffect, useMemo, useCallback } from "react";
import _ from "lodash";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getQuery, putQuery, deleteQuery } from "../../api/service";
import useLocalStorage from '../../helpers/useLocalStorage';

const Prices = () => {
  const navigate = useNavigate();
  const [user, setUser, deleteUser] = useLocalStorage('user', {
    id: '',
    login: '',
    email: '',
    token: ''
  });
  const [prices, setPrices] = useState([]);
  const [newPrices, setNewPrices] = useState({
    code: "",
    name: "",
    price: "",
    typeid: ""
  });
  const [newType, setNewType] = useState("");
  const [priceTypes, setPriceTypes] = useState([]);

  const getPrices = () => {
    getQuery("/prices/read", user.token).then((data:any)=>{
      if (!_.isUndefined(data)) {
        setPrices(data);
      }
    }).catch((errMsg)=>{
      console.error("errMsg", errMsg);
    });
  }
  const getPriceTypes = () => {
    getQuery("/priceTypes/read", user.token).then((data:any)=>{
      if (!_.isUndefined(data)) {
        setPriceTypes(data);
      }
    }).catch((errMsg)=>{
      console.error("errMsg", errMsg);
    });
  }

  useEffect(() => {
    getPrices();
    getPriceTypes();
  }, []);

  const addPrice = useCallback(() => {
    putQuery("/prices/create", user.token, newPrices).then(()=>{
      getPrices();
    }).catch((errMsg)=>{
      console.error("errMsg", errMsg);
    });
  }, [newPrices]);

  const addPriceType = useCallback(() => {
    putQuery("/priceTypes/create", user.token, {
      name: newType
    }).then(()=>{
      getPrices();
      getPriceTypes();
    }).catch((errMsg)=>{
      console.error("errMsg", errMsg);
    });
  }, [newType]);
  
  const removePrice = useCallback((id) => {
    deleteQuery("/prices/delete", user.token, {id: id}).then(()=>{
      getPrices();
    }).catch((errMsg)=>{
      console.error("errMsg", errMsg);
    });
  }, [prices]);

  const removePriceType = useCallback((id) => {
    deleteQuery("/priceTypes/delete", user.token, {id: id}).then(()=>{
      getPrices();
      getPriceTypes();
    }).catch((errMsg)=>{
      console.error("errMsg", errMsg);
    });
  }, [priceTypes]);

  const getPricesTable = useMemo(() => {
    if (_.isEmpty(prices)) {
      return null;
    }
    return (
      <tbody>
        {prices.map((rowItem) => (<tr key={rowItem.id} ><td>{rowItem.typename}</td><td>{rowItem.code}</td><td title={rowItem.name}>{rowItem.name}</td><td>{rowItem.price}</td>
        <td>
        <button name="user-create" className={`button primary icon-delete`} onClick={()=>removePrice(rowItem.id)} title="Создать"></button>
        </td></tr>))}
      </tbody>
    );
  }, [prices]);

  const getPricesTypeTable = useMemo(() => {
    if (_.isEmpty(priceTypes)) {
      return null;
    }
    return (
      <tbody>
        {priceTypes.map((rowItem) => (<tr key={rowItem.id}><td>{rowItem.name}</td><td>
        <button name="user-create" className={`button primary icon-delete`} onClick={()=>removePriceType(rowItem.id)} title="Создать"></button>
        </td></tr>))}
      </tbody>
    );
  }, [priceTypes]);

  return (
    <div id="prices">
      <div className="row user-form"></div>
      <div className="row user-form">
        <div className="table-wrapper">
          <table className="alt">
            <thead>
              <tr><th>Группа</th><th>Код услуги</th><th>Наименование услуги</th><th>Цена услуги</th><th>Удалить</th></tr>
            </thead>
            {getPricesTable}
            <tfoot>
              <tr>
                <td>
                  <select name="user-price-typeid" onChange={({target: {value}})=>setNewPrices((prev)=>({...prev, typeid: value}))}>
                    {_.map(priceTypes, (i)=>(<option key={i.id} value={i.id}>{i.name}</option>))}
                  </select>
                </td>
                <td>
                  <input type="text" name="user-price-code" value={newPrices?.code ? newPrices.code : ""} placeholder="Код услуги"
                    onChange={({target: {value}})=>setNewPrices((prev)=>({...prev, code: value}))}/>
                </td>
                <td>
                  <input type="text" name="user-price-name" value={newPrices?.name ? newPrices.name : ""} placeholder="Наименование услуги"
                    onChange={({target: {value}})=>setNewPrices((prev)=>({...prev, name: value}))}/>
                </td>
                <td>
                  <input type="text" name="user-price-price" value={newPrices?.price ? newPrices.price : ""} placeholder="Цена услуги"
                    onChange={({target: {value}})=>setNewPrices((prev)=>({...prev, price: value}))}/>
                </td>
                <td>
                  <button name="user-create" className={`button primary icon-add`} onClick={()=>addPrice()} title="Создать"></button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div className="row user-form">
        <div className="table-wrapper">
          <table className="alt">
            <thead>
              <tr><th>Группы</th></tr>
            </thead>
            {getPricesTypeTable}
            <tfoot>
              <tr>
                <td>
                  <input type="text" name="user-price-type-code" value={newType ? newType : ""} placeholder="Наименование группы"
                    onChange={({target: {value}})=>setNewType(value)}/>
                </td>
                <td>
                <button name="user-create" className={`button primary icon-add`} onClick={()=>addPriceType()} title="Создать"></button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Prices;
