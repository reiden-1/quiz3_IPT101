function getForecast() {
  // Get the city input from the user
  const city = document.getElementById('cityInput').value;
  
  // If no city is provided, exit the function
  if (!city) return;
  
  // Define the API key and URL for the weather API request
  const apiKey = 'da05fa391e4b462d97652234251104';
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;
  
  // Select the HTML elements that will display the forecast
  const container = document.querySelector('.container');
  const forecastContainer = document.getElementById('forecastContainer');
  const locationTitle = document.getElementById('locationTitle');
  
  // Add loading classes to show loading spinner
  container.classList.add('loading');
  forecastContainer.classList.add('loading');
  forecastContainer.innerHTML = '<div class="spinner"></div>';
  locationTitle.textContent = 'Loading forecast...';
  
  // Fetch the weather data from the API
  fetch(url)
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
      // Remove loading state once data is received
      container.classList.remove('loading');
      forecastContainer.classList.remove('loading');
      
      // Set the location title to show the city name and forecast type
      locationTitle.textContent = `${data.location.name} - 7-Day Forecast`;
      forecastContainer.innerHTML = ''; // Clear previous forecast data
      
      // Loop through the forecast data for each day and display it
      data.forecast.forecastday.forEach((day, index) => {
        const date = new Date(day.date).toDateString(); // Format the date
        const temp = day.day.avgtemp_c; // Get the average temperature
        const condition = day.day.condition.text; // Get the weather condition
        const icon = day.day.condition.icon; // Get the weather icon
        
        // Create a card element for each day's forecast
        const card = document.createElement('div');
        card.className = 'card forecast-fade-in';
        card.style.animationDelay = `${index * 0.1}s`; // Add animation delay for each card
        card.innerHTML = `
          <h3>${date}</h3>
          <p>Temp: ${temp}°C</p>
          <p>${condition}</p>
          <img src="https:${icon}" alt="${condition}">`; // Set the weather icon and description
        forecastContainer.appendChild(card); // Add the card to the forecast container
        
        // Set the background color based on the weather condition
        setBackgroundByWeather(card, condition);
      });
    })
    .catch((error) => {
      // Handle errors (e.g., city not found or API issues)
      console.error('Fetch error:', error);
      container.classList.remove('loading');
      forecastContainer.classList.remove('loading');
      forecastContainer.innerHTML = '<p class="forecast-fade-in">City not found or API error!</p>';
    });
}


function setBackgroundByWeather(card, condition) {
  // Exit if no card element is provided
  if (!card) return;

  // Reset the card's class to 'card' to remove previous classes
  card.className = 'card';
  
  // Convert the condition to lowercase for consistent comparison
  condition = condition.toLowerCase();

  // Apply different background classes based on the weather condition
  if (condition.includes('clear') && (condition.includes('night') || condition.includes('clear'))) {
    card.classList.add('clear-night'); // Clear night condition
  } 
  else if (condition.includes('sunny') || condition.includes('clear')) {
    card.classList.add('sunny'); // Sunny condition
  }
  else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
    card.classList.add('rainy'); // Rainy condition
  }
  else if (condition.includes('snow') || condition.includes('blizzard') || condition.includes('sleet') || condition.includes('flurr')) {
    card.classList.add('snowy'); // Snowy condition
  }
  else if (condition.includes('cloud') || condition.includes('overcast')) {
    card.classList.add('cloudy'); // Cloudy condition
  }
  else if (condition.includes('thunder') || condition.includes('storm')) {
    card.classList.add('thunderstorm'); // Thunderstorm condition
  }
  else if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) {
    card.classList.add('foggy'); // Foggy condition
  }
  else {
    card.classList.add('sunny'); // Default to sunny if condition is unrecognized
  }
}
