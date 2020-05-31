(function () {
    const input = "New York, 10005, Tokyo, São Paulo, Pluto";
    const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?appid=48d32d728cb016719c137f1f1c3fb6cd`;

    const getWeatherByCity = (city) => {
        return fetch(`${BASE_URL}&q=${city}`).then(res => res.json());
    }

    const getWeatherByZip = (zip) => {
        return fetch(`${BASE_URL}&zip=${zip}`).then(res => res.json());
    }

    const calcTime = (offset) => {
        let d = new Date();
        let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        return new Date(utc + (1000 * offset)).toLocaleString();
    }

    const loadWeather = (input, callback) => {
        let promises = [];
        input.split(",").map(x => x.trim()).forEach(x => {
            let weather = /\d/gi.test(x) ? getWeatherByZip(x) : getWeatherByCity(x);
            promises.push(weather);
        });

        Promise.all(promises).then(weatherData => {
            console.log(weatherData);
            callback(weatherData.map(x => {
                return {
                    weather: `${x.weather && x.weather[0].description
                        || ""} Temp: ${x.main && x.main.temp || ""}`,
                    time: x.timezone ? calcTime(x.timezone) : ""
                }
            }));
        }).catch(err => {
            console.error(err);
        });
    }

    loadWeather(input, (data) => {
        data.forEach(x => {
            console.log(x);
        });
    });


    window.onload = function () {
        console.log("Init Doc");
        let loadButton = document.getElementById("load");
        let input = document.querySelectorAll(".box input")[0];
        let resultsDiv = document.getElementsByClassName("results")[0];

        loadButton.addEventListener("click", function (e) {
            let inpStr = input.value;

            if (inpStr) {
                let el = "";
                loadWeather(inpStr, (data) => {
                    data.forEach(x => {
                        el = el + `<div class="item">
                        <p>Time: ${x.time}</p>
                        <p>${x.weather}</p>
                    </div>`
                    });

                    resultsDiv.innerHTML = el;
                });
            }
        });
    }
})();