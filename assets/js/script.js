
var APIKey = 'f950a94f4fd7409e3c556c7a6d058cd0';
var queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=';
var today = moment(). format('L');
var cityHistory = [];

$('#city-form').submit(function(event){
	event.preventDefault()

	var city = $('#city-input').val().trim();
	currentWeather(city);

	if (!cityHistory.includes(city)) {
		cityHistory.push(city);
		var searchedCity = `<button class="city-name list-group-item">${city}</button>`;

		$('.list-group').append(searchedCity);
	}

	localStorage.setItem('city', JSON.stringify(cityHistory));
	console.log(cityHistory);
});

function currentWeather(city) {
	var queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=' + APIKey;

	$.ajax({
		url: queryURL,
		method: 'GET'
// Promise -- sending back data if data is there
	}).then(function(currentWeatherCity) {
		console.log(currentWeatherCity);

		$('.weather')
		$('.details').empty();

		var icon = currentWeatherCity.weather[0].icon;
        var iconURL = 'https://openweathermap.org/img/w/' + icon + '.png';

		var city = `<h3 class="city"> ${currentWeatherCity.name} ${today} <img src='${iconURL}' alt=''/></h3>
                <p class="temperature"> Temperature: ${currentWeatherCity.main.temp} °F</p>
                <p class="humidity"> Humidity: ${currentWeatherCity.main.humidity} %</p>
                <p class="wind"> Wind: ${currentWeatherCity.wind.speed} mph</p>`;

		$('.details').append(city);

		var latitude = currentWeatherCity.coord.lat;
		var longitude = currentWeatherCity.coord.lon;
		var queryURLUVI = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + latitude + '&lon=' + longitude + '&appid=' + APIKey;

		$.ajax({
			url: queryURLUVI,
			method: 'GET'

		}).then(function(uviCity) {
			console.log(uviCity);

			var uvi = uviCity.value;
			var uviDetail = `<p class="uv-index"> UV: ${uvi}</p>`;

			$('.details').append(uviDetail);

			futureWeather(uviCity.lat, uviCity.lon);

			if (uvi >= 0 && uvi <= 4) {
				$('.uv-index').attr('class', 'badge-success');
			} else if (uvi >=4 && uvi <= 8) {
				$('.uv-index').attr('class', 'badge-warning');
			} else {
				$('.uv-index').attr('class', 'badge-danger');
			};
		});
	});

}

function futureWeather(latitude, longitude) {
	var forecastURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=imperial&exclude=current,minutely,hourly,alerts&appid=' + APIKey;

	$.ajax({
		url: forecastURL,
		method: 'GET'
	}).then(function(forecastCity) {
		console.log(forecastCity);

		$('.five-day').empty();
		
		for (let i = 1; i <6; i++) {
			var cityForecast = {
				date: forecastCity.daily[i].dt,
				icon: forecastCity.daily[i].weather[0].icon,
                temp: forecastCity.daily[i].temp.day,
                humidity: forecastCity.daily[i].humidity
			}


			var today = moment.unix(cityForecast.date).format('MM/DD/YYYY');
			var iconURL = `<img src="https://openweathermap.org/img/w/${cityForecast.icon}.png" alt=""/>`;

			var forecast = `
				<div class="card" style="width: 18rem;">
					<div class="card-body">
						<h5 class="card-title day-1">${today}</h5>
						<p class="card-text day-1-icon">${iconURL}</p>
						<p class="card-text day-1-temperature"> Temperature: ${cityForecast.temp} °F</p>
						<p class="card-text day-1-humidity"> Humidity: ${cityForecast.humidity} %</p>
					</div>
				</div>
			</div>`;

			$('.five-day').append(forecast);

		}
	});
}

// function homeScreen(){
//     $('#city-input').defaultValue = "Albuquerque";
//     currentWeather();
// 	futureWeather();
// }