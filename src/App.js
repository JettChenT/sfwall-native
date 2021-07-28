import logo from './logo.svg';
import './App.css';
import Cookies from 'universal-cookie';
import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron')

function App() {
  let [token, setToken] = useState(ipcRenderer.sendSync('get-token'));
  const wid = window.screen.width * window.devicePixelRatio;
  const hei = window.screen.height * window.devicePixelRatio;
  return (
    <div>
      {
        !token &&
        <h1>Your Token could be found in your profile at <a href="https://scan4wall.xyz">our webapp</a></h1>
      }
      <input 
        className="input" 
        type="text" 
        placeholder="Set SFW Token"
        value={token}
        onChange={e => setToken(e.target.value)}
      />
      <button onClick={() => ipcRenderer.send('set-token',token)}>Save Token</button>
      {
        token &&
        <button onClick={() => ipcRenderer.send('recommend',wid,hei)}>RECOMMEND!</button>
      }
    </div>
  );
}

export default App;
