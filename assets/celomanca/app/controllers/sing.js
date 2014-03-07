stereomood
	.controller('singController', ['$scope', '$rootScope', '$http', 'audio', 'speech',
		function($scope, $rootScope, $http, audio, speech) {

	var partial = []
	var k = 0

	$scope.started = false
	$scope.result = false
	$scope.working = false
	$scope.singing = false
	$scope.interim_transcript = ''
	$scope.final_transcript = []
	$scope.timestamps = []
	$scope.lang = 'it-IT'
	$scope.finished = false
	$scope.lyricsOpen = false
	$scope.raw = ''
	$scope.editing = false

	console.log('$scope.started', $scope.started)

	$http.get('/api/playlist.json').success(function(data) { // local test
    $rootScope.playlist = data
    $rootScope.tracks = data['trackList']
    $rootScope.tracksLength = $rootScope.tracks.length
    
    speech.lang = $scope.lang
    speech.continuous = true
    speech.interimResults = true

    audio.setQueue($rootScope.tracks)
    audio.play()
    speech.start()
  })

	$scope.$on('Audio.playing', function(e, track) {
   	$scope.currentTrack = track
   	$scope.playing = true
   	$scope.finished = false
   	if(!$scope.$$phase) $scope.$apply()
	 })

	$scope.$on('Audio.pause', function(e, track) {
		$scope.playing = false
		$scope.finished = true
		speech.stop()
   	if(!$scope.$$phase) $scope.$apply()
	})

	// play a track
	// ------------
	 $scope.play = function(track) {
	   audio.play(track)
	 }

  // return the current playing track
  $scope.getPlaying = function() {
    return audio.getPlaying()
  }

  speech.onstart = function(event) {
  	$scope.started = true
  	if(!$scope.$$phase) $scope.$apply()
	}

  speech.onresult = function(event) {
  	console.log('onresult', event)

  	var interim_transcript = '';
    var word = {}

    if (typeof(event.results) == 'undefined') {
    	console.log('got undefined')
      speech.onend = null
      speech.stop()
      return
    }

    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        word.body = event.results[i][0].transcript
        word.confidence = event.results[i][0].confidence
        $scope.final_transcript.push(word)
        $scope.raw += word.body
        if(!$scope.$$phase) $scope.$apply()
      } else {
        interim_transcript += event.results[i][0].transcript;
        if(!$scope.$$phase) $scope.$apply()
      }
    }
    $scope.interim_transcript = interim_transcript
  }

  speech.onsoundstart = function(event) {
		console.log('soundstart', event)
		$scope.working = true
	}

	speech.onaudiostart = function(event) {
		console.log('audiostart', event)
	}

	speech.onsoundend = function(event) {
		console.log('soundend', event)
	}

	speech.onend = function(event) {
		console.log('end', event)
	}

	speech.onnomatch = function(event) {
		console.log('nomatch', event)
	}

	speech.onerror = function(event) {
		console.log('!error', event)
	}

	speech.onspeechstart = function(event) {
		console.log('speechstart', event)
		$scope.singing = true
	}

	speech.onspeechend = function(event) {
		console.log('speechend',event)
	}

 //  // toggle play/pause
  $scope.togglePlay = function() {
    audio.togglePlay()
  }

 //  // play next track in playlist
  $scope.nextTrack = function() {
    audio.nextTrack()
  }

 //  // play previous track in playlist
  $scope.previousTrack = function() {
    audio.previousTrack()
  }

  $scope.showLyrics = function() {
  	$scope.lyricsOpen = true
  }

  $scope.edit = function() {
  	$scope.editing = !$scope.editing
  }

  // fake track like
  // $scope.like = function(track) {
  //   track.liked = !track.liked
  //   return false
  // }

}])
