import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import {
  HashRouter,
  Routes,
  Route
} from 'react-router-dom';

import App from "./routes/app";
import Main from "./routes/main";
import User from "./routes/user";
import Users from "./routes/users";
import Page from "./routes/page";
import Prices from "./routes/prices";
import Organization from "./routes/organization";
import PageNotFound from "./routes/pageNotFound";
import "./assets/scss/main.scss";

const rootNode = document.getElementById("root");

render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Main />}/>
          <Route path="/page" element={<Page />} />
          <Route path="/users" element={<Users />} />
          <Route path="/user" element={<User />} />
          <Route path="/organization" element={<Organization />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="*" element={<PageNotFound/>} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
  rootNode
);
