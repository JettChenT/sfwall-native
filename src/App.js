import './App.css';
import Cookies from 'universal-cookie';
import React, { useEffect, useState } from 'react';
import FunBtn from './components/funbtn';
import {
  BrowserRouter as Router,
  HashRouter,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import HomePage from './pages/home';
import SettingPage from './pages/settings';
const { ipcRenderer } = window.require('electron');

function App() {
  let [token, setToken] = useState(ipcRenderer.sendSync('get-token'));
  ipcRenderer.on('update-token', (event, token) => {
    setToken(token);
  });
  return (
    <div className="w-screen h-screen">
      <HashRouter>
      <Switch>
        <Route path="/" exact>
          {
            (token==="")?<Redirect to="/settings"/>:<HomePage/>
          }
        </Route>
        <Route path="/settings" exact component={SettingPage}/>
      </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
