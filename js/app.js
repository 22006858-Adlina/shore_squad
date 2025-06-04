// app.js - ShoreSquad main JS

// Example: Simulate loading map, weather, and crew info
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('map').textContent = 'Interactive map coming soon!';
    document.getElementById('weather').textContent = 'Weather data will appear here.';
    document.getElementById('crew-list').textContent = 'Invite friends and join a cleanup!';
});

// Fetch and display a 4-day weather forecast for Pasir Ris using NEA's API
async function fetchWeatherForecast() {
    const weatherDiv = document.getElementById('weather');
    weatherDiv.textContent = 'Loading weather forecast...';
    try {
        // NEA 4-day weather forecast endpoint
        const resp = await fetch('https://api.data.gov.sg/v1/environment/4-day-weather-forecast');
        const data = await resp.json();
        const forecasts = data.items[0].forecasts;
        let html = `<div class="forecast-title">4-Day Weather Forecast (Pasir Ris)</div><div class="forecast-grid">`;
        forecasts.forEach(forecast => {
            html += `<div class="forecast-card">
                <div class="forecast-date">${forecast.date}</div>
                <div class="forecast-desc">${forecast.forecast}</div>
                <div class="forecast-temp">${forecast.temperature.low}&deg;C - ${forecast.temperature.high}&deg;C</div>
                <div class="forecast-humidity">Humidity: ${forecast.relative_humidity.low}% - ${forecast.relative_humidity.high}%</div>
                <div class="forecast-wind">Wind: ${forecast.wind.speed.low}-${forecast.wind.speed.high} km/h ${forecast.wind.direction}</div>
            </div>`;
        });
        html += '</div>';
        weatherDiv.innerHTML = html;
    } catch (e) {
        weatherDiv.textContent = 'Unable to load weather forecast.';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Remove placeholder text for map and crew-list (handled in HTML)
    fetchWeatherForecast();

    const crewInput = document.getElementById('crew-name-input');
    const addCrewBtn = document.getElementById('add-crew-btn');
    const crewList = document.getElementById('crew-members');

    // Example crew for first load
    let crew = JSON.parse(localStorage.getItem('shoreSquadCrew') || 'null');
    if (!crew) {
        crew = ['Alex', 'Jamie', 'Priya', 'Wei Ming'];
        localStorage.setItem('shoreSquadCrew', JSON.stringify(crew));
    }
    renderCrew();

    addCrewBtn.addEventListener('click', addCrewMember);
    crewInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') addCrewMember();
    });

    function addCrewMember() {
        const name = crewInput.value.trim();
        if (name && !crew.includes(name)) {
            crew.push(name);
            localStorage.setItem('shoreSquadCrew', JSON.stringify(crew));
            crewInput.value = '';
            renderCrew();
        }
    }

    function removeCrewMember(name) {
        crew = crew.filter(n => n !== name);
        localStorage.setItem('shoreSquadCrew', JSON.stringify(crew));
        renderCrew();
    }

    function renderCrew() {
        crewList.innerHTML = '';
        crew.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name + ' ';
            const btn = document.createElement('button');
            btn.className = 'remove-crew-btn';
            btn.title = 'Remove';
            btn.innerHTML = '&times;';
            btn.onclick = () => removeCrewMember(name);
            li.appendChild(btn);
            crewList.appendChild(li);
        });
    }
});

// Future features:
// - Real-time weather API integration
// - Interactive map with cleanup locations
// - Social features: crew invites, chat, leaderboards
// - Performance: lazy loading, caching, service workers
// - Accessibility: keyboard navigation, ARIA labels
