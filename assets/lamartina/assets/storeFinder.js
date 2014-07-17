var app = angular.module("app", ['google-maps']);

app.filter('storeFilter', function() {
	return function(items, filter) {
		if(!filter) return items
		var results = []
		var propsToMatch = ['town', 'address', 'name', 'region', 'zipCode']
		var regex = new RegExp(filter.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), "gi")
		angular.forEach(items, function(region, props) {

			angular.forEach(region.stores, function(store) {

				angular.forEach(propsToMatch, function(prop) {
					if(regex.test(store[prop])) {
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

var mapOptions =

app.controller('StoreFinderCtrl', ['$scope', '$window', '$animate', function($scope, $window, $animate) {
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
		}

	};

	var self = this

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

	$scope.addMarker = function(store, id) {
		var marker = {
			id: id,
			title: store.name,
			"latitude": store.coords.lat,
			"longitude": store.coords.lng,
		}
		$scope.map.markers.push(marker)
	}

	this.addMarkers = function() {
		angular.forEach($scope.stores, function(store, idx) {
			$scope.addMarker(store, idx)
		})
	}
	this.addMarkers()

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
		angular.forEach(currentTown.stores, function(store, idx) {
			$scope.addMarker(store, idx)
		})
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
