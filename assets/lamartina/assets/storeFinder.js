var app = angular.module("app", ['google-maps']);

app.filter('storeFilter', function() {
	return function(items, filter) {
		if(!filter) return items
		filter=filter.toLowerCase()
		var results = []
		var propsToMatch = ['town', 'region', 'zipCode']
		var regex = new RegExp("\b("+filter.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ")\b", "gi")
		angular.forEach(items, function(region, props) {

			angular.forEach(region.stores, function(store) {

				angular.forEach(propsToMatch, function(prop) {
					if(String(store[prop]).toLowerCase().indexOf(filter) > -1) {
						if(results.indexOf(store) < 0) results.push(store)
					}
				})

			})

		})

		return results
	}

})

// google maps initialization
var map;
var initialCenter = new google.maps.LatLng(42, 12);

// var styledMapOptions = {};
// var usRoadMapType = new google.maps.StyledMapType(roadAtlasStyles, styledMapOptions);
// $scope.map.mapTypes.set('usroadatlas', usRoadMapType);
// $scope.map.setMapTypeId('usroadatlas');

var mapOptions = {}

var GEOCODE_API_KEY = "AIzaSyDToCE_kRLo_41eqc4NEk2quNQS5JjG5Dk";
var GEOCODE_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/jsonp?callback=callback&key=" + GEOCODE_API_KEY;
var GEOCODE_URL = "&address=";

app.controller('StoreFinderCtrl', ['$scope', '$window', '$animate', '$filter', '$http', function($scope, $window, $animate, $filter, $http) {
	$scope.stores = $window.storeList
	$scope.markers = []
	$scope.open = false
	$scope.map = {
		control: {},
		markers: [],
		zoom: 5,
		center: {
			latitude: 42,
			longitude: 12
		},
		options: {
			draggable: true,
			scrollwheel: false,
			styles: roadAtlasStyles,
			navigationControl: false,
			panControl: false,
			streetViewControl: false,
			mapTypeControl: false,
			scaleControl: true,
			zoomControlOptions: { style: google.maps.ZoomControlStyle.SMALL },
			mapTypeControlOptions: { mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'usroadatlas'] },
			mapTypeId: google.maps.MapTypeId.TERRAIN
		},
		infoWindow: {
      options: {
				pixelOffset: new google.maps.Size(-140, 0),
        boxClass: 'info-box',
				closeBoxMargin: "2px 2px 2px 2px",
				closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"

      },
      show: true
    }

	};

	var self = this
	this.geocoder = new google.maps.Geocoder()

	// geocoding
	this.getLocation = function(address) {
		this.geocoder.geocode( { 'address': address + ' italy'}, function(results, status) {
			if(status == google.maps.GeocoderStatus.OK) {
				$scope.userLocation = results[0].geometry.location
				//self.fitToPoints([{latitude:$scope.userLocation['k'],longitude:$scope.userLocation['B']}])
				self.getNearestStores(address, 10)
			} else {
				$scope.userLocation = false
			}
		})
	}

	this.getNearestStores = function(address, limit) {
		limit||(limit=5)
		if(!$scope.userLocation) return
		var distances = {}
		var userLocation = {
			latitude: $scope.userLocation['k'],
			longitude: $scope.userLocation['B']
		}
		angular.forEach($scope.stores, function(store) {
			if(store.coords) {
				store.distance = parseInt(getPointsDistance(userLocation, store.coords))
			}
		})

		var sortedStores = $scope.stores.sort(sortByDistance).slice(0,5)

		$scope.deselectTown()
		$scope.currentTown = {
			town: address,
			region: address,
			name: address,
			stores: sortedStores,
			selected: true
		}
		$scope.map.markers = []
		self.getMarkersFromStoreList(sortedStores)
		self.fitToPoints($scope.map.markers)

		if(!$scope.$$phase) $scope.$apply()
		console.log(sortedStores)
	}

	function createInfoBox(marker, data) {
		console.log('createInfoBox', marker)
		var content = document.createElement('div')
		content.innerHTML = '<h2>'+data.title+'</h2><p>'+data.address+' – '+data.town+'</p>'

		var options = {
			content: content,
			boxClass: 'info-box',
			maxWidth: 0,
			pixelOffset: new google.maps.Size(-140, 0),
			infoBoxClearance: new google.maps.Size(1, 1),
		}
		return new InfoBox(options)
	}

	function toggleInfoBox(marker, data) {
		console.log('toggleInfoBox', marker)
		var ib = createInfoBox(marker, data)
		ib.open($scope.map.control.getGMap(), marker)
	}


	$scope.addMarker = function(store, id) {
		var marker = {
			id: id,
			title: store.name,
			address: store.address,
			town: store.town,
			"latitude": store.coords.latitude,
			"longitude": store.coords.longitude,
		}
		marker.onClicked = function() {
			console.log("click")

			var _marker = new google.maps.Marker({
				map: $scope.map.control.getGMap(),
				draggable: false,
				position: new google.maps.LatLng(marker.latitude, marker.longitude),
				visible: false
			})
			toggleInfoBox(_marker, marker)
		}
		$scope.map.markers.push(marker)
	}

	this.addMarkers = function() {
		angular.forEach($scope.stores, function(store, idx) {
			$scope.addMarker(store, idx)
		})
	}
	this.addMarkers()

	function sortByDistance(a, b) {
		return a.distance-b.distance
	}


	function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

	function getPointsDistance(point1, point2) {
		var lat1 = point1.latitude
		var lng1 = point1.longitude
		var lat2 = point2.latitude
		var lng2 = point2.longitude

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lng2-lng1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d.toFixed(3);
	}

	// stores
	this.getStoresByTown = function() {
		var townList, storesByTown = {}, self=this
		$scope.stores.forEach(function(store, idx) {
			if(!storesByTown[store.region]) {
				storesByTown[store.region] = {'stores':[], 'selected': undefined}
			}
			storesByTown[store.region]['stores'].push(store)
		})
		$scope.storesByTown = storesByTown

		if(!$scope.$$phase) $scope.$apply()
	}
	this.getStoresByTown()



	$scope.deselectTown = function() {
		angular.forEach($scope.storesByTown, function(store) {
			store.selected = false
		})
		$scope.currentTown = null
		if(!$scope.$$phase) $scope.$apply()
	}

	$scope.resetMarkers = function() {
		$scope.map.markers = []
		self.addMarkers()
	}

	$scope.showAll = function() {
		$scope.resetMarkers()
		angular.forEach($scope.storesByTown, function(store) {
			store.selected = undefined
		})
		$scope.currentTown = null
		self.fitToPoints($scope.map.markers)
		if(!$scope.$$phase) $scope.$apply()
	}

	$scope.$watch('searchQuery', function(newValue, oldValue) {
		if(newValue === oldValue) return
		if(!newValue.length) {
			$scope.showAll()
			return
		}
		if(newValue.length < 2) return

		var filter = newValue
		self.getLocation(filter)

		// var stores = $filter('storeFilter')($scope.storesByTown, filter)
		//
		// if(!stores.length) return
		//
		// $scope.deselectTown()
		// $scope.currentTown = {
		// 	town: filter,
		// 	region: filter,
		// 	name: filter,
		// 	stores: stores,
		// 	selected: true
		// }
		// $scope.map.markers = []
		// self.getMarkersFromStoreList(stores)
		// self.fitToPoints($scope.map.markers)

	})

	this.getMarkersFromStoreList = function(storeList) {
		angular.forEach(storeList, function(store, idx) {
			$scope.addMarker(store, idx)
		})
	}

	$scope.filterStores = function() {

	}

	this.fitToPoints = function(points) {
		var pointsArray = []
		var bounds = new google.maps.LatLngBounds()
		angular.forEach(points, function(point) {
			pointsArray.push(new google.maps.LatLng(point.latitude, point.longitude))
		})
		angular.forEach(pointsArray, function(point) {
			bounds.extend(point)
		})
		$scope.map.control.getGMap().fitBounds(bounds)
	}

	$scope.selectTown = function(town) {
		$scope.deselectTown()
		var currentTown = $scope.storesByTown[town]
		currentTown.town = town
		currentTown.selected = true
		$scope.currentTown = currentTown
		$scope.map.markers = []
		self.getMarkersFromStoreList(currentTown.stores)
		self.fitToPoints($scope.map.markers)
		if(!$scope.$$phase) $scope.$apply()
	}

	$scope.toggle = function() {
		var open = $scope.open
		$scope.open = !open
	}

	$scope.filterStores = function(items) {
		var results = []
		angular.forEach(items, function(val, key) {

		})
	}

	$scope.centerMap = function() {

	}

}])
