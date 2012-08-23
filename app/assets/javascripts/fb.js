function getFriendsList(callback) {
	FB.api('/me/friends', function(response) {
		friendList = response.data;
		callback(friendList);
	});
}

function getFriendsLocations(friendsList, callback) {
	var locations = [];
	var currCount = 0;
	var numFriends = friendList.length;
	for (var i=0; i<numFriends; i++) {
		var friendId = friendList[i].id;
		FB.api('/' + friendId + '?fields=location', function(response) {
			locationObject = response.location;
			if (locationObject) {
				city = response.location.name;
				if (city != null && locations.indexOf(city) == -1) {
					locations.push(city);
				}
			}
			currCount += 1;
			compileFriendsList(locations, currCount, numFriends, callback);
		});
	}
}

function compileFriendsList(locations, currCount, maxFriends, callback) {
	if (currCount == maxFriends) {
		callback(locations);
	}
}

function addMarkersForLocations(locations) {
	console.log('geocoding locations and adding markers...');
	for(var i=0; i<locations.length; i++) {
		codeAddress(locations[i]);
	}
}

function main() {
	document.getElementById("showfriendsbutton").style.visibility = 'hidden';
	document.getElementById("plotting").style.visibility = 'visible';
	
	// get friends list
	// get friends' locations
	console.log('getting friends locations');
	var friendsListLocations = getFriendsList(function(friendsList) {
		getFriendsLocations(friendsList, function(locations) {
			// geocode locations
			// plot on map
			addMarkersForLocations(locations);
			document.getElementById("showfriendsbutton").style.visibility = 'visible';
		})
	});
}