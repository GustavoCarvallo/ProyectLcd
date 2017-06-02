var led_on = false;

function postToServer(func, argument){
//var postUrl = 'https://api.particle.io/v1/devices/28002d000647343339373536/' + func + '?access_token=2b28691b3f97329e5ef8385402bcb972a6d6f592';
var postUrl = 'http://192.168.2.2:8080/v1/devices/28002d000647343339373536/' + func + '?access_token=5eefa91a0205cf41e2a132cb0dd7a77d32f390bf';
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

function turnLedOn(){
	var func = "TurnLed";
	postToServer(func, "ON");	
}
function turnLedOff(){
	var func = "TurnLed";
	postToServer(func, "OFF");
}