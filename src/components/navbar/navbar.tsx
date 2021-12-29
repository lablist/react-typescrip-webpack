import React, {useRef, useEffect, useState} from 'react';
import { NavLink, useNavigate, createSearchParams } from 'react-router-dom';
import useLocalStorage from '../../helpers/useLocalStorage';
import _ from 'lodash';
import navs from "./navs";
import { useModalToggle } from '../../helpers/useToggle';
import './navbar.scss';

const Navbar: React.FC = () => {
  const [user, setUser, deleteUser] = useLocalStorage('user', {
    id: '',
    login: '',
    email: '',
    token: ''
  });
  const navigate = useNavigate();

  const sideRef = useRef(null);
  const [isOpen, setOpen] = useModalToggle(false, sideRef, ()=>{});
  const [animationClass, setAnimationClass] = useState('');

  const goHome = (e) => {
    e.stopPropagation();
    navigate("/");
  }

  const openMenu = (e) => {
    e.stopPropagation();
    setOpen((prev)=>!prev);
  }

  const linkClick = (e) => {
    setOpen(false);
  }

  const logout = () => {
    setOpen(false); 
    deleteUser();
    navigate(0);
  };

  useEffect(() => {
    setAnimationClass((prev)=>{
      if (isOpen && prev === "go-slide-in") {
        return ""
      }
      if (!isOpen && prev === "") {
        return ""
      }
      return isOpen ? "go-slide-in": "go-slide-out";
    })
  }, [isOpen]);

  const getNavLinkClassNames = ({ isActive })=> {
    return `sidebar-item ${isActive ? 'active': ''}`
  };

  return (<>
    <header className="navbar-component">
      <nav>
        <div className="app-content">
          <span className="icon-menu navbar-menu" onClick={openMenu}></span>
          <span className="icon-logo navbar-logo" onClick={goHome}>
            <span className="path1"></span>
            <span className="path2"></span>
          </span>
          <span className="icon-logout navbar-logout" onClick={logout}></span>
        </div>
      </nav>
    </header>
    <menu className={`${animationClass}`} ref={sideRef}>
      <div className="sidebar-menu">
        {navs.map((navItem, index)=>{
          return <NavLink className={getNavLinkClassNames}
        key={_.uniqueId(index)} to={`${navItem?.link}`} onClick={linkClick}>
              <div className="sidebar-item-icon">
                <span className={`${navItem?.icon}`}></span>
              </div>
              <div className='sidebar-item-text'>
                {navItem?.caption}
              </div>
            </NavLink>
        })}
      </div>
    </menu>
  </>);
};

export default Navbar;
