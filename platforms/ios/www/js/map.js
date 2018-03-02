$('.modal').modal();
var webGoogleMapsApiKey = 'AIzaSyDHdMrY3yjUtVvytPa4yflrdxm-YKlz0js';
var map = null;
var editable = false;
var enableGps = true;
var floor = '10F';
var allFloor = ['1F', '10F'];
var endId = 0;
// 0 normal mode
// 1 route mode
// 2 navigation mode
var Modeswitch = 0;
var mapCenter =
{
	lat: 25.000511,
	lng: 121.488588
};
var here =
{
	lat: 24.996242,
	lng: 121.462915
	// lat: 25.000533,
	// lng: 121.488931
};
// {
// 	lat: 24.997429,
// 	lng: 121.486732
// };
var askeyDoor =
{
	lat: 25.000766,
	lng: 121.488141
}
var bounds =
[
	{"lat": 25.000968, "lng": 121.488995},
	{"lat": 25.000180, "lng": 121.488150}
];

var pnts = [];
var originalPnts = {};
function removeAllMarkers() {
	if(outerHereMarker) {
		outerHereMarker.remove();
		outerHereMarker = null;
	}
	if(destinationMarker) {
		destinationMarker.remove();
		destinationMarker = null;
	}
	if(oldOutdoorPolyline) {
		oldOutdoorPolyline.remove();
		oldOutdoorPolyline = null;
	}
	if(oldEstLabel) {
		oldEstLabel.remove();
		oldEstLabel = null;
	}
	if(oldPlacesMarker) {
		oldPlacesMarker.remove();
		oldPlacesMarker = null;
	}
	if(searchPlaceMarker) {
		searchPlaceMarker.remove();
		searchPlaceMarker = null;
	}
	if(indoorRoute) {
		indoorRoute.remove();
		indoorRoute = null;
	}
}

var hereMarker;
var outerHereMarker;
var destinationMarker;
document.addEventListener("deviceready", function() {
	initMap();
	document.addEventListener("backbutton", function(e) {
		if(map!=null) {
			map.clear();
			map.remove();
		}
		if(navigator.app) {
	 		navigator.app.exitApp();
	 	} else if(navigator.device) {
	 		navigator.device.exitApp();
	 	} else {
	 		window.close();
	 	}
	}, false);	
}, false);

function isContained(bounds, point) {
	var latLngBounds  = new plugin.google.maps.LatLngBounds(bounds);
	return latLngBounds.contains(point);
};

var bindCameraMove = true;
var bindClick = true;
function initMap(center) {
	if (center==undefined) {
		center = mapCenter;
	};
	var mapOption =
	{
		camera:
		{
			target:
			{
				lat: center.lat,
				lng: center.lng
			},
			zoom: 20
		},
		controls:
		{
			myLocationButton: false
		},
		styles: [{
			featureType: 'poi.business',
			elementType: 'labels',
			stylers: [{
				visibility: 'off'
			}]
		}]
	};
	if (enableGps) {
		mapOption.controls =
		{
			myLocation: true
		}
	}
	map = plugin.google.maps.Map.getMap(document.getElementById('map'), mapOption);
	map.one(plugin.google.maps.event.MAP_READY, function() {
		map.setOptions(
			{
				controls:
				{
					myLocationButton: false
				}
			}
		);
		if (!editable) getLocation();
		getNodesJson(floor, function() {
			map.on(plugin.google.maps.event.MAP_CLICK, onMapClick);
			map.on(plugin.google.maps.event.MAP_LONG_CLICK, function(latLng) {
				if (Modeswitch>0) return;
				removeAllMarkers();
				map.addMarker({
					position: latLng,
					title: latLng.lat+', '+latLng.lng,
					snippet: ''
				}, function(marker) {
					destinationMarker = marker;
				})
				var place =
				{
					text:
					{
						latLng: latLng
					}
				};
				$('#modal-placeInfo')
					.data('place', place)
					.children('.routeList').hide()
					.end()
					.find('.title').text(latLng.lat+', '+latLng.lng)
					.end()
					.find('.icon').html('<img src="https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png" class="right circle">')
					.end()
					.find('.address').text('')
					.end()
					.modal('open');
			});
			map.on(plugin.google.maps.event.POI_CLICK, function(placeId, name, latLng) {
				if (Modeswitch>0) {
					if ($('#modal-placeInfo').is(':hidden')) {
						$('#modal-placeInfo').modal('open');
					} else {
						$('#modal-placeInfo').modal('close');
					}
					return;
				}
				$('#searchBar>input').blur();
				$('#searchBar').show();
				removeAllMarkers();
				map.addMarker({
					position: latLng,
					title: name
				}, function(marker) {
					oldPlacesMarker = marker;
					marker.showInfoWindow();
					var placeInfo =
					{
						text:
						{
							latLng: latLng,
							title: name,
							// snippet: ''
						},
						// image: ''
					};
					$('#modal-placeInfo')
						.data('place', placeInfo)
						.children('.routeList').hide()
						.end()
						.find('.title').text(placeInfo.text.title)
						.end()
						.find('.icon').html('')
						.end()
						.find('.address').text('')
						.end()
						.modal('open');
				});
			});
			map.on(plugin.google.maps.event.CAMERA_MOVE_START, onCameraEvents);
			map.on(plugin.google.maps.event.CAMERA_MOVE, onCameraEvents);
			map.on(plugin.google.maps.event.CAMERA_MOVE_END, onCameraEvents);
			updateOverlay(floor);
		})
	});
	var options = {
		frequency: 1000
	};
}
function onMapClick() {
	if (!bindClick) {
		$('#searchBar>input').blur();
	}
	if (Modeswitch==0) {
		if ($('#searchBar').is(':hidden')) {
			$('#searchBar').show();
		} else {
			$('#searchBar').hide();
		}
	}
	if ($('#modal-placeInfo').data('place')) {
		if ($('#modal-placeInfo').is(':hidden')) {
			$('#modal-placeInfo').modal('open');
		} else {
			$('#modal-placeInfo').modal('close');
		}
	}
}

var oldGroundOverlay;
function updateOverlay(floor) {
	if (oldGroundOverlay) {
		oldGroundOverlay.remove();
		oldGroundOverlay = null;
	};
	map.addGroundOverlay({
		url: 'images/askeyIndoor-'+floor+'.png',
		bounds: bounds,
		opacity: 1,
		zIndex: 0,
		clickable: true
	}, function(groundOverlay) {
		oldGroundOverlay = groundOverlay;
		groundOverlay.on(plugin.google.maps.event.GROUND_OVERLAY_CLICK, function(event) {
			onMapClick();
			if (editable) {
				map.addMarker({
					position: {
						lat: event.lat,
						lng: event.lng
					},
					title: event.lat+', '+event.lng,
					snippet: '',
					draggable: true
				}, function(marker) {
					nodeMarkers.push(marker);
					bindCameraMove = true;
				})
			}
		});
		if (editable) {
			editMode();
		} else {
			drawIndoorNodeMarkers();
			clearTimeout(getLocationTimeout);
			getLocation();
			drawAllRoute();
		}
	});
}
var changeOverlay = false;
$('#floorBox').on('click', 'a',function() {
	var clickFloor = $(this).attr('floor');
	// if (floor==clickFloor) return;
	$(this).addClass('active').siblings().removeClass('active');
	drawFloor = clickFloor;
	if (Modeswitch>0) {
		changeOverlay = true;
	}
	updateOverlay(drawFloor);
})
for (var i = 0, active; i < allFloor.length; i++) {
	if (allFloor[i]==floor) {
		active = ' active'; 
	} else {
		active = '';
	}
	$('#floorBox').prepend(
		'<a class="waves-effect waves-light btn'+active+'" floor="'+allFloor[i]+'">'+allFloor[i]+'</a>'
	);
}
$('#floorBox').css('top', 'calc(50% - '+allFloor.length*$('#floorBox>a').outerHeight()/2+'px)');

function getNodesJson(floorName, callback) {
	for (var i = 0; i < allFloor.length; i++) {
		$.ajax({
			url: 'js/'+allFloor[i]+'.json',
			type: 'get',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false
		})
		.done(function(nodes) {
			originalPnts[allFloor[i]] = nodes;
		});
	}
	callback();
}
function onCameraEvents(cameraPosition) {
	// console.log(cameraPosition.target.lat);
	// console.log(cameraPosition.target.lng);
	// console.log(cameraPosition.zoom);
	// console.log(cameraPosition.tilt);
	// console.log(cameraPosition.bearing);
	// console.log(cameraPosition);
	if (!bindCameraMove) return;
	var isContainedAskey = isContained(bounds, {lat: cameraPosition.target.lat, lng: cameraPosition.target.lng});
	if (isContainedAskey) {
		if ($('#floorBox').is(':hidden')) {
			$('#floorBox').show();
		}
	} else {
		if ($('#floorBox').is(':visible')) {
			$('#floorBox').hide();
		}
	}
	if (isContainedAskey) {
		if (cameraPosition.zoom<19) {
			map.setOptions(
				{
					styles:
					[{
						featureType: 'poi.business',
						elementType: 'labels',
						stylers: [{
							visibility: 'on'
						}]
					}]
				}
			);
		} else {
			map.setOptions(
				{
					styles:
					[{
						featureType: 'poi.business',
						elementType: 'labels',
						stylers: [{
							visibility: 'off'
						}]
					}]
				}
			);
		}
	} else {
		map.setOptions(
			{
				styles:
				[{
					featureType: 'poi.business',
					elementType: 'labels',
					stylers: [{
						visibility: 'on'
					}]
				}]
			}
		);
	}
}
function onMarkerEvents(markerPosition) {
	console.log(markerPosition);
}
function drawHereMarker() {
	if (hereMarker) {
		hereMarker.showInfoWindow();
	} else {
		map.addMarker({
			position: {
				lat: here.lat,
				lng: here.lng,
			},
			title: 'GO',
			snippet: ''
		}, function(marker) {
			hereMarker = marker;
			hereMarker.showInfoWindow();
		})
	}
	if (indoorRoute) {
		indoorRoute.remove();
	}
}

// 0 indoor
// 1 outdoor
// 2 indoor to outdoor
// 3 outdoor to indoor
var routeMode = 0;
function drawAllRoute() {
	var place = $('#modal-placeInfo').data('place');
	if (place) {
		var isStartIndoor = isContained(bounds, here);
		var isEndIndoor = isContained(bounds, place.text.latLng);
		if (isStartIndoor && isEndIndoor) {
			routeMode = 0;
			drawnIndoorNavigationPath(endId);
		} else {
			if (!isStartIndoor && !isEndIndoor) {
				routeMode = 1;
				if (oldOutdoorPolyline) {
					oldOutdoorPolyline.remove();
					oldOutdoorPolyline = null;
				}
				drawnNavigationPath(here ,place.text.latLng, false);
			} else {
				if (isStartIndoor) {
					routeMode = 2;
					endId = 0;
					if (changeOverlay) {
						drawnIndoorNavigationPath(endId);
					} else {
						drawnIndoorNavigationPath(endId, function() {
							if (!oldOutdoorPolyline) {
								drawnNavigationPath(askeyDoor, place.text.latLng, false);
							}
						});
					}
				}
				if (isEndIndoor) {
					routeMode = 3;
					if (changeOverlay) {
						drawnIndoorNavigationPath(0);
					} else {
						drawnNavigationPath(here, askeyDoor, false, function() {
							if (allFloor[0]==drawFloor) {
								drawnIndoorNavigationPath(endId);
							} else {
								drawFloor = allFloor[0];
								var firstFloor = originalPnts[allFloor[0]];
								var firstFloorEndId = firstFloor[firstFloor.length-1].id;
								endId = firstFloorEndId;
								drawnIndoorNavigationPath(0);
							}
						});
					}
				}
			}
		}
	}
}
var getLocationTimeout = null;
var oldHere;
var routeArr = [];
function getLocation() {
	if (!enableGps) {
		drawHereMarker();
		return;
	}
	map.getMyLocation(
		function(location) {
			here = location.latLng;
			console.log(here);
			if (!oldHere) oldHere = here;
			if (oldHere.lat!=here.lat || oldHere.lng!=here.lng) {
				oldHere = here;
				if (Modeswitch==2) {
					if (routeArr.length<1) {
						var indoorRouteArr = indoorRoute.getPoints().getArray();
						var outdoorRouteArr = oldOutdoorPolyline.getPoints().getArray();
						for (var i = 0; i < indoorRouteArr.length; i++) {
							delete indoorRouteArr[i].id;
						}
						for (var i = 0; i < outdoorRouteArr.length; i++) {
							delete outdoorRouteArr[i].id;
						}
						routeArr = indoorRouteArr;
						routeArr.concat(outdoorRouteArr);
					}
					var isContainedRoute = plugin.google.maps.geometry.poly.isLocationOnEdge(here, routeArr);
					console.log(isContainedRoute);
					if (!isContainedRoute) {
						drawAllRoute();
					}
				}
			}
		},
		function(error) {
			console.log(error);
		}
	);
	getLocationTimeout =
	setTimeout(function() {
		getLocation();
	}, 5000)
}

function drawnIndoorNavigationPath(endId, callback) {
	pnts = JSON.parse(JSON.stringify(originalPnts[drawFloor]));
	var start = pnts[pnts.length-1];
	var end = pnts[endId] || pnts[0];
	switch (routeMode) {
		case 0:
		case 2:
			if (drawFloor!=floor) {
				indoorNavigation(String(start.id), String(end.id), '', callback);
			} else {
				pnts.push(
					{
						label: 'GO',
						id: pnts.length,
						lat: here.lat,
						lng: here.lng,
						proxpnt: [],
						walkable: false
					}
				);
				start = pnts[pnts.length-1];
				addpnt(start, pnts[findNearMarker(here, end)]);
				indoorNavigation(String(start.id), String(end.id), '', callback);
			}
			break;
		case 3:
			if (drawFloor!=floor) {
				indoorNavigation(String(end.id), String(start.id), '', callback);
			} else {
				start = pnts[$('#modal-placeInfo').data('place').id];
				indoorNavigation(String(end.id), String(start.id), '', callback);
			}
			break;
	}
}

var oldOutdoorPolyline;
var oldEstLabel;
function drawnNavigationPath(start, end, animation, callback) {
	$.ajax({
		url: 'https://maps.googleapis.com/maps/api/directions/json?origin='+start.lat+','+start.lng+'&destination='+end.lat+','+end.lng+'&mode=walking&key='+webGoogleMapsApiKey
	}).done(function(response) {
		var route = new Array(start);
		var legs = response.routes[0].legs[0];
		var routeList = $('#modal-placeInfo>.routeList');

		if (routeMode==1 || routeMode==3) routeList.empty();
		for (var s = 0, points, step, distanceTxt; s < legs.steps.length; s++) {
			step = legs.steps[s];
			points = plugin.google.maps.geometry.encoding.decodePath(step.polyline.points);
			for (var l = 0; l < points.length; l++) {
				route.push({lat: points[l].lat, lng: points[l].lng});
			}
			if (s<legs.steps.length-1) {
				distanceTxt = step.distance.text;
			} else {
				distanceTxt = '';
			}
			routeList.append('<li lat="'+step.start_location.lat+'" lng="'+step.start_location.lng+'" distance="'+distanceTxt+'">'+step.html_instructions+'</li>');
		}
		if (callback) callback();

		//Draw Polyline
		if (oldOutdoorPolyline) oldOutdoorPolyline.remove();
		map.addPolyline({
			'points': route,
			'color': '#3CABDA',
			'width': 10,
			'geodesic': true
		},
		function(polyline) {
			oldOutdoorPolyline = polyline;
			var halfPonit = route[Math.round(route.length/2)];
			if (oldEstLabel) {
				oldEstLabel.setPosition(halfPonit);
				oldEstLabel.setTitle(legs.duration.text);
				oldEstLabel.setSnippet(legs.distance.text)
				oldEstLabel.showInfoWindow();
			} else {
				map.addMarker({
					position: halfPonit,
					title: legs.duration.text,
					snippet: legs.distance.text,
					opacity: 0.00001,
				}, function(marker) {
					oldEstLabel = marker;
					oldEstLabel.showInfoWindow();
				});
			}
			if (animation) {
				map.animateCamera({
					target: [here, end],
					// zoom: 17,
					// tilt: 60,
					// bearing: 140,
					duration: 500,
					padding: 0 // default = 20px
				}, function() {
				});
			}
		});
	});
}

var oldPlacesMarker;
function drawnPlaces(point) {
	$.ajax({
		url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+point.lat+','+point.lng+'&radius=5&key='+webGoogleMapsApiKey
	}).done(function(response) {
		if (response.status!='OK') return;
		var places = response.results;
		var placesArr = [];
		if (oldPlacesMarker) {
			for (var i = 0; i < oldPlacesMarker.length; i++) {
				oldPlacesMarker[i].remove();
			}
		}
		for (var i = 0; i < places.length; i++) {
			if (places[i].types.indexOf('colloquial_area')<0) {
				placesArr.push(
					{
						position: places[i].geometry.location,
						title: places[i].name,
						snippet: places[i].vicinity,
						zIndex: i,
						// image: places[i].icon,
						iconData: places[i].icon,
					}
				);
			}
		}
		// Add markers
		if (placesArr.length>0) {
			var baseArrayClass = new plugin.google.maps.BaseArrayClass(placesArr);
			baseArrayClass.map(function(options, cb) {
				// The variable "options" contains each element of the data.
				//
				// The variable "cb" is a callback function of interation.
				map.addMarker(options, cb);
			}, function(markers) {
				console.log(markers);
				oldPlacesMarker = markers;
				markers[markers.length - 1].showInfoWindow();
				map.animateCamera({
					target: markers[markers.length - 1].getPosition(),
					// zoom: 17,
					// tilt: 60,
					// bearing: 140,
					duration: 500,
					padding: 0 // default = 20px
				}, function() {
				});
				for (var i = 0; i < markers.length; i++) {
					markers[i].on(plugin.google.maps.event.MARKER_CLICK,showMarkInfo);
					markers[i].on(plugin.google.maps.event.INFO_CLICK,showMarkInfo)
				}
			});
		} else {
			if (destinationMarker) {
				destinationMarker.setPosition(point);
				destinationMarker.showInfoWindow();
				map.animateCamera({
					target: point,
					// zoom: 17,
					// tilt: 60,
					// bearing: 140,
					duration: 500,
					padding: 0 // default = 20px
				}, function() {
				});
			} else {
				map.addMarker({
					position: {
						lat: point.lat,
						lng: point.lng,
					},
					title: point.lat+', '+point.lng,
					snippet: ''
				}, function(marker) {
					destinationMarker = marker;
					// destinationMarker.showInfoWindow();
					map.animateCamera({
						target: point,
						// zoom: 17,
						// tilt: 60,
						// bearing: 140,
						duration: 500,
						padding: 0 // default = 20px
					}, function() {
					});
					marker.off(plugin.google.maps.event.MARKER_CLICK);
					marker.on(plugin.google.maps.event.MARKER_CLICK, function(event) {
						var place =
						{
							text:
							{
								latLng:
								{
									lat: event.lat,
									lng: event.lng
								}
							}
						};
						console.log(place);
						$('#modal-placeInfo')
							.data('place', place)
							.find('.title').text(event.lat+', '+event.lng)
							.end()
							.find('.icon').html('<img src="https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png" class="right circle">')
							.end()
							.find('.address').text('')
							.end()
							.modal('open');
					});
				})
			}
		}
	});
}

function showMarkInfo(event) {
	$('#searchBar').hide();
	var placeInfo =
	{
		text:
		{
			latLng:
			{
				lat: event.lat,
				lng: event.lng
			},
			title: this.getTitle(),
			snippet: this.getSnippet()
		},
		image: this.get('iconData')
	};
	$('#modal-placeInfo')
		.data('place', placeInfo)
		.find('.title').text(placeInfo.text.title)
		.end()
		.find('.icon').html('<img src="'+placeInfo.image+'" class="right circle">')
		.end()
		.find('.address').text(placeInfo.text.snippet)
		.end()
		.modal('open');

}

// search places input
var searchPlaceMarker;
$('#searchBar>input').focus(function() {
	var cameraPosition = map.getCameraPosition();
	var searchInput = $(this);
	$.ajax({
		url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+cameraPosition.target.lat+','+cameraPosition.target.lng+'&radius=100&key='+webGoogleMapsApiKey
	}).done(function(response) {
		if (response.status!='OK') return;
		var places = response.results;
		var placesObj = {};
		console.log(places);
		for (var i = 0; i < places.length; i++) {
			placesObj[places[i].name] =
			{
				id: i,
				text:
				{
					title: places[i].name,
					snippet: places[i].vicinity,
					latLng:
					{
						lat: places[i].geometry.location.lat,
						lng: places[i].geometry.location.lng
					}
				},
				image: places[i].icon
			}
		}
		searchInput.autocomplete({
			data: placesObj,
			// limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
			onAutocomplete: function(place) {
				// Callback function when value is autcompleted.
				removeAllMarkers();
				if (searchPlaceMarker) {
					searchPlaceMarker.setPosition(place.text.latLng);
					searchPlaceMarker.setTitle(place.text.title);
					searchPlaceMarker.setSnippet(place.text.snippet);
				} else {
					map.addMarker({
						position: place.text.latLng,
						title: place.text.title,
						snippet: place.text.snippet
					}, function(marker) {
						searchPlaceMarker = marker;
						searchPlaceMarker.on(plugin.google.maps.event.MARKER_CLICK, function(event) {
							var place = $('#modal-placeInfo').data('place');
							$('#modal-placeInfo')
								.find('.title').text(place.text.title)
								.end()
								.find('.icon').html('<img src="'+place.image+'" class="right circle">')
								.end()
								.find('.address').text(place.text.snippet)
								.end()
								.modal('open');
						});
					})
				}
				map.animateCamera({
					target: place.text.latLng,
					// zoom: 17,
					// tilt: 60,
					// bearing: 140,
					duration: 500,
					padding: 0 // default = 20px
				}, function() {
					$('#modal-placeInfo')
						.data('place', place)
						.find('.title').text(place.text.title)
						.end()
						.find('.icon').html('<img src="'+place.image+'" class="right circle">')
						.end()
						.find('.address').text(place.text.snippet)
						.end()
						.modal('open');
				});
			},
			// minLength: 2, // The minimum length of the input for the autocomplete to start. Default: 1.
		});
		setTimeout(function() {
			$('#searchBar>ul').focus();
		}, 500)
	});
})
$('#modal-placeInfo .btn-route').click(function() {
	Modeswitch = 1;
	$('#searchBar').hide();
	$('#modal-placeInfo .routeFrame').hide();
	$('#modal-placeInfo .cancelFrame').show();
	$('#modal-placeInfo>.upIcon').show();
	drawAllRoute();
});
$('#modal-placeInfo>.modal-content, #modal-placeInfo>.upIcon').click(function() {
	if (Modeswitch==0) return;
	if ($('#modal-placeInfo').hasClass('showInfo')) {
		$('#modal-placeInfo').removeClass('showInfo');
		$('#modal-placeInfo').children('.routeList').hide();
	} else {
		$('#modal-placeInfo').addClass('showInfo');
		$('#modal-placeInfo').children('.routeList').show();
		$('#modal-placeInfo>.routeList').scrollTop(0);
	}
});
var watchCompassID = null;
$('#modal-placeInfo .btn-navigation').click(function() {
	if (Modeswitch!=1) {
		drawAllRoute();
	}
	Modeswitch = 2;
	bindClick = false;
	$('#searchBar').hide();
	$('#modal-placeInfo .startFrame, #modal-placeInfo .routeFrame, #modal-placeInfo .cancelFrame').hide();
	$('#modal-placeInfo>.upIcon').show();
	map.setOptions(
		{
			controls:
			{
				myLocationButton: true
			}
		}
	);
	if (watchCompassID==null) {
		$('#modal-placeInfo').modal('close');
		watchCompassID = navigator.compass.watchHeading(onCompassWatch, onCompassError, {frequency: 100});
		function onCompassWatch(heading) {
			map.setCameraBearing(heading.magneticHeading);
		};
		function onCompassError(compassError) {
			console.log('Compass error: ' + compassError.code);
		};
		map.animateCamera({
			target: here,
			zoom: 21,
			tilt: 67.5,
			// bearing: 140,
			duration: 500,
			padding: 0 // default = 20px
		}, function() {
			$('#directionBar>.content')
				.html($('#modal-placeInfo>.routeList>li:first-child').text())
				.parent()
				.show();
			$('#cancelNavigation').show();
		});
	}
});
$('#searchBar>.btn-clear').click(function() {
	removeAllMarkers();
	$('#searchBar>input').val('').focus();
});
$('#cancelNavigation, #modal-placeInfo .btn-cancel').click(function() {
	bindClick = true;
	if ($(this).hasClass('btn-cancel')) {
		Modeswitch = 0;
		removeAllMarkers();
		$('#modal-placeInfo>.upIcon').hide();
		$('#searchBar').show();
		$('#modal-placeInfo')
			.removeData('place')
			.removeClass('showInfo')
			.children('.routeList').hide().empty()
			.end()
			.modal('close');
	} else {
		routeArr = [];
		Modeswitch = 1;
		navigator.compass.clearWatch(watchCompassID);
		watchCompassID = null;
		map.setOptions(
			{
				controls:
				{
					myLocationButton: false
				}
			}
		);
		map.animateCamera({
			target: here,
			zoom: 19,
			tilt: 0,
			bearing: 0,
			duration: 500,
			// padding: 0 // default = 20px
		}, function() {
			$('#cancelNavigation, #modal-placeInfo .routeFrame').hide();
			$('#modal-placeInfo .cancelFrame').show();
			$('#modal-placeInfo')
				.modal('open');
		});
	}
	$('#directionBar').hide();
	setTimeout(function() {
		$('#modal-placeInfo .cancelFrame').hide();
		$('#modal-placeInfo .routeFrame, #modal-placeInfo .startFrame').show();
	}, 500)
});
$('#modal-placeInfo>.routeList').on('click', 'li', function() {
	var li = $(this);
	var latLng =
	{
		lat: li.attr('lat'),
		lng: li.attr('lng')
	};
	$('#modal-placeInfo').modal('close');
	map.animateCamera({
		target: latLng,
		zoom: 19,
		tilt: 0,
		bearing: 0,
		duration: 500,
		// padding: 0 // default = 20px
	}, function() {
		$('#directionBar')
			.show()
			.children('.content')
			.html(li.text());
	});
})
$('#directionBar').click(function() {
	$(this).hide();
})

var markersArr = [];
var removeCount = 0;
function placeMarker(map, location) {
	var marker = new google.maps.Marker({
		position: location,
		map: map
	});
	var infowindow = new google.maps.InfoWindow({
		content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
	});
	infowindow.open(map, marker);
	google.maps.event.addListener(marker, 'click', function(event) {
		for (var i = 0; i < markersArr.length; i++) {
			if (JSON.parse(JSON.stringify(event.latLng)).lat == markersArr[i].lat && JSON.parse(JSON.stringify(event.latLng)).lng == markersArr[i].lng) {
				markersArr.splice(i, 1);
				removeCount = 1;
				break;
			}
		}
		marker.remove();
	});
	markersArr.push({
		label: String((markersArr.length-1 >= 0) ? markersArr.length+removeCount : 0),
		id: (markersArr.length - 1 >= 0) ? markersArr.length+removeCount : 0,
		lat: location.lat(),
		lng: location.lng(),
		proxpnt: [],
		walkable: false
	});
	console.log(markersArr);
	removeCount = 0;
}


function pointInCircle(point, radius, center) {
	return (plugin.google.maps.geometry.spherical.computeDistanceBetween(point, center) <= radius)
}
function findNearMarker(nowLatLng, destinationLatLng) {
	for (var radius = 1, firstNodeToDestination, hereToDestination, stop; radius < 100; radius++) {
		if (stop) break;
		for (var marker = 0; marker < originalPnts[drawFloor].length; marker++) {
			if (pointInCircle({lat: originalPnts[drawFloor][marker].lat, lng: originalPnts[drawFloor][marker].lng}, radius, {lat: nowLatLng.lat, lng: nowLatLng.lng})) {
				firstNodeToDestination = plugin.google.maps.geometry.spherical.computeDistanceBetween({lat: originalPnts[drawFloor][marker].lat, lng: originalPnts[drawFloor][marker].lng}, {lat: destinationLatLng.lat, lng: destinationLatLng.lng});
				hereToDestination = plugin.google.maps.geometry.spherical.computeDistanceBetween({lat: nowLatLng.lat, lng: nowLatLng.lng}, {lat: destinationLatLng.lat, lng: destinationLatLng.lng});
				if (hereToDestination>firstNodeToDestination) {
					stop = true;
					return marker;
				}
			}
		}
	}
}

function editMode() {
	nodeMarkers = [];
	pnts = JSON.parse(JSON.stringify(originalPnts[drawFloor]));
	for (var i = 0; i < pnts.length; i++) {
		map.addMarker({
			position: {
				lat: pnts[i].lat,
				lng: pnts[i].lng
			},
			title: pnts[i].label,
			snippet: '',
			draggable: true
		}, function(marker) {
			nodeMarkers.push(marker);
			marker.off(plugin.google.maps.event.MARKER_DRAG_START);
			marker.off(plugin.google.maps.event.MARKER_DRAG);
			marker.off(plugin.google.maps.event.MARKER_DRAG_END);
			marker.on(plugin.google.maps.event.MARKER_DRAG_START, onMarkerEvents);
			marker.on(plugin.google.maps.event.MARKER_DRAG, onMarkerEvents);
			marker.on(plugin.google.maps.event.MARKER_DRAG_END, onMarkerEvents);
		})
	}
}
var nodeMarkers = [];
function drawIndoorNodeMarkers() {
	if (nodeMarkers.length>0) {
		for (var i = 0; i < nodeMarkers.length; i++) {
			nodeMarkers[i].remove();
		}
		nodeMarkers = [];
	}
	pnts = JSON.parse(JSON.stringify(originalPnts[drawFloor]));
	for (var i = 0; i < pnts.length; i++) {
		if (pnts[i].walkable) {
			map.addMarker({
				position: {
					lat: pnts[i].lat,
					lng: pnts[i].lng
				},
				title: pnts[i].label,
				snippet: String(pnts[i].id)
			}, function(marker) {
				nodeMarkers.push(marker);
				marker.off(plugin.google.maps.event.MARKER_CLICK);
				marker.on(plugin.google.maps.event.MARKER_CLICK, function(latLng) {
					endId = parseInt(this.getSnippet());
					placeInfo =
					{
						text:
						{
							latLng: this.getPosition(),
							title: this.getTitle(),
							snippet: ''
						},
						image: '',
						id: endId
					};
					if (Modeswitch>0) {
						$('#modal-placeInfo')
							.data('place', placeInfo);
					} else {
						$('#modal-placeInfo')
							.data('place', placeInfo)
							.find('.title').text(placeInfo.text.title)
							.end()
							.find('.icon').html('<img src="https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png" class="right circle">')
							.end()
							.find('.address').text('')
							.end()
							.children('.routeList').hide()
							.end()
							.modal('open');
					}
				});
			})
		}
	} //fim marcadores
	function clearAnimation() {
		for (var i = 0; i < markers.length; i++) {
			markers[i].setAnimation(null);
		}
	}
}

var indoorRoute;
function addpnt(pntf1, pntf2) {
	pntf1.proxpnt.push(pntf2);
	addpnt1(pntf2, pntf1);
}
function addpnt1(pntf1, pntf2) {
	pntf1.proxpnt.push(pntf2);
}
var animationCircleInterval;
var drawFloor = floor;
var isFistDraw = true;
var floorStart = false;
function indoorNavigation(p1, p2, p3, callback) {
	if (routeMode==3) {
		pnts = JSON.parse(JSON.stringify(originalPnts[drawFloor]));
	}
	switch (drawFloor) {
		case '1F':
			addpnt(pnts[0], pnts[1]);
			addpnt(pnts[0], pnts[2]);
			addpnt(pnts[1], pnts[2]);
			break;
		case '10F':
			addpnt(pnts[0], pnts[1]);
			addpnt(pnts[1], pnts[4]);
			addpnt(pnts[2], pnts[3]);
			addpnt(pnts[3], pnts[1]);
			addpnt(pnts[4], pnts[5]);
			addpnt(pnts[4], pnts[7]);
			addpnt(pnts[5], pnts[8]);
			addpnt(pnts[6], pnts[5]);
			addpnt(pnts[7], pnts[8]);
			addpnt(pnts[8], pnts[9]);
			addpnt(pnts[9], pnts[11]);
			addpnt(pnts[10], pnts[9]);
			addpnt(pnts[11], pnts[13]);
			addpnt(pnts[12], pnts[11]);
			addpnt(pnts[13], pnts[14]);
			addpnt(pnts[14], pnts[15]);
			addpnt(pnts[15], pnts[3]);
			break;		
	}
	if (indoorRoute) {
		indoorRoute.remove();
	}

	//inserir marcadores no mapa
	var iconBase = 'resources/img/point_black.ico';
	var iconS = 'resources/img/point_red.ico';
	var iconE = 'resources/img/point_green.ico';
	var iconO = 'resources/img/point_no.ico';
	if (p1==undefined) {
		p1 = document.getElementById('formGroupExampleInput').value; //origem
		p2 = document.getElementById('formGroupExampleInput2').value; // destino
		p3 = document.getElementById('formGroupExampleInput3').value; // obstruido		
	}
	if (p1.length == 0 || p2.length == 0) {
		console.log('Deve existir ao menos o ponto incial e final.');
	} else if (p1 < 0 || p1 > 43 || p2 < 0 || p2 > 43 || p3 < 0 || p3 > 43) { //valores fora dos pontos
		console.log('Entradas inválidas. Insira outro valor.');
	} else if (p1 == p2) {
		console.log('室內起點與終點相同');
		return;
	} else if (p1 == p3 || p2 == p3) {
		console.log('Não há como remover esse ponto, escolha outro.');
	} else {
		if (p3.length != 0) {
			caminhodanificado(p3);
		}
		//função danificado para remover pontos e seus vizinhos
		function caminhodanificado(npnt) {
			for (var i = 0; i < pnts[npnt].proxpnt.length; i++) {
				rmvpnt(pnts[npnt].proxpnt[i], pnts[npnt]);
			}
			for (i; i >= 0; i--) {
				pnts[npnt].pop;
			}
		}

		//MelhorTrajeto code
		var MelhorRota = []; //vetor onde será adicionada a MelhorRota encontrada pela funcção
		function rmvpnt(pntf1, pntf2) {
			for (var i = 0; i < pntf1.proxpnt.length; i++) {
				if (pntf1.proxpnt[i].lat == pntf2.lat && pntf1.proxpnt[i].lng == pntf2.lng) {
					pntf1.proxpnt.splice(i, 1);
				}
			}
		}
		var MelhorTrajeto = function(pnt1, pnt2, MelhorRota) {
			for (var i = 0; i < pnts.length; i++) {
				rmvpnt(pnts[i], pnt1);
			}
			if (DistTraj(pnt1, pnt2) == 0) { //verifica se a distância do ponto até o ponto destino, em linha reta, é igual a zero
				//console.log('Distancia do ponto ' + pnt1.id+' até o destino:'+DistTraj(pnt1,pnt2));
				return 0; //se for, então é porque estamos no ponto final
			}
			//console.log('Distancia do ponto ' + pnt1.id + ' até o destino:' +DistTraj(pnt1,pnt2));
			var aux = 1000000;
			var pntaux;
			for (var i = 0; i < pnt1.proxpnt.length; i++) {
				if (aux > DistTraj(pnt1.proxpnt[i], pnt2)) {
					aux = DistTraj(pnt1.proxpnt[i], pnt2); //aux recebe o menor valor
					pntaux = i;
				}
			}
			if (pnt1.proxpnt.length == 0)
				return 1;
			MelhorRota.push({
				id: pnt1.id,
				lat: pnt1.lat,
				lng: pnt1.lng
			});
			MelhorRota.push({
				id: pnt1.proxpnt[pntaux].id,
				lat: pnt1.proxpnt[pntaux].lat,
				lng: pnt1.proxpnt[pntaux].lng
			});


			if (MelhorTrajeto(pnt1.proxpnt[pntaux], pnt2, MelhorRota) == 1) {
				MelhorRota.pop();
				MelhorRota.pop();
				return MelhorTrajeto(pnt1, pnt2, MelhorRota);
			}
			return 0;
		}

		//função que calcula a distâcia entre os dois pontos
		var DistTraj = function(pnt1, pnt2) {
			var deg2rad = 0.017453292519943295; // === Math.PI / 180
			var cos = Math.cos;
			lat1 = pnt1.lat;
			lon1 = pnt1.lng;
			lat2 = pnt2.lat;
			lon2 = pnt2.lng;
			lat1 *= deg2rad;
			lon1 *= deg2rad;
			lat2 *= deg2rad;
			lon2 *= deg2rad;
			var diam = 12742; // Diameter of the earth in km (2 * 6371)
			var dLat = lat2 - lat1;
			var dLon = lon2 - lon1;
			var a = ((1 - cos(dLat)) +
				(1 - cos(dLon)) * cos(lat1) * cos(lat2)
			) / 2;
			return diam * Math.asin(Math.sqrt(a)) * 1000;
		};

		MelhorTrajeto(pnts[p1], pnts[p2], MelhorRota);
		console.log('Initiating Greedy Depth-First Search Pathfinding...');
		//deleta valores duplicados no array para função abaixo
		function squash(arr) {
			var tmp = [];
			for (var i = 0; i < arr.length; i++) {
				if (tmp.indexOf(arr[i].id) == -1) {
					tmp.push(arr[i]);
				}
			}
			return tmp;
		}
		//adicionar rota em uma lista que será mostrada no HTML
		function reapareceDiv() {
			document.getElementById("lista").style.visibility = "visible";
		}
		var MelhorRota2 = squash(MelhorRota);
		if (changeOverlay) {
			changeOverlay = false;
			drawFloor = floor;
		} else {
			var subs = [];
			if (routeMode==3) {
				floorStart = true;
			}
			for (var i = 0, latLng, oldHeading, oldDirection, directionDom, firstPersonHeading, heading, nextLatLng, distance; i < MelhorRota2.length; i++) {
				latLng = {lat: MelhorRota2[i].lat, lng: MelhorRota2[i].lng};
				if (i == (MelhorRota2.length - 1)) {
					floorStart = true;
					switch (drawFloor) {
						case '1F':
							subs[i] = '<li lat="'+latLng.lat+'" lng="'+latLng.lng+'">抵達'+pnts[endId].label+'</li>';
							break;
						case '10F':
							subs[i] = '<li lat="'+latLng.lat+'" lng="'+latLng.lng+'">抵達'+pnts[endId].label+'</li>';
							break;
					}
				} else {
					nextLatLng = {lat: MelhorRota2[i+1].lat, lng: MelhorRota2[i+1].lng};
					heading = plugin.google.maps.geometry.spherical.computeHeading(latLng, nextLatLng);
					if (floorStart) {
						floorStart = false;
						firstPersonHeading = 0;
						oldHeading = heading;
					} else {
						if (MelhorRota2[i].id==MelhorRota2[i+1].id) continue;
						if (oldHeading!==undefined) {
							firstPersonHeading = heading - oldHeading;
							if (firstPersonHeading<-180) {
								firstPersonHeading = -(heading+oldHeading);
							}
							if (firstPersonHeading>180) {
								firstPersonHeading = heading+oldHeading;
							}
							oldHeading = heading;
						} else {
							oldHeading = 0;
							firstPersonHeading = heading;
						}
					}
					distance = plugin.google.maps.geometry.spherical.computeDistanceBetween(latLng, nextLatLng);
					distance = Math.round(distance)+' 公尺';
					if (firstPersonHeading>=-30 && firstPersonHeading<30) {
						if (oldDirection=='向前走') continue;
						oldDirection = '向前走';
						directionDom = '<li lat="'+latLng.lat+'" lng="'+latLng.lng+'" distance="'+distance+'">'+oldDirection+'</li>'
					} else if (firstPersonHeading>=30 && firstPersonHeading<60) {
						oldDirection = '向右前方走';
						directionDom = '<li lat="'+latLng.lat+'" lng="'+latLng.lng+'" distance="'+distance+'">'+oldDirection+'</li>'
					} else if (firstPersonHeading>=60 && firstPersonHeading<120) {
						oldDirection = '向右轉';
						directionDom = '<li lat="'+latLng.lat+'" lng="'+latLng.lng+'" distance="'+distance+'">'+oldDirection+'</li>'
					} else if (firstPersonHeading>=120 && firstPersonHeading<150) {
						oldDirection = '向右後方走';
						directionDom = '<li lat="'+latLng.lat+'" lng="'+latLng.lng+'" distance="'+distance+'">'+oldDirection+'</li>'
					} else if (firstPersonHeading>=150 || firstPersonHeading<-150) {
						oldDirection = '向後走';
						directionDom = '<li lat="'+latLng.lat+'" lng="'+latLng.lng+'" distance="'+distance+'">'+oldDirection+'</li>'
					} else if (firstPersonHeading>=-150 && firstPersonHeading<-120) {
						oldDirection = '向左後方走';
						directionDom = '<li lat="'+latLng.lat+'" lng="'+latLng.lng+'" distance="'+distance+'">'+oldDirection+'</li>'
					} else if (firstPersonHeading>=-120 && firstPersonHeading<-60) {
						oldDirection = '向左轉';
						directionDom = '<li lat="'+latLng.lat+'" lng="'+latLng.lng+'" distance="'+distance+'">'+oldDirection+'</li>'
					} else if (firstPersonHeading>=-60 && firstPersonHeading<-30) {
						oldDirection = '向左前方走';
						directionDom = '<li lat="'+latLng.lat+'" lng="'+latLng.lng+'" distance="'+distance+'">'+oldDirection+'</li>'
					}
					subs[i] = directionDom;
					console.log(MelhorRota2[i].id+' to '+MelhorRota2[i+1].id+' heading '+heading+' fp '+firstPersonHeading+' text '+oldDirection);
				}
			}
			var target = $('#modal-placeInfo>.routeList');
			if (routeMode==0) {
				target.html(subs.join(''));
			} else {
				var floorIndex = allFloor.indexOf(drawFloor);
				if (isFistDraw && routeMode>3) {
					target.html(subs.join(''));
				} else {
					target.append(subs.join(''));
				}
				switch (routeMode) {
					case 2:
						if (floorIndex>0) {
							drawFloor = allFloor[floorIndex-1];
							drawnIndoorNavigationPath(endId, callback);
							if (isFistDraw) {
								isFistDraw = false;
							} else {
								return;
							}
						} else {
							isFistDraw = true;
							drawFloor = floor;
							if (callback) callback();
							return;
						}
						break;
					case 3:
						if (floorIndex<allFloor.length) {
							if (floorIndex==0) {
								isFistDraw = true;
							}
							if (floorIndex<allFloor.length-1) {
								drawFloor = allFloor[floorIndex+1];
								if (allFloor.length-1==floorIndex+1) {
									endId = target.parent().data('place').id;
								} else {
									var targetFloor = originalPnts[allFloor[floorIndex]];
									var targetFloorEndId = targetFloor[targetFloor.length-1].id;
									endId = targetFloorEndId;
								}
								indoorNavigation(String(0), String(endId), '', callback);
							}
							if (isFistDraw) {
								isFistDraw = false;
							} else {
								return;
							}
						} else {
							drawFloor = floor;
							if (callback) callback();
							return;
						}
						break;
				}
			}
		}
		reapareceDiv();
		//fim adicionar rota no HTML
		//fim Melhor trajeto code

		// var lineSymbol = {
		// 	path: google.maps.SymbolPath.CIRCLE,
		// 	scale: 8,
		// 	strokeColor: '#393'
		// };
		// function animateCircle(line) {
		// 	var count = 0;
		// 	if (animationCircleInterval) {
		// 		clearInterval(animationCircleInterval);
		// 	}
		// 	animationCircleInterval = window.setInterval(function() {
		// 		count = (count + 1) % 200;

		// 		var icons = line.get('icons');
		// 		icons[0].offset = (count / 2) + '%';
		// 		line.set('icons', icons);
		// 	}, 20);
		// }
		//DesenhaRota no mapa code
		// indoorRoute = new google.maps.Polyline({
		// 	path: MelhorRota,
		// 	icons: [{
		// 		icon: lineSymbol,
		// 		offset: '100%'
		// 	}],
		// 	geodesic: true,
		// 	strokeColor: 'green',
		// 	strokeOpacity: 1,
		// 	strokeWeight: 2
		// });
		// indoorRoute.setMap(map);
		// animateCircle(indoorRoute);
		map.addPolyline({
			points: MelhorRota,
			color: 'green',
			width: 5,
			geodesic: true
		}, function(polyline) {
			indoorRoute = polyline;
		});
	}
	console.log('Finished Greedy Depth-First Search Pathfinding successfully.');
} //fim mapa calculo