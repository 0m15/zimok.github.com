var app = angular.module("app", ['google-maps']);

app.filter('storeFilter', function() {
	return function(items, filter) {
		var results = []
		angular.forEach(items, function(region, props) {
			//angular.forEach(props)
		})

		return items
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
			mapTypeControlOptions: { mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'usroadatlas'] }
		}

	};

	var self = this

	// this.initializeMap = function() {
	// 	$scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	//   var styledMapOptions = {};
	//   var usRoadMapType = new google.maps.StyledMapType(roadAtlasStyles, styledMapOptions);
	//   $scope.map.mapTypes.set('usroadatlas', usRoadMapType);
	//   $scope.map.setMapTypeId('usroadatlas');
	//   google.maps.event.addDomListener(window, 'load', this.initializeMap);
	// }
	// this.initializeMap()

	// $scope.addMarker = function(store) {
	// 	var coords = new google.maps.LatLng(store.coords.lat, store.coords.lng)
	// 	var marker = new google.maps.Marker({
	// 		position: coords,
	// 		map: this.map,
	// 		title: store.name + " - " + store.address
	// 	})
	// 	$scope.markers.push(marker)
	// }

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

	// this.addMarkers = function() {
	// 	angular.forEach($scope.stores, function(store, idx) {
	// 		if(idx == 0) {
	// 			store.coords = {lat: 42.12, lng: 12.23}
	// 			$scope.addMarker(store)
	// 		}
	// 	})
	// }
	// this.addMarkers()

	$scope.deselectTown = function() {
		angular.forEach($scope.storesByTown, function(store) {
			store.selected = false
		})
		$scope.currentTown = null
		if(!$scope.$$phase) $scope.$apply()
	}

	$scope.showAll = function() {
		angular.forEach($scope.storesByTown, function(store) {
			store.selected = undefined
		})
		$scope.currentTown = null
		if(!$scope.$$phase) $scope.$apply()
	}

	$scope.selectTown = function(town) {
		$scope.deselectTown()
		var currentTown = $scope.storesByTown[town]
		currentTown.town = town
		currentTown.selected = true
		$scope.currentTown = currentTown
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
