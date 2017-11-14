// This function post all the request to the Spark server. It will return the
// 'return_value' of the server response;
function postToServer(func, argument) {
  //This photon id belongs to the last one. And the access_token belongs to the user 'badassphoton@gmail.com' server running on laptop.
  //var postUrl = 'http://localhost:8080/v1/devices/2f0046000547343233323032/' + func + '?access_token=3f902ab40e940991ae3e3763b00aeb0417b99114';

  //This photon id belongs to the last one. And the access_token belongs to the user 'raspberrypi@gmail.com' server running on Raspberry Pi.
  var postUrl = 'http://192.168.2.25:8080/v1/devices/2f0046000547343233323032/' + func + '?access_token=bf21dd7226278a6c5d3c5f16cb2db00590fc81e7';

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
  //This photon id belongs to the last one. And the access_token belongs to the user 'badassphoton@gmail.com' server running on laptop.
  var postUrl = 'http://localhost:8080/v1/devices/2f0046000547343233323032/' + variableName + '?access_token=3f902ab40e940991ae3e3763b00aeb0417b99114';

  //This photon id belongs to the last one. And the access_token belongs to the user 'raspberrypi@gmail.com' server running on Raspberry Pi.
  //var postUrl = 'http://192.168.2.2:8080/v1/devices/2f0046000547343233323032/' + variableName + '?access_token=bf21dd7226278a6c5d3c5f16cb2db00590fc81e7';

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

function turnOnLight1() {
  var func = "light";
  postToServer(func, "LIGHT-1-TURNON")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == -1){
        Materialize.toast("An error occurred, please try later.", 5000);
      }
      else{
        logEvent("Light 1 turned on.");
        loadAllButtonsLights();
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function turnOffLight1() {
  var func = "light";
  postToServer(func, "LIGHT-1-TURNOFF")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == -1){
        Materialize.toast("An error occurred, please try later.", 5000);
      }
      else{
        logEvent("Light 1 turned off.");
        loadAllButtonsLights();
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function turnOnLight2() {
  var func = "light";
  postToServer(func, "LIGHT-2-TURNON")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == -1){
        Materialize.toast("An error occurred, please try later.", 5000);
      }
      else{
        logEvent("Light 2 turned on.");
        loadAllButtonsLights();
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function turnOffLight2() {
  var func = "light";
  postToServer(func, "LIGHT-2-TURNOFF")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == -1){
        Materialize.toast("An error occurred, please try later.", 5000);
      }
      else{
        logEvent("Light 2 turned off.");
        loadAllButtonsLights();
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function changeLight1Intensity() {
  var func = "light";
  var intensity = document.getElementById("light1Intensity").value;
  postToServer(func, "LIGHT-1-SETINTENSITY-" + intensity)
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == -1){
        Materialize.toast("An error occurred, please try later.", 5000);
      }
      else{
        var eventToLog = "Light 1 has change intensity to: " + intensity;
        logEvent(eventToLog);
        loadAllButtonsLights();
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function changeLight2Intensity() {
  var func = "light";
  var intensity = document.getElementById("light2Intensity").value;
  postToServer(func, "LIGHT-2-SETINTENSITY-" + intensity)
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == -1){
        Materialize.toast("An error occurred, please try later.", 5000);
      }
      else{
        var eventToLog = "Light 2 has change intensity to: " + intensity;
        logEvent(eventToLog);
        loadAllButtonsLights();
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
        logEvent("Light sensor enabled.");
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
        logEvent("Light sensor disabled.");
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
        logEvent("Movemment sensor enabled.");
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
        logEvent("Movemment sensor disabled.");
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
        logEvent("Alarm activate.");
        Materialize.toast("Alarm Activate", 3000, 'green');
        document.getElementById("activateAlarmBtn").disabled = true;
        document.getElementById("desactivateAlarmBtn").disabled = false;
        document.getElementById("inputPasswordActivate").value = "";
        document.getElementById("passwordFieldToActivate").hidden = true;
        document.getElementById("checkStatusBtnContainer").hidden = false;
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
        logEvent("Alarm desactivate.");
        Materialize.toast("Alarm Desactivate", 3000, 'green');
        document.getElementById("activateAlarmBtn").disabled = false;
        document.getElementById("desactivateAlarmBtn").disabled = true;
        document.getElementById("inputPasswordDesactivate").value = "";
        document.getElementById("passwordFieldToDesactivate").hidden = true;
        document.getElementById("checkStatusBtnContainer").hidden = true;
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

function checkStatus(){
  getVar("alarmTrigger").then(function(result){
    var alarmTrigger = result;
    if(alarmTrigger >= 0){
      if(alarmTrigger == 1){
        var $toastContent = $('<h4> Alarm was trigger</h4>');
        Materialize.toast($toastContent, 3000, 'green');
      }
      else {
        var $toastContent = $('<h4> Alarm was not trigger</h4>');
        Materialize.toast($toastContent, 3000, 'red');
      }
    }
    else {
      console.log("Wrong command when asking for a var at getVar()");
      Materialize.toast("An error occurred on the server, please try later.", 5000);
    }
  }, function(error){
    Materialize.toast("An error occurred on the server, please try later.", 5000);
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

  // Load the buttons related with the Light 1.
  getVar("light1").then(function(result){
    var light1 = result;
    if(light1 >= 0){
      if(light1 == 0){
        document.getElementById("turnLight1On").disabled = false;
        document.getElementById("turnLight1Off").disabled = true;
      }
      else {
        document.getElementById("turnLight1On").disabled = true;
        document.getElementById("turnLight1Off").disabled = false;
      }
      document.getElementById("light1Intensity").value = light1;
    }
    else {
      console.log("Wrong command when asking for a var at getVar()");
      Materialize.toast("An error occurred on the server, please try later.", 5000);
    }
  }, function(error){
    Materialize.toast("An error occurred on the server, please try later.", 5000);
  });

  // Load the buttons related with the Light 2.
  getVar("light2").then(function(result){
    var light2 = result;
    if(light2 >= 0){
      if(light2 == 0){
        document.getElementById("turnLight2On").disabled = false;
        document.getElementById("turnLight2Off").disabled = true;
      }
      else {
        document.getElementById("turnLight2On").disabled = true;
        document.getElementById("turnLight2Off").disabled = false;
      }
      document.getElementById("light2Intensity").value = light2;
    }
    else {
      console.log("Wrong command when asking for a var at getVar()");
      Materialize.toast("An error occurred on the server, please try later.", 5000);
    }
  }, function(error){
    Materialize.toast("An error occurred on the server, please try later.", 5000);
  });


  // Load the buttons related with the lightSensor.
  getVar("enablePhotoresistor").then(function(result){
    var enablePhotoresistor = result;
    if(enablePhotoresistor >= 0){
      if(enablePhotoresistor == 1){
        document.getElementById("enableLightSensor").disabled = true;
        document.getElementById("disableLightSensor").disabled = false;
      }
      else {
        document.getElementById("enableLightSensor").disabled = false;
        document.getElementById("disableLightSensor").disabled = true;
      }
    }
    else {
      console.log("Wrong command when asking for a var at getVar()");
      Materialize.toast("An error occurred on the server, please try later.", 5000);
    }
  }, function(error){
    Materialize.toast("An error occurred on the server, please try later.", 5000);
  });

  // Load the buttons related with the movemmentSensor.
  getVar("enableMovementSensorToTurnLights").then(function(result){
    var enableMovementSensorToTurnLights = result;
    if(enableMovementSensorToTurnLights >= 0){
      if(enableMovementSensorToTurnLights == 1){
        document.getElementById("enableMovemmentSensor").disabled = true;
        document.getElementById("disableMovemmentSensor").disabled = false;
      }
      else {
        document.getElementById("enableMovemmentSensor").disabled = false;
        document.getElementById("disableMovemmentSensor").disabled = true;
      }
    }
    else {
      console.log("Wrong command when asking for a var at getVar()");
      Materialize.toast("An error occurred on the server, please try later.", 5000);
    }
  }, function(error){
    Materialize.toast("An error occurred on the server, please try later.", 5000);
  });
}

// This function is used to load all the current buttons states (active or
// disabled) of the alarm page.
function loadAllButtonsAlarm(){
  // Load the buttons related with the alarm.
  getVar("alarmActive").then(function(result){
    var alarmActive = result;
    if(alarmActive >= 0){
      if(alarmActive == 1){
        document.getElementById("activateAlarmBtn").disabled = true;
        document.getElementById("desactivateAlarmBtn").disabled = false;
        document.getElementById("checkStatusBtnContainer").hidden = false;
      }
      else {
        document.getElementById("activateAlarmBtn").disabled = false;
        document.getElementById("desactivateAlarmBtn").disabled = true;
        document.getElementById("checkStatusBtnContainer").hidden = true;
      }
    }
    else {
      console.log("Wrong command when asking for a var at getVar()");
      Materialize.toast("An error occurred on the server, please try later.", 5000);
    }
  }, function(error){
    Materialize.toast("An error occurred on the server, please try later.", 5000);
  });
}

function loadAllClimateButtons() {
  getVar("fanOn").then(function(result){
    if(result == 0){
      document.getElementById("turnOnCoolBtn").disabled = false;
      document.getElementById("turnOffCoolBtn").disabled = true;
    }
    else if(result == 1) {
      document.getElementById("turnOnCoolBtn").disabled = true;
      document.getElementById("turnOffCoolBtn").disabled = false;
    }
    else {
      console.log("Wrong command when asking for a var at getVar()");
      Materialize.toast("An error occurred on the server, please try later.", 5000);
    }
  }, function(error){
    Materialize.toast("An error occurred on the server, please try later.", 5000);
  });

  getVar("heatingOn").then(function(result){
    if(result == 0){
      document.getElementById("turnOnHeatBtn").disabled = false;
      document.getElementById("turnOffHeatBtn").disabled = true;
    }
    else if(result == 1) {
      document.getElementById("turnOnHeatBtn").disabled = true;
      document.getElementById("turnOffHeatBtn").disabled = false;
    }
    else {
      console.log("Wrong command when asking for a var at getVar()");
      Materialize.toast("An error occurred on the server, please try later.", 5000);
    }
  }, function(error){
    Materialize.toast("An error occurred on the server, please try later.", 5000);
  });

  getVar("autoClimateControlOn").then(function(result){
    if(result == 0){
      document.getElementById("turnOffAutoClimateBtn").disabled = true;
    }
    else if(result == 1) {
      document.getElementById("turnOffAutoClimateBtn").disabled = false;
      document.getElementById("turnOnCoolBtn").disabled = true;
      document.getElementById("turnOffCoolBtn").disabled = true;
      document.getElementById("turnOnHeatBtn").disabled = true;
      document.getElementById("turnOffHeatBtn").disabled = true;

      //Load the current auto climate control temperature inside the inputTemp.
      getVar("autoClimateControlTemperature").then(function(result){
        if(result != -100){   //-100 is an error code.
          document.getElementById("inputTemp").value = result;
        }
        else {
          console.log("Wrong command when asking for a var at getVar()");
          Materialize.toast("An error occurred on the server, please try later.", 5000);
        }
      }, function(error){
        console.log("Wrong command when asking for a var at getVar()");
        Materialize.toast("An error occurred on the server, please try later.", 5000);
      });
    }
    else {
      console.log("Wrong command when asking for a var at getVar()");
      Materialize.toast("An error occurred on the server, please try later.", 5000);
    }
  }, function(error){
    Materialize.toast("An error occurred on the server, please try later.", 5000);
  });

  checkTemperature();
}

//This function checks the current temperature.
function checkTemperature() {
  getVar("temperature").then(function(result){
    var temperature = result;
    if(temperature != -100){ //-100 is an error code.
      var content = "<h4>" + temperature + "°C</h4>"
      document.getElementById("temperatureVal").innerHTML = content;
    }
    else {
      console.log("Wrong command when asking for a var at getVar()");
      Materialize.toast("An error occurred on the server, please try later.", 5000);
    }
  }, function(error){
    Materialize.toast("An error occurred on the server, please try later.", 5000);
  });
}

function turnOnHeat() {
  var func = "climate";
  postToServer(func, "HEATING-TURNON")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == -1){
        Materialize.toast("An error occurred, please try later.", 5000);
      }
      else{
        logEvent("Heat turned on.");
        loadAllClimateButtons();
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function turnOffHeat() {
  var func = "climate";
  postToServer(func, "HEATING-TURNOFF")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == -1){
        Materialize.toast("An error occurred, please try later.", 5000);
      }
      else{
        logEvent("Heat turned off.");
        loadAllClimateButtons();
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function turnOnCool() {
  var func = "climate";
  postToServer(func, "FAN-TURNON")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == -1){
        Materialize.toast("An error occurred, please try later.", 5000);
      }
      else{
        logEvent("Cool turned on.");
        loadAllClimateButtons();
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function turnOffCool() {
  var func = "climate";
  postToServer(func, "FAN-TURNOFF")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == -1){
        Materialize.toast("An error occurred, please try later.", 5000);
      }
      else{
        logEvent("Cool turned off.");
        loadAllClimateButtons();
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function setAutoClimate() {
  var func = "climate";
  var temperatureSeleted = document.getElementById("inputTemp").value;
  postToServer(func, "AUTOCLIMATECONTROL-ON-"+temperatureSeleted)
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == -1){
        Materialize.toast("An error occurred, please try later.", 5000);
      }
      else if(response.return_value == -2){
          Materialize.toast("Error occurred, temperature must be between 18 and 30 degrees.", 5000);
      }
      else{
        var eventToLog = "Auto climate turn on and set to: " + temperatureSeleted + " degrees";
        logEvent(eventToLog);
        loadAllClimateButtons();
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

function turnOffAutoClimate() {
  var func = "climate";
  postToServer(func, "AUTOCLIMATECONTROL-OFF")
  .then(function(response){
      console.log("server response: " + response.return_value);
      if(response.return_value == -1){
        Materialize.toast("An error occurred, please try later.", 5000);
      }
      else{
        logEvent("Auto climate turned off.");
        loadAllClimateButtons();
      }
  })
  .catch(function(error){
      Materialize.toast("An error occurred, please try later.", 5000);
  });
}

//This function returns a var from the server.
function getVar(varName){
  var func = "getVar";
  var promise = new Promise(function(resolve, reject){
    postToServer(func,varName).then(function(response){
      resolve(response.return_value);
    })
    .catch(function(error){
      reject("Error when posting to server.");
    })
  });
  return promise;
}

function logEvent(eventToLog) {
  //var postUrl = "http://192.168.0.5:8081/log"; //Home ip.
  var postUrl = "http://192.168.2.25:8081/log"; //Raspberry pi ip.

  //Object which will be send to the server.
  var obj = {"event" : eventToLog, "date" : new Date().toString()};

  var response = $.ajax({
    url: postUrl,
    type: 'POST',
    contentType: "application/json",
    data: JSON.stringify(obj),
    success: function(data) {
    },
    error: function(data) {
      console.log("Problems when logging events!");
    }
  });
}
