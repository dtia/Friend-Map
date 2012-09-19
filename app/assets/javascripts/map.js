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

function addBox() {
	var myOptions = {
             content: boxText
            ,disableAutoPan: false
            ,maxWidth: 0
            ,pixelOffset: new google.maps.Size(-140, 0)
            ,zIndex: null
            ,boxStyle: { 
              background: "url('tipbox.gif') no-repeat"
              ,opacity: 0.75
              ,width: "280px"
             }
            ,closeBoxMargin: "10px 2px 2px 2px"
            ,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
            ,infoBoxClearance: new google.maps.Size(1, 1)
            ,isHidden: false
            ,pane: "floatPane"
            ,enableEventPropagation: false
    };

	var boxText = document.createElement("div");
    boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
    boxText.innerHTML = "City Hall, Sechelt<br>British Columbia<br>Canada";

	var latlng = new google.maps.LatLng(55.672962361614566, 12.56587028503418);
	var marker = new google.maps.Marker({
		map: map,
		position: latlng,
		title: "address"
	});

	var ib = new InfoBox(myOptions);
	ib.open(map,this);
}

// Here in case we need an on-the-fly call to an address / marker mapping
function codeAddress(address) {
	
	geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
		var lat = results[0].geometry.location.Xa;
		var lng = results[0].geometry.location.Ya;
		
		var loc = new Microsoft.Maps.Location(lat, lng);
		var pin = new Microsoft.Maps.Pushpin(loc, {text: ''});
		
		// Create the infobox for the pushpin
        var pinInfobox = new Microsoft.Maps.Infobox(pin.getLocation(), 
        {title: address,
         description: 'Friends living in ' + address,
         visible: false, 
         offset: new Microsoft.Maps.Point(0,15)});

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

