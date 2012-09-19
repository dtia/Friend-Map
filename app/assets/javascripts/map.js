var geocoder;
var map;

function GetMap()
{
    map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), {
	credentials:"AkL7bdBJmEpRncJpZ9MmXwEUIvnkId7Yo9IJrDhNFGrkR--08hfritan5JH_nzRw",
	center: new Microsoft.Maps.Location(37.7577,-122.4376),
	mapTypeId: Microsoft.Maps.MapTypeId.road,
	zoom: 6});
	
	geocoder = new google.maps.Geocoder();
}

// function addMarker(city, lat, lng) {
// 	var latLng = new google.maps.LatLng(lat,lng);
// 	var marker = new google.maps.Marker({
//           	map: map,
//           	position: latLng,
// 			title: city
// 	});
// 	
// 	var infowindow = new google.maps.InfoWindow({
// 	    content: '<div id="cityName"></div>'
// 	});
// 	
// 	google.maps.event.addListener(marker, 'click', function() {
// 		$("div#cityName").text(city);
// 		infowindow.open(map,marker);
// 	});
// }

// Here in case we need an on-the-fly call to an address / marker mapping
function codeAddress(address, residents) {
	
	geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
		var lat = results[0].geometry.location.Xa;
		var lng = results[0].geometry.location.Ya;
		
		var loc = new Microsoft.Maps.Location(lat, lng);
		var pin = new Microsoft.Maps.Pushpin(loc, {text: ''});
		
		
		var infoboxOptions = {
			//title: address,
			//description: '' + residents,
			visible: false, 
			offset: new Microsoft.Maps.Point(10,20),
			htmlContent:'<div class="infoboxText">' +
			'<span class="infoboxTitle">' + address + '</span>' +
			'<span class="infoboxDescription">' + residents + '</span></div>'}; 
			
		//var infoboxOptions = {width :200, height :100, showCloseButton: true, zIndex: 0, offset:new Microsoft.Maps.Point(10,0), showPointer: true, htmlContent:'<b>Custom HTML</b>'};
		
		// Create the infobox for the pushpin
        var pinInfobox = new Microsoft.Maps.Infobox(pin.getLocation(), infoboxOptions);

		 // Add handler for the pushpin click event.
         Microsoft.Maps.Events.addHandler(pin, 'click', function displayInfobox(e)
			{
				this.setOptions({ visible:true });
			}.bind(pinInfobox));

         // Hide the infobox when the map is moved.
         Microsoft.Maps.Events.addHandler(map, 'viewchange', function displayInfobox(e)
			{
				this.setOptions({ visible:false });
			}.bind(pinInfobox));
		 
		map.entities.push(pin);
		map.entities.push(pinInfobox);
		
    }
	else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT ||
			status == google.maps.GeocoderStatus.ZERO_RESULTS) {
		setTimeout(function() {
			codeAddress(address);
		}, 200);	
	}
	else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function displayInfobox(e)
{
	pinInfobox.setOptions({ visible:true });
}                    

function hideInfobox(e)
{
   pinInfobox.setOptions({ visible: false });
}

function replaceWhiteSpace(str) {
	return str.replace(/\s/g,'').replace(/\,/g,''); 
}

