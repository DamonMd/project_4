// this sets the link for the 'See Itnerary' link to match the current trip //
// need to find a better way of handling this //
document.getElementById("save_trip").addEventListener("click", function(e){
  e.preventDefault
  var id = document.getElementById("current_trip_id").innerHTML
  document.getElementById("see_trip").href = ("/activities/" + id)
})

document.getElementById("create_trip").addEventListener("click", function(e){
  var user_name = document.getElementById("user_name").value
  var trip_name = document.getElementById("trip_name").value
  $.ajax({
    type: 'POST',
    data: {name: trip_name, user: user_name},
    dataType: 'json',
    url: "/activities"
  }).done(function(response){
    console.log("ajaxed", response)
    console.log(response._id)
    document.getElementById("current_trip_id").innerHTML = response._id
  }).fail(function(){
    console.log("failed to save")
  })
  // really need to add in function to show/hide. not dry right now //
  document.getElementById("current_user").innerHTML = "Welcome! " + user_name
  document.getElementById("current_trip_name").innerHTML = "Save places to " + trip_name + " by using the search box below"
  document.getElementById("user_name").style.display = 'none'
  document.getElementById("trip_name").style.display = 'none'
  document.getElementById("create_trip").style.display = 'none'
  document.getElementById("title").style.display = 'none'
  document.getElementById("current_user").style.display = 'block'
  document.getElementById("current_trip_name").style.display = 'block'
  document.getElementById("see_trip").style.display = 'inline'
  document.getElementById("save_trip").style.display = 'inline'
  document.querySelector(".events").style.display = 'block'
})


var map
var infowindow
var markers = []
var windows = []

// creates initial map on page //
function initialize() {
  geocoder = new google.maps.Geocoder()

  var dc = new google.maps.LatLng(38.898748, -77.037684);
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: dc,
    zoom: 13
  });

  var request = {
    location: dc,
    radius: 1000,
    keyword: "1776"
  }
  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

//clears markers for each new keyword search //
function clearMarkers(){
  if(markers){
    for (i in markers){
        markers[i].setMap(null)

    }
    markers = []
    windows = []
  }
}

// clears the open window when you click on a new marker //
function clearWindows() {
    if (windows) {
        for (i in windows) {
            if (windows[i].getMap()) {
                windows[i].close()
            }
        }
    }
}

function createMarker(place) {
  // var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name,
    rating: place.rating
  })

  markers.push(marker);

// this is where the information in the pop up window goes //
var infowindow = new google.maps.InfoWindow({
	content: '<img src="' + place.icon + '" /><font style="color:#000;">' + place.name +
	'<br />Rating: ' + place.rating + '<br />Vicinity: ' + place.vicinity + '</font>' + "<div id='add'><a href=#>Add to my trip</a></div>"
	    })

  var activity_data = { place_name: place.name,
               rating: place.rating,
               icon: place.icon,
               address: place.vicinity,
               placeid: place.place_id }

// adds event listener for 'save to trip' link in info window //
  google.maps.event.addListener(infowindow, 'domready', function() {
      var current_id = document.getElementById("current_trip_id").innerHTML
      document.getElementById("add").addEventListener("click", function(e) {
        $.ajax({
          type: 'PUT',
          data: {data: activity_data, id: current_id},
          dataType: 'json',
          url: "/activities"
        }).done(function(response){
          console.log("ajaxed", response)
        }).fail(function(){
          console.log("failed to save")
        })
      })
  })

  google.maps.event.addListener(marker, 'click', function() {
    clearWindows();
    infowindow.open(map, this)
  })
  windows.push(infowindow)
}

function findAddress(){
  var address = document.querySelector("#gmap_where").value
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var addrLocation = results[0].geometry.location;
      map.setCenter(addrLocation);

      document.getElementById('lat').value = results[0].geometry.location.lat()
      document.getElementById('lng').value = results[0].geometry.location.lng()

      var addrMarker = new google.maps.Marker({
        position: addrLocation,
        map: map,
        title: results[0].formatted_address
      })
    }
  })
}

function findPlaces() {
  // prepare variables (filter)
  var keyword = document.getElementById('gmap_keyword').value
  var lat = document.getElementById('lat').value
  var lng = document.getElementById('lng').value
  var cur_location = new google.maps.LatLng(lat, lng)

  // prepare request to Places
  var request = {
    key: "AIzaSyBfu9hLoL5W9W3FnppbyA_80t_Jc0L9uWw",
    location: cur_location,
    radius: 10000,
    keyword: [keyword]
  }

  // send request
  service = new google.maps.places.PlacesService(map)
  service.search(request, createMarkers)
}

function createMarkers(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {

    // clear current markers on map for new search //
    clearMarkers()

    // create new markers by search result //
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
    alert('Sorry, nothing was found');
  }
}

var new_search = document.querySelector("#button2")
new_search.addEventListener('click', function(event){
  event.preventDefault()
  findAddress()
})

var keyword_search = document.getElementById('keyword')
keyword_search.addEventListener('click', function(event){
  event.preventDefault()
  findPlaces()
  document.getElementById('gmap_keyword').value = ""
})

google.maps.event.addDomListener(window, 'load', initialize);
