var app = angular.module("app");

app.controller('GalleryCtrl', ['$scope', '$timeout', '$window', '$animate', '$filter', '$http', function($scope, $timeout, $window, $animate, $filter, $http) {

  $scope.active = false
  $scope.currentPicture = null

  $scope.open = function(id) {
    if($scope.currentPicture) {
      return $scope.close()
    }
    $scope.currentPicture = {
      'src': 'assets/gallery/'+id
    }
    $('body').addClass('gallery-open')
    if(!$scope.$$phase) $scope.$apply()
  }

  $scope.close = function() {
    $scope.currentPicture=null
    $('body').removeClass('gallery-open')
    window.scrollTo(0,$('#gallery').offset().top - 260)
  }

}])
