function getFriendsList(callback) {
	FB.api('/me/friends', function(response) {
		friendList = response.data;
		callback(friendList);
	});
}

var locations = {};
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
//			for (var i=0; i<151; i++) {
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
						
    	   	for (var i = 0; i < batches.length; i++) {
       			FB.api("/", "POST", 
       				{ access_token: loginStatusResponse.authResponse.accessToken, batch: batches[i] }, 
        			function(response) {
						for (var i = 0; i < response.length; i++) {
        					locationObject = JSON.parse(response[i].body).location;
        					if (locationObject) {
								name = JSON.parse(response[i].body).name;
								city = locationObject.name;
								if (city != null) {
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