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

previousSolTemplate = document.querySelector('[data-previous-sol-template]');
previousSolContainer = document.querySelector('[data-previous-sols]');

const unitToggle = document.querySelector('[data-unit-toggle]');
const metricRadio = document.getElementById('cel');
const imperialRadio = document.getElementById('fah');

let selectedSolIdx;

getWeather().then((sols) => {
  selectedSolIdx = sols.length - 1;
  displaySelectedSol(sols);
  displayPreviousSol(sols);
  convertUnits();

  unitToggle.addEventListener('click', () => {
    let metricUnits = !isMetric();
    metricRadio.checked = metricUnits;
    imperialRadio.checked = !metricUnits;
    displaySelectedSol(sols);
    displayPreviousSol(sols);
    convertUnits();
  });

  metricRadio.addEventListener('change', () => {
    displaySelectedSol(sols);
    displayPreviousSol(sols);
    convertUnits();
  });

  imperialRadio.addEventListener('change', () => {
    convertUnits();
    displaySelectedSol(sols);
    displayPreviousSol(sols);
  });
});

function displaySelectedSol(sols) {
  const selectedSol = sols[selectedSolIdx];
  currentSol.innerHTML = selectedSol.sol;
  currentDate.innerHTML = displayDate(selectedSol.date);
  currentTempHigh.innerHTML = displayTemp(selectedSol.maxTemp);
  currentTempLow.innerHTML = displayTemp(selectedSol.minTemp);
  windSpeed.innerHTML = displayWindSpeed(selectedSol.windSpeed);
  windDirectionArrow.style.setProperty(
    '--direction',
    `${selectedSol.windDirectionDegrees}deg`
  );
  windDirectionText.innerHTML = selectedSol.windDirectionCardinal;
}

function displayPreviousSol(sols) {
  previousSolContainer.innerHTML = '';
  sols.forEach((solData, index) => {
    const solContainer = previousSolTemplate.content.cloneNode(true);
    solContainer.querySelector('[data-sol]').innerText = solData.sol;
    solContainer.querySelector('[data-date]').innerText = displayDate(
      solData.date
    );
    solContainer.querySelector('[data-temp-high]').innerText = displayTemp(
      solData.maxTemp
    );
    solContainer.querySelector('[data-temp-low]').innerText = displayTemp(
      solData.minTemp
    );
    solContainer
      .querySelector('[data-select-button]')
      .addEventListener('click', () => {
        selectedSolIdx = index;
        displaySelectedSol(sols);
      });

    previousSolContainer.appendChild(solContainer);
  });
}

function displayDate(date) {
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    weekday: 'short',
  });
}

function displayTemp(temp) {
  let returnTemp = temp;
  if (!isMetric()) {
    returnTemp = temp * (9 / 5) + 32;
  }
  return returnTemp.toFixed(0);
}

function displayWindSpeed(speed) {
  let returnSpeed = speed;
  if (!isMetric()) {
    returnSpeed = speed / 1.609;
  }
  return returnSpeed.toFixed(1);
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

function convertUnits() {
  const speedUnits = document.querySelectorAll('[data-speed-unit]');
  const tempUnits = document.querySelectorAll('[data-temp-unit]');
  speedUnits.forEach((unit) => {
    unit.innerText = isMetric() ? 'meters/s' : 'miles/s';
  });
  tempUnits.forEach((unit) => {
    unit.innerText = isMetric() ? 'C' : 'F';
  });
}

function isMetric() {
  return metricRadio.checked;
}
