stereomood
	.factory('speech', function() {
	if(!('webkitSpeechRecognition' in window)) return alert('You need a webkit browser')
	var recognition = new webkitSpeechRecognition()
	return recognition
})