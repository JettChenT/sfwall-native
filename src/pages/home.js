import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import { Blurhash } from "react-blurhash";
import { Link } from "react-router-dom";
const { ipcRenderer } = window.require("electron");

const HomePage = () => {
  let [token, setToken] = useState(ipcRenderer.sendSync("get-token"));
  let [status, setStatus] = useState("Get recommendation");
  let [loading, setLoading] = useState(false);
  let [wpath, setWpath] = useState(ipcRenderer.sendSync("get-wpath"));
  let [blurhash, setBlurhash] = useState("L#LNrwR*NGWB~XWBWBj[IUayj[j[");
  const wid = window.screen.width * window.devicePixelRatio;
  const hei = window.screen.height * window.devicePixelRatio;
  let [initialized, setInitialized] = useState(
    ipcRenderer.sendSync("set-dimensions", wid, hei)
  );
  useEffect(() => {
    ipcRenderer.on("status", (event, msg) => {
      setStatus(msg);
    });
    ipcRenderer.on("wpath", (event, msg) => {
      console.log("SET WPATH!");
      setWpath(msg);
      setLoading(false);
    });
    ipcRenderer.on("setbhash", (event, msg) => {
      setBlurhash(msg);
    });
    return () => {
      ipcRenderer.removeAllListeners();
    };
  });

  const handleRecommendClick = () => {
    setLoading(true);
    ipcRenderer.send("recommend");
    setStatus("Loading...");
  };

  return (
    <div>
      <div className="h-10 w-screen p-2">
        <span className="font-semibold text-black text-md">
          Scan For Wallpapers
        </span>
        <Link to="/settings">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 inline absolute right-0 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Link>
      </div>
      <div className="w-screen bg-white">
        {loading && (
          <Blurhash
            hash={blurhash}
            width={window.innerWidth}
            resolutionX={128}
            resolutionY={128}
            height={(window.innerWidth * hei) / wid}
          />
        )}
        <Loader
          visible={loading}
          type="Oval"
          color="gray"
          className="absolute left-1/2 top-1/2 -ml-10 -mt-20"
        />
        <img
          src={`file://${wpath}`}
          className={`w-full h-full ${loading && "hidden"}`}
          alt="wallpaper"
        ></img>
      </div>
      <div className="h-10 w-screen p-3">
        <a
          href="#"
          onClick={handleRecommendClick}
          class={`w-full opacity-90 ${
            loading && "opacity-60"
          } relative z-30 inline-flex items-center justify-center w-auto px-8 py-3 overflow-hidden font-bold text-gray-500 transition-all duration-500 border border-gray-200 rounded-md cursor-pointer group ease bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-white active:to-white`}
        >
          <span class="w-full h-0.5 absolute bottom-0 group-active:bg-transparent left-0 bg-gray-100"></span>
          <span class="h-full w-0.5 absolute bottom-0 group-active:bg-transparent right-0 bg-gray-100"></span>
          Next
        </a>
      </div>
    </div>
  );
};

export default HomePage;
