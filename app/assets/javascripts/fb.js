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
	// for(var i=0; i<locations.length; i++) {
	// 	codeAddress(locations[i].city);
	// }
	
	for(key in locations){
	  if(locations.hasOwnProperty(key)){
		val = locations[key];
		codeAddress(key, val);
	    //console.log("key = " + key + ", value = " + locations[key]);
	  }
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
//			for (var i=0; i<100; i++) {
				var request = new Object(); 
				request.method = 'GET';
				request.relative_url = '/' + friendList[i].id + '?fields=location,name';
				batchData.push(request); 
			
				// need to break up batches into size 50, which is facebook's batch limit
				if (i % 50 == 0) {
				   	batches.push(batchData);
				   	batchData = [];
				}
			}
						
			var locations = {};
    	   	for (var i = 0; i < batches.length; i++) {
       			FB.api("/", "POST", 
       				{ access_token: loginStatusResponse.authResponse.accessToken, batch: batches[i] }, 
        			function(response) {
						for (var i = 0; i < response.length; i++) {
        					locationObject = JSON.parse(response[i].body).location;
        					if (locationObject) {
								name = JSON.parse(response[i].body).name;
								city = locationObject.name;
								if (city != null && !containsCity(locations, city)) {
									var val = {};
									val.city = city;
									
									var nameList = null;
									if (locations[city] != null) {
										// retrieve list of users first
										nameList = locations[city];
									}
									else {
										nameList = [];
									}
									
									nameList.push(name);
									locations[city] = nameList;
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