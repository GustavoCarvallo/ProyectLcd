var led_on = false;

function postToServer(func, argument){
var postUrl = 'http://localhost:8080/v1/devices/28002d000647343339373536/' + func + '?access_token=fa9ceffbb279f591305221e3ba8f0273a46083cf';
//var postUrl = 'http://192.168.2.3:8080/v1/devices/28002d000647343339373536/' + func + '?access_token=5eefa91a0205cf41e2a132cb0dd7a77d32f390bf';
$.ajax({
	url: postUrl,
	type: 'post',
	dataType: 'json',
	data: {args: argument},
	success: function(status){
		console.log("Server response: " + status.title);
	},
	error: function(status){
		console.log("Server response: " + status.title);
	}
});
}

function turnOutdoorsLightsOn(){
	var func = "dicroica";
	postToServer(func, "OUTDOORS-TURNON");	
}
function turnOutdoorsLightsOff(){
	var func = "dicroica";
	postToServer(func, "OUTDOORS-TURNOFF");
}
function turnIndoorsLightsOn(){
	var func = "dicroica";
	postToServer(func, "INDOORS-TURNON");
}
function turnIndoorsLightsOff(){
	var func = "dicroica";
	postToServer(func, "INDOORS-TURNOFF");
}
function changeOutdoorsLightsIntensity(){
	var func = "dicroica";
	postToServer(func, "OUTDOORS-SETINTENSITY-5");
}
function changeIndoorsLightsIntensity(){
	var func = "dicroica";
	postToServer(func, "INDOORS-SETINTENSITY-5");
}
function enableLightSensor(){
	var func = "setValues";
	postToServer(func, "ENABLELIGHTSENSOR-TRUE");
}
function disableLightSensor(){
	var func = "setValues";
	postToServer(func, "ENABLELIGHTSENSOR-FALSE");
}