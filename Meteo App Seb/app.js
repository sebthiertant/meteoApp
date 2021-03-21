let containerMain = document.querySelector(".containerMain");
let containerOthers = document.querySelector(".containerOthers");

// requête API sans utiliser Jquery et avec gestion d'erreur

function buttonClickGET() {
    let cityInput = document.querySelector(".city").value.toLowerCase();

    fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityInput +
        "&appid=c21a75b667d6f7abb81f118dcf8d4611&units=metric"
    ).then((res) => {
        if (res.ok) {
            containerMain.classList.remove("visible");
            containerOthers.classList.remove("visible");
            containerMain.classList.add("hide");
            containerOthers.classList.add("hide");

            res.json().then((data) => callbackGetSuccess(data));
        } else if (cityInput == "") {
            alert("Veuillez saisir un nom de ville.");
        } else {
            alert(
                cityInput +
                " n'a donné aucun résultat. Veuillez saisir un nom de ville correct."
            );
        }
    });
}

// fonction de récupération et d'affichage des données

let callbackGetSuccess = function(data) {
    const tempDisplay = document.querySelector(".temperature");
    const humidityDisplay = document.querySelector(".humidity");
    const weatherDisplay = document.querySelector(".weather");
    const windDisplay = document.querySelector(".wind");
    const cityName = document.querySelector(".name");

    containerMain.classList.remove("hide");
    containerOthers.classList.remove("hide");

    containerMain.classList.add("visible");
    containerOthers.classList.add("visible");

    tempDisplay.textContent = Math.floor(data.main.temp) + "°C";
    humidityDisplay.textContent = data.main.humidity + "%";
    windDisplay.textContent = Math.floor(data.wind.speed * 3.6) + " Km/h ";

    // Suppression du "arrondissement de" lors de la recherche de certaines villes françaises et affichage du nom de la ville
    cityName.textContent = data.name.replace("Arrondissement de", "");

    // gestion du calcul de l'heure UNIX vers l'heure desktop de l'heure du dernier relevé

    let unix_timestamp = data.dt - 3600 + data.timezone;
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    let date = new Date(unix_timestamp * 1000);
    // Hours part from the timestamp
    let hours = date.getHours();
    // Minutes part from the timestamp
    let minutes = "0" + date.getMinutes();
    // setup de l'heure au format 10:30
    let formattedTime = hours + ":" + minutes.substr(-2);

    // affichage de l'heure du dernier relevé
    let lastUpdateDisplay = document.querySelector(".lastUpdate");

    lastUpdateDisplay.textContent = "Dernière actualisation : " + formattedTime;

    // heure du soleil levant
    let sunrise = data.sys.sunrise - 3600 + data.timezone;
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    let sunriseDate = new Date(sunrise * 1000);
    // Hours part from the timestamp
    let sunriseHours = sunriseDate.getHours();
    // Minutes part from the timestamp
    let sunriseMinutes = "0" + sunriseDate.getMinutes();
    // affichage de l'heure au format 10:30
    let sunriseFormattedTime = sunriseHours + ":" + sunriseMinutes.substr(-2);

    // affichage de l'heure du coucher du soleil
    let sunriseDisplay = document.querySelector(".sunrise");
    sunriseDisplay.textContent = sunriseFormattedTime;

    // heure du soleil couchant
    let sunset = data.sys.sunset - 3600 + data.timezone;
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    let sunsetDate = new Date(sunset * 1000);
    // Hours part from the timestamp
    let sunsetHours = sunsetDate.getHours();
    // Minutes part from the timestamp
    let sunsetMinutes = "0" + sunsetDate.getMinutes();

    // affichage de l'heure au format 10:30
    let sunsetFormattedTime = sunsetHours + ":" + sunsetMinutes.substr(-2);

    // affichage de l'heure du coucher du soleil
    let sunsetDisplay = document.querySelector(".sunset");
    sunsetDisplay.textContent = sunsetFormattedTime;

    // set weather icons night and day version

    if (data.weather[0].icon == "01d" || data.weather[0].icon == "01n") {
        weatherDisplay.style.backgroundImage = "url(/ressources/clear.png)";
        weatherDisplay.style.transform = "scale(2)";
    }
    if (
        data.weather[0].icon == "02d" ||
        data.weather[0].icon == "02n" ||
        data.weather[0].icon == "03d" ||
        data.weather[0].icon == "03n" ||
        data.weather[0].icon == "04d" ||
        data.weather[0].icon == "04n"
    ) {
        weatherDisplay.style.backgroundImage = "url(/ressources/clouds.png)";
        weatherDisplay.style.transform = "scale(1)";
    }
    if (data.weather[0].icon == "50d" || data.weather[0].icon == "50n") {
        weatherDisplay.style.backgroundImage = "url(/ressources/smog.png)";
        weatherDisplay.style.transform = "scale(1)";
    }
    if (data.weather[0].icon == "13d" || data.weather[0].icon == "13n") {
        weatherDisplay.style.backgroundImage = "url(/ressources/snow.png)";
        weatherDisplay.style.transform = "scale(1)";
    }
    if (
        data.weather[0].icon == "09d" ||
        data.weather[0].icon == "09n" ||
        data.weather[0].icon == "10d" ||
        data.weather[0].icon == "10n"
    ) {
        weatherDisplay.style.backgroundImage = "url(/ressources/rain.png)";
        weatherDisplay.style.transform = "scale(1)";
    }
    if (data.weather[0].icon == "11d" || data.weather[0].icon == "11n") {
        weatherDisplay.style.backgroundImage = "url(/ressources/thunderstorm.png)";
    }
};

// Fonction d'écoute de la touche entrée pour permettre l'envoi de l'input.
const body = document.querySelector("body");

let keyboardArray = [];

body.addEventListener("keydown", function(keyboard) {
    keyboardArray.push(keyboard.key);
    if (keyboardArray.includes("Enter") == true) {
        buttonClickGET();
        keyboardArray = []; // reset de l'array pour ne pas conserver la valeur Enter dans celui-ci.
    } else if (keyboardArray.length > 14) {
        keyboardArray = []; // reset de l'array pour ne pas conserver plus de 15 valeurs dans celui-ci et ne pas surcharger les données écoutées.
    }
});