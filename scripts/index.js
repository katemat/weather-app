const API_KEY = 'DEMO_KEY';
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

const previousWeatherToggle = document.querySelector('.show-previous-weather');

const previousWeather = document.querySelector('.previous-weather');
previousWeatherToggle.addEventListener('click', () => {
  previousWeather.classList.toggle('show-weather');
});
const currentSol = document.querySelector('[data-current-sol]');
const currentDate = document.querySelector('[data-current-date]');
const currentTempHigh = document.querySelector('[data-current-temp-high]');
const currentTempLow = document.querySelector('[data-current-temp-low]');
const windSpeed = document.querySelector('[data-wind-speed]');
const windDirectionText = document.querySelector('[data-wind-direction-text]');
const windDirectionArrow = document.querySelector(
  '[data-wind-direction-arrow]'
);
let selectedSolIdx;

getWeather().then((sols) => {
  selectedSolIdx = sols.length - 1;
  displaySelectedSol(sols);
});

function displaySelectedSol(sols) {
  const selectedSol = sols[selectedSolIdx];
  currentSol.innerHTML = selectedSol.sol;
  currentDate.innerHTML = displayDate(selectedSol.date);
  currentTempHigh.innerHTML = selectedSol.maxTemp;
  currentTempLow.innerHTML = selectedSol.minTemp;
  windSpeed.innerHTML = selectedSol.windSpeed;
  windDirectionArrow.style.setProperty(
    '--direction',
    `${selectedSol.windDirectionDegrees}deg`
  );
  windDirectionText.innerHTML = selectedSol.windDirectionCardinal;
}

function displayDate(date) {
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long' });
}

function getWeather() {
  return fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      const { sol_keys, validity_checks, ...solData } = data;
      return Object.entries(solData).map(([sol, data]) => {
        return {
          sol: sol,
          maxTemp: data.AT.mx,
          minTemp: data.AT.mn,
          windSpeed: data.HWS.av,
          windDirectionDegrees: data.WD.most_common.compass_degrees,
          windDirectionCardinal: data.WD.most_common.compass_point,
          date: new Date(data.First_UTC),
        };
      });
    });
}
