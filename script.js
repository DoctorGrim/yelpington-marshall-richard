var map = L.map("map").setView([44.47, -73.21], 13);

L.tileLayer("https://{s}.tile.OpenStreetMap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([44.47, -73.21]) ///make universal
  .addTo(map)
  .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
  .openPopup();

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);




/////////



fetch('all.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (allResteronts) {
    allResteronts.forEach(getInfo);
    allResteronts.forEach(makeMarker)
  })




function getInfo (theResteront) {

fetch(`${theResteront}.json`)
.then(function (response) {
    return response.json();
  })
  .then(function (resteront) {
    addName(resteront)
  })
};

function addName(theResteront) {
    

const element = document.getElementById('container');
  
  const name = document.createElement('a');
  name.textContent = theResteront.name;
  name.href=`http://localhost:8080/restaurant.html#${theResteront};`
  
  element.appendChild(name);
}





// fetch(https://nominatim.openstreetmap.org/search/?q=182 Main St.,Burlington,VT&format=json)
// .then(function (response) {
//     return response.json();
//   })
//   .then(function (allResteronts) {
//     allResteronts.forEach(addPost);
//   })