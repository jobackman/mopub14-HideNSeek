window.peopleList=[];
window.personNum=0;


function initialize() {
	var mapOptions = {
	  center: new google.maps.LatLng(59.346630, 18.072056),
	  zoom: 8
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"),
	    mapOptions);
	

}
function checkAlias(){
	var helper = new CBHelper("benchpress", "37ff338f77e39490bad736e64bdd5839", new GenericHelper());
	helper.setPassword(hex_md5("mopub_14"));
if ($("#alias").val().length != 0){
	
	
	helper.searchDocuments(
		{"alias":$("#alias").val()}, "people", function(resp){
			
			
			if(resp.callStatus && resp.outputData.length==0){
				addPerson($("#alias").val());
			}
			else{
				alert("Alias is already taken")
			}
		
		});
}else{
	alert("You have to pick an alias!");
}	
}



function addPerson(alias){

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
			"lng_coords" : position.coords.longitude,
			"alias" : alias
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
				
				console.log("ska lägga till");
				helper.searchDocuments(
					null, "people", function(resp){
						var k=0; // En variabel som ökar vid varje "distanserad bänk"
						for (var i=0; i<resp.outputData.length; i++){
							if(resp.outputData[i].length==0){
								k=k+1;
								console.log("tom")
							}else{
								var person = new google.maps.LatLng(resp.outputData[k].lat_coords, resp.outputData[k].lng_coords);
								
								if (getDistance(user,person)>30){ //Ska vi köra tio meter?
									k=k+1;
								}
							}
						}
						if(k == resp.outputData.length){
							add(dataObject);
						}
						else{
							alert("You are too close to another player, MOVE!")
						}
					});
				
				};
		function add(dataObject){
			helper.insertDocument("people", dataObject, null, function(resp) {
				document.location.href="#page-hidden";
			});
			};  
	}
};
function deletePerson() {
	var helper = new CBHelper("benchpress", "37ff338f77e39490bad736e64bdd5839", new GenericHelper());
	helper.setPassword(hex_md5("mopub_14"));
	console.log("ska ta bort ....");
	new_object={};
	helper.updateDocument(new_object, {"alias":$("#alias").val()}, "people",null, function(resp){
	
			alert("Removed");
		});
}
function resize(dist) {
	var size=(100/(1+dist*0.1));
	console.log(size);
	if (size < 10){
		size = 10;
	}
	$("#arrow").css({ 
		'width' : size+'%',
		'height' : size+'%'
	
	/*	'-webkit-transform': 'resize('+degrees+'deg)',
		'-moz-transform': 'resize('+degrees+'deg)',
		'-o-transform': 'resize('+degrees+'deg)',
		'-ms-transform': 'resize('+degrees+'deg)',
		'transform': 'resize('+degrees+'deg)' */
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
			null, "people", function(resp){
				var k=0;
			for (var i = 0; i < resp.outputData.length; i++){
				if(resp.outputData[i].length==0){
					console.log("tom")
				}else{
				var person_LatLng = new google.maps.LatLng(resp.outputData[i].lat_coords, resp.outputData[i].lng_coords);
				var dist = getDistanceBetween(my_LatLng, person_LatLng);
				window.peopleList[k]={"distance":dist, "lat_coords":resp.outputData[i].lat_coords,"lng_coords":resp.outputData[i].lng_coords, "my_LatLng":my_LatLng, "person_LatLng":person_LatLng};				
				k=k+1;//En list int
				}
			}			
				//$("#distance").html(window.peopleList[window.personNum].distance.toFixed(2));
				resize(window.peopleList[window.personNum].distance.toFixed(2));
			
			}
		);
	}	
}
function newPerson(){
	if(window.personNum<parseInt(window.peopleList.length-1)){
		
		window.personNum=window.personNum+1;

		$("#distance").html(window.peopleList[window.personNum].distance.toFixed(2));

		resize(window.peopleList[window.personNum].distance.toFixed(2));
	}
	else{
		alert("Inga fler gömda");
	}
};
function oldPerson(){
	if(window.personNum!=0){
		window.personNum=window.personNum-1;
		$("#distance").html(window.peopleList[window.personNum].distance.toFixed(2));	
		resize(window.peopleList[window.personNum].distance.toFixed(2));
		
	}else{
		alert("Swipe:a inte, det finns inga fler!")
	}	
};