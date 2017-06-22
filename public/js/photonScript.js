// This function post all the request to the Spark server. It will return the
// 'return_value' of the server response;
function postToServer(func, argument) {
  //This photon id belongs to the last one. And the access_token belongs to the user 'badassphoton@gmail.com'
  var postUrl = 'http://localhost:8080/v1/devices/2f0046000547343233323032/' + func + '?access_token=3f902ab40e940991ae3e3763b00aeb0417b99114';

  //var postUrl = 'http://localhost:8080/v1/devices/28002d000647343339373536/' + func + '?access_token=fa9ceffbb279f591305221e3ba8f0273a46083cf';
  //var postUrl = 'http://192.168.2.3:8080/v1/devices/28002d000647343339373536/' + func + '?access_token=5eefa91a0205cf41e2a132cb0dd7a77d32f390bf';

  //Note that the server response object is like the following example:
  // {
  // "id": "2f0046000547343233323032",
  // "name": null,
  // "last_app": null,
  // "connected": true,
  // "return_value": 2
  // }
  var response = $.ajax({
    url: postUrl,
    type: 'post',
    dataType: 'json',
    data: {
      args: argument
    },
    success: function(data) {
      //console.log("Server response: " + data.return_value);
      //return data.return_value;
    },
    error: function(data) {
      //console.log("Server Error!");
      //return -10;
    }
  });
  return response;
}

// This function manage all the get request to the Spark server. It will return the
// 'result' of the server response.
function getFromServer(variableName){
  //This photon id belongs to the last one. And the access_token belongs to the user 'badassphoton@gmail.com'
  var postUrl = 'http://localhost:8080/v1/devices/2f0046000547343233323032/' + variableName + '?access_token=3f902ab40e940991ae3e3763b00aeb0417b99114';

  //var postUrl = 'http://localhost:8080/v1/devices/28002d000647343339373536/' + func + '?access_token=fa9ceffbb279f591305221e3ba8f0273a46083cf';
  //var postUrl = 'http://192.168.2.3:8080/v1/devices/28002d000647343339373536/' + func + '?access_token=5eefa91a0205cf41e2a132cb0dd7a77d32f390bf';

  //Note that the server response object is like the following example:
  // {
  // "cmd": "VarReturn",
  // "name": "alarmTrigger",
  // "result": false,
  // "coreInfo": {
  //   "connected": true
  //    }
  // }
  var response = $.ajax({
    url: postUrl,
    type: 'get',
    success: function(data) {
      //console.log("Server response: " + data.return_value);
      //return data.return_value;
    },
    error: function(data) {
      //console.log("Server Error!");
      //return -10;
    }
  });
  return response;
}

function turnOutdoorsLightsOn() {
  var func = "dicroica";
  postToServer(func, "OUTDOORS-TURNON")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == 2){
        loadAllButtonsLights();
      }
      else{
        Materialize.toast("An error occurred, please try later.", 5000);
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function turnOutdoorsLightsOff() {
  var func = "dicroica";
  postToServer(func, "OUTDOORS-TURNOFF")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == 1){
        loadAllButtonsLights();
      }
      else{
        Materialize.toast("An error occurred, please try later.", 5000);
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function turnIndoorsLightsOn() {
  var func = "dicroica";
  postToServer(func, "INDOORS-TURNON")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == 5){
        loadAllButtonsLights();
      }
      else{
        Materialize.toast("An error occurred, please try later.", 5000);
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function turnIndoorsLightsOff() {
  var func = "dicroica";
  postToServer(func, "INDOORS-TURNOFF")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == 4){
        loadAllButtonsLights();
      }
      else{
        Materialize.toast("An error occurred, please try later.", 5000);
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function changeOutdoorsLightsIntensity() {
  var func = "dicroica";
  var intensity = document.getElementById("outdoorIntensity").value;
  postToServer(func, "OUTDOORS-SETINTENSITY-" + intensity)
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == 3){
        loadAllButtonsLights();
      }
      else{
        Materialize.toast("An error occurred, please try later.", 5000);
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function changeIndoorsLightsIntensity() {
  var func = "dicroica";
  var intensity = document.getElementById("indoorIntensity").value;
  postToServer(func, "INDOORS-SETINTENSITY-" + intensity)
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == 6){
        loadAllButtonsLights();
      }
      else{
        Materialize.toast("An error occurred, please try later.", 5000);
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function enableLightSensor() {
  var func = "setValues";
  postToServer(func, "ENABLELIGHTSENSOR-TRUE")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == 1){
        document.getElementById("enableLightSensor").disabled = true;
        document.getElementById("disableLightSensor").disabled = false;
      }
      else{
        Materialize.toast("An error occurred, please try later.", 5000);
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function disableLightSensor() {
  var func = "setValues";
  postToServer(func, "ENABLELIGHTSENSOR-FALSE")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == 2){
        document.getElementById("disableLightSensor").disabled = true;
        document.getElementById("enableLightSensor").disabled = false;
      }
      else{
        Materialize.toast("An error occurred, please try later.", 5000);
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function enableMovemmentSensor() {
  var func = "setValues";
  postToServer(func, "ENABLEMOVEMENTSENSOR-TRUE")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == 3){
        document.getElementById("enableMovemmentSensor").disabled = true;
        document.getElementById("disableMovemmentSensor").disabled = false;
      }
      else{
        Materialize.toast("An error occurred, please try later.", 5000);
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function disableMovemmentSensor() {
  var func = "setValues";
  postToServer(func, "ENABLEMOVEMENTSENSOR-FALSE")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == 4){
        document.getElementById("disableMovemmentSensor").disabled = true;
        document.getElementById("enableMovemmentSensor").disabled = false;
      }
      else{
        Materialize.toast("An error occurred, please try later.", 5000);
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function showPasswordFieldToActivate(){
  document.getElementById("passwordFieldToActivate").hidden = false;
}

function showPasswordFieldToDesactivate(){
  document.getElementById("passwordFieldToDesactivate").hidden = false;
}

function activateAlarm(){
  var func = "setValues";
  var password = document.getElementById("inputPasswordActivate");
  //console.log("ALARMACTIVE-TRUE-" + password.value);

  postToServer(func, "ALARMACTIVE-TRUE-" + password.value)
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == 5){
        Materialize.toast("Alarm Activate", 3000, 'green');
        document.getElementById("activateAlarmBtn").disabled = true;
        document.getElementById("desactivateAlarmBtn").disabled = false;
        document.getElementById("inputPasswordActivate").value = "";
        document.getElementById("passwordFieldToActivate").hidden = true;

      }
      else if (response.return_value == -2) {
        Materialize.toast("Wrong Password", 3000, 'red');
        document.getElementById("inputPasswordActivate").value = "";
      }
      else{
        Materialize.toast("An error occurred, please try later.", 5000);
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });

}

function desactivateAlarm(){
  var func = "setValues";
  var password = document.getElementById("inputPasswordDesactivate");

  postToServer(func, "ALARMACTIVE-FALSE-" + password.value)
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == 6){
        Materialize.toast("Alarm Desactivate", 3000, 'green');
        document.getElementById("activateAlarmBtn").disabled = false;
        document.getElementById("desactivateAlarmBtn").disabled = true;
        document.getElementById("inputPasswordDesactivate").value = "";
        document.getElementById("passwordFieldToDesactivate").hidden = true;
      }
      else if (response.return_value == -3) {
        Materialize.toast("Wrong Password", 3000, 'red');
        document.getElementById("inputPasswordDesactivate").value = "";
      }
      else{
        Materialize.toast("An error occurred, please try later.", 5000);
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });

}

// function testing(){
//   var deviceID = "2f0046000547343233323032";
//   var accessToken = "3f902ab40e940991ae3e3763b00aeb0417b99114";
//   var eventSource = new EventSource("http://localhost:8080/v1/devices/" + deviceID + "/events/?access_token=" + accessToken);
//
//
//   eventSource.addEventListener('open', function(e) {
//            console.log("Opened!"); },false);
//
//   eventSource.addEventListener('error', function(e) {
//            console.log("Errored!"); },false);
//
//   eventSource.addEventListener('event', function(e) {
//     console.log("Enter!!! :->");
//     var data = JSON.parse(e.data);
//     console.log("Core Id: " + data.coreid);
//   },false);
// }

// This function is used to load all the current buttons states (active or
// disabled) of the light page.
function loadAllButtonsLights(){

  // Load the buttons related with the indoorLight.
  getFromServer("indoorLight")
  .then(function(response){
      console.log("server response: " + response.result);
      if (response.result >=0) {
        if(response.result == 0){
          document.getElementById("turnIndoorsOn").disabled = false;
          document.getElementById("turnIndoorsOff").disabled = true;
        }
        else {
          document.getElementById("turnIndoorsOn").disabled = true;
          document.getElementById("turnIndoorsOff").disabled = false;
        }
        document.getElementById("indoorIntensity").value= response.result;
      }
      else {
        Materialize.toast("An error occurred on the server, please try later.", 5000);
      }
  })
  .catch(function(error){
      //Materialize.toast("An error occurred on the server, please try later.", 5000);
      console.log(error);
  });

  // Load the buttons related with the outdoorLight.
  getFromServer("outdoorLight")
  .then(function(response){
      console.log("server response: " + response.result);
      if(response.result >= 0){
        if(response.result == 0){
          document.getElementById("turnOutdoorsOn").disabled = false;
          document.getElementById("turnOutdoorsOff").disabled = true;
        }
        else{
          document.getElementById("turnOutdoorsOn").disabled = true;
          document.getElementById("turnOutdoorsOff").disabled = false;
        }
        document.getElementById("outdoorIntensity").value= response.result;
      }
      else {
        Materialize.toast("An error occurred on the server, please try later.", 5000);
      }
  })
  .catch(function(error){
      //Materialize.toast("An error occurred on the server, please try later.", 5000);
      console.log(error);
  });

  // Load the buttons related with the lightSensor.
  getFromServer("prEnable")
  .then(function(response){
      console.log("server response: " + response.result);
      if(response.result == true){
        document.getElementById("enableLightSensor").disabled = true;
        document.getElementById("disableLightSensor").disabled = false;
      }
      else{
        document.getElementById("enableLightSensor").disabled = false;
        document.getElementById("disableLightSensor").disabled = true;
      }
  })
  .catch(function(error){
      //Materialize.toast("An error occurred on the server, please try later.", 5000);
      console.log(error);
  });

  // Load the buttons related with the movemmentSensor.
  getFromServer("mvEnable")
  .then(function(response){
      console.log("server response: " + response.result);
      if(response.result == true){
        document.getElementById("enableMovemmentSensor").disabled = true;
        document.getElementById("disableMovemmentSensor").disabled = false;
      }
      else{
        document.getElementById("enableMovemmentSensor").disabled = false;
        document.getElementById("disableMovemmentSensor").disabled = true;
      }
  })
  .catch(function(error){
      //Materialize.toast("An error occurred on the server, please try later.", 5000);
      console.log(error);
  });

}

// This function is used to load all the current buttons states (active or
// disabled) of the alarm page.
function loadAllButtonsAlarm(){

  // Load the buttons related with the alarm.
  getFromServer("alarmActive")
  .then(function(response){
      console.log("server response: " + response.result);
      if(response.result == true){
        document.getElementById("activateAlarmBtn").disabled = true;
        document.getElementById("desactivateAlarmBtn").disabled = false;
      }
      else{
        document.getElementById("activateAlarmBtn").disabled = false;
        document.getElementById("desactivateAlarmBtn").disabled = true;
      }
  })
  .catch(function(error){
      //Materialize.toast("An error occurred on the server, please try later.", 5000);
      console.log(error);
  });
}
