//If you're on the homepage get all the restaurant names and iterate over fetchRestaurantInfoPromise
if (window.location == "http://127.0.0.1:8080/") {
  fetch("all.json")
    .then(function(response) {
      return response.json();
    })
    .then(function(allRestaurants) {
      allRestaurants.forEach(fetchRestaurantInfoPromise);
    });
}else{ //Otherwise only use fetchRestaurantInfoPromise for the restaurant determined by the hash
  let fragment = window.location.hash.slice(1);
  fetchRestaurantInfoPromise(fragment);
}

//Gets all the restaurant information
function fetchRestaurantInfoPromise(restaurant) {
  return fetch(`/${restaurant}.json`)
    .then(request => request.json())
    .then(json => appendLatLon(json));
}

//Adds the latitude and longitude to the restaurant object
function appendLatLon(rest) {
  let urlAddress = encodeURIComponent(rest.address);
  fetch(
    `https://nominatim.openstreetmap.org/search/?q=${urlAddress}&format=json`
  )
    .then(request => request.json())
    .then(json => {
      rest.lat = json[0].lat;
      rest.lon = json[0].lon;
      return rest;
    })
    .then(fullRestInfo => {
      //If you are on the restaurant page use buildRestaurantPage to add all the relevant info to the page and add the map with makeMap
      if (window.location != "http://127.0.0.1:8080/") {
        buildRestaurantPage(fullRestInfo);
        makeMap(fullRestInfo);
      } else {//Otherwise you're on the homepage and you just need to make the map and add the href locations to the names. 
        makeMap(fullRestInfo);
        addName(fullRestInfo);
      }
    });
}

//Adds the restaurant names with links to the homepage.
function addName(theRestaurant) {
  const element = document.getElementById("container");

  const name = document.createElement("a");
  name.textContent = theRestaurant.name;
  name.href = `http://localhost:8080/restaurant.html#${theRestaurant.id}`;

  element.appendChild(name);
}

//Creat
function buildRestaurantPage(restObject) {
  let contentContainer = document.getElementById("content-container");

  let name = (contentContainer.appendChild(
    document.createElement("h1")
  ).textContent = restObject.name);
  let address = (contentContainer.appendChild(
    document.createElement("p")
  ).textContent = restObject.address);
  let phone = (contentContainer.appendChild(
    document.createElement("p")
  ).textContent = restObject.phone);
  let hours = (contentContainer.appendChild(
    document.createElement("p")
  ).textContent = restObject.hours);
  let website = contentContainer.appendChild(document.createElement("a"));
  website.textContent = restObject.website;
  website.href = restObject.website;

  restObject.notes.forEach(note => {
    document
      .getElementById("notes-container")
      .appendChild(document.createElement("p")).innerHTML = marked(note);
  });
}

let map = false;

function makeMap(restObject) {
  if (window.location == "http://127.0.0.1:8080/" && map == false) {
    map = L.map("map").setView([44.477299, -73.213094], 16);
  } else if (map == false) {
    map = L.map("map").setView([restObject.lat, restObject.lon], 20);
  }

  L.tileLayer("https://{s}.tile.OpenStreetMap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker([restObject.lat, restObject.lon])
    .addTo(map)
    .bindPopup(`${restObject.name}<br>${restObject.address}`)
    .on("mouseover", function(e) {
      this.openPopup();
    })
    .on("mouseout", function(e) {
      this.closePopup();
    })
    .on("click", function(e) {
      if (window.location == "http://127.0.0.1:8080/") {
        window.location = `http://127.0.0.1:8080/restaurant.html#${
          restObject.id
        }`;
      } else {
        window.location = `${restObject.website}`;
      }
    });
}