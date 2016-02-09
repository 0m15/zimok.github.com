stereomood
  .controller('playlistController', ['$scope', '$rootScope', '$http', '$routeParams', 'audio', 
    function($scope, $rootScope, $http, $routeParams, audio) {

  console.log('+ audio', audio, $rootScope)

  // $scope members
  // --------------
  $rootScope.mood = $routeParams.mood
  $rootScope.playing = false
  $rootScope.currentTrack = null

  // keyboard map
  var keyboard = {
    'enter':    13,
    'spacebar': 32,
    'left':     91,
    'right':    37,
  }

  var keyboardEvents = {
    'enter':     'play',
    'spacebar':  'togglePlay',
    'right':     'nextTrack',
    'left':      'previousTrack'
  }

  // listen to keyboard events
  // -------------------------
  $rootScope.$on('keyboard', function(e, args) {
    var keyCode = e.keyCode||e.which, ev 
    angular.forEach(keyboard, function(name, code) {
      //if(keyboard[keyCode] == keyCode) $scope[keyboardEvents[code]].call()
    })
  })

  // retrieve json data
  // ------------------
  //$http.get('/mood/' + encodeURIComponent($scope.mood) + '/playlist.json').success(function(data) {
  $http.get('/api/playlist.json').success(function(data) { // local test
    $rootScope.playlist = data
    $rootScope.tracks = data['trackList']
    $rootScope.tracksLength = $rootScope.tracks.length
    audio.setQueue($rootScope.tracks)
  })

}])
