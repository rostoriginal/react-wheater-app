import React, { useState } from "react";
import Weather from "./types/Weather";
import "./App.css";
import WarningAlert from "./components/WarningAlert";

const API_KEY = process.env.REACT_APP_API_KEY || "";
const API_BASE = "https://api.openweathermap.org/data/2.5/weather";
const API_URL = new URL(API_BASE);

API_URL.searchParams.append("appid", API_KEY);
API_URL.searchParams.append("units", "metric");

function App() {
  const [location, setLocation] = useState("");
  const [warning, setWarning] = useState("");
  const [weather, setWeather] = useState<Weather>();

  function handleLocationChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLocation(e.target.value);
  }

  function fetchWeather(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === "Enter") {
      API_URL.searchParams.set("q", location);

      fetch(API_URL)
        .then((res) => res.json())
        .then((result) => {
          setLocation("");

          if (Number(result?.cod) === 404) {
            setWeather(undefined);
            setWarning(result.message);
            return;
          }

          setWeather({
            name: result.name,
            country: result.sys.country,
            type: result.weather[0].main,
            temp: Math.ceil(result.main.temp),
          });
          setWarning("");
        });
    }
  }

  return (
    <>
      <div className="flex items-center justify-center w-full h-[100vh] relative app-container">
        <div className="content relative z-10 min-w-[360px] w-[720px]">
          {weather?.country && (
            <p className="text-white text-center text-3xl mb-2">
              {weather.name}, {weather.country}
            </p>
          )}
          <p className="text-center text-white mb-8 text-2xl">
            {new Intl.DateTimeFormat("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date().getTime())}
          </p>
          <input
            type="text"
            placeholder="Search location"
            className="input input-bordered w-full bg-white"
            value={location}
            onChange={(e) => handleLocationChange(e)}
            onKeyDown={(e) => fetchWeather(e)}
          />

          {warning && <WarningAlert msg={warning} />}

          {weather?.temp && (
            <>
              <div className="card w-80 mx-auto min-h-[150px] mt-8 glass flex items-center justify-center">
                <h1 className="text-center text-white weather-degree">
                  {weather.temp}°c
                </h1>
              </div>
              <p className="text-white text-center text-5xl mt-4">
                {weather.type}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
