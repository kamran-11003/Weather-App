const apiKey = '510cdad4e9ea464099bb54abe789102e';
let metric = "metric"; 
let unit = "°C";
let city;
document.getElementById("unitToggle").addEventListener("change", function () {
    if (this.checked) {
        metric = "imperial"; 
        unit = "°F";
        document.getElementById("toggleLabel").innerText = "Switch to Metric (°C)";
    } else {
        metric = "metric"; 
        unit = "°C";
        document.getElementById("toggleLabel").innerText = "Switch to Imperial (°F)";
    }
    getWeather();
});
window.onload = function () {
    adjustEntriesPerPageForMobile();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByLocation(lat, lon);
        }, () => {
            alert('Unable to retrieve your location. Please check your browser settings.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
    document.getElementById('cityInput').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            getWeather();
        }
    });
};
function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${metric}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                updateWeatherWidget(data);
                getForecast(data.coord.lat, data.coord.lon);
            } else {
                alert('City not found');
            }
        })
        .catch(error => {
            alert('Error fetching weather data');
            console.error('Error:', error);
        });
}
function fetchWeatherByLocation(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${metric}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                updateWeatherWidget(data);
                city=data.name;
                getForecast(lat, lon);
            } else {
                alert('Error fetching weather data by location.');
            }
        })
        .catch(error => {
            alert('Error fetching weather data');
            console.error('Error:', error);
        });
}
function updateWeatherWidget(data) {
    const cityName = data.name;
    const temperature = data.main.temp;
    const weatherCondition = data.weather[0].description;
    const weatherMain = data.weather[0].main.toLowerCase();
    const iconCode = data.weather[0].icon;
    document.getElementById('cityName').innerText = cityName;
    document.getElementById('temperature').innerText = `Temperature: ${temperature} ${unit}`;
    document.getElementById('weatherCondition').innerText = `Condition: ${weatherCondition}`;
    const weatherIcon = document.getElementById('weatherIcon');
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
    weatherIcon.alt = weatherCondition;
    const weatherWidget = document.getElementById('weatherWidget');
    weatherWidget.className = 'weather-widget';
if (weatherMain.includes('clear')) {
    document.body.classList.add('clear-sky');
    sessionStorage.setItem('background', "clear-sky");
} else if (weatherMain.includes('rain')) {
        document.body.classList.add('rain');
        sessionStorage.setItem('background', "rain");
} else if (weatherMain.includes('thunderstorm')) {
    document.body.classList.add('thunderstorm');
    sessionStorage.setItem('background', "thunderstrom");
} else if (weatherMain.includes('snow')) {
    document.body.classList.add('snow');
    sessionStorage.setItem('background', "snow");
} else if (weatherMain.includes('mist') || weatherMain.includes('fog')) {
    document.body.classList.add('mist');
    sessionStorage.setItem('background', "mist");
}

}
let TodaysData = [];
let currentPage = 1;
let entriesPerPage = 6;
const dataperpage=6;
let Forcast = []; 
document.getElementById('ascendingBtn').addEventListener('click', () => {
    const sortedAscending = [...Forcast].sort((a, b) => a.main.temp - b.main.temp);
    displayNextFiveDaysForecast(sortedAscending);
});

document.getElementById('descendingBtn').addEventListener('click', () => {
    const sortedDescending = [...Forcast].sort((a, b) => b.main.temp - a.main.temp);
    displayNextFiveDaysForecast(sortedDescending);
});

document.getElementById('rainyDaysBtn').addEventListener('click', () => {
    const rainyDays = Forcast.filter(entry => entry.weather[0].description.includes('rain'));
    displayNextFiveDaysForecast(rainyDays);
});

document.getElementById('highestTempBtn').addEventListener('click', () => {
    const highestTempDay = Forcast.reduce((max, entry) => (entry.main.temp > max.main.temp ? entry : max), Forcast[0]);
    displayNextFiveDaysForecast([highestTempDay]);
});

function displayNextFiveDaysForecast(Forcast) {
    const tableBody = document.querySelector('#forecast-Table tbody');
    tableBody.innerHTML = ''; 
    const startIndex = (currentPage - 1) * dataperpage;
    const endIndex = Math.min(startIndex + dataperpage, Forcast.length);

    for (let i = startIndex; i < endIndex; i++) {
        const forecast = Forcast[i];
        const dateTime = new Date(forecast.dt_txt);
        const row = `
            <tr>
                <td>${dateTime.toLocaleDateString()}</td>
                <td>${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>${forecast.main.temp}${unit}</td>
                <td>${forecast.weather[0].description}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    }

    document.getElementById('pageNumber').textContent = currentPage;
    document.getElementById('prevPageBtn').disabled = currentPage === 1;
    document.getElementById('nextPageBtn').disabled = endIndex >= Forcast.length;
}

function changePage(direction) {
    currentPage += direction;
    displayNextFiveDaysForecast(Forcast);
}
function getForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${metric}`)
        .then(response => response.json())
        .then(data => {
            Forcast = data.list;            
            sessionStorage.setItem('forecastData', JSON.stringify(data.list));
            console.log('Forecast Data:', Forcast);
            const today = new Date().toISOString().split('T')[0];
            console.log(today);

            TodaysData = Forcast
                .filter(entry => entry.dt_txt.includes(today))
                .map(entry => ({
                    time: new Date(entry.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    icon: `https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`,
                    temperature: Math.round(entry.main.temp)
                }));
                if(document.getElementById('cityInput').value!="")
                {
                city=document.getElementById('cityInput').value;
                }
                sessionStorage.setItem('weatherData', JSON.stringify({
                    city: city,
                    todaysData: TodaysData,
                    forecast: Forcast
                }));
                
            displayForecast();
            displayNextFiveDaysForecast(Forcast); 
        })
        .catch(error => console.error('Error fetching weather forecast:', error));
}
function displayForecast() {
    const forecastTableBody = document.querySelector('#forecastTable tbody');
    forecastTableBody.innerHTML = '';
    TodaysData.pop();
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const currentEntries = TodaysData.slice(startIndex, endIndex);

    const row = document.createElement('tr');
    const prevButtonCell = document.createElement('td');
    prevButtonCell.innerHTML = `<button class="btn" onclick="previousPage()" ${currentPage === 1 ? 'disabled' : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" 
        height="24px" width="24px" version="1.1" id="Capa_1" viewBox="0 0 55.753 55.753" xml:space="preserve">
            <g>
                <path d="M12.745,23.915c0.283-0.282,0.59-0.52,0.913-0.727L35.266,1.581c2.108-2.107,5.528-2.108,7.637,0.001   
                c2.109,2.108,2.109,5.527,0,7.637L24.294,27.828l18.705,18.706c2.109,2.108,2.109,5.526,0,7.637   
                c-1.055,1.056-2.438,1.582-3.818,1.582s-2.764-0.526-3.818-1.582L13.658,32.464c-0.323-0.207-0.632-0.445-0.913-0.727   
                c-1.078-1.078-1.598-2.498-1.572-3.911C11.147,26.413,11.667,24.994,12.745,23.915z"/>
            </g>
        </svg>
    </button>`;
    row.appendChild(prevButtonCell);
    currentEntries.forEach(entry => {
        const entryCell = document.createElement('td');
        entryCell.innerHTML = `
            <div>${entry.time}</div>
            <div><img src="${entry.icon}" alt="Weather Icon" style="width: 50px; height: 50px;"></div>
            <div>${entry.temperature}${unit}</div>
        `;
        row.appendChild(entryCell);
    });
    for (let i = currentEntries.length; i < entriesPerPage; i++) {
        row.appendChild(document.createElement('td'));
    }
    const nextButtonCell = document.createElement('td');
    nextButtonCell.innerHTML = `<button class="btn" onclick="nextPage()" ${endIndex >= TodaysData.length ? 'disabled' : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" 
        height="24px" width="24px" version="1.1" id="Capa_1" viewBox="0 0 55.752 55.752" xml:space="preserve">
            <g>
                <path d="M43.006,23.916c-0.28-0.282-0.59-0.52-0.912-0.727L20.485,1.581c-2.109-2.107-5.527-2.108-7.637,0.001   
                c-2.109,2.108-2.109,5.527,0,7.637l18.611,18.609L12.754,46.535c-2.11,2.107-2.11,5.527,0,7.637c1.055,1.053,2.436,1.58,3.817,1.58   
                s2.765-0.527,3.817-1.582l21.706-21.703c0.322-0.207,0.631-0.444,0.912-0.727c1.08-1.08,1.598-2.498,1.574-3.912   
                C44.605,26.413,44.086,24.993,43.006,23.916z"/>
            </g>
        </svg>
    </button>`;
    row.appendChild(nextButtonCell);

    forecastTableBody.appendChild(row);
}


function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayForecast();
    }
}
function nextPage() {
    if (currentPage * entriesPerPage < TodaysData.length) {
        currentPage++;
        displayForecast();
    }
}
function updatePagination() {
    const paginationStatus = document.querySelector('#paginationStatus');
    const totalPages = Math.ceil(TodaysData.length / entriesPerPage);
    paginationStatus.textContent = `Page ${currentPage} of ${totalPages}`;
}
function nextPage() {
    if (currentPage * entriesPerPage < TodaysData.length) {
        currentPage++;
        displayForecast();
    }
}
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayForecast();
    }
}
// JavaScript to toggle the side menu on hamburger click
const hamburgerMenu = document.getElementById('hamburgerMenu');
const sideMenu = document.getElementById('sideMenu');

hamburgerMenu.addEventListener('click', () => {
    sideMenu.classList.toggle('active');
});
function adjustEntriesPerPageForMobile() {
    if (window.innerWidth <= 768) { // Typical breakpoint for mobile devices
        entriesPerPage = 1; // Set entries per page to 1 for mobile
    } else {
        entriesPerPage = 6; // Default value for larger screens
    }
}
window.addEventListener('resize', adjustEntriesPerPageForMobile);