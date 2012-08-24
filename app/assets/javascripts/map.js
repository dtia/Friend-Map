var geocoder;
var map;
function initialize() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(37.7577,-122.4376);
  var mapOptions = {
    zoom: 2,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}

function codeAddress(address) {
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var marker = new google.maps.Marker({
          	map: map,
          	position: results[0].geometry.location,
			title: address
      });
    }
	else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
		setTimeout(function() {
			codeAddress(address);
		}, 200);	
	}
	else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}


