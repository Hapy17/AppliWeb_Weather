// Requete de la météo de Saint-Just-Saint'Rambert
function getWeather(coords) {
    let request = new XMLHttpRequest();
    request.open('GET', `https://www.prevision-meteo.ch/services/json/lat=${coords.lat}lng=${coords.lng}`);
    request.send();

    request.addEventListener('readystatechange', function () {

        if (this.readyState === 4) {
            if (this.status === 200) {
                const myResponse = JSON.parse(this.responseText);
                if (myResponse) insertValuesInDom(myResponse, coords);
            }
        }
    });
}

async function insertValuesInDom(weatherCity, coords) {
    const todayWeather = document.getElementById(`todayWeather`);
    const fourDaysWeather = document.getElementById(`fourDaysWeather`);
    todayWeather.innerHTML = "";
    fourDaysWeather.innerHTML = "";

    // console.log(coords);
    let cityName = document.createElement(`h2`);
    cityName.textContent = "Chargement du nom de la ville..."


    todayWeather.append(cityName);
    getCityName(coords);
    // console.log(weatherCity.current_condition);
    // console.log(weatherCity.current_condition.icon);

    // Météo Aujourd'hui
    let newDiv = document.createElement(`div`);
    let date = document.createElement(`h3`);
    let iconCondition = document.createElement(`img`);
    let tempMax = document.createElement(`p`);
    let tempMin = document.createElement(`p`);
    let temp = document.createElement(`p`);

    console.log(weatherCity);
    date.innerHTML = weatherCity.fcst_day_0.day_long + ` ` + weatherCity.current_condition.date;

    iconCondition.src = weatherCity.current_condition.icon;

    temp.innerHTML = `Température actuelle : ` + weatherCity.current_condition.tmp + ` °C`;

    // TODO : Afficher les infos dans la premiere colonnes

    tempMin.innerHTML = `Température Min. : ` + weatherCity.fcst_day_0.tmin + ` °C`;
    tempMax.innerHTML = `Température Max. : ` + weatherCity.fcst_day_0.tmax + ` °C`;

    todayWeather.appendChild(newDiv);
    newDiv.append(date, iconCondition, temp, tempMax, tempMin);




    for (let property in weatherCity) {
        if (/fcst_day/.test(property) && property != 'fcst_day_0' ) {
            console.log(property);
            let newDiv2 = document.createElement(`div`);
            let date = document.createElement(`h3`);
            let iconCondition = document.createElement(`img`);
            let tempMax = document.createElement(`p`);
            let tempMin = document.createElement(`p`);
            let separation = document.createElement(`hr`);

            date.innerHTML = weatherCity[property].day_long + ` ` + weatherCity[property].date;

            iconCondition.src = weatherCity[property].icon;

            tempMax.innerHTML = `Température Max. : ` + weatherCity[property].tmax + ` °C`;

            tempMin.innerHTML = `Température Min. : ` + weatherCity[property].tmin + ` °C`;



            fourDaysWeather.appendChild(newDiv2);
            newDiv2.append(date, iconCondition, tempMax, tempMin, separation);
        }
    }
}



//  set up de la map
function initMap() {
    var map = L.map('map').setView([45.5, 4.26], 8);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibmJhZG9pdCIsImEiOiJjbDJvc2d6M2MwMzc5M2RvMnhzandzeDJzIn0.XMhD9Mc17VJtUxraV4vlmg'
    }).addTo(map);

    map.on(`click`, function (e) {
        let newMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
        // console.log(e.latlng.lat);
        // console.log(e.latlng.lng);

        let coords = {
            lat: e.latlng.lat,
            lng: e.latlng.lng
        }

        getWeather(coords);
        newMarker.addEventListener(`click`, function () {
            this.remove();
        })


    })
}

initMap()

function getCityName(coords) {
    let requestName = new XMLHttpRequest();
    requestName.open('GET', `http://api.openweathermap.org/geo/1.0/reverse?lat=${coords.lat}&lon=${coords.lng}&limit=1&appid=6d950262a17320046dbcb832cf9085a9
    `);
    requestName.send();
    requestName.addEventListener('readystatechange', function () {

        if (this.readyState === 4) {
            if (this.status === 200) {
                const myResponse = JSON.parse(this.responseText)[0];
                    // console.log(myResponse.name);
                if (myResponse) {
                    document.querySelector(`h2`).innerHTML = myResponse.name;

                }
            }
        }
    });

}