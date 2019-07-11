var map = L.map("map").setView([44.47, -73.21], 13);

L.tileLayer("https://{s}.tile.OpenStreetMap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

map.on("click", onMapClick);

/////////

fetch("all.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(allResteronts) {
    allResteronts.forEach(getInfo);
    allResteronts.forEach(makeMarker);
  });

function getInfo(theResteront) {
  fetch(`${theResteront}.json`)
    .then(function(response) {
      return response.json();
    })
    .then(function(resteront) {
      addName(resteront);
      setAddress(resteront.address);
    });
}

function addName(theResteront) {
  const element = document.getElementById("container");

  const name = document.createElement("a");
  name.textContent = theResteront.name;
  name.href = `http://localhost:8080/restaurant.html#${theResteront.id}`;

  element.appendChild(name);
}

function setAddress(address) {
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
        .bindPopup(`${address}`)
        .openPopup();
    });
}

// fetch(https://nominatim.openstreetmap.org/search/?q=182 Main St.,Burlington,VT&format=json)
// .then(function (response) {
//     return response.json();
//   })
//   .then(function (allResteronts) {
//     allResteronts.forEach(addPost);
//   })
