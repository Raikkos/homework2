import "babel-polyfill";
import Chart from "chart.js";


const meteoURL = "/xml.meteoservice.ru/export/gismeteo/point/140.xml";

async function loadWeather() {
  const response = await fetch(meteoURL);
  const xmlTest = await response.text();
  const parser = new DOMParser();
  const weatherData = parser.parseFromString(xmlTest, "text/xml");
  const forecasts = weatherData.querySelectorAll("FORECAST");
  const result = Object.create(null);
  for (let i = 0; i < forecasts.length; i++) {
    result[i] = Object.create(null);
    const hour = forecasts[i].getAttribute("hour");
    const temperature = (parseInt(forecasts[i].children[2].getAttribute("max")) + parseInt(forecasts[i].children[2].getAttribute("min")))/2;
    const heat = forecasts[i].children[5].getAttribute("min");
    result[i].hour = hour;
    result[i].temperature = temperature;
    result[i].heat = heat;
  }
  return result;
}

const buttonBuild = document.getElementById("btn");
const canvasCtx = document.getElementById("out").getContext("2d");
buttonBuild.addEventListener("click", async function() {
  const normalData = await loadWeather();
  const keys = Object.keys(normalData);
  const plotDataHour = keys.map(key => normalData[key].hour + ":00");
  const plotDataTemperature = keys.map(key => normalData[key].temperature);
  const plotDataHeat = keys.map(key => normalData[key].heat);

  const chartConfig = {
    type: "line",
    data: {
      labels: plotDataHour,
      datasets: [
        {
          label: "Ощущаемая температура",
          backgroundColor: "rgb(53, 228, 226)",
          borderColor: "rgb(5, 7, 77)",
          data: plotDataHeat
        },
        {
          label: "Температура",
          backgroundColor: "rgb(240, 211, 0)",
          borderColor: "rgbrgb(0, 0, 0)",
          data: plotDataTemperature
        }
      ]
    }
  };

  if (window.chart) {
    chart.data.labels = chartConfig.data.labels;
    chart.data.datasets[0].data = chartConfig.data.datasets[0].data;
    chart.options = chartConfig.options;
    chart.update({
      duration: 800,
      easing: "easeOutBounce"
    });
  } else {
    window.chart = new Chart(canvasCtx, chartConfig);
  }
});