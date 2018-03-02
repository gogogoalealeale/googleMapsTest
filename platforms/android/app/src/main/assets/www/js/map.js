var here =
{
	lat: 24.996242,
	lng: 121.462915
};
document.addEventListener("deviceready", function() {
	initMap(here);
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
function initMap(center) {
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
	});
}