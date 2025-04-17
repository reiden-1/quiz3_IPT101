function getForecast() {
  const city = document.getElementById('cityInput').value;
  if (!city) return;
  
  const apiKey = 'da05fa391e4b462d97652234251104';
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;
  
  const container = document.querySelector('.container');
  const forecastContainer = document.getElementById('forecastContainer');
  const locationTitle = document.getElementById('locationTitle');
  
  container.classList.add('loading');
  forecastContainer.classList.add('loading');
  forecastContainer.innerHTML = '<div class="spinner"></div>';
  locationTitle.textContent = 'Loading forecast...';
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      container.classList.remove('loading');
      forecastContainer.classList.remove('loading');
      
      locationTitle.textContent = `${data.location.name} - 7-Day Forecast`;
      forecastContainer.innerHTML = '';
      
      data.forecast.forecastday.forEach((day, index) => {
        const date = new Date(day.date).toDateString();
        const temp = day.day.avgtemp_c;
        const condition = day.day.condition.text;
        const icon = day.day.condition.icon;
        
        const card = document.createElement('div');
        card.className = 'card forecast-fade-in';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
          <h3>${date}</h3>
          <p>Temp: ${temp}°C</p>
          <p>${condition}</p>
          <img src="https:${icon}" alt="${condition}">
        `;
        forecastContainer.appendChild(card);
        
        setBackgroundByWeather(card, condition);
      });
    })
    .catch((error) => {
      console.error('Fetch error:', error);
      container.classList.remove('loading');
      forecastContainer.classList.remove('loading');
      forecastContainer.innerHTML = '<p class="forecast-fade-in">City not found or API error!</p>';
    });
}

function setBackgroundByWeather(card, condition) {
  if (!card) return;

  card.className = 'card';
  condition = condition.toLowerCase();

  if (condition.includes('clear') && (condition.includes('night') || condition.includes('clear'))) {
    card.classList.add('clear-night');
  } 
  else if (condition.includes('sunny') || condition.includes('clear')) {
    card.classList.add('sunny');
  }
  else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
    card.classList.add('rainy');
  }
  else if (condition.includes('snow') || condition.includes('blizzard') || condition.includes('sleet') || condition.includes('flurr')) {
    card.classList.add('snowy');
  }
  else if (condition.includes('cloud') || condition.includes('overcast')) {
    card.classList.add('cloudy');
  }
  else if (condition.includes('thunder') || condition.includes('storm')) {
    card.classList.add('thunderstorm');
  }
  else if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) {
    card.classList.add('foggy');
  }
  else {
    card.classList.add('sunny');
  }
}