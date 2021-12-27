import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import { StoreProvider } from './contexts/store';
import App from "./routes/app";
import Main from "./routes/main";
import Login from "./routes/login";
import User from "./routes/user";
import Users from "./routes/users";
import PageNotFound from "./routes/pageNotFound";

const rootNode = document.getElementById("root");

render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<App />}>
            <Route index element={<Main />}/>
            <Route path="/users" element={<Users />} />
            <Route path="users/:userId" element={<User />} />
            <Route path="*" element={<PageNotFound/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>,
  rootNode
);
