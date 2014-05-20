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


function updateGames() {
var helper = new CBHelper("hns", "31cee8082535fe8efc37f8fcee62bed0", new GenericHelper());
helper.setPassword(hex_md5("mopub_14"));
	$("#activeSeekGames").empty();
	$("#activeHideGames").empty();
	
helper.searchDocuments(
	{"alias": $("#alias").val()}	, "people", function(resp_p){
if(resp_p.callStatus && resp_p.outputData.length==0){
		
		
helper.searchDocuments(
	null, "games", function(resp){
		$("#activeSeekGames").append("<option value='' disabled selected>Game</option>");
		$("#activeHideGames").append("<option value='' disabled selected>Game</option>");
		for (var i = 0; i<resp.outputData.length; i++){
			if(resp.outputData[i].length!=0){
				
			$("#activeSeekGames").append("<option value='"+resp.outputData[i].reference+"'>"+resp.outputData[i].game+"</option>");
			$("#activeHideGames").append("<option value='"+resp.outputData[i].reference+"'>"+resp.outputData[i].game+"</option>");
		}
		}
	});
}else{
	$("#hiddenGame").empty();
	$("#hiddenGame").append("<p>Game:"+resp_p.outputData[0].game+"</p>")
	document.location.href="#page-hidden";
}
});

}

function checkAlias(){
	var helper = new CBHelper("hns", "31cee8082535fe8efc37f8fcee62bed0", new GenericHelper());
	helper.setPassword(hex_md5("mopub_14"));
	if ($("#alias").val().length != 0){
		
		
		helper.searchDocuments(
			{
			"alias":$("#alias").val()}, "people", function(resp){
				
				
				if(resp.callStatus && resp.outputData.length==0){
					addPerson($("#alias").val());
				}
				else{
					alert("Alias is already taken")
				}
			
			});
	}
	else {
			$("#noalias").stop().slideDown(600).delay(1000).slideUp(600);
	
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
 	
  		var helper = new CBHelper("hns", "31cee8082535fe8efc37f8fcee62bed0", new GenericHelper());
		helper.setPassword(hex_md5("mopub_14"));
		

		
		var dataObject = {
			"lat_coords" : position.coords.latitude,
			"lng_coords" : position.coords.longitude,
			"alias" : alias,
			"game": $("#activeHideGames :selected").text()
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
					{"game":$("#activeHideGames :selected").text()}, "people", function(resp){
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
			console.log("ska adda");
			helper.insertDocument("people", dataObject, null, function(resp) {
				document.location.href="#page-hidden";
			});
			};  
	}
};
function deletePerson() {
	var helper = new CBHelper("hns", "31cee8082535fe8efc37f8fcee62bed0", new GenericHelper());
	helper.setPassword(hex_md5("mopub_14"));
	console.log("ska ta bort ....");
	new_object={};
	helper.updateDocument(new_object, {"alias":$("#alias").val()}, "people",null, function(resp){
	
			document.location.href="#home";
		});
}
function resize(dist) {
	var size=(100/(1+dist*0.02));
	console.log(size);
	if (size < 10){
		size = 10;
	}
	$("#arrow").css({ 
		'width' : size+'%',
		'height' : size+'%'
		});
}

function getDistance(){
	var helper = new CBHelper("hns", "31cee8082535fe8efc37f8fcee62bed0", new GenericHelper());
	helper.setPassword(hex_md5("mopub_14"));
	
	if (navigator.geolocation){

    	 var watcher=navigator.geolocation.watchPosition(showPosition);
    }
  	else{
		alert("Geolocation is not supported by this browser.");
  	}

  	function showPosition(position){


	
	
		var my_lat=position.coords.latitude;
		var my_lng=position.coords.longitude;
		var my_LatLng = new google.maps.LatLng(my_lat, my_lng);
		$("#distance").text(my_LatLng);
		
		
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
			{game:$("#activeSeekGames :selected").text()}, "people", function(resp){
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
				if (window.peopleList[0] != undefined){
					resize(window.peopleList[0].distance.toFixed(2));
				}else{
					navigator.geolocation.clearWatch(watcher);
					document.location.href="#home";
					$("#noplayers").stop().slideDown(600).delay(500).slideUp(600);
				}
			
			}
		);
	}	
}

function deleteGame(){
var helper = new CBHelper("hns", "31cee8082535fe8efc37f8fcee62bed0", new GenericHelper());
helper.setPassword(hex_md5("mopub_14"));
new_object={};
helper.updateDocument(new_object, {"game":$("#activeSeekGames :selected").text()}, "games",null, function(resp){
console.log("spelet borttaget");
});

helper.searchDocuments(
	{"game":$("#activeSeekGames :selected").text()}, "people", function(resp){
	for (var i=0; i<resp.outputData.length;i++){
		
		helper.updateDocument(new_object, {"alias":resp.outputData[i].alias}, "people",null, function(resp){
		console.log("spelare borttagen");
		});
	}
	
	});

}



function createGame(){

	var helper = new CBHelper("hns", "31cee8082535fe8efc37f8fcee62bed0", new GenericHelper());
	helper.setPassword(hex_md5("mopub_14"));
	
if ($("#gameName").val().length==0){
	alert("Plesae enter at name,... ffs")
}else{
	helper.searchDocuments(
		{"game":$("#gameName").val()}, "people", function(resp){
			if (resp.outputData.length == 0){
				
				var ref= $("#gameName").val().split(" ");
				var reference;
				for (var i = 0;i<ref.length;i++){
					if (i == 0){
						reference=ref[i];
					}else{
			
					 reference=reference+"_"+ref[i];
					
					}
				}
				game={
					"game":$("#gameName").val(),
					"reference":reference
				}
				
				helper.insertDocument("games", game, null, function(resp) {
					alert("The game is now created");
					document.location.href="#home";
				});
			}
			
		});
			
			
	
}
}
function newPerson(){
	if(window.personNum<parseInt(window.peopleList.length-1)){
		
		
		window.personNum=window.personNum+1;

		$("#distance").html(window.peopleList[window.personNum].distance.toFixed(2));
		
		var prog = 100 * (personNum / peopleList.length  + 1/peopleList.length);
		
		$("#progress").css({
			'width': prog + '%'
		});
		
		$("#pnr").html(1+personNum);
				

		resize(window.peopleList[window.personNum].distance.toFixed(2));
	}
	else{
		$("#msg").stop().slideDown(600).delay(500).slideUp(600);
	}
};
function oldPerson(){
	if(window.personNum!=0){
		window.personNum=window.personNum-1;
		$("#distance").html(window.peopleList[window.personNum].distance.toFixed(2));	
		
		var prog = 100 * (personNum / peopleList.length  + 1 / peopleList.length);
		
		$("#progress").css({
			'width': prog + '%'
		});
		$("#pnr").html(1+personNum);
		
		resize(window.peopleList[window.personNum].distance.toFixed(2));
		
	}else{
		$("#msg").stop().slideDown(600).delay(500).slideUp(600);
	}	
};