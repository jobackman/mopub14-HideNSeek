window.sortedBenches=[];
window.benchNum=0;


function initialize() {
	var mapOptions = {
	  center: new google.maps.LatLng(59.346630, 18.072056),
	  zoom: 8
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"),
	    mapOptions);
	

}




function addBench(){

  if (navigator.geolocation){
  	//console.log(navigator.geolocation);
	
    navigator.geolocation.getCurrentPosition(showPosition);
    }
  else{
	alert("Geolocation is not supported by this browser.");
  	}
  
  	function showPosition(position){
 	
  		var helper = new CBHelper("benchpress", "37ff338f77e39490bad736e64bdd5839", new GenericHelper());
		helper.setPassword(hex_md5("mopub_14"));
		

		
		var dataObject = {
			"lat_coords" : position.coords.latitude,
			"lng_coords" : position.coords.longitude
		};
		
		search(dataObject);
		
		
		function search(dataObject){

				var user = new google.maps.LatLng(dataObject.lat_coords, dataObject.lng_coords);
				var rad = function(x) {
				  return x * Math.PI / 180;
				};
				
				var getDistance = function(p1, p2) {
				  var R = 6378137; // Earth’s mean radius in meter
				  var dLat = rad(p2.lat() - p1.lat());
				  var dLong = rad(p2.lng() - p1.lng());
				  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
				    Math.sin(dLong / 2) * Math.sin(dLong / 2);
				  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				  var d = R * c;
				  return d; // returns the distance in meter
				};
				
				helper.searchDocuments(
					null, "benches", function(resp){
						var k=0; // En variabel som ökar vid varje "distanserad bänk"
						for (var i=0; i<resp.outputData.length; i++){
								var bench = new google.maps.LatLng(resp.outputData[i].lat_coords, resp.outputData[i].lng_coords);
								
								if (getDistance(user,bench)>30){ //Ska vi köra tio meter?
									k=k+1;
								}
						}
						if(k == resp.outputData.length){
							add(dataObject);
						}
						else{
							alert("Bänken har INTE lagts till pga att det finns en redan inlagd bänk i vår databas")
						}
					});
				
				};
		function add(dataObject){
			helper.insertDocument("benches", dataObject, null, function(resp) {
				alert("Banken finns nu i var databas. Tack sa mycket!");
			});
			};  
	}
};

function rotate(degrees) {
	
	$("#arrow").css({ 
		'-webkit-transform': 'rotate('+degrees+'deg)',
		'-moz-transform': 'rotate('+degrees+'deg)',
		'-o-transform': 'rotate('+degrees+'deg)',
		'-ms-transform': 'rotate('+degrees+'deg)',
		'transform': 'rotate('+degrees+'deg)' 
		});
}

function getDistance(){
	var helper = new CBHelper("benchpress", "37ff338f77e39490bad736e64bdd5839", new GenericHelper());
	helper.setPassword(hex_md5("mopub_14"));
	
	if (navigator.geolocation){

    	navigator.geolocation.watchPosition(showPosition);
    }
  	else{
		alert("Geolocation is not supported by this browser.");
  	}

  	function showPosition(position){
	if (window.DeviceOrientationEvent){
	window.addEventListener('deviceorientation', function(eventData) {
	  var dir = eventData.alpha
	$('#testing').text(dir);
	rotate(dir);
	}, false);
	}

	
	
		var my_lat=position.coords.latitude;
		var my_lng=position.coords.longitude;
		var my_LatLng = new google.maps.LatLng(my_lat, my_lng);
		
		
		var rad = function(x) {
		  return x * Math.PI / 180;
		};

		var getDistanceBetween = function(p1, p2) {
		  var R = 6378137; // Earth’s mean radius in meter
		  var dLat = rad(p2.lat() - p1.lat());
		  var dLong = rad(p2.lng() - p1.lng());
		  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
		    Math.sin(dLong / 2) * Math.sin(dLong / 2);
		  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		  var d = R * c;
		  return d; // returns the distance in meter
		};
		
		helper.searchDocuments(
			null, "benches", function(resp){
			for (var i = 0; i < resp.outputData.length; i++){
				var bench_LatLng = new google.maps.LatLng(resp.outputData[i].lat_coords, resp.outputData[i].lng_coords);
				var dist = getDistanceBetween(my_LatLng, bench_LatLng);
				window.sortedBenches[i]={"distance":dist, "lat_coords":resp.outputData[i].lat_coords,"lng_coords":resp.outputData[i].lng_coords, "my_LatLng":my_LatLng, "bench_LatLng":bench_LatLng};
				
				
				
				console.log(heading);
				
			}
				window.sortedBenches.sort(function(a, b){
				    return a.distance - b.distance;
				});
				console.log(window.sortedBenches);
				var heading = google.maps.geometry.spherical.computeHeading(window.sortedBenches[window.benchNum].bench_LatLng,
				      window.sortedBenches[window.benchNum].my_LatLng);
			
				$("#distance").html(window.sortedBenches[window.benchNum].distance.toFixed(2));
				rotate(heading);
			
			}
		);
	}	
}
function newBench(){
	if(window.benchNum<parseInt(window.sortedBenches.length-1)){
		
		window.benchNum=window.benchNum+1;
		var heading = google.maps.geometry.spherical.computeHeading(window.sortedBenches[window.benchNum].bench_LatLng,
		      window.sortedBenches[window.benchNum].my_LatLng);
		$("#distance").html(window.sortedBenches[window.benchNum].distance.toFixed(2));
		alert(heading);
		rotate(heading);
	}
	else{
		alert("No more benches!");
	}
};
function oldBench(){
	if(window.benchNum!=0){
		window.benchNum=window.benchNum-1;
		var heading = google.maps.geometry.spherical.computeHeading(window.sortedBenches[window.benchNum].bench_LatLng,window.sortedBenches[window.benchNum].my_LatLng);
		$("#distance").html(window.sortedBenches[window.benchNum].distance.toFixed(2));	
		rotate(heading);
		alert(heading);	
	}else{
		alert("This is the bench closest to you!")
	}	
};