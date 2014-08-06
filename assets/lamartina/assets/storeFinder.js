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

var MAX_DISTANCE_TRESHOLD = 150

// google maps initialization
var map;
var initialCenter = new google.maps.LatLng(42, 12);

// var styledMapOptions = {};
// var usRoadMapType = new google.maps.StyledMapType(roadAtlasStyles, styledMapOptions);
// $scope.map.mapTypes.set('usroadatlas', usRoadMapType);
// $scope.map.setMapTypeId('usroadatlas');

var mapOptions = {}
var isMobile = $(window).width() <= 600
var GEOCODE_API_KEY = "AIzaSyDToCE_kRLo_41eqc4NEk2quNQS5JjG5Dk";
var GEOCODE_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/jsonp?callback=callback&key=" + GEOCODE_API_KEY;
var GEOCODE_URL = "&address=";

app.controller('StoreFinderCtrl', ['$scope', '$timeout', '$window', '$animate', '$filter', '$http', function($scope, $timeout, $window, $animate, $filter, $http) {
	$scope.stores = $window.storeList
	$scope.storesEurope = $window.storeListEurope
	$scope.storesWorld = $window.storeListWorld

	$scope.markers = []
	$scope.open = false
	$scope.showMap = true
	$scope.showList = false


	$scope.setSource = function(key, source) {
		$scope.currentSource = source
		$scope.currentKey = key
		if(!$scope.$$phase) $scope.$apply()
	}

	$scope.selectGroup = function(group) {
		if(group == 'italy') {
			$scope.currentSource = $scope.storesByRegion	
		} else {
			$scope.currentSource = $scope.storesByCountry
		}
		$scope.sourceListSelected = true
		if(!$scope.$$phase) $scope.$apply()
	}

	// stores
	this.getStoresByKey = function(collection, key) {
		var townList, storesByKey = {}, self=this
		collection.forEach(function(store, idx) {
			if(!storesByKey[store[key]]) {
				storesByKey[store[key]] = {'stores':[], 'selected': undefined}
			}
			storesByKey[store[key]]['stores'].push(store)
		})
		var collectionName = "storesBy" + key.charAt(0).toUpperCase() + key.substr(1).toLowerCase()
		$scope[collectionName] = storesByKey
		if(!$scope.$$phase) $scope.$apply()
	}
	this.getStoresByKey($scope.stores, 'region') // italy
	this.getStoresByKey($scope.stores, 'country') // world
	$scope.currentSource = $scope.storesByRegion
	//this.getStoresByKey($scope.storesEurope, 'country') // europe
	//this.getStoresByKey($scope.storesWorld, 'world') // europe

	$scope.map = {
		control: {},
		markers: [],
		zoom: 4,
		center: {
			latitude: 49,
			longitude: 12
		},
		options: {
			draggable: !isMobile,
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

	//
	// geocoding
	//
	this.getLocation = function(address) {
		this.geocoder.geocode( { 'address': address}, function(results, status) {
			if(status == google.maps.GeocoderStatus.OK) {

				$scope.userLocation = {
					latitude: results[0].geometry.location['k'],
					longitude: results[0].geometry.location['B'],
					address: results[0].formatted_address
				}
				$scope.searchQuery = results[0].formatted_address
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
			latitude: $scope.userLocation.latitude,
			longitude: $scope.userLocation.longitude,
		}
		var nearestStores = []
		angular.forEach($scope.stores, function(store) {
			TRESHOLD = 200
			if(store.coords) {
				var distance = parseInt(getPointsDistance(userLocation, store.coords))
				console.log('distance',distance, store.town)
				if(distance <= TRESHOLD) {
						store.distance = distance
						nearestStores.push(store)
				}

			}
		})

		if(!nearestStores.length) {
			$scope.noResults = true
			return
		}

		var sortedStores = nearestStores.sort(sortByDistance).slice(0,5)

		$scope.deselectTown()
		$scope.currentSource = {
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

	function getDirectionsUrl(store) {
		var startAddress = ""
		if($scope.userLocation) {
			startAddress = $scope.userLocation.address
		}
		var endAddress = store.address + " " + store.town + " " + store.zipCode
		return "https://www.google.com/maps?saddr="+startAddress+"&daddr="+endAddress
	}

	function createInfoBox(marker, data) {
		var content = document.createElement('div')
		var directionsUrl = getDirectionsUrl(data)
		var distanceLabel = '<a href="'+directionsUrl+'" target="_blank">Get directions</a>'

		if($scope.userLocation) {
			directionsUrl = getDirectionsUrl(data)
			distanceLabel = 'About <a href="'+directionsUrl+'" target="_blank">'+ data.distance + ' km</a> from you'
		}
		content.innerHTML = '<h2>'+data.title+'</h2><p>'+data.address+' – '+data.town+'</p><p class="info-box-direction">'+distanceLabel+'</p>'

		var options = {
			content: content,
			boxClass: 'info-box',
			maxWidth: 0,
			pixelOffset: new google.maps.Size(-150, 16),
			infoBoxClearance: new google.maps.Size(1, 1),
		}
		return new InfoBox(options)
	}

	$scope.mapWindows = []
	function toggleInfoBox(marker, data) {
		console.log('toggleInfoBox', marker)
		var ib = createInfoBox(marker, data)
		angular.forEach($scope.mapWindows, function(w) {
			w.close()
		})
		ib.open($scope.map.control.getGMap(), marker)
		$scope.mapWindows.push(ib)
	}


	$scope.addMarker = function(store, id) {
		var marker = {
			id: id,
			title: store.name,
			address: store.address,
			town: store.town,
			zipCode: store.zipCode,
			latitude: store.coords.latitude,
			longitude: store.coords.longitude,
			distance: store.distance
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

	this.addMarkers = function(key, val) {
		angular.forEach($scope.stores, function(store, idx) {
			if(store[key] && store[key].toLowerCase() == val) {
				$scope.addMarker(store, idx)
			}
		})
	}

	this.addMarkers('country', 'italy')
	this.addMarkers('country', 'germania')
	this.addMarkers('country', 'austria')
	this.addMarkers('country', 'francia')
	this.addMarkers('country', 'danimarca')
	this.addMarkers('country', 'inghilterra')
	this.addMarkers('country', 'spagna')
	this.addMarkers('country', 'bulgaria')
	this.addMarkers('country', 'romania')


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



	$scope.deselectTown = function() {
		angular.forEach($scope.currentSource, function(store) {
			store.selected = false
		})
		//$scope.currentSource.selected = false
		if(!$scope.$$phase) $scope.$apply()
	}

	$scope.resetMarkers = function() {
		$scope.map.markers = []
		self.addMarkers('country', 'italy')
	}

	$scope.showAll = function() {
		$scope.resetMarkers()
		$scope.searchQuery = ''
		self.getStoresByKey($scope.stores, 'region') // italy
		self.getStoresByKey($scope.stores, 'country') // world
		$scope.currentSource.selected = undefined
		$scope.sourceListSelected = false	
		angular.forEach($scope.currentSource, function(store) {
			store.selected = undefined
		})
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

		// var stores = $filter('storeFilter')($scope.currentSource, filter)
		//
		// if(!stores.length) return
		//
		// $scope.deselectTown()
		// $scope.currentSource = {
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

	

	$scope.selectTown = function(town) {
		//self.getLocation(town)
		$scope.deselectTown()
		var currentSource = $scope.currentSource[town]
		currentSource.town = town
		currentSource.selected = true
		$scope.currentSource = currentSource
		$scope.map.markers = []
		self.getMarkersFromStoreList(currentSource.stores)
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

	$scope.toggleViewMode = function(viewMode) {
		if(viewMode == 'map') {
			$scope.showMap = true
			$scope.showList = false
			$timeout(function() {
				//self.getLocation($scope.currentSource.town)
				$scope.map.control.refresh($scope.map.options)
			}, 1)
		} else {
			$scope.showMap = false
			$scope.showList = true
		}
	}

	$scope.centerMap = function() {

	}

}])
