const apiKey = '510cdad4e9ea464099bb54abe789102e';
let barChart, doughnutChart, lineChart; 
window.onload = function() {
    let backgroundColor=sessionStorage.getItem('background');
document.body.classList.add(backgroundColor);
    console.log(backgroundColor);
    getForecast(); 
};

function clearCanvases() {
    const barCtx = document.getElementById('barChart').getContext('2d');
    const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
    const lineCtx = document.getElementById('lineChart').getContext('2d');

    barCtx.clearRect(0, 0, barCtx.canvas.width, barCtx.canvas.height);
    doughnutCtx.clearRect(0, 0, doughnutCtx.canvas.width, doughnutCtx.canvas.height);
    lineCtx.clearRect(0, 0, lineCtx.canvas.width, lineCtx.canvas.height);
}
function getForecast() {
    const data = sessionStorage.getItem('forecastData');
    
    if (!data) {
        console.error("No forecast data found in sessionStorage.");
        return;
    }

    let parsedData;
    try {
        parsedData = JSON.parse(data); 
        console.log(parsedData);
    } catch (error) {
        console.error("Error parsing JSON data:", error);
        return;
    }

    if (!parsedData || !Array.isArray(parsedData)) {
        console.error("Parsed data does not contain a valid 'list' array.");
        return;
    }

    const temperatures = [];
    const weatherConditions = {};
    const dates = [];
    
    parsedData.forEach((entry, index) => {
        if (index % 8 === 0) {
            temperatures.push(entry.main.temp);
            dates.push(new Date(entry.dt_txt).toLocaleDateString());
            const condition = entry.weather[0].main;
            weatherConditions[condition] = (weatherConditions[condition] || 0) + 1;
        }
    });

    const totalDays = Object.values(weatherConditions).reduce((sum, val) => sum + val, 0);
    const weatherPercentages = Object.keys(weatherConditions).map(key => ({
        label: key,
        value: (weatherConditions[key] / totalDays) * 100
    }));

    renderCharts(temperatures, weatherPercentages, dates);
}


function renderCharts(temperatures, weatherPercentages, dates) {
    clearCanvases(); 
    const barCtx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            animation: { duration: 2000 },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });

    const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
    doughnutChart = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
            labels: weatherPercentages.map(item => item.label),
            datasets: [{
                label: 'Weather Conditions',
                data: weatherPercentages.map(item => item.value),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: { animation: { duration: 2000 } }
    });

    const lineCtx = document.getElementById('lineChart').getContext('2d');
    lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            animation: { duration: 2000 },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}
