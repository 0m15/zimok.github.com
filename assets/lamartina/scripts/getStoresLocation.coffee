storeList = require("../assets/stores")
request = require("superagent")
fs = require("fs")
extend = require('util')._extend

OUT = "storeGeo.json"

#
# google geocode api
#

GEOCODE_API_KEY = "AIzaSyDToCE_kRLo_41eqc4NEk2quNQS5JjG5Dk"
GEOCODE_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?key=#{GEOCODE_API_KEY}"
GEOCODE_URL = "&address="

getUrl = (address) ->
	"#{GEOCODE_BASE_URL}#{GEOCODE_URL}#{address}"

makeRequest = (url) ->
	request.get url
		
getGeodata = (store, done) ->
	url = getUrl "#{store.address} #{store.town}"
	req = makeRequest url
	req.end (res) ->
		data = JSON.parse res.text
		if data.status is "OK"
			geo = getResults data.results[0]
			done geo

getResults = (data) ->
	return {
		lat: data.geometry.location.lat,
		lng: data.geometry.location.lng
	}

getStoresLocation = ->
	storesGeo = []
	for store in storeList
		geo = getGeodata store, (data) ->
			if typeof data is 'object' 
				_store = extend store, {}
				_store.coords = {lat: data.lat, lng: data.lng}
				storesGeo.push _store
				fs.writeFile OUT, JSON.stringify(storesGeo, null, 4), (err) ->
					if err
						console.log 'error'
					else
						console.log "JSON saved"

		

getStoresLocation()

module.exports = getStoresLocation
