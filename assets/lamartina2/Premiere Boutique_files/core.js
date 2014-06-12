
/*
if (!/android|iphone|ipod|series60|symbian|windows ce|blackberry/i.test(navigator.userAgent)) {
	jQuery(function($) {
		
	});
}
*/


$(document).ready(function() {
	
	
	var isMobile = false
	
	if (/android|iphone|ipad|ipod|series60|symbian|windows ce|blackberry/i.test(navigator.userAgent)) {
		isMobile = true
		$('#main .section').css({'background-attachment':'scroll', 'background-size': 'cover'});
		$('header').css({'margin-top':$(window).height(), 'display': 'block', 'position':'absolute'});
		$('#home').css({'margin-top':'180px'})
		$('a').unbind('hover')
		$('a').unbind('mouseenter')
		$('a').unbind('mouseleave')
		$('.scroll-pane').css({'overflow':'auto'})
		$('.prev').css({'opacity':1})
		$('.next').css({'opacity':1})
	}else{
		isMobile = false
	}
	
  	
	//var isiPad = navigator.userAgent.match(/iPad/i) != null;
	//$('#debug').html(navigator.userAgent)
	
	if(!isMobile){
	var scarto_nav = 160
	}else{
	var scarto_nav = -60
	}
	var altezza_finestra = $(window).height()-scarto_nav
	$(window).resize(function() {
		altezza_finestra = $(window).height()-scarto_nav
		
		$('#main .section').css({'height':$(window).height()-scarto_nav, 'width':$(window).width()});
		
		$('#main #intro').css({'height':$(window).height()});
		
		$('#main #showroom .scroll-pane').css({'width':$(window).width()});
		$('#main #showroom').css({'width':$(window).width()});
		
	});
	
	$(window).trigger('resize')
	
	
	
	// parte il queryloader2
	
	$("body").queryLoader2();
	
	
	
	
	
	
	
	
	// intro section
	
	// pulsante di call to action verso il basso
	if(!isMobile){
	$(".arrow.up").hover(
	  function () {
		  $(window).trigger('resize')
		  $(this).animate({'margin-top': "10px", opacity: 1}, {duration: 200, queue: false, easing: "easeInOutExpo" });
	  },
	  function () {
		  $(this).animate({'margin-top': "0px", opacity: .5}, {duration: 300, queue: false, easing: "easeInOutExpo" });
	  }
	);
	}
	
	
	
	
	
	
	
	
	
	
	
	jQuery.fn.anchorAnimate = function() {

 	
	return this.each(function(){
		var caller = this
		$(caller).click(function (event) {	
			event.preventDefault()
			//var locationHref = window.location.href
			var elementClick = $(caller).attr("href")
			if(!isMobile){
			var offsetClick = $(caller).attr("data-offset")
			}else{
			var offsetClick = 0
			}
			var destination = $(elementClick).offset().top-offsetClick;
			$("html:not(:animated),body:not(:animated)").animate({scrollTop: destination}, {duration:1500, queue: false, easing: 'easeInOutExpo', complete:function() {
				//window.location.hash = elementClick
			}});
		  	return false;
		})
	})
}
	
	
	
	// avvia la navigazione in singola pagina

	/*$('.anchor-link').each(function(){
		$(this).click(function(event){
			var os = $(this).attr('data-offset')
			var dove = $(this).attr('href')
			$(window).scrollTo(dove, 1500, {
				offset: -os,
				onAfter: function(){
				}
			})
			event.preventDefault()
		})
		
		//.anchorAnimate()
	})
	*/
	
	
$('.anchor-link').anchorAnimate()

	
	
	// gestione parallassi
	
	// dichiaro i selettori come variabili
	
	var $window = $(window);
	var $intro = $('#intro');
	var $introhl = $('#intro .pay-off');
	var $home = $('#home');
	var $trans0 = $('#trans-0');
	var $transx = $('#trans-x');
	var $transy = $('#trans-y');
	var $vision = $('#vision');
	var $trans1 = $('#trans-1');
	var $showroom = $('#showroom');
	var $trans2 = $('#trans-2');
	var $brands = $('#brands');
	var $trans3 = $('#trans-3');
	var $events = $('#events');
	var $trans4 = $('#trans-4');
	var $contact = $('#contact');
	
	var windowHeight = $window.height();
	
	// aggiungo la classe "inview" se è nella viewport
	
	$('#intro, #intro .pay-off, #home, #trans-0, #vision, #trans-1, #showroom, #trans-2, #brands, #trans-3, #events, #trans-4, #contact').bind('inview', function (event, visible) {
		if (visible == true) {
			$(this).addClass("inview");
		} else {
			$(this).removeClass("inview");
		}
	});
	
	//function that is called for every pixel the user scrolls. Determines the position of the background
	/*arguments: 
		x = horizontal position of background
		windowHeight = height of the viewport
		pos = position of the scrollbar
		adjuster = adjust the position of the background
		inertia = how fast the background moves in relation to scrolling
	*/
	function newPos(x, windowHeight, pos, adjuster, inertia){
		return x + "% " + (-((windowHeight + pos) - adjuster) * inertia)  + "px";
	}
	
	// funzione chiamata sullo scroll e il resize
	
	
	function Move(){ 
		
		
		
		
		
		
		scarto = scarto_nav
		
		var pos = $window.scrollTop(); // posizione dello scrollbar
		curClass = 'current'

		if($intro.hasClass("inview")){
			$('body').find('.'+curClass).removeClass(curClass);
		}
		
		
		
		if($introhl.hasClass("inview")){
			$('header').fadeOut()
		}else{
			$('header').fadeIn()
		}
		
		
		/*if(
		!$home.hasClass("inview") &&
		!$trans0.hasClass("inview") &&
		!$vision.hasClass("inview") &&
		!$trans1.hasClass("inview") &&
		!$showroom.hasClass("inview") &&
		!$trans2.hasClass("inview") &&
		!$brands.hasClass("inview") &&
		!$trans3.hasClass("inview") &&
		!$events.hasClass("inview") &&
		!$trans4.hasClass("inview") &&
		!$contact.hasClass("inview")
		){
			$('header').fadeOut()
		}else{
			$('header').fadeIn()
		}*/
		
		
		
		
		if($home.hasClass("inview")){
			$home.css({'backgroundPosition': newPos(50, windowHeight, pos, (altezza_finestra+scarto+450)*2, 0.3)}); 
			$('nav ul li').removeClass(curClass);
      		$('#home-link').parent().addClass('current');
		}
		if($trans0.hasClass("inview")){
			$trans0.css({'backgroundPosition': newPos(50, windowHeight, pos, (altezza_finestra-600)*2, 0.3)}); 
		}
		if($vision.hasClass("inview")){
			$vision.css({'backgroundPosition': newPos(50, windowHeight, pos, (altezza_finestra+scarto+450)*3, 0.2)}); 
			$('nav ul li').removeClass(curClass);
      		$('#vision-link').parent().addClass('current');
		}
		if($trans1.hasClass("inview")){
			$trans1.css({'backgroundPosition': newPos(50, windowHeight, pos, (altezza_finestra+scarto+450)*4, 0.3)});
		}
		if($transx.hasClass("inview")){
			$transx.css({'backgroundPosition': newPos(50, windowHeight, pos, (altezza_finestra+scarto+450)*4, 0.3)});
		}
		if($transy.hasClass("inview")){
			$transy.css({'backgroundPosition': newPos(50, windowHeight, pos, (altezza_finestra+scarto+450)*4, 0.3)});
		}
		if($showroom.hasClass("inview")){
			$showroom.css({'backgroundPosition': newPos(50, windowHeight, pos, (altezza_finestra+scarto+450)*5, 0.3)}); 
			$('nav ul li').removeClass(curClass);
      		$('#showroom-link').parent().addClass('current');
		}
		if($trans2.hasClass("inview")){
			$trans2.css({'backgroundPosition': newPos(50, windowHeight, pos, (altezza_finestra+scarto+450)*6, 0.3)});
		}
		if($brands.hasClass("inview")){
			$brands.css({'backgroundPosition': newPos(50, windowHeight, pos, (altezza_finestra+scarto)*7, 0.3)});
			$('nav ul li').removeClass(curClass);
      		$('#brands-link').parent().addClass('current');
		}
		if($trans3.hasClass("inview")){
			$trans3.css({'backgroundPosition': newPos(50, windowHeight, pos, (altezza_finestra+scarto)*8, 0.3)});
		}
		if($events.hasClass("inview")){
			$events.css({'backgroundPosition': newPos(50, windowHeight, pos, (altezza_finestra+scarto-50)*9, 0.3)}); 
			$('nav ul li').removeClass(curClass);
      		$('#events-link').parent().addClass('current');
		}
		if($trans4.hasClass("inview")){
			$trans4.css({'backgroundPosition': newPos(50, windowHeight, pos, (altezza_finestra+scarto-50)*10, 0.3)});
		}
		if($contact.hasClass("inview")){
			$('nav ul li').removeClass(curClass);
      		$('#contact-link').parent().addClass('current');
		}
		
		
		
	}
	
	if(!isMobile){
		
	$(window).resize(function() {
		Move(); 
	});		
	
	$(window).scroll(function() {
		Move();
	});
	
	$(window).trigger('scroll')
	
	}
	
	
	
	
	
	
	
	
	
	
	
	
	var scrollPane = $( ".scroll-pane" ),
			scrollContent = $( ".scroll-content" );
		
		var scrollbar = $( ".scroll-bar" ).slider({
			animate: true,
			stop: function (event, ui) {
                    scrollContent.animate({'margin-left' : Math.round(
						ui.value / 100 * ( scrollPane.width() - scrollContent.width() )
					) + "px"}, {duration: 1500, queue: false, easing: "easeInOutExpo" });
                },
				create: function(){
					$(window).trigger('resize')
					$('body').css({'overflow-x':'hidden'})
				}
		});
	
	
		var handleHelper = scrollbar.find( ".ui-slider-handle" )
		.mousedown(function() {
			scrollbar.width( handleHelper.width() );
			scrollContent.stop()
		})
		.mouseup(function() {
			scrollbar.width( "100%" );
		})
		.append( "<span class='ui-icon ui-icon-grip-dotted-vertical'></span>" )
		.wrap( "<div class='ui-handle-helper-parent'></div>" ).parent();
		
		if(!isMobile){
		scrollPane.css( "overflow", "hidden" );
		}
		function sizeScrollbar() {
			var remainder = scrollContent.width() - scrollPane.width();
			var proportion = remainder / scrollContent.width();
			//var handleSize = scrollPane.width() - ( proportion * scrollPane.width() );
			var handleSize = 960 - ( proportion * 960 );
			scrollbar.find( ".ui-slider-handle" ).css({
				width: handleSize,
				"margin-left": -handleSize / 2
			});
			handleHelper.width( "" ).width( scrollbar.width() - handleSize );
		}
		
		function resetValue() {
			var remainder = scrollPane.width() - scrollContent.width();
			var leftVal = scrollContent.css( "margin-left" ) === "auto" ? 0 :
				parseInt( scrollContent.css( "margin-left" ) );
			var percentage = Math.round( leftVal / remainder * 100 );
			scrollbar.slider( "value", percentage );
		}
		
		function reflowContent() {
				var showing = scrollContent.width() + parseInt( scrollContent.css( "margin-left" ), 10 );
				var gap = scrollPane.width() - showing;
				if ( gap > 0 ) {
					scrollContent.css( "margin-left", parseInt( scrollContent.css( "margin-left" ), 10 ) + gap );
				}
		}
		
		$( window ).resize(function() {
			resetValue();
			sizeScrollbar();
			reflowContent();
		});
		setTimeout( sizeScrollbar, 10 );
		
		
		var conto = 0
		
		function sposta_griglia(quanto){
			conto = quanto
			scrollbar.slider("value", 25*conto)
			scrollContent.animate({'margin-left' : Math.round(
						scrollbar.slider("value") / 100 * ( scrollPane.width() - scrollContent.width() )
					) + "px"}, {duration: 1500, queue: false, easing: "easeInOutExpo" });
			
		}
		
		sposta_griglia(1)
		
		
		
		$('.scroll-content-item-cell .desc').css({opacity:0})
		
		
		
		
		function initRollover(selector, pixeffect) {
			$(selector).each(function() {
			
				var elem = $('a', this); 
				var newimg = new Image();
			
				newimg.onload = function() {
					$(newimg).pixastic(pixeffect, {amount:0.5});
				}
		
				var span = $(document.createElement("span")).append(newimg).addClass('js-desaturate')
				newimg.src = elem.find('img').attr('src');
				elem.append(span);
			
			
				elem.hover(function () {
			
					$('.desc',this).stop().animate({'opacity' : 1},{duration:200, queue: false});
					$('span',this).stop().animate({'opacity' : 0},{duration:200, queue: false});
			  
				}, function () {
			
					$('.desc',this).stop().animate({'opacity' : 0},{duration:500, queue: false});
					$('span',this).stop().animate({'opacity' : 1},{duration:500, queue: false});
			  
				});
		
			});
		}
		
		if(!isMobile){
			initRollover('.scroll-content-item-cell', 'desaturate');
			
			$(".call-to-action.left, .call-to-action.right").hover(
			  function () {
				  $(this).stop().animate({'width':'115px', opacity: 1}, {duration: 200, queue: false, easing: "easeInOutExpo" });
			  },
			  function () {
				  $(this).stop().animate({'width':'125px', opacity: .8}, {duration: 300, queue: false, easing: "easeInOutExpo" });
			  }
			);
		}
		
		
		$(".call-to-action.left").click(function(){
			if(conto>0){
					conto--
			}else {
					conto=4
			}
			sposta_griglia(conto)
		})
		
		$(".call-to-action.right").click(function(){
			if(conto<4){
					conto++
			}else {
					conto=0
			}
			sposta_griglia(conto)
		})
		
		 
		
			
			$('.seasons a').click(function(e){
				
				$filtro = $(this).parent().attr('data-filter')
				$season = $(this).attr('title')
				
				$('.scroll-content-item-cell[class!='+ $season +']').stop().animate({opacity: .3}, {duration: 1000, queue: false })
				$('.scroll-content-item-cell.' + $season + '').stop().animate({opacity: 1}, {duration: 1000, queue: false });
				
				
				e.preventDefault()
			})
			
		
		
		
		
		
		
		
		
		
		
		
			if(!isMobile){
			$('.slides .mdiv').hover(function () {
			
					$('.desc',this).stop().animate({'opacity' : 1},{duration:200, queue: false});
					$('span',this).stop().animate({'opacity' : 0},{duration:200, queue: false});
			  
				}, function () {
			
					$('.desc',this).stop().animate({'opacity' : 0},{duration:500, queue: false});
					$('span',this).stop().animate({'opacity' : 1},{duration:500, queue: false});
			  
				});
		
		
			
			$(".prev").hover(
			  function () {
				  $(this).stop().animate({'margin-left':'-10', opacity: 1}, {duration: 100, queue: false, easing: "easeInOutExpo" });
			  },
			  function () {
				  $(this).stop().animate({'margin-left':'-0', opacity: .8}, {duration: 200, queue: false, easing: "easeInOutExpo" });
			  }
			);
		
		$(".next").hover(
			  function () {
				  $(this).stop().animate({'margin-left':'350px', opacity: 1}, {duration: 100, queue: false, easing: "easeInOutExpo" });
			  },
			  function () {
				  $(this).stop().animate({'margin-left':'340px', opacity: .8}, {duration: 200, queue: false, easing: "easeInOutExpo" });
			  }
			);
		
		
		
		$("#brands .loghi ul li a img").hover(
		  function () {
			  $(this).stop().animate({opacity: 0}, {duration: 200, queue: false });
		  },
		  function () {
			  $(this).stop().animate({opacity: 1}, {duration: 300, queue: false });
		  }
		);
		
		}
		
		
		$('.slides').slides({
				generatePagination: false,
				generateNextPrev: true
			});
		
		
		
		
		
		
		

	
	
	
	
	// google map in contact
	
	var inizializzata = false
	
	function initialize() {
			
			inizializzata = true
		
            // Center of the map
            var latlng = new google.maps.LatLng(44.6464, 10.9250);
            // Map options
            var myOptions = {
			    zoom        : 15,
				center      : latlng,
				mapTypeId   : google.maps.MapTypeId.ROADMAP,
				scrollwheel : false,
				panControl: false,
				zoomControl: true,
				zoomControlOptions: {
					position: google.maps.ControlPosition.LEFT_BOTTOM,
					style: google.maps.ZoomControlStyle.SMALL
				},
				mapTypeControl: false,
				scaleControl: false,
				streetViewControl: false,
				overviewMapControl: false

            };
            // Initialise the map
            var map = new google.maps.Map(document.getElementById("gmap"), myOptions);

            // Markers
            var aMarkers = new Array(
                ["Premiere Boutique", 44.6464, 10.9250, "<strong>Premiere Boutique</strong><br /><br />Corso Duomo, 29<br />41100 Modena<br />T. 059 439 9977"]
            );
            createMarker(aMarkers[0]);

            function createMarker(mrkr) {
                var img = '/assets/img/map-marker.png';

                // Create the bubble pop up
                var infowindow = new google.maps.InfoWindow({
                        content     : mrkr[3],
                        maxWidth    : 150
                });
                // Add the marker
                var marker = new google.maps.Marker({
                        position    : new google.maps.LatLng(mrkr[1], mrkr[2]),
                        title       : mrkr[0],
                        icon        : img,
                        animation   : google.maps.Animation.DROP
                });
                marker.setMap(map);
                // Add event listener for this marker
                google.maps.event.addListener(marker, 'click', function() {
                        //infowindow.open(map,marker);
                });
            }
        }

        initialize();
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	var	my_jPlayer = $("#jquery_jplayer");

	// Some options
	var	opt_play_first = true, // If true, will attempt to auto-play the default track on page loads. No effect on mobile devices, like iOS.
		opt_auto_play = true; // Text when not playing

	// A flag to capture the first track
	var first_track = true;

	var tracks = ['malafemmena_'] //,'the_man_i_love_','Nin_e_Peccato','Arrivederci_Roma','Buonasera_signorina','Mambo_Italiano','Singing_In_The_Rain','Thats_Amore'

	// Instance jPlayer
	my_jPlayer.jPlayer({
		ready: function () {
			$(this).jPlayer("setMedia", { 
			  	mp3: "/assets/audio/malafemmena_.mp3"
			})//.jPlayer("play"); // l'autoplay viene dalla fine del query loader
			$(this).jPlayer("volume", 0.75);
			
			if(isMobile){		
				var click = document.ontouchstart === undefined ? 'click' : 'touchstart';
				var kickoff = function () {
					$("#jquery_jplayer").jPlayer("play");
					document.documentElement.removeEventListener(click, kickoff, true);
				};
				document.documentElement.addEventListener(click, kickoff, true);
			}
	
			
		},
		ended: function() { 	
			$(this).jPlayer("setMedia", { 
				  mp3: "/assets/audio/malafemmena_.mp3"
				})
			$(this).jPlayer("play"); 
			$(this).jPlayer("volume", 0.75);
		  },
		swfPath: "/assets/js/jplayer",
		cssSelectorAncestor: "#jp_container",
		supplied: "mp3",
		wmode: "window"
	});

	

	
	
	
});