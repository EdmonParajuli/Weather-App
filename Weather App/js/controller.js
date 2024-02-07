//DOM ELEMENTS
const container = document.querySelector(".container");
const mainContainer = document.querySelector(".main-container");
const input = document.querySelector("input[name='city']");
const searchBtn = document.getElementById("btn");
const error = document.querySelector(".error-box");

//Used to handle search event after event occuring(load,click,keypress)
const handleSearchEvent = async () => {
  try {
    document.querySelector(".error-box").style.display = "none";
    const cityName = input.value.trim();
    if (cityName !== "") {
      await loadCountry(cityName);
    }
  } catch (err) {
    console.error(`!@!@!@!@!@!${err}`);
  }
};



/* FETCH DATA FROM API AND MANIPULATE IT TO DOM */
const loadCountry = async function (city = 'San fransisco') {
  try {
    if (!city) {
      throw new Error(`City not found`);
    }
    renderSpinner();
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2bb7cae63139c87d22dd64f93990909e&units=metric`
    );

    if (response.status == 404) {
      document.querySelector(".error-box").style.display = "flex";
      document.querySelector(".spinner").style.display = "none";
      mainContainer.innerHTML = "";
      input.value = "";
    } else {
      const data = await response.json();
      const { main } = data;
      const { wind } = data;
      const weatherType = data.weather[0].main;
      document.querySelector(".spinner").style.display = "none";
      
      const markup = `
      
      <div class="error-box">
          <div class="error">
            <lord-icon
              src="https://cdn.lordicon.com/ygvjgdmk.json"
              trigger="hover"
              style="width: 20px; height: 20px"
              >
            </lord-icon>
              <h4>Invalid City name</h4>
          </div>
          </div>
          
          
          <div class="temperature-box">
        <div class="weather-image">
            <img src="./images/${weatherType}.png" alt="clear">
        </div>
        <div class="weather">
            <h2 id="temperature">${Math.floor(main.temp)}°C</h2>
            <h1 id="temperature">${city.toUpperCase()}</h1>
        </div>
       </div> 
       <div class="extra-weather">
       <div class="humidity-container">
            <img src="./images/humidity.png" alt="humidity">
            <div class="humidity">
            <h2>${main.humidity}%</h2>
            <h3>Humidity</h3>
            </div>
            </div>
            <div class="wind-container">
            <img src="./images/wind.png" alt="wind">
            <div class="wind-speed">
            <h2>${wind.speed} km/h</h2>
            <h3>Wind Speed</h3>
            </div>
            </div>
            </div>
            `;
            mainContainer.innerHTML = "";
            mainContainer.insertAdjacentHTML("afterbegin", markup);
            input.value = "";
          }
        } catch (err) {
    console.error(err);
  }
};


/*RENDER SPINNER*/
const renderSpinner = function () {
  document.querySelector(".spinner").style.display = "block";
  mainContainer.innerHTML = "";
};


input.addEventListener('keypress',(e)=>{
  if(e.key === "Enter"){
    e.preventDefault();
    handleSearchEvent();
  }
});
searchBtn.addEventListener("click", handleSearchEvent);

const getGeolocationUser =  function(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(async function(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      // const latitude = 26.4525;
      // const longitude = 87.2718;
      renderSpinner();
      const response = await fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=724448868181273431555x19619`)
      const data = await response.json();
      const city = data.osmtags.name;
      loadCountry(city);
    })}
  }



window.addEventListener('load',()=>{
  getGeolocationUser();
})