// routes
// ------
var stereomood = angular.module('stereomood', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', { templateUrl: 'templates/playlist.html', controller: 'playlistController' })
      .when('/sing/:songId', {templateUrl: 'templates/sing.html', controller: 'singController' })
      .otherwise({redirectTo: '/' })
  }])