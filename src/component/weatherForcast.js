import React, { useEffect, useState } from "react";
import { Collapse } from "antd";
import { getWeather } from "../API/api-services";
import DropDown from "./share/dropdown";
const { Panel } = Collapse;
function callback(key) {
  console.log(key);
}

const CurrentWeatherForcst = () => {
  const [curentItem, setCurentItem] = useState(["current"]);
  const [dailyItem, setDailyItem] = useState([]);
  const [header, setHeader] = useState("current");
  const [location, setLocation] = useState("");
  const [cloudes, setCloudes] = useState("");
  const [temp, setTemp] = useState("");
  const [windSpeed, setwindSpeed] = useState("");
  const [sunset, setSunset] = useState("");
  const [sunrise, setSunrise] = useState("");
  // const [dailyData, setDailyDate] = useState("");

  const [currWeatherData, setcurrWeatherData] = useState("");
  const [dailyWeatherData, setcurrdailyWeatherData] = useState("");

  const callbackForMenu = (data) => {
   if(data.key === "weekly") {
      setHeader(data.key);
    }else if(data.key === "current") {
      console.log("currWeatherData",currWeatherData)
        setHeader(data.key);
        let event1 = new Date(currWeatherData.sunrise);
        let event2 = new Date(currWeatherData.sunset);
        setTemp(Math.round(currWeatherData.temp));
        setCloudes(currWeatherData.clouds);
        setwindSpeed(currWeatherData.wind_speed);
        setSunrise(event1.toLocaleTimeString("en-US"));
        setSunset(event2.toLocaleTimeString("en-US"));
    }else{
        setHeader("Daily");
        let relatedNoOfDay = getArrayIndexForDay(data.key);
        let event1 = new Date(dailyWeatherData[relatedNoOfDay].sunrise);
        let event2 = new Date(dailyWeatherData[relatedNoOfDay].sunset);
        setTemp(Math.round(dailyWeatherData[relatedNoOfDay].temp.max));
        setCloudes(dailyWeatherData[relatedNoOfDay].clouds);
        setwindSpeed(dailyWeatherData[relatedNoOfDay].wind_speed);
        setSunrise(event1.toLocaleTimeString("en-US"));
        setSunset(event2.toLocaleTimeString("en-US"));
    }
  };

  const GetDaYForDalilyData = (n, d) => {
    let day;
    switch (n) {
      case 0:
        day = "Sunday" + " " + String(d.getDate()).padStart(2, "0");
        return day;
      case 1:
        day = "Monday" + " " + String(d.getDate()).padStart(2, "0");
        return day;
      case 2:
        day = "Tuesday" + " " + String(d.getDate()).padStart(2, "0");
        return day;
      case 3:
        day = "Wednesday" + " " + String(d.getDate()).padStart(2, "0");
        return day;
      case 4:
        day = "Thursday" + " " + String(d.getDate()).padStart(2, "0");
        return day;
      case 5:
        day = "Friday" + " " + String(d.getDate()).padStart(2, "0");
        return day;
      case 6:
        day = "Saturday" + " " + String(d.getDate()).padStart(2, "0");
        return day;
    }
  };

  const getArrayIndexForDay = (data) => {
    if (data.includes("Sunday")) {
      return 0;
    } else if (data.includes("Monday")) {
      return 1;
    } else if (data.includes("Tuesday")) {
      return 2;
    } else if (data.includes("Wednesday")) {
      return 3;
    } else if (data.includes("Thursday")) {
      return 4;
    } else if (data.includes("Friday")) {
      return 5;
    } else if (data.includes("Saturday")) {
      return 6;
    }
  };

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    let ItemArray = [];
    let queryParams = {};
    queryParams.lat = latitude;
    queryParams.lon = longitude;
    let d;
    let n;
    let day;
    let event1;
    let event2;
    getWeather(queryParams)
      .then((response) => {
        setLocation(response.data.timezone);
        response.data.daily.forEach((result, i) => {
          d = new Date(result.dt * 1000);
          n = d.getDay();
          day = GetDaYForDalilyData(n, d);
          if (i !== 7) {
            ItemArray.push(day);
          }
        });

        if (header === "current") {
          event1 = new Date(response.data.current.sunrise);
          event2 = new Date(response.data.current.sunset);

          setDailyItem(ItemArray);
          setTemp(Math.round(response.data.current.temp));
          setCloudes(response.data.current.clouds);
          setwindSpeed(response.data.current.wind_speed);
          setSunrise(event1.toLocaleTimeString("en-US"));
          setSunset(event2.toLocaleTimeString("en-US"));
          setcurrWeatherData(response.data.current)
        }
        setcurrdailyWeatherData(response.data.daily);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const error = () => {
    alert("Unable to retrieve your location");
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  return (
    <>
      <DropDown
        key="current"
        DropDownText="Current"
        Item={curentItem}
        callbackForMenu={(data) => {
          callbackForMenu(data);
        }}
      />
      <DropDown
        key="daily"
        DropDownText="Daily"
        Item={dailyItem}
        callbackForMenu={(data) => {
          callbackForMenu(data);
        }}
      />
      <DropDown
        key="weekly"
        DropDownText="Weekly"
        Item={["weekly"]}
        callbackForMenu={(data) => {
          callbackForMenu(data);
        }}
      />
      <h3>{location}</h3>

      <Collapse onChange={callback}>
        {header === "current" ? (
          <Panel
            header={header[0].toUpperCase() + header.slice(1).toLowerCase()}
            key="2"
          >
            <p>
              {"temp" +
                " " +
                temp +
                "C" +
                "  " +
                "Cloude" +
                " " +
                cloudes +
                "  " +
                "Sunrise" +
                " " +
                sunrise +
                "  " +
                "Sunset" +
                "  " +
                sunset +
                "  " +
                "wind Speed" +
                "  " +
                windSpeed}
            </p>
          </Panel>
        ) : header === "weekly" ? (
          dailyWeatherData.map((result) => {
            return (
              <Panel
                header = {GetDaYForDalilyData(new Date(result.dt * 1000), new Date(result.dt * 1000).getDay())} 
                header={header[0].toUpperCase() + header.slice(1).toLowerCase()}
                key={result.temp.max}
              >
                <p>
                  {"temp" +
                    " " +
                    result.temp.max +
                    "C" +
                    "  " +
                    "Cloude" +
                    " " +
                    result.clouds +
                    "  " +
                    "Sunrise" +
                    " "
                     +
                    
                    new Date(result.sunrise).toLocaleTimeString("en-US")
                    +
                    "  " +
                    "Sunset" +
                    "  " +
                    new Date(result.sunset).toLocaleTimeString("en-US")
                    +
                    "  " +
                    "wind Speed" +
                    "  " +
                    result.wind_speed}
                </p>
              </Panel>
            );
          })
        ) : (
          <Panel
            header={header[0].toUpperCase() + header.slice(1).toLowerCase()}
            key="2"
          >
            <p>
              {"temp" +
                " " +
                temp +
                "C" +
                "  " +
                "Cloude" +
                " " +
                cloudes +
                "  " +
                "Sunrise" +
                " " +
                sunrise +
                "  " +
                "Sunset" +
                "  " +
                sunset +
                "  " +
                "wind Speed" +
                "  " +
                windSpeed}
            </p>
          </Panel>
        )}
      </Collapse>
    </>
  );
};
export default CurrentWeatherForcst;
