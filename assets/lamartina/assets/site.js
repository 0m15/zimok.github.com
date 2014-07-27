jQuery.fn.anchorAnimate = function() {
	$window = $(window)
	$body = $('body')
	return this.each(function(){
		var caller = this
		$(caller).click(function (event) {
			event.preventDefault()
			var elementClick = $(caller).attr("href")
			if(elementClick.indexOf('#') < 0) elementClick = '#' + elementClick
			var destination = $(elementClick).offset().top

			// down
			if(!$body.hasClass('with-fixed-navbar')) {
				destination -= 118

				// if(elementClick == '#section-1') {
				// 	destination -= (150 - 118)
				// }
			}



			$("html:not(:animated),body:not(:animated)").animate({
				scrollTop: destination
			}, {
				duration:2000,
				queue: false,
				complete:function() {}
			});
	  	return false;
		})
	})
}

// RequestAnimationFrame polyfill for older browsers
var rafPolyfill = function() {
  var lastTime, vendors, x;
  lastTime = 0;
  vendors = ["webkit", "moz"];
  x = 0;
  while (x < vendors.length && !window.requestAnimationFrame) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
    ++x;
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime, id, timeToCall;
      currTime = new Date().getTime();
      timeToCall = Math.max(0, 16 - (currTime - lastTime));
      id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
};

$(document).ready(function(){
	rafPolyfill();

	// Cache the Window object
	var $window = $(window);
	var $body = $('body')
  var isScrolling = false, _currentTimer = null
  var isMobile = $window.width() <= 600
	var ticking = false

	function initAnimateAnchor() {
		if(isMobile) return
		// animate anchors
		$('[data-anchor]').anchorAnimate()
	}
	initAnimateAnchor()

	function bindWindowResize() {
    $window.on('resize', function() {
    	resizeVideo()
    })
	}
	bindWindowResize()

  // resize slides accordingly to height
	function Backstretch(elements) {
		var width = window.innerWidth
		var height = window.innerHeight - $('.navbar').height() + 60
		var elementsLength = elements.length
		var i = 0
		var currentImg = null
		var currentRatio
		var _currentTimer
		var imgWidth
		var _this = this
		this.elements = elements

		window.addEventListener('resize', resize)
		resize()

		function resize() {
			for(; i < elementsLength; i++) {
				var el = _this.elements[i]
				if(height <= 700) {
					el.style['minHeight'] = height + 'px'
				} else {
					el.style['minHeight'] = 800 + 'px'

				}
			}
		}
	}

	// resize elements
	function initBackstretch() {
		new Backstretch(document.querySelectorAll('.px'))
	}
	initBackstretch()

	// video controls
	var player = null
	$('.video').on('click', function() {
		player = this
		if(player.paused) {
			player.volume = 0.8
			player.play()
		} else {
			player.pause()
		}
	})

	// adapt video
	function resizeVideo() {
		var currentImg = $('#media').find('video')[0]
		var width = $window.width() - 200
		var height = $window.height() - 400
		var hRatio = 16 / 9
		var vRatio = 9 / 16
		var imgWidth = height * hRatio

		currentImg.width = imgWidth
		currentImg.height = height

		if(currentImg.width >= width) {
			currentImg.style['margin-left'] = -1 * (currentImg.width - width) / 2 + 'px'
		} else {
			currentImg.width = width
			currentImg.height = currentImg.width * vRatio
		}
	}
	resizeVideo()

  $(window).on('scroll', function() {
 		onScroll()
 	})

	// This will limit the calculation of the background position to
  // 60fps as well as blocking it from running multiple times at once
  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(parallax);
      ticking = true;
    }
  };

 	function timer() {
 		if(_currentTimer) clearTimeout(_currentTimer)
 		_currentTimer = setTimeout(onScroll, 10)
 	}

 	function onScroll() {
 		if(isMobile) return
 		//if(!isScrolling) return timer()
 		//isScrolling = false
 		requestTick()
		//parallax()
		//timer()
 	}
 	onScroll()

 	// scroll parallax
 	var INITIAL_Y = 120
 	var currentIndex = 0
 	var i = 0
 	var $menuItems = $('.navbar-nav').find('li a')

 	function initBackgroundTranslation() {
 		if(isMobile) return
   	$('section[data-type="background"]').each(function(){
   		translateBg($(this), INITIAL_Y)
   	})
 	}
 	initBackgroundTranslation()

 	function translateBg($el, y) {
  	var coords = '50% '+ y + 'px';
		$el.css({ backgroundPosition: coords });
  }

  var player = $('.video')[0]
  var currentVolume = player.volume
  var step = 0.025

  function fadeOutVolume(done) {

  	function _fade() {
  		var newLevel = player.volume - step
	  	if(newLevel <= 0) {
	  		player.volume = 0
	  		done && done()
	  		return
	  	}
  		setTimeout(function() {
  			player.volume = newLevel
  			_fade()
  		}, 100)
  	}
  	_fade()
  }

  function parallax() {

	  var origCurrentY
	  var i = 0

	  // apply opacity to navbar
	  if(!isMobile) {
			var $navbar = $('.navbar')
			var $media = $('#media')
	  	mapOpacity($navbar[0], $window.scrollTop())

		  if($window.scrollTop() - 250 >= $media.height()) {
		  	$navbar.addClass('navbar-fixed-top')
		  	$body.addClass('with-navbar-fixed')
		  } else {
		  	$navbar.removeClass('navbar-fixed-top')
		  	$body.removeClass('with-navbar-fixed')
		  }
		}

		// pause video
		if($window.scrollTop() >= $('.video').height() + $('.video').scrollTop()) {
			fadeOutVolume(function() {
				player.pause()
			})
		}

	  function mapOpacity(el, scrollY) {
			var elOffset = $(el).offset()
			var treshold = $(window).height()
			var offsetYDiff = 0
			var opacity = 0

			if(scrollY + treshold >= elOffset.top) {
				offsetYDiff = elOffset.top - scrollY
				opacity = 100 - (offsetYDiff / treshold) * 100
			} else if (scrollY + treshold <= elOffset.top) {
				offsetYDiff = elOffset.top - scrollY
				opacity = (offsetYDiff / treshold) * 100
			}

			el.style.opacity = opacity / 100

		}

		$('section').each(function() {
			var $el = $(this)
			// add active class to menu item
	    if($window.scrollTop() + 200 >= $el.offset().top &&
	    	 $window.scrollTop() <= $el.offset().top + $el.height()) {
				var $menuItem = $('.navbar-nav').find('a[href="#'+$el.attr('id')+'"]')
				if($menuItem.length) {
					$menuItems.removeClass('active')
					$menuItem.addClass('active')
				}
			}
		})

  	$('section[data-type="background"]').each(function(){

	    var $el = $(this); // assigning the object
	    var isScrolling = false, _currentTimer = null
	    var yPos
	    var adjust = $el.data("adjust")

	    currentIndex = $el.index() - 1

	    function getY($el) {
	    	var str = $el.css('backgroundPosition')
	    	var group = str.match(/(\d+)px/g)
	    	if(!group) return 0
				console.log('y:',parseInt(group[0]))
	    	return parseInt(group[0])
	    }

	    //$el.addClass('moving')

	    var relativeScroll = $window.scrollTop() - (i * $el.height()) - $('.video').height()
	    var speed = $el.data('speed')
	    origCurrentY = getY($el)

	    if(adjust) adjust = 0

    	_y = Math.floor(relativeScroll / speed) * -1
    	if(origCurrentY >= 0) {
    		yPos = _y + INITIAL_Y
    	} else {
    		yPos = _y
    	}
			console.log(yPos)
    	translateBg($el, yPos)
			i++
		})
		ticking = false

	}


	// thumbnails enlarge/shrink handler
	// function enlarge(current) {
	// 	var url = current.attr('href')
	// 	var enlarged = document.createElement('div')
	// 	enlarged.innerHTML = '<img src="'+url+'">'
	// 	$(enlarged).addClass('picture-large')
	// 		.addClass('on')
	// 		.addClass('px')
	// 	initBackstretch()
	// 	current.data('enlarged', 'true')
	// 	current.append(enlarged)
	// 	$('body').addClass('gallery-open')
	// }
	//
	// function shrink(current) {
	// 	$('.picture-large').remove()
	// 	current.data('enlarged', 'false')
	// 	$('body').removeClass('gallery-open')
	// }
	//
	// $('#gallery .thumb a').click(function(e) {
	//
	// 	var $current = $(this)
	// 	var isEnlarged = $current.data('enlarged')
	//
	// 	console.log('href', $current.attr('href'))
	// 	console.log('isEnlarged', isEnlarged)
	//
	// 	isEnlarged == 'true'
	// 		? shrink($current)
	// 		: enlarge($current)
	//
	// 	e.preventDefault()
	// 	e.stopPropagation()
	// })

	// $('#gallery .thumb a').click(function(e) {
	// 	var $current = $(this)
	// 	var url = $current.attr('href')
	// 	var enlarged = document.createElement('div')
	// 	enlarged.className = 'picture-large'
	// 	enlarged.innerHTML = '<img src="'+url+'">'
	// 	$current.append(enlarged)
	// 	e.preventDefault()
	// })
});
