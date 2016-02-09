#storeList = require("./store/stores")
#storeList = require("./store/storesEurope")
storeList = require("./store/storesWorld")

request = require("superagent")
fs = require("fs")
JSONStore = require('json-store')
extend = require('util')._extend
#dbWorld = require("./store/storesWorld.json")

requests = []

OUT = "./storeGeoWorld.json"

#
# google geocode api
#

GEOCODE_API_KEY = "AIzaSyDToCE_kRLo_41eqc4NEk2quNQS5JjG5Dk"
GEOCODE_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?key=#{GEOCODE_API_KEY}"
GEOCODE_URL = "&address="


added = 0

getUrl = (address) ->
	"#{GEOCODE_BASE_URL}#{GEOCODE_URL}#{address}"

makeRequest = (url) ->
	request.get url

getGeodata = (store, done, i) ->
	query = "#{store.address} #{store.town}"
	if store.country
		query = "#{query} #{store.country}"
	console.log store
	console.log 'query:', query
	url = getUrl query
	req = makeRequest url
	requests.push req
	req.end (res) ->
		added += 1
		data = JSON.parse res.text
		if data.status is "OK"
			geo = getResults data.results[0]
			done store, geo, i

getResults = (data) ->
	return {
		lat: data.geometry.location.lat,
		lng: data.geometry.location.lng
	}

storesGeo = []

getStoresLocation = ->

	onDone = (store, data, i) ->
		if typeof data is 'object'
			_store = extend store, {}
			_store.coords = {latitude: data.lat, longitude: data.lng}
			storesGeo.push _store
			console.log 'adding', data
			if added >= storeList.length
				# jsonStore = require('store')('./scripts/store')
				# jsonStore.add storesGeo, (err) ->
				# 	if not err then console.log "item saved"
				fs.writeFile OUT, JSON.stringify(storesGeo, null, 4), (err) ->
					if err
						console.log 'error'
					else
						console.log "JSON saved"

	for store, i in storeList
		console.log i
		geo = getGeodata store, onDone, i



getStoresLocation()

module.exports = getStoresLocation
