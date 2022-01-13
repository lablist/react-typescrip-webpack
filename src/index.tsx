import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import {
  HashRouter,
  Routes,
  Route
} from 'react-router-dom';

import { StoreProvider } from './contexts/store';
import { ToastProvider } from './contexts/toast';
import App from "./routes/app";
import Main from "./routes/main";
import User from "./routes/user";
import Users from "./routes/users";
import PageNotFound from "./routes/pageNotFound";
import "./assets/scss/main.scss";

const rootNode = document.getElementById("root");

render(
  <StrictMode>
    <StoreProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Main />}/>
              <Route path="/users" element={<Users />} />
              <Route path="/user" element={<User />} />
              <Route path="*" element={<PageNotFound/>} />
            </Route>
          </Routes>
        </HashRouter>
        </ToastProvider>
    </StoreProvider>
  </StrictMode>,
  rootNode
);
