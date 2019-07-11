var map = L.map("map").setView([44.477299, -73.213094], 16); 

L.tileLayer("https://{s}.tile.OpenStreetMap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
//////do not need vvvvvvvvvvvvvv
var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

map.on("click", onMapClick);

/////////^^^^^do not need^^^^^^

fetch("all.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(allRestaurants) {
    allRestaurants.forEach(getInfo);
    allRestaurants.forEach(makeMarker);
  });

function getInfo(theRestaurant) {
  fetch(`${theRestaurant}.json`)
    .then(function(response) {
      return response.json();
    })
    .then(function(restaurant) {
      addName(restaurant);
      setAddress(restaurant.name, restaurant.address, restaurant.id);
    });
}

function addName(theRestaurant) {
  const element = document.getElementById("container");

  const name = document.createElement("a");
  name.textContent = theRestaurant.name;
  name.href = `http://localhost:8080/restaurant.html#${theRestaurant.id}`;

  element.appendChild(name);
}

function setAddress(name, address, id) {
  let urlAddress = encodeURIComponent(address);
  console.log(
    `https://nominatim.openstreetmap.org/search/?q=${urlAddress}&format=json`
  );
  fetch(
    `https://nominatim.openstreetmap.org/search/?q=${urlAddress}&format=json`
  )
    .then(request => request.json())
    .then(json => {
      console.log(json[0].lat); //This just logs the lat. Change it to focus the map.
      console.log(json[0].lon);
      L.marker([json[0].lat, json[0].lon]) ///make universal
        .addTo(map)
        .bindPopup(`${name}<br>${address}`)
        .on('mouseover', function (e) {
          this.openPopup();
         })
        .on('mouseout', function (e) {
          this.closePopup();
         })
        .on('click', function(e){
          window.location = `/restaurant.html#${id}`;
        });
    });
}



// fetch(https://nominatim.openstreetmap.org/search/?q=182 Main St.,Burlington,VT&format=json)
// .then(function (response) {
//     return response.json();
//   })
//   .then(function (allRestaurants) {
//     allRestaurants.forEach(addPost);
//   })
