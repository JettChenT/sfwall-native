import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
const { ipcRenderer } = window.require("electron");

const SettingPage = () => {
  let [token, setToken] = useState(ipcRenderer.sendSync("get-token"));
  return (
    <div className="w-screen h-screen overflow-hidden">
      <span className="block font-bold text-3xl mx-4 mt-5">Settings</span>
      <label className="block mt-3 mx-6 space-y-4">
        <span className="font-bold text-xl">Token</span>
        <br />
        <span className="text-gray-700 font-semibold text-sm">
          You token can be found at Scan For Wallpaper's webapp.
        </span>
        <input
          type="password"
          className="form-input px-4 py-3 block w-5/6 rounded-lg"
          placeholder="enter your token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <a
          href="#_"
          class="inline-flex items-center px-6 py-3 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-600"
          onClick={() => ipcRenderer.send("set-token", token)}
        >
          Save token
        </a>
      </label>
      <Link
        to="/"
        class="absolute m-3 bottom-0 left-0 z-30 inline-flex items-center justify-center w-auto px-8 py-3 overflow-hidden font-bold text-gray-500 transition-all duration-500 border border-gray-200 rounded-md cursor-pointer group ease bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-white active:to-white"
      >
        <span class="w-full h-0.5 absolute bottom-0 group-active:bg-transparent left-0 bg-gray-100"></span>
        <span class=" h-full w-0.5 absolute bottom-0 group-active:bg-transparent right-0 bg-gray-100"></span>
        Done
      </Link>
    </div>
  );
};

export default SettingPage;
