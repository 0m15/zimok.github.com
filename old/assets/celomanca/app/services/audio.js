// audio service
// -------------
stereomood
  .factory('audio', ['$rootScope', '$routeParams', function($rootScope, $routeParams) {
  var audio = new AudioService($rootScope, $routeParams)
  return audio
}])

var AudioService = function(rootScope) {
  
  this.source = undefined
  this.queue = null
  this.cursor = 0
  this.hasPlayQueue = false
  this.queuedTrack = null
  this.soundManagerReady = (soundManager && soundManager.enabled)
  this.rootScope = rootScope
  this.volumeLevel = 90
  this.playing = false

  soundManager.setup({
    url: 'components/soundmanager/swf/',
    flashVersion: 9, // optional: shiny features (default = 8)
    useFlashBlock: false, // optionally, enable when you're ready to dive in
    onready: angular.bind(this, this.onready)
  })
}

AudioService.prototype = {
  
  // called on soundManager ready state
  onready: function() {
    this.soundManagerReady = true
    if(this.hasPlayQueue) this.play()
    this.hasPlayQueue = false
  },
  
  // create and return a soundObject instance
  createSound: function(track) {
    this.track = track
    var _this = this
    var rootScope = this.rootScope
    var sound = soundManager.createSound({
      id: track.identifier,
      url: track.location,
      autoPlay: false,
      volume: 60,
      ondataerror: function() {
        _this.nextTrack()
      },
      onload: function(state) {
        if(state == 0) {
          _this.sound.destruct()
          _this.nextTrack()
          //_this.source.splice(_this.getIndex(track), 1)
          _this.cursor -= 1
          return
        }
        track.loaded = 100
      },
      onfinish: function() {
        track.playing = false
        rootScope.$broadcast('Audio.pause', track)
      },
      onpause: function() {
        track.playing = false
        rootScope.$broadcast('Audio.pause', track)
      },
      onresume: function() {
        track.playing = true
        rootScope.$broadcast('Audio.play', track)
      },
      onplay: function() {
        track.playing = true
        rootScope.$broadcast('Audio.play', track)
      },
      whileplaying: function() {
        console.log('whileplaying')
        track.cursor = (this.position / this.durationEstimate) * 100
        if(!rootScope.$$phase) rootScope.$apply(track.loaded)
      },
      whileloading: function() {
        track.loaded = (this.bytesLoaded / this.bytesTotal) * 100
        if(!rootScope.$$phase) rootScope.$apply(track.loaded)
      }
    })

    return sound
  },

  setQueue: function(queue) {
    if(this.playing && angular.equals(this.source.join(), queue.join())) {
      return
    }
    this.queue = queue
  },

  setPlaying: function(track) {
    angular.forEach(this.source, function(track) {
      track.playing = false
    })
    track.playing = true 
    this.rootScope.$broadcast('Audio.playing', track)
  },

  getPlaying: function() {
    var _track = {}
    _track.playing = false
    if(!this.sound) return _track
    angular.forEach(this.source, function(track) {
      if(track.playing) _track = track
    })
    return _track
  },

  play: function(track) {
    console.log('+ audioService#play', track, this.soundManagerReady)
    track||(track = this.queuedTrack)||(track = this.queue[0]) 
    this.source = this.queue
    this.setPlaying(track)
    
    // check if soundmanager is ready
    if(!this.soundManagerReady) {
      this.hasPlayQueue = true
      this.queuedTrack = track
      track.playing = true
      return
    }

    // pause any playing sound
    if(this.sound) this.sound.pause()
    this.sound = this.createSound(track).play()
    this.cursor = this.getIndex(track)
  },

  getIndex: function(track) {
    return this.source.indexOf(track)
  },

  togglePlay: function() {
    if(!this.sound) return this.play()
    this.sound.togglePause()
  },

  nextTrack: function() {
    if(!this.sound) return this.play(this.source[0])
    this.cursor + 1 > this.source.length
      ? this.cursor = 0
      : this.cursor += 1
    this.play(this.source[this.cursor])
  },

  previousTrack: function() {
    this.cursor - 1 < 0
      ? this.cursor = this.source.length - 1
      : this.cursor -= 1
    this.play(this.source[this.cursor]) 
  },

}