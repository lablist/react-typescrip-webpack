import React, { useState, useEffect, useMemo } from "react";
import _ from "lodash";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { postQuery } from "../../api/service";
import useLocalStorage from '../../helpers/useLocalStorage';
import rights from "../../helpers/rights";

export default function Users() {
  const navigate = useNavigate();
  const [user, setUser, deleteUser] = useLocalStorage('user', {
    id: '',
    login: '',
    email: '',
    token: ''
  });
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const getUsers = () => {
      postQuery("/users/filters", user.token, {limit, page}).then((data:any)=>{
        if (!_.isUndefined(data)) {
          setUsers(data);
        }
      }).catch((errMsg)=>{
        console.error("errMsg", errMsg);
      });
    }
    getUsers();
  }, [page, limit]);

  const maxRows = useMemo(() => {
    return _.get(_.first(users), "allrows", 0)
  }, [users]);

  const calcRows = useMemo(() => {
    if (page<=1) {
      return 0
    }
    return (page * limit) - limit
  }, [page, limit]);

  return (
    <div id="users">
      <div className="row user-form"></div>
      <div className="row user-form">
        <div className="col-2 col-12-small">
          <label htmlFor="user-create">Создать пользователя:</label>
          <button name="user-create" className={`button primary icon-add`} onClick={()=>navigate(`/user`)} title="Создать">Создать</button>
        </div>
        <div className="col-2 col-12-small">
          <label htmlFor="user-limit">Показать по:</label>
          <select name="user-limit" onChange={(event)=>{
            setPage(1);
            setLimit(parseInt(event?.target?.value, 10));
            }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={maxRows}>{maxRows}</option>
          </select>
        </div>
        <div className="col-2 col-12-small">
          <label htmlFor="user-page" >Страница:</label>
          <select name="user-page" onChange={(event)=>setPage(parseInt(event?.target?.value, 10))}>
            {_.map(_.range(0, Math.ceil(maxRows / limit)), (i)=>(<option key={i} value={i+1}>{i+1}</option>))}
          </select>
        </div>
      </div>
      <div className="row user-form">
      <table className="alt">
        <thead>
          <tr>
            <th>№</th>
            <th>Логин</th>
            <th>Полное имя</th>
            <th>Адрес электронной почты</th>
            <th>Роль</th>
          </tr>
        </thead>
        <tbody>
          {_.map(users, (uData, uDataIndex)=>(<tr key={uData.id}>
              <td>{uDataIndex+1 + calcRows}</td>
              <td>
                <NavLink to={`/user?userId=${uData.id}`} key={uData.id}>
                  {uData.login}
                </NavLink>
              </td>
              <td>{uData.fio}</td>
              <td>{uData.email}</td>
              <td>{_.map(uData.rights, (r)=>(`${rights[r]} `))}</td>
            </tr>))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} >{`Доступно строк: ${maxRows} `}</td>
          </tr>
        </tfoot>
      </table>
      </div>
      <Outlet />
    </div>
  );
}
