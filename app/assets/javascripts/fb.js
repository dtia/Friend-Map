function getFriendsList(callback) {
	FB.api('/me/friends', function(response) {
		friendList = response.data;
		callback(friendList);
	});
}

function addMarkersForLocations(locations) {
	console.log('geocoding locations and adding markers...');
	// $.ajax({
	// 	    url: "/locations",
	// 	    type: "POST",
	// 	    data: {locations: JSON.stringify(locations)},
	// 	    success: function(resp){
	// 			console.log('locations posted');
	// 			console.log(resp);
	// 			if (resp) {
	// 				for (var i=0; i < resp.length; i++) {
	// 					//location = resp[1];
	// 					//addMarker(location.city, location.lat, location.lng);
	// 				}	
	// 			}
	// 		}
	// 	});
	for(var i=0; i<locations.length; i++) {
		codeAddress(locations[i].city);
	}
}

function main() {
	document.getElementById("plotting").style.visibility = 'visible';
	
	// get friends list
	// get friends' locations
	console.log('getting friends locations');
	getFriendsList(function(friendsList) {
		
    	FB.getLoginStatus(function(loginStatusResponse) {
        	var batches = [];
			var batchData = [];
			
			for (var i=0; i<friendsList.length; i++) {
				var request = new Object(); 
				request.method = 'GET';
				request.relative_url = '/' + friendList[i].id + '?fields=location';
				batchData.push(request); 
			
				// need to break up batches into size 50, which is facebook's batch limit
				if (i % 50 == 0) {
				   	batches.push(batchData);
				   	batchData = [];
				}
			}
						
			var locations = [];
    	   	for (var i = 0; i < batches.length; i++) {
       			FB.api("/", "POST", 
       				{ access_token: loginStatusResponse.authResponse.accessToken, batch: batches[i] }, 
        			function(response) {
						for (var i = 0; i < response.length; i++) {
        					locationObject = JSON.parse(response[i].body).location;
        					if (locationObject) {
								city = locationObject.name;
								if (city != null && !containsCity(locations, city)) {
									var val = {};
									val.city = city;
									locations.push(val);
								}
							}
        				}  
        				addMarkersForLocations(locations);        				 
       				});
				}
    	  });
		  document.getElementById("plotting").style.visibility = 'hidden';
	});
}

function containsCity(arr, val) {
	for(var i=0; i<arr.length; i++) {
		curr = arr[i];
		if (curr.city === val) {
			return true;
		}
	}
	return false;
}